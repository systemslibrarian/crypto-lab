# Crypto Lab Patron Shield — Suggestions

## Overall Assessment

Patron Shield is a strong teaching lab for two-server information-theoretic private information retrieval.

The recent work substantially improved its credibility. The browser claims suite now checks the protocol’s visible arithmetic rather than merely asserting that the right panels appear:

- the two masks differ in exactly one bit;
- the highlighted bit agrees with the hexadecimal masks;
- each server response is recomputed from the exact catalog records named in its XOR chain;
- the reconstruction bytes equal `r₁ XOR r₂`;
- the surviving record in the cancellation grid is derived from set membership rather than the desired answer;
- all eight catalog entries retrieve correctly;
- the privacy counters agree with the masks;
- the collusion demonstration recovers the requested index and title; and
- stale protocol and collusion results are retired.

That is unusually strong for an educational PIR visualizer.

The central protocol is correct for the eight-record demonstration. The most valuable remaining work is to tighten the boundaries around what the proof guarantees, correct two scaling claims, and fix several concrete edge cases in the 32-bit implementation.

## What Improved Most

### 1. The Protocol Claims Are Now Cross-Checked End to End

The claims suite does not trust a green badge or a displayed conclusion. It reconstructs the relationships between:

- mask bits;
- hexadecimal values;
- server-selected record sets;
- response bytes;
- cancellation behavior;
- the recovered title; and
- the collusion result.

The mutation test described in the latest commit is especially valuable: inverting the server mask condition still allowed `r₁ XOR r₂` to reconstruct correctly, but the new response-recomposition assertion caught that the displayed XOR chain had become false.

### 2. Correctness Is Driven by the Actual Run

The reconstruction badge and cancellation grid now derive their verdicts from the computed responses and masks rather than from the requested index. This prevents the visualizer from drawing a successful result when the protocol state is malformed.

### 3. The Collusion Failure Mode Is Excellent

The lab clearly demonstrates the exact trust failure:

```text
S XOR S′ = eᵢ
```

The collusion panel does not stop at “privacy fails.” It recovers the precise index and names the exact title exposed.

### 4. The Privacy Views Are Inspectable

Showing each server’s subset, count, mask, and response makes the marginal-distribution argument understandable. Each server receives a uniformly distributed mask even though the pair differs at the target index.

### 5. The Implementation Limit Is Disclosed

The README and page correctly state that the live protocol uses a 32-bit JavaScript mask and therefore does not represent a production-size catalog.

## Priority Recommendations

### 1. Fix the Bit-31 Collusion-Recovery Bug

This is the highest-priority code defect.

The documentation says the packed representation supports:

```text
DB_SIZE <= 32
```

However, `recoverByCollusion()` fails when the differing bit is index 31.

JavaScript bitwise operators use signed 32-bit integers. When bit 31 is set:

```text
maskS XOR maskSPrime
```

produces `-2147483648`. The power-of-two check happens to pass, but:

```text
Math.log2(-2147483648)
```

returns `NaN`.

Recommended implementation:

```ts
export function recoverByCollusion(maskS: number, maskSPrime: number): number {
  const diff = (maskS ^ maskSPrime) >>> 0;
  if (diff === 0 || (diff & (diff - 1)) !== 0) return -1;
  return 31 - Math.clz32(diff);
}
```

Add tests using a synthetic 32-record database and target index 31.

Either support all 32 bits correctly or change every stated limit to `DB_SIZE <= 31`.

### 2. Validate That the Target Index Is an Integer

`generateQuery()` checks only:

```text
targetIndex < 0
targetIndex >= DB_SIZE
```

Values such as `NaN` and fractional indices can pass those comparisons and then be coerced by the shift operator.

Add:

```ts
if (!Number.isInteger(targetIndex)) {
  throw new Error("target index must be an integer");
}
```

Test:

- `NaN`;
- `1.5`;
- `Infinity`;
- `-0.5`; and
- numeric strings passed through an unsafe caller.

### 3. Decouple `runFullPIR()` From the Global Catalog

`runFullPIR(db, targetIndex)` accepts a database argument, but its correctness check compares the reconstructed string against:

```text
CATALOG[targetIndex].title
```

This creates a hidden dependency between the supposedly generic protocol function and the demo’s global catalog.

A caller can pass a different database and receive `isCorrect = false` even when PIR reconstructed the supplied database record perfectly.

Recommended model:

```ts
interface PIRResult {
  reconstructedRecord: Uint8Array;
  expectedRecord: Uint8Array;
  isCorrect: boolean;
}
```

Compute correctness by comparing the reconstructed 64-byte record with `db[targetIndex]`.

Decode the title only in the UI layer.

