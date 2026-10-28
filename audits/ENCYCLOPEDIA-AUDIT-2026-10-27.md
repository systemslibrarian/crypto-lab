# Encyclopedia rollout — independent audit (2026-10-27)

Read-only audit of the 48-proposal encyclopedia rollout recorded in `docs/encyclopedia-roadmap.md`
(roadmap revision `64ae547`, "Updated 2026-10-27"). Every claim in that file was written by the
implementing agent and is treated here as a claim to verify, not as evidence. Each lab is audited
one at a time from a fresh clone in a scratch directory; the sibling clones under `../` are not
touched. Nothing is fixed, committed or pushed; this file is the only artifact.

Method per lab: clone fresh; compare the pinned "exact main" commit with current `origin/main`;
read the source behind each acceptance criterion; run `npm ci`, the unit tests, the production
build and the browser suite where a browser is available; spot-check at least one named mutation by
applying it and running the owning test; fetch the live GitHub Pages bytes and compare with a fresh
build of main; read the page/README for claims the code does not support.

Verdict vocabulary: **Confirmed** · **Confirmed with caveats** · **Overclaimed** · **Defect**.
Severity: **High** (a learner-visible claim is false, or a control cannot fail) · **Medium**
(a real deviation or gap the page does not disclose) · **Low** (wording, bookkeeping, ledger).

## Progress

- [x] Envelope KMS (E-K-01, S02)
- [x] Search Vault (L-R-09, A-D-02, L-R-07, E-K-08, L-R-08)
- [x] IBE Gate (E-K-02, A-D-07)
- [x] AES Anatomy (A-D-06, E-K-06)
- [x] Dedup Vault (A-D-01) — new repo
- [x] Shelf Oracle (L-R-04, L-R-05, A-D-10)
- [x] Oblivious Shelf (L-R-06)
- [x] Attribute Gate (A-D-03, L-R-03)
- [x] Proof Tally (S04)
- [x] DC-net (A-D-04) — new repo
- [x] HPKE Envelope (S01)
- [x] LFSR Forge (A-D-05, A-D-11, A-D-12)
- [x] SAT Break (no roadmap proposal; see note)
- [x] Clock Arithmetic (L-R-01)
- [x] Hidden Bit (E-K-04, S09)
- [x] IPsec / IKE (E-K-03) — new repo
- [x] Matsui Line (A-D-14)
- [x] Signature Gate / crypto-lab-confirmer-signatures (A-D-09)
- [x] Residue Gate (A-D-13)
- [x] Attestation Gate (A-D-08, S11)
- [x] Shamir Gate (S07)
- [x] ORAM Vault (E-K-10, L-R-13)
- [x] DP Noise (E-K-07, L-R-11)
- [x] LLL Break (E-K-09)
- [x] MAC Race (L-R-02)
- [x] Distance Bounding (S06) — new repo
- [x] Hostile Paths (L-R-10) — new repo
- [x] Lattice IBE (L-R-12) — new repo
- [x] Rank Metric (S10) — new repo
- [x] SAML Binding (S12) — new repo
- [x] ZK Proof Lab (RR-SUMCHECK-GKR, outside the 48)
- [x] Hub learn/timestamping workshop (S03)
- [x] Hub learn/fair-exchange workshop (E-K-05)
- [x] Ledger check (counts, phase table, CATALOG.md, README rows, knowledge map)
- [x] Ledger-discrepancy section and top-10 findings

Note on scope: the audit brief lists 32 labs plus two hub workshops. The roadmap's 48 proposals
also include A-D-15 (Anamorphic Channel), which the brief describes as Planned but the roadmap
now records as Live; it is not in the audit order and is only checked in the ledger section.

---

## 1. Envelope KMS — E-K-01, S02

Repo `crypto-lab-envelope-kms`. Roadmap pins: E-K-01 `2663e075e1ff` (first exercise) and
`50fcf5130274` (bounded search); S02 `d2b6614a9fad`. Current `origin/main` at audit time:
`ad7fab7a04aa` (#47, "Add trusted KWP length policy and qualify integrity claims"), one commit
past the S02 pin. The `d2b6614..ad7fab7` diff touches `src/crypto/aes-kwp.ts`,
`src/security/properties.ts`, `src/ui/security-lab.ts`, README/SECURITY and two tests only; no
E-K-01 or S02 source file changed.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| E-K-01 first exercise (fixed vs mutable roles, real wrap-then-decrypt trace) | Confirmed | — | `src/kms/key-handles.ts` `HandleToken`: `allowDecrypt` throws `ROLE_LOCKED` under `fixed-roles` (l.141), `wrapKey` throws `KEY_NOT_EXTRACTABLE` for a nonextractable target (l.126), `decryptBytes` returns real RFC 3394 unwrap output (l.158). AES-KW is `src/crypto/aes-kw.ts` over `@noble/ciphers` ECB; `src/crypto/key-wrap.test.ts` checks RFC 3394 §4.1–4.3 and RFC 5649 vectors. Challenge is WebCrypto AES-256-GCM (`src/crypto/aead.ts`). |
| E-K-01 bounded state search (import/template confusion, same-value handles, cutoff vs exhaustion) | Confirmed | — | `src/kms/key-handle-search.ts`: BFS over a declared alphabet (`STATE_SEARCH_RULES`), canonical multiset state de-dup (`canonicalState`), bounds `4 calls / 4 handles / 4 blobs / 3 templates / 50,000 states`; `search-incomplete` + `capHit` is a distinct verdict from `no-witness-within-bounds` (l.566–612). Witness replay `replayKeyHandleWitness` re-executes every step with real AES-KW and verifies the escaped key against an AES-GCM challenge (l.711–815); `verifyWitness` re-walks the symbolic transitions before replay. Unit test `key-handle-search.test.ts` covers all three presets under both policies and the one-state cutoff. |
| S02 key-evolving audit log (compromise at c, earlier/later rewrites, checkpoint/close/freshness as separate results) | Confirmed | — | `src/kms/forward-secure-log.ts`: `S_{i+1} = HMAC(S_i, update‖logId‖i)`, per-period tag key `HMAC(S_i, tag-key‖…)`, record tag over a length-framed tuple including `previousTag` (l.235–300). `rewriteFromCompromise` can only retag `target >= c` under `FORWARD_SECURE` and every period under `STATIC` (l.470–520). `verifyAuthenticatedLog` reports integrity, checkpoint consistency, completeness (needs `expectedClosePeriod`) and freshness (needs `trustedMinimumRecords`) as four independent results and leaves the latter two `UNKNOWN` without external input (l.700–784). |

**Code matches claim.** No simulated math found. Every displayed hex value in the key-handle and
audit-log panels is computed in the run; displayed escaped bytes are re-used to open the GCM
challenge rather than echoed (`src/ui/key-handle-search.ts:54–57`). The controls can fail: forcing
`tagMatches = true` (mutation KEA-02) and removing the fixed-template filter (KHS-01) each turn the
owning unit tests red (3 and 4 failures respectively; applied and restored in a scratch clone).

**Source fidelity.** E-K-01 follows the Delaune–Kremer–Steel style bounded API model with the
Clulow wrap/decrypt, known-key-import and same-value-alias traces; the page says it is "not a PKCS
#11 implementation, HSM assessment, vendor vulnerability claim, exhaustive search, or security
proof" (`src/ui/key-handle-search.ts:135`). S02 is a Bellare–Yee style key-evolving MAC with a
linear tag chain and plaintext messages; it is not the Schneier–Kelsey construction (no encrypted
entries, no hash chain `Y_j`, no untrusted-verifier partial checking) and the panel says so
(`src/ui/key-evolving-audit.ts:692–708`). The verifier holds `S_0`, i.e. this is private symmetric
verification; disclosed on the page and in the roadmap.

**Tests are real.** Fresh clone of `ad7fab7a04aa`: `npm ci` clean; Vitest 170/170 passed (14
files); `npm run build` succeeded; Playwright 50/50 passed against a fresh production build,
including the KHI/KHS/KEA claim specs. The 18-case mutation runner (`scripts/key-handle-mutations.mjs`)
is invoked by `.github/workflows/pages.yml` ("Key-handle and audit-log claim mutation gate"). Of
the 18 cases, two (KHS-04, KEA-08) only delete a limitation sentence and are caught by text
assertions; the other 16 change behaviour. One failure observed locally: `tests/publish-request.test.mjs`
("a rejected publishing request retains its failing exit status", got 1, expected 73). Cause is
environmental: the test runs npm from `process.execPath/../../lib/node_modules/npm/bin/npm-cli.js`,
which does not exist under a Homebrew Node 26 layout, so Node exits 1 before npm runs; the same
`npm run deploy` with a stub `gh` exiting 73 returns 73 when invoked through PATH npm. Not a lab
defect, but the control is install-layout dependent.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-envelope-kms/` serves `index.html`
`3c8d64ac…`, `assets/index-DjTG63om.css` `ef993b5b…`, `assets/index-DpqawOfk.js` `dc0c2d6a…`; all
three are byte-identical to a fresh `npm run build` of `ad7fab7a04aa`. The roadmap's S02 "Observed
live artifact" hashes (`index-ByH15Md7.js`, `419c49d1…`) describe the pinned revision, not what is
served today; the drift is the expected result of #47 and the lab is current.

**Honest limits.** The page and README state the bounded-model, non-PKCS#11, best-effort-erasure,
private-verifier and integrity-only limits. #47 additionally weakened the "wrapped DEKs are
authenticated" claim to an observed trial and added a research note on key-wrap forgery bounds;
that is a correction in the right direction.

**Coherence.** The lab now carries eleven interactive panels (primer, watch-the-wrap, operations,
inspector, "who may use", "what may this key do", "can another call sequence expose it", security
properties, request flow, rotation drill, audit log, key-evolving audit, stolen-KEK). The three
rollout exhibits sit in sensible places (key-handle work under "Ready to go deeper?", the
key-evolving log directly after the basic audit log). One gap: the page-level "What's Real, What's
Simulated" disclosure (`index.html`, `reality-panel`) still lists only RFC 3394/5649, AES-GCM, the
SHA-256 chain and zeroization as "real" and "PKCS#11 HSM bindings" as out of scope; it was not
updated to name the HMAC-SHA-256 key-evolving log or the AES-KW key-handle model, so the intro does
not describe every exhibit. **Low.** No other catalog lab implements a forward-secure log or a
key-handle API model (CATALOG.md grep), so nothing is duplicated and nothing belongs elsewhere;
the key-handle API lesson is arguably its own topic but a KMS lab is a defensible host.

**Findings and disposition**

1. **Low** — Update the "What's Real" disclosure panel to include the two rollout exhibits.
2. **Low** — `tests/publish-request.test.mjs` depends on Node's bundled-npm install layout; fine
   on CI, misleading locally. Resolve npm via `process.env.npm_execpath` or document the limit.
3. **Low (ledger)** — Roadmap live-evidence hashes for Envelope KMS are one commit stale; the
   lab itself is current. See ledger section.

## 2. Search Vault — L-R-09, A-D-02, L-R-07, E-K-08, L-R-08

Repo `crypto-lab-search-vault`. Roadmap pins `97d9e0ff6fbb` (L-R-09), `1f0b50595608` (A-D-02),
`d904972690e1` (L-R-07), `2ecc6612c260` (E-K-08), `28bb6f3c50e0` (L-R-08). Current `origin/main`
is `28bb6f3c50e0`, i.e. identical to the last pin; the four earlier pins are its direct ancestors
and each later exhibit was added without touching the earlier modules (verified by reading the
module tree: `src/sse`, `src/peks`, `src/oxt`, `src/fuzzy`, `src/muse` are disjoint).

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| L-R-09 query-result completeness/freshness (omit, fabricate, stale; row auth ≠ completeness) | Confirmed with caveats | Low | `src/sse/query-integrity.ts`: client checkpoint = snapshot id + expected count + SHA-256 over the ordered encrypted answer (l.33–70); `verifyQueryReply` returns `stale-snapshot`, `count-mismatch`, `digest-mismatch` separately (l.78–112); `makeIntegrityTrialReply` only alters a copied reply (l.119–143). Caveat: the "fabricate" case is a one-byte flip of an authentic posting's AES-GCM ciphertext (l.133), so it exercises per-row authentication rather than a server-invented row; the deterministic check is by construction, since the client precomputes every answer digest at index time. Both limits are stated on the page (scope panel) and in the roadmap. No sentinel/twin mechanism was added, as the roadmap says. |
| A-D-02 PEKS (public sender, recipient trapdoor, server Test, bounded dictionary attack, leakage separation) | Confirmed | — | `src/peks/core.ts`: `X = xP2`, `A = rP2`, `B = H2(e(H1(w), rX))`, `T_w = xH1(w)`, `Test = [B == H2(e(T_w, A))]` over noble BLS12-381 with RFC 9380 hash-to-G1 under a PEKS DST (l.96–150); strict canonical/subgroup decoding (l.158–181). `src/peks/dictionary.ts` takes only public key, trapdoor and candidates, generates fresh tags and calls public Test; returns `not-recovered-within-bound` (l.45–96). `PeksServer.search` scans every tag and logs trapdoor/volume/access per query (`src/peks/server.ts:47–63`). |
| L-R-07 bounded OXT conjunction vs naive SSE; server-visible sets; ORAM cost table | Confirmed | — | `src/oxt/core.ts`: `y = F_I(id)/F_Z(s,c)`, `xtoken = [F_Z(s,c)F_X(x)]B`, server computes `[y]xtoken` and does exact sorted-XSet membership (`src/oxt/server.ts:96–135`); HMAC-SHA-512-to-nonzero-scalar PRF with framed retry counter (core l.104–130); two-term grammar enforced before any server call (`createOxtQuery`, `selectTerms`). The s-term is chosen by client-side frequency with ASCII tie-break, as the roadmap states. Path ORAM table is derived arithmetic and labelled as such. |
| E-K-08 fuzzy search (deletion grams, thresholds 0–2, cost/error ledger, neighborhood inference) | Confirmed with caveats | Low | `src/fuzzy/core.ts`: Li et al. Algorithm 2 deletion-gram set by exhaustive removal combinations (l.45–81); unit-cost Levenshtein (l.85–104); `inferObservedNeighborhood` consumes only token hexes (l.134–168). `src/fuzzy/client.ts` seals each gram payload with the trapdoor as AAD (l.269). `src/fuzzy/oracle.ts` is an independent full-matrix distance. Caveat: `FuzzySearchLesson.#runThreshold` throws if the client-filtered keyword or document set differs from the oracle (`lesson.ts:844–846, 865–867`), so the displayed *final* false-positive/false-negative rates can only ever be 0/N; they are a consistency assertion, not a measurement, while the *candidate* rates are real. |
| L-R-08 multi-user search (roles, known-query collusion attack, QM/DH split trust) | Confirmed | — | `src/muse/core.ts`: reader key `P2^(1/ρ)`, writer index `e(H(x), P2^γ)`, delegation `Δ = (P2^(1/ρ))^γ`, server test `e(H(q)^ρ, Δ) == I_w(q)` (l.95–247); authorization resolved atomically before any transcript (l.206–216). `src/muse/attack.ts` union-find over equality edges with one known label. `src/muse/split.ts`: fresh `ξ` blinding, ZGBF from `src/muse/zgbf.ts` (XOR zero-sum, pivot build with the paper's abort), packed Paillier selectors with Lipmaa sanitisation (`src/muse/math.ts:471–497`), AES-GCM writer-id envelopes, CSPRNG shuffle; `combineSplitTrustViews` is the explicit collusion failure. Paillier primes come from a WebCrypto RSA keygen, re-derived as a 1024-bit teaching key, labelled non-production. |

**Code matches claim.** No simulated math. Every displayed hex/cost/rate in the four rollout
exhibits is derived from the run; controls can fail (mutations below). The repeated-query
"fresh trapdoor / fresh selector" evidence in L-R-08 compares actual bytes of two runs
(`lesson.ts:1507–1511`).

**Source fidelity.** PEKS: BDOP 2004 algebra moved to Type-3 (trapdoor in G1, tag component in
G2); the page's proof-boundary panel says the symmetric-pairing BDH reduction is not transferred
(`src/ui/peks.ts:574–600`). OXT: Cash et al. 2013 equations with a flat HMAC-addressed TSet and an
exact XSet instead of a Bloom filter; disclosed (`src/ui/conjunctive.ts:188`). Fuzzy: Li et al.
2009/593 Algorithm 2 gram sets with an exact map instead of the trie; disclosed. MUSE: Van
Rompay–Molva–Önen PoPETs 2017 attack and SCC 2018 split; the homomorphic selection uses packed
Paillier exponent-selection rather than the paper's OT; disclosed as an adaptation. The `ξ` power
on GT uses noble's variable-time `Fp12.pow` for a per-query secret (`core.ts:274`), consistent with
the lab's blanket "no constant-time claim" but worth knowing.

**Tests are real.** Fresh clone of `28bb6f3c50e0`: `npm ci` clean; Vitest 232/232 in 23 files
(matches README and roadmap); `npm run build` succeeded; Playwright 51/51 against a fresh
production build (SSE claims, query-integrity, OXT, PEKS, fuzzy, MUSE, a11y). Mutation scripts
`scripts/fuzzy-mutations.mjs` (16) and `scripts/muse-mutations.mjs` (17) are wired into CI
(`npm run test:mutations`) and every case changes behaviour rather than prose. Spot-checks applied
in the scratch clone and restored: inverting the ZGBF zero-sum check → 3 MUSE unit failures;
`accepted: distance < threshold` → 10 fuzzy failures; PEKS `Test` forced true → 10 PEKS failures.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-search-vault/` serves nine files
(`index.html` `e3a38c97…`, `index-OesPS1RR.js` `19a4719f…`, `index-CvGMDEQt.css` `bf478036…`,
`bls12-381-D37fGTvM.js`, `core-e_MxMAqM.js`, `curve-CC2gN1uT.js`, `dictionary-CDSpUW5u.js`,
`lesson-D99PHK7P.js`, `server-Na6qOpi6.js`); `diff -r` against a fresh build of main reports no
difference. The roadmap's L-R-08 "nine artifact files" claim is confirmed.

**Honest limits.** The scope panel (`src/ui/scope.ts`) has Real / Scaled down / Does NOT prove /
Out of scope lists that name every rollout exhibit, including the QM/DH non-collusion assumption,
the no-reduction-transfer statement for Type-3 PEKS, the bounded-miss-is-not-security statement and
the 1024-bit Paillier caveat. README "What Can Go Wrong" matches the code.

**Coherence.** The lab now carries ten exhibits and a scope panel; the intro glossary
(`src/ui/intro.ts`) and the README exhibit list describe all ten, and every exhibit is framed by the
same thesis ("the leakage profile is the security model"). It still reads as one path, though it is
now the largest single lab in the rollout (~18k lines of source and tests); a reader arriving for
single-keyword SSE meets five constructions. No exhibit is duplicated elsewhere in the catalog
(IBE Gate does BasicIdent, not PEKS; Rekey Relay is PRE, not MUSE; ORAM Vault executes ORAM, which
this lab only tabulates). Nothing belongs in another lab.

**Findings and disposition**

1. **Low** — E-K-08: label the final-document error rates as an oracle consistency check (they
   cannot be nonzero because the lesson throws on disagreement) or let a mismatch surface as a
   measured rate.
2. **Low** — L-R-09: the "fabricate" control is a bit-flip of an authentic posting; either rename it
   or inject a genuinely server-invented row so the case is distinct from tampering.
3. **Low (ledger)** — Roadmap L-R-09 section pins "delivered source" at `1f0b50595608` (the
   A-D-02 merge) while its verification paragraph names `97d9e0ff6fbb`; harmless but inconsistent.

## 3. IBE Gate — E-K-02, A-D-07

Repo `crypto-lab-ibe-gate`. Roadmap pins `7dfebaff27c4` (E-K-02) and `6c0b3fbd9ebf` (A-D-07).
Current `origin/main` is `6c0b3fbd9ebf`; `7dfebaff27c4` is its parent and `src/hibe.ts` is
unchanged between them.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| E-K-02 executable HIBE delegation (descendant key without the root, child/sibling/ancestor results, subtree compromise, retained root escrow) | Confirmed with caveats | Low | `src/hibe.ts` implements Ramanna–Chatterjee–Sarkar ePrint 2012/024 Appendix G over Type-3 BLS12-381: `setupHIBE` (τ = v + a·v′), `keyGenHIBE` (K1 = αP2 + rV2, K2 = rV′2, K3_i = r_iP2, D_i = r_i(id_iQ2_i + tag_iW2 + U2_i)), `delegateHIBE` (re-randomises every existing component with δ_i and adds the child level without the master secret, l.247–302), `recoverHIBESecret` (A1 from tag-difference inverses, A2 = e(C1,K1)e(C2,K2)e(C3,ΣK3), secret = A2/A1, l.360–399). Checked by hand: A2/A1 reduces to e(P1,P2)^{αs}. The ancestor case is a structural depth refusal; the sibling case runs the pairings and recovers a wrong GT element (identity equality deliberately not checked, l.364–368). Caveat: the ciphertext object carries `_demoShared`, the sender's encapsulated secret; it is used only for the omniscient "sender/recipient G_T secret match" display and in unit tests (`src/main.ts:1406,1438`), never for decryption, which uses the recovered secret. |
| A-D-07 certificateless ownership comparison (partial key + user secret, PKI vs IBE vs CLE, Type-I vs Type-II vs combined) | Confirmed | — | `src/certificateless.ts`: Huang–Wong §4.2 envelope `c1 = IBE.Enc(ID‖ctx, m‖mk)`, `c2 = RSA-OAEP(upk, c1)`, `tag = HMAC(mk, c2)` with identity/context bound into the BasicIdent input and a 32-byte identity digest in the serialised inner ciphertext (l.270–301); `typeIAttempt` receives a replacement secret and a public-generator guess for the partial key; `typeIIAttempt` receives the partial key and generates an unrelated RSA key internally (l.345–384); recipient API collapses all failure stages to one bit (l.316–337). PKI route: real P-256 ECDSA CA signature over framed identity/context/SPKI before RSA-OAEP (l.386–460). |

**Code matches claim.** No simulated math; every pairing is `@noble/curves` BLS12-381. The HIBE
verdict for the sibling branch is derived from a wrong plaintext after the pairing algebra runs;
the CLE verdicts come from live RSA-OAEP/HMAC results.

**Source fidelity.** HIBE: identity components are hashed to Z_r with level/domain separation
and the GT element is hashed to a byte mask (KEM/DEM) rather than encrypting a GT element; both
deviations are stated in the module header and the page's "What this proves — and what it does
not" list (`src/main.ts:1344–1357`). CLE: the page and README state that BasicIdent is IND-CPA so
Huang–Wong's theorem premises (IND-ID-CCA2 IBE, IND-CCA2 PKE, strong one-time MAC) are not met and
no CLE proof is claimed; the Type-I/II cases are one-shot capability demonstrations, not the
Al-Riyami–Paterson adaptive games with extraction/decryption oracles, and the page says so.

**Tests are real.** Fresh clone of `6c0b3fbd9ebf`: `npm ci` clean; Vitest 50/50 (4 files);
`npm run build` succeeded; Playwright 20/20 (18 functional incl. HIBE and three CLE claim tests,
2 a11y/reflow drives). `scripts/mutations.mjs` holds 10 behavioural mutations of
`src/certificateless.ts` only and runs in CI (`Certificateless lesson mutation gate`); there is no
mutation gate for `src/hibe.ts`, and the roadmap does not claim one for E-K-02. Spot-checks in the
scratch clone, restored afterwards: "accept every one-time MAC" → 2 CLE failures; my own mutations
of the HIBE core, returning A2 without dividing by A1 → 5 failures, and dropping the delegation
re-randomisation sum → 3 failures. The HIBE unit suite therefore does discriminate.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-ibe-gate/` serves `index.html`
`447f7aed…`, `index-D3xblc7f.css` `d7803b28…`, `index-z1_EXoTP.js` `a8406ef0…`; all three are
byte-identical to a fresh build of main and match the hashes the roadmap recorded for A-D-07.

**Honest limits.** Both exhibits carry explicit non-claim lists on the page; the README's
"What Can Go Wrong" adds the IND-CPA/no-theorem statement and the 23-byte message bound with its
RSA-OAEP derivation. Nothing claims constant time, production use or a security theorem.

**Coherence.** Seven exhibits in one numbered path (setup, encrypt-to-stranger, wrong key,
time-limited, escrow, HIBE, PKI/IBE/CLE); the README "What It Is" describes all seven and Exhibit 7
is explicitly a comparison that reuses Exhibits 1–5. The PKI route overlaps conceptually with PKI
Chain but executes only a one-certificate CA check as a comparison baseline, which is not
duplication. Lattice IBE (L-R-12, new repo) is the post-quantum counterpart and links back here
rather than repeating BasicIdent. Nothing belongs elsewhere.

**Findings and disposition**

1. **Low** — Consider dropping `_demoShared` from the ciphertext type (compute the sender-side
   secret in the UI from `s` instead) so a ciphertext object cannot be mistaken for carrying its
   own KEM secret.
2. **Low** — Add a small mutation gate for `src/hibe.ts` (the two hand mutations above are
   caught by unit tests, so it would be cheap).

## 4. AES Anatomy — A-D-06, E-K-06

Repo `crypto-lab-aes-anatomy`. Roadmap pins `fffbc96eddeb` (A-D-06), `1f0f6b86a2dd` (E-K-06) and
maintenance `61be3762a50c`. Current `origin/main` is `61be3762a50c`. Between the E-K-06 pin and
main there are three commits the roadmap only partly describes: #5 added Act 10 (a reduced
four-round integral attack) and a wide-trail dispersion check, `58975ad` fixed claim-count wording,
and #7 changed the theme marker. The DFA/SIFA sources (`src/attack/dfa.ts`, `src/attack/sifa.ts`,
`src/dfa-fixture.ts`, `src/sifa-fixture.ts`, `src/ui/act8.ts`, `src/ui/act9.ts`) are unchanged
across that range; only `src/aes/cipher.ts` had a two-line change for Act 10.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| A-D-06 classical DFA (declared round-9 byte fault, correct+faulty ciphertexts, last-round quartet filtering, held-out verification, changed fault model, recomputation check) | Confirmed with caveats | Low | `src/dfa-fixture.ts:18–43` runs the real `cipher()` with a trace, XORs one nonzero byte into `trace[9].shift` (state before round-9 MixColumns) and finishes rounds 9–10 from the real schedule. `src/attack/dfa.ts:recoverRound10Quartets` (l.58–104) receives only the two ciphertexts and the byte location, enumerates all 255 fault values and filters each of the four affected key bytes by `INV_SBOX(C⊕k) ⊕ INV_SBOX(C′⊕k) == MC[row][faultRow]·f`; `intersectQuartets`, `installQuartet` and `invertAes128Round10Key` (reverse schedule with Rcon, l.129–155) complete recovery. Act 8 verifies the recovered master key by re-encrypting the plaintext and a held-out plaintext against the victim (`src/ui/act8.ts:70–83`). Caveat: the "common-mode" half of the recomputation control injects the identical fault twice and compares the two outputs, so that half is an identity rather than an experiment; the page frames it as a scoped example, not a defense. |
| E-K-06 ineffective faults (bit fault after round-1 SubBytes, accepted-output selection, SIFA ranking, secret-independent null, reject vs infective defense with a failure case) | Confirmed | — | `src/sifa-fixture.ts:executeWithRoundKeys` clears/flips one bit of `trace[1].sub[0]` and continues real AES-128 (`finishAfterRound1SubBytes`); classification is exact ciphertext equality (l.128). `rankSifaKeyByte` (`src/attack/sifa.ts`) receives only the selected plaintext bytes and the target bit and ranks 256 candidates by squared Euclidean imbalance. `collectSifaSamples` is the 2,048-row analytic census (no AES executed; labelled as such on the page, `src/ui/act9.ts:214–215`); `sampleSifaPrefixes` is the finite-sample experiment that executes AES per trial from a seeded generator. `secret-independent` control uses an always-effective bit flip (l.337–346). `infect-hidden` returns an output for every attempt so the selection-only ranker ties; `infect-with-validity` restores the classifier and is the declared failure case. |

