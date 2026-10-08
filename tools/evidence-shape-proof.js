#!/usr/bin/env node
/*
 * evidence-shape-proof.js — the shape rules' suppressions, asserted.
 *
 * Run: node tools/evidence-shape-proof.js
 * Prevents: a variable name, a constant, an import path or a drawing function crediting a lab with an algorithm it does not implement
 * Reads: tools/catalog-evidence.js (its exported shapeOf, and the guards behind it) and tools/catalog-vocab.js
 *
 * `shapeOf` reads identifiers, and an identifier is executable code, so the
 * string-blanking lexer cannot help here. Seven guards narrow it, and every one
 * exists because a real card carried a real false claim:
 *
 *   PRESENTS     `renderModuleLWE` paints a diagram of Module-LWE and does not
 *                compute it — at its declaration AND at its call site.
 *   MODELS       `const aes128 = extrapolate(128, rate, multiplier)` in
 *                crypto-lab-export-grade holds a projection of the learner's own
 *                measured search rate. The lab implements no AES.
 *   ATTACKS_IT   `kipnisShamirAttack` in crypto-lab-multivariate is an attack BY
 *                Kipnis and Shamir, not an implementation of Shamir sharing.
 *   MEASURES     `const rsaBytes = SIZE_COMPARISONS.find(...)` in
 *                crypto-lab-mceliece-gate is a row of its own comparison table.
 *   HOLDS_DATA   `const zucKey = hexToBytes('173d…')` in crypto-lab-air-stream is
 *                a known-answer-test input; the cipher is `class Zuc128`.
 *   SCALAR_INIT  `const MLKEM_ORIGIN_YEAR = 2017` is a fact about ML-KEM.
 *   ZERO_IV      `{ name: 'AES-CBC', iv: new Uint8Array(16) }` on one block is
 *                the raw block cipher, not the CBC mode.
 *
 * Before any guard runs, a term's own pattern has to stop at the edges of a
 * name. Two did not, and four cards carried the result: `heldKeyWrapper`
 * (crypto-lab-jwt-forge) and the module path `./keywrap`, which holds AES-GCM
 * (crypto-lab-quantum-vault-kpqc), were credited as AES-KW implementations; a
 * UI field called `keyWrap` gave crypto-lab-feistel-forge an AES-KW reference;
 * and `step3Desc` (crypto-lab-shamir-vs-frost) was credited as 3DES. Those
 * lines are kept below in both views the walk reads: through shapeOf, and as
 * the bare pattern over raw and camel-split text, which is all a reference or
 * `verify` ever applies.
 *
 * plus two rules about where evidence may come from at all: an import line's
 * BINDINGS decide when it has any, and `importKey` is key material rather than
 * an operation (shape `keyimport`, which evidenceFor demotes to a reference).
 *
 * The negative cases matter more than the positive ones: a guard that suppressed
 * everything would also pass a test that only checked the bad line. Each rule
 * below therefore carries at least one case that must STILL be credited, and the
 * three variants that were measured and rejected are kept as negatives so they
 * are not rediscovered and retried.
 *
 * It drives the REAL `shapeOf`, not a reimplementation of its decl branch. The
 * earlier copy grabbed the guard regexes out of catalog-evidence.js so they could
 * not drift, which was honest, but it could only test the one branch it had
 * rewritten - and the guards now live in four.
 */
'use strict';
const { ALGORITHMS } = require('./catalog-vocab.js');
const { lex, shapeOf, camelSplit } = require('./catalog-evidence.js');

const term = (n) => {
  const t = ALGORITHMS.find((a) => a.name === n);
  if (!t) { console.error(`no vocabulary term ${n}`); process.exit(1); }
  return t;
};

/* The three views the walk passes in: strings kept (for quoted algorithm names),
   strings blanked (for declarations), and the call's own lines joined (for a
   WebCrypto call written across several). A case may be given as an array of
   lines, in which case the first is the anchor line and all of them are the
   window - exactly what the walk does. */
const shape = (src, name) => {
  const lines = Array.isArray(src) ? src : [src];
  const l = lex(lines[0]);
  return shapeOf(l.strings.trim(), l.code.trim(), term(name), lines.join(' '));
};