### 4. Verify the Entire Record, Not Only the Title

The server responses reconstruct all 64 bytes, but `reconstruct()` decodes only bytes 0–47, and `isCorrect` compares only the title.

That means:

- author corruption is invisible;
- two records with the same title but different authors are treated as equivalent; and
- the badge says the “exact book” was reconstructed without checking the complete encoded record.

Add:

- `reconstructRecord(r1, r2): Uint8Array`;
- `decodeBookRecord(record)`;
- byte-for-byte correctness checking; and
- a UI display of the recovered title and author.

A tamper test should alter an author byte and prove that the full-record check fails.

### 5. Correct the √N Dimension Calculation

The scaling code uses:

```text
Math.round(Math.sqrt(N))
```

A matrix capable of holding `N` records needs:

```text
ceil(sqrt(N))
```

For example:

- `N = 10` needs a `4 x 4` grid, not `3 x 3`;
- `N = 100,000` needs dimension `317`, not `316`.

Use:

```ts
const side = Math.ceil(Math.sqrt(n));
const paddedCapacity = side * side;
```

Display the padding when `N` is not a perfect square.

The claims test currently repeats the same `Math.round` formula, so it validates internal consistency rather than matrix capacity. Change the test to assert:

```text
side² >= N
(side - 1)² < N
```

### 6. Show Total Communication, Not Only Query Bits

The √N section accurately reduces each query vector from `N` bits to approximately `√N` bits. But each server must return one record-sized parity for every row.

For record length `L`, the rough two-server communication is:

#### One-dimensional scheme

```text
queries:   2N bits
responses: 2L bits
total:     2N + 2L bits
```

#### Square-matrix scheme

```text
queries:   2√N bits
responses: 2√N * L bits
total:     2√N(1 + L) bits
```

The response dominates for ordinary record sizes.

Recommended scaling cards:

- query bytes sent to both servers;
- response bytes received from both servers;
- total communication;
- server-side records processed; and
- comparison with downloading the full database.

Keep the current query-size graphic, but label it explicitly as **query bits only**.

### 7. Correct “One Record’s Worth of Data”

The page says two-server IT-PIR lets the user transfer “one record’s worth of data.”

In this protocol, both servers return a record-sized XOR response, so the client receives two record-sized responses, in addition to sending two masks.

Recommended wording:

> Instead of downloading all `N` records, the client sends two masks and receives two record-sized XOR responses.

### 8. Separate Privacy Assumptions From Correctness Assumptions

The page often summarizes the trust model as:

> at least one server is honest.

That phrase conflates two different requirements.

For **query privacy**, at least one server must not reveal its received query to the other party or to a common observer.

For **correctness**, both servers must compute their responses correctly—or the client needs an additional integrity mechanism.

A malicious server can return arbitrary bytes and make reconstruction wrong without learning the requested index.

Recommended wording:

> Privacy survives as long as no party obtains both query masks. Correctness additionally requires honest server responses or an authenticated/verifiable database mechanism.

### 9. Add a Malicious-Server Experiment

The current failure panel covers collusion but not response tampering.

Add a button:

> **Server 2 alters one response byte**

Then show:

- reconstruction produces a corrupted record;
- the basic PIR protocol has no built-in proof that the response was computed correctly; and
- PIR protects query privacy, not response integrity.

A follow-up teaching card can mention possible layers such as:

- authenticated public database snapshots;
- Merkle commitments;
- signatures;
- verifiable computation; or
- redundant servers.

Avoid implying that a Merkle proof alone trivially authenticates an XOR aggregate; present it as an additional protocol-design problem.

### 10. Scope “Learns Nothing” to the Requested Index

Several visible statements say the server learns “nothing” or that the query is simply “provably private.”

The exact guarantee is narrower:

> Each individual server’s query-mask distribution is independent of the requested index.

The protocol does not hide:

- that a query occurred;
- client IP or account;
- timing;
- frequency;
- response size;
- database version;
- the fact that the client uses PIR; or
- correlations from the surrounding application.

The README discusses metadata, but the strongest hero claims should carry the same qualifier.

Recommended phrase:

> From its mask alone, either server learns zero information about the requested index.

### 11. Replace “Random-Looking” With “Uniformly Random”

Information-theoretic privacy does not rest on the mask merely appearing random to a computationally bounded observer.

Each server’s mask is actually uniformly distributed over the query space.

Use:

> uniformly random from that server’s view

rather than:

> cryptographically random-looking

This distinction reinforces why the guarantee is information-theoretic rather than pseudorandom or computational.

### 12. Label the Servers as Simulated

Both “servers,” the full catalog, the target selection, and every response live in one browser bundle.

That is appropriate for a visualization, but the visual design can make the trust boundary appear more real than it is.

