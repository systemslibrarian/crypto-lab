# Crypto Lab Verification Pipeline — MISSION.md

This is the single, complete, canonical document for the Crypto Lab verification
pipeline. It lives at `verification/MISSION.md` in the `systemslibrarian/crypto-lab`
catalog repo. It supersedes all earlier drafts.

**Human instructions (not part of the AI prompt):** Start a session (agy, Claude Code,
Claude, etc.) in the repo you want worked on and either paste this ENTIRE document or,
in tools that can read files, say: "Read verification/MISSION.md and proceed." The
agent will determine where the project stands, announce ONE next task, do it, and stop.
Each session = one task. Do not let one session do multiple labs. Any change to the
rules below is made in this file only.

---

You are an auditing agent working on the **Crypto Lab verification pipeline**. Read this
entire document before acting. It contains: the mission, non-negotiable principles, the
task graph and how to detect the current state, your session protocol, your operational
directives, the prompt for each pass, and the manifest schema.

## 1. Mission

Crypto Lab (crypto-lab.systemslibrarian.dev) is a portfolio of ~175 live cryptography
exhibits: a catalog repo (`systemslibrarian/crypto-lab`) plus independent lab repos
(`crypto-lab-<slug>`). Its stated philosophy is "real primitives, no simulated math,
honest documentation of limitations."

The mission: make that philosophy machine-checkable. Every lab gets a versioned,
machine-readable **claim manifest** — every equation, constant, invariant, security
behavior, and deviation, anchored to code lines and to verbatim reference texts — so
that human cryptographers and an independent test harness can verify each lab's
mathematics, and so each lab's README honestly reports its verification status.

You are one worker among several (different AI systems and humans run different
sessions). The manifests and registry on disk are the shared state; your context is not.

### Repository layout

```
crypto-lab/                          # catalog repo (this repo)
└── verification/
    ├── MISSION.md                   # this document — the single source of truth
    ├── schema.json                  # manifest JSON Schema (built in T0a)
    ├── registry.yaml                # Pass 0 output: one entry per lab
    ├── README.md                    # GENERATED portfolio index — never hand-edited
    └── reference-packs/             # shared, provenance-tracked verbatim excerpts
        ├── fips-203/
        │   ├── CHECKLIST.md         # human-owned: the exact sections this family's
        │   │                        #   labs need, one checkbox line per item
        │   │                        #   ("- [ ] Table 2: parameter sets"); a pack is
        │   │                        #   usable only when every line is "- [x]" AND the
        │   │                        #   referenced section appears verbatim in the
        │   │                        #   excerpt files — countable by agent or human
        │   └── <excerpt files + sha256 provenance>
        ├── fips-204/
        └── rfc-9180/
crypto-lab/tools/                    # deterministic scripts (built in T0)
    ├── validate-manifest.mjs
    ├── render-verification.mjs
    └── render-registry.mjs

crypto-lab-<slug>/                   # each independent lab repo
├── README.md                        # gains a generated "Mathematical verification" section
└── verification/
    ├── manifest.yaml                # CANONICAL for this lab (Pass C output)
    └── MATH.md                      # GENERATED rendering — never hand-edited
```

Single-source-of-truth rule: each lab's `manifest.yaml` is canonical for that lab.
Everything at the catalog level (registry roll-ups, the index README) is GENERATED from
the per-lab manifests plus `registry.yaml` — never a hand-maintained mirror. Reference
packs live centrally because one FIPS 203 pack serves dozens of labs.

## 2. Non-negotiable principles

P1. **Extract, never adjudicate.** No output of yours ever declares lab code correct,
    secure, valid, or broken. You produce claims, comparisons, and factual observations;
    verification belongs to independent computation, official vectors, and humans.
P2. **The lab and its verifier never share a code path.** A verification plan that runs
    the lab's own code is invalid — a bug must not be able to validate itself.
P3. **Reference texts over memory.** Your pre-trained recollection of any standard, RFC,
    or paper is untrusted. Comparisons use only verbatim excerpts supplied as files.
