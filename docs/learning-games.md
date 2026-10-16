# Learning games

`games/index.html` is the entry point linked from the catalog navigation. It pairs
Lattice Builder's existing standalone site with Secret Council, which is served
directly from `games/secret-council/` in this repository. The latter is a
catalog-hosted game, not a new fleet repository: it does not increment the count
of independently catalogued exhibits or borrow an existing exhibit's evidence.
Its live route is `https://crypto-lab.systemslibrarian.dev/games/secret-council/`.

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
