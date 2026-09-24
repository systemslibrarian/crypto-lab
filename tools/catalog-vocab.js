/*
 * catalog-vocab.js — the algorithm, attack and standards vocabulary the catalog
 * is indexed by.
 *
 * Not runnable. Required by catalog-evidence.js and catalog-sync.js.
 *
 * WHY A DECLARED VOCABULARY
 *
 * The cards carry 625 distinct chips across 207 labs — almost one private
 * vocabulary per lab. "AES-GCM", "GCM mode" and "AEAD" are three chips and one
 * algorithm; "Cache Timing" and "Timing Oracle" are two chips and one attack. A
 * reverse index built on chips would answer "which labs implement AES?" with
 * whichever labs happened to spell it the same way, which is the shape of every
 * failure this repository keeps re-finding: an answer that looks complete because
 * the question was narrowed to what the data could answer.
 *
 * So the vocabulary is DECLARED here and the labs are searched for it. A term
 * missing from this file is invisible to the index, which is a real limit — and
 * catalog-evidence reports chips that match no term precisely so the gap is
 * visible rather than silent. Adding a term is the intended way to grow it.
 *
 * `std` is the standard that DEFINES the algorithm, not one that merely permits
 * it. It is a property of the algorithm and travels with it, so no card states a
 * standards body by hand and no card can disagree with another about which body
 * owns SHA-256.
 */
'use strict';

/* kind: what the term IS. Only `algorithm` terms can be implemented; `attack`
   and `technique` terms are indexed but never claimed as an implementation. */
/* A term with no word boundary matches inside longer words, and the longer word
   is often a different concept entirely. `shake` without \b matches HANDshake,
   which put SHAKE — a NIST XOF — on three labs that implement no such thing, on
   the evidence of functions called `initializeHandshake` and `resetHandshake`.
   Prefer \b on every term short enough to live inside another word. */