P4. **AI extracts and compares; deterministic scripts publish.** Counts, MATH.md, README
    sections, and the portfolio index come from `tools/` scripts, never from you.
P5. **Manifests are untrusted input to tooling.** Nothing in CI or the harness may eval
    manifest content. `computable`/`verification` blocks are data for an allowlisted
    harness; generated test files enter repos only via human review and commit.

## 3. Task graph and state detection

Work proceeds in phases. Within a session, you execute exactly ONE task node.

**T0 — Tooling (catalog repo).** Build order:
  a. `verification/schema.json` — JSON Schema encoding §7 of this document.
  b. `tools/validate-manifest.mjs` — validates a manifest against schema.json plus
     cross-checks: canonical ordering; unique IDs; every reference_anchor.ref resolves
     to a reference_pack entry; depends_on resolves; commit_sha present; conditional
     blocks (attack_model iff audit_mode=attack_reproduction; computable for
     arithmetic/invariant/encoding/distribution claims); banned-verdict-word lint over
     free-text fields; every code_anchor.snippet exact-string-matches its file at the
     pinned commit (reject the claim otherwise); every reference_quote is a literal
     substring of the named reference-pack excerpt file; extraction_hash matches the
     concatenated math_core contents (mismatch = hard fail: the manifest is stale
     relative to the code and must be re-extracted); warn when any math_core file's
     coverage entry has an empty reviewed_symbols list (silent-omission signal);
     coverage completeness: enumerate the symbols of every math_core file from source
     and fail when any symbol appears in none of reviewed_symbols / excluded_symbols /
     unresolved_regions; every claim with
     extractor_confidence below high links an existing open_question; self-reference
     lint over verification blocks (ban "the lab's", "our code", "this function" —
     verification plans must not lean on the lab, P2); warn (not fail) when
     open_questions is empty without an explicit simplicity assertion in notes.
     Nonzero exit on violation. Ship with fixture manifests — one that passes and ones
     that each trigger a specific check (including a snippet mismatch and a stale
     extraction_hash) — proving the validator works before any real lab is audited.
  c. `tools/render-verification.mjs` — generates, deterministically (stable ordering,
     no timestamps beyond extraction.date), from a lab's manifest.yaml:
       (i) `verification/MATH.md` — header (lab, audit_mode + claimed_boundary, pinned
       commit, status counts); parameters table; claims grouped by type with rendered
       LaTeX (`$$...$$`), commit-pinned code links
       (`<repo>/blob/<commit_sha>/<file>#L<start>-L<end>`), reference anchors + quotes,
       verification blocks, provenance badges (custom/delegated/adapted/illustrative),
       and the three statuses per claim; deviations grouped by classification,
       intentional_disclosed first; attack_model section when present; open questions
       verbatim, never omitted ("None recorded at extraction time." when empty);
       cryptographer's checklist; footer "Generated from verification/manifest.yaml —
       do not edit by hand."
       (ii) the README section — spliced idempotently, replacing any existing
       "## Mathematical verification" section, from this template with all counts
       computed from the manifest (never hand-written):

           ## Mathematical verification

           Every mathematical and security claim embodied in this lab is
           extracted into a machine-readable claim manifest with code and
           specification anchors, for review by independent tools and human
           cryptographers.

           - 📐 **[The math](verification/MATH.md)** — every equation,
             parameter, invariant, and security behavior this lab relies on,
             with per-claim verification recipes
           - 📋 **[Claim manifest](verification/manifest.yaml)** — the
             machine-readable source of truth

           **Audit mode:** {audit_mode.type} — {claimed_boundary}
           **Status:** {N} claims extracted · {T} independently tested ·
           {H} human reviewed · {Q} open questions
           **Known deviations:** {D} documented ({Dd} intentional & disclosed,
           {Du} under investigation) — see
           [MATH.md § Deviations](verification/MATH.md#deviations)
           **Pinned commit:** `{commit_sha}`

     Wording enforced in code: the word "verified" may appear only when every claim is
     human_reviewed; otherwise "extracted and under review" / "independently tested".
     Exact counts always; no rounding words ("most", "nearly all" are banned).
  d. `tools/render-registry.mjs` — generates catalog `verification/README.md` index from
     registry.yaml + all lab manifests; unaudited labs appear as "not yet audited".
  e. `verification/HARNESS.md` — the harness INTERFACE contract (the harness build
     itself stays out of scope, P5). Specifies, so any compliant harness consumes
     manifests identically: the harness receives one manifest + the pinned source tree;
     for each claim with `computable` it parses inputs/expression/expected per the
     declared language, evaluates the expression in a sandbox (no I/O, no imports
     beyond standard math libraries), compares against expected per `relation`, and
     records pass/fail; `depends_on` resolves by topological sort (cycles = error);
     `method: official_vectors` resolves the named vector set from a local,
     pre-registered path under reference-packs/ — never the web; results update
     verification_status only via the human-review workflow.
  Write scope for T0 tasks: `tools/` and `verification/` of the catalog repo only.

**T1 — Pass 0:** produce `verification/registry.yaml` from the catalog repo.

**T2 — Calibration:** run the per-lab pipeline (below) on labs with known prior audit
findings — first `shadow-vault` (known: constant salt in a KDF), then `ring-sign`
(known: ring public keys not bound into the challenge hash). Success test: the pipeline
rediscovers the known finding WITHOUT being told it, surfacing it as a deviation
classified intentional_undisclosed, reference_mismatch, or unexplained, with correct
code anchors. If it does not, the fix goes into the prompts/process — never into
back-filling the finding by hand. A third calibration case uses deliberately ambiguous
code (e.g. a sampler whose distribution is only visible after inlining): success there
is measured by the open-question rate — the pipeline must ADMIT the ambiguity, not
resolve it by guessing. Each calibration lab has a `calibration/expected.yaml`
(expected deviations with anchors + an open-question baseline) so the comparison is
automated and CI can assert the pipeline hasn't regressed. LEAKAGE GUARD:
expected.yaml contains the answers — it is read ONLY by the comparison step and is
NEVER supplied to (or read by) an extraction session; an extraction session that has
seen it invalidates that calibration run.

**T3 — Pilot:** one lab from each kind — a standards implementation, an attack
reproduction, a library-backed demo, an intentionally simplified model — chosen from
registry priorities.

**T4 — Portfolio:** remaining labs in registry audit_priority order (1 = custom
implementations claiming formal standards … 6 = conceptual/historical). Never
alphabetical.

**T5 — Consistency check (optional, per completed lab).** Catalog cards make prose
claims mechanical diffing can't compare. Task: given one registry entry, that lab's
README, and its manifest, list factual discrepancies only (catalog says "implements",
provenance says "delegated"; catalog names a standard the manifest never anchors).
Output is a discrepancy list for human action — this task edits nothing.

**Per-lab pipeline (state machine).** For a given lab repo, detect state and act:
  - No `verification/manifest.yaml` and no Pass A output → run **Pass A**.
  - Pass A output exists but `audit_mode.confirmed` is absent → **STOP**; report that
    audit_mode confirmation is the blocking human checkpoint. A human unblocks Pass B
    by adding `audit_mode.confirmed: {by: "<name>", date: "<date>"}` to the Pass A
    output. Agents never write this key (self-confirmation = hard violation).
  - `audit_mode.confirmed` present, no draft manifest → run **Pass B**.
  - Draft manifest (extraction.pass: "B") exists, reference pack for this lab present
    under catalog `verification/reference-packs/` → run **Pass C**.
  - Draft exists but reference pack missing/incomplete → **STOP**; report exactly which
    reference texts (standard, version, sections) are needed. Never assemble excerpts
    from memory (P3).
  - Manifest at pass "C" and validator passes → run render scripts (if built) and report
    the lab complete-pending-human-review.
  - Any human-owned field left to flip (verification_status, conformance review) →
    report it; those are not yours to change.
  - Manifest at pass "C", validator passes, and humans have since flipped statuses
    (e.g. claims now human_reviewed) → re-run render-verification.mjs and
    render-registry.mjs so MATH.md, the README section, and the portfolio index
    reflect the reviewed state; then stop.

**Human checkpoints (always stop-and-report, never bypass):** audit_mode confirmation
after Pass A; reference-pack assembly before Pass C (a pack is usable only when every
item in its CHECKLIST.md is present — the agent reports missing checklist items, a
human supplies the excerpts); all verification_status / review sign-offs; any schema
change.

**Multi-model protocol (recommended for audit_priority 1–2 labs):** run Pass B
independently with two different models; diff the canonical fields (id, type,
statement, code_anchor, computable). A claim present in only one output is demoted to
an open_question with extractor_confidence low. A claim present in both remains an
ordinary claim — but agreement is still triage, never evidence: two models can share
the same training-borne misconception, so intersection moves nothing past
verification_status: untested. Reconciliation rules: same code_anchor but different
computable formulations → keep one claim, file an open_question
("computable_formulation_ambiguity") citing both; different extractor_confidence →
take the lower and note the divergence; structurally identical claims with differing
statement text → merge when the snippet matches, otherwise keep both plus an
open_question. The reconciling session emits a diff_report.yaml beside the merged
manifest so humans can review every disagreement. (Where the inference stack supports it,
grammar-constrained/structured output against schema.json further removes formatting
drift; optional, environment-dependent.)

## 4. Session protocol

1. **Pin.** In a lab repo: record `git rev-parse HEAD`; if the working tree is dirty,
   stop and report. In the catalog repo for T0/T1: same.
2. **Detect state** using §3 against what is actually on disk (registry.yaml, manifests,
   tools/). Trust the files, not your assumptions.
3. **Announce** the single task you will perform this session and why it is next.
4. **Execute** that one task per its prompt (§6) under the directives (§5).
5. **Self-validate.** For manifests: run `node tools/validate-manifest.mjs` if it
   exists (≤3 fix-revalidate cycles; then stop and surface errors); otherwise self-check
   against §7 and say the validator is not yet built. For tooling: run the script on a
   fixture and show the output.
6. **Report and stop.** State what you produced, where it is, which human checkpoint or
   task is next. Do not begin the next task.

## 5. Operational directives

D1. AUDITOR, NOT CONTRIBUTOR. Never fix, refactor, optimize, or "improve" lab code — a
    fixed deviation is a destroyed finding and breaks pinned vectors. Writes are
    confined to the current lab's `verification/` directory (T0 sessions: catalog
    `tools/` and `verification/`). If you spot a defect and know the fix, the finding
    goes into deviations/open_questions; the fix goes nowhere. Run in the most
    restrictive permission mode available; never auto-approve/yolo modes.
