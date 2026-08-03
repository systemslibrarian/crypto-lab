# Crypto Lab J-UNIWARD — Suggestions

## Overall Assessment

J-UNIWARD is one of the most technically serious labs in the collection.

The recent cost-function rewrite is a major advancement. The page now computes the three first-level undecimated directional residuals, uses the 16-tap Daubechies-8 filter bank and `σ = 2⁻⁶`, and validates the optimized cost-map path against a brute-force perturb-and-recompute implementation. That is a much stronger foundation than the previous decimated, multilevel approximation.

The latest browser claims suite is also excellent. It verifies the page’s visible arithmetic and failure paths rather than merely checking for familiar labels:

- the success verdict agrees with the actual number of changed coefficients;
- payload components add up;
- the displayed payload rate is recomputed from the page’s own values;
- the capacity table agrees with the displayed NZAC count;
- changes are a subset of selected carriers;
- the embed → download → upload → extract path is exercised;
- wrong-key, missing-sideband, altered-sideband, non-JPEG, empty-input, and over-capacity paths fail visibly;
- stale results are retired when inputs or the cover change; and
- uncaught browser exceptions fail the run.

Those are substantial improvements.

The main remaining weakness is that the cost map is now closer to J-UNIWARD than the embedding and comparison layers are. The page currently combines:

1. a strong J-UNIWARD distortion calculation;
2. a custom binary block syndrome code labelled “full STC”;
3. a deterministic one-direction parity modification rule labelled ternary `±1`;
4. a simplified sequential “F5” baseline; and
5. a detectability rating derived from J-UNIWARD’s own objective.

That combination teaches the right high-level intuition, but several labels are stronger than the implementation supports.

## What Improved Most

### 1. The Cost Function Is Now Mechanism-Level

The rewritten cost code models the actual UNIWARD idea:

```text
relative wavelet disturbance
    =
|change in directional residual|
--------------------------------
σ + |cover directional residual|
```

The block probe is especially valuable because it shows both sides of the ratio:

- the spatial/wavelet ripple caused by one DCT change; and
- the cover residual that makes the same ripple cheap in texture and costly in predictable content.

### 2. The Fast Path Is Tested Against a Literal Path

Validating every block and AC mode against a brute-force implementation is much stronger than accepting a high correlation.

The test makes it difficult for a performance optimization to silently drift away from the local mathematical definition.

### 3. The Real JPEG Round Trip Is Tested

The unit suite exercises:

```text
decode coefficients
→ compute costs
→ embed
→ re-encode JPEG
→ inject sideband
→ decode again
→ extract
→ verify HMAC
```

That is the correct system-level test for a coefficient-domain teaching tool.

### 4. Stale-State Handling Is Much Better

The latest fixes correctly retire:

- prior embed verdicts;
- summary cards;
- visual comparisons;
- steganalysis results; and
- extract outputs

when the message, key, rate, or cover no longer matches the completed run.

### 5. The Page Is Honest That Placement Is Only a Proxy

The visible “placement proxy — not a detector” language is an important safeguard. The limitations section also names richer feature-based and neural detectors.

The next step is to make every surrounding label honor that caveat consistently.

## Priority Recommendations

### 1. Stop Calling the Current Coding Layer “Full STC”

This is the highest-priority fidelity correction.

The implementation does not construct the syndrome-trellis code described by Filler, Judas, and Fridrich.

A conventional STC uses a small `h × w` submatrix `Ĥ` placed repeatedly along the diagonal of a larger banded parity-check matrix, shifted by one message row. That convolutional structure is what produces the syndrome trellis.

The current code instead:

1. generates `w = ceil(h / rate)` arbitrary 12-bit columns;
2. treats them as one dense `12 × w` parity-check block;
3. embeds exactly 12 message bits into that independent block; and
4. resets the optimization for the next 12-bit chunk.

The Viterbi-style dynamic program does find the minimum-cost subset for each dense block, but this is better described as:

> **exact minimum-cost binary syndrome embedding with 12-bit blocks**

