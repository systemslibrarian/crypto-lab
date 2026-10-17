# Learning games

`games/index.html` is the entry point linked from the catalog navigation. It links
Lattice Builder's existing standalone site with Secret Council, Merkle Mystery, and
Quantum Courier, and Sealed Showdown, served directly from their respective `games/<slug>/` directories.
These are catalog-hosted games, not new fleet repositories: they do not increment the count
of independently catalogued exhibits or borrow existing exhibits' evidence.

## The teaching standard

Every lesson follows **action → visible consequence → short explanation**. The
player should first do something that expresses the concept. The game then shows
what that choice caused, and places a brief takeaway in the completion result,
before the next lesson. A score alone is not the explanation. Optional mathematics
can add depth, but must not hide the essential connection to cryptography.

| Game | Experience through play | Visible result and takeaway |
| --- | --- | --- |
| Lattice Builder | Straighten signal fields, fly integer vector routes, match bases | Signal completion explains the eight-candidate search; every flight explains its vector operation; Basis Match explains each matched target. These are geometric intuition, not general lattice attacks. |
| Secret Council | Allocate shares and recover a secret during outages | Actual affected holders and recovered values precede the chapter lesson about threshold secrecy, availability or shared risks. |
| Merkle Mystery | Locate changes, assemble proofs and judge archive parcels | Actual hash comparisons and the proof walkthrough lead into a lesson about integrity, inclusion or root trust. |
| Quantum Courier | Tune, sift, discard samples and review measurement errors | The measured replay and sample counts precede a lesson about basis agreement, disturbance or limits of the evidence. |
| Sealed Showdown | Make sealed choices, guess weak seals and judge openings | Recomputed hashes and game outcomes lead into lessons about hiding, binding, context and refusal to reveal. |

Campaign browser tests exercise the gameplay and assert that the post-play lesson
is visible. Lattice Builder has its own repository and browser gate, including
all six Vector Flight completion lessons and every Basis Match takeaway. Daily
challenges reuse the same teaching flow. New games must follow this standard.

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

Trial feedback names the affected share holders and their locations, including when
no issued shares are affected. Selecting a keeper reveals a short personality line;
flavor does not change the rules. Successful reconstruction triggers a 1.2-second
connection and vault flourish, disabled for reduced motion, without delaying controls.
Completed charters show the actual threshold, location count, and independent trial
results in a recap.

The daily puzzle permutes the final chapter's member identities using a public
UTC date seed. Permutation preserves solvability. The displayed descriptions are
rebuilt from the permuted identities. Its share numbers are independently drawn
from the browser's secure RNG on every attempt. The date seed never generates
Shamir coefficients. Switching to daily mode captures the current UTC date;
an already-running daily charter retains that date over midnight.

Every chapter earns 1–3 seals: `max(1, 3 - failed trials)`. Guidance is free.
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

## Quantum Courier

Buildless HTML/CSS/SVG and ES modules, served at `games/quantum-courier/`. No
runtime dependencies, accounts, remote assets, real-secret inputs, or uploads.
Six flights introduce basis choice, sifting, discarding disclosed samples, reading
sampled errors, interpreting a clean sample, and spending a sample budget. Native
pulse buttons, radio inputs, and a range control support keyboard and touch. The
space route is decorative. Reduced-motion settings suppress its animation.

`core.mjs` models ideal BB84 polarization measurements classically: matching bases
return the prepared bit; different bases draw an unbiased bit and prepare the
measured state. Intercept/resend measures at Eve and sends that resulting state
to Bob. An exact enumeration test establishes a 1/4 sifted-bit error probability
under full intercept/resend with fair independent bases. In that specific ideal,
independent model, `1 - (3/4)^t` is the probability of at least one error in t
sampled sifted bits. The budget puzzle requires the smallest sample reaching
95%, with at least 12 of 24 bits retained: 11 samples, 13 candidate bits left.
It is never labeled a posterior probability of safety or a general security bound.

Campaign and daily flights are deterministic teaching replays with exactly eight
basis matches in twelve positions and a three-position sample selected before
review. The shadow replay (`shadow-14`) has two sampled errors. The quiet replay
(`quiet-0`) has an interceptor, no sampled errors, and unsampled errors. These
outcomes are deliberately selected teaching cases, not attack-frequency data.
Public sample values appear only after sending. Unsampled values remain hidden.
Only calibration shows Alice's states before sending; it explicitly contrasts
this with actual BB84 basis timing. Calibration succeeds on basis matches, never
on lucky matching output bits from wrong bases.