**Code matches claim.** Both fault paths execute the lab's FIPS-197-tested AES; neither the ranker
nor the DFA solver receives the victim key, round keys or fault value (enforced by module
boundaries and tested in `src/dfa.test.ts` "attacker API receives ciphertext pairs and location
metadata, never the fault value or victim key"). The controls can fail (mutations below). Act 8
says "no full-key recovery is asserted" when survivors are not unique and Act 9 says "no recovery
claim" when the seeded run does not rank the true byte first; both branches exist in the code.

**Source fidelity.** DFA follows Dusart–Letourneux–Vivolo (ePrint 2003/010): one byte before the
penultimate MixColumns, four affected ciphertext bytes on one diagonal, inverse-S-box differential
filtering; the README attributes it and the page states the chosen-location, AES-128-only
boundary (`src/ui/act8.ts:195`). SIFA follows Clavier's ineffective-fault analysis and Dobraunig et
al. 2018 at the level of one key byte with a declared 6-of-8 landing profile; the page says the
infection transform is a deterministic teaching transform, not the Daemen et al. construction.

**Tests are real.** Fresh clone of `61be3762a50c`: `npm ci` clean; Vitest 56/56 (5 files);
`npm run build` succeeded; Playwright 22/22 against a fresh build (DFA display verifies the
recovered key independently; SIFA test drives selection, controls and infection; Act 10 spec).
`scripts/check-mutations.mjs` holds 47 mutations (44 original + 3 for Act 10), each with a named
owning test and a focused `vitest -t` command, and runs in CI with the evidence JSON uploaded.
Spot-checks in the scratch clone, restored afterwards: transposing the MixColumns coefficient in
the DFA solver → 4 failures; forcing the SIFA equality classifier to accept → 4 failures.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-aes-anatomy/` serves `index.html`
`ff87d955…`, `index-CRXXLOyp.js` `803ceec7…`, `index-DsfsZ8HC.css` `bf0f46a5…`,
`attack.worker-BuntoPYK.js` `fc863e3b…`; all four are byte-identical to a fresh build of main, and
the CSS and worker hashes equal the values the roadmap recorded for E-K-06.

**Honest limits.** Act 8 and Act 9 each end with a boundary paragraph (logical fault model, not
physical injection; AES-128 only; census vs sampled evidence; infection not hardened; exact
reference oracle deliberately granted in the failure case). README matches.

**Coherence.** Ten acts in one numbered path; the README's act list and the hub catalog entry
both include Acts 8, 9 and the post-rollout Act 10. No other catalog lab credits AES DFA or SIFA
(CATALOG.md grep), so nothing is duplicated; Lattice Fault covers a different fault target.
Nothing belongs elsewhere.

**Findings and disposition**

1. **Low** — Act 8 recomputation control: the common-mode half cannot fail (two identical
   deterministic injections); either drop the green check for that half or make it a separate
   explanatory line rather than a passed control.
2. **Low (ledger)** — The roadmap's E-K-06 maintenance note describes #7 only; the Act 10 integral
   attack and wide-trail check (#5) landed on the same main without a roadmap or paper-review entry
   naming them (the hub catalog does list Act 10). See ledger section.

## 5. Dedup Vault — A-D-01 (new repository)

Repo `crypto-lab-dedup-vault`. Roadmap pin `3cbf467bdb1a`; current `origin/main` is the same
commit (two commits in the whole history: bootstrap and the lesson).

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| A-D-01 (fresh-key vs local MLE vs server-aided modes; equality and storage accounting; offline and bounded online dictionary attacks; possession/authorization/equality/deletion/revocation as separate transitions) | Confirmed | — | `src/crypto/aes.ts`: local MLE key `first128(SHA-256(P‖file))` (DupLESS §4 formula, l.66–71), AES-128-CTR data encryption with a zero counter (noble `ctr`), AES-SIV capsules with four AAD components (scheme, owner, reference, complete ciphertext; l.100–135). `src/crypto/voprf.ts`: RFC 9497 P256-SHA256 VOPRF through noble's `p256_oprf.voprf` with the client pinning a public key before the request sequence and `finalize` verifying the DLEQ proof (l.206–226); per-identity, per-epoch budget and allowlist checked before evaluation (l.112–133); `rotate`/`advanceEpoch`/`revoke`. `src/model/storage.ts`: deduplication only on complete ciphertext byte equality inside a SHA-256-selected bucket (l.63–68); reference-counted deletion; nonce-bound whole-ciphertext possession challenge with one-shot challenge ids (l.166–190). `src/attacks/dictionary.ts`: offline (local MLE), online (budgeted VOPRF) and compromised-server attacks returning `recovered` / `no-match` / `rate-limited` / `principal-rejected`. `src/model/boundaries.ts` derives every boundary verdict from executed calls. |

**Code matches claim.** No simulated math or hard-coded outcomes; `main.ts` computes every
exhibit from `runComparison`, `runBoundaryDemonstration` and the three attack functions, and the
page states that "every displayed result" is derived from `src/`. Controls can fail (mutations
below).

**Source fidelity.** The lesson is a DupLESS-shaped adaptation: blind-RSA OPRF replaced by RFC
9497 P-256 VOPRF, DupLESS §6's HMAC/AES-CTR SIV capsule replaced by RFC 5297 AES-CMAC-SIV, path and
name handling omitted, and `P` fixed to a lesson constant rather than sampled. All four deviations
are stated in the README ("Local message-locked encryption", "Per-user key capsules") and on the
page ("Construction, adaptation, and limits", `src/main.ts:96`). The deterministic modes reuse an
AES-CTR key/counter pair for one distinct plaintext value by design; the README's "What Can Go
Wrong" names the XOR-exposure consequence of ever using that pair for a different plaintext.
Vectors pinned in tests: RFC 9497 Appendix A.3.2.1 (seed, skS, pkS, input, blind, evaluated,
proof, output), RFC 5297 A.1 and A.2, SP 800-38A F.5.

**Tests are real.** Fresh clone of `3cbf467bdb1a`: `npm ci` clean; Vitest 38/38 (7 files);
`npm run build` succeeded including `scripts/verify-build.mjs` (license notices present);
Playwright 18/18 (7 claim tests that independently decrypt displayed AES-CTR output and recompute
byte counts, 11 accessibility/reflow tests). `scripts/claim-mutations.mjs` holds 24 named
mutations `DV-01`–`DV-24`, each tied to an owning test, run in CI with evidence uploaded.
Spot-checks in the scratch clone, restored afterwards: removing the rate limit (DV-05) → 5
failures; deduplicating on the index bucket alone instead of byte equality (DV-06 in my own form)
→ 2 failures.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-dedup-vault/` serves `index.html`
`3aa4add5…`, `index-C4ZDGYCT.js` `b6223abf…`, `index-DBmBcOjh.css` `0f029fde…` and
`THIRD_PARTY_NOTICES.txt` `cb3e5ec3…`; all four are byte-identical to a fresh build of main and
equal the hashes the roadmap recorded for A-D-01.

**Honest limits.** The page's "Construction, adaptation, and limits" panel and the README state:
not production storage; one browser origin; equality/length/timing leakage inherent; rate limits
delay rather than prevent; revocation cannot erase cached copies; rotation is not retroactive; no
rollback detection without external version state; JavaScript not constant-time; noble AES-SIV
not covered by the cited independent audit. The possession exercise is explicitly not the
Halevi et al. proof-of-ownership construction.

**Coherence.** Five exhibits in one path (three modes → dictionary pressure → who learns what →
boundaries → construction and limits); the intro and README describe all five. No other catalog
lab implements MLE or server-aided key derivation; OPAQUE Gate uses an OPRF for a different
purpose and is linked, not duplicated. Nothing belongs elsewhere.

**New-repo justification: Yes, justified.** The natural extension host, Envelope KMS, already
carries eleven panels (see section 1) and teaches the opposite thesis (randomized DEKs under a KEK
hierarchy). Message-locked encryption is a distinct concept whose lesson *is* the contrast with
randomized encryption, and the lab needs three primitives (AES-CTR, AES-SIV, VOPRF) and a storage
model that Envelope KMS does not have. It also fits the catalog's "one concept per demo" rule
better than a twelfth Envelope KMS panel would. OPAQUE Gate would be a worse host still, since its
OPRF serves password authentication.

**Findings and disposition**

No defects or overclaims found. No action required beyond the fleet-level items in the ledger.

## 6. Shelf Oracle — L-R-04, L-R-05, A-D-10 (and M-SHELF)

Repo `crypto-lab-shelf-oracle`. Roadmap pins `882c4f0083fd` (M-SHELF), `4d31c5b3ec5e` (L-R-04),
`d08691c9e17a` (L-R-05/A-D-10). Current `origin/main` is `d08691c9e17a`; the earlier pins are its
direct ancestors.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| L-R-04 compressed query + server-side expansion (same record via direct one-hot and compressed representation; evaluation keys, upload, response, operations, noise accounted; comparison computed, not copied) | Confirmed | — | `src/pir/expand.ts`: client encrypts `16⁻¹·X^index` (or zero for cover blocks, l.579–596); server applies odd automorphisms `n/2^i + 1`, binary-gadget key switching with RLWE switch samples `B^j·σ(s)` (l.521–568, 646–689) and SealPIR's shift-and-add recurrence (l.706–734); every round's automorphisms, key switches, convolutions, adds and shifts are counted from the executed loop. `src/pir/pir.ts:serverAnswer` still folds all 64 records (l.192–200) for both routes, as the page says. Key material is serialised and structurally validated (`serializeEvaluationKeys`/`deserializeEvaluationKeys`). |
| L-R-05 stateful/preprocessing PIR (setup vs online vs storage vs amortised; hint consumption/refresh, state loss, database update) | Confirmed | — | `src/pir/piano.ts`: 256 primary hints from a ChaCha20-block PRF over a 256-bit setup key, 8 punctured backup hints and 8 replacement records per chunk, streamed in one pass (l.312–436); online request = one PRF-selected index per chunk with the target chunk replaced by `r` (l.640–655); recovery `DB[x] = parity ⊕ answer ⊕ DB[r]` and refresh `backup ⊕ DB[x]` (l.800–820); 33-request window `floor(√64·ln 64)`; cached repeats consume a fresh unused cover target; state loss, malformed response, abandonment, database-digest change and rollback-anchor cases each invalidate the epoch with a named failure code. Server API is eight bytes in, 512 out, with no other fields (`pianoServerAnswer`). |
| A-D-10 cost model (wire bytes, records touched and operations separate; preprocessing model with ProcessDB/storage/state/online work labelled; crossover and update overhead) | Confirmed | — | `pianoCostForQueries` keeps setup stream bytes, upload, download, record reads, probes, parity XORs and replacement copies as separate counters and is described on the page as "a formula ledger, not a timing claim"; `ProcessDB` is stated as identity/none (`src/ui/stateful.ts:187,592`); the availability bound `33·(7/8)^249 ≈ 2^-42.92` is computed by `pianoAvailabilityBounds` (recomputed by hand: matches) and scoped as primary-hint availability only. |
| M-SHELF full-scan wording correction | Confirmed | — | README and the Homomorphic Selection/Compressed Query copy scope `O(N)` to the direct one-hot and compressed BFV routes and say both scan all 64 records (`README.md:45,47,63`; `src/ui/expand.ts:392–393`). |

**Code matches claim.** Real BFV (`src/pir/bfv.ts`, NTT in `src/pir/ntt.ts`), real key switching,
real PRF-defined parities; no displayed cost or verdict is a constant. Controls can fail (below).

**Source fidelity.** Expansion follows SealPIR's `expand_query` bounded to 16 selectors per
ciphertext at `q = 2^27 − 39`, with four fixed blocks and four fixed responses instead of
multidimensional recursion; the page states that it "does not claim sublinear server work", that
publishing Galois keys adds a circular-security assumption, and that the HES 2018 row is a
bit-size comparison because the lab samples centred-binomial rather than Gaussian error
(`src/ui/expand.ts:392–439`). Piano follows the authors' client parameter rule (256 primary hints
for λ = 40, Q = 33) with a lab-specific one-byte index codec rather than the reference protobuf
transport; the page labels the ledger as this implementation's wire cost and says the paper's
theorem, benchmark and dynamic extension do not transfer (`src/ui/stateful.ts:675–710`).

**Tests are real, with one caveat.** Fresh clone of `d08691c9e17a`: `npm ci` clean; Vitest 121/121
(8 files, 38 s); `npm run build` succeeded; Playwright 38/38 against a fresh build (direct,
compressed, stateful claim tests; a11y/reflow at 1280/380/280 px; the eight-tab keyboard order).
**Caveat:** there is no mutation runner in this repository: no script in `package.json`, no step in
`.github/workflows`, no file in the git history containing "mutat". The README's "Mutation-tested"
paragraph describes seventeen hand-applied mutations and the roadmap's L-R-05 row refers to "the
runner's seventeen-mutation total", but the runner has no referent. The claim is therefore
reproducible only by repeating the prose by hand. I did so for two of the five Piano/expansion
mutations: dropping the negacyclic sign in `applyAutomorphism` → 5 expansion-test failures;
omitting the replacement record from the recovery XOR → 9 Piano-test failures. The unit suite does
discriminate; the evidence standard is lower than the other rollout labs, all of which commit a
runner and upload an artifact.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-shelf-oracle/` serves `index.html`
`eb442c0c…`, `index-BQ_h0HyZ.js` `d1fb3969…`, `index-sI92ZJKz.css` `39dc0878…`; all three are
byte-identical to a fresh build of main and equal the hashes the roadmap recorded for L-R-05.

**Honest limits.** Both rollout panels carry explicit "what is adapted, and what does not transfer"
disclosures: no sublinear-server claim for the BFV routes, no 128-bit or end-to-end bound, no
malicious-server integrity ("a valid tag does not prove freshness"), no timing benchmark, no secure
zeroization, visible update → full rebuild. README matches.

**Coherence.** Eight tabs in one path (shelf, versus, fold/selection, compressed query, noise,
server view, stateful PIR, scope); the README exhibit list and the hub catalog's eleven exhibit
entries describe them all. The three PIR routes are kept visibly separate. Oblivious Shelf,
Patron Shield and Split Point cover multi-server information-theoretic PIR, so the single-server
BFV and Piano routes are not duplicated. Nothing belongs elsewhere.

**Findings and disposition**

1. **Medium** — Commit the seventeen-mutation set as a runner with named owning tests and wire it
   into `pages.yml` with an uploaded evidence artifact, as every other rollout lab does; until
   then the roadmap should not describe "the runner's seventeen-mutation total" for this lab.
   (Verification claim unreproducible from the repo; code itself is sound.)

## 7. Oblivious Shelf — L-R-06

Repo `crypto-lab-oblivious-shelf`. Roadmap pin `7529bf0099a8`; current `origin/main` is the same
commit.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| L-R-06 robust PIR (drop a server, corrupt an answer, collude selected servers; reconstruction, fault tolerance and privacy under one named model; replication/communication vs the two-server baseline; exceeded-threshold outcome) | Confirmed | — | `src/gf8.ts`: GF(2³) in the `z³+z+1` basis with multiplication, inverse by `x⁶`, line interpolation. `src/robust-pir.ts`: each coordinate of the one-hot vector is shared by an independent degree-one polynomial evaluated at points 1..5 with WebCrypto slopes (l.206–228); each server returns only its dot product (l.231–242); `decodeRobustReplies` interpolates every reply pair and accepts the unique line with agreement ≥ `received − ⌊(received−2)/2⌋`, i.e. unique decoding within `2b+u ≤ 3`, with `insufficient`/`refused`/`ambiguous` as distinct outcomes and no access to fault labels or the database bit (l.351–418). `singleServerCandidateTargets` derives that one view is compatible with every target (l.278–296); `colludeRobustQueries` interpolates two views to the one-hot vector (l.306–332). Pinned `beyond-bound` scenario constructs two corruptions plus one erasure that make a wrong line win 3-to-1 (l.493–505). `robustCommunicationCost` derives 2×N vs 5×3N bits. Per-server custom fault plans (`runRobustPlan`). |

**Code matches claim.** No simulated math; the "exceeded bound" outcome is produced by the
decoder on real replies, not by a label. Verdicts can fail (mutations below). The stale-replica
case recomputes the dot product over an actually changed replica rather than flagging a server.

**Source fidelity.** Beimel–Stahl's vector-Shamir / unit-vector warm-up with Reed–Solomon answer
decoding (§§2.2, 2.3.1, 5–6) and Goldberg 2007's unavailable/incorrect/colluding distinctions,
bounded to unique decoding at `k=1`, `n=5`. The page says it is "not Beimel–Stahl Theorem 5.2,
Goldberg's full 2007 protocol, Percy++ or RAID-PIR" and that "agreement is not provenance"
(`src/robust-ui.ts:181–184`). The two-server XOR baseline is unchanged.

**Tests are real.** Fresh clone of `7529bf0099a8`: `npm ci` clean; Vitest 63/63 (2 files) plus
8/8 `node --test` workflow controls; `npm run build` succeeded; Playwright 20/20 against a fresh
build (robust claim specs recompute wire values and the coding bound, collusion, custom plans,
320 px reflow). `scripts/mutations.mjs` holds 16 named behavioural mutations and runs in CI
("Robust PIR clean-baseline mutation gate"). Spot-checks in the scratch clone, restored
afterwards: weakening the decoder threshold to 2 → 8 failures; counting a Byzantine reply once in
`2b+u` → 5 failures.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/` serves
`index.html` `631ceaaf…`, `index-bslyjD5l.js` `95b8ff40…`, `index-lT1YDYQm.css` `7479e7e4…`; all
three are byte-identical to a fresh build of main and equal the hashes the roadmap recorded.

**Honest limits.** The workbench states that privacy, availability and answer correctness are
different properties; that there is no signature, MAC, commitment or freshness proof; that the
threshold is a guarantee, not a detector; and that two query views recover the target. README
"Robust Shelf Model" matches the code's `2b+u ≤ 3` derivation.