It is not the published long, shifted syndrome-trellis construction.

Choose one path:

#### Path A — Rename Honestly

Use:

> Binary block syndrome coding, solved exactly with a 4096-state dynamic program.

Remove:

- “Full STC”;
- “literal STC implementation”;
- “the STC from Filler et al.”; and
- claims that `h=12` has the same coding behavior as the reference toolbox.

#### Path B — Implement the Actual STC Construction

- Generate or select a valid small `Ĥ` submatrix.
- Place it along the parity-check matrix with the required row shifts.
- Run the forward/pruning and traceback phases over the complete carrier stream.
- Preserve trellis state across message-bit boundaries rather than restarting every 12 bits.
- Cross-check output and distortion against the official STC toolbox or an independent implementation.

### 2. Implement J-UNIWARD’s Ternary Embedding Operation

The UNIWARD paper explicitly notes that the `+1` and `−1` costs are equal for ordinary J-UNIWARD and uses a ternary embedding operation through the multilayered STC construction.

The current code has only two states per carrier:

```text
unchanged
or
parity flipped
```

When a flip is selected, one direction is predetermined:

```text
0       → +1
positive even → +1
positive odd  → −1
negative even magnitude → −1
negative odd magnitude  → +1 toward zero
```

This creates avoidable asymmetry:

- zero always becomes `+1`, never `−1`;
- some coefficients always shrink toward zero;
- others always grow away from zero;
- the direction is tied to coefficient parity; and
- the resulting histogram behavior is not the usual ternary J-UNIWARD embedding distribution.

Recommended implementation:

- Represent each carrier choice as `−1`, `0`, or `+1`.
- Use separate `ρ−`, `ρ0`, and `ρ+` values, even when `ρ− = ρ+`.
- Use the multilayered nonbinary STC construction or another correctly labelled ternary minimum-distortion coder.
- Resolve equal-cost direction choices with keyed unbiased randomness, not a parity rule.
- Apply wet costs to impossible or unsafe directions independently.

Until then, name the pipeline:

> J-UNIWARD cost-guided binary parity embedding

rather than simply:

> J-UNIWARD embedding.

### 3. Add an External Golden-Vector Test for the Cost Map

The current fast and slow implementations share:

- the same wavelet coefficients;
- the same filter orientation;
- the same mirror rule;
- the same anchor;
- the same DCT basis;
- the same quantization interpretation; and
- the same boundary convention.

Perfect agreement proves that the optimization matches the repository’s own literal implementation. It does not independently prove that both match the published or reference J-UNIWARD convention.

Add fixed golden cost maps produced by an independent implementation such as:

- the corrected mathematical interpretation of the paper;
- the Binghamton reference implementation;
- `conseal`;
- or a small NumPy/SciPy reference written separately from this TypeScript code.

Compare:

- every DCT mode;
- interior blocks;
- all four image boundaries;
- odd image dimensions;
- multiple quantization tables; and
- grayscale and color JPEG luma planes.

State clearly whether the lab implements:

1. the paper’s intended cost-window alignment;
2. the historical reference implementation’s known off-by-one behavior; or
3. both as a comparison toggle.

The 2023 off-by-one analysis would make an excellent additional exhibit.

### 4. Treat the COM Sideband as a Stego Fingerprint, Not Merely Fragile Metadata

The page currently warns that the COM marker may be stripped.

The larger issue is that it makes every output trivially identifiable as a file created by this demo.

The marker contains:

- a 16-byte salt;
- the embedding rate; and
- the exact plaintext byte length.

A simple metadata scanner can flag the file without examining the DCT coefficients or running a steganalyzer.

Recommended visible warning:

> **Demo container:** the COM marker makes this file easy to fingerprint. It exists only so the browser round trip can be reproduced without separately sharing parameters.

Better designs:

- share extraction parameters out of band;
- use a fixed, versioned public profile;
- provide a separate nonsecret recovery file;
- or embed a versioned bootstrap header through a deliberately documented scheme.

Do not present the downloaded file as covert while it contains a unique plaintext metadata signature.