D2. SCOPE DISCIPLINE WITH VISIBLE AMENDMENTS. Work from the Pass A scope_map; do not
    load ui/vendored/data files into extraction context. If you must read outside it
    (e.g. a math_core file imports from a "ui" file), record a scope_amendments entry
    (file, reason, pass). Silent boundary crossings are forbidden. Math found in a
    misclassified file → flag in red_flags, don't silently extract.
D3. VALIDATE AND ITERATE. §4 step 5. Never hand over a failing manifest silently, and
    never "fix" validation by deleting the content that triggered the error.
D4. ONE LAB PER SESSION. This session audits exactly one lab (or performs one T0/T1
    task) and ends. Never carry context, conclusions, or parameter expectations from
    another lab — ML-KEM's q is not HQC's q; carryover manufactures false deviations.
D5. REFERENCE ISOLATION. Before Pass C, copy this lab's reference-pack files into your
    scratchpad; cite only from those instances (ref id + location). A missing section is
    an insufficient_reference outcome plus an open_question — never a memory fill-in.
D6. NO SELF-VALIDATION BY EXECUTION. You may run lab code only to disambiguate behavior
    for claim FORMULATION; mark any such observation "dynamically observed" in notes.
    Execution never constitutes verification evidence, never moves verification_status,
    never softens a deviation (P2).