**Coherence.** The lab is the two-server XOR PIR lesson plus one robust companion section that
reuses the same 16-bit database snapshot and book selection; the README describes both. No other
lab implements robust/Byzantine-tolerant PIR (Shelf Oracle is single-server BFV/Piano, Patron
Shield and Split Point are other multi-server models), so nothing is duplicated and nothing
belongs elsewhere.

**Findings and disposition**

No defects or overclaims found.

## 8. Attribute Gate — A-D-03, L-R-03

Repo `crypto-lab-attribute-gate`. Roadmap pins `a4cd1973f99b` (A-D-03) and `ab293fd0386f`
(L-R-03). Current `origin/main` is `ab293fd0386f`; `a4cd1973f99b` is its parent and
`src/fabesa/` is unchanged between them.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| A-D-03 hidden attribute values (equal-length records with different hidden values; a named policy-hiding construction; hidden values vs visible names/structure; authorized decryption with the observer's remaining leakage) | Confirmed | — | `src/fabesa/fabesa.ts` transcribes FABESA Figure 5 (CCS 2024, ePrint 2024/986) over BLS12-381: `sk3 = H(0‖u)^{r/b1}`, `sk4 = H(1‖u)^{r/b2}`, `ct1_i = g3^{M_i·(s‖v)} H(0‖π(i))^{s1} H(1‖π(i))^{s2}`, `ct3 = B1^{s1}`, `ct4 = B2^{s2}`, and the four-pairing decryption (l.261–362, 621–651); checked by hand, the ratio reduces to the message. `PublicPolicy`/`SecretKey` types carry names, matrix and row map but no value string (l.93–136). `enumerateReconstructionCandidates` solves `M_Iᵀγ = (1,0,…)` over every row subset within the 10-row/32-candidate bound and refuses beyond it (l.533–585). `src/fabesa/kem.ts` uses AES-GCM tag acceptance as the §3.3 candidate oracle and never receives the expected plaintext or GT element (l.821–910). |
| L-R-03 independent authorities and working revocation (two authorities, same-user combination, pooled cross-user rejection; one-issuer compromise; separate epoch/update mechanism with retained access, costs and escrow) | Confirmed | — | `src/rw15/rw15.ts` transcribes RW15 in the authors' asymmetric placement: `K = g2^α H(GID)^y F(attr)^t`, `K′ = g1^t`, `C1 = e^λ·egga^{tx}`, `C2 = g1^{−tx}`, `C3 = g1^{y·tx} g1^ω`, `C4 = F(attr)^{tx}` (l.136–227); the row term `C1·e(C2,K)·e(C3,H(GID))·e(K′,C4)` reduces to `e^λ·e(g1,H(GID))^ω` by hand, so the ω-shares cancel only under one GID; `rwRawDecrypt` lets an adversary pick a different H input per row so the cross-GID failure is cryptographic, not a metadata check (l.287–318). `src/rw15/lsss.ts` compiles threshold trees to the LSSS with repeated attributes permitted. `src/revocation/epoch.ts` is the separate application-layer adaptation: fresh DEK, owner capsule, FAME header under `business AND Access epoch N`, complete key reissue per epoch, owner-assisted header-only rewrap with a zero `rewrapPayloadBytesWritten` counter, trusted checkpoint binding object/epoch/revision/header digest, executed cost ledger. |

**Code matches claim.** No simulated math. Every verdict on the RW15 and epoch panels is derived
from executed pairings/AEAD results; the cost counters increment from completed operations
(`src/ui/revocation.ts:545`). Controls can fail (mutations below).

**Source fidelity.** FABESA: Figure 5 plus §3.3 partially-hidden payload, one value per name, §3.4
multi-use extension excluded; the page's "The theorem and this browser adaptation are different
claims" panel states Theorem 4's ROM/DLIN scope and that the KEM/HKDF/AES-GCM wrapper is outside
it (`src/ui/fabesa.ts:977–1025`). RW15: group placement follows the authors' Charm
implementation; the page names the static ROM `q`-DPBDHE2 theorem and says the exposed-secret case
is narrower than the theorem's statically corrupt authorities (`src/ui/rw15.ts:793–833`). Epoch:
the page says "This is not RW15, not a revocable-ABE or revocable-storage-ABE construction, not
public ciphertext update, and not a FAME/RW15/revocation theorem" (`src/ui/revocation.ts:175,590`).

**Tests are real, with one caveat.** Fresh clone of `ab293fd0386f`: `npm ci` clean; Vitest 226/226
(8 files; matches the roadmap); `npm run build` succeeded; Playwright 39/39 (36 claim tests
including the FABESA, RW15 and epoch cases, 3 a11y/reflow drives at desktop/380/280 px).
**Caveat:** as with Shelf Oracle there is no committed mutation runner or CI mutation step; the
README "Proving the gates bite" table documents nine hand-applied mutations with their owning
gates and failure counts. I reproduced three in the scratch clone and restored them: constant GID
hashing → 2 RW15 failures; `AND`→`OR` epoch gate → 3 failures; unconditional checkpoint acceptance
→ 3 failures. All three counts equal the README's.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-attribute-gate/` serves
`index.html` `406e839b…`, `index-D9lzyOmQ.js` `a3d6c05f…`, `index-D6XbMU7M.css` `9ad65c11…`; all
three are byte-identical to a fresh build of main and equal the hashes the roadmap recorded for
L-R-03.

**Honest limits.** Both panels carry explicit theorem/adaptation boundaries, the FABESA candidate
count and sequential-trial leakage are stated, the retained-copy boundary of revocation is
labelled "not a revocation success" (`src/ui/revocation.ts:309`), and AES-GCM authenticity is
distinguished from freshness (l.391).

**Coherence.** Eleven exhibits: FAME setup through collusion (1–8), FABESA (9), RW15 (10), epoch
adaptation (11); the README describes all and the e2e "structural honesty" spec checks the page
states its own construction. The three constructions are kept visibly separate, which is the
roadmap's stated intent. No other lab implements policy-hiding, multi-authority or revocable ABE;
Lattice IBE is the post-quantum counterpart and links rather than duplicates. Nothing belongs
elsewhere.

**Findings and disposition**

1. **Medium** — Commit the nine documented mutations as a runner wired into CI with an evidence
   artifact; the hand-run evidence reproduces, but a future regression would go unnoticed.

## 9. Proof Tally — S04

Repo `crypto-lab-proof-tally`. Roadmap pin `f1220e93baa5`; current `origin/main` is
`9394e3fd3fd8` (#20, "Add exact abort and retry privacy lesson", the paper-review PR-06 item). The
`f1220e9..9394e3f` diff adds `src/distributed/abortModel.*`, `src/ui/abortModel.ts`, six verdict
recipes and CSS; the S04 modules (`exact.ts`, `noise.ts`, `parameters.ts`, `release.ts`,
`report.ts`, `ui/distributed.ts`) are unchanged.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| S04 compose secure aggregation with DP (disclosure from an exact aggregate; calibrated jointly generated noise; declared clipping/adjacency/sensitivity/distribution/accounting; corrupt or dropped participants; central vs local vs distributed/shuffled trust) | Confirmed | — | `src/distributed/exact.ts`: two real twelve-slot `Prio3Sum(50)` queries, the second with the target replaced by zero, differenced to reveal the quantized value (l.347–381). `src/distributed/noise.ts`: CKS Algorithm 1 `Bernoulli(exp(−γ))` and Algorithm 2 `Lap_Z(50)` over exact rationals with masked rejection sampling, no floating point in any sampling decision, cap `|Y| ≤ 4096` with abort-not-retry (l.209–266); activation `9/10` per honest client. `src/distributed/release.ts`: all-or-nothing committed cohort, abort on collusion, `< 6` honest, submission mismatch, partial delivery, duplicate nonce, preparation failure or bound violation; collector sees only cohort size, mechanism metadata and one noisy sum; one-release ledger (l.515–602). `src/distributed/parameters.ts`: clamp `[0, 250,000]`, floor to `$5,000`, Δ = 50, ε = 1, exact `(1/10)^n` activation term and the CKS Lemma 30 cap tail kept as separate accounting terms. The mechanism descriptor is bound into the Prio3 context (`report.ts:870–914`). |

**Code matches claim.** Real Prio3 (draft-22) remains untouched; the composition is exact-integer
arithmetic; the omniscient trace is checked against the collector release (`release.ts:609–648`)
and never placed in it. Controls can fail (mutations below).

**Source fidelity.** The sampler is a faithful transcription of Canonne–Kamath–Steinke Algorithms
1 and 2 (checked step by step: U uniform in `[0,t)`, accept with `Bern(e^{−U/t})`, geometric V
via `Bern(e^{−1})`, sign with negative-zero restart). The activation/threshold calibration is
labelled "Shi-inspired", not Shi et al.'s PSA theorem, in the README and roadmap. Shuffle DP is a
comparison only, as stated. The binary64 cap-tail bound is displayed separately from the exact
activation fraction, as the parameters module's comment requires.

**Tests are real.** Fresh clone of `9394e3fd3fd8`: `npm ci` clean; Vitest 170/170 (11 files);
`npm run build` succeeded; Playwright 35/35. Mutation design differs from the other labs and is
stronger in one respect: `e2e/verdict-mutations.json` records 70 recipes (64 at the S04 pin, 6
added by #20), every rendered `[data-verdict]` marker must have a recipe (`verdict-coverage` job,
required by `configure-pages`), and `e2e/global-teardown.ts` fails the suite if any recorded
kill's assertion did not execute. The full kill replay (`tools/verdict-kill.mjs verify`) is not a
routine CI step; the roadmap's "64/64 killed" came from a one-off delivery workflow that was
then removed, which the roadmap itself states. Unit-level spot-checks in the scratch clone,
restored afterwards: removing the negative-zero restart in Algorithm 2 → 1 failure (the test that
pins exactly that step); accepting partial delivery → 3 failures.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-proof-tally/` serves `index.html`
`707feb54…`, `index-Br3ozBA9.js` `388162ef…`, `index-CHHNvn-K.css` `3969859e…`; all three are
byte-identical to a fresh build of `9394e3fd3fd8`. The roadmap's S04 served-artifact table
(`index-CCx-HQPl.js`, `index-CQDLZL8C.css`) describes the pinned revision, not the current site.

**Honest limits.** The collector-visible panel states that honesty is an omniscient scenario
label Prio3 does not attest, that the cap decimal is a binary64 approximation displayed
separately, and that refusals release nothing; README states the composition is not Shi's PSA
system, DAP or shuffle DP, and that fewer than six honest contributors invalidates the
advertised `δ ≤ 10⁻⁶` term.

**Coherence.** Nine exhibits in one numbered path (README lists all nine, with S04 as exhibits 6
and 7 and the post-rollout abort model as 8). DP Noise owns the central/local mechanisms and is
linked as the comparison; no other lab composes Prio3 with DP. Nothing belongs elsewhere.

**Findings and disposition**

1. **Low** — Consider running `tools/verdict-kill.mjs verify` on a schedule or on `main` pushes,
   since the coverage gate proves every marker *has* a recipe but not that each recipe still
   kills.
2. **Low (ledger)** — Roadmap served-artifact hashes for S04 are one commit stale. See ledger.

## 10. DC-net — A-D-04 (new repository)

Repo `crypto-lab-dc-net`. Roadmap pin `8de5cb25042c`; current `origin/main` is the same commit.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| A-D-04 dining cryptographers (pairwise fresh masks, broadcasts, cancellation; participant and coalition possible-sender views under the declared key graph; simultaneous senders, malformed contributions, mask reuse with synchrony/disruption assumptions visible) | Confirmed | — | `src/dcnet/round.ts`: each participant's broadcast is `input ⊕ (incident edge masks)` with WebCrypto masks per edge; the aggregate is checked against the input XOR (l.195–232); `FreshRoundGuard` refuses a repeated round id or exactly repeated mask assignment on the honest path (l.245–283); `aggregateContributions` returns `malformed` (unknown/duplicate/wrong-width) or `aborted` (missing) distinctly (l.285–347); `analyzeCollision` reports parity and `outputDeterminesSenderCount: false`; `analyzeShapedJam` executes a correctly shaped dishonest byte and verifies the delta transfers to the aggregate. `src/dcnet/view.ts`: a coalition knows exactly the masks on edges incident to its members; `observerComponents` strips those masks and takes connected components of the remaining graph; `analyzeCoalition` derives compatibility of an exactly-one-sender hypothesis and a prior-preserving posterior (l.169–260); `enumerateOneBitViewDistribution` exhausts all `2^edges` one-bit mask assignments and `enumerateExactOneCandidateEvidence` compares view distributions between candidate senders (l.316–430). `src/dcnet/failures.ts`: mask reuse recovers the second round's inputs only under full reuse plus a known-empty first round; dropout computes the boundary-edge equation; `reformGraphAfterDropout` requires fresh masks. `src/dcnet/commitment.ts`: SHA-256 commit-all-then-reveal with 32-byte nonces and canonical framing over session, round, graph, participant and contribution. |

**Code matches claim.** No simulated math; every displayed total, component and posterior is
derived from the executed round, and the exhaustive one-bit enumeration is real (fixed at ≤ 20
edges). Controls can fail (mutations below).

**Source fidelity.** Chaum 1988 with a fixed five-cycle key graph and byte-vector messages; the
page states the information-theoretic claim is conditional on the declared graph, independent
uniform one-use masks, synchrony and observer knowledge, that WebCrypto is a concrete stand-in for
ideal masks, and that the SHA-256 commitment provides neither formal hiding nor Dissent/Verdict
accountability (`src/ui/app.ts:154–187`, `src/ui/disruption.ts:200–266`). Parity-is-not-a-headcount
is stated at `src/ui/app.ts:124–125` and `src/ui/collisions.ts:45–46`.

**Tests are real.** Fresh clone of `8de5cb25042c`: `npm ci` clean; Vitest 44/44 (5 files);
`npm run build` succeeded including `scripts/verify-build.mjs`; Playwright 23/23 (11 learner-claim
and 12 accessibility/reflow tests, matching the roadmap). `scripts/claim-mutations.mjs` holds 22
named mutations `AD04-M01`–`M22` run in CI with an uploaded artifact. Spot-checks in the scratch
clone, restored afterwards: restricting a coalition's known edges to edges with both endpoints
inside it → 2 failures; claiming input recovery without full reuse (AD04-M07) → 1 failure.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-dc-net/` serves `index.html`
`7d1dd6a9…`, `index-DP2EGcYv.js` `3641b640…`, `index-qb-UxXWT.css` `518648a0…`; all three are
byte-identical to a fresh build of main and equal the hashes the roadmap recorded.

**Honest limits.** The "Assumptions and nonclaims" panel lists required assumptions and what is
not provided (no message confidentiality, no source authentication, no receiver anonymity, no
Sybil resistance, no erasure proof, one browser origin). README matches.

**Coherence.** Seven sections in one path (round, views, collisions, disruption, dropout and
reformation, commit/reveal, mask reuse and late disclosure); the README exhibit list covers them.
No other catalog lab implements a DC-net; Sphinx Mix and Blind Relay are different anonymity
mechanisms and are linked as comparisons. Nothing belongs elsewhere.

**New-repo justification: Yes, justified.** The roadmap's candidate hosts (Sphinx Mix, Blind
Relay, Silent Tally) teach packet formats, split-operator relaying and private aggregation; a DC-net
is an information-theoretic broadcast primitive with its own key-graph model, observer analysis
and failure modes, and ~6.4k lines of source and tests. Folding it into a mix-net lab would put
two unrelated anonymity mechanisms under one intro; a focused lab fits the one-concept rule.

**Findings and disposition**

No defects or overclaims found.

## 11. HPKE Envelope — S01

Repo `crypto-lab-hpke-envelope`. Roadmap pin `fcf3b56c06e1`; current `origin/main` is the same
commit.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| S01 signcryption (named construction beside HPKE Auth with both identities and context bound; sender/recipient compromise outcomes; forwarding and transferable vs recipient-only evidence) | Confirmed | — | `src/signcryption/ste.ts`: An–Dodis–Rabin multi-user Sign-then-Encrypt with strict RFC 8032 Ed25519 (`zip215: false`, l.283–291) over a length-framed tuple (sender, recipient, context, message) and Base HPKE whose `info` and AAD bind the same outer identities and context (l.302–333); `designcrypt` requires an independently expected sender record and context and releases plaintext only when signature and every binding agree, keeping rejected plaintext in a separate `diagnosticFields` quarantine (l.355–427); `verifyTransferEvidence` checks the signature under the pinned key without any HPKE secret (l.430–467); `forwardToAnotherRecipient`/`rewrapSignedPayload` and `forgeAfterRecipientCompromise` are the executable compromise cases. `forgeAuthAfterRecipientCompromise` (l.626–651) is RFC 9180 §9.1.1 exactly: with `skR` and public `pkS`, run `AuthDecap(fresh enc, skR, pkS)`, derive the Auth-mode key schedule and seal, never touching `skS`. |

**Code matches claim.** Real HPKE (the lab's RFC 9180 KAT-tested implementation) and noble
Ed25519; every matrix cell on the page is the result of executing one of these helpers. Controls
can fail (mutations below). The replay case is reported as an alarm with "no replay cache is part
of this profile" rather than hidden (`src/ui/signcryption.ts:399–408`).

**Source fidelity.** The StE profile follows ADR 2002's multi-user syntax (identities inside the
signed tuple and bound again in the outer encryption); the page states it is "not a standardized
wire format, a production protocol, or a claim that the paper's proof transfers automatically to
this code" and that names resolve to pinned keys outside the packet (`src/ui/signcryption.ts:134–144`).
The KCI case cites §9.1.1 and the page's compromise matrix separates recipient-key, sender-key and
combined compromise with the correct consequences (`matrixRow`, l.208).

**Tests are real.** Fresh clone of `fcf3b56c06e1`: `npm ci` clean; Vitest 258/258 (6 files,
including 19 S01 construction tests and the RFC 9180 KATs); `npm run build` succeeded; Playwright
27/27. `scripts/signcryption-mutations.mjs` holds 19 named mutations run in CI from a passing
baseline. Spot-checks in the scratch clone, restored afterwards: accepting every decrypted
signature → 3 failures; skipping the expected application-context binding → 1 failure.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-hpke-envelope/` serves
`index.html` `a785fd3b…`, `index-BP0y25b8.js` `97a532ad…`, `index-CObJQuzx.css` `bb8e0776…`; all
three are byte-identical to a fresh build of main and equal the hashes the roadmap recorded.

**Honest limits.** The page states the evidence is narrow (proves only that the pinned key signed
the disclosed fields; not ciphertext authorship, transmission, receipt, time, human intent or
legal non-repudiation), that replay and identity distribution are application responsibilities,
and that public verifiability is not a property of every signcryption scheme. README matches.

**Coherence.** Six exhibits in one path; S01 is exhibit 5 ("Sender evidence under compromise")
and exhibit 6 keeps the RFC's own §9.7 non-goals. Protocol Compose and Iron Letter are linked as
companions and not duplicated (they do not execute KCI or StE). Nothing belongs elsewhere.

**Findings and disposition**

No defects or overclaims found.

## 12. LFSR Forge — A-D-05, A-D-11, A-D-12 (and M-LFSR)

Repo `crypto-lab-lfsr-forge`. Roadmap pins `7c6246133b9e` (A-D-05), `66d95370b0a3` (A-D-11),
`c4ef2da4b33f` (A-D-12, also the M-LFSR catalog pin). Current `origin/main` is `c4ef2da4b33f`;
the earlier pins are its direct ancestors and each lesson lives in its own module directory.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| A-D-05 Boolean combiner audit (editable truth table; balance, ANF degree, full Walsh spectrum; fixed-subset correlation immunity/resiliency; bounded annihilator search; counterexamples) | Confirmed | — | `src/boolean/analysis.ts`: Möbius transform for ANF (l.70–77), fast Walsh–Hadamard (l.90–104), nonlinearity `8 − max|W|/2`, correlation immunity from Walsh zeros cross-checked against an independent enumeration of every fixed-subset restriction (`enumerateRestrictions`, `checksAgree`), and an exhaustive degree-≤2 annihilator search over 2,047 polynomials per side against `f` and `1+f` (l.135–160). `src/boolean/attacks.ts`: BM parity fit with 64-bit forecast, 127-state R4 scan, 7×15 R1/R2 pair scan; workers receive only public output (`panel.ts` boundary). Unit test checks all 65,536 four-input tables against direct evaluation. |
| A-D-11 cube sum and superpoly (evaluate every assignment of a public cube; recover and validate each superpoly incl. non-maxterm C34; independent equations recover the toy secret; held-out verification) | Confirmed | — | `src/cube/oracle.ts`: explicit degree-4 polynomial over 4 public and 3 secret bits; `src/cube/analysis.ts`: preprocessing exhausts 4 two-variable faces × 8 keys (128 evaluations, 72 distinct rows), Möbius-derived superpolys, `maxterm: degree === 1`, affine equations with constant moved to the right-hand side, Gaussian rank, exhaustive 8-key filter, four disjoint held-out rows. The page says C34 is a valid cube excluded only from the affine solve and that no Trivium state or round is executed (`src/cube/panel.ts:40–45`). |
| A-D-12 A5/1 and irregular clocking (predict and execute majority clocking vs regular; separately labelled historical mode with correct key/frame initialisation and register distinctions; bounded known-state experiment) | Confirmed | — | `src/a51/a51.ts`: registers 19/22/23 with taps {13,16,17,18}, {20,21}, {7,20,21,22}, clock bits 8/10/10, majority rule, BGW setup order (clock-all then XOR into bit 0 for 64 key bits LSB-first per byte, then 22 COUNT bits, then 100 output-disabled majority clocks), output after clocking; pinned BGW source commit and file SHA-256 (l.29–34); `runBgwVector` reproduces both consecutive 114-bit bursts. `src/a51/recovery.ts`: 52 disclosed + 12 guessed bits, 4,096 completions filtered by up to 32 observed bits under majority or regular clocking, held-out 32-bit prediction. |
| M-LFSR catalog mapping | Confirmed | — | The hub's `tools/catalog-exhibits.json` pins LFSR Forge at `c4ef2da4b33f` (verified in the ledger section). |

**Code matches claim.** No simulated math; every table, spectrum, superpoly and candidate count
is computed from the executed definitions, and the three attack workers receive only public
observations (the panels post masked evidence; mutations "hidden state crosses worker boundary"
guard that). Controls can fail (below).

**Source fidelity.** Boolean: Siegenthaler/Xiao–Massey criteria with the stated
independent-uniform-input assumption and deterministic LFSR agreement measured separately
(`src/boolean/panel.ts:32–37`). Cube: Dinur–Shamir preprocessing/online structure on a toy
oracle; the source carries a note claiming the paper's introductory example is internally
inconsistent (`src/cube/oracle.ts:11–14`) — I did not verify that claim against the paper; the
lesson does not depend on it. A5/1: the reverse-engineered BGW definition, with the page stating
that ETSI documents only the external interface, that COUNT conversion from TDMA frame numbers is
not implemented, and that the exercise is not a published attack and does not recover Kc
(`src/a51/panel.ts:25,92–121`).

**Tests are real.** Fresh clone of `c4ef2da4b33f`: `npm ci` clean; Vitest 47/47 (7 files);
`npm run build` succeeded; Playwright 23/23 (nine panels at 380 px plus the four extensions at
320 px). `scripts/mutation-check.mjs` holds 33 named mutations (matches the roadmap), runs in CI
and uploads `docs/mutation-results.json`. Spot-checks in the scratch clone, restored afterwards:
inverting the majority advance rule → 6 A5/1 failures; flipping the Walsh butterfly sign → 2
failures; dropping the cube affine constant → 3 failures.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-lfsr-forge/` serves seven files
(`index.html` `b84bbaf3…`, `index-BZ3uNSFa.js` `34629f08…`, `index-CpQWM6Fs.css` `3c523c0d…`,
four workers `b5c78d22…`, `c25a05e9…`, `57d8fbab…`, `0e5373be…`); all are byte-identical to a
fresh build of main and equal the hashes the roadmap recorded for A-D-12.

**Honest limits.** Each panel ends with an assumptions/limits block: independent-uniform
probabilities vs measured LFSR agreement, tiny exhaustive scans not production fast-correlation
attacks, AI 2 not excluding fast algebraic attacks; cube lesson not a Trivium attack; A5/1 lesson
not a published attack, no Kc recovery, no modern cellular claim.

**Coherence.** Nine panels in one lab (LFSR, BM, Geffe, Trivium, Boolean, cube, A5/1 among
them). The lab's intro names them and the a11y spec drives all nine; the three rollout panels are
separately labelled and do not borrow each other's credit (the cube panel explicitly refuses the
Trivium claim). Air Stream (SNOW 3G/ZUC) and Matsui Line/AES Anatomy (LAT/DDT) remain separate;
nothing is duplicated and nothing belongs elsewhere.