### 5. Encrypt the Payload Before Embedding

The payload is authenticated with HMAC but is not encrypted.

Steganography and encryption solve different problems. Hiding the existence or location of a message does not provide a standard confidentiality guarantee for the message content.

The keyed permutation and parity-check matrix are not a reviewed encryption construction.

Recommended pipeline:

```text
UTF-8 message
→ versioned authenticated-encryption envelope
→ padded ciphertext
→ STC embedding
```

Derive an independent encryption key through the existing HKDF schedule and use an AEAD with:

- a random nonce;
- algorithm/profile ID;
- authenticated payload length or padding class; and
- explicit versioning.

Then explain:

> Encryption protects the message if the stego channel is discovered. Steganography attempts to conceal that a message exists.

### 6. Explain the Offline Passphrase-Guessing Attack

The public salt and embedded authentication tag create an offline verifier.

An attacker can:

1. read the salt and public parameters;
2. try a candidate passphrase;
3. derive the carrier permutation, parity-check data, and MAC key;
4. extract candidate bytes; and
5. test the HMAC without contacting the sender or recipient.

PBKDF2 at 600,000 iterations slows the attack but does not make a human-chosen weak password safe.

Add a **Break It** experiment:

- embed with a weak key from a small dictionary;
- run the actual extraction and HMAC pipeline for each candidate;
- recover a matching key;
- contrast it with a randomly generated high-entropy key.

Phrase PBKDF2 as a work factor, not a source of entropy.

### 7. Replace the “F5” Baseline or Rename It

The function labelled F5 is not the F5 algorithm.

It performs:

- sequential traversal;
- no keyed permutation;
- one payload bit per nonzero AC coefficient;
- magnitude decrement on mismatch; and
- shrinkage retry.

Actual F5 is defined by two load-bearing ideas omitted here:

- permutative straddling; and
- matrix encoding.

Recommended options:

#### Accurate Baseline Name

> Sequential F5-style shrinkage baseline

State explicitly that it isolates the histogram effect of magnitude decrement but does not implement F5’s matrix coding or keyed spreading.

#### Actual F5

Implement:

- keyed coefficient permutation;
- F5 matrix encoding;
- shrinkage handling;
- exact embedded-bit accounting; and
- extraction.

Do not call the current three-way panel an “honest LSB vs F5 vs J-UNIWARD comparison” until that distinction is fixed.

### 8. Verify That Every Comparator Embeds the Full Payload

`f5Embed()` returns `bitsEmbedded`, but `runAnalysis()` discards it.

At high payload, low NZAC, or heavy shrinkage, the F5-style baseline can stop before embedding all requested bits. The page then compares it against a J-UNIWARD run that did carry the full payload.

Add:

- requested bits;
- successfully embedded bits;
- capacity failure;
- changes per successfully embedded bit; and
- an explicit “comparison invalid” state when any method carries less data.

The LSB baseline should return the same accounting rather than silently stopping at the end of the pixel array.

### 9. Use the Same Payload Bits for All Methods

The actual J-UNIWARD run embeds:

```text
length || user message || HMAC
```

The LSB and F5 comparisons embed a repeated `0xA7` byte pattern of equal length.

Equal length is not identical payload. The message syndrome can affect:

- which coefficients must change;
- change count;
- total distortion; and
- histogram behavior.

Build the exact payload bytes once and pass the same bitstring to every method.

For a more stable comparison, repeat the experiment over several cryptographically random payloads and display the mean and range.

### 10. Do Not Measure J-UNIWARD’s Security Only With J-UNIWARD’s Own Objective

The placement score ranks every changed coefficient by its J-UNIWARD cost percentile.

J-UNIWARD is designed to minimize that exact cost. It is therefore expected to “win” this metric by construction.

The panel proves:

> J-UNIWARD’s optimizer places changes where the J-UNIWARD cost function says changes are cheapest.

It does not independently prove:

> J-UNIWARD is harder for a warden to detect.