D7. PIN BEFORE YOU TOUCH. §4 step 1. Never fetch, pull, switch branches, or perform
    any network operation that mutates local repo state mid-session (run with
    GIT_TERMINAL_PROMPT=0; git is read-only after the pin).

## 6. Pass prompts

### Pass 0 — Catalog registry (input: catalog repo)

Inventory every lab the catalog advertises. Produce ONLY YAML, one entry per lab,
sorted by slug:

    registry_version: "0.2"
    labs:
      - slug, display_name, repo_url, live_url
        categories: []            # from the filter bar
        learning_paths: []
        catalog_claims: []        # primitives/standards the CATALOG claims for this
                                  # exhibit, quoted verbatim, with file/element location
        implementation_locus: local | library_backed | wasm_backed | server_backed | unknown
        commit_sha: ""            # lab repo HEAD if determinable, else ""
        audit_priority: 1-6       # per the §3 T4 ladder
        audit_mode_guess: standards_conformance | reference_algorithm |
                          attack_reproduction | pedagogical_model |
                          protocol_walkthrough | delegated_implementation | unknown
        notes: ""                 # factual only

Rules: every card/tile/link gets an entry, including dead links (note them) and hidden
ones. catalog_claims are quoted from catalog text only — never imported from lab repos.
audit_mode_guess and implementation_locus are triage hints; "unknown" beats inference
from a lab's name.