The optional light bench is an unconditioned experiment over 64 fresh simulated
photons. It draws unbiased bits from `crypto.getRandomValues`; unavailable RNG
fails visibly without silently falling back. The deterministic replay seed is
never used by the bench. Changing its settings clears the old result label.

A daily UTC-date seed chooses a replay with or without full interception. Three
tasks share one score: sift, discard samples, then flag sampled errors and choose
pause/continue processing. No task claims to produce a secure key. The simplified
puzzle pauses on any sampled error; noise can also cause errors in a real system.
An authenticated classical channel, finite-size analysis, error correction,
privacy amplification, loss and realistic hardware are outside this model.
Source notes link Bennett and Brassard's original BB84 paper and Shor and
Preskill's security proof, followed by the existing deeper BB84 exhibit.

Scores are `max(1, 3 - incorrect submissions - guidance used)`, with guidance
charged once per attempt. Daily penalties persist across all three tasks. Empty
keep selections and missing decisions prompt without penalty. Restart is a fresh
attempt; mode switches also start fresh. Campaign bests sum to at most 18, and
one daily date/best score is retained. Storage uses only
`crypto-lab-quantum-courier-v1`, validates all persisted fields, and degrades to
in-memory progress if storage is blocked. Clear progress resets play. Clipboard
denial exposes selectable text. An in-progress daily retains its captured date.
A generation token prevents a late flight animation from altering a new chapter.

`tests/quantum-courier-core.test.mjs` covers measurement outcomes, exact attack
probabilities, sample exclusion, authored cases, daily variants, and malformed
progress. The `quantum-courier` job in `Learning games` plays the complete campaign,
all daily scenario variants, wrong choices, hints, storage/RNG/clipboard failures,
keyboard controls, and navigation. It captures phone/tablet/desktop screenshots
for visual review. Verify the final PR checks and deployed bytes before claiming
publication.

## Sealed Showdown

Buildless local HTML/CSS/SVG/ES modules at `games/sealed-showdown/`. Six playable
rock–paper–scissors situations introduce timing, hiding, binding, context and
abort behavior. Switch chooses after the human in the first open round. Subsequent
rounds publish Switch's seal before human controls become available. The weak
round omits a nonce, allowing the player to hash three candidates and choose the
countermove. Tampering and replay rounds require recomputation and rejection;
the final round withholds the opening and requires recording an incomplete game.
Each completion shows its own short explanation. Honest losses and ties still
complete a lesson; learning scores are separate from winning at RPS.

The strong commitment is Web Crypto SHA-256 over UTF-8 encoding of the JSON array
`["crypto-lab/sealed-showdown/v1", round, player, move, nonce]`. Nonces are fresh
16-byte browser random values, hex encoded, secret until reveal. The deliberately
weak scheme uses a distinct domain and omits the nonce. Verification requires
full hash equality and a round/player context supplied independently of the
opening packet. Player and round labels do not authenticate themselves. Secret
moves use rejection sampling on random bytes, discarding 252–255 before reducing
modulo three. Unsupported Web Crypto or RNG fails visibly; there is no fallback.

The construction follows the educational hash-commitment discussion in
[MIT's course notes](https://people.csail.mit.edu/alinush/6.857-spring-2015/l14-public-key.html).
It is not a formal security proof or remote multiplayer protocol: both players
run locally and browser inspection can expose their state. The final lesson
explicitly separates commitments from forcing an opening; source notes also link
[Boneh and Naor's timed commitments](https://cs.stanford.edu/people/dabo/pubs/abstracts/timedcommit.html),
an extension not implemented here. The next exhibit is Commit Gate.

Free arena plays five independently generated verified rounds, including ties,
and stores the best number of wins separately. The UTC daily seed chooses three
distinct lessons only; moves and nonces always use fresh cryptographic randomness.
The daily date is captured on entry, including across midnight. Each campaign
lesson scores `max(1, 3 - mistakes - guidance used)`; hints cost one once per
attempt. Daily tasks share one score. Best campaign scores total at most 18.
Only validated scores persist under `crypto-lab-sealed-showdown-v1`. Storage
failure preserves play; clipboard failure provides selectable text. No account,
network requests, shared theme writes or real-secret inputs are used.

Core tests independently compute expected hashes with Node crypto, reject changed
openings and contexts, verify the weak three-guess lookup, exhaust all RPS pairs,
and check unbiased sampling and saved-score validation. Browser tests play all
six lessons and daily variants, independently recompute displayed hashes, check
wrong decisions, five-round arena results, hints, unavailable capabilities,
async navigation races, persistence and keyboard controls. The Learning games
workflow captures desktop and mobile screenshots for review before publication.