The original research evaluated statistical security using trained detectors over large image corpora, not by grading the algorithm against its own objective.

Recommended changes:

- Rename the score **objective alignment** or **J-UNIWARD cost exposure**.
- Remove categorical labels such as “Resistant” and “Detectable” from this metric.
- Replace them with:
  - lower exposure;
  - medium exposure;
  - higher exposure.
- Remove “J-UNIWARD genuinely wins” from the README.
- State that security superiority requires an independent steganalyzer and test corpus.

A future advanced mode could run a small pretrained detector locally, clearly documenting its corpus and limitations.

### 11. Remove Arbitrary “Safe / Moderate / Risky” Security Labels

The capacity and rate controls label payloads such as:

- `0.10` — Safe;
- `0.20` — Moderate;
- `0.40` — Risky.

There is no universal safe J-UNIWARD payload.

Detectability depends on:

- cover source;
- image size and texture;
- JPEG quality factor;
- quantization table;
- detector;
- training corpus;
- embedding implementation;
- key reuse;
- payload distribution; and
- operational metadata.

Use:

- Lower payload;
- Medium payload;
- Higher payload.

Replace:

> use ≤ 0.3 for meaningful stealth

with:

> Lower payloads generally produce fewer changes, but no payload is universally undetectable.

### 12. Fix Huffman-Table Re-encoding

The JPEG encoder reuses the source image’s original Huffman tables.

Optimized JPEGs often omit run/size symbols that did not occur in the original entropy stream. A `±1` modification can introduce a new:

- coefficient magnitude category;
- zero run length;
- ZRL placement; or
- EOB pattern.

`huffEncode()` currently reads:

```text
len = table.encLen[symbol]
```

and writes the code without checking whether `len` is zero.

For an absent symbol, the encoder can silently emit no code and produce a corrupted JPEG.

Recommended options:

1. Generate new canonical Huffman tables that cover every symbol in the modified coefficient stream and write updated DHT segments.
2. Use complete standard Huffman tables and update the JPEG headers.
3. Mark any coefficient direction that would require an unavailable symbol as wet, although interactions with run lengths make this difficult.
4. At minimum, reject the encode with a specific error when an unavailable symbol is encountered.

Add a corpus of optimized-Huffman JPEGs and mutation tests that deliberately create previously absent symbols.

### 13. Reject Unsupported JPEG Scan Structures Explicitly

The parser stops at the first SOS marker and reconstructs one entropy stream.

That does not safely support every SOF0/SOF1 JPEG. Sequential JPEGs can use:

- multiple scans;
- noninterleaved component scans;
- unusual component order;
- arithmetic coding;
- CMYK/YCCK layouts;
- uncommon sampling configurations; and
- marker segments after the first scan.

The current encoder also discards everything after the first entropy stream and appends a new EOI.

Publish the actual supported profile, for example:

> 8-bit Huffman-coded baseline sequential JPEG, one interleaved scan, grayscale or YCbCr with supported sampling factors.

Reject everything else before embedding.

Add real files for:

- grayscale;
- 4:4:4;
- 4:2:2;
- 4:2:0;
- optimized Huffman tables;
- restart intervals;
- multiple sequential scans;
- CMYK;
- arithmetic coding;
- SOF1 12-bit; and
- truncated/corrupt marker streams.

### 14. Prevent Infinite Reads on Truncated Entropy Data

`BitReader.readBits()` repeatedly calls `loadByte()` until enough bits exist.

When the input is exhausted, `loadByte()` returns without adding bits. The loop can therefore run forever on a truncated JPEG.

Make end-of-stream explicit:

```text
if no byte remains:
    throw TruncatedEntropyData
```

Fuzz the parser with:

- truncated entropy;
- malformed Huffman codes;
- missing EOI;
- malformed segment lengths;
- bogus restart intervals; and
- marker-like bytes.

Browser file parsing should always fail closed and return control to the UI.

### 15. Validate the Parity-Check Matrix Has Full Reachability

The generated 12-bit columns are nonzero, but nonzero does not imply full rank.