const ALGORITHMS = [
  // --- symmetric: ciphers and modes ---
  { name: 'AES', kind: 'algorithm', family: 'block cipher', re: /\baes\b|advanced[-_ ]encryption/i, std: 'NIST:FIPS 197' },
  { name: 'AES-GCM', kind: 'algorithm', family: 'AEAD', re: /aes[-_ ]?gcm/i, std: 'NIST:SP 800-38D' },
  { name: 'AES-CBC', kind: 'algorithm', family: 'block cipher mode', re: /aes[-_ ]?cbc/i, std: 'NIST:SP 800-38A' },
  { name: 'AES-CTR', kind: 'algorithm', family: 'block cipher mode', re: /aes[-_ ]?ctr/i, std: 'NIST:SP 800-38A' },
  { name: 'AES-ECB', kind: 'algorithm', family: 'block cipher mode', re: /aes[-_ ]?ecb/i, std: 'NIST:SP 800-38A' },
  { name: 'AES-CFB', kind: 'algorithm', family: 'block cipher mode', re: /aes[-_ ]?cfb/i, std: 'NIST:SP 800-38A' },
  { name: 'AES-OFB', kind: 'algorithm', family: 'block cipher mode', re: /aes[-_ ]?ofb/i, std: 'NIST:SP 800-38A' },
  { name: 'AES-XTS', kind: 'algorithm', family: 'block cipher mode', re: /\bxts\b/i, std: 'NIST:SP 800-38E' },
  { name: 'AES-KW', kind: 'algorithm', family: 'key wrap', re: /aes[-_ ]?kw\b|keywrap/i, std: 'NIST:SP 800-38F' },
  { name: 'AES-SIV', kind: 'algorithm', family: 'AEAD', re: /\bsiv\b/i, std: 'IETF:RFC 5297' },
  { name: 'AES-CCM', kind: 'algorithm', family: 'AEAD', re: /\bccm\b/i, std: 'NIST:SP 800-38C' },
  { name: 'ChaCha20', kind: 'algorithm', family: 'stream cipher', re: /chacha20?/i, std: 'IETF:RFC 8439' },
  { name: 'Poly1305', kind: 'algorithm', family: 'MAC', re: /poly1305/i, std: 'IETF:RFC 8439' },
  { name: 'Salsa20', kind: 'algorithm', family: 'stream cipher', re: /salsa20/i, std: null },
  { name: 'XChaCha20-Poly1305', kind: 'algorithm', family: 'AEAD', re: /xchacha20/i, std: null },
  { name: 'Ascon', kind: 'algorithm', family: 'AEAD', re: /\bascon\b/i, std: 'NIST:SP 800-232' },
  { name: 'SNOW 3G', kind: 'algorithm', family: 'stream cipher', re: /snow[-_ ]?3g/i, std: 'ETSI:SAGE SNOW 3G' },
  { name: 'SNOW 2.0', kind: 'algorithm', family: 'stream cipher', re: /snow[-_ ]?2(\.0)?\b/i, std: null },
  { name: 'RC4', kind: 'algorithm', family: 'stream cipher', re: /\brc4\b/i, std: null },
  { name: 'DES', kind: 'algorithm', family: 'block cipher', re: /\bdes\b(?!ign|crip|tin)/i, std: 'NIST:FIPS 46-3 (withdrawn)' },
  { name: '3DES', kind: 'algorithm', family: 'block cipher', re: /3des|triple[-_ ]?des/i, std: 'NIST:SP 800-67' },
  { name: 'Blowfish', kind: 'algorithm', family: 'block cipher', re: /blowfish/i, std: null },
  { name: 'Twofish', kind: 'algorithm', family: 'block cipher', re: /twofish/i, std: null },
  { name: 'Serpent', kind: 'algorithm', family: 'block cipher', re: /\bserpent\b/i, std: null },
  { name: 'Speck', kind: 'algorithm', family: 'block cipher', re: /\bspeck\b/i, std: null },
  { name: 'Simon', kind: 'algorithm', family: 'block cipher', re: /\bsimon\b(?!\s+singh)/i, std: null },
  { name: 'PRESENT', kind: 'algorithm', family: 'block cipher', re: /\bpresent[-_ ]?(?:80|128|cipher)\b/i, std: 'ISO:ISO/IEC 29192-2' },

  // --- hashes and MACs ---
  { name: 'SHA-1', kind: 'algorithm', family: 'hash', re: /sha[-_ ]?1\b/i, std: 'NIST:FIPS 180-4 (deprecated)' },
  { name: 'SHA-256', kind: 'algorithm', family: 'hash', re: /sha[-_ ]?256/i, std: 'NIST:FIPS 180-4' },
  { name: 'SHA-384', kind: 'algorithm', family: 'hash', re: /sha[-_ ]?384/i, std: 'NIST:FIPS 180-4' },
  { name: 'SHA-512', kind: 'algorithm', family: 'hash', re: /sha[-_ ]?512/i, std: 'NIST:FIPS 180-4' },
  { name: 'SHA-3', kind: 'algorithm', family: 'hash', re: /sha[-_ ]?3\b|sha3[-_]?(?:256|512)/i, std: 'NIST:FIPS 202' },
  { name: 'SHAKE', kind: 'algorithm', family: 'XOF', re: /\bshake(?:[-_]?(?:128|256))?\b/i, std: 'NIST:FIPS 202' },
  { name: 'Keccak', kind: 'algorithm', family: 'permutation', re: /keccak/i, std: 'NIST:FIPS 202' },
  { name: 'BLAKE2', kind: 'algorithm', family: 'hash', re: /blake2[bs]?/i, std: 'IETF:RFC 7693' },
  { name: 'BLAKE3', kind: 'algorithm', family: 'hash', re: /blake3/i, std: null },
  { name: 'MD5', kind: 'algorithm', family: 'hash', re: /\bmd5\b/i, std: 'IETF:RFC 1321 (broken)' },
  { name: 'Poseidon', kind: 'algorithm', family: 'hash', re: /poseidon/i, std: null },
  { name: 'HMAC', kind: 'algorithm', family: 'MAC', re: /\bhmac\b/i, std: 'IETF:RFC 2104' },
  { name: 'CMAC', kind: 'algorithm', family: 'MAC', re: /\bcmac\b/i, std: 'NIST:SP 800-38B' },
  { name: 'KMAC', kind: 'algorithm', family: 'MAC', re: /\bkmac\b/i, std: 'NIST:SP 800-185' },

  // --- KDFs and password hashing ---
  { name: 'HKDF', kind: 'algorithm', family: 'KDF', re: /\bhkdf\b/i, std: 'IETF:RFC 5869' },
  { name: 'PBKDF2', kind: 'algorithm', family: 'password KDF', re: /pbkdf2/i, std: 'IETF:RFC 8018' },
  { name: 'scrypt', kind: 'algorithm', family: 'password KDF', re: /\bscrypt\b/i, std: 'IETF:RFC 7914' },
  { name: 'Argon2', kind: 'algorithm', family: 'password KDF', re: /argon2(?:id|i|d)?/i, std: 'IETF:RFC 9106' },
  { name: 'bcrypt', kind: 'algorithm', family: 'password KDF', re: /\bbcrypt\b/i, std: null },
  { name: 'Balloon', kind: 'algorithm', family: 'password KDF', re: /balloon[-_ ]?hash/i, std: null },

  // --- classical public key ---
  { name: 'RSA', kind: 'algorithm', family: 'public key', re: /\brsa\b/i, std: 'IETF:RFC 8017' },
  { name: 'RSA-OAEP', kind: 'algorithm', family: 'public-key encryption', re: /oaep/i, std: 'IETF:RFC 8017' },
  { name: 'RSA-PSS', kind: 'algorithm', family: 'signature', re: /rsa[-_ ]?pss|\bpss\b/i, std: 'IETF:RFC 8017' },
  { name: 'DSA', kind: 'algorithm', family: 'signature', re: /(?<![A-Za-z][-_ ])(?<![A-Za-z])\bdsa\b/i, std: 'NIST:FIPS 186-4' },
  { name: 'ECDSA', kind: 'algorithm', family: 'signature', re: /ecdsa/i, std: 'NIST:FIPS 186-5' },
  { name: 'EdDSA', kind: 'algorithm', family: 'signature', re: /eddsa/i, std: 'IETF:RFC 8032' },
  { name: 'Ed25519', kind: 'algorithm', family: 'signature', re: /ed25519/i, alias: 'EdDSA', std: 'IETF:RFC 8032' },
  { name: 'Ed448', kind: 'algorithm', family: 'signature', re: /ed448/i, alias: 'EdDSA', std: 'IETF:RFC 8032' },
  { name: 'X25519', kind: 'algorithm', family: 'key exchange', re: /x25519|curve25519/i, std: 'IETF:RFC 7748' },
  { name: 'X448', kind: 'algorithm', family: 'key exchange', re: /x448/i, std: 'IETF:RFC 7748' },
  { name: 'P-256', kind: 'algorithm', family: 'elliptic curve', re: /\bp-?256\b|secp256r1|prime256v1/i, std: 'NIST:SP 800-186' },
  { name: 'P-384', kind: 'algorithm', family: 'elliptic curve', re: /\bp-?384\b|secp384r1/i, std: 'NIST:SP 800-186' },
  { name: 'secp256k1', kind: 'algorithm', family: 'elliptic curve', re: /secp256k1/i, std: 'SECG:SEC 2' },
  { name: 'BLS12-381', kind: 'algorithm', family: 'pairing curve', re: /bls12[-_]?381/i, std: null },
  { name: 'BLS signatures', kind: 'algorithm', family: 'signature', re: /\bbls\b(?![-_]?12)/i, std: 'IETF:draft-irtf-cfrg-bls-signature' },
  { name: 'Schnorr', kind: 'algorithm', family: 'signature', re: /schnorr/i, std: null },
  { name: 'ElGamal', kind: 'algorithm', family: 'public-key encryption', re: /el[-_ ]?gamal/i, std: null },
  { name: 'Paillier', kind: 'algorithm', family: 'homomorphic encryption', re: /paillier/i, std: null },
  { name: 'Diffie-Hellman', kind: 'algorithm', family: 'key exchange', re: /diffie[-_ ]?hellman|\bdh\b/i, std: 'IETF:RFC 2631' },
  { name: 'ECDH', kind: 'algorithm', family: 'key exchange', re: /ecdh/i, std: 'NIST:SP 800-56A' },

  // --- post-quantum ---
  { name: 'ML-KEM', kind: 'algorithm', family: 'PQ KEM', re: /ml[-_ ]?kem/i, std: 'NIST:FIPS 203' },
  { name: 'Kyber', kind: 'algorithm', family: 'PQ KEM', re: /\bkyber\b/i, alias: 'ML-KEM', std: 'NIST:FIPS 203 (as ML-KEM)' },
  { name: 'ML-DSA', kind: 'algorithm', family: 'PQ signature', re: /ml[-_ ]?dsa/i, std: 'NIST:FIPS 204' },
  { name: 'Dilithium', kind: 'algorithm', family: 'PQ signature', re: /dilithium/i, alias: 'ML-DSA', std: 'NIST:FIPS 204 (as ML-DSA)' },
  { name: 'SLH-DSA', kind: 'algorithm', family: 'PQ signature', re: /slh[-_ ]?dsa/i, std: 'NIST:FIPS 205' },
  { name: 'SPHINCS+', kind: 'algorithm', family: 'PQ signature', re: /sphincs/i, alias: 'SLH-DSA', std: 'NIST:FIPS 205 (as SLH-DSA)' },
  { name: 'Falcon', kind: 'algorithm', family: 'PQ signature', re: /\bfalcon\b/i, alias: 'FN-DSA', std: 'NIST:FIPS 206 draft (as FN-DSA)' },
  { name: 'HQC', kind: 'algorithm', family: 'PQ KEM', re: /\bhqc\b/i, std: 'NIST:selected 2025, FIPS pending' },
  { name: 'Classic McEliece', kind: 'algorithm', family: 'PQ KEM', re: /mceliece/i, std: 'ISO:ISO/IEC 18033-2 amendment' },
  { name: 'BIKE', kind: 'algorithm', family: 'PQ KEM', re: /\bbike\b/i, std: null },
  { name: 'NTRU', kind: 'algorithm', family: 'PQ KEM', re: /\bntru\b/i, std: null },
  { name: 'FrodoKEM', kind: 'algorithm', family: 'PQ KEM', re: /frodo/i, std: 'ISO:ISO/IEC 18033-2 amendment' },
  { name: 'SIKE', kind: 'algorithm', family: 'PQ KEM', re: /\bsike\b|\bsidh\b/i, std: 'broken 2022' },
  { name: 'XMSS', kind: 'algorithm', family: 'hash-based signature', re: /\bxmss\b/i, std: 'IETF:RFC 8391' },
  { name: 'LMS', kind: 'algorithm', family: 'hash-based signature', re: /\blms\b/i, std: 'IETF:RFC 8554' },
  { name: 'Lamport', kind: 'algorithm', family: 'hash-based signature', re: /lamport/i, std: null },
  { name: 'Winternitz', kind: 'algorithm', family: 'hash-based signature', re: /winternitz|\bwots\b/i, std: null },
  { name: 'LWE', kind: 'algorithm', family: 'lattice problem', re: /\blwe\b|learning[-_ ]with[-_ ]errors/i, std: null },
  { name: 'Ring-LWE', kind: 'algorithm', family: 'lattice problem', re: /ring[-_ ]?lwe|\brlwe\b/i, std: null },
  { name: 'NTT', kind: 'algorithm', family: 'lattice arithmetic', re: /\bntt\b|number[-_ ]theoretic[-_ ]transform/i, std: null },

  // --- codes, secret sharing, commitments ---
  { name: 'Reed-Solomon', kind: 'algorithm', family: 'error-correcting code', re: /reed[-_ ]?solomon/i, std: null },
  { name: 'Reed-Muller', kind: 'algorithm', family: 'error-correcting code', re: /reed[-_ ]?muller/i, std: null },
  { name: 'BCH', kind: 'algorithm', family: 'error-correcting code', re: /\bbch\b/i, std: null },
  { name: 'Hamming code', kind: 'algorithm', family: 'error-correcting code', re: /hamming[-_ ]?code/i, std: null },
  { name: 'Shamir secret sharing', kind: 'algorithm', family: 'secret sharing', re: /shamir/i, std: null },
  { name: 'Feldman VSS', kind: 'algorithm', family: 'secret sharing', re: /feldman/i, std: null },
  { name: 'Pedersen commitment', kind: 'algorithm', family: 'commitment', re: /pedersen/i, std: null },
  { name: 'Merkle tree', kind: 'algorithm', family: 'authenticated data structure', re: /merkle(?![-_ ]?damg)/i, std: null },
  { name: 'Bloom filter', kind: 'algorithm', family: 'probabilistic structure', re: /bloom[-_ ]?filter/i, std: null },

  // --- zero knowledge ---
  { name: 'Groth16', kind: 'algorithm', family: 'zk-SNARK', re: /groth16/i, std: null },
  { name: 'PLONK', kind: 'algorithm', family: 'zk-SNARK', re: /\bplonk\b/i, std: null },
  { name: 'Halo2', kind: 'algorithm', family: 'zk-SNARK', re: /halo2/i, std: null },
  { name: 'Bulletproofs', kind: 'algorithm', family: 'range proof', re: /bulletproof/i, std: null },
  { name: 'STARK', kind: 'algorithm', family: 'zk proof system', re: /\bstark\b/i, std: null },
  { name: 'Fiat-Shamir', kind: 'algorithm', family: 'proof transform', re: /fiat[-_ ]?shamir/i, std: null },
  { name: 'Sigma protocol', kind: 'algorithm', family: 'proof system', re: /sigma[-_ ]?protocol/i, std: null },
  { name: 'Schnorr identification', kind: 'algorithm', family: 'proof system', re: /schnorr[-_ ]?(?:id|identification|proof)/i, std: null },

  // --- MPC, PIR, FHE ---
  { name: 'Garbled circuits', kind: 'algorithm', family: 'MPC', re: /garbled[-_ ]?circuit|(?<!dolev[-_ ])\byao\b/i, std: null },
  { name: 'Oblivious transfer', kind: 'algorithm', family: 'MPC', re: /oblivious[-_ ]?transfer/i, pathRe: /(^|\/)ot(?:[-_./]|$)/i, std: null },
  { name: 'Private set intersection', kind: 'algorithm', family: 'MPC', re: /\bpsi\b|private[-_ ]set[-_ ]intersection/i, std: null },
  { name: 'BGV', kind: 'algorithm', family: 'FHE', re: /\bbgv\b/i, std: null },
  { name: 'BFV', kind: 'algorithm', family: 'FHE', re: /\bbfv\b/i, std: null },
  { name: 'CKKS', kind: 'algorithm', family: 'FHE', re: /\bckks\b/i, std: null },
  { name: 'TFHE', kind: 'algorithm', family: 'FHE', re: /\btfhe\b/i, std: null },

  // --- protocols and deployed systems ---
  { name: 'TLS 1.3', kind: 'algorithm', family: 'protocol', re: /tls[-_ ]?1\.3/i, structures: ['ClientHello', 'ServerHello', 'EncryptedExtensions', 'HelloRetryRequest', 'CertificateVerify', 'NewSessionTicket'], std: 'IETF:RFC 8446' },
  { name: 'Noise protocol', kind: 'algorithm', family: 'protocol', re: /noise[-_ ]?(?:protocol|xx|ik|nk|handshake)/i, structures: ['MixHash', 'MixKey'], std: null },
  { name: 'X3DH', kind: 'algorithm', family: 'protocol', re: /x3dh/i, std: null },
  { name: 'PQXDH', kind: 'algorithm', family: 'protocol', re: /pqxdh/i, std: null },
  { name: 'Double Ratchet', kind: 'algorithm', family: 'protocol', re: /double[-_ ]?ratchet/i, std: null },
  { name: 'MLS', kind: 'algorithm', family: 'protocol', re: /\bmls\b(?![-_ ]?(?:results?|list))/i, structures: ['KeyPackage', 'TreeKEM', 'RatchetTree'], std: 'IETF:RFC 9420' },
  { name: 'Kerberos', kind: 'algorithm', family: 'protocol', re: /kerberos/i, structures: ['AsReq', 'AsRep', 'TgsReq', 'TgsRep', 'ApReq'], std: 'IETF:RFC 4120' },
  { name: 'WebAuthn', kind: 'algorithm', family: 'protocol', re: /webauthn/i, structures: ['AttestationObject', 'AuthenticatorData', 'ClientDataJson'], std: 'W3C:WebAuthn Level 3' },
  { name: 'OPAQUE', kind: 'algorithm', family: 'PAKE', re: /\bopaque\b/i, structures: ['RegistrationRequest', 'RegistrationResponse', 'CredentialResponse'], std: 'IETF:draft-irtf-cfrg-opaque' },
  { name: 'SRP', kind: 'algorithm', family: 'PAKE', re: /\bsrp\b/i, std: 'IETF:RFC 2945' },
  { name: 'SPAKE2', kind: 'algorithm', family: 'PAKE', re: /spake2/i, std: 'IETF:RFC 9382' },
  { name: 'OPRF', kind: 'algorithm', family: 'oblivious PRF', re: /\boprf\b|voprf/i, std: 'IETF:RFC 9497' },
  { name: 'Privacy Pass', kind: 'algorithm', family: 'protocol', re: /privacy[-_ ]?pass/i, std: 'IETF:RFC 9576' },
  { name: 'TOTP', kind: 'algorithm', family: 'one-time password', re: /\btotp\b/i, std: 'IETF:RFC 6238' },
  { name: 'HOTP', kind: 'algorithm', family: 'one-time password', re: /\bhotp\b/i, std: 'IETF:RFC 4226' },
  { name: 'One-time pad', kind: 'algorithm', family: 'cipher', re: /one[-_ ]?time[-_ ]?pad|\bvernam\b/i, pathRe: /(^|\/)(?:vernam|one-?time-?pad)(?:[-_./]|$)|(^|\/)otp(?:[-_./]|$)(?![\s\S]*[ht]otp)/i, std: null },
  { name: 'BB84', kind: 'algorithm', family: 'QKD', re: /bb84/i, std: null },
  { name: 'E91', kind: 'algorithm', family: 'QKD', re: /\be91\b|ekert/i, structures: ['Chsh', 'BellTest'], std: null },
  { name: "Shor's algorithm", kind: 'algorithm', family: 'quantum algorithm', re: /\bshor(?:'s)?\b/i, std: null },
  { name: "Grover's algorithm", kind: 'algorithm', family: 'quantum algorithm', re: /\bgrover(?:'s)?\b/i, std: null },

  // --- historical ---
  { name: 'Caesar cipher', kind: 'algorithm', family: 'historical cipher', re: /caesar/i, std: null },
  { name: 'Vigenere cipher', kind: 'algorithm', family: 'historical cipher', re: /vigen[eè]re/i, std: null },
  { name: 'Playfair cipher', kind: 'algorithm', family: 'historical cipher', re: /playfair/i, std: null },
  { name: 'Hill cipher', kind: 'algorithm', family: 'historical cipher', re: /hill[-_ ]?cipher/i, std: null },
  { name: 'Enigma', kind: 'algorithm', family: 'historical cipher', re: /enigma/i, std: null },
  { name: 'ADFGVX', kind: 'algorithm', family: 'historical cipher', re: /adfgvx/i, std: null },
  { name: 'Rail fence cipher', kind: 'algorithm', family: 'historical cipher', re: /rail[-_ ]?fence/i, std: null },
  { name: 'Substitution cipher', kind: 'algorithm', family: 'historical cipher', re: /substitution[-_ ]?cipher/i, std: null },

  /* SM2/SM3/SM4 are two letters and a digit, which is also what a local variable
     in a chart looks like. `const sm2 = 1 + (rawM2 / maxRaw) * 3.2` in
     crypto-lab-commit-gate's visualisation was read as the Chinese signature
     standard. They need crypto context or the file path, never the bare token. */
  // --- national and regional standards ---
  { name: 'SM2', kind: 'algorithm', family: 'public key', re: /sm2[-_ ]?(?:sign|verify|encrypt|decrypt|keypair|curve|point|cipher)|(?:sign|verify|encrypt|decrypt)[-_ ]?sm2\b|\bsm-?crypto\b/i, pathRe: /(^|\/)sm2(?:[-_./]|$)/i, std: 'ISO:ISO/IEC 14888-3 / GB/T 32918' },
  { name: 'SM3', kind: 'algorithm', family: 'hash', re: /sm3[-_ ]?(?:hash|digest|compress|init|update|block)|\bsm-?crypto\b/i, pathRe: /(^|\/)sm3(?:[-_./]|$)/i, std: 'ISO:ISO/IEC 10118-3 / GB/T 32905' },
  { name: 'SM4', kind: 'algorithm', family: 'block cipher', re: /sm4[-_ ]?(?:encrypt|decrypt|cipher|round|sbox|key|trace|block)|(?:encrypt|decrypt)[-_ ]?sm4\b/i, pathRe: /(^|\/)sm4(?:[-_./]|$)/i, std: 'ISO:ISO/IEC 18033-3 / GB/T 32907' },
  { name: 'MISTY1', kind: 'algorithm', family: 'block cipher', re: /\bmisty1?\b/i, std: 'ISO:ISO/IEC 18033-3' },
  { name: 'KASUMI', kind: 'algorithm', family: 'block cipher', re: /\bkasumi\b/i, std: 'ETSI:SAGE KASUMI' },
  { name: 'Camellia', kind: 'algorithm', family: 'block cipher', re: /\bcamellia\b/i, std: 'IETF:RFC 3713' },
  { name: 'ARIA', kind: 'algorithm', family: 'block cipher', re: /aria[-_ ]?(?:cipher|128|192|256|encrypt|decrypt|sbox|round|key)/i, pathRe: /(^|\/)aria(?:[-_./]|$)/i, std: 'IETF:RFC 5794' },
  { name: 'SEED', kind: 'algorithm', family: 'block cipher', re: /seed[-_ ]?(?:cipher|block|encrypt|decrypt|round|sbox)|\bkisa[-_ ]?seed\b/i, std: 'IETF:RFC 4269' },
  { name: 'LEA', kind: 'algorithm', family: 'block cipher', re: /\blea[-_ ]?(?:cipher|128|192|256|round|encrypt)\b/i, std: 'ISO:ISO/IEC 29192-2' },
  { name: 'HIGHT', kind: 'algorithm', family: 'block cipher', re: /\bhight\b/i, std: 'ISO:ISO/IEC 18033-3' },
  { name: 'EC-KCDSA', kind: 'algorithm', family: 'signature', re: /kcdsa/i, std: 'ISO:ISO/IEC 14888-3' },

  // --- lattice and isogeny constructions ---
  { name: 'GGH', kind: 'algorithm', family: 'lattice cryptosystem', re: /\bggh\b/i, std: null },
  { name: 'Isogeny walk', kind: 'algorithm', family: 'isogeny', re: /isogen/i, std: null },
  { name: 'CSIDH', kind: 'algorithm', family: 'isogeny', re: /\bcsidh\b/i, std: null },
  { name: 'EC point arithmetic', kind: 'algorithm', family: 'elliptic curve', re: /point[-_ ]?(?:add|double|mul|order)|scalar[-_ ]?mul|is[-_ ]?on[-_ ]?curve|double[-_ ]?and[-_ ]?add/i, std: null },
  { name: 'Montgomery ladder', kind: 'algorithm', family: 'elliptic curve', re: /montgomery[-_ ]?ladder/i, std: null },

  // --- found by `catalog-evidence.js gaps`: chips naming algorithms the vocabulary lacked ---
  { name: 'ristretto255', kind: 'algorithm', family: 'elliptic curve', re: /ristretto/i, std: 'IETF:RFC 9496' },
  { name: 'Streebog', kind: 'algorithm', family: 'hash', re: /streebog|gost[-_ ]?r?[-_ ]?34\.11/i, std: 'ISO:GOST R 34.11-2012' },
  { name: 'Kuznyechik', kind: 'algorithm', family: 'block cipher', re: /kuznyechik|gost[-_ ]?r?[-_ ]?34\.12/i, std: 'ISO:GOST R 34.12-2015' },
  { name: 'Magma', kind: 'algorithm', family: 'block cipher', re: /\bmagma\b/i, std: 'ISO:GOST R 34.12-2015' },
  { name: 'FF1', kind: 'algorithm', family: 'format-preserving encryption', re: /\bff1\b|format[-_ ]?preserving/i, std: 'NIST:SP 800-38G' },
  { name: 'FRI', kind: 'algorithm', family: 'proof system', re: /\bfri\b(?![-_ ]?(?:day|end))/i, std: null },
  { name: 'Private information retrieval', kind: 'algorithm', family: 'PIR', re: /\bpir\b|private[-_ ]?information[-_ ]?retrieval/i, std: null },
  { name: 'CGL hash', kind: 'algorithm', family: 'isogeny', re: /\bcgl\b/i, std: null },

  // --- closing the vocabulary miss class, found by `catalog-evidence.js gaps`
  //     and by the ground-truth fixture's outOfVocabulary lists ---
  { name: 'AEGIS-256', kind: 'algorithm', family: 'AEAD', re: /\baegis[-_ ]?(?:128|256)?\b/i, std: 'IETF:draft-irtf-cfrg-aegis-aead' },
  { name: 'HPKE', kind: 'algorithm', family: 'hybrid public-key encryption', re: /\bhpke\b/i, std: 'IETF:RFC 9180' },
  { name: 'DHKEM', kind: 'algorithm', family: 'KEM', re: /\bdhkem\b/i, std: 'IETF:RFC 9180' },
  { name: 'J-PAKE', kind: 'algorithm', family: 'PAKE', re: /\bj[-_ ]?pake\b/i, std: 'IETF:RFC 8236' },
  { name: 'CPace', kind: 'algorithm', family: 'PAKE', re: /\bcpace\b/i, std: 'IETF:RFC 9383' },
  { name: 'Dragonfly', kind: 'algorithm', family: 'PAKE', re: /\bdragonfly\b|\bsae\b/i, std: 'IETF:RFC 7664' },
  { name: 'Boneh-Franklin IBE', kind: 'algorithm', family: 'identity-based encryption', re: /boneh[-_ ]?franklin|basic[-_ ]?ident|\bibe\b/i, std: 'IETF:RFC 5091' },
  { name: 'Pairing', kind: 'algorithm', family: 'pairing', re: /\b(?:weil|tate|ate)[-_ ]?pairing|\bpairing\b/i, std: null },
  { name: 'Fujisaki-Okamoto transform', kind: 'algorithm', family: 'KEM transform', re: /fujisaki|\bfo[-_ ]?transform\b/i, std: null },
  { name: 'GHASH', kind: 'algorithm', family: 'MAC', re: /\bghash\b/i, std: 'NIST:SP 800-38D' },
  { name: 'Hash-to-curve', kind: 'algorithm', family: 'elliptic curve', re: /hash[-_ ]?to[-_ ]?curve|hashto(?:curve|point)/i, std: 'IETF:RFC 9380' },
  { name: 'HMAC-DRBG', kind: 'algorithm', family: 'DRBG', re: /hmac[-_ ]?drbg/i, std: 'NIST:SP 800-90A' },
  { name: 'CTR-DRBG', kind: 'algorithm', family: 'DRBG', re: /ctr[-_ ]?drbg/i, std: 'NIST:SP 800-90A' },
  { name: 'Encrypted Client Hello', kind: 'algorithm', family: 'protocol', re: /encrypted[-_ ]?client[-_ ]?hello|\bech\b/i, structures: ['EchConfig', 'ClientHelloInner', 'ClientHelloOuter', 'EchOuterExtensions'], std: 'IETF:draft-ietf-tls-esni' },
  { name: 'Babai rounding', kind: 'algorithm', family: 'lattice algorithm', re: /babai/i, std: null },
  { name: 'Format-transforming encryption', kind: 'algorithm', family: 'steganography', re: /format[-_ ]?transforming|\bfte\b/i, std: null },
  { name: 'Repetition code', kind: 'algorithm', family: 'error-correcting code', re: /repetition[-_ ]?code/i, std: null },
  { name: 'KZG commitment', kind: 'algorithm', family: 'polynomial commitment', re: /\bkzg\b/i, std: null },
];


/* Attacks are indexed but NEVER claimed as implementations: a lab demonstrates a
   padding oracle, it does not "implement" one in the sense the reverse index
   means. They are matched in prose as well as code for that reason. */
const ATTACKS = [
  { name: 'Padding oracle', re: /padding[-_ ]?oracle/i },
  { name: 'Timing side-channel', re: /timing[-_ ]?(?:attack|oracle|leak|side[-_ ]?channel)/i },
  { name: 'Cache timing', re: /cache[-_ ]?timing|flush\+reload|prime\+probe/i },
  { name: 'Power analysis', re: /\bdpa\b|\bspa\b|power[-_ ]?analysis/i },
  { name: 'Fault injection', re: /fault[-_ ]?(?:injection|attack)|rowhammer/i },
  { name: 'Nonce reuse', re: /nonce[-_ ]?(?:reuse|collision|misuse)/i },
  { name: 'IV reuse', re: /iv[-_ ]?reuse/i },
  { name: 'Length extension', re: /length[-_ ]?extension/i },
  { name: 'Collision attack', re: /collision[-_ ]?attack|chosen[-_ ]?prefix/i },
  { name: 'Birthday bound', re: /birthday[-_ ]?(?:bound|attack|paradox)/i },
  { name: 'Chosen-ciphertext attack', re: /chosen[-_ ]?ciphertext|\bcca\b/i },
  { name: 'Chosen-plaintext attack', re: /chosen[-_ ]?plaintext|\bcpa\b/i },
  { name: 'Downgrade attack', re: /downgrade[-_ ]?attack|version[-_ ]?rollback/i },
  { name: 'Replay attack', re: /replay[-_ ]?attack/i },
  { name: 'Man-in-the-middle', re: /man[-_ ]in[-_ ]the[-_ ]middle|\bmitm\b/i },
  { name: 'Key recovery', re: /key[-_ ]?recovery/i },
  { name: 'Frequency analysis', re: /frequency[-_ ]?analysis/i },
  { name: 'Known-plaintext attack', re: /known[-_ ]?plaintext/i },
  { name: 'Brute force', re: /brute[-_ ]?force/i },
  { name: 'Differential cryptanalysis', re: /differential[-_ ]?cryptanalysis/i },
  { name: 'Linear cryptanalysis', re: /linear[-_ ]?cryptanalysis/i },
  { name: 'Lattice reduction', re: /\blll\b|lattice[-_ ]?reduction|\bbkz\b/i },
  { name: 'Factoring', re: /factoring|factorisation|factorization/i },
  { name: 'Discrete log', re: /discrete[-_ ]?log|pollard[-_ ]?rho|baby[-_ ]?step/i },
  { name: 'Invalid curve attack', re: /invalid[-_ ]?curve/i },
  { name: 'Signature malleability', re: /malleab/i },
  { name: 'Hash-flooding', re: /hash[-_ ]?flood/i },
  { name: 'Side-channel (unspecified)', re: /side[-_ ]?channel/i },
];

/* How a lab does its cryptography. Ordered: the FIRST match wins, because a lab
   that calls WebCrypto and also imports noble is primarily a WebCrypto lab. */
const IMPLEMENTATION_SHAPES = [
  { name: 'WebCrypto', re: /crypto\.subtle\./ },
  { name: '@noble', re: /@noble\// },
  { name: 'WASM', re: /\.wasm\b|WebAssembly\./ },
  { name: 'hand-rolled', re: null }, // assigned when algorithm evidence exists but no library
];

/* `structures` closes the protocol-identity miss class, and it is deliberately
   NOT a slug or title rule. A lab that IMPLEMENTS a protocol declares that
   protocol's own message types - `buildClientHello`, `decodeClientHelloInner` -
   while a lab that ATTACKS or MODELS one declares `runAttack` and `llr`. Keying
   on the slug would be the same mistake the four fixed cards made from the other
   side: crypto-lab-hqc-timing has "hqc" in its name and implements no HQC, so a
   slug rule would manufacture exactly the false claim that was just removed.
   `ClientHello` is unmistakably TLS in a way that "tls" in a repo name is not.

   `alias` names the SAME algorithm under its other name. Kyber became ML-KEM in
   FIPS 203 and Dilithium became ML-DSA in FIPS 204; a lab implementing one is a
   lab implementing the other, and a card chipping "CRYSTALS-Dilithium" beside an
   `src/crypto/mldsa.ts` is right rather than wrong. Without this the rename shows
   up as a fleet-wide contradiction that is purely an artefact of the rename.

   `pathRe` overrides `re` when matching a FILE PATH. A few terms are decisive as
   a filename and far too loose as a line pattern: `src/ot.ts` is unambiguously
   oblivious transfer, while the two letters "ot" on a line are nothing. */
module.exports = { ALGORITHMS, ATTACKS, IMPLEMENTATION_SHAPES };
