# Exhibit citation dates: what is recorded, and what is still pending

_Written 2026-09-22 alongside the citation work on `teach/`._

## The rule

An exhibit's citation carries the year of the lab commit its worksheet was checked
against — the build a reader is actually looking at — taken from
`source_commit_date` beside `source_commit` in the module's own JSON. An exhibit
with no recorded date is cited **with no year field**, never with `(n.d.)`.

`(n.d.)` is a claim, not a formatting choice: it says no date exists for the work.
One does. Each exhibit is a living page with a history; what was missing here was a
record of it on this side, which is a different thing and must not be written as if
it were the first.

The date has to live in a source file because the generator is deliberately
clock-free and builds byte-identically wherever it runs, CI included. A date it
cannot read from a source file is not a date it can print.

## Recorded

Ten exhibits now carry `source_commit_date`, each read from the pinned commit in a
local clone of that lab:

| Module | Exhibit | Commit date |
|---|---|---|
| `key-exchange` | `diffie-hellman-mitm` | 2026-09-17 |
| `post-quantum` | `grover` | 2026-09-17 |
| `post-quantum` | `harvest-vault` | 2026-09-17 |
| `public-key` | `ec-point-arithmetic` | 2026-09-17 |
| `public-key` | `ecdsa-forge` | 2026-09-17 |
| `public-key` | `nonce-lattice` | 2026-09-17 |
| `public-key` | `rsa-forge` | 2026-09-17 |
| `symmetric` | `aes-modes` | 2026-09-17 |
| `symmetric` | `hidden-bit` | 2026-09-21 |
| `symmetric` | `nonce-collision` | 2026-09-17 |

## Pending

These carry no year, because the commit their worksheet names is not in the local
clone of that lab and **the labs were deliberately not fetched**: another lane is
working in those repositories, and a fetch is a write to the repository another
agent is using.

| Module | Exhibit | Pinned commit | Why not resolved |
|---|---|---|---|
| `key-exchange` | `downgrade-wire` | `2de65778ff73` | commit not in the local clone |
| `key-exchange` | `protocol-checker` | `24c7e9c2dd01` | commit not in the local clone |
| `key-exchange` | `tls-handshake` | `dbbdc73da172` | commit not in the local clone |
| `library-privacy` | `blind-relay` | `9de776c3565d` | commit not in the local clone |
| `library-privacy` | `dp-noise` | `abca4df106c0` | commit not in the local clone |
| `library-privacy` | `patron-shield` | `93f3f7226fe7` | commit not in the local clone |
| `library-privacy` | `shelf-oracle` | `66c860a4a312` | commit not in the local clone |
| `post-quantum` | `hybrid-wire` | `5b7ae68ae3bc` | commit not in the local clone |
| `post-quantum` | `kyber-vault` | `3f80e2eaa9c9` | commit not in the local clone |
| `post-quantum` | `lattice-gentle` | `893db9f6f046` | commit not in the local clone |
| `post-quantum` | `shor` | `66c0e3109427` | commit not in the local clone |
| `public-key` | `rsa-educational` | `ad0235d64da7` | commit not in the local clone |
| `symmetric` | `otp-vault` | `6b2bb1c14f73` | commit not in the local clone |
| `symmetric` | `padding-oracle` | `3a7e02e6daeb` | commit not in the local clone |

## Finishing it

For each row above, resolve the pinned commit's committer date in that lab and add
`source_commit_date` beside `source_commit` in the module JSON. `teach-build check`
validates the format; nothing else needs changing, because the generator already
prints a year wherever one is recorded and omits the field wherever one is not.

Do it when the lane holding those repositories is finished with them, and re-derive
rather than copying the dates above: a worksheet that is re-checked against a newer
build gets a new `source_commit`, and its date moves with it.

**The pinned commit is the thing to date, not the lab's latest commit.** Dating an
exhibit by its newest commit would print a year for a build the worksheet was never
checked against, which is the same class of error as `(n.d.)` — an assertion the
record does not support.