A deficient matrix may make some target syndrome unreachable.

The Viterbi code currently does not check whether the target state’s final cost is finite before traceback. Default predecessor entries can then produce an invalid change vector.

Add:

- rank validation when the matrix is created;
- a requirement that the code construction meets the intended STC submatrix constraints;
- a final `reachable` check before traceback; and
- a postcondition that the produced stego syndrome equals the requested message.

Inject deliberately rank-deficient matrices in tests.

### 16. Use Explicit Byte Order in the AES-CTR PRG

The hat-matrix and permutation code interprets AES-CTR output through:

```text
Uint16Array
Uint32Array
```

Those typed arrays use host byte order.

For a stateless extractor, the mapping from key to carriers must be specified byte for byte and remain portable across implementations and architectures.

Use `DataView` with a declared endianness.

Publish test vectors:

```text
passphrase
salt
carrier count
first N permutation entries
first N parity-check columns
```

### 17. Stream the Permutation PRG

`derivePermutation()` allocates AES-CTR plaintext and ciphertext buffers sized at roughly twice the number of AC coefficients.

Large images can require very large temporary allocations:

- identity permutation;
- random-word buffer;
- encrypted keystream;
- cost matrices;
- DCT blocks;
- wavelet residuals; and
- display pixels.

Generate random words in chunks and continue Fisher–Yates incrementally.

Also impose explicit limits on:

- file size;
- pixel dimensions;
- luma block count;
- carrier count; and
- predicted working memory.

### 18. Move Cost Computation and Embedding Off the Main Thread

The cost calculation and dynamic programming can block the browser for large images.

The current progress text yields before starting the heavy work, but most inner computation remains synchronous.

Use a Web Worker for:

- JPEG coefficient processing where practical;
- cost-map computation;
- permutation generation;
- syndrome embedding;
- analysis; and
- extraction.

Add:

- cancellation;
- monotonic run IDs;
- progress messages;
- memory-limit errors; and
- stale-result rejection when a new image or input is selected.

### 19. Calculate Capacity From the Actual Coding Geometry

The visible capacity is computed as:

```text
floor(NZAC × rate / 8)
```

and the UI subtracts 20 bytes for the header and MAC.

The actual coder additionally performs:

```text
message bits padded to a multiple of 12
w = ceil(12 / rate)
carriers = number_of_12_bit_blocks × w
```

The true limit is therefore constrained by both:

1. the bpnzac budget; and
2. the structural AC carrier pool after trellis/block rounding.

Compute the largest message length that satisfies the exact embedder equations.

Use the same function in:

- the table;
- the warning;
- the button gate;
- the embedder;
- the Quick Demo; and
- browser tests.

### 20. Separate “Payload Rate” From “Carriers Examined”

The summary currently displays:

```text
carriers used / NZAC
```

but the carrier pool contains every non-DC AC coefficient, including zeros.

These are different denominators.

Display:

- payload bits / NZAC — the standard bpnzac measure;
- structural AC candidates — `63 × luma blocks`;
- candidates consumed by the coding window;
- coefficients actually modified; and
- zero-to-nonzero versus nonzero changes.

Do not imply that every carrier used was initially a nonzero AC.

### 21. Add Bounds and Directional Wet Costs

The modification code writes into `Int16Array` without explicit coefficient bounds.

A boundary value can overflow or wrap, and a new coefficient category may be invalid for the JPEG profile or source Huffman table.

For every candidate, calculate separate directional permissions:

```text
can decrement?
can remain?
can increment?
```

Mark unsafe directions wet when they would:

- overflow storage;
- exceed the supported JPEG coefficient category;
- produce an unsupported entropy symbol;
- violate an implementation-defined saturation policy; or
- touch DC or another forbidden mode.

After embedding, assert that every modified coefficient differs by exactly one permitted step.

### 22. Do Not Treat a Large Finite Cost as Absolutely Wet

The code represents wet costs as large finite numbers.

A finite-cost Viterbi search can still select them when needed to satisfy the syndrome.

