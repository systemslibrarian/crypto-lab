# Learning games

`games/index.html` is the entry point linked from the catalog navigation. It links
Lattice Builder's existing standalone site with Secret Council and Merkle Mystery,
served directly from `games/secret-council/` and `games/merkle-mystery/`. These are
catalog-hosted games, not new fleet repositories: they do not increment the count
of independently catalogued exhibits or borrow existing exhibits' evidence.

## Secret Council

Buildless HTML, CSS, SVG, and ES modules. There are no runtime dependencies,
remote assets, accounts, telemetry, fetch calls, or real-secret input fields.
`core.mjs` owns field arithmetic and mission rules. `game.mjs` owns the interface,
progress, optional Web Audio, and clipboard result sharing. `styles.css` fixes the
dark theme, follows Lattice Builder's mint/amber palette, and supports reduced
motion, keyboard interaction, and narrow screens. The SVG chamber is decorative;
every keeper is a labeled native HTML button.

Players select the specified number of keepers, choose a threshold, and test the
charter. Theft trials pass only below the threshold. Outage trials require the
player to collect enough available shares; the game actually interpolates those
points and compares the recovered value to the generated secret. A failed theft
trial similarly reconstructs the secret from the intruder's shares. Each trial
is an independent alternate scenario; stolen shares do not accumulate between
trials. The six chapters progress from threshold selection to correlated risk.

The daily puzzle permutes the final chapter's member identities using a public
UTC date seed. Permutation preserves solvability. The displayed descriptions are
rebuilt from the permuted identities. Its share numbers are independently drawn
from the browser's secure RNG on every attempt. The date seed never generates
Shamir coefficients. Switching to daily mode captures the current UTC date;
an already-running daily charter retains that date over midnight.

Every chapter earns 1–3 seals: `max(1, 3 - failed trials - guidance used)`.
Revising after a failed trial preserves its penalty. Restarting a chapter starts
a fresh attempt. Best per-chapter scores are retained; replay never adds the same
chapter twice. Campaign score is the sum of those chapter bests, maximum 18.
One daily date and best score are saved. Local storage uses only
`crypto-lab-secret-council-v1`, with every read/write guarded; corrupted values
are validated. No share, coefficient, or secret is persisted. Clear saved progress
removes that key and resets the current game. Copy result has a selectable text
fallback if clipboard access is unavailable.

## Mathematics and limits