Add a persistent label:

> **Teaching simulation:** Both servers run locally in this browser. A real deployment requires independently operated replicas and separate query delivery paths.

Also state that the browser already contains the full toy database, so no actual privacy service is being performed.

### 13. Explain the Trusted-Client Requirement

In a web deployment, the JavaScript that reads the user’s click knows the target index before PIR begins.

A malicious or compromised client bundle can transmit the book selection directly, bypassing the protocol entirely.

Add a threat-model card:

> PIR protects the query sent by an honest client. It cannot protect a user from malicious client software, telemetry, injected scripts, or a compromised update channel.

For a real browser client, discuss:

- reproducible builds;
- audited source;
- strict content-security policy;
- no third-party analytics;
- dependency integrity; and
- preferably a separately installed client rather than server-supplied code.

### 14. Explain the Common-Observer Problem

Two separately named servers are not enough when both masks can be observed by:

- the same CDN;
- the same reverse proxy;
- a shared logging provider;
- the same cloud administrator;
- a passive network observer without transport encryption; or
- a common analytics pipeline.

Any party that sees both masks can compute the target bit exactly like the collusion panel.

The practical requirement is not merely two hostnames. It is organizational and observational separation.

### 15. Add Replica-Synchronization Failure

Both servers must use:

- identical record bytes;
- identical record ordering;
- identical database size; and
- the same database version.

If one server has a different catalog snapshot, XOR reconstruction produces corrupted output.

Add a simulation:

> **Server 2 has a stale catalog version**

Then explain the need for a signed database epoch or digest shared by both replicas and known to the client.

### 16. Teach Why Records Are Fixed Length

The 64-byte record layout is not merely a convenient array size. Fixed-size responses help avoid leaking which record was selected through response length.

Add a short callout:

> Every record is padded to the same length so response size does not identify the requested item.

Also clarify that real systems may retrieve fixed-size blocks rather than human-readable records directly.

### 17. Make Record Encoding Robust to Unicode

`encodeBook()` truncates UTF-8 byte arrays at fixed positions.

A multibyte character can be cut in the middle, producing invalid UTF-8 when decoded.

Current catalog entries are ASCII, so the bug is dormant.

Recommended options:

- length-prefix each field and truncate only at Unicode code-point boundaries;
- use a fixed binary schema;
- use fixed-size encrypted or opaque blocks; or
- explicitly reject data that does not fit.

Add tests with accented, CJK, and emoji-containing titles near the field boundary.

### 18. Remove the Truncated Author Ambiguity

The author field has only 16 bytes and intentionally turns:

```text
Yuval Noah Harari
```

into:

```text
Yuval Noah Harar
```

That undermines an “exact record” teaching claim.

Use a larger field, a compact length-prefixed schema, or display that the record is intentionally truncated. Better still, store a record identifier and retrieve the full metadata through a separate fixed-block design.

### 19. Validate Database Shape in `runServer()`

`runServer()` assumes:

- at least `DB_SIZE` records;
- every record is 64 bytes; and
- the global `DB_SIZE` matches the supplied database.

The function accepts `db` but does not validate those assumptions.

Use:

```ts
const recordLength = db[0]?.length;
```

Then validate:

- `db.length > 0`;
- query width matches `db.length`;
- all records have the same length; and
- mask bits outside the database range are rejected.

Return a response of `recordLength` rather than hardcoding 64.

### 20. Replace the Global `DB_SIZE` Coupling

Core functions such as `runServer()` and `getSetBits()` use the imported global `DB_SIZE`, even though `runServer()` receives a database argument.

A more reusable design would use an explicit protocol context:

```ts
interface PIRDatabase {
  records: Uint8Array[];
  recordLength: number;
  size: number;
}
```

This would also make 32-record boundary testing much easier.

### 21. Add a Real Small Matrix-PIR Experiment

The √N explanation is currently illustrative.

A small live `4 x 4` experiment would strengthen the scaling lesson:

1. choose one of 16 records;
2. derive row and column;
3. generate two four-bit column masks;
4. have each server return four row parities;
5. XOR the response vectors;
6. recover the target column; and
7. select the row locally.

Then compare measured communication with the one-dimensional scheme.

This would turn the scaling section from a diagram into an executable claim.

### 22. Show Server Computation Cost

Both the one-dimensional and matrix constructions still require substantial server work. In the simple implementation, each server examines the database and XORs many records.

PIR reduces what the client reveals and can reduce communication; it does not make server computation free.

Add a metric:

- records scanned;
- records XORed;
- bytes read;
- query bytes;
- response bytes.

This would make the “cheap” language more honest.

### 23. Clarify That PIR Does Not Provide Access Control