**Findings and disposition**

1. **Low** — The `src/cube/oracle.ts` note asserting an inconsistency in ePrint 2008/385's
   introductory example is a claim about a source that the lab makes visibly; it should either
   quote the exact expression and face sum it refers to or be softened, since a reader cannot
   check it from the page.

## 13. SAT Break — no roadmap proposal

Repo `crypto-lab-sat-break`, current `origin/main` `9dffc06332e5` (10 commits; latest two are
dependency bumps). The encyclopedia roadmap does not mention SAT Break or any proposal targeting
it (grep over `docs/encyclopedia-roadmap.md` returns nothing), so steps 1–4 of the brief have no
claims to verify here. The lab is carded in the hub (`index.html`, README, concept-coverage
Version 26 under §30) through the ordinary catalog path, not the rollout. Light check only:
fresh clone, `npm ci` clean, Vitest 65/65 (7 files), `npm run build` succeeded (Vite plus the
CaDiCaL WASM artifacts), and the served `index.html`, CSS and entry JavaScript at
`https://systemslibrarian.github.io/crypto-lab-sat-break/` are byte-identical to the fresh build
(the WASM, worker and licence files were not fetched). No roadmap verdict is recorded. If the
intent was to audit SAT Break's own claims (CaDiCaL-backed key recovery, function-recovery-is-
not-key-identity), that is a separate review outside the rollout ledger.

## 14. Clock Arithmetic — L-R-01

Repo `crypto-lab-clock-arithmetic`. Roadmap pins `e6e1e39b124c` (implementation) and
`b97b515033e2` (theme-pin correction, current exact main). Current `origin/main` is
`b97b515033e2`; the diff from the implementation merge is the one-line root theme pin the roadmap
describes.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| L-R-01 Montgomery multiplication (ordinary vs Montgomery on identical odd moduli with cancellation, radix shift and final subtraction exposed; encode, chain products/squares, decode; setup vs repeated cost measured separately; invalid modulus/radix refused; fixed-work comparison labelled by what executed) | Confirmed | — | `src/nt/montgomery.ts`: `computeNPrime` by extended Euclid (`N·N′ ≡ −1 mod R`), `createMontgomeryContext` refusing even `N`, `N > 10¹²`, non-power-of-two `R` and `R ≤ N` (l.72–89); `redcTrace` exposes `T mod R`, `m`, `m·N`, the cancelled low word (asserted zero), the shifted candidate (asserted `< 2N`) and the optional final subtraction (l.93–118); encoding executes `REDC(x·R² mod N)` (l.149–160); `montgomeryChain` stays encoded until one final REDC; `ordinaryFixedWork`/`montgomeryFixedWork` run the same alternating multiply/square schedule (l.197–225); `validateCriticalRegression` pins `N=9, R=16, T=9 → candidate 9, subtract, result 0`. `src/ui/act7.ts` reports setup, ordinary loop, Montgomery loop and final decode as four separate `performance.now()` phases (l.52–73) and states the measurement is "not a benchmark, a speedup claim, or evidence of constant-time behavior" (l.122). |

**Code matches claim.** Exact BigInt arithmetic; every displayed value in Act 7 is a field of the
executed trace; the independent check recomputes the product with a separately normalised native
remainder. Controls can fail (below).

**Source fidelity.** Montgomery 1985 power-of-two specialisation; the page distinguishes
Montgomery multiplication from the Montgomery ladder and states that setup still uses extended
Euclid and `R² mod N`. The roadmap's independent-audit note (REDC trace corrected; theme pin
fixed in PR #4) matches the git history.