const CASES = [
  ['Reviewed interpretation false matches', [
    ['const description = \'Moves from "repeated squaring in an RSA group" toward a beacon\';', 'RSA', null, 'prose inside a string is not import syntax'],
    ["import { renderModuleLWE } from './module-lwe';", 'LWE', null, 'a drawing import does not implement its subject'],
    ["import { renderFiatShamir } from './fiat-shamir';", 'Fiat-Shamir', null, 'presentation-only bindings also block path fallback'],
    ["import { renderModuleLWE as lwe } from './module-lwe';", 'LWE', null, 'a local alias does not change the imported symbol'],
    ["export { renderModuleLWE } from './module-lwe';", 'LWE', null, 'presentation re-exports do not establish computation'],
    ["import { rsaEncrypt } from '../rsa/textbook';", 'RSA', 'import', 'real computation imported by UI remains evidence'],
    ["import { rsaEncrypt as encrypt } from '../rsa/textbook';", 'RSA', 'import', 'a real computation remains evidence under an alias'],
    ["import { encap as dhkemEncap } from '@hub/hpke';", 'DHKEM', 'import', 'an algorithm-qualified alias for a generic crypto export remains evidence'],
    ["const { rsaEncrypt } = require('./rsa');", 'RSA', 'import', 'require bindings remain evidence'],
    ["const rsa = await import('./rsa');", 'RSA', 'import', 'dynamic imports remain evidence'],
    ["} from './dhkem';", 'DHKEM', 'import', 'the closing line of a multiline crypto import remains evidence'],
    ['const gaussianSigma = noiseLevel;', 'Gaussian mechanism', null, 'measurement noise is not differential privacy'],
    ['function gaussianMechanism(value) { return value + noise(); }', 'Gaussian mechanism', 'decl', 'explicit Gaussian mechanism remains evidence'],
  ]],
  ['MODELS — a projection named for an algorithm', [
    ["const aes128 = extrapolate(128, rate.candidatesPerSecond, multiplier);", 'AES', null,
      'the export-grade line: a rate projection named for the algorithm'],
    ["const rsaCost = estimate(2048, rate);", 'RSA', null, 'estimate() is a projection too'],
    ["const aes128 = aesEncryptBlock(key, block);", 'AES', 'binding',
      'NEGATIVE same identifier, real computation -> still credited'],
    ["const labelled = extrapolate(80, rate, m);", 'AES', null,
      'a projection not named for an algorithm credits nothing either way'],
  ]],
  ['PRESENTS — drawing it is not computing it', [
    ["const renderAes = () => {};", 'AES', null, 'suppressed at the declaration'],
    ["    if (mount) renderFiatShamir(mount);", 'Fiat-Shamir', null,
      'the dilithium-seal line: suppressed at the CALL SITE too'],
    ["    if (mount) renderModuleLWE(mount);", 'LWE', null, 'and its LWE twin'],
    ["  const out = aesEncrypt(key, block);", 'AES', 'call',
      'NEGATIVE an ordinary call is still credited'],
    ["function sampleModuleLwe(): MlweInstance {", 'LWE', 'decl',
      'NEGATIVE sampling an LWE instance IS computing with it'],
  ]],
  ['ATTACKS_IT — attacking it is not implementing it', [
    ["export function kipnisShamirAttack(", 'Shamir secret sharing', null,
      'the multivariate line: an attack by Kipnis and Shamir'],
    ["export function shamirSplit(secret, n, k) {", 'Shamir secret sharing', 'decl',
      'NEGATIVE the real thing is still credited'],
    ["  const pane = attackPaneFor(target);", 'AES', null,
      'no algorithm named, nothing either way'],
    ["export function aesBreak(ct) {", 'AES', null, 'a break of it is not it'],
    ["import { kipnisShamirAttack, publicPartOf } from './attack.ts';", 'Shamir secret sharing', null,
      'multivariate again, one file away: importing the attack is not importing the scheme'],
    ["import { shamirSplit } from './sss.ts';", 'Shamir secret sharing', 'import',
      'NEGATIVE importing the real thing still credits it'],
  ]],
  ['MEASURES / HOLDS_DATA apply to what a VARIABLE holds, not to functions', [
    ["function bulletproofBytes(bits: number): number {", 'Bulletproofs', 'decl',
      'a function that computes a proof size, in the lab the term is named after'],
    ["function schnorrBytes(bits: number): number {", 'Schnorr', 'decl', 'its Schnorr twin'],
    ["export function isdPrangeBits(n: number, k: number, t: number): number {", 'Information-set decoding', 'decl',
      "pq-families computes Prange's work factor and implements the decoder"],
    ["export function gtToKyberBytes(gt: GTElement): Uint8Array {", 'Kyber', 'decl', 'beacon-lock'],
    ["const hkdfKey = await crypto.subtle.importKey(", 'HKDF', 'binding',
      'HOLDS_DATA needs the VALUE to be data too: this is a live key object, not a vector'],
    ["const zucKey = hexToBytes('173d14ba5003731d7a60049470f00a29')", 'ZUC', null,
      'while this one IS a vector, and stays suppressed'],
  ]],
  ['MEASURES — a size is not an implementation', [
    ['const rsaBytes = SIZE_COMPARISONS.find((e) => e.name === "RSA-2048 public key").bytes;', 'RSA', null,
      'the mceliece-gate line: a row of its own comparison table'],
    ["const aesKeyBytes = 32;", 'AES', null, 'a key size is a size'],
    ["function aesKeyExpand(key) {", 'AES', 'decl', 'NEGATIVE an expansion is an operation'],
  ]],
  ['HOLDS_DATA — a test vector is not the cipher', [
    ["  const zucKey = hexToBytes('173d14ba5003731d7a60049470f00a29')", 'ZUC', null,
      'the air-stream line: a known-answer-test input'],
    ["  const zucExpected = 'a6c85fc66afb8533aafc2518dfe78494'", 'ZUC', null, 'and its expected output'],
    ["export class Zuc128 {", 'ZUC', 'decl', 'NEGATIVE the cipher itself is credited'],
    ["function zucKeystream(key, iv, n) {", 'ZUC', 'decl', 'NEGATIVE so is the operation'],
  ]],
  ['SCALAR_INIT — a constant is a fact about it', [
    ["export const MCELIECE_348864_PUBLIC_KEY_BYTES = 261120;", 'Classic McEliece', null, 'a key size'],
    ["export const MLKEM_ORIGIN_YEAR = 2017;", 'ML-KEM', null, 'a year'],
    ["const MLKEM_512_PK = 800;", 'ML-KEM', null, 'the pq-chooser line'],
    ["let shamirRevealAll = false;", 'Shamir secret sharing', null, 'a boolean UI flag'],
    ["const aesSbox = [0x63, 0x7c, 0x77, 0x7b];", 'AES', 'binding',
      'NEGATIVE an S-box table IS part of an implementation'],
    ["const AES_SBOX = [0x63, 0x7c, 0x77, 0x7b];", 'AES', null,
      'PRE-EXISTING an ALL_CAPS_UNDERSCORE identifier reaches no term: \\baes\\b finds no boundary before "_", and camelSplit splits on case, not on underscores. True on origin/main too, recorded so it is not read as this rule'],
    ["const mlKemParams = { k: 3, eta1: 2 };", 'ML-KEM', 'binding',
      'NEGATIVE so is a parameter object'],
    ["const aesRounds = rounds(keyLength);", 'AES', 'binding',
      'NEGATIVE a computed value is not a literal'],
  ]],
  ['imports — a binding overrides the path only by naming another algorithm', [
    ["import { ctr } from '@noble/ciphers/aes.js';", 'AES', 'import',
      "split-point: `ctr` names no algorithm, so the path still says AES"],
    ["import { cfb } from '@noble/ciphers/aes.js';", 'AES', 'import', 'attestation-gate, same shape'],
    ["import { extract, expand } from '@noble/hashes/hkdf.js';", 'HKDF', 'import',
      "hpke-envelope: HKDF's own two operations name no algorithm"],
    ["import { generateKeyPair } from '@hub/hpke/dhkem';", 'DHKEM', 'import', 'blind-relay'],
    ["import { shake256 } from '@noble/hashes/sha3.js';", 'SHA-3', null,
      'but `shake256` IS a term, so it overrides: importing SHAKE is not implementing SHA-3'],
    ["import { shake256 } from '@noble/hashes/sha3.js';", 'SHAKE', 'import',
      'NEGATIVE and SHAKE itself is credited from the same line'],
  ]],
  ['imports — the bindings decide when there are any', [
    ["import { ristretto255, ristretto255_hasher } from '@noble/curves/ed25519.js'", 'Ed25519', null,
      'the fold-gate line: every binding says ristretto255'],
    ["import { ristretto255 } from '@noble/curves/ed25519.js'", 'ristretto255', 'import',
      'NEGATIVE the binding that IS named is credited'],
    ["import { x25519 } from '@noble/curves/ed25519.js'", 'X25519', 'import',
      'NEGATIVE the case bindings-matching was added for'],
    ["import * as ed from '@noble/curves/ed25519.js'", 'Ed25519', 'import',
      'NEGATIVE a namespace import names no symbols, so the path is all there is'],
    ["require('./aes-gcm.js')", 'AES-GCM', 'import',
      'NEGATIVE a bare require names no symbols either, so its path is read'],
    ["import './aes-gcm.js'", 'AES-GCM', null,
      'PRE-EXISTING a side-effect `import \'x\'` is read by nothing: the path pattern wants from / require( / import(. True on origin/main too'],
  ]],
  ['a WebCrypto call spanning lines is read with its own lines', [
    [['  const bits = await crypto.subtle.deriveBits(', '    {', "      name: 'HKDF',", "      hash: 'SHA-256',"], 'HKDF', 'call',
      'harvest-vault / kyber-vault: the operation is the anchor, not the importKey above it'],
    [["  const base = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, [", "    'deriveBits',", '  ])'], 'HKDF', 'keyimport',
      'NEGATIVE the importKey is still key material, however many lines it spans'],
    [['  const x = 1', '    {', "      name: 'HKDF',"], 'HKDF', null,
      'NEGATIVE the window is only read when the anchor line IS an open WebCrypto call'],
  ]],
  ['term boundaries — a name inside a longer name is not the name', [
    ["function heldKeyWrapper(): VerifierKey {", 'AES-KW', null,
      'the jwt-forge line: a key wrapper is not AES Key Wrap'],
    ["import { wrapShare, unwrapShare } from './keywrap';", 'AES-KW', null,
      'the quantum-vault-kpqc line: its keywrap module wraps shares with AES-GCM'],
    ["  const { wrap: keyWrap, input: keyInput } = textField(", 'AES-KW', null,
      'the feistel-forge line: a text field'],
    ["  const step3Desc = document.createElement('p');", '3DES', null,
      'the shamir-vs-frost line: step 3, description'],
    ["  const tripleDescriptor = describe(x);", '3DES', null,
      'the next one: triple-des needs a trailing boundary too'],
    ["export function aesKwWrap(kek: Uint8Array, plaintext: Uint8Array): Uint8Array {", 'AES-KW', 'decl',
      'NEGATIVE the envelope-kms line: RFC 3394 wrap is still credited'],
    ["export function aesKeyWrap(kek, key) {", 'AES-KW', 'decl',
      'NEGATIVE spelled out, still credited'],
    ["  const wrapped = await crypto.subtle.wrapKey('raw', dek, kek, 'AES-KW');", 'AES-KW', 'call',
      'NEGATIVE the WebCrypto algorithm name is still credited'],
    ["function tripleDesEncrypt(block, keys) {", '3DES', 'decl',
      'NEGATIVE triple DES spelled as an identifier is still credited'],
    ["export function encrypt3Des(block, keys) {", '3DES', null,
      'COST of the left boundary: a digit glued to the word before it is not seen. No lab in the fleet spelled 3DES this way when the boundary was added'],
  ]],
  ['keyimport and ZERO_IV — intent and the raw block', [
    ["    return crypto.subtle.importKey('raw', asArrayBuffer(key), { name: 'AES-CBC' }, false, ['encrypt'])", 'AES-CBC', 'keyimport',
      'the air-stream line: key material, ranked below every operation'],
    ["    { name: 'AES-CBC', iv: new Uint8Array(16) },", 'AES-CBC', null,
      'the air-stream zero-IV call: the raw block cipher, not the mode'],
    ["    { name: 'AES-CBC', iv: new Uint8Array(16) },", 'AES', 'call',
      'NEGATIVE AES itself still credits from that same line'],
    ["  const ct = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, k, pt);", 'AES-CBC', 'call',
      'NEGATIVE a real IV is the real mode'],
    ["  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce, tagLength: 128 }, k, pt);", 'AES-GCM', 'call',
      'NEGATIVE an ordinary AEAD call is untouched'],
  ]],
];