After coding, check that no wet carrier was changed. If the payload is infeasible without a wet change, fail explicitly.

A proper wet-paper construction or genuine infinite-state handling is preferable.

### 23. Version and Authenticate the Sideband Structure

The COM payload has no:

- magic identifier;
- version;
- algorithm profile;
- KDF parameters;
- STC construction identifier;
- payload format;
- charset definition;
- exact coding width;
- integrity binding; or
- padding policy.

Any 24-byte COM marker immediately after SOI is interpreted as this lab’s metadata.

Define a structured record such as:

```text
magic
format version
algorithm profile
KDF profile
coding profile
rate numerator or exact w
payload ciphertext length
salt
optional padding class
```

Avoid serializing rate as a Float32 when an exact integer/profile can be stored.

Bind every non-salt parameter into the authenticated payload.

Scan JPEG markers for the tagged record rather than assuming the first marker after SOI is the sideband.

Reject duplicates and unknown versions.

### 24. Hide Exact Message Length

The COM marker publishes the exact plaintext UTF-8 byte length.

Even when the content is encrypted, length can reveal useful information.

Support:

- fixed-size payload classes;
- random padding;
- bucketed lengths; or
- user-selected padded envelopes.

Display:

```text
plaintext bytes
ciphertext/envelope bytes
padded embedded bytes
public length leakage
```

### 25. State That JPEG Recompression Destroys the Channel

The limitations panel focuses on COM-marker stripping.

The DCT payload itself is also fragile.

Common transformations can change the coefficients and break extraction:

- recompression;
- quality-factor conversion;
- resizing;
- cropping;
- rotation;
- color conversion;
- social-media processing;
- metadata optimization; and
- lossless JPEG optimization that rewrites the structure.

Add:

> This is fragile steganography, not robust watermarking. The recipient generally needs the original stego JPEG bytes.

A useful Break-It panel could recompress the output at another quality and show the HMAC failure.

### 26. Replace the Variance-Based Carrier Rating

The “Good / Moderate / Poor carrier” badge is calculated from global luma variance before the cost map is available.

High variance can come from:

- a clean edge;
- a gradient with a few sharp boundaries;
- clipped contrast;
- text or graphics; or
- structured patterns

that are not equivalent to rich, hard-to-model texture.

Wait for the actual cost map and calculate a clearly labelled heuristic from:

- low-cost coefficient availability;
- cost distribution;
- spatial coverage of low-cost blocks;
- NZAC count;
- and expected distortion at the selected payload.

Do not call variance alone an image-suitability assessment.

### 27. Make the Comparison Corpus-Aware

A claim about steganographic detectability should not be based on one image.

Add a batch teaching mode over the bundled sample set:

- smooth;
- textured;
- portrait/mixed;
- line art;
- high and low quality factors; and
- several camera/source types.

Display per-image and aggregate results.

Avoid claiming broad algorithm superiority from three hand-selected covers.

### 28. Show Change Direction and Histogram Effects for J-UNIWARD

The page highlights F5 shrinkage but does not expose the deterministic parity-based direction rule used by its own embedder.

Add counts for:

- `0 → +1`;
- `0 → −1`;
- positive toward zero;
- positive away from zero;
- negative toward zero;
- negative away from zero;
- total shrinkage to zero; and
- per-DCT-mode changes.

This would make the current binary-direction artifact visible and motivate ternary embedding.

### 29. Recompute or Remove the “Detectability Label”

The label thresholds are hardcoded from the placement percentile:

```text
score < 12 → Resistant
score < 25 → Moderate
otherwise Detectable
```

Those thresholds are not trained or calibrated against detection error.

Remove the security-sounding label or rename it:

> J-UNIWARD objective exposure: low / medium / high

If a detector is added, report its actual metric:

- predicted probability;
- classification error;
- false-positive/false-negative context;
- corpus;
- detector version; and
- a strong warning that one detector is not universal.

### 30. Make Exactness Claims More Carefully

Recommended wording:

> The optimized cost-map implementation matches this repository’s brute-force interpretation of UNIWARD Eq. 3 to floating-point precision.