**Tests are real.** Fresh clone of `b97b515033e2`: `npm ci` clean; Vitest 59/59 (2 files;
`montgomery.test.ts` alone is 581 lines and exhausts every valid `T` for `N=17` and every input
pair for every odd modulus through 99); `npm run build` succeeded; Playwright 40/40 including the
five Montgomery refusal cases. `scripts/check-mutations.mjs` runs in CI ("Concrete mutation
gate") and uploads `mutation-evidence.json`; the README records 38 mutations including ten
Montgomery cases, and the roadmap's exact-main run reports "38 of 38 killed". Spot-checks in the
scratch clone, restored afterwards: never performing the final subtraction → 10 failures;
corrupting `m` and removing the cancellation assertion → 20 failures.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-clock-arithmetic/` serves
`index.html` `d9bc21ae…`, `index-D-vmyr9P.js` `45ed8d86…`, `index-CTLa0hFP.css` `a8c909be…`,
`worker-BbCcbt6a.js` `a4424e35…`; all four are byte-identical to a fresh build of main and equal
the hashes the roadmap recorded.

**Honest limits.** Act 7's "Scope and limits" block: BigInt is not constant-time; timing is a
single Worker observation of this implementation including its trace-object work; odd `N` and
supplied power-of-two `R > N` only; teaching code, not production cryptography.

**Coherence.** Seven acts in one path; the README lists all seven with Montgomery as Act 7. Timing
Oracle names the Montgomery ladder, which this lab explicitly distinguishes; no duplication.
Nothing belongs elsewhere.

**Findings and disposition**

No defects or overclaims found.

## 15. Hidden Bit — E-K-04, S09

Repo `crypto-lab-hidden-bit`. Roadmap pins `7f143a4e9403` (E-K-04) and `2f1ea68ada54` (S09).
Current `origin/main` is `2f1ea68ada54`; `7f143a4e9403` is its parent and the `src/proofs/`
modules are unchanged between them.

| Proposal | Verdict | Severity | Evidence |
| --- | --- | --- | --- |
| E-K-04 guided adjacent hybrids naming each exact rewrite / assumption / bad event with a derived cumulative advantage; exposed predicate under a separately stated one-wayness assumption; `(f(x), r)` inner-product construction with the biased-predictor reconstruction; finite vs asymptotic distinguished | Confirmed | — | `src/proofs/hybridLedger.ts`: typed H0–H5 path with `exact` / `assumption` / `bad-event` kinds, a symbolic `Adv_AES^PRP` term that is never numericised, and the switching term `q(q−1)/2^129` (l.113–167); `validateAesHybridSequence` refuses a skipped hop or a relabelled kind (l.199–217). `src/proofs/oracles.ts`: real memoised AES-128, lazy ideal permutation (sampled without replacement, no retry cap) and lazy random function. `src/proofs/hardcore.ts`: `G(x,r) = (f(x), r)` with the deliberately easy first-bit predicate and `⟨x,r⟩ mod 2`. `src/proofs/goldreichLevin.ts`: Rackoff-style reconstruction with ℓ = ⌈log₂(n/ε² + 1)⌉ samples, 2^ℓ−1 subset XORs, per-bit majority votes over all 2^ℓ σ guesses, and candidates accepted only through `verifyPreimage(candidate, y)`; the routine never receives `x` (l.86–162). |
| S09 target-collision order game (one small keyed family under target-before-key and collision-after-key; legal moves enforced; a strategy whose legality or success changes with the order; signed `(key, hash)` and target-collision statement without extrapolation) | Confirmed | — | `src/game/tcr.ts`: `H_s(x) = h(x ⊕ s)` over 8 bits with the planted-pair and nibble-fold families; two state machines whose every move is adjudicated with a reason, including the refused second commit in `spray-multi` and the explicit forfeit (l.117–272); `exactAnalysis` enumerates all 256 keys for the selected strategy (2/256 target-first vs 256/256 key-first for `plant-shift`, checked by hand: the target 0xF0 lands on the planted pair only for `s ∈ {0x00, 0xFF}`), and separately reports family winnability by mask symmetry (l.481–523); Wilson interval on the raw win rate, not the ±1 advantage. The page states "not a UOWHF construction or an asymptotic separation proof" and "No asymptotic claim" (`src/ui/tcr.ts:183–184`). |

**Code matches claim.** The AES term stays symbolic; the hybrid oracles are real; the GL decoder
has no access to the preimage; the TCR machines decide outcomes, not the strategies ("the
machine's accept/refuse decision — never the strategy's expectation — decides"). Controls can
fail (below).

**Source fidelity.** Hybrids follow the code-based game-playing / Joy of Cryptography adjacent-hop
discipline with the standard switching-lemma bound `q(q−1)/2^{n+1}` at n = 128. GL follows
Goldreich's Appendix C.2 pairwise-independent reconstruction. S09 follows Naor–Yung's
target-before-key definition and cites Rompel; the page distinguishes CR, SPR and TCR and keeps
the signed `(s, H_s(x))` statement (`src/ui/tcr.ts:161–176`). The bounded fixtures (8-bit inputs,
an artificial predictor wrong only at the all-zero `r`) are stated as fixtures on the page and in
the README.

**Tests are real.** Fresh clone of `2f1ea68ada54`: `npm ci` clean; Vitest 148/148 (18 files, with
coverage); `npm run build` succeeded (36 output files including fonts); Playwright 51/51 (claims,
verdict coverage over every rendered `[data-verdict]`, a11y). `mutations/registry.json` records 52
recipes (26 for E-K-04/S09) and `.github/workflows` runs both the rendered-coverage gate and the
full kill sweep (`npm run test:mutations`) as a required job before deploy; this is the strongest
mutation wiring in the rollout. Spot-checks in the scratch clone, restored afterwards: ignoring
the σ parity in GL voting → 1 failure; counting a forfeit as a TCR win → 10 failures; changing
the switching denominator to 2^128 → 4 failures.

**Live bytes.** `https://systemslibrarian.github.io/crypto-lab-hidden-bit/` serves `index.html`
`f5c041fb…`, `index-DDa90dfw.js` `d72cc772…`, `index-Bdizl19y.css` `6d60a953…`; all three are
byte-identical to a fresh build of main (the two font files were not fetched).

**Honest limits.** Exhibit 7: "Bounded fixture: eight-bit inputs are exhaustible and do not
instantiate an asymptotic one-way function"; "This bounded run does not prove one-wayness or
unique recovery". Exhibit 8: finite order-game model, no asymptotic claim, no real-hash claim,
malicious-signer boundary retained.

**Coherence.** Eight exhibits in one lab; the README lists all eight with E-K-04 as 7 and S09 as 8
and says explicitly that neither supplies the other's credit, matching the roadmap's coordination
note. Hash Zoo covers hash properties and is linked, not duplicated. Nothing belongs elsewhere.

**Findings and disposition**

No defects or overclaims found.

## 16. IPsec / IKE — E-K-03 (new repository)

Roadmap pin `3019cef4c514` (PR #1 `6644abcb691b`, PR #2 `3019cef4c514`). Fresh clone of `crypto-lab-ipsec-ike` main is `3019cef4c514`, identical to the pin. `6644abcb691b..3019cef4c514` touches only `.github/workflows/codeql.yml` and the theme pin in `index.html`.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| E-K-03 ordered SPD with first-match, bypass/discard/protect | Confirmed | — | `src/protocol/spd.ts` `applySpd` first-match over ordered entries, `lookupRoute`, `intersectTrafficSelectors`; `spd.test.ts` |
| E-K-03 four-message PSK IKEv2 (IKE_SA_INIT + IKE_AUTH) with X25519, SKEYSEED, prf+, AUTH | Confirmed | — | `src/protocol/ike.ts` `prfPlus` (RFC 7296 §2.13), `deriveIkeKeys` (SKEYSEED = prf(Ni‖Nr, g^ir); KEYMAT = prf+(SKEYSEED, Ni‖Nr‖SPIi‖SPIr) split SK_d/SK_ai/SK_ar/SK_ei/SK_er/SK_pi/SK_pr), `computePskAuth` = prf(prf(PSK,"Key Pad for IKEv2"), signedOctets), `buildSignedOctets`; peer independently runs `verifyReceivedIkeAuth` |
| E-K-03 Child KEYMAT = prf+(SK_d, Ni‖Nr), initiator keys first | Confirmed | — | `deriveInitialChildKeys` 40 bytes, first 20 → initiator-to-responder (16-byte key + 4-byte salt); mutation EK03-M05 swaps nonce order → 1 failure in `ike.test.ts` |
| E-K-03 ESP AES-GCM-16/128 with SPI‖seq AAD and sequence-derived explicit IV (RFC 4106) | Confirmed | — | `src/protocol/esp.ts` `EspSender` AAD = `u32be(spi)‖u32be(sequence)`, IV = `u64be(sequence)`, nonce = salt‖IV, repeated-nonce refusal, minimal padding; `primitives.test.ts` pins AES-GCM Test Case 4 |
| E-K-03 receive order SAD lookup → replay precheck → authenticate → commit window | Confirmed | — | `receiveEspPacket`: shape → SAD → `replayPrecheck` (non-mutating) → AES-GCM open → `commitReplay` only after auth → trailer checks; own mutation making `replayPrecheck` ignore the bitmap → 3 failures in `esp.test.ts`; EK03-M17 (commit before auth) is recipe 17 in `scripts/claim-mutations.mjs` |
| E-K-03 Child SA rekey with fresh SPIs/keys/salts/counters, old SA deleted | Confirmed | — | `src/protocol/rekey.ts` `deriveChildRekeyKeys` = prf+(SK_d, Ni'‖Nr'), `runChildSaRekey` (REKEY_SA 16393, distinct SPIs, CREATE_CHILD_SA), `runChildSaDelete` (INFORMATIONAL) |
| E-K-03 transport/tunnel negotiation (USE_TRANSPORT_MODE echo, tunnel fallback, delete) | Confirmed | — | `negotiateMode` in `ike.ts`; `ike.test.ts` covers echo, fallback and delete-required paths |
| E-K-03 pinned RFC vectors and CI mutation gate | Confirmed | — | RFC 7748 §6.1 Alice/Bob and RFC 8031 App. A in `x25519.test.ts`; RFC 4231 case 1, SHA-256 "abc", GCM TC4 in `primitives.test.ts`; 17 recipes EK03-M01..M17 run in `deploy.yml` step "Focused protocol-claim mutations" |

**Code matches claim.** Every protocol step is computed from real primitives (WebCrypto AES-GCM/HMAC/SHA-256, own X25519 ladder with RFC 7748 vectors). No displayed-but-not-computed values were found; the UI renders the handshake transcript, SAD and replay window produced by the protocol modules. The replay window is a real 64-entry bitmap, not a counter. X25519 all-zero refusal is a local policy flag (`rejectAllZero`) and is described as such.

**Source fidelity.** Key schedule, AUTH payload construction, prf+, REKEY_SA and INFORMATIONAL exchanges follow RFC 7296; ESP AEAD framing follows RFC 4106/4303 (8-byte explicit IV, 4-byte salt, 16-byte ICV, AAD = SPI‖sequence, 64-packet anti-replay window). Deviations are declared in the README: no certificates/EAP, no IPv6, no NAT-T, no fragmentation, no MOBIKE, single proposal, no AH, no ESN, no TFC padding, no kernel integration, IPv4 TEST-NET fixtures only.

**Tests are real.** `npm ci` clean; Vitest 102/102 across 13 files; `npm run build` emits 1 HTML, 1 JS, 1 CSS; Playwright 7/7. Mutation spot-checks: EK03-M05 (Child KEYMAT nonce order) → 1 failure; replay-bitmap ignore → 3 failures. Both restored, working tree clean.

**Live bytes.** `index.html` sha256 `9155bd8a…`, `assets/index-BlI0rWKj.css` `2cbde720…`, `assets/index-CU-up2_W.js` `58bbfefa…` served from GitHub Pages are byte-identical to a fresh build of main.

**Honest limits.** README says "Do not use it to protect real traffic", lists the omitted protocol features, and states that constant-time behaviour of the hand-written X25519 ladder is not claimed. No security theorem is overclaimed; the lesson text presents IKEv2 as the RFC specifies it rather than as a proof.

**Coherence.** One learner path (SPD → IKE_SA_INIT → IKE_AUTH → ESP → replay → rekey → delete) and the intro names each exhibit. No duplication with other labs: Noise Pipe covers a different handshake family and HPKE Envelope covers a different KEM/AEAD composition.

**New-repo justification: Yes.** IPsec/IKEv2 is a distinct protocol family with its own key schedule, packet format and SA lifecycle; the only candidate host (Noise Pipe) models a different protocol and would have doubled in size with unrelated code. The repo is self-contained with its own vectors, CI mutation gate and Pages deploy.

**Findings and disposition.**
1. None. All eight E-K-03 criteria are confirmed at the pin and on current main.

## 17. Matsui Line — A-D-14

Roadmap pin `7a85fbf1e6f` (PR #26). Fresh clone of `crypto-lab-matsui-line` main is `7a85fbf1e6f5`, identical to the pin (no commits since).

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| A-D-14 join a differential prefix to a linear suffix at an explicit intermediate state on one toy cipher | Confirmed | — | `src/crypto/difflin.ts:136–161` enumerates the DDT row of ΔX=0x0b through the real permutation to the round-2 input; `suffixMap` (`:224`) is round 2 of the shared SPN; `runDlAttack` (`:310`) encrypts chosen pairs with `encrypt(…, DL_ROUNDS=3)` from `spn.ts` |
| A-D-14 combined statistic over chosen pairs vs its stated heuristic and a failing-assumption control | Confirmed | — | `naiveBias` = 2pε² (BDK 2002), `pathAwareBias` = Σ wᵢ·bias_i against one fixed RHS, measured count from real ciphertexts; CANCELLED design (λin=0x04) is the control; independent recomputation from `sbox.ts`/`permutation.ts`/`spn.ts` only (auditor script, see below) reproduces 9/64, 9/32, 1/16, 0, and full-codebook 1/4-or-5/16 / control 0 |
| A-D-14 bounded subkey ranking verified independently | Confirmed | — | 256 hypotheses for the byte-spanning mask, 16 for the one-nibble control (`subkeyCandidates`); holdout = `pairs.slice(budget)` disjoint from the attack set; `holdoutConfirms` compares winner against every other hypothesis on fresh pairs; mutation "holdout reuses the attack pairs" killed (3 unit failures, owning browser test red) |

**Code matches claim.** Auditor recomputation, using only the primitive modules and never `difflin.ts`: DDT row for 0x0b = {2:8, 5:2, 7:2, d:2, f:2} (designated path probability 1/2, also checked by hand against the Heys table); suffix correlations −3/4 (0x02→0x4c) and −1/2 (0x04→0xc0); naive heuristics 9/64 and 1/16; signed path sums 9/32 (terms 1/4, 1/2, 1/4, 1/4, 1/4 all with RHS 0) and exactly 0 for the control (terms 0, +1/2, 0, −1/2, 0 — the two half-weight paths carry opposite RHS and cancel); full-codebook pair statistic with the true K4 is 104/128 (5/16) or 96/128 (1/4) across keys 0x3a94, 0x4000, 0x0000, 0x1234, 0x0387, while the control is 64/128 (bias 0) for every key. The committed test `exhaustively bounds the full-codebook biases across all 65,536 master keys` (32,768 keys each at 96 and 104; zero nonzero controls) passed in the run below. The success-curve measurement is deterministic (keys i·129 mod 2¹⁶) and the page says so.

**Source fidelity.** Langford–Hellman (CRYPTO '94) 2ε² for a probability-one prefix and Biham–Dunkelman–Keller (ASIACRYPT 2002) 2pε² are stated correctly; the module header and README name the off-path-random assumption BDK make and show where it fails on this toy in both directions (upward for the aligned design, to exact cancellation for the control). Lu 2010 §3.1 is cited for the generalisation. No deviation from the sources beyond the toy scale, which is disclosed everywhere.

**Tests are real.** `npm ci` clean; Vitest 122/122 across 8 files; `npm run build` typechecks then emits 5 files; Playwright 32/32 (30 behaviour + 2 axe/reflow). `scripts/check-mutations.mjs` is a committed runner with 15 recipes; each requires a green baseline on a hashed artifact, a non-empty diff, a moved bundle hash, an assertion failure (timeouts and crashes rejected) in the single named owning browser test served from the exact mutant artifact via `vite preview --outDir`, and an identical restored hash. It runs in `deploy.yml`'s `build` job, which `deploy` and `dependabot-auto-merge` both `needs:`. Spot-checks: "last-round peel uses the forward S-box" → 9 unit failures and owning browser test `the aligned composition recovers the last-round byte` red (`toHaveClass('verdict is-broken')`), bundle `98be069b…`→`9bd4abbc…`; "holdout reuses the attack pairs" → 3 unit failures and owning test `the holdout verification confirms the winner` red (`54 / 64` missing), bundle →`859c88fd…`. Restored bundle hash equals baseline; working tree clean.

**Live bytes.** All five served files (`index.html` `34c484f6…`, `index-BjF3zr3x.js` `98be069b…`, `index-Bsjm4N1e.css` `dcf15b92…`, both workers) are byte-identical to a fresh build of main and to the hashes the roadmap records.

**Honest limits.** Hero: "an 8-bit toy block cipher, not production cryptography. This page does not execute an attack on full DES." Exhibit 10 "What this is, and what it does not prove" and exhibit 9 copy state: fixed masks not claimed optimal, no attack on the full four-round toy, no master-key recovery, not a reproduction of Langford–Hellman's DES attack, deterministic 512-key sample is not a population estimate, ties count as partial recovery only.

**Coherence.** One learner path: cockpit → mechanism → cipher → LAT → piling-up → multiple masks → traffic → pair-mate comparison → differential–linear → limits, numbered 1–10 as `h2` steps with a five-entry wayfinder; the README enumerates all ten. The differential–linear exhibit shares the toy SPN with Biham Lens and reuses this lab's LAT machinery, so it belongs here rather than in a new repo; nothing duplicates Biham Lens, which this exhibit cites as its prefix source.

**Findings and disposition.**
1. Low — `src/ui/difflin.ts:275` renders the control verdict's "exact signed path sum is **0**" as a literal, and `:168`/`:279` state "1/4 or 5/16" and "recovers that nibble 0 times at 96 and 128 pairs" as prose, although `pathAwareBias` is computed at `:134` for the heuristic stack and the unit suite pins all three facts (including the 65,536-key exhaustive proof). The statements are true and tested but not derived on the page. Disposition: render `aware` in the verdict sentence (or mark the sentence as a pinned fact) so the control panel shows no number the page did not compute.

## 18. Signature Gate (crypto-lab-confirmer-signatures) — A-D-09

Roadmap pin `db6695e0f136` (PR #15). Fresh clone main is `db6695e0f136`, identical to the pin. This repository is the fleet's deliberate exception: no `dependabot.yml`, no auto-merge, dependencies pinned through `pin-dcs-real-lock-once.yml`, and Pages publication gated on a Lean proof check (`publish-preview` needs both `prove-scope-and-build` and `check-formal-model`). Not audited against the step-5 automation greps, by design.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| A-D-09 compute the paper's semantic disjunction with either the statement witness or the designated verifier's secret | Confirmed | — | `research/real-pairing/designated-verifier.mjs:195` `proveWithWitness` (c = G1^w·y_B^r, T_src = D^t, T_tgt = B^t, d = t + x(h+w)) and `:225` `proveWithVerifierSecret` (c = G1^α, T_src = D^d·C^−β, T_tgt = B^d/A^β, w = β−h, r = (α−w)/x_B); hand-checked against JSI '96 §5 pp. 149–150 with g,y_A,m,s ↦ D_j,C_j,B_j,A |
| A-D-09 both prover and verifier create accepting proofs; show what an outside observer cannot establish | Confirmed | — | one `verifyDesignatedProof` (`:272`) accepts both paths; `simulatorRandomnessOfProof` (`:256`) exposes the (w,r,t)↦(d,α,β) bijection; `observerView` (`:374`) is structurally public-only; the UI's false-statement route (`app.mjs:230–247`) forges an accepted proof of a message Alice never signed |
| A-D-09 compare with a separately bounded public proof and the existing interactive exchange | Confirmed | — | `provePublicTransferable`/`verifyPublicTransferable` (`:323–367`) use a separate hash domain and claim only equation validity; the interactive exchange (`confirmation.mjs`) remains chapter 4; `DESIGNATED-VERIFIER.md` table "Three ways to prove the same statement" |

**Code matches claim.** Real BLS12-381 Type-3 arithmetic via `@noble/curves` with raw order-q subgroup checks (`core.mjs:44` `isTargetGroup` uses `GT.pow(value, Q)` unreduced; `pointTimes` handles zero scalars). Algebra verified by hand: on the witness path D^d = D^t·(D^x)^{h+w} = T_src·C^e and B^d = T_tgt·A^e; on the simulator path c = G1^{w+x_B r} = G1^α and both equations hold for any A, C, which is exactly why a false statement verifies. The bijection α = w + x_B r, β = h + w, d = t + xβ is invertible when x_B ≠ 0 and the transcript (c, T_src, T_tgt) is the same function of (α, d, β) on both sides, so the identical-distribution claim is exact on a true statement. No displayed-but-not-computed verdicts: every verdict string in `app.mjs` chapter 5 is gated on `verdict.accepted` or an `observerView` result. The one hard-coded sentence, "On a true statement the two proofs are drawn from exactly the same distribution", is a statement of the proven algebra, not a measurement.

**Source fidelity.** Six deviations are enumerated in both the module header and `DESIGNATED-VERIFIER.md` (D1 groups/statement, D2 wider hash binding, D3 Schnorr key registration for §7, D4 Definition 1 only, D5 no §6 multi-verifier, D6 no security theorem). Identity commitments are encoded as the compressed infinity octet string rather than excluding zero from the sampler, and the record explains why. Honest.

**Tests are real.** Root `node --test`: 138/138; `research/real-pairing` 55/55; `vite build` → `dist/real/` 3 files. `scripts/dv-mutations.mjs` (8 recipes, one named owning test each, five-step protocol: green baseline → non-empty diff → red on an assertion with exactly one test matched → byte-identical restore → green again) reproduced locally: **8 of 8 killed**. Two auditor mutations outside the list: simulator `w = β + h` → 7 of 19 DV tests fail; dropping `c` from the designated challenge hash → 5 fail, which shows the tests recompute the challenge independently of the module. Cross-library: `generate-vectors.mjs --check` reproduces six transcripts and seven DV vectors byte for byte; py_ecc 8.0.0 reference suite 15/15 (`verify.py` recomputes every equation with the pinned pairing convention); sympy `check_algebra.py` 8 identities and 100,972 exhaustive two-challenge extractions. Browser (Playwright for Python, Chromium): `real_pairing_browser.py` 2/2 including the A-D-09 chapter flow, `browser_flow.py` 4/4. **Lean gate not reproduced locally** (no toolchain; Mathlib cache is multi-GB): `SignatureGate.lean` carries no `sorry`, `check_axioms.py` whitelists only `propext`, `Classical.choice`, `Quot.sound` across 14 named declarations, and CI run 40243267066 is cited by the roadmap. The Lean theorems concern the interactive OR proof (completeness, extraction, special soundness, honest-branch uniformity), not the DV construction, and the roadmap does not claim otherwise.

**Live bytes.** All 12 served files checked: `index.html`, `ordinary.html`, `style.css`, `app.mjs`, `crypto.mjs`, `symbolic/index.html`, `symbolic/app.mjs` equal the `prototype/` sources; `symbolic/dcs-uv-symbolic.mjs` equals `research/dcs-uv-symbolic.mjs` (`920615cb…`, the value in `revision.json`); `real/index.html`, `real/assets/index-DBxozyGR.css`, `real/assets/index-W-W3jYJs.js` (`88687d51…`) equal a fresh build; `revision.json` names `source_sha` `db6695e0f136…` and the same asset hash.

**Honest limits.** `DV_SCOPE`: "DESIGNATED-VERIFIER PROOF (Definition 1), NOT a designated-verifier signature, NOT strong designated verifier, NOT a confirmer signature, NOT a publicly transferable proof"; `DV_MODEL` says the paper gives no ROM theorem and neither does the lab; README and `SECURITY-MODEL.md` keep full DCS security "unestablished"; the page says "These checks do not establish the security of the complete designated-confirmer signature scheme." The public contrast deliberately claims equation validity only.

**Coherence.** The entry URL redirects to the real-pairing workbench, whose five chapters (issue → alter → prove → Eve's recording → designated-verifier proof) plus the research/evidence section form one path; the older ordinary-signature and symbolic workbenches remain as linked, separately scoped previews. The DV chapter sits beside the interactive exchange it contrasts, which is the right home; ZK Proof Lab (the roadmap's "linked" lab) does not duplicate it.

**Findings and disposition.**
1. Low — the Lean `check-formal-model` gate could not be reproduced in this audit (toolchain not installed; multi-GB Mathlib cache). Evidence rests on the cited CI run and on the absence of `sorry` plus the committed axiom whitelist. Disposition: none required; note for any future auditor that this one gate needs elan + `lake exe cache get` to replay.

## 19. Residue Gate — A-D-13

Roadmap pin `f20e6db42edc` (PR #1). Fresh clone main is `76061cd80df3`, one Dependabot commit past the pin (vite 8.3.4→8.3.5; `package.json`/`package-lock.json` only, no source change).

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| A-D-13 toy Blum primes, valid QR seed, repeated squaring and the specified emitted bits | Confirmed | — | `src/bbs/bbs.ts:55` `makeBlumKey` enforces distinct probable primes ≡ 3 (mod 4) with 40 Miller–Rabin rounds and reports (not imposes) the 1984 paper's 7 (mod 8); `:78` rejection-sampled unit seed; `:108` `bbsBits` emits both the BBS 1986 (parity of x₀ included) and HAC 5.40 (from x₁) conventions; unit tests reproduce BBS §4's worked example and HAC Example 8.57 with every intermediate |
| A-D-13 encrypt with the stream and transmitted final state; use the factors to rewind and decrypt | Confirmed | — | `encryptBG` (`:128`) follows HAC 8.56 step 1 (k=⌊lg n⌋, h=⌊lg k⌋, x_i = x_{i−1}², c_i = m_i ⊕ lsb_h(x_i), transmits x_{t+1}); `rewind` (`:214`) computes d₁=((p+1)/4)^{t+1} mod (p−1), d₂ likewise, u=x^{d₁} mod p, v=x^{d₂} mod q, x₀ = v·a·p + u·b·q with ap+bq=1 — exactly HAC 8.56 step 2; the factors live only in the Web Worker (`compute.worker.ts:10–12`), the main thread holds N only |
| A-D-13 state-disclosure and ciphertext-tampering consequences; valid seed / output-bit assumptions stated | Confirmed | — | `keystreamFrom` (public, n only) regenerates all later blocks from a disclosed state; `publicCyclePredecessor` walks the toy orbit publicly; `flipCipherBit` + decrypt shows one-bit malleability; `rewind` refuses non-QR final states but accepts an altered valid QR (the page says this is a validity guard, not authentication); panel "Exact construction and assumption boundary" and "What this experiment does not claim" |

**Code matches claim.** All arithmetic is BigInt modular arithmetic on a real 2048-bit session modulus or the labelled toy N = 437; nothing is simulated. `previousState` takes the QR square root per prime and recombines by CRT with a square-back check. Displayed verdicts (same-seed XOR relation, disclosure recovery, tamper outcomes) are derived from the current run's ciphertext and the worker's answers; the mutation list includes recipes that would make each of those displays lie, each owned by a browser claim.

**Source fidelity.** The one-squaring indexing difference between BBS 1986, BG 1984 and HAC 8.56 is named in the module header and on the page rather than smoothed over; HAC's p,q ≡ 3 (mod 4) is enforced and BG 1984's 7 (mod 8) reported; the short final block is declared as a teaching adaptation; HAC Note 8.58(iii)'s malleability/CCA remark is reproduced. No undisclosed deviation found.

**Tests are real.** Vitest 39/39 (incl. a real 2048-bit encrypt/rewind); `npm run build` typechecks then emits 4 files; Playwright 27/27 (25 claims + 2 a11y views). `scripts/mutations.mjs` is a committed runner over `scripts/mutations.json` (40 recipes; each requires a passing named baseline, a non-empty patch, a successful build whose JS bundle hash moves, exactly "1 failed" in the owning named test with infrastructure failures excluded, byte-identical restore and a green restored run) and runs in `deploy.yml`'s build job before deploy. Replayed three recipes individually with the same patch and owning test: "rewind index off by one" → owning claim red; "CRT recombination halves swapped" → red; "state disclosure skips its current block" → red; all restored byte for byte.

**Live bytes.** `index.html` `37e9dea1…`, `assets/index-D4Z7RIRs.js` `6bb92bb8…`, `assets/index-D9OFYNWw.css` `311886de…`, `assets/compute.worker-rhVPEJhg.js` `51ba0fdc…` served from Pages are byte-identical to a fresh build of current main.

**Honest limits.** README and panel 06: not BBS/BBS+ credential signatures; BG is unauthenticated and malleable; QR membership is not authentication; probable primes, not proven; toy-cycle recovery is not a general backwards-unpredictability result; random-looking output is not a pseudorandomness proof; GM (QRA) and BG (factoring) foundations kept distinct; JavaScript reference retirement is not memory zeroization. "Not for generating or handling production keys."

**Coherence.** Six numbered panels (squares mod p → Jacobi blind spot → GM → Rabin roots → CCA factor recovery → BBS/BG rewind) under one session key, each described in the README list. The hub `CATALOG.md` credits Blum–Blum–Shub and Blum–Goldwasser to this lab alone; no other lab duplicates them. Experiment 6 belongs here (same quadratic-residue machinery as experiments 1–5).

**Findings and disposition.**
1. None. The roadmap's claims for A-D-13 hold at the pin and on current main; the only post-pin change is a dependency bump that the live site already reflects.

## 20. Attestation Gate — A-D-08, S11

Roadmap pins: A-D-08 `89b2bb4cee6d` (PRs #13–#15), S11 `7241e798da97` (PR #16). Fresh clone main is `7241e798da97`, identical to the S11 pin; the A-D-08 pin is its direct parent and the only difference is the S11 delivery itself.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| A-D-08 stable-AK quote vs issuer Join and anonymous membership verification from one named DAA construction | Confirmed | — | `src/daa/protocol.ts` implements CDL Π_DAA+ §5.1 with zero application attributes: issuer Setup with a cross-group DLEQ proof (`verifyIssuer`), nonce-bound Schnorr Join proof of gsk (`createJoinRequest`/`verifyJoinRequest`), BBS+ issuance A = (g1·h0^s·h1^gsk)^{1/(e+x)} with the pairing check e(A, w·g2^e) = e(b, g2) (`issueCredential`/`verifyCredential`); `src/daa/attestation.ts:40` marshals TPMS_ATTEST with an empty `qualifiedSigner` (AsiaCCS 2020 App. A.2) |
| A-D-08 same-/different-basename signing and intended linkability | Confirmed | — | `sign` computes nym = H1(bsn)^gsk and the SPK over (gsk, e, r2, r3, s′); `link` compares pseudonyms only for equal basenames and returns "inapplicable … pseudonym inequality is not an unlinkability proof" otherwise (`protocol.ts:621–670`) |
| A-D-08 change credential/issuer/revocation state and verify acceptance without a universal identifier | Confirmed | — | `verify` checks issuer proof, epoch/policy context, non-identity subgroup points, e(A′,w)=e(Ā,g2), canonical scalars, recomputed Fiat–Shamir challenge, then the private-key rogue list only for an otherwise valid proof; issuer rotation forces re-Join (epoch bound into every transcript) |
| S11 seal a synthetic secret to a PCR policy and compute Unseal acceptance | Confirmed | — | `src/tpm/seal.ts` builds a TPM_ALG_KEYEDHASH TPMT_PUBLIC/Name, `unique = H(obfuscate‖secret)`, KDFa STORAGE/INTEGRITY keys, AES-128-CFB + outer HMAC per Part 1 §19.4–19.5; `tpm2Load` checks integrity before decrypt; `src/tpm/policy.ts` implements PolicyPCR/PolicyOR/PolicyCommandCode/PolicyAuthorize digest arithmetic; `tpm2Unseal` compares policyDigest with authPolicy |
| S11 firmware change → rejection; separately authorized update/recovery policy | Confirmed | — | `src/acts/sealing.ts` 15 scenarios: PolicyPCR refuses from the actual composite digest, wrong selection, one-bit public/private tamper (TPM_RC_INTEGRITY), four unauthorized-recovery failures, authorized recovery via PolicyAuthorize + PolicyOR; the fixedTPM-parent `ObjectLoad` distinction (no CryptValidateKeys) vs TPM_RC_BINDING for a non-fixedTPM parent |
| S11 runtime compromise after unsealing still exposes the released secret | Confirmed | — | `sealing.ts` `exposed = unseal.ok && postUnsealCompromise`; unit test "shows a post-release compromise reaching only what was already released"; mutation "the post-release exposure is suppressed" caught |

**Code matches claim.** DAA algebra hand-checked against CDL/BBS+: with r3 = 1/r1, A′ = A^{r1}, Ā = A′^{−e}·b^{r1} = A′^{x}, d = b^{r1}·h0^{−r2}, s′ = s − r2·r3, the verifier's recomputed t1 = A′^{ŝe}·h0^{ŝr2}·(Ā/d)^{−c}, t2 = d^{ŝr3}·h0^{ŝs′}·h1^{−ŝgsk}·g1^{−c} and L = B^{ŝgsk}·nym^{−c} reduce to the prover's commitments exactly when Ā/d = A′^{−e}h0^{r2} and g1 = d^{r3}h0^{−s′}h1^{−gsk}, which hold for a valid credential. All proof randomness is derived from the secret plus a framed transcript (hedged, fixture-seeded, disclosed as such). Every verdict rendered in the DAA and sealed panels is the `checks` array or scenario outcome of the current run; the mutation list contains recipes that would make each verdict lie, each owned by a named unit test.

**Source fidelity.** Both headers cite exact sections (ePrint 2016/663 §5.1; TPM 2.0 Part 1/2/3 tables and equations with v185 and 1.83 numbering; Part 4 `ObjectLoad`, `PrivateToSensitive`, `UnwrapOuter`). Omissions are listed (bsn = ⊥, application attributes, signature-based revocation, TPM2_Commit/Sign, wire transport, secure boot, NV counters, anti-hammering, authValue/HMAC sessions). No undisclosed deviation found.

**Tests are real.** Vitest 372/372 (17 files); `npm run build` typechecks then emits 3 files; Playwright 104 passed, 1 intentional skip (desktop coarse-pointer) across claims, claims-mobile, claims-webkit and a11y projects. `scripts/mutations.mjs` (35 recipes: 16 DAA/attestation, 19 policy/seal/sealing) replayed in full locally: whole-suite baseline passes, then **all 35 caught**, each with a moved production bundle hash, the owning test named in the failure, infrastructure failures excluded, and byte-identical restore. The runner is wired into `deploy.yml` ahead of the deploy job.

**Live bytes.** `index.html` `6532cde0…`, `assets/index-DbzM3lH2.css` `2f4ea0de…`, `assets/index-uBCD32jQ.js` `de780afd…` served from Pages are byte-identical to a fresh build of main.

**Honest limits.** README "Not production cryptography": software-modelled TPM and storage parent, variable-time bigint arithmetic, public fixture seeds, no hardware isolation, no TPM/ISO ECDAA wire interoperability, the Join channel and unique-TPM admission are external assumptions, Theorem 1's UC assumptions are not proven here, publishing a rogue secret enables pseudonym calculation, "anonymous provenance is not runtime integrity", and the fixedTPM confinement premise is explained as a premise rather than a MAC.

**Coherence.** Eight tabs (Measured Boot → Quote & Verify → Magic Value → Break It → Time of Use → Whose Signature → Anonymous Membership → Sealed Storage) in `src/ui/app.ts`, each described in the README exhibit list. Both new tabs reuse the lab's own boot chain and PCR model, which is why they belong here rather than in Credential Veil (BBS signatures) or a new repo; the hub catalog credits only Credential Veil with BBS signatures and this lab with DAA, so no duplication.

**Findings and disposition.**
1. None. Both proposals are confirmed at their pins and on current main; the roadmap's test, mutation and live-byte figures reproduce exactly.

## 21. Shamir Gate — S07

Roadmap pin `48a7a3ab9298` (PR #18). Fresh clone main is `48a7a3ab9298`, identical to the pin. The package lives in `demos/shamir-gate/` (older fleet layout).

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| S07 generate shares under a specified visual scheme and reconstruct by Boolean-OR stacking | Confirmed | — | `src/visual.ts:20` the six weight-two 2×2 patterns (Naor–Shamir 2-of-2, m = 4); `encodeVisualPixel` (`:114`) same pattern for white, complement for black; `samplePatternIndex` (`:129`) uniform by rejection through `randomBigInt`; `reconstructExpanded(…, 'or')` ORs the actual share matrices; a missing share throws |
| S07 one-share pixel distributions, pixel expansion and contrast | Confirmed | — | `enumerateSingleShareDistributions` (`:269`) exhausts all 24 share/colour/pattern outcomes (each pattern 1/6 for both colours on both shares); `deriveVisualParameters` (`:224`) derives m = 4 from block length and α = (4−2)/4 = 1/2 from OR weights rather than stating them |
| S07 compare stacking with XOR and polynomial interpolation; reject scrambled-only secrecy | Confirmed | — | XOR reconstruction is computed and labelled "digital", separate from the physical OR; `scrambleOnly` (`:313`) shows position-only scrambling preserves the black-pixel count; `reuseOneMask` (`:293`) exposes equal/complement relations; the polynomial scheme stays in a comparison table |

**Code matches claim.** The construction is exactly Naor–Shamir §3's 2-of-2 scheme with the 2×2 arrangement (C₀ = same row twice, C₁ = complementary rows, over the 6 column permutations); hand-checked: white OR weight 2/4, black OR weight 4/4, relative contrast 1/2, and each labelled share's block is uniform over the six patterns independent of the source colour, which is the exact (not statistical) one-share privacy claim the page makes. The parameters panel renders the derived weights (`visual-ui.ts:288`); the static comparison table at `:318` also prints "m = 4" as a literal beside the derived figure, which is acceptable because the computed value is shown and tested on the same tab.

**Source fidelity.** Module header cites Naor and Shamir, EUROCRYPT 1994 §§2–3; the OR observation model and the full restricted-matrix distribution definition are used as the paper defines them. Scope (binary 2-of-2 only; no k-of-n, grayscale, colour, progressive; no alignment/printing model) is stated on the page and in the roadmap.

**Tests are real.** Vitest 73/73 (6 files); `npm run build` runs the publish-request control, typechecks and emits 3 files; Playwright 19/19 (claims, a11y, border contrast, theme, visual). `scripts/visual-mutations.mjs` (14 recipes over `visual.ts`/`visual-ui.ts`) replayed in full: baseline passes, **all 14 caught**, byte-identical restore, restored baseline green. It runs in `deploy.yml` as "Visual-sharing clean-baseline mutation gate" ahead of deploy.

**Live bytes.** `index.html` `16cb595e…`, `assets/index-B6qOfs9_.css` `d5e6efd1…`, `assets/index-D4RWfZbI.js` `633f813c…` served from Pages are byte-identical to a fresh build of main and match the hashes the roadmap records.

**Honest limits.** README: "Do NOT use this as production key-management software"; visual section: confidentiality for one correctly generated share under fresh independent masks only, no authenticity, custody, alignment, printing/opacity/registration model; mask reuse and misalignment listed under failure modes.

**Coherence.** Eight numbered lesson steps plus the Gate (failure cases) and the independent ninth Visual Shares tab; the README intro names the visual exhibit and its scope. The visual scheme is a secret-sharing variant, so the companion-tab placement the roadmap allowed is the right one; no other lab implements visual cryptography.

**Findings and disposition.**
1. Low — `scripts/visual-mutations.mjs` counts any non-zero exit of the two owned test files as a kill; unlike the runners in Attestation Gate, Matsui Line or Residue Gate it does not require the failure to name an owning test, does not exclude infrastructure errors (a syntax error in a mutant would count as "caught"), and does not check that the built bundle moved. All 14 recipes do kill real assertions today (verified by reading the recipes against `visual.test.ts`), so this is a robustness gap in the evidence, not a false claim. Disposition: adopt the named-owner, assertion-only, bundle-hash pattern used elsewhere in the fleet.

## 22. ORAM Vault — E-K-10, L-R-13

Roadmap pins: E-K-10 `0c7f89281784` (PR #32), L-R-13 `7461963af4bb` (PR #33), maintenance pin `7a882b09e7a0`. Fresh clone main is `7a882b09e7a0`; it differs from the L-R-13 pin only in `.github/workflows/deploy.yml` (Dependabot dispatch repair), no source change.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| E-K-10 same logical accesses through tiny Path and hierarchical ORAM | Confirmed | — | `src/hierarchical/comparison.ts:117` runs the fixed eight-operation workload through the retained Path client and the N=16 hierarchy, asserts both outputs equal an independent reference map, then sweeps all 16 blocks |
| E-K-10 all-level probes, dummy searches, reinsertion and rebuilds with fresh hashing | Confirmed | — | `src/hierarchical/client.ts:489–523` probes level 0 (one-slot cache) then one HMAC-SHA-256-selected bucket per level, switching to a unique `(accessNumber, level)` dummy label after a hit; the found copy is nulled before the bucket is rewritten; `reinsert` (`:338`) performs binary-carry rebuilds and `buildLevel` (`:293`) rotates the placement key on every rebuild of a hashed level |
| E-K-10 compare client state, per-access traffic and rebuild spikes; leak from skipped probes | Confirmed | — | traffic is summed from `HierarchicalServer` events (`trafficFrom`, `server.ts:#record`), not estimated; `runSkippedProbeControl` (`comparison.ts:200`) runs the insecure `skip-after-hit` policy and reports 1 vs 31 lookup slots with identical plaintext; `getHierarchicalClientSummary` reports keys, occupancy bits, counter words and transient rebuild memory |
| L-R-13 mutually distrustful clients with different rights over one store; expose observations | Confirmed | — | `src/multiclient/protocol.ts` (header states which GORAM/A-GORAM properties are and are not claimed): per-client AES key wraps for reads, owner-signed P-256 capabilities and writer signatures for writes, access matrix held by the owner only; `scenario.ts` rights table and baseline derive every release/refusal from live state |
| L-R-13 concrete failure from naively sharing single-client ORAM state | Confirmed | — | `src/multiclient/naive.ts` runs the lab's own unmodified Path ORAM under a shared key/position map and obtains cross-client plaintext exposure, an unusable partial-map client and a lost update (ePrint 2016/678 §3.1 and ConcurORAM §I cited) |
| L-R-13 authorization, obliviousness and state synchronization executed; integrity/concurrency limits labelled separately | Confirmed | — | signed hash-chained upload log with `blame`; client-local version/log-head memory for returning-client rollback detection only; `ConcurrencyRefusedError` rather than serialization; `runCollusion` reports candidate-set sizes rather than claiming identification; "NOT CLAIMED: integrity … obliviousness against malicious clients … anonymity" in the module header and on the page |

**Code matches claim.** Hand-checked against Alibi §2.5/Fig. 2: scan cache → probe every level with real-or-dummy label → delete found item → reinsert at top → geometric rebuild with fresh keys. The 341-slot geometry (1 + 2·2 + 4·4 + 8·8 + 16·16) and the 31-slot fixed lookup (1+2+4+8+16) follow from `hierarchyShapes`. Placement uses an HMAC output word masked to a power-of-two bucket count (no modulo bias; RFC 4231 vector pinned). Every displayed cost is a sum of recorded server events; the full-state sweep is outside the displayed accounting as the code comment says. Controls can fail: the skipped-probe control and the naive-sharing outcomes are computed, and mutations that would fake them ("the negative control stops running the insecure policy", "reference verification compares the store against itself") are caught.

**Source fidelity.** The hierarchy is declared a bounded, overprovisioned adaptation that is not the papers' asymptotically efficient oblivious hash table and transfers no theorem; the multi-client store names GORAM Definition 1 and ePrint 2017/329 Theorem 1 (no o(n) construction is oblivious against malicious clients) and refuses the corresponding claims. The Bindschaedler et al. CCS 2015 paper is named as "not read"; honest.

**Tests are real.** Vitest 120/120 (14 files); `npm run test:workflow` 7/7; `npm run build` typechecks then emits 3 files; Playwright 29/29. `scripts/mutations.mjs` (22 recipes: 12 hierarchical, 10 multi-client) replayed in full: baseline passes, **all 22 caught**, sources restored byte for byte; wired into `deploy.yml` before deploy.

**Live bytes.** `index.html` `98f01fc1…`, `assets/index-CBRdO6PX.js` `44a56ad1…`, `assets/index-EuB0g9FP.css` `40b74856…` served from Pages are byte-identical to a fresh build of main.

**Honest limits.** README: finite-stash failure, timing leakage, no isolation between client and server code on one page, no path freshness/completeness proof, hierarchy trades away asymptotic efficiency (≈21.31N slots, O(N) transient rebuild memory), colluding client defeats obliviousness, concurrency refused, no global version head or first-contact rollback detection, "Do NOT use for production".

**Coherence.** Seven exhibits (access-pattern attack → Path ORAM access → stash/eviction → bandwidth → integrity → hierarchical comparison → distrustful clients) listed in the README; the two P3 additions reuse the lab's Path client and server, which justifies the companion placement. No other lab implements hierarchical or multi-client ORAM (Search Vault's Path ORAM comparison is a separate-server contrast, not a duplicate).

**Findings and disposition.**
1. None. Both proposals and the maintenance pin are confirmed; all roadmap figures (120 unit, 7 workflow, 29 browser, 22 mutations, byte-identical assets) reproduce.

## 23. DP Noise — E-K-07, L-R-11

Roadmap pins: E-K-07 `d038ae68a794` (PR #27), L-R-11 `e4443eab8e77` (PR #29; also the maintenance pin). Fresh clone main is `e4443eab8e77`, identical to the L-R-11 pin; the E-K-07 pin is its direct parent.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| E-K-07 compare two locations using an ε·distance likelihood-ratio bound | Confirmed | — | `src/dp/geo.ts:71–99` ideal planar Laplace density ε²/(2π)·e^{−εd}, `planarPrivacyLoss` = ε(d(b,z) − d(a,z)) (normaliser cancels exactly), `geoBound` = ε·d(a,b), `tightPlanarWitness` on the ray through a beyond b where the triangle inequality is tight |
| E-K-07 sample the planar mechanism and measure distance / nearest-service utility | Confirmed | — | `samplePlanarLaplace` draws R ~ Gamma(2, 1/ε) as the sum of two exponentials and Θ uniform; `planarRadialCdf` = 1 − (1+εr)e^{−εr} with `expm1` near zero; `planarRadiusQuantile` by bisection; `nearestPointIndex` on the actual noisy point; the UI compares 2,000 current-run draws with analytic mean/CDF/quantiles |
| E-K-07 repeated releases; discretisation, boundary and correlated-path assumptions | Confirmed | — | `auditFiniteGrid` derives the border witness on a normalised 7×7 exponential grid and the ε/2 control (`ui/geo.ts:127`); `inferCandidatePath` consumes only public candidate paths and releases; `pathTranscriptBound` sums per-release ε·d bounds; the module header states the paper's §4.2 digital mechanism is not implemented |
| L-R-11 homogeneous, diverse and semantically related classes; computed diversity/closeness criterion | Confirmed | — | `src/dp/diversity.ts`: distinct ℓ-diversity (`distinctBands`) and ordered t-closeness with the Li–Li–Venkatasubramanian §5.1 EMD computed as exact BigInt fractions (`orderedEmd`, numerator Σ|N·cᵢ − C·gᵢ|, denominator (m−1)·C·N), `meetsThreshold` by cross-multiplication with ≤ so three releases sit exactly on t = 9/64 |
| L-R-11 utility effect of the transformation | Confirmed | — | `answerAgeQuery` derives a [certain, certain+possible] interval from the published age ranges of each release; tests pin zero-width vs eight-record intervals |
| L-R-11 background knowledge / repeated release vs the DP neighbouring-world guarantee | Confirmed | — | `publishRelease` strips ids, names, ages and salaries before `intersectReleases` runs on explicit quasi-identifier observations; `neighbourContrast` serialises the deterministic release with and without one record and `separatesWorlds` has two real branches, with the narrow scope stated in code and README |

**Code matches claim.** Hand-checked: the planar density and radial CDF are the Andrés et al. §4 formulas; the ε/2 sufficiency on the finite grid follows because each input's normaliser differs by at most e^{εd}, so the rate-ε grid ratio can reach e^{2εd} and rate ε/2 bounds it by e^{εd}; the ordered EMD closed form is Li et al. §5.1 with the m-th cumulative term identically zero (asserted by a test rather than assumed). No displayed value is a literal standing in for a computation: the border witness, the sweep counts, the EMD fractions, the interval widths and the intersection result are all computed, and the mutation list targets each of them.

**Source fidelity.** Deviations are declared: IEEE-754 ideal density rather than the paper's finite-precision digital mechanism; local Euclidean plane, not Earth; distinct (weakest) ℓ-diversity named as such with the ICDE 2006/2007 attribution note; ordered ground distance as one of several the principle admits; the intersection attack is "one constructed counterexample, not a composition theorem"; the sensitive value is the salary band, not the salary.

**Tests are real.** Vitest 310/310 (20 files); `npm run build` typechecks then emits 3 files; Playwright 21/21 (claims, task, a11y). `scripts/mutations.mjs` (22 recipes: 8 geo, 14 release-criteria) replayed in full: every owning suite passes as baseline, **all 22 caught**, sources restored byte for byte and the baseline rerun; wired into `deploy.yml` ahead of deploy.

**Live bytes.** `index.html` `62705329…`, `assets/index-qEafGy4K.css` `40b4c23c…`, `assets/index-t2jjUqGc.js` `a1a45ef6…` served from Pages are byte-identical to a fresh build of main and match the roadmap's recorded hashes.

**Honest limits.** README: "Do NOT use this code" (teaching implementation; use Google DP or OpenDP); the float sampler caveat (Mironov) is stated for the geo exhibit while the payroll mechanisms use exact rationals; the release criteria "are not equivalent to differential privacy"; the counterexample's unequal age partition is declared as constructed.

**Coherence.** Seven numbered exhibits on a guided route plus expert cards (the ℓ-diversity/t-closeness card lives inside Exhibit 1 on the explore route only); the README lists each. Both additions extend the lab's own k-anonymity and DP-definition material, so the extension placement is right; no other lab implements geo-indistinguishability or t-closeness.

**Findings and disposition.**
1. None. Both proposals are confirmed at the pin; every roadmap figure (310 unit, 22 mutations, 21 browser, three byte-identical public files) reproduces.

## 24. LLL Break — E-K-09

Roadmap pin `3f7ca812858c` (corrected PR #27). Fresh clone main is `3f7ca812858c`, identical to the pin.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| E-K-09 toy superincreasing Merkle–Hellman key, encrypt bits, decrypt with the trapdoor | Confirmed | — | `src/knapsack.ts:271` `generateKeyPair` draws a′ᵢ from the paper's own range [(2^{i−1}−1)2^k+1, 2^{i−1}2^k], m ∈ (Σa′, 2Σa′], w invertible; `validatePrivateKey` checks (1), (8) and gcd(w,m)=1 separately; `encryptBits` = Σxᵢaᵢ; `decryptWithTrapdoor` applies (4) then the greedy (2) with ≥, justified by the paper's n=5 example; `knapsack-verify.ts` reproduces that worked example |
| E-K-09 original Lagarias–Odlyzko Algorithm SV lattice, existing LLL engine, exact validation | Confirmed | — | `lagariasOdlyzkoBasis` (`:465`) is the unscaled (2.4) basis; `attackPublicOnly` (`:689`) reads only `{publicWeights, target, delta}`, reduces with the lab's `lllReduce`, verifies in BigInt that reduced = U·input with det U = ±1 (Bareiss, `:511–574`), reads candidates by Algorithm SV step (3) (`readCandidateBits`) and accepts only on exact public subset-sum equality (`verifyCandidate`); step (4) complement pass implemented |
| E-K-09 reproducible bounded success/failure; plaintext recovery ≠ trapdoor reconstruction; no density threshold | Confirmed | — | seeded instances via the lab RNG; `arithmeticBudget` screens both SV targets against MAX_SAFE_INTEGER and refuses rather than attacks; `enumerateSolutions` is verifier-side ground truth that refuses n > 16 and is never reported as a recovery; README pins the in-budget n=8 failure (seed 10, k=1) and the n=16 budget failure (seed 30) and states "a small experiment does not establish a density threshold"; module header and README: "NOT Shamir's attack", "NOT the Coster et al. embedding" |

**Code matches claim.** Hand-checked against Merkle–Hellman §II (1)–(8) and Lagarias–Odlyzko Algorithm SV: basis rows (eᵢ, −aᵢ) and (0,…,0, M) with the plaintext vector Σxᵢbᵢ + b_{n+1} having last coordinate 0 (`plaintextVectorInLattice` asserts it per instance); candidate rule "all coordinates 0 or one fixed λ"; complement pass on Σaᵢ − M. The attack is bounded to 2(n+1) rows with no brute-force fallback. All verdict-bearing arithmetic is BigInt; the floating Gram–Schmidt only chooses row operations, which the exact unimodular postcheck validates. Displayed density is computed as n/log₂(max aᵢ) with the formula printed beside it.

**Source fidelity.** Deviations declared: small k instead of the paper's 100 (budget), unscaled original basis rather than Coster et al.'s, endpoints 1 ≤ M < Σaᵢ refused as outside Algorithm SV's domain, and a limit of the model ("low density and large n cannot be had together here") stated rather than hidden.

**Tests are real.** This lab's unit layer is `tsx scripts/knapsack-verify.ts` (24/24 named checks) plus `verify:algo` and `verify:guardrails`, not Vitest; the two publication controls pass; `tsc && vite build` emits 5 public files; Playwright UI 29/29 and a11y 2/2. `scripts/knapsack-mutations.mjs` (19 recipes; 15 pure checks run with `--only`, 4 browser checks rebuilt with `vite build` and bundle-hash assertion; assertion-only kills, infrastructure markers rejected, byte-identical restore) replayed in full: **19 of 19 killed by their own named checks**. Note: `npm run build` and both Playwright configs invoke `tests/publish-request.node.mjs`, which hard-codes the npm CLI at `process.execPath/../../lib/node_modules/npm/bin/npm-cli.js`; that path does not exist under Homebrew Node 26, so the build wrapper fails locally (exit 1 vs expected 73). Reproduced faithfully by running through a scratch copy of the node binary whose `../lib` contains the installed npm; through that shim all controls, suites and the mutation gate pass as in CI. Environmental, not a lab defect.

**Live bytes.** `index.html` `3c83cf4d…`, `assets/index-CUb1bPoZ.js` `5def815e…`, `assets/index-RdNcwSO6.css` `35bd6575…`, `favicon.svg`, `icons.svg` served from Pages are byte-identical to a fresh build of main (five files, as the roadmap says).

**Honest limits.** "Merkle-Hellman is historical and broken. Do not use any of this for anything."; failure is "not a security result"; no density threshold displayed; not Shamir's attack; nothing here bears on ML-KEM or worst-case hardness; the toy reducer is "not an estimator".

**Coherence.** Six exhibits (LLL intuition → Gram–Schmidt → step-by-step LLL → LWE embedding → parameter explorer → knapsack) in one README table; Exhibit 6 reuses the lab's own `lllReduce`, so the extension placement is right. GGH Trapdoor (another lattice lab) does not implement knapsacks; no duplication.

**Findings and disposition.**
1. Low — the publish-request control (`tests/publish-request.node.mjs`) derives the npm CLI from `process.execPath` and fails on any Node install whose npm is not at `../lib/node_modules/npm` (Homebrew, nvm-less distro packages), which makes `npm run build` and the Playwright web servers fail locally. CI (setup-node) is unaffected. Same pattern as Envelope KMS and MAC Race. Disposition: fall back to `process.env.npm_execpath` as the Matsui Line and Shamir Gate runners do.

## 25. MAC Race — L-R-02

Roadmap pin `695391521cfd` (PR #27). Fresh clone main is `695391521cfd`, identical to the pin.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| L-R-02 PMAC offsets, independent cipher calls, combination and final-block handling from Black–Rogaway 2002 | Confirmed | — | `src/pmac/pmac.ts:116–175`: L = E_K(0¹²⁸), Gray-code offsets Z_i = Z_{i−1} ⊕ L·x^{ntz(i)} (`:134`), lanes E_K(M_i ⊕ Z_i) issued without data dependency (`Promise.all`), Σ = ⊕ outputs ⊕ pad(M_m), complete final block XORs L·x⁻¹ (`divideByX`, `:59`, the paper's equation 2 with 0x80/0x43 correction), partial final block 10* padded with no L·x⁻¹, tag = E_K(Σ) full 128 bits |
| L-R-02 dependency work/span vs CMAC with explicit scheduling model | Confirmed | — | `src/pmac/schedule.ts` counts exact per-message AES calls (equal for both) and dependency waves under a selected lane count; the panel labels it a model, not a measured speedup (mutation "performance-model warning disappears" is caught) |
| L-R-02 content, position and final-block mutations verified by a full-byte verifier | Confirmed | — | `verifyPmac2002` compares the full tag with `equalTag`; `pmacWrongFinalRuleForLesson` computes the nonconforming control; unit test "accepts genuine tags and rejects content, position and final-rule mutations"; `e2e/pmac.spec.ts` recomputes every displayed PMAC/CMAC tag with noble AES and independent BigInt field arithmetic |

**Code matches claim.** Hand-checked against the 2002 definition (§§2–5): offset recurrence via Gray code, L·x and L·x⁻¹ in GF(2¹²⁸) with the x¹²⁸+x⁷+x²+x+1 reduction, final-block rules, full tag. Official author-hosted PMAC-AES-128 and PMAC-AES-256 vectors are pinned for every length in the files plus the 1000-byte zero vectors; a BigInt/noble cross-check covers varied lengths and keys. All displayed values are computed per run.

**Source fidelity.** Byte-aligned messages and full tags only (the paper's bit-length interface and truncation are not implemented, and the README says so); PMAC is not presented as NIST-standardized; the Kaplan–Leurent–Leverrier–Naya-Plasencia Q2 forgery is named with its superposition-oracle boundary rather than converted into a generic PQ claim.

**Tests are real.** Vitest 106/106 (11 files); `npm run build` (through the same node shim described under LLL Break, because this lab's `tests/publish-request.node.mjs` hard-codes the bundled-npm path) typechecks and emits 4 public files; Playwright 39/39 across chromium, webkit and firefox projects once the WebKit and Firefox browsers were installed locally (the first run's 4 and then 2 failures were "Executable doesn't exist", environmental). Three committed mutation gates replayed in full: CRC/HMAC 8/8 caught, raw CBC-MAC/CMAC 6/6 killed with exact build restored, PMAC **10/10 caught** (named owning tests, bundle hash restored) — 24 in total, as the roadmap says; all three run in `pages.yml` before deploy.

**Live bytes.** `index.html` `bb2ec366…`, `404.html`, `assets/index-CgNgCL8_.css` `3f5b723d…`, `assets/index-D2TwCtCQ.js` `e3cccbca…` served from Pages are byte-identical to a fresh build of main.

**Honest limits.** README failure-mode list: PMAC implementation mistakes, dependency span is not a runtime speedup, Q2 oracle boundary; "this lab pins the 2002 convention"; raw GHASH and Poly1305 scopes labelled separately.

**Coherence.** Nine panels (Checksum vs MAC → HMAC → raw CBC-MAC → CMAC → PMAC → Poly1305 → GHASH → length extension → timing) listed in the README; PMAC sits beside CMAC, the construction it is compared with, which is the right home.

**Findings and disposition.**
1. Low — same publish-request control dependency on the bundled-npm path as LLL Break (`tests/publish-request.node.mjs`); fails `npm run build` locally on Homebrew Node. Disposition as in section 24.

## 26. Distance Bounding — S06 (new repository)

Roadmap pin `4458307b57a0` (PR #1 `5f0b6a208fd2`, README-only PR #3). Fresh clone main is `4458307b57a0`, identical to the pin.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| S06 authenticate through a relay, then add a modelled unpredictable rapid-bit phase | Confirmed | — | `src/db/attacks.ts:334` `ordinaryAuthenticatedRelay` forwards a fresh HMAC challenge/tag through an oracle and authenticates with no proximity claim; `src/db/protocol.ts` implements Hancke–Kuhn §3.1 (verifier nonce, R0‖R1 = h(K, N_V) with the declared HMAC-SHA-256 instantiation in `prf.ts`, one-bit challenges, R_i^{C_i}) |
| S06 vary propagation delay, processing delay, pre-guessing and tolerated errors; derive the bound and failure cases | Confirmed | — | `timing.ts` implements eq. (1)–(2) with exact BigInt rationals and a trusted lower bound δ_lb (Θ = 2R/v + δ_lb; pinned boundary T=22 accepts, T=23 rejects); `verifySession` checks timing and content separately so a late answer can never consume the error allowance x; `probability.ts` gives exact mafia 4⁻ⁿΣC(n,e)3^{n−e}, blind, partial pre-ask convolution, distance fraud on the realized register distance h, false rejection and q-attempt compounding (refused when the nonce is reused) |
| S06 relay/mafia fraud separated from dishonest-prover distance fraud | Confirmed | — | `MafiaPreAskAttacker` receives only a `ProverOracle` and pre-asks in its constructor before any real challenge exists; `DishonestProver` holds registers and commits early, keeping both propagation legs; a unit test reads the attack module's source to prove it never imports a key or register derivation |

**Code matches claim.** Hand-checked: the (3/4)ⁿ figure and the false-accept/false-reject sums match Hancke–Kuhn §3.4 reparameterised by x = n − k (a test cross-checks both forms and exhaustive enumeration through n = 8); the relay round trip charges both proxies, the link and the prover delay; no `Date.now`/`performance.now` reaches a verdict (a test greps the source). Verdicts, bounds and probabilities are derived from the current run, and predictable challenges, reused nonces or disabled timing withdraw the affected formula instead of leaving a stale number (mutations S06-M06…M15 cover these).

**Source fidelity.** The paper mandates no PRF or wire format; the HMAC profile, length prefixes and deterministic fixtures are declared as teaching choices; the prover-nonce variant is named but not implemented; the independent per-bit noise model is declared "not RF".

**Tests are real.** Vitest 96/96; `npm run build` typechecks, emits 3 files and runs `verify-build.mjs` (base path, retained scope claims, no clock, zero runtime dependencies); Playwright 30/30 (20 claims + 10 a11y/reflow/keyboard). `scripts/claim-mutations.mjs` (S06-M01…M15; whole unit suite plus browser claims as baseline, bundle digest must move, named owning assertion must fail as an ordinary failure, byte-identical restore and rebuild to the baseline digest) replayed in full: **15 of 15 caught**; wired into `pages.yml` ahead of deploy.

**Live bytes.** `index.html` `8c66417d…`, `assets/index-BAmWciQX.css` `6d4a59e6…`, `assets/index-D81Kbzvu.js` `c8fe2795…` served from Pages are byte-identical to a fresh build of main.

**Honest limits.** README "What this lab does not do": no radio, no physical location, no nanosecond propagation measurement, correlated/bursty errors not modelled, early-detect/late-commit and pre-transmission attacks outside the model, JavaScript not constant-time, prover-nonce grinding listed as a limitation.

**Coherence.** One guided path (ordinary authentication → rapid-bit protocol → relay → mafia pre-ask → distance fraud → noise → repeated attempts → broken controls) with actor views kept separate; the README names each experiment.

**New-repo justification: Yes.** No existing lab models proximity or timed challenge-response; Time Trust covers time/freshness and X3DH Wire key agreement, neither of which has a round-trip timing model or the attacker-actor structure this lesson needs. The exact-rational timing/probability engine and the structural attacker-knowledge boundary are self-contained, and the hub catalog shows no other lab touching distance bounding or relay attacks.

**Findings and disposition.**
1. None.

## 27. Hostile Paths — L-R-10 (new repository)

Roadmap pin `4086fff2f6d8` (PR #1 `26ebda7779a5`, PR #2). Fresh clone main is `e954fe1101dd`, one commit past the pin (`playwright.config.ts` port only, PR #4).

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| L-R-10 independent paths with observation, modification and loss introduced separately | Confirmed | — | `src/psmt/protocol.ts:152` `applyPathActions` assigns modify / drop / observe / honest per path, retains what a controlled path saw, and marks a dropped share as recognised loss (`delivered: null`) |
| L-R-10 naive share routing vs one specified PSMT protocol | Confirmed | — | one-round FFGH adaptation: degree-t polynomial with the secret at x=0 (`encodeOneRound`), Welch–Berlekamp decoding (`decoder.ts:37`) with an independently written subset-oracle decoder that must agree (`decodeBySubsetOracle`), naive first-(t+1)-share interpolation shown releasing a wrong secret |
| L-R-10 privacy and reliable-delivery outcomes as feedback, rounds and budget vary under the topology condition | Confirmed | — | `analyzePrivacy` runs an exhaustive GF(257) completion census over all 257 candidate secrets against the adversary's view; `classifyFeasibility` derives one-round n ≥ 3t+1 and interactive n ≥ 2t+1, rejects "one round with feedback", labels the two-round route non-executed; `buildThreePathAmbiguity` gives a received word at Hamming distance 1 from codewords for secrets 10 and 11 (hand-checked: (30,50,70) vs (30,49,68), received (30,50,68)) |

**Code matches claim.** Hand-checked: the unique-decoding radius ⌊(received − (t+1))/2⌋, the displayed bound 2b + e ≤ n − (t+1), and the DDWY thresholds are as stated; `universalOneRoundGuarantee` is true only when n ≥ 3t+1 and the controlled paths are within budget, and a successful run outside that is reported as a run, not a theorem. The uniform GF(257) sampler rejects the one biased Uint16 value. Controls can fail: the mutation list includes making the modified share honest, widening the candidate domain and dropping the ambiguity splice, all caught.

**Source fidelity.** The README names the one-symbol boundary form of FFGH's one-round construction with distinct points 1..n and extra redundancy instead of the generator-power enumeration and optimal rate; Spini–Zémor's two-round pseudo-basis protocol is described but not executed; synchrony, private/authenticated path labels, honest endpoints and a static unbounded adversary are declared assumptions.

**Tests are real.** Vitest 34/34; `npm run build` typechecks, emits 3 files and runs `verify-build.mjs`; Playwright 12/12 (9 claims + 3 a11y). `scripts/claim-mutations.mjs` (15 recipes with named owners) replayed in full: baseline passes, **all 15 caught**; wired into `pages.yml` before deploy.

**Live bytes.** `index.html` `fec8dc40…`, `assets/index-D0U18e6o.css` `af24c840…`, `assets/index-DLox5HYB.js` `e26c5d69…` served from Pages are byte-identical to a fresh build of current main.

**Honest limits.** README "Scope and limits": symbolic topology, no physical path independence, GF(257) one-symbol messages, t ≤ 4, n ≤ 16, not constant-time, neither the optimal multi-symbol rate nor the interactive 2t+1 construction.

**Coherence.** One sender→paths→receiver story with the planner and the ambiguity witness as side panels; the README lists what the browser claims suite reads. The hub catalog credits Reed–Solomon/Welch–Berlekamp here and nowhere else; Shamir Gate and VSS Gate cover sharing and dishonest dealers, not transmission over corrupted paths.

**New-repo justification: Yes.** PSMT needs an active-error decoder, a path-adversary model and a feasibility planner that neither Shamir Gate (threshold sharing, visual sharing) nor VSS Gate (dealer verification) contains, and bolting a Welch–Berlekamp decoder and path topology onto either would blur their one-concept scope. The repo is small (1,145 source lines) and self-contained.

**Findings and disposition.**
1. None.

## 28. Lattice IBE — L-R-12 (new repository)

Roadmap pin `b19e2a6cd686` (PRs #1 `b21c6bad498a`, #3 `6e387b04efe4`, #4; also the maintenance pin). Fresh clone main is `b19e2a6cd686`, identical to the pin.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| L-R-12 map a public identity to an algebraic target and execute bounded trapdoor preimage sampling | Confirmed | — | `src/hash.ts:40` domain-separated SHA-256 with counter and rejection sampling into Z_q²; `src/trapdoor.ts:201` `samplePreimage`: coset representative t with A·t = u, randomized nearest plane `sampleD(T, r, −t)` over the complete q-ary kernel basis with Gram–Schmidt norms and the GPV one-dimensional weight exp(−π(z−c)²/s²), e = t + v, A·e = u verified |
| L-R-12 compare extraction/encryption/decryption interfaces with BasicIdent/FAME | Confirmed | — | `src/ibe.ts` dual-LWE: p = Aᵀs + x, c = uᵀs + x′ + b⌊q/2⌋, decrypt by phase distance; `src/comparison.ts` and the panel keep pairing-based BasicIdent, FAME and the unimplemented Agrawal–Boneh–Boyen standard-model route distinct; ML-KEM identified as a KEM, not a drop-in |
| L-R-12 assumptions and parameter scale; mechanism toy vs approved deployment | Confirmed | — | `profileEvidence` computes prime modulus, full row rank, complete kernel basis (det = qⁿ), max GS norm, sampler ratio, the m ≥ 5n lg q, m ≥ 2n lg q and q ≥ 5r(m+1) floors and shows the n=2, m=4, q=4093 profile failing them; `src/attack.ts` meet-in-the-middle public search recovers a working preimage from (A, q, u) alone and decrypts with it |

**Code matches claim.** Hand-checked against GPV: SampleISIS = arbitrary preimage plus a SampleD lattice vector; SampleD iterates basis rows from last to first with centres projected onto the Gram–Schmidt vectors; the kernel basis is verified complete (A·Tᵀ ≡ 0 and |det T| = q²), not merely four kernel vectors. Encryption/decryption equations are the GPV dual system. All displayed verdicts are computed per run (`scenario.test.ts` "derives every displayed verdict from the current run"), and the deterministic teaching randomness is confined to an explicit seam and disclosed.

**Source fidelity.** Declared: fixed tiny parameters, deterministic teaching randomness, no TrapGen (the basis is a fixed fixture), random-oracle profile only, no standard-model (H)IBE/ABE, no CCA, no enrollment/revocation, not constant-time, not an approved deployment scheme.

**Tests are real.** Vitest 37/37 (7 files); `npm run build` typechecks and emits 3 files plus a source map; Playwright 16/16 (11 claims + 5 a11y/reflow/keyboard). `scripts/mutations.mjs` (14 recipes with named owning tests, bundle restored byte for byte) replayed in full: **all 14 caught**; wired into `deploy.yml` before deploy.

**Live bytes.** `index.html` `81948ea0…`, `assets/index-1rdx_yam.js` `35018c4a…`, `assets/index-1rdx_yam.js.map` `62e0a565…`, `assets/index-CNUK2IaL.css` `6b3ba06d…` served from Pages are byte-identical to a fresh build of main (four files, as the roadmap says).

**Honest limits.** README: "Do not use this code, its parameters, its deterministic randomness, or its one-bit ciphertext format to protect data"; "intentionally insecure" profile that fails the theorem's prerequisites; central key escrow stated in Why it matters; "Retained Limitations" section.

**Coherence.** Six numbered exhibits (identity→syndrome, extraction, dual-LWE encryption, failure controls, public toy break, parameter/interface boundary) in one path, each in the README. GGH Trapdoor implements GGH signatures/Babai rounding and IBE Gate pairing IBE, so there is no duplication.

**New-repo justification: Yes.** A lattice (GPV) IBE shares no code with the pairing-based IBE Gate (BLS12-381 BasicIdent/HIBE/CLE) and only conceptual context with GGH Trapdoor; adding Gaussian preimage sampling and dual-LWE to either host would break the one-concept rule and the roadmap itself targeted a companion lab. The repository is self-contained (1,135 source lines) with its own gates.

**Findings and disposition.**
1. None.

## 29. Rank Metric — S10 (new repository)

Roadmap pins: S10 `83c8702f2f64` (PR #1 `ea94a1dc4485`, docs PR #3), maintenance pin `b9d9ba5887b1`. Fresh clone main is `b9d9ba5887b1`; the two commits past the S10 pin touch only `pages.yml` (dispatch), one `data-theme` assertion in `e2e/claims.spec.ts` and the `<html data-theme="dark">` pin in `index.html`.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| S10 extension-field vectors to base-field matrices; Hamming and rank weight on the same examples | Confirmed | — | `src/rank/field.ts` GF(16) with x⁴+x+1; `matrix.ts:5` `vectorToBinaryMatrix` expands each GF(16)⁴ vector into a 4×4 binary matrix over the polynomial basis, `binaryRank` by elimination, `hammingWeight` and `rankWeight` on the same input; a test matches an independent span-cardinality oracle for every GF(16)² vector |
| S10 small rank-decoding / MRD / Gabidulin example that exposes how the metric changes the problem | Confirmed | — | `gabidulin.ts`: [4,2] Gabidulin code from the linearized polynomial a₀x + a₁x² evaluated at 1, α, α², α³ (GF(2)-independent), full 256-word census with 256 distinct words, minimum rank distance 3 = n−k+1 and equality in the rank Singleton bound 2^{m(n−d+1)} = 256; `boundedDecode` is an exhaustive radius-1 decoder deriving decoded / refused from actual rank distance; `computeRankTwoCensus` enumerates every rank-2 error from the zero word |
| S10 family mathematics separated from any historical scheme's security status | Confirmed | — | README: "code mathematics, not an encryption scheme, KEM, approved parameter set, or deployable decoder"; GPT, Faure–Loidreau and RQC named with their cryptanalytic/selection status; Classic McEliece and HQC labelled as Hamming-metric comparisons; `LIMITATIONS.md` |

**Code matches claim.** Hand-checked: evaluation points 1, 2, 4, 8 are the basis 1, α, α², α³ so the code is MRD; d = 3, radius ⌊(d−1)/2⌋ = 1; the Singleton exponent m(n−d+1) = 4·2 = 8. The scenario outcomes (rank-one correction, rank-two refusal, rank-two miscorrection) are derived from `boundedDecode` and re-encoded independently (`independentReencodingMatches`, `distanceToReportedWord`). Mutations that would hard-code the radius claim or swap rank for Hamming weight are caught.

**Source fidelity.** The fixed field, basis and evaluation vector are declared; no claim about optimal decoding or larger parameters.

**Tests are real.** Vitest 22/22 (4 files); `npm run build` typechecks, emits 3 files and runs `verify-build.mjs`. Playwright 10 of 11 locally: the one failure, `e2e/a11y.spec.ts` "keyboard flow reaches the skip link and operates both workbenches", expects `End` on a focused `<select>` to change its value and retire the result (`data-status="stale"`); it fails deterministically (3/3) on macOS headless Chromium, where `End` does not change a closed select, and passes in CI on Linux (pages.yml run for `b9d9ba5887b1` succeeded). `scripts/claim-mutations.mjs` (10 recipes) replayed in full: **all 10 caught**; wired into `pages.yml` ahead of deploy.

**Live bytes.** `index.html` `8064f353…`, `assets/index-Bj2sAcBn.css` `2d50d09d…`, `assets/index-D5bNAyXV.js` `6c5099c3…` served from Pages are byte-identical to a fresh build of current main.

**Honest limits.** README and `LIMITATIONS.md`: not a cryptosystem, no deployment endorsement, toy field and length, GPT/Faure–Loidreau/RQC history kept separate from the implemented code.

**Coherence.** Two workbenches (metric comparison; Gabidulin encode/decode with census) plus the deployment-boundary section; the README lists each. The hub catalog credits the Gabidulin code to this lab alone; PQ Families, McEliece Gate and HQC Vault are Hamming-metric labs.

**New-repo justification: Yes.** Rank-metric codes need their own field/matrix/linearized-polynomial machinery that none of the Hamming-metric code labs contain, and grafting a second metric onto McEliece Gate or HQC Vault would contradict the lesson's own point that the metric changes the problem. The repo is small and self-contained.

**Findings and disposition.**
1. Low — the a11y keyboard test depends on platform-specific `<select>` keyboard semantics (`End` key), so it is red on macOS and green on Linux CI. Disposition: drive the select with `selectOption` or `ArrowDown` so the retirement assertion tests the lab, not the browser's platform widget.

## 30. SAML Binding — S12 (new repository)

Roadmap pins: S12 `17b148b74d54` (PR #1), maintenance pin `9c7a967fe9f7`. Fresh clone main is `9c7a967fe9f7`; the one commit past the S12 pin touches only `.github/workflows/deploy.yml`.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| S12 verify a signed synthetic assertion while showing how authorizing from a different XML node can still be wrong | Confirmed | — | `src/saml/sign.ts` signs a direct-child Assertion with xmldsigjs (enveloped, one same-document reference, exc-c14n in both places, RSA-SHA-256) under fresh WebCrypto RSA-2048 keys; `consumers.ts` differs only at the binding line: the vulnerable consumer takes the library boolean then re-queries `Assertion[0]`, the repaired one authorizes from the element `verifyBound` returns; `attacks.ts` `wrapInAdvice`/`siblingAssertionFirst` keep the IdP signature valid while the attacker's assertion is read first |
| S12 bind consumption to the verified object; audience, recipient, subject, InResponseTo and replay mismatches | Confirmed | — | `verify.ts` refuses multiple signatures/references, non-same-document URIs, zero or duplicate IDs, unsupported algorithms/transforms, wrong element name, wrong position (direct child of Response; Signature immediately after Issuer), recomputes digest and signature with WebCrypto and fails closed if the library disagrees; `checks.ts` tests Destination, Response InResponseTo, Status, audience, recipient, SubjectConfirmationData tuple (InResponseTo, NotOnOrAfter, forbidden NotBefore), AuthnStatement, validity window, and consumes replay IDs only after every check passes |
| S12 label the implemented OASIS profile and omitted behaviour | Confirmed | — | README "The profile, named": synthetic `S12-WBSSO-POST-SYNTH/1`, "registered nowhere"; omissions listed (metadata, X.509 trust administration, schema validation, XML encryption, logout, artifact/redirect bindings, session lifecycle, full transform surface, universal wrapping defence); the deliberately narrower AuthnStatement rule vs Errata 05 E26 is stated |

**Code matches claim.** Hand-checked against XML Signature 1.1 §3.2 (reference and signature validation), §4.4.3.3 same-document references, W3C Best Practice 14 (name and position) and SAML Core 5.4 (one reference, enveloped + exc-c14n). The recomputation path performs the enveloped transform, exclusive canonicalisation, SHA-256 and RSA verification independently of the library's verdict and the two are asserted equal. Every outcome in the comparison table is produced by running both consumers on the same bytes; a signature-bytes tamper fails at L1 for both while wrapping fails only the vulnerable one at L4, which is the lesson.

**Source fidelity.** Somorovsky et al. USENIX 2012 §8 is quoted for the boolean-API defect; the attacker model (sees a valid response, edits XML, holds no key) is declared; the hostile documents are labelled non-conforming inputs rather than IdP output.

**Tests are real.** Vitest 88/88 (7 files); `npm run build` typechecks and emits 4 public files (one lazy `lesson-*.js` chunk); Playwright 17/17. `scripts/mutations.mjs` (26 recipes with owning test files; clean baseline over every owning file, byte-for-byte restoration, baseline rerun) replayed in full: **all 26 caught**; wired into `deploy.yml` ahead of deploy.

**Live bytes.** `index.html` `038ddaf5…`, `assets/index-4c3pQH45.css` `72d89a5b…`, `assets/index-Okboewa8.js` `448ebd88…`, `assets/lesson-1JQWlTkZ.js` `7e32d4ca…` served from Pages are byte-identical to a fresh build of main (four files, as the roadmap says).

**Honest limits.** README "Threat model and limitations" and the profile section; the vulnerable consumer is "the brief's permitted anti-pattern, and it is labelled as such wherever it is shown".

**Coherence.** One honest route (sign → L1 → L2 → L3 → L4) then the wrapping variants and controls; the README's layer table names each. JWT Forge, PKI Chain and WebAuthn do not implement SAML or XML Signature; the hub catalog credits both to this lab alone.

**New-repo justification: Yes.** SAML/XML Signature needs an XML DOM, canonicaliser and signature library (`@xmldom/xmldom`, `xmldsigjs`) and a profile-check engine that no existing federation lab carries; JWT Forge is JSON/JWS and PKI Chain is X.509. Embedding a 2,800-line XML stack in either would dwarf its host.

**Findings and disposition.**
1. None.

## 31. ZK Proof Lab — RR-SUMCHECK-GKR (outside the 48)

Roadmap pin `df4db000b0c8` (PR #26). Fresh clone main is `df4db000b0c8`, identical to the pin. This item sits outside the 48-proposal denominator; the roadmap records it at line 53 and in the delivery table.

| Claim | Verdict | Severity | Evidence |
|---|---|---|---|
| Act A: explicit Boolean-hypercube sum-check with every degree and recurrence checked before the next challenge, ending in the verifier's direct evaluation | Confirmed | — | `js/sumcheck.js:89–235` `createSumcheckVerifier`: `receiveMessage` checks shape → degree bound → recurrence s_j(0)+s_j(1) = expected; `drawChallenge` is phase-guarded so no challenge exists before its message; `finish(oracle)` compares s_v(r_v) with one evaluation of g; `soundnessBound` v·d/|F| flagged vacuous when ≥ 1 |
| Act B: one fixed two-layer multilinear GKR reduction reusing the verifier, terminating in the verifier's own input-layer evaluation | Confirmed | — | `js/gkr.js`: `DEMO_CIRCUIT` (4 inputs, 4 internal gates, 2 outputs); per layer a degree-2 sum-check over 2k variables of Thaler's Lemma 4.7 polynomial, the verifier evaluating add̃/mult̃ itself from the wiring triples (`evaluateWiringExtension`), line reduction with degree ≤ k, r* drawn after q arrives, `terminal()` evaluates W̃_d from the public inputs |
| Controls derived from protocol state (wrong sum, carried lie, excessive degree, final evaluation, malformed replay, challenge order, tiny field, four GKR corruptions) | Confirmed | — | prover strategies in `createSumcheckProver` and `createGkrProver` (wrong-output, corrupt-gate, corrupt-wiring, invalid-line); `replaySumcheckTranscript` fails closed by name; `sumcheckCensus` enumerates every challenge vector over a tiny field and tallies which check fired |

**Code matches claim.** Hand-checked against LFKN §3 and GKR §3.1–3.3 / Thaler Lemma 4.7: the recurrence, the degree bound, the one-evaluation final check, the wiring-identity polynomial f_z(b,c) = add̃·(W̃(b)+W̃(c)) + mult̃·W̃(b)·W̃(c), the two-claims-to-one line trick and the union bound k₀/|F| + Σ(4k_{i+1} + k_{i+1})/|F| are as stated. The carried-lie polynomial has exactly d roots so the d/|F| round bound is tight, and the tests pin Thaler's worked example (H = 12) and the exact F₅ census.

**Source fidelity.** The exhibit page states "Not zero-knowledge · not a SNARK", labels the deterministic teaching seed as not secure verifier randomness, and the GKR module header says it implements none of the paper's uniformity machinery, sublinear verifier or general theorem; the H = {0,1} / multilinear adaptation is declared.

**Tests are real.** Vitest 94/94 (7 files); `vite build` emits 32 files; Playwright 72/72 (claims, a11y, tamper/collision, sigma- and sumcheck-mutation oracles); `tests/browser-quality.mjs` served from the repo root as CI does: 91 PASS lines, 0 FAIL, and the accessibility audit reports zero violations (served from `dist/` instead, four "stylesheet includes focus-visible" checks fail because the bundled CSS path differs — a harness/serving detail, not a page defect). `scripts/mutations.mjs` (15 recipes, each with a named "mutation oracle" browser test, five-step protocol) replayed in full: **15 of 15 killed with passing controls**; wired into `pages.yml` before deploy.

**Live bytes.** All 32 served files (index, ten exhibit pages, two test pages, 19 assets) are byte-identical to a fresh build of main; `exhibits/sumcheck-gkr.html` `05cccb51…`, `assets/sumcheckGkr-BFYZuSC8.js` `d589da3d…`.

**Honest limits.** Exhibit 08 banner and README: interactive proof of a sum / circuit evaluation, hides nothing, not ZK, not a SNARK, toy fields are not security parameters, "Do NOT use it for production security decisions".

**Coherence.** Eight exhibits in one lobby; the README lists each and names the two conceptual ones. Sum-check/GKR belongs here as the verifiable-computation counterpart of the lab's sigma protocols; zk-arena and snark-arena compare proof systems and do not execute sum-check.

**Findings and disposition.**
1. None.

## 32. Hub `learn/timestamping` workshop — S03

Roadmap pin hub main `a1971bd8bc0a` (PR #326). Current hub main `64ae547d1b6f`; `learn/timestamping/` and its tests are unchanged since the pin (`git diff --stat` empty). Audited from a fresh partial clone of the hub in the scratchpad.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| S03 stamp a Merkle root and verify each document's inclusion, with wrong-path/root controls | Confirmed | — | `learn/timestamping/core.mjs:52–102`: domain-separated leaf/node hashes, position-aware proofs, `issueBatchStamp` signs the root with a real P-256 key via `shared/crypto.mjs`, `verifyBatchDocument` reports signature, root, nonce and inclusion separately; mutations "left siblings on the wrong side" and "signed root equality is bypassed" caught |
| S03 renew still-trustworthy evidence across a key/algorithm epoch before assurance fails | Confirmed | — | `renewTimestamp` stamps `timestampTokenBytes(previousToken)`, which includes the prior signature; `assessArchiveEvidence` enforces `timely = renewalTime < oldTrustUntil` (strict cutoff), renewal inside the successor epoch, successor current, chronology, and an explicit `trustedTimeModel` premise |
| S03 compare unrenewed vs timely renewed records; a late stamp cannot repair forged or ambiguous history | Confirmed | — | reasons `unrenewed-expired`, `late-renewal`, `successor-expired`, `trusted-time-required` are computed from the timeline; a late genuine record and a post-compromise backdated forgery both pass the visible checks and are refused by the cutoff |

**Code matches claim.** The model is an RFC 4998-shaped JSON token as declared ("This is NOT RFC 3161 ASN.1/CMS"); `trustedTime: false` is returned for every local check so no browser clock is presented as trusted time. All outcomes come from the current run.

**Tests are real.** Protocol workshops gate reproduced from the clone: 43/43 logic and reading-path tests (`node --test` over four files), `learn/timestamping/mutations.mjs` **9 of 9 caught** from a passing baseline, and `tests/protocol-workshops-browser.test.cjs` 11/11 real-browser tests (shared with Fair Exchange).

**Live bytes.** `learn/timestamping/index.html`, `app.mjs`, `core.mjs` served from `crypto-lab.systemslibrarian.dev` are byte-identical to hub main.

**Honest limits.** Four documents, two-level tree, fictional two-key epoch, explicit trusted-time premise; no CMS/ERS ASN.1, hash-tree renewal, certificate validation, remote TSA or archival custody; the roadmap's S03 section says the same.

**Coherence.** The batching and renewal acts extend the workshop's existing signed-receipt route; one page, one path; Time Trust and Merkle Proofs are linked as prerequisites, not duplicated.

**Findings and disposition.**
1. None.

## 33. Hub `learn/fair-exchange` workshop — E-K-05

Roadmap pin hub main `3dd70fcb6587` (PR #328). `learn/fair-exchange/` and its test module are unchanged since the pin.

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| E-K-05 one named optimistic protocol whose honest path completes without the intermediary | Confirmed | — | `learn/fair-exchange/optimistic.mjs`: Asokan–Shoup–Waidner Protocol E (expanded 1999 report) over the RFC 7919 ffdhe2048 subgroup; Bob's Schnorr signature reduced to the public promise (d, c) with private inverse z (`reduceSchnorr`/`verifyReduction`/`recoverSchnorr`); E1–E3 escrows verified, E4 and E5–E6 direct sends; `intermediary.contacts` stays 0 on the honest path |
| E-K-05 recoverable evidence, stop/delay, compatible abort/resolve races | Confirmed | — | Alice's signature in ordinary RSA-OAEP escrow under the α condition; Bob's inverse in a Protocol D cut-and-choose verifiable escrow (16 rounds, commitments fixed before the challenge, β label binds Alice's ciphertext); `abort`, `bResolve`, `aResolve` serialise ABORT / DEPOSIT / NO-ABORT with NO-ABORT persisted before the escrow checks; unavailable-intermediary retry; `forget-state` durable-loss control; `busy` lock |
| E-K-05 each party's usable evidence; fairness, timeliness, availability and durable-state assumptions stated | Confirmed | — | `optimisticView`/`optimisticVerdict` distinguish verified-recoverable, TTP-only-checkable and independently usable peer signatures and name the assumption that fails in each terminal state |

**Code matches claim.** Hand-checked: Schnorr over the safe-prime subgroup with c < q and z = k + c·x; the promise d = g^z lets anyone check g^z = d·y^c without z; Protocol D's challenge-1 responses open `shifted = mask + z` with image g^shifted / d, and the TTP recovers z = shifted − mask after OAEP decryption; conditions are domain-separated hashes of the session transaction and keys. The report's Remark 16 ordering (NO-ABORT written before checks, not rolled back) is implemented and mutation-tested.

**Source fidelity.** Declared adaptations: 16 rounds instead of 40, RFC 7919 group and SHA-256 as a teaching instantiation ("RFC 7919 does not standardize Schnorr signatures or ASW"), 3072-bit RSA-OAEP; no theorem transfer, no private/authenticated TTP channels, identities, certificates or crash-safe storage.

**Tests are real.** Same gate as above: 43/43 logic tests including `tests/fair-exchange-optimistic.test.mjs` (pins the RFC 7919 modulus and a fixed Schnorr vector), `learn/fair-exchange/mutations.mjs` **16 of 16 caught**, browser 11/11.

**Live bytes.** `learn/fair-exchange/index.html`, `app.mjs`, `core.mjs`, `optimistic.mjs` served from the custom domain are byte-identical to hub main.

**Honest limits.** Module header and page: browser-local secrets, not a production signature/escrow/identity/transport/durable-storage service; the ideal-intermediary scenarios remain separate; Adaptor Gate covers atomic swaps.

**Coherence.** The optimistic act sits beside the pre-existing ideal-intermediary scenarios on one workshop page and does not alter them; the README names the construction.

**Findings and disposition.**
1. None.

## 34. Ledger check — roadmap counts, phase table, CATALOG.md, README rows, knowledge map

Source of claims: `docs/encyclopedia-roadmap.md` at hub main `64ae547d1b6f` (2,207 lines; the "Verification and publication record" at lines 2080–2207 was read in full). Hub generators were run read-only from the hub checkout: `readme-sync check`, `concept-sync check` and `catalog-sync check` all pass (252 cards; the hero reads 251 because the one learning-game card is excluded by the page's own JS; catalogued total 252).

| Ledger item | Roadmap / hub says | Observed | Verdict |
|---|---|---|---|
| Status table (line 85–89) | Planned 0, Live 48, Total 48; 17 P1, 24 P2, 7 P3 | 48 proposals, all marked Live in their sections; phase sizes 1+11+5 = 17 P1, 16+8 = 24 P2, 7 P3 | Consistent |
| Audit brief vs roadmap | brief: 47 Live, A-D-15 Planned | roadmap: A-D-15 Live at Anamorphic Channel `53a3ce20441e` (entries dated 2026-10-27, lines 2194–2196); the lab has a hub card, README row, knowledge-map node, CATALOG entry (source review `53a3ce20441e`) and concept-coverage line | Brief is stale; A-D-15 was not in the audit order and was not audited beyond this presence check |
| Phase guide table (line 652) | "Phase 6 … 4 live, 3 planned"; bullet at line 662: "E-K-10, L-R-13, S10 and S12 are live; the remaining three are planned" | line 1868: "All seven P3 specialist proposals are live"; L-R-11, L-R-12 and A-D-15 sections are Live; status table says Live 48 | **Internal inconsistency** in the roadmap (table and bullet not updated when the last three P3 items went live) |
| Per-proposal pins vs current `main` (31 labs + 2 workshops) | exact pins listed in each section | every pin exists in its repository and is on `main`; `main` is identical to the latest pin for 22 labs; it is ahead only by non-source or separately recorded commits for Envelope KMS (`ad7fab7a04aa`, PR #47 KWP policy, recorded nowhere in the S02 section), Proof Tally (`9394e3fd3fd8`, PR #20, recorded under PR-06), AES Anatomy (`61be3762a50c`, Act 10, not described in the roadmap), Residue Gate (vite bump), Hostile Paths (Playwright port), Rank Metric (dispatch + theme pin, covered by the maintenance pin), SAML Binding and ORAM Vault (deploy dispatch, covered by maintenance pins) | Consistent; the five maintenance pins at line 156 (ORAM Vault, Rank Metric, SAML Binding, DP Noise, Lattice IBE) all equal current `main` |
| Served-asset hashes recorded in sections | S02 (Envelope KMS) and S04 (Proof Tally) record served `index.html`/JS hashes from the pinned commit | the live sites serve the current `main` build (verified byte for byte), whose file names and hashes differ from the recorded ones because `main` moved one commit | Stale evidence lines in two sections; the labs are current |
| L-R-09 pins | "delivered source" `1f0b50595608` while the verification paragraph names `97d9e0ff6fbb` | both are ancestors of Search Vault main `28bb6f3c50e0` | Harmless inconsistency |
| `tools/catalog-exhibits.json` M-LFSR pin | `c4ef2da4b33f` | equals LFSR Forge `main` | Consistent |
| CATALOG.md source-review pins for the 32 labs touched by the rollout | pins recorded per entry | equal to current `main` for 30; **SAT Break** pinned at `38b92b51cb42` (three dependency/workflow-bump commits behind `9dffc06332e5`) and **Clock Arithmetic** pinned at `e6e1e39b124c` (one commit behind `b97b515033e2`, which changed only the `index.html` theme pin — the commit the roadmap itself calls "current exact main") | Two pins behind `main`; by this repository's own rule (`catalog-evidence verify` fails a stale pin even for non-source changes) both would be reported stale on the next weekly run |
| CATALOG.md totals vs roadmap snapshot | roadmap line 2112 (dated entry): "244 labs and 1,742 reviewed sections" | CATALOG now: 252 labs, 251 COMPLETE SOURCE REVIEW entries, 1,815 mapped sections | The roadmap figure is a dated snapshot, not a current claim; superseded, not wrong |
| README catalog rows / `index.html` cards / `knowledge-map/catalog.json` | every delivered lab has a card, row and node | confirmed for all eight new repositories (`dedup-vault`, `dc-net`, `ipsec-ike`, `distance-bounding`, `hostile-paths`, `lattice-ibe`, `rank-metric`, `saml-binding`), for `sat-break` and for `anamorphic` | Consistent |
| SAT Break | listed in the audit order | no roadmap proposal references it; the lab is live and tested (section 13) | Order item without a ledger claim; nothing to reconcile |
| Mutation-evidence claims | each section cites "all N clean-baseline mutations" | reproduced in full or by replay for every lab with a committed runner; **Shelf Oracle** ("the runner's seventeen-mutation total") and **Attribute Gate** (nine documented mutations) have no runner in their repositories | Two ledger claims rest on hand-applied mutations with no replayable artefact (sections 6 and 8) |

## 35. Top-10 findings, ranked by severity

1. **Medium — Shelf Oracle (L-R-04, L-R-05, A-D-10): no committed mutation runner.** The roadmap credits "the runner's seventeen-mutation total" but the repository has no runner, no CI step and no evidence artefact; the README describes hand-applied mutations. Disposition: commit the seventeen recipes as a clean-baseline runner with named owning tests and wire it into the deploy gate (section 6).
2. **Medium — Attribute Gate (A-D-03, L-R-03): no committed mutation runner.** Nine documented mutations reproduce by hand (2/3/3 failures observed) but nothing replays them. Disposition as above (section 8).
3. **Low (ledger) — Roadmap Phase 6 counts contradict the rest of the roadmap.** The phase table (line 652) and coordination bullet (line 662) still say "4 live, 3 planned" while the status table, the P3 preamble (line 1868) and the L-R-11, L-R-12 and A-D-15 sections say all seven are live. Disposition: update the two lines (section 34).
4. **Low (ledger) — Two CATALOG.md source-review pins are behind `main`.** SAT Break (`38b92b51cb42` vs `9dffc06332e5`) and Clock Arithmetic (`e6e1e39b124c` vs `b97b515033e2`); neither drift touches source, but the hub's stale-pin rule will flag both. Disposition: re-read and re-pin with `catalog-evidence` (section 34).
5. **Low — Publish-request control hard-codes Node's bundled-npm path (Envelope KMS, LLL Break, MAC Race).** `tests/publish-request*.mjs` derives `npm-cli.js` from `process.execPath/../../lib/node_modules/npm`, which does not exist on Homebrew Node 26; `npm run build` and the Playwright web servers fail locally while CI is unaffected. Reproduced through a scratch node shim, after which every gate passes. Disposition: fall back to `process.env.npm_execpath` as Matsui Line and Shamir Gate already do (sections 1, 24, 25).
6. **Low — Shamir Gate (S07): the visual mutation runner counts any non-zero exit of two test files as a kill.** No named owning test, no assertion-only rule, no bundle-hash movement check; all 14 recipes do kill real assertions today. Disposition: adopt the fleet's named-owner pattern (section 21).
7. **Low — Rank Metric (S10): a keyboard accessibility test depends on platform `<select>` semantics.** `End` changes the value on Linux CI but not on macOS Chromium, so the test is red locally and green in CI. Disposition: use `selectOption` or arrow keys (section 29).
8. **Low (ledger) — Stale served-asset evidence and a pin inconsistency.** S02 (Envelope KMS) and S04 (Proof Tally) record hashes of a build one commit behind what is served; L-R-09's section names two different pins; the AES Anatomy Act 10 commit on `main` is not described in the roadmap. All three labs are current and byte-identical to their builds. Disposition: refresh the three evidence lines (sections 1, 2, 4, 9, 34).
9. **Low — Displayed figures that are literals rather than computed values.** Matsui Line's control verdict prints the signed path sum as a literal "0" and states "1/4 or 5/16" and "0 times" as prose (all pinned by unit tests, including a 65,536-key exhaustive proof); AES Anatomy's common-mode recompute control cannot fail; Search Vault's E-K-08 final error rates are tautological because the lesson throws on an oracle mismatch. None is false; each is a sentence the page did not derive. Disposition: render the computed value or label the sentence as a pinned fact (sections 2, 4, 17).
10. **Low — Mutation coverage gaps that CI does not replay.** Proof Tally's 70-recipe verdict registry has a coverage gate but no routine kill replay; IBE Gate's CLE mutations have no HIBE counterpart; LFSR Forge's cube oracle carries an unverified note on ePrint 2008/385. Disposition: schedule the replay, add HIBE recipes, verify or remove the note (sections 3, 9, 12).

Everything else in the rollout reproduced as claimed: 31 labs and 2 hub workshops, every pinned commit present on `main`, every live site byte-identical to a fresh build, every committed mutation gate replayed in full (Attestation Gate 35/35, DP Noise 22/22, ORAM Vault 22/22, SAML Binding 26/26, MAC Race 24/24, LLL Break 19/19, Distance Bounding 15/15, Hostile Paths 15/15, ZK Proof Lab 15/15, Lattice IBE 14/14, Shamir Gate 14/14, Rank Metric 10/10, Signature Gate 8/8, hub workshops 9/9 and 16/16) or spot-checked where the runner takes hours, and the honest-limits text matched the code in every lab. No proposal was found Overclaimed and no Defect was found.

Audit file: `/Users/gmcas/repos/crypto-lab/ENCYCLOPEDIA-AUDIT-2026-10-27.md`.

## 36. Anamorphic Channel (crypto-lab-anamorphic) — A-D-15 (new repository)

Roadmap pin `53a3ce20441e` (implementation PR #1 `c2ef8df2dd20`, dependency PR #2, master-template PR #3). Fresh clone main is `53a3ce20441e`, identical to the pin. The implementation-to-final diff touches only `README.md`, `e2e/*`, `package*.json`, `playwright.config.ts`, `src/main.ts` and `src/style.css`; `src/anamorphic.ts`, `src/scenario.ts`, `src/comparison.ts` and `src/messages.ts` are unchanged, as the roadmap says. Source of claims: the A-D-15 proposal (roadmap lines 2028–2050), the delivery entry (line 171) and the three dated ledger rows (lines 2194–2196).

| Proposal | Verdict | Severity | Evidence |
|---|---|---|---|
| A-D-15 implement one explicitly named anamorphic construction/model | Confirmed | — | `src/anamorphic.ts` implements Banfi–Gegier–Hirt–Maurer–Rito Construction 6 / Figure 11 (`SyncAnamElGamal`, the pre-computation form Σ′₂ of Construction 2) on ElGamal over ristretto255: PK = sk·G, C₁ = M + r·PK, C₂ = r·G; aGen builds T[m̂·G] = m̂ and dk = (K, T, pk) with no sk (`:196`); aEnc t = F(K, ctr), r = m̂ + t mod q (`:260`); aDec S = C₂ − t·G, table lookup, ⊥ on a miss (`:294`); F is domain-separated HMAC-SHA-512 mapped into Z_q by deterministic rejection sampling (`:175`) |
| A-D-15 separate ordinary/coercer and double-key views; reveal the ordinary key and prescribed overt message; compute the hidden receiver's result | Confirmed | — | `src/scenario.ts:56` `runScenario` generates fresh keys per run, opens the same ciphertext with `decryptOrdinary(sk)` and `decryptAnamorphic(dk, ctr)`, and `src/main.ts:245–267` renders three cards: sender, coercer (full `sk` hex disclosed, "Double key disclosed? NO"), double-key receiver ("Ordinary sk needed? NO"); every verdict class is computed from the run (`ordinaryPass`, `covertPass`, four negative controls, counter-reuse and fresh-counter booleans, the recomputed r = m̂ + F(K,ctr) relation in an explicitly omniscient classroom panel) |
| A-D-15 compare with the public subliminal bit and the role-revealing decoy container without attributing anamorphic security to either | Confirmed | — | `src/comparison.ts` rows for Subliminal Channels ("Not encryption and not anamorphic security") and Shadow Vault ("No role privacy; an extra role-revealing AEAD slot is not anamorphic encryption"); `comparison.test.ts` and browser claim "the comparison table preserves all three claim boundaries"; mutation 15 ("comparison grants anamorphic security to the subliminal channel") is caught; the PPY22 "append a random string" rejection is explained beside the table |

**Code matches claim.** Independent recomputation (auditor script using only `@noble` primitives and the lab's message tables, never `anamorphic.ts`'s encryption/decryption paths): for all 4 overt × 8 covert × 4 counter cases (128/128) the lab's ciphertext equals (m·G + r·PK, r·G) with r = m̂ + HMAC-SHA-512-derived t, the ordinary opening C₁ − sk·C₂ equals the overt point, the covert opening C₂ − t·G equals m̂·G, and a wrong counter or an independent double key returns ⊥; 200/200 ordinary ciphertexts return ⊥ under the double key; counter reuse repeats C₂ across different overt messages while C₁ differs, and a fresh counter changes C₂; the printed robustness term 8/q < 2⁻²⁴⁹ is correct for the 253-bit ristretto255 order, and `GROUP_ORDER` equals noble's. Nothing is simulated: keys, PRF output, points and verdicts are computed per run; the only fixed strings on the result cards describe the model ("Fields on wire: C₁, C₂ only", "Double key disclosed? NO"), and the wire-shape verdict is computed by `isCanonicalWireCiphertext` and is mutation-tested for falsifiability. Scalar sampling is exact rejection sampling with a bounded loop; the wrong-key control refuses to render if the two double keys coincide.

**Source fidelity.** Checked against the ePrint/ETH PDF of BGHMR24 (text extracted locally): Construction 5 (sk ← Z_q, pk = g^sk, c₁ = m·pk^r, c₂ = g^r, Dec c₁·c₂^{−sk}), Lemma 5.1 (⊕ is addition mod q; α(pk,m,r) = m·pk^r, β(r) = g^r injective; γ(a,b) = a·g^{−b}), Figure 11 (aGen: K ←$ K, T[g^m̂] := m̂, dk := (K, T, pk); aEnc: t := F(K, ctr), r := m̂ ⊕ t, (c₁, c₂), return (c; ctr+1); aDec: t := F(K, ctr), s := c₂·g^{−t}, m̂ := T[s]), Figure 7 line 06 (return ⊥), Lemma 4.3 (Adv^sec = Adv^prf with q ≤ τ), Lemma 4.4 (Adv^rob ≤ Adv^prf + qℓ/ρ), Figure 3 Init returning (sk, pk) to the distinguisher, and Figure 4's normal-Enc-then-aDec robustness game all match the lab's transcription table in `docs/source-map.md` and the page's section 02. The five adaptations (A1 concrete ristretto255 group written additively, A2 ℓ = 8 covert scalars and four overt group elements, A3 the counter supplied per call instead of carried as state and returned as ctr+1, A4 browser implementation with no constant-time or interoperability claim, A5 aGen taking only pk because dk never contains sk) are declared on the page in their own section ("Where this page departs from the paper, and how far"), each marked with a `data-adaptation` attribute that the browser claim "every declared adaptation is named on the page" asserts. No undisclosed deviation found.

**Tests are real.** `npm ci` clean; Vitest 32/32 (4 files; includes an HMAC-SHA-512 known answer, exact-sampling and stuck-RNG tests, every overt×covert recovery, ⊥ controls, counter-reuse, malleability and the robustness term); `npm run build` typechecks and emits `index.html`, CSS, JS and a source map; Playwright 15/15 (11 claims + 4 accessibility/reflow/keyboard). `scripts/mutations.mjs` (15 named recipes, each owned by one named Vitest test; clean baseline and baseline build first, a mutation must change the production bundle, sources and bundle restored and re-hashed) replayed in full: **all 15 caught**; wired into `deploy.yml`'s mutation job before deploy. Roadmap figures (32 unit, 11 claim, 4 a11y, 15 mutations) reproduce exactly.

**Live bytes.** All four served files — `index.html` `966836e9…`, `assets/index-C4rJL65p.css` `0125cca6…`, `assets/index-RSjoR_GQ.js` `e83a3440…`, `assets/index-RSjoR_GQ.js.map` `83627148…` — are byte-identical to a fresh build of main, as the roadmap says.

**Honest limits.** Page section 05 "What this run does not prove" and README "Retained limitations" state, and the code bears out: computational not empirical (no browser sample establishes Definition 3.3; the wire-shape verdict is labelled syntactic); PRF and DDH do different jobs (Lemma 4.3 is PRF-only; DDH protects the overt message from outsiders, not from the coercer who holds sk); double-key compromise is total and retroactive (K and T are static); counter reuse is a demonstrated failure, not a supported mode (the paper assumes non-repeating counters); no integrity/CCA/constant-time/interoperability/custody claim; robustness is a bound with the PRF term "reported in words rather than silently dropped". The README adds "Do not use this code as a covert-communications tool or production cryptosystem."

**Coherence.** One learner path in five numbered steps: 01 execute the coercion experiment (three views, four negative controls, counter-discipline panel and the omniscient audit rendered from the same run) → 02 inspect the Construction 6 equations → 03 declare the adaptations → 04 distinguish the three channels → 05 retain the boundary. The README's six "exhibits" map onto these (items 4 and 5 are panels inside the run result), and the hero and card describe what the page does without over-claiming. Duplication: the hub catalog credits anamorphic encryption to this lab alone; plain ElGamal is also implemented by ElGamal Plain, Threshold Decrypt and Hidden Bit, but none of them has a double key, a coercion model or a PRF-masked randomness channel. Subliminal Channels and Shadow Vault are compared, linked and explicitly not reproduced.

**New-repo justification: Yes.** The two labs the proposal names as comparisons could not host it: Subliminal Channels is a P-256 ECDSA parity-selection lesson whose README says it is not encryption, and Shadow Vault is a Rust/WASM ChaCha20-Poly1305/Argon2 container; neither has an ElGamal or ristretto255 stack, and bolting a double-key model onto either would blur the exact boundary the comparison table exists to draw. ElGamal Plain is the only plausible host, but it teaches plaintext-space attacks on ElGamal, and a second concept (coercion-resistant covert channels with a PRF double key, counters and robustness bounds) would break the one-concept rule. The repository is small (903 source lines), self-contained, and carries its own unit, browser, mutation and CodeQL gates, so the cost of a new repo is low.

**Findings and disposition.**
1. None. All three A-D-15 criteria are confirmed at the pin and on current main; the construction matches BGHMR24 Construction 6 / Figure 11 and Lemmas 4.3, 4.4 and 5.1 line for line; every roadmap figure reproduces.