let pass = 0;
const failed = [];
console.log('EVIDENCE SHAPE — a name is not an implementation\n');
for (const [group, cases] of CASES) {
  console.log(group);
  for (const [code, name, want, why] of cases) {
    const got = shape(code, name);
    if (got === want) { pass += 1; console.log(`  ok    ${why}`); }
    else { failed.push(`${group}: ${why}`); console.log(`  FAIL  ${why}\n          got ${String(got)}, want ${String(want)}`); }
  }
  console.log('');
}
/* The bare pattern, over the two views every reader of a term applies: the
   line as written and its camel split. References and `verify` use nothing
   else, so a pattern that matches here reaches a card whatever shapeOf says. */
const PATTERN_CASES = [
  ['heldKeyWrapper', 'AES-KW', false], ["from './keywrap'", 'AES-KW', false],
  ['keyWrap', 'AES-KW', false], ['keywrap_key', 'AES-KW', false],
  ['step3Desc', '3DES', false], ['tripleDescriptor', '3DES', false],
  ['AES-KW', 'AES-KW', true], ['aes_kw', 'AES-KW', true],
  ['AES key wrap and DEK/KEK key rotation', 'AES-KW', true], ['aesKwUnwrap', 'AES-KW', true],
  ['3DES_EDE', '3DES', true], ['Triple-DES', '3DES', true], ['TripleDES', '3DES', true],
];
console.log('term patterns over raw and camel-split text');
for (const [text, name, want] of PATTERN_CASES) {
  const t = term(name);
  const got = t.re.test(text) || t.re.test(camelSplit(text));
  const why = `${want ? 'names' : 'does not name'} ${name}: ${text}`;
  if (got === want) { pass += 1; console.log(`  ok    ${why}`); }
  else { failed.push(`term patterns: ${why}`); console.log(`  FAIL  ${why}`); }
}
console.log('');
console.log(`${pass} passed, ${failed.length} failed.`);
if (failed.length) process.exit(1);