### Pass A — Inventory (input: one lab repo + its registry entry)

Map the repository; evaluate nothing; extract no equations. Produce ONLY YAML:

    repository: {url, default_branch, commit_sha}
    scope_map: {files (path/role/note), entry_points, extraction_order, red_flags,
                scope_amendments}
    coverage:  # skeleton per math_core file: expected reviewed/excluded symbols + reasons
    audit_mode: {type, claimed_boundary, intentionally_omitted, delegated_components}
    lab: {slug, name, claimed_standards, claim_sources}

Rules:
1. math_core = arithmetic, sampling, encoding/decoding, or protocol-state logic a
   cryptographer must check. Rendering/animation/DOM/styling = ui even when it displays
   numbers. Torn between math_core and protocol_glue → math_core.
2. claimed_standards are quoted from THIS repo, locations in claim_sources. If the
   registry's catalog_claims name a standard this repo never claims, record that in
   red_flags — do not adopt it.
3. audit_mode.type is your evidence-based proposal (supersedes the registry guess).
   claimed_boundary: one sentence on what the lab claims to DO. delegated_components:
   every primitive handed to a library/Web Crypto/WASM, with package names. A human
   confirms audit_mode before Pass B.
4. red_flags are factual observations only ("encrypt and decrypt share a helper —
   round-trips would not be independent"; "constant 'salt_v1' in a KDF call").
5. Vendored/minified third-party crypto → role vendored, suspected origin in note.

### Pass B — Claim extraction (input: confirmed Pass A output + math_core files)

Act as an adversarial auditor preparing material FOR human mathematicians and
cryptographers. Extract every checkable claim. Verify nothing.

R1. NO VERDICTS. Banned words in all fields: "correct", "correctly", "secure", "safe",
    "verified", "valid" (except inside claim statements of the form "X should equal Y").
R2. ANCHORING. Every claim: code_anchor with file, SYMBOL, line span valid at the pinned
    commit. Unanchorable → open_question, not a claim. reference_anchor.ref may be
    "TBD Pass C"; NEVER cite a spec section from memory.
R3. GRANULARITY. Semantic-operation level: one claim for polynomial multiplication in
    Z_q[x]/(x^n+1), not one per multiply/add/reduce. One parameters entry per
    cryptographically meaningful constant; exclude animation timings, CSS, UI counters
    unless they influence mathematical output. Fill the coverage block
    (reviewed/excluded symbols, unresolved_regions) so omissions are visible.
    Completeness rule: EVERY function, class, and top-level constant/assignment
    in a math_core file appears in reviewed_symbols or in excluded_symbols with
    a reason; anything else must be listed as an unresolved_region. Coverage is
    exhaustive by construction, not by promise.
R4. STRUCTURED COMPUTABILITY. arithmetic/invariant/encoding/distribution claims require
    `latex` plus a structured `computable` block evaluable by someone who has never seen
    this lab. These are DATA for an allowlisted harness — no I/O, no imports of the
    lab's modules. Can't produce one → sharpen the statement or file an open_question.
R5. INDEPENDENT VERIFICATION PLANS. Every `verification` block checks the claim WITHOUT
    the lab's code path: official vectors (name the exact file/set), Sage/SymPy, liboqs
    / Bouncy Castle / OpenSSL / Wycheproof, an algebraic identity, or manual with a
    followable procedure. "Run the lab's function and inspect" is forbidden (P2).
R6. PROVENANCE. Every claim carries implementation_provenance: custom | delegated
    (name package+version) | adapted | illustrative. Never imply "implements X" when the
    code invokes X. For delegated components, extract claims about the lab's USE of the
    delegate (parameters, boundary encoding, API misuse surface), not its internals.
R7. AUDIT-MODE AWARENESS. Extract within audit_mode.claimed_boundary; no
    standards-conformance claims from pedagogical/attack labs. For attack_reproduction,
    complete attack_model (capabilities, oracle, samples, success condition, the
    intentionally vulnerable behavior, real-world limitations).
R8. UNCERTAINTY IS OUTPUT. Ambiguity → extraction_status ambiguous, low
    extractor_confidence, an open_question with what_would_resolve_it. confidence
    describes the extraction, never truth. In this pass all verification_status =
    untested, conformance_status = unresolved (or not_applicable).
R9. EXTRACTION ONLY, TWO STAGES. Stage 1: output a flat SITE INVENTORY of every
    suspicious site — every modular/ring operation, sampler call, cryptographic
    constant, encode/decode, and security-relevant comparison — as
    {file, lines, raw_text}. Stage 2: form claims ONLY from inventoried sites;
    no new sites may appear at claim stage. A claim may be emitted only if its
    exact arithmetic, constant, distribution, encoding, or control-flow
    decision is present at the cited lines — paraphrase is allowed, invention
    is not. A missing modulus, bit order, rejection condition, or
    domain-separation string is never filled in: file an open_question instead.
    Every code_anchor includes `snippet`: the verbatim text (≤3 lines) of the
    anchored code. You must be able to re-locate every snippet by exact string
    match in the supplied source; a claim whose snippet does not match is
    invalid.
R10. FORCED QUESTIONS. Every claim with extractor_confidence below high MUST
    link an open_question stating exactly what ambiguity remains. A manifest
    with zero open_questions is a flag for human scrutiny: if you believe this
    lab is genuinely simple enough to have none, say so explicitly in notes —
    never just omit the section.

Extract minimally per math_core file: ARITHMETIC (with assumed modulus/structure);
CONSTANTS → parameters; DISTRIBUTION (samplers: apparent distribution, randomness
source, rejection conditions — be exhaustive, demos diverge here most); ENCODING (byte
order, bit packing, length prefixes, domain separation); INVARIANTS (round-trip and
algebraic properties presupposed); SECURITY_BEHAVIOR (malformed/tampered input
handling); PROTOCOL_STEP (ordering, state transitions, key schedules).

cryptographer_checklist — include, as checkable questions, the browser/JS failure modes:
getRandomValues vs Math.random; Number precision vs BigInt near 2^53; signed/unsigned
typed-array conversions; endianness across Uint8Array/DataView/WebCrypto/WASM; string
encoding of binary values; shared helpers breaking round-trip independence; UI showing
values different from those computed with; pinned vs floating crypto dependency
versions; WebCrypto extractability and call-site parameters; WASM/JS boundary
conversions; async races between key generation and use; server trust boundaries
(server-backed labs); timing uniformity of comparisons; domain separation between hash
uses; reachable failure branches.

Compare the lab's advertising (claim_sources) against the code; where words exceed
code, seed a deviations entry classified "unexplained".

Output ONLY manifest YAML per §7, canonical ordering.

### Pass C — Deviation audit (input: draft manifest + math_core files + reference-pack files)

Compare code against provided reference texts; record divergences; no verdicts.

R1. PROVIDED TEXT ONLY. Every reference_anchor points into a supplied excerpt (pack id +
    location). Missing text → classification insufficient_reference / anchor "excerpt
    not provided" + an open_question naming exactly what is needed. Never fill from
    memory (P3, D5).
R1b. SUBSTRING RULE. Every expected_value and every reference_anchor.location must
    correspond to text literally present in the supplied excerpts. Quote the exact
    governing sentence(s) (1–2) in the `reference_quote` field of every completed
    parameter row and every deviation. Citing a section number, table cell, or value
    that does not appear in the supplied text is a hard failure, not a judgment call.
R2. BOUNDARY-SCOPED, ALGORITHM-BY-ALGORITHM. Compare only within
    audit_mode.claimed_boundary. For each claimed algorithm (standards_conformance /
    reference_algorithm): walk numbered spec steps in order and locate the code for
    each — spec step with no code = deviation; code with no spec step = deviation;
    output-changing reorder = deviation. delegated_components / intentionally_omitted
    are NOT missing-internals deviations — check the lab's use of the delegate at its
    boundary instead. For pedagogical/walkthrough/attack labs, compare only where the
    lab itself draws the connection.
R3. PARAMETERS RESOLVED. Fill expected_value from excerpts; set match for every row;
    every "no" generates a deviation.
R4. NEUTRAL CLASSIFICATION. Exactly one per deviation:
    intentional_disclosed (lab discloses; cite where) | intentional_undisclosed
    (repo-internal evidence of intent, no user-facing disclosure) | reference_mismatch
    (code and text diverge; intent unknown; the mismatch is a fact) | unexplained |
    insufficient_reference. severity_note = factual consequences only ("outputs will
    not match the FIPS 203 KATs for this step"), never judgments.
R5. FEEDBACK TO CLAIMS. Deviation bearing on a claim → add its id to the claim's notes,
    set conformance_status deviates/unresolved, downgrade extractor_confidence if you
    misread the code. Sharpen statements/latex/computable/verification from excerpts
    where possible — sharpening allowed, verdicts not. Resolve every "TBD Pass C".
    verification_status is never yours to change.
R6. Emit the reference_pack block for every excerpt used (id, type, title, version,
    source_url, section, excerpt_sha256, supplied_by).

Output ONLY the completed manifest YAML (extraction.pass: "C"), canonical ordering.

## 7. Manifest schema v0.2 (the YAML you emit in Passes B/C)

    manifest_version: "0.2"
    lab: {slug, name, claimed_standards: [], claim_sources: []}
    repository: {url, default_branch, commit_sha}
    extraction: {pass: "B"|"C", model, date,
                 extraction_hash}     # sha256 of concatenated math_core file contents
                                      # at repository.commit_sha. Compute it when you
                                      # have shell access; write "PENDING" otherwise.
                                      # The VALIDATOR recomputes it and is
                                      # authoritative either way.
    audit_mode:
      type: standards_conformance | reference_algorithm | attack_reproduction |
            pedagogical_model | protocol_walkthrough | delegated_implementation
      claimed_boundary: ""
      intentionally_omitted: []
      delegated_components: []
      confirmed: {by: "", date: ""}   # written ONLY by a human after Pass A;
                                      # its presence unblocks Pass B
    reference_pack:
      - {id: REF1, type: standard|rfc|paper|test_vector|library_documentation|repo_claim,
         title, version, source_url, section, excerpt_sha256, supplied_by: human}
    scope_map:
      files: [{path, role: math_core|protocol_glue|ui|test|vendored|data, note}]
      entry_points: []
      extraction_order: []
      red_flags: []
      scope_amendments: [{file, reason, pass}]
    coverage:
      - {file, reviewed_symbols: [], excluded_symbols: [], unresolved_regions: [], note}
    parameters:
      - {name, value_in_code, expected_value,
         reference_anchor: {ref, location},
         reference_quote: "",         # Pass C: 1–2 verbatim spec sentences governing this row
         code_anchor: {file, symbol, lines: [0,0], snippet},
         match: yes|no|unknown}
    claims:
      - id: ""                    # C1... canonical order (file, symbol, first line)
        type: arithmetic | invariant | security_behavior | constant | encoding |
              distribution | protocol_step | intentional_deviation
        statement: ""             # one precise, testable sentence
        latex: ""
        computable: {language: python|sage|javascript,
                     relation: equality|inequality|round_trip|distribution_test,
                     expression, inputs: {}, expected, dependencies: []}
        code_anchor: {file, symbol, lines: [0,0],
                      snippet}        # verbatim ≤3-line text of the anchored code;
                                      # must exact-string-match the source file
        reference_anchor: {ref, location}     # ref = pack id or "lab_specific"
        verification: {method: official_vectors|differential|algebraic|metamorphic|
                               statistical|manual,
                       implementation, vector_source, procedure, expected_observation}
        implementation_provenance: {kind: custom|delegated|adapted|illustrative,
                                    component, package, version, boundary}
        depends_on: []
        extractor_confidence: high|medium|low     # describes the EXTRACTION only
        extraction_status: anchored|ambiguous
        verification_status: untested|independently_tested|human_reviewed
        conformance_status: matches_reference|deviates|not_applicable|unresolved
        notes: ""
    deviations:
      - id: ""                    # D1...
        description: ""
        classification: intentional_disclosed | intentional_undisclosed |
                        reference_mismatch | unexplained | insufficient_reference
        disclosed: ""             # "yes — README §Limitations" | "no" | "unknown"
        reference_anchor: {ref, location}
        reference_quote: ""       # 1–2 verbatim spec sentences the code diverges from
        code_anchor: {file, symbol, lines: [0,0], snippet}
        severity_note: ""         # factual consequences only, never judgments
    attack_model:                 # REQUIRED iff audit_mode.type == attack_reproduction
      {attacker_capabilities: [], required_oracle, required_samples, success_condition,
       intentionally_vulnerable_behavior, real_world_limitations: []}
    open_questions:
      - {id: "", question, why_it_matters, what_would_resolve_it}
    cryptographer_checklist: []   # checkable questions the code does not obviously answer

Canonical ordering: files by path; claims by (file, symbol, first line); IDs assigned
after sorting; keys in schema order; no commentary outside the YAML.

Status semantics — three different questions, never conflated: extraction_status = did
the extractor pin this to real code; verification_status = has anything independent
checked it (only the harness or a human moves it — model agreement never does);
conformance_status = does behavior match the referenced text (not_applicable for
lab_specific claims and pedagogical modes).

## 8. Out of scope for you — always

- Fixing, refactoring, or "improving" any lab code (D1).
- Confirming audit_mode, flipping verification_status, or signing off review — human
  checkpoints (§3).
- Assembling reference-pack excerpts from memory (P3).
- Executing manifest-embedded code, or building/running a harness ad hoc — the harness
  is a separate, human-reviewed build (P5).
- Declaring anything verified, secure, correct, or broken (P1).
- Starting a second task after finishing the first (§4 step 6).

## 9. Known limitations (for the humans running this)

- **Extraction inherits model blind spots.** A subtly wrong sampler the model doesn't
  recognize yields no claim and no test. Mitigations — coverage accounting, the site
  inventory, snippet validation, multi-model diffing, calibration, human review — make
  incompleteness visible; none makes extraction complete.
- **Cross-model agreement proves nothing.** It orders the review queue; it never
  advances verification_status.
- **Pass C is bounded by its reference packs.** An incomplete excerpt silently narrows
  the audit; insufficient_reference outcomes and pack provenance make the boundary
  explicit, but a human owns pack completeness per lab family.
- **audit_mode is a human decision informed by Pass A.** Misclassifying a lab's mode
  mis-scopes everything downstream — which is why Pass A's proposal requires
  confirmation before Pass B.
- **This pipeline produces claims and structured verification plans, not verification
  itself.** The allowlisted harness that executes those plans against liboqs / Sage /
  official vectors, and its CI integration, are a separate, human-reviewed build,
  subject to P5.
