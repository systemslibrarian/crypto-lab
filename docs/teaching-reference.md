# Source-backed teaching reference

`TEACHING-REFERENCE.md` is a separate, generated review document. The homepage
continues to browse labs. `index.html` remains the catalog authority;
`CATALOG.md` remains its generated algorithm view. This reference adds exact
teaching source slices and immutable source links without changing algorithm
credits, review pins, Fleet records or findings.

The Markdown comes from `teaching-reference/records/<lab>.json`, one record for
every catalog member, and `teaching-reference/manifest.json`. The manifest pins
record hashes, generator version and source SHA, with a separate last-reviewed
SHA. Files and sections have SHA256 identities. No date is invented and no
source/provider capture is relabelled as a fresh observation.

The generated Markdown preserves source whitespace, including Markdown hard
line breaks. Its scoped Git attributes disable line-ending normalization and
whitespace warnings for those exact quotations; canonical machine-record bytes
also avoid normalization. Generator hash, source-slice and rendering checks
enforce artifact integrity. Normal whitespace checks still apply to code.

## Capture and check

Read repository instructions and fetch the intended origins safely first.
The generator does **not** fetch, clone, install dependencies, execute source
or lifecycle scripts, call npm audit, submit private dependency metadata,
update Fleet, or publish anything. It locates existing checkouts by their
actual origin URLs. An explicit checkout directory or a parent containing
existing checkouts can be passed; repeat `--repositories` as necessary.

```sh
node tools/teaching-reference.js write --repositories ..
node tools/teaching-reference.js check --records-only
node tools/teaching-reference.js check --sources --repositories ..
```

The default source ref is `origin/HEAD`. `--ref origin/main` can explicitly
select a previously verified default branch when no remote HEAD is saved.
A missing ref never silently falls back to local HEAD. Conflicting checkouts
with different tracking-ref commits require an unambiguous input directory.
Tracked Git trees and exact blobs are read at an immutable captured commit;
staged, dirty, ignored and untracked files do not enter the teaching record.
Symlink targets and submodules are not followed. Local Git replacement objects
are disabled, so a captured commit cannot silently name replacement bytes.
Unchanged record reuse checks the complete immutable tree inventory and exact
blob hashes/source slices, rather than trusting a saved timestamp or JSON hash. Large or unreadable captures
remain explicit coverage gaps rather than disappearing from membership.

`write` exits 2 for missing, unreadable, incomplete or moving source captures,
while saving a reference that retains those labs and their known evidence.
Static extraction limits such as conditional wording or opaque WASM are
recorded separately from capture execution. `check --records-only` checks
saved evidence, exact membership, hashes, anchors and Markdown consistency;
it does not claim the source is current. `check --sources` also compares the
available local tracking refs and current authoritative inputs. Neither
command verifies that a local ref was recently fetched or that a public demo
currently serves those bytes.

## Review changes incrementally

Save a baseline copy of `teaching-reference/` outside the checkout before
refreshing. Incremental `write` reuses byte-identical records when source SHA,
generator and authoritative per-lab inputs are unchanged. A later extraction
does not advance an existing last-reviewed SHA. Imported catalog, Counsel and
worksheet records retain their original scope; an algorithm review is not a
complete review of every learner-facing statement.

```sh
node tools/teaching-reference.js compare --against /absolute/path/to/baseline \
  --repositories .. --out /absolute/path/to/teaching-changes.json
node tools/teaching-reference.js write --repositories ..
```

Comparison reports wording changes and **every changed tracked path**. Code,
dependencies, data and WASM can invalidate unchanged teaching wording. Test,
configuration, workflow and unexplained paths remain visible and require
review as appropriate. Missing Git history, unknown ancestry or incomplete
inventories cannot establish an unchanged result. The narrower existing
`corpus-freshness.js` README/src classification is retained separately and
does not define this reference's all-path denominator.

Generated summaries use the same selected `--ref` in the hub's fetched origin
tracking refs, never an unpublished local `HEAD`. An unchanged card's exact block
must match the captured remote `index.html`; its immutable URL uses that remote
commit and its line numbers. A dirty, new or locally committed changed card,
missing/unreadable remote ref, or nontracking ref receives an explicit pin gap
without a fabricated URL. Unchanged published siblings retain their evidence.
The complete summary-source identity participates in cache invalidation; reused
summaries must also match the actual current card prose and captured remote pin,
so a self-consistent saved JSON hash cannot substitute another source or claim.
Fetching and confirming the remote default branch remain caller responsibilities.
Summary text is existing catalog prose, not a generated new claim.
Generated summaries retain the hub description and existing scoped review
notes. Raw learner wording is displayed in fenced source blocks, preserving
spelling, entities, escapes, expressions and warnings. Nonprinting control
characters get an explicitly labelled JSON-escaped display; their exact source
text and hashes remain in the machine record and pinned source. This display
representation is never passed off as literal browser wording. Source locations use
full commit pins. Static string candidates and nearby-symbol suggestions are
explicitly unverified; they are not automatically approved claim-to-code
links. A matching reviewed algorithm anchor retains that existing review
scope only. If the review SHA is older, immutable Git objects must establish
unchanged bytes of that exact reviewed file before retaining its generic
operation anchor. It is labelled historical unchanged-file correspondence;
callers, dependencies, teaching wording and review pins are not thereby updated.
Unavailable review history remains a gap. This does not bypass the catalog
writer's stale-review guard. Test/function lists are source inventories, not executed tests. Exact test and
verification-fixture strings stay in the machine records rather than being
duplicated as learner copy in the Markdown. Every tracked path and its hash
remain accounted for. Nearby-symbol suggestions are stored in those records;
only existing scoped algorithm anchors are displayed as claim connections.

## Export complete, bounded packets

```sh
node tools/teaching-reference.js export --lab crypto-lab-wep-crack \
  --out /absolute/path/to/new-wep-packet --max-bytes 500000
node tools/teaching-reference.js export \
  --out /absolute/path/to/new-all-lab-packets --max-bytes 1000000
```

An all-lab export includes the full all-in-one document and per-lab documents.
Packets split exact UTF-8 bytes without dropping wording or exceeding the
requested byte bound. The export manifest records ordered document membership,
part membership, offsets, lengths and hashes. Reconstruction and tamper
controls validate completeness before files are written. Use a new or empty
destination; exports do not overwrite a previous packet set. Upload the
manifest with the relevant parts so a file limit cannot silently omit content.

## Verification limits

The reference covers root HTML, Markdown documentation, nested demos, UI and
quiz/feedback string candidates, localization/data text and supported source
languages. It retains every tracked file's identity, including Rust, C/C++,
WASM, binary assets and dependency inputs. Unsupported languages, opaque or
minified assets, interpolated/conditional strings, external sources and
static-extraction gaps remain visible. It cannot prove that every static
candidate is displayed, execute all runtime branches, establish source-to-
binary provenance, reproduce compiler output or verify constant-time behavior.

Source-cited URLs retain their citation locations. The generator does not
invent primary references or claim that every cited URL is a verified primary
source. Behavioral checks, cryptographic review, live-site verification and
Fleet maintenance completion require their own evidence.
