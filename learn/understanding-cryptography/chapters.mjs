// Original Crypto Lab activities for Paar, Pelzl & Güneysu, second edition (2024).
// The published book has 14 chapters; SHA-3 is a separate focus on section 11.5.
// CATALOG.md supplies every lab title and destination at build time.
const lab = (slug, note, coverage = 'direct') => ({slug: `crypto-lab-${slug}`, note, coverage});

export const entries = [
  {
    id: 'chapter-1', chapter: 1, kind: 'chapter', part: 'Foundations',
    bookTitle: 'Introduction to Cryptography and Data Security', coverage: 'direct',
    title: 'State what the attacker can observe before judging the protection',
    sections: '§§1.2–1.4: symmetric encryption, cryptanalysis and modular arithmetic',
    predict: 'If you replace a Caesar shift with a longer repeating Vigenère key, which visible patterns do you expect to disappear, and which might still help an attacker?',
    labs: [
      lab('dead-sea-cipher', 'Use the Caesar and substitution stages to connect a secret key, a public algorithm and a small search space.'),
      lab('vigenere-break', 'Explore periodicity and frequency evidence in a different historical cipher.', 'intro')
    ],
    try: 'In Dead Sea Cipher, encrypt a short sentence with repeated words, then run the Caesar search. In Vigenère Break, use a supplied challenge and inspect the proposed key length and recovered plaintext. Record the evidence available before the key was recovered, rather than describing only the successful answer.',
    reflect: 'Explain why a larger key space can defeat exhaustive search while a structural attack still succeeds. Which security service is missing if a receiver cannot detect an altered ciphertext?',
    limit: 'The classical examples illustrate selected attacks and modular operations. Vigenère is a related example, not the chapter’s affine-cipher construction. These activities do not supply a complete affine-cipher or integer-ring lesson, and the AES endpoint of the history lab is not a general proof of security.'
  },
  {
    id: 'chapter-2', chapter: 2, kind: 'chapter', part: 'Symmetric cryptography',
    bookTitle: 'Stream Ciphers', coverage: 'direct',
    title: 'Separate a reusable algorithm from a single-use keystream',
    sections: '§§2.1–2.3; §§2.4.2–2.4.3. Salsa20 in §2.4.1 remains a comparison in the reading.',
    predict: 'If two equal-length messages use exactly the same keystream bytes, can changing the generator from a pad to ChaCha20 prevent the ciphertext XOR from revealing a message relationship?',
    labs: [
      lab('otp-vault', 'Inspect XOR encryption, the perfect-secrecy assumptions and the failure caused by reusing a pad.'),
      lab('lfsr-forge', 'Step binary registers and test a recurrence against unseen output. The catalog also records its real Trivium implementation.'),
      lab('chacha20-stream', 'Follow a ChaCha20 quarter round and compare fresh-nonce and repeated-nonce encryption.')
    ],
    try: 'Use two different equal-length messages in the OTP reuse experiment and in ChaCha20 Stream’s nonce-reuse experiment. Write down which key, nonce and byte positions were repeated. Next fit an LFSR recurrence, freeze its forecast, and reveal the withheld output; compare fitting the observed prefix with predicting new bits.',
    reflect: 'Explain the common XOR failure and the different security assumptions behind the two generators. Why does matching a short prefix establish less than an accurate unseen forecast, and why does neither establish a general security theorem?',
    limit: 'Perfect secrecy requires an independent, uniformly random secret pad of sufficient length used once. Browser randomness does not certify that physical assumption. Small LFSR attacks do not break ChaCha20 or full Trivium. Salsa20 is referenced but has no catalogued stream-cipher implementation. Trivium and the perfect-secrecy extension are existing commissioned work, not new gaps.'
  },
  {
    id: 'chapter-3', chapter: 3, kind: 'chapter', part: 'Symmetric cryptography',
    bookTitle: 'The Data Encryption Standard (DES) and Alternatives', coverage: 'direct',
    title: 'Explain reversibility separately from resistance to attack',
    sections: '§§3.2–3.5 and §3.7; Serpent connects to §3.7.1, while PRESENT (§3.7.3) remains uncovered as an exact cipher.',
    predict: 'DES uses S-boxes that map more input bits to fewer output bits. Can its whole encryption still be reversible without inverting those S-boxes?',
    labs: [
      lab('feistel-forge', 'Step real DES and its round-key order; inspect the double-encryption meet-in-the-middle experiment.'),
      lab('iron-serpent', 'Connect one AES finalist to a different block-cipher design; this is Serpent, not DES or PRESENT.'),
      lab('biham-lens', 'Use a deliberately small substitution–permutation network to study differential evidence.', 'intro')
    ],
    try: 'In Feistel Forge, pause after a DES round and record the two halves and the round-function output. Work backwards through that round using XOR and the retained half, then check the displayed decryption. Compare the information retained by a Feistel round with the reversible layers of the toy SPN in Biham Lens.',
    reflect: 'Which values make the backwards step possible even though the round function loses information? Explain why demonstrating reversibility does not establish sufficient key size, block size or resistance to cryptanalysis.',
    limit: 'DES is historical. The attack examples use the lab’s stated budgets and small or deliberately restricted targets. Serpent is one alternative, not coverage of every AES finalist. A toy SPN does not implement PRESENT. Triple-DES and DESX are not credited as implemented by the catalog merely because a lab discusses them.'
  },
  {
    id: 'chapter-4', chapter: 4, kind: 'chapter', part: 'Symmetric cryptography',
    bookTitle: 'The Advanced Encryption Standard (AES)', coverage: 'intro',
    title: 'Open one AES round, then identify what a complete AES explanation still needs',
    sections: '§§4.2–4.6, especially field arithmetic (§4.3), the round layers and key schedule (§4.4), and decryption (§4.5)',
    predict: 'Which AES round operations change a byte’s value, which move bytes between positions, and which mix several bytes together?',
    labs: [
      lab('aegis-gate', 'Its “open the black box” panel computes a genuine AES round stage by stage inside AEGIS. AEGIS is a different authenticated cipher.', 'modern'),
      lab('aes-modes', 'Run real AES through several modes and distinguish the block primitive from its surrounding construction.', 'intro'),
      lab('glass-box', 'A full AES-128 implementation supports white-box experiments; the teaching focus is implementation exposure and attacks.', 'intro')
    ],
    try: 'Open AEGIS Gate’s state-machine exhibit and expand “open the black box.” Record the displayed state after SubBytes, ShiftRows, MixColumns and the round-key XOR. Mark one relocation and one operation that combines input bytes. Return to the book and identify the key-expansion and inverse-operation steps that this single-round view does not walk through.',
    reflect: 'Why is observing one AES round inside AEGIS insufficient to claim that you have traced a complete AES encryption? Explain the difference between a mode using AES and a construction using AES’s round function.',
    limit: 'This is the clearest partial chapter connection. The fleet computes full AES and already exposes one round, but the selected learner surfaces do not form a complete route through GF(2^8) arithmetic, S-box derivation, all round keys, the exceptional final round and inverse operations. No browser trace establishes constant-time execution or side-channel resistance.'
  },
  {
    id: 'chapter-5', chapter: 5, kind: 'chapter', part: 'Symmetric cryptography',
    bookTitle: 'More About Block Ciphers', coverage: 'direct',
    title: 'Ask what changes when the primitive stays the same and the construction changes',
    sections: '§5.1, including XTS-AES (§5.1.6), and §§5.2–5.3 on search and repeated encryption',
    predict: 'Will a secure block cipher hide the positions of repeated plaintext blocks if each block is encrypted independently? Will a disk-encryption mode also detect an attacker’s edits?',
    labs: [
      lab('aes-modes', 'Compare ECB, CBC, CTR, GCM and CCM behavior with the same block primitive; the OFB extension is already commissioned.'),
      lab('sector-vault', 'Explore XTS-AES tweaks, sector binding and the absence of message authentication.'),
      lab('feistel-forge', 'Use double DES to connect composition with the meet-in-the-middle search strategy.')
    ],
    try: 'In AES Modes, encrypt repeated-block input with ECB and inspect where equal ciphertext blocks occur. Compare with a mode that chains or varies the block input. In Sector Vault, use the sector/tamper experiment and record separately whether decryption produces bytes and whether an integrity check authenticates them. Explain those observations before exploring double encryption.',
    reflect: 'Distinguish hiding repeated structure, binding a block to its position and authenticating a message. Why does doubling a nominal key length by repeated encryption not automatically double the attacker’s work exponent?',
    limit: 'The connections cover selected modes and composition failures. CBC IV requirements differ from CTR nonce/counter requirements. XTS does not authenticate data. CFB, a complete triple-encryption trace and a DESX/key-whitening experiment are not established by these catalog entries. OFB and Feistel-security extensions belong to the prior batches and are excluded from new recommendations.'
  },
  {
    id: 'chapter-6', chapter: 6, kind: 'chapter', part: 'Public-key cryptography',
    bookTitle: 'Introduction to Public-Key Cryptography', coverage: 'direct',
    title: 'Connect the two key roles to the arithmetic and the identity assumption',
    sections: '§§6.1–6.2 and §6.3, particularly extended Euclid (§6.3.2) and Euler’s theorem (§6.3.4)',
    predict: 'If someone sends you a public key, does a successful encrypt/decrypt round trip establish who owns it? For an RSA teaching key, when can the chosen public exponent have a multiplicative inverse?',
    labs: [
      lab('locks-and-keys', 'Compare RSA-OAEP encryption with RSA-PSS signing, including a wrong key and an altered message.'),
      lab('rsa-educational', 'Inspect small-number key generation, phi, the private inverse and the visible square-and-multiply trace.')
    ],
    try: 'In Locks and Keys, encrypt to one generated key pair and try opening with a different pair; then sign and change the message before verification. In Educational RSA, select small distinct primes and record e, phi and d. Calculate e·d modulo phi yourself and compare with the key-generation check. Explain what would fail if e and phi had a common factor.',
    reflect: 'Which operations require the private key, and which can everyone perform? What additional evidence binds a mathematically valid public key to the intended person? Connect the modular inverse to the condition that makes it exist.',
    limit: 'Educational RSA already computes gcd, extended gcd and inverses, and already renders fast exponentiation. A quotient-and-Bézout trace of extended Euclid remains a teaching-depth gap. Successful arithmetic does not authenticate a public key. This entry does not replace the group, number-theory or security-level arguments in the reading.'
  },
  {
    id: 'chapter-7', chapter: 7, kind: 'chapter', part: 'Public-key cryptography',
    bookTitle: 'The RSA Cryptosystem', coverage: 'direct',
    title: 'Keep correctness, prime generation and secure encoding as separate questions',
    sections: '§§7.2–7.7 and §§7.8–7.9: arithmetic, fast exponentiation, CRT, primes, padding, encapsulation and attacks',
    predict: 'If raw RSA encryption always decrypts correctly, what information can repeated encryption of a short message still reveal? Would a probable-prime result alone settle the security of the resulting system?',
    labs: [
      lab('rsa-educational', 'Follow key generation and square-and-multiply with deliberately small integers.'),
      lab('rsa-forge', 'Compare textbook RSA with OAEP and PSS and inspect explicitly scoped failure demonstrations.'),
      lab('prime-witness', 'Separate a compositeness witness, a probable prime and a primality proof.'),
      lab('factor-forge', 'Connect small composite structure to factor-search methods and their measured work.')
    ],
    try: 'Use RSA Forge’s determinism experiment to compare repeated raw-RSA encryption with OAEP under one key. Record ciphertext equality separately from decryption success. Then choose a composite fixture in Prime Witness and compare the outcome for different test bases. Use Educational RSA’s per-bit exponentiation trace to explain why a short public exponent reduces work without providing padding.',
    reflect: 'Explain why the equation establishing RSA correctness does not imply secure encryption. What exactly does a witness prove, and what does a passing probable-prime test leave probabilistic?',
    limit: 'Tiny keys and restricted attacks are teaching targets, not evidence that correctly parameterized RSA-OAEP is broken. A browser round trip is not a proof of an encapsulation construction or a hardened CRT implementation. CRT faults, common-modulus attacks, parity oracles, Wiener and signature-parsing extensions are already in the earlier batches; none is a new recommendation here.'
  },
  {
    id: 'chapter-8', chapter: 8, kind: 'chapter', part: 'Public-key cryptography',
    bookTitle: 'Cryptosystems Based on the Discrete Logarithm Problem', coverage: 'direct',
    title: 'Use group structure to connect agreement, encryption and attack cost',
    sections: '§§8.1–8.5: DH, groups and subgroups, discrete logs, authentication and ElGamal encryption',
    predict: 'If an eavesdropper sees both Diffie–Hellman public values, which computation is easy for each participant and which missing value would the eavesdropper need? Does reaching a shared value identify the peer?',
    labs: [
      lab('agreeing-in-public', 'Run a real X25519 exchange as a practical counterpart to finite-field DH; compare shared bytes and the unproven peer identity.', 'modern'),
      lab('elgamal-plain', 'Follow fresh ephemeral exponents through encryption/decryption and observe algebraic malleability.'),
      lab('log-forge', 'Compare actual discrete-log searches on bounded teaching groups.')
    ],
    try: 'In Agreeing in Public, record the public values and the two locally computed shared values. In ElGamal Plain, keep the message fixed while re-encrypting with fresh randomness, then try the multiplicative transformation. In Log Forge, compare two supported search methods on the same small challenge and use the reported operation counts rather than a single wall-clock time.',
    reflect: 'Explain how the shared-value calculation supports ElGamal encryption while leaving message integrity and peer authentication as separate obligations. Why do group order and its factorization matter in addition to the size of the modulus?',
    limit: 'These labs support selected concrete group calculations; they do not prove DLP, CDH or DDH hardness or make those assumptions interchangeable. A small-group recovery is not an attack on every large group. The discrete-log, subgroup-leakage and static-DH-oracle work is already commissioned and excluded from the new gap list.'
  },
  {
    id: 'chapter-9', chapter: 9, kind: 'chapter', part: 'Public-key cryptography',
    bookTitle: 'Elliptic Curve Cryptosystems', coverage: 'direct',
    title: 'Move from the geometric picture to the exact finite-field group',
    sections: '§§9.1–9.4: point operations, the elliptic-curve discrete log, ECDH and security',
    predict: 'If P and −P have the same x-coordinate, what should their sum be? Should a finite-field group operation resemble drawing an ordinary straight line without modular wraparound?',
    labs: [
      lab('ec-point-arithmetic', 'Compare the real-coordinate picture with exact finite-field addition and a double-and-add trace.'),
      lab('curve-lens', 'Connect small-curve arithmetic to a toy ECDH exchange and to real curve operations.')
    ],
    try: 'In Point Arithmetic, switch to a finite field, choose a point and its inverse, then inspect their sum. Step a small scalar multiplication and check one doubling and one addition independently. In Curve Lens, follow the two toy ECDH lanes and identify why they reach the same point; then compare the format of the real exchange output.',
    reflect: 'Explain the role of the point at infinity and distinguish the field modulus from the subgroup order. What does the real-coordinate drawing help you understand, and which calculation must happen over the finite field?',
    limit: 'The geometric drawing is an intuition aid. Exhaustive searches use small teaching groups and do not measure security at production sizes. Raw ECDH output still needs appropriate derivation and authentication in a protocol. Curve-validation and twist-attack work is already in flight; neither these experiments nor a standard curve name establishes constant-time behavior.'
  },
  {
    id: 'chapter-10', chapter: 10, kind: 'chapter', part: 'Public-key cryptography',
    bookTitle: 'Digital Signatures', coverage: 'direct',
    title: 'Follow the verification relation and identify what a reused nonce exposes',
    sections: '§§10.1–10.3 and §10.5; finite-field DSA (§10.4) has a separate coverage gap.',
    predict: 'If two valid signatures use the same secret nonce, can a verifier’s public transcript reveal more than it was meant to? Does a valid signature establish the signer’s real-world identity by itself?',
    labs: [
      lab('rsa-forge', 'Use RSA-PSS sign/verify and contrast a secure encoding with raw RSA operations.'),
      lab('elgamal-plain', 'Its existing signature exhibit computes full-group ElGamal signing, verification and nonce-reuse recovery.'),
      lab('ecdsa-forge', 'Inspect ECDSA verification and the reused-nonce private-key recovery experiment.')
    ],
    try: 'Sign a short, self-written message and verify it before changing one character. Run the reused-nonce experiment in ECDSA Forge, record the two public transcripts and test the recovered-key result. Compare with ElGamal Plain’s signature exhibit, noting that encryption’s ephemeral exponent and signing’s nonce serve different equations even though both require care.',
    reflect: 'Explain why a repeated nonce creates an extra algebraic relation. Distinguish verification of signed bytes from trust in a named person, and explain why someone holding a shared MAC key has a different ability from a public signature verifier.',
    limit: 'ElGamal signatures are already implemented and are not a new gap. Finite-field DSA is a distinct algorithm with no catalogued experiment; ECDSA and ML-DSA do not fill that exact section. A successful toy attack or a deterministic-nonce option does not establish general implementation safety. Existing RSA signature-parsing and threshold-signature extensions remain outside the new recommendations.'
  },
  {
    id: 'chapter-11', chapter: 11, kind: 'chapter', part: 'Hashing and authentication',
    bookTitle: 'Hash Functions', coverage: 'direct',
    title: 'Choose the attacker’s objective before interpreting a hash experiment',
    sections: '§§11.1–11.4: security goals, construction choices and SHA-256. Section 11.5 has its own focus stop next.',
    predict: 'If you can choose both messages, should finding a collision require the same work as matching a digest selected in advance? Does an avalanche display distinguish those tasks?',
    labs: [
      lab('hash-zoo', 'Compare real SHA-256 and SHA3-256 digests, inspect padding and run the scoped SHA-256 length-extension experiment.'),
      lab('hash-hunt', 'Run generic searches against deliberately truncated outputs and inspect independently checked collision results.')
    ],
    try: 'Write down a collision objective and a fixed-target preimage objective. In Hash Hunt, run supported searches at a small displayed output width and record both successful results and the work budget. Verify the two full input messages differ. In Hash Zoo, flip one input bit, then run the length-extension example; state which observable belongs to diffusion and which demonstrates a construction-level failure.',
    reflect: 'Explain why two different messages agreeing on a truncated prefix do not constitute a full SHA-256 collision. Why does making a hash output appear well mixed fail to establish preimage or collision resistance?',
    limit: 'The chapter’s formal security arguments and a complete SHA-256 message-schedule/compression-round lesson remain reading work. Generic reduced-output searches do not break the full digest. Length extension is different from collision finding and does not break HMAC. Generic attacks, Davies–Meyer and multicollisions are already in the prior batches.'
  },
  {
    id: 'sha3-focus', chapter: 11, kind: 'focus', part: 'Hashing and authentication',
    bookTitle: 'SHA-3 — focused study within Hash Functions', coverage: 'direct',
    title: 'Observe the boundary between message framing, absorption and output',
    sections: '§11.5, especially §§11.5.1–11.5.4. This is a section focus, not chapter 12.',
    predict: 'For SHA3-256’s 136-byte rate, will messages of 135 and 136 ASCII bytes need the same number of padded input blocks? If you request a longer SHAKE output, will its shorter prefix change?',
    labs: [
      lab('kmac-gate', 'Stage 1 exposes SHA3-256 padding, the rate/capacity split and the state after each permutation; Stage 2 shows SHAKE squeezing. The keyed KMAC stages are additional study.')
    ],
    try: 'In KMAC Gate’s SHA3-256 stage, compare messages of 135 and 136 copies of one ASCII character, using the displayed byte count to check the inputs. Locate the suffix and final padding marker, then step the absorb blocks. In the SHAKE stage, keep the message fixed, request a longer output and use the prefix comparison to test your second prediction.',
    reflect: 'Explain why an exactly full rate block still needs framing and padding. Why are the capacity bits, which are not directly absorbed into or squeezed from, relevant to the construction? Why is extending SHAKE output a different operation from extending a message?',
    limit: 'This is substantial existing SHA-3 coverage, not a missing sponge lab. The state grid follows full Keccak-f permutations; it is not a complete lane-by-lane walkthrough of every theta, rho, pi, chi and iota step. SHAKE, cSHAKE and KMAC have distinct framing and output rules; the later keyed stages should not be described as ordinary SHA3-256 hashing.'
  },
  {
    id: 'chapter-12', chapter: 12, kind: 'chapter', part: 'Post-quantum cryptography',
    bookTitle: 'Post-Quantum Cryptography', coverage: 'direct',
    title: 'Compare three hard-problem families without treating every model as a standard',
    sections: '§§12.1–12.5: the quantum threat, lattice-based, code-based and hash-based constructions, and standardization',
    predict: 'Can adding more noise make a toy lattice encryption harder to inspect yet eventually prevent its intended recipient from decrypting? Does replacing a classical key exchange automatically authenticate the peer?',
    labs: [
      lab('lattice-gentle', 'Use small LWE and ring-arithmetic experiments with an explicit toy-versus-standard boundary.'),
      lab('what-is-pqc', 'Compare actual ML-KEM-768 and X25519 exchanges and the distinct roles of encapsulation and authentication.', 'modern'),
      lab('mceliece-gate', 'Explore genuine small Goppa-code arithmetic and Patterson decoding; submitted-size key displays are simulated, not a full Classic McEliece KEM.'),
      lab('lms-ledger', 'Follow one-time signing state, a Merkle-based many-time construction and the consequence of state reuse.'),
      lab('dilithium-seal', 'Explore a real ML-DSA signing path as a standards-era lattice-signature counterpart.', 'modern'),
      lab('sphincs-ledger', 'Explore real SLH-DSA alongside explicitly simplified WOTS+ and Merkle views.', 'modern')
    ],
    try: 'Use the seeded fresh toy experiment in Lattice Gentle. Increase the error setting and record where correct recovery stops; identify the decoded message and the lab’s noise-budget calculation separately. Then explore one code-based path in McEliece Gate and one state-use experiment in LMS Ledger. Finish with What Is PQC: compare the actual exchange artifacts and inspect what they establish about the peer’s identity.',
    reflect: 'For each family, name the hard problem or hash-based assumption and the job the construction performs. Explain why a toy noise threshold is not a security estimate for ML-KEM, and why a post-quantum KEM still needs an authenticated protocol around it.',
    limit: 'Small LWE/ring examples, Goppa-code experiments and shortened hash-signature views are teaching models. McEliece Gate does not implement the submitted KEM API. LMS Ledger teaches real LM-OTS and Merkle operations; its small HSS transcript is non-interoperable. What Is PQC, Dilithium Seal and SPHINCS+ Ledger have separate real ML-KEM, ML-DSA and SLH-DSA paths. The selected labs do not reproduce every derivation or parameter choice in the chapter. Legacy Kyber, Dilithium and SPHINCS+ names are not automatic conformance claims. The name LMS/XMSS is not evidence of an XMSS implementation.'
  },
  {
    id: 'chapter-13', chapter: 13, kind: 'chapter', part: 'Hashing and authentication',
    bookTitle: 'Message Authentication Codes (MACs)', coverage: 'direct',
    title: 'Identify which secret an attacker would need to create an accepted tag',
    sections: '§§13.1–13.3: HMAC, CBC-MAC, CMAC, CCM, GCM and GMAC',
    predict: 'If an attacker changes a message and can recompute its checksum, can the receiver still detect the forgery? What changes when generating a valid tag requires a shared secret?',
    labs: [
      lab('mac-race', 'Compare repaired CRC-32 with HMAC, inspect nested hashing and CMAC final-block handling, and distinguish bare GHASH from GCM authentication.'),
      lab('aes-modes', 'Connect authentication to encryption with actual GCM and CCM operations.')
    ],
    try: 'In MAC Race’s checksum-versus-MAC panel, alter a message and repair the checksum. Compare the HMAC receiver with the key-leak option disabled and enabled. Follow the HMAC inner/outer construction, then use AES Modes’ authenticated-encryption comparison to observe rejection after the protected data changes. Record who knew the authentication key in each experiment.',
    reflect: 'Why does a checksum fail against an intentional editor who can recompute it? Explain why a MAC provides neither confidentiality nor public third-party verification, and why GHASH alone is not an authenticated GCM tag.',
    limit: 'Raw CBC-MAC’s length restriction and CMAC repairs are already commissioned. The GHASH teaching view has explicit framing and masking limits. GMAC is not separately established by the catalog, and a bare GHASH calculation must not be labelled GMAC. Finite demonstrations do not replace tag-forgery bounds or prove constant-time verification.'
  },
  {
    id: 'chapter-14', chapter: 14, kind: 'chapter', part: 'Key management',
    bookTitle: 'Key Management', coverage: 'direct',
    title: 'Track the trust decision from key derivation to an accepted identity',
    sections: '§§14.2–14.6. The authors’ website calls this chapter “Key Establishment”; the published heading is “Key Management”.',
    predict: 'Will a valid mathematical signature make a certificate acceptable if its issuer is not trusted? Can two equal derived keys by themselves establish who supplied the original secret?',
    labs: [
      lab('kdf-chain', 'Separate password processing from derivation of context-bound keys from existing secret material.'),
      lab('kerberos', 'Use the KDC/ticket workflow as a related practical connection to symmetric key distribution.', 'modern'),
      lab('diffie-hellman-mitm', 'Show why unauthenticated key agreement admits an active intermediary.'),
      lab('pki-chain', 'Inspect certificate signatures, trust anchors and explicitly scoped local revocation scenarios.')
    ],
    try: 'In PKI Chain, compare a valid chain with the trust-root mismatch scenario, then use the CRL/OCSP controls to examine the local revocation result. In KDF Chain, hold the input secret and salt fixed while changing the HKDF info string. Relate the two observations: identify the check that binds a key to an identity and the input that separates derived-key uses. Use Kerberos to locate the KDC’s role in its ticket exchanges.',
    reflect: 'Explain how correct cryptographic calculations can coexist with a failed trust decision. Distinguish key derivation, key agreement, identity authentication and revocation, then identify which state each depends on.',
    limit: 'Kerberos models a practical KDC protocol. Its separate Lowe-attack lesson concerns the public-key Needham–Schroeder protocol and must not be presented as the book’s symmetric-key Needham–Schroeder construction. PKI Chain implements a defined validation subset with local revocation fixtures, not an operating public CA ecosystem. TLS resumption, authenticated-exchange attacks and protocol-composition extensions are already in the earlier batches.'
  }
];