The game implements Shamir sharing over the deliberately tiny prime field F_17,
following Adi Shamir, *How to Share a Secret*, Communications of the ACM 22(11),
1979, pp. 612–613, DOI [10.1145/359168.359176](https://doi.org/10.1145/359168.359176).
The constant coefficient is the random secret. All coefficients are sampled
uniformly from 0 through 16, **including zero for the highest coefficient**.
Rejection sampling discards byte 255 before reducing modulo 17. Nonzero distinct
member indices are x-coordinates; Horner evaluation produces y. Recovery uses
Lagrange interpolation modulo 17, rejecting duplicates, insufficient shares,
and excess points inconsistent with the selected degree bound. This last check
is not share authentication: a wrong set of exactly k points can interpolate
to a wrong secret, as the negative unit test demonstrates.

The optional 3-of-5 explorer constructs a compatible polynomial for every
candidate secret when fewer than three shares are visible. It plots finite-field
points without misleading real-valued connecting curves. The plotted polynomial
is one witness, not a claim about which polynomial the dealer chose. Equal
candidate likelihood is justified by uniform independent coefficient sampling;
an exhaustive test counts the coefficient possibilities for fixed observations.

This is not secure storage: the browser has the dealer's secret and all shares.
The vault graphic is not encryption. Keepers and events are fictional, the field
is tiny, and ordinary sharing provides no authentication or erasure. Tests do not
certify this implementation for real secrets.

## Verification

Run `node --test tests/secret-council-core.test.mjs` for exact vectors, independent
interpolation checks, exhaustive two-share secrecy, malformed inputs, all chapter
solutions, daily reproducibility, and solvability. The `Learning games` workflow
also runs `tests/secret-council-browser.test.cjs` in Chromium using the repository's
pinned Playwright dependency, exercising the campaign, daily mode, failure/retry,
mathematics, persistence, keyboard controls, and responsive layouts. Screenshots
and browser test output are uploaded as workflow artifacts. As with the other hub
pages, GitHub Pages publishes from main; merge only after the PR checks pass.

## Merkle Mystery

Buildless HTML/CSS/SVG/ES modules at
`https://crypto-lab.systemslibrarian.dev/games/merkle-mystery/`. All assets are local;
no runtime packages, backend, accounts, analytics, fetch calls, or document inputs.
The archive illustration consists of accessible native buttons over decorative
SVG edges. Small screens scroll only the labeled tree region horizontally; every
node also supports keyboard selection. The theme is fixed and reduced motion is
respected. No shared Secret Council runtime or styles are changed.

`core.mjs` implements complete binary Merkle trees with 1–64 leaves (the game uses
4 and 8). Book records are `JSON.stringify([title, passage])`, encoded as UTF-8.
Web Crypto SHA-256 hashes `0x00 || record` for leaves and
`0x01 || left_hash_bytes || right_hash_bytes` for branches, following the domain
separation in [RFC 9162 §2.1](https://www.rfc-editor.org/rfc/rfc9162.html#section-2.1).
Full 32-byte values are used for comparisons; only board labels are truncated.
The verifier validates tree size, leaf index, proof length, and hash encoding.
It derives sibling order from the index and fails closed on malformed input.
The UI has no fallback hash if Web Crypto is unavailable. This is not a Certificate
Transparency implementation, signature scheme, file-protection tool, or proof of
append-only history. The independently trusted archive root is a story assumption.

Six chapters: identify one changed book; mark its complete ancestor path; pack
three sibling hashes; verify and classify three parcels (valid, altered content,
wrong proof); compare two authorized revisions; and reject a replacement seal.
The last chapter deliberately presents a proof that verifies under the courier's
root but fails under the independently saved root. Winning requires verifying
against the latter. All parcel verdicts come from actual proof verification.
The proof drawer exposes every intermediate calculated hash. After verification,
“Climb the proof” lets the learner move forward or backward one level at a time.
Solid and dashed outlines identify the computed position and supplied sibling
position on the recorded tree. The walkthrough displays the actual full left/right
inputs and parent output from `proofTrace`, including for counterfeit parcels;
recorded tree values are not substituted for supplied proof values. At the root,
it distinguishes a hash match from independent trust. Chapter, parcel, and
reference changes clear the walkthrough. It does not change scoring or verdicts.
The field notes distinguish root mismatch detection, locating changes by comparing
subtree evidence, updating a known leaf path, and verifying inclusion.

A daily case has three tasks: find two revisions, pack a proof for a specified
book in the restored archive, then inspect a parcel. A public UTC-date seed picks
the changed indices, target book, and one of four parcel kinds (genuine, altered
text, wrong proof, replaced seal). Date generation is puzzle variety, not randomness
for cryptographic keys. All task transitions preserve daily hint/mistake penalties;
a running daily case retains its captured date over midnight.

`game.mjs` guards asynchronous transitions with a generation counter, preventing
a slow hash calculation from applying to another chapter. Every solved chapter
earns `max(1, 3 - incorrect submissions - guidance used)` bookplates; guidance costs
one once. Empty submissions are guidance prompts, not scored mistakes. Restarting
starts a fresh attempt. Campaign totals sum best scores for six chapters, maximum
18. Daily scores are best for one UTC date, maximum 3. Only validated scores persist
under `crypto-lab-merkle-mystery-v1`; all storage access is guarded. Clear progress
resets the game. Clipboard denial exposes a selectable result fallback.

Run `node --test tests/merkle-mystery-core.test.mjs` for independent Node crypto
vectors, all leaf positions at every supported size, mutation propagation,
adversarial proof inputs, all chapter solutions, daily variants, and corrupt
storage values. The `merkle-mystery` job in `Learning games` runs the complete
campaign and daily cases in Chromium, checks failed guesses and counterfeit-seal
choices, verifies scoring and persistence, exercises keyboard controls, and
captures desktop and phone screenshots. Publish only after actual PR checks pass
and verify the served files after Pages deploys.