Reserve:

> exact published J-UNIWARD cost map

for the point at which independent golden vectors also agree.

Similarly, replace:

> no simulated math

with:

> The cost map, coefficient edits, JPEG round trip, and extraction are computed. The comparison ratings and STC walkthrough are teaching models.

### 31. Avoid Overstating Current Research Status

J-UNIWARD remains an important academic benchmark, but it is no longer the universal endpoint of JPEG steganography research.

Use:

> a foundational and widely used benchmark for adaptive JPEG steganography

rather than:

> the academic reference

without qualification.

The “Real-World Usage” heading should be changed to:

> Research and Benchmark Usage

This is primarily a research scheme and evaluation baseline, not a recommended covert-communications product.

### 32. Preserve Exact Passphrase Semantics

The UI trims the passphrase before embedding and extraction.

That makes leading and trailing spaces silently insignificant.

Choose and document one rule:

- preserve exact Unicode input bytes; or
- normalize using a versioned, explicit policy.

Also define Unicode normalization such as NFC so visually identical passphrases reproduce across devices.

Include normalization in the algorithm profile and test vectors.

### 33. Validate Every Core Parameter

The core should reject:

- `NaN`, infinite, zero, negative, and out-of-range rates;
- invalid salt lengths;
- empty carrier sets;
- inconsistent cost and coefficient block counts;
- incorrect block lengths;
- invalid quantization-table lengths;
- payload lengths that overflow arithmetic;
- unsupported JPEG coefficient ranges; and
- malformed passphrase/context encodings.

Do not rely on HTML sliders or file inputs to enforce cryptographic invariants.

### 34. Remove Unused Parameters and Expensive Extraction Work

`quantTable` is passed into embedding and extraction but is not used there.

Extraction recomputes the full J-UNIWARD cost map even though `selectCarriers()` uses only the structural block count and does not filter by cost.

Define the carrier domain directly from:

```text
number of luma blocks × AC indices 1..63
```

This will make extraction faster and remove a false dependency on recomputed stego costs.

### 35. Expand the JPEG Corpus Tests

The current samples prove the lab works on its own generated files.

Add real JPEGs produced by:

- libjpeg;
- libjpeg-turbo;
- mozjpeg;
- ImageMagick;
- Photoshop;
- phone cameras;
- browsers;
- optimized Huffman encoders;
- restart intervals;
- grayscale;
- 4:4:4;
- 4:2:2;
- 4:2:0; and
- unusual metadata layouts.

For every supported file:

```text
decode
→ encode unchanged
→ decode
→ assert every coefficient unchanged
→ embed
→ encode
→ decode
→ extract
```

Unsupported files should fail with a precise profile message, never hang or produce a corrupt download.

### 36. Publish Whole-Pipeline Test Vectors

A stateless extractor needs long-term compatibility.

Publish vectors containing:

- source JPEG hash;
- algorithm profile;
- passphrase encoding;
- salt;
- rate or coding-width representation;
- first permutation entries;
- parity-check construction;
- payload bytes;
- selected carriers;
- changed coefficients;
- output JPEG hash; and
- extracted message.

This would protect the lab against future changes to:

- byte order;
- KDF labels;
- filter orientation;
- mirror padding;
- parity-check generation;
- coefficient direction;
- sideband format; and
- payload framing.

### 37. Rename the Browser Test Script

`test:a11y` runs the entire Playwright suite, including functional claims.

Use:

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

Rename the CI step:

> Browser claims and accessibility gate

The deployment itself is otherwise in good shape: it uses `npm ci`, Node 24, a typecheck, core tests, a production build, and Playwright before publishing.

## Recommended Test Additions

