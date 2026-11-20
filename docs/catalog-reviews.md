# Pinned corrections to source derivation

`tools/catalog-reviewed.json` supplements source shapes the catalog scanner cannot
judge accurately. Its `commit` identifies inspected source; the writer's existing
stale/unreadable-review guard controls whether corrections may be applied.

`remove` corrects implementation and attack claims. `removeReferences` separately
accepts canonical algorithm names whose apparent mention is not a reference to
that algorithm. It affects only generated references, preserves raw mention and
implementation evidence, and stays unapplied when the review is stale or unreadable.
Reference exclusions additionally require HEAD to equal the exact review commit:
document wording can change outside the older implementation movement scope.
Malformed names fail instead of silently doing nothing.

TC26's provenance documentation uses “opaque-WASM coverage” to describe unread
compiled components. That adjective is not a reference to the OPAQUE password
protocol. Its source-pinned reference correction preserves `WebAssembly:2`, the
unknown original compiler and the separately measured source reproduction.
Other labs' OPAQUE references and implementations remain eligible for derivation.

Rekey Relay's BBS98 is proxy re-encryption, not BBS credential signatures. Its
BLS12-381 import supplies groups and pairings, not BLS signature operations.
The exact inspected-source correction excludes those two signature claims and
references, and two cited or unreproduced attacks. It preserves the executed
group, pairing and WebCrypto primitives and the proxy collusion/revocation
teaching. The existing source guard still governs this correction; it does not
exclude signature detection in other labs. `tests/catalog-teaching-scope.test.cjs`
checks both the exclusions and preservation with positive and negative controls.

After reviewing current lab source, run `node tools/catalog-evidence.js write
--lab <slug>`, then regenerate the catalog and README with their existing tools.
Run `node --test tests/catalog-reference-review.test.cjs` for current/stale/unreadable,
positive/negative and evidence-preservation controls.

## `reviewed` and `reviewedCommit`: a claim about a person, not about source

Every other field in `tools/catalog-reviewed.json` is a claim about a lab, and a
second reader can check it by opening that lab. These two are not. `reviewed` is
the date a PERSON read the lab and `reviewedCommit` is the commit they read, and
nothing downstream can tell a forged one from a real one: `catalog-evidence` ages
every pin from `reviewed` and prints it in STALE-REVIEW, and
`tests/catalog-teaching-scope.test.cjs` reads `reviewedCommit` precisely because a
machine advance cannot move it. **Only a person may move either field.** An
AI-agent read, however good, never advances them; it is recorded in `note`,
labelled as unreviewed, and the human-review fields stay where the person left
them.

`node tools/review-record.js check` enforces that, with two rules, because one of
them cannot see the case that happened.

**ADVANCE-CLAIMS-REVIEW** is read off the file: a pin whose own `reason` records an
`auto-advance --write` must carry a `reviewedCommit` that is behind `commit`. It
holds however the entry got there, and it is silent on a pin whose reason records
no advance — which is exactly the state a hand-written re-pin leaves behind, and
why there is a second rule.

**MACHINE-SET-REVIEW-FIELD** is read off the commits: no machine-made commit in a
pull request may change any lab's `reviewed`, or change a `reviewedCommit` other
than by the one legitimate first-time fill. A commit is machine-made when its
author is `noreply@anthropic.com` or its message carries a `Co-Authored-By: Claude`
trailer.

The one exemption is `autoAdvanceWrite`'s first-time fill: `reviewedCommit` absent
before, and afterwards equal to the value `commit` held before that change. That
write preserves a reading rather than claiming one, which is why the field exists
at all. `.github/workflows/pin-advance.yml` commits it every Monday under a Claude
trailer, so the exemption is live and is asserted in both directions; a "fill" to
the NEW commit is the forgery wearing the exemption's clothes and fails.

Two limits are declared rather than left to be discovered. An entry a machine
commit ADDS or REMOVES outright is counted and printed and is not a finding —
carding a lab writes a new pin with its review date, and refusing that would refuse
the normal way a lab arrives; a new record still cannot overwrite a person's
existing one. And the check runs on `pull_request` only: it judges what a pull
request proposes, and re-judging `main` would redden it for changes the owner has
already read and accepted, including a restoration an agent makes on the owner's
instruction.

`node --test tests/review-record.test.cjs` carries both directions of both rules,
the live first-time-fill exemption, the blind spot in rule 1 that rule 2 covers,
and the COULD-NOT-LOOK paths — an unreadable range, a directory that is not a
repository and an unparsable table each fail rather than passing over nothing.