PIR lets a client retrieve a record privately. It does not by itself enforce:

- borrowing authorization;
- subscription rights;
- query quotas;
- abuse prevention;
- database confidentiality from the client; or
- payment.

This matters because library privacy and library account access are separate system requirements.

### 24. Add Freshness and Replay Language

Fresh randomness is important, but reusing the same mask pair also creates linkability between repeated requests and can expose relationships if queries are compared.

Add a small experiment:

> **Reuse yesterday’s mask**

Then explain that each query needs newly sampled uniform randomness.

The current test only proves that 64 random draws do not all collapse to one constant. For deterministic testing, inject a random-word provider into `generateQuery()` so fixed masks, repeated masks, all-zero masks, and bit-31 masks can be exercised without probabilistic tests.

### 25. Split the Browser-Test Commands

The script:

```json
"test:a11y": "playwright test"
```

runs both the accessibility spec and the functional claims spec.

That is good for deployment, but the name and README are misleading.

Recommended scripts:

```json
{
  "test:e2e": "playwright test",
  "test:a11y": "playwright test e2e/a11y.spec.ts",
  "test:claims": "playwright test e2e/claims.spec.ts"
}
```

Have deployment run:

```text
npm run test:e2e
```

Rename the workflow step from **Accessibility gate** to **Browser claims and accessibility gate**.

### 26. Fix the Broken Skip Link

The shared skip link points to:

```text
#app
```

but this page has no element with `id="app"`.

The main content is:

```html
<main id="main-content">
```

Change the link to:

```html
<a class="cl-skip-link" href="#main-content">Skip to content</a>
```

Make `#main-content` programmatically focusable when needed and add a keyboard test that activates the link and confirms focus reaches the main region.

### 27. Remove or Correct the Legacy Header

The page contains both the shared Crypto Lab top bar and an older in-page site header.

The older header links to:

```text
https://github.com/systemslibrarian/patron-shield
```

rather than the repository being reviewed:

```text
systemslibrarian/crypto-lab-patron-shield
```

Remove the redundant header or correct its links. Keeping two navigation headers also adds visual and landmark complexity that the runtime deduplication script has to repair.

### 28. Add Independent Statistical Tests Only Where They Add Value

The privacy proof does not need empirical frequency tests; it follows algebraically from uniform `S` and XOR by a fixed basis vector.

Use deterministic distribution reasoning and injected randomness for correctness tests. A separate large-sample sanity test may remain, but it should not be treated as proof of information-theoretic privacy.

## Recommended Test Additions

1. Target index 31 collusion recovery returns 31.
2. `NaN`, fractional, and infinite indices are rejected.
3. A synthetic 32-record database works for every target.
4. `runFullPIR()` compares against the supplied database, not global catalog state.
5. Altering only the author bytes makes full-record correctness fail.
6. Unequal record lengths are rejected.
7. Database length and query width mismatches are rejected.
8. Unicode truncation cannot create malformed UTF-8.
9. `ceil(sqrt(N))² >= N` at every slider position.
10. Matrix total communication includes response vectors.
11. A malicious response causes visible reconstruction failure.
12. Stale server replicas produce a named database-epoch mismatch.
13. Reused query randomness is detected or explicitly demonstrated.
14. The skip link reaches `#main-content`.
15. The maintained browser command runs both accessibility and claims suites.
16. No stale or incorrect repository link remains in the page header.

## Suggested Teaching Sequence

A compact navigator would make the argument easier to follow:

> Threat → Query masks → Server XORs → Cancellation → Privacy proof → Collusion → Malicious response → Metadata → Scaling

The trust-model panel should separate four questions:

| Property | Requirement |
|---|---|
| Index privacy | No party sees both masks |
| Correct response | Servers compute honestly or responses are verifiable |
| Database consistency | Replicas use the same authenticated snapshot |
| Metadata privacy | Separate transport, identity, timing, and logging protections |

## Final Verdict

Patron Shield already succeeds at its primary lesson:

> Two individually uniform query masks can encode one hidden target in their correlation, and XOR reconstruction returns the record while collusion exposes the index immediately.

The recent claims suite is one of the lab’s strongest assets.

The next release should focus on precision rather than additional visual polish:

1. fix bit 31 and integer validation;
2. verify the complete supplied database record;
3. correct the √N capacity and communication accounting;
4. separate privacy, correctness, metadata, and replica assumptions;
5. label the servers as a local simulation;
6. add malicious-response and stale-replica experiments; and
7. fix the skip link and redundant header.

With those changes, Patron Shield would become a particularly rigorous explanation not only of why two-server IT-PIR works, but also of what a real deployment must do beyond the elegant XOR proof.