1. The coding layer is cross-checked against the official STC toolbox or an independent implementation.
2. Every requested message syndrome is reachable; rank-deficient matrices fail explicitly.
3. The final syndrome is recomputed from the produced stego vector and equals the message.
4. A genuine ternary embedder chooses both `+1` and `−1` from zero over repeated trials.
5. Equal-cost directions are unbiased under a fixed test seed.
6. J-UNIWARD cost maps match independent golden vectors at every boundary.
7. Original off-by-one and corrected-paper modes produce the documented difference.
8. F5 embeds the full requested payload or the comparison is marked invalid.
9. All three methods receive the identical payload bits.
10. Comparison labels never claim detector-calibrated security.
11. A COM marker is visibly identified as a stego fingerprint.
12. Public parameters use a magic, version, and exact integer coding profile.
13. Altering any authenticated sideband field causes a named failure.
14. Weak passphrases are recoverable through the real offline attack demonstration.
15. Encrypted payloads fail closed under wrong key and tampering.
16. A source Huffman table missing a newly needed symbol causes safe regeneration or explicit rejection.
17. Optimized-Huffman JPEGs round-trip.
18. Multiple-scan JPEGs are rejected unless fully supported.
19. Truncated entropy input throws rather than hanging.
20. Invalid marker lengths fail without excessive allocation.
21. Exact capacity accounts for STC padding and structural carriers.
22. `carriersUsed`, `NZAC`, and total AC candidates are displayed with correct denominators.
23. Wet or saturated coefficient directions are never selected.
24. Rate, salt, coefficient, and table inputs are validated in the core.
25. AES-CTR-derived permutations are identical under published byte-order vectors.
26. Large-image memory estimates trigger a safe refusal before allocation.
27. Cancelling or replacing a heavy run prevents stale output.
28. JPEG recompression causes a named fragility failure.
29. The carrier-suitability badge derives from the cost distribution, not global variance.
30. The full Playwright suite blocks deployment under an accurately named command.

## Suggested Teaching Sequence

A refined sequence could be:

> JPEG coefficients → Wavelet disturbance → Cost map → Ternary choices → Syndrome-trellis coding → Keyed spreading → Stego JPEG → Fragility → Independent steganalysis → Offline key attack

The most important distinction should remain visible:

```text
minimizing a distortion objective
        is not
proving statistical undetectability
```

A second distinction:

```text
steganography
        is not
encryption
        is not
robust watermarking
```

## Final Verdict

The cost-function rewrite and claims suite moved J-UNIWARD forward substantially.

The best parts are now genuinely strong:

- actual JPEG coefficient parsing;
- the first-level undecimated directional residual model;
- `σ = 2⁻⁶`;
- the inspectable cost probe;
- an optimized path checked against brute force;
- coefficient-preserving JPEG round trips on the sample corpus;
- keyed extraction with integrity checking; and
- browser tests that catch stale and false claims.

The next release should concentrate on naming and implementation alignment:

1. replace or rename the custom dense block syndrome coder;
2. implement ternary `−1/0/+1` embedding;
3. cross-check the cost map externally;
4. stop calling the simplified baseline F5;
5. compare identical, fully embedded payloads;
6. rename the cost-percentile score so it cannot be mistaken for a detector;
7. eliminate the COM marker’s covert-channel implication;
8. encrypt the payload and teach offline passphrase guessing;
9. harden Huffman re-encoding and JPEG profile validation; and
10. add memory, cancellation, and malformed-input protections.

With those corrections, this could become one of the most rigorous browser explanations available of the full adaptive-steganography chain—from distortion design through coding, extraction, detection limits, and operational failure.

## Primary References

- Vojtěch Holub, Jessica Fridrich, and Tomáš Denemark, “Universal Distortion Function for Steganography in an Arbitrary Domain,” EURASIP Journal on Information Security, 2014:1.
- Tomáš Filler, Jan Judas, and Jessica Fridrich, “Minimizing Additive Distortion in Steganography Using Syndrome-Trellis Codes,” IEEE Transactions on Information Forensics and Security, 2011.
- Binghamton University DDE Lab, Syndrome-Trellis Codes Toolbox.
- Binghamton University DDE Lab, J-UNIWARD reference implementations.
- Benedikt Lorch, “Off-By-One Implementation Error in J-UNIWARD,” 2023.
