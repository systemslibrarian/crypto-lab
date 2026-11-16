/* `EC point arithmetic` used to be credited from a BARE scalar multiply, and a
 * scalar multiply is not an elliptic-curve operation: matrix, lattice,
 * polynomial and tropical arithmetic all have one. crypto-lab-tropical-exchange
 * was published implementing it, anchored to a tropical `scalarMul` that adds
 * one constant to every matrix entry, and the term was listed among its
 * references too. The lab contains no elliptic curve anywhere.
 *
 * The term now carries three patterns and they do different jobs:
 *   re        what the term can name at all, unchanged
 *   strictRe  the alternatives that are self-evidently EC and need no help
 *   ctxRe     the EC context the leftover ambiguous alternative must find,
 *             on the line, in the block around it, or in the file
 *
 * Both halves matter. Tightening `re` alone cannot work, because the scanner
 * tests the IDENTIFIER and `scalarMul` is the same string in a tropical lab as
 * in a ristretto one; and gating the whole TERM broke crypto-lab-musig-gate,
 * whose evidence is `isOnCurve(pt: ToyPoint)` carrying no second EC token.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { ALGORITHMS } = require('../tools/catalog-vocab.js');
const { ctxAllows } = require('../tools/catalog-evidence.js');

const TERM = ALGORITHMS.find((t) => t.name === 'EC point arithmetic');
const allows = (line, code = '', inFile = false) =>
  TERM.re.test(line) && ctxAllows(TERM, line, code, inFile);

test('the term still declares all three patterns', () => {
  assert.ok(TERM, 'the term must exist');
  assert.ok(TERM.re.test('scalarMul'), 're must still NAME a bare scalar multiply, or nothing reaches the gate');
  assert.ok(TERM.strictRe, 'strictRe must exist so unambiguous evidence skips the gate');
  assert.ok(TERM.ctxRe, 'ctxRe must exist or there is no gate at all');
  assert.ok(TERM.chipRe.test(TERM.name), 'the name must still match its own chipRe (catalog-sync vocab)');
});

test('a tropical scalar multiply is NOT elliptic-curve point arithmetic', () => {
  const line = 'export function scalarMul(c: Trop, x: Matrix): Matrix {';
  assert.ok(TERM.re.test(line), 're names it, which is why the gate has to exist');
  assert.equal(allows(line), false, 'the real defect: this was credited as EC point arithmetic');
  assert.equal(allows(line, 'return x.map((row) => row.map((v) => v + c));'), false,
    'and the tropical body supplies no EC context either');
  assert.equal(allows('scalarMul'), false, 'nor does the bare identifier the scanner tests');
  assert.equal(allows('scalar Mul'), false, 'nor its camel split');
});

test('a real secp256k1 point multiply still counts', () => {
  assert.equal(allows('function pointMul(P: Point, k: bigint) { return ladder(P, k); }'), true);
  assert.equal(allows('const Q = secp256k1.scalarMulBase(d);'), true, 'secp256k1 must match despite the digits');
  assert.equal(allows('export function scalarMul(point: GroupElement, scalar: bigint): GroupElement {'), true,
    'a signature taking a point is EC context on the line');
  assert.equal(allows('const R = RistrettoPointValue.scalarMult(k);'), true);
});

test('strictRe evidence needs no second token', () => {
  /* crypto-lab-musig-gate's real line. It satisfies ctxRe only incidentally,
     because ctxRe matches `curve` inside `isOnCurve` -- which is why the case
     that actually discriminates is double-and-add, whose own text carries no
     EC noun at all. Gating the whole term dropped this lab. */
  assert.equal(allows('export function isOnCurve(pt: ToyPoint): boolean {'), true);

  const dbl = 'const R = doubleAndAdd(k);';
  assert.equal(TERM.ctxRe.test(dbl), false, 'no point, curve or named curve anywhere in it');
  assert.equal(TERM.strictRe.test(dbl), true, 'but it is unambiguous EC evidence on its own');
  assert.equal(allows(dbl), true, 'so it must count without any second token');
});

test('the FILE is the widest window, and it is what separates the two labs', () => {
  const decl = 'export function scalarMultPath(privateKey: Uint8Array, bits = 12): ScalarMultStep[] {';
  assert.equal(allows(decl), false, 'no EC token on the line');
  assert.equal(allows(decl, '', true), true,
    'but crypto-lab-ed25519-forge drives acc.double() and acc.add(ed25519.Point.BASE) in the same file');
  const tropical = 'export function scalarMul(c: Trop, x: Matrix): Matrix {';
  assert.equal(allows(tropical, '', false), false,
    'and the tropical files hold zero EC tokens, so the window never opens for them');
});

test('pointer is not a point, and a bare EC noun is not an operation', () => {
  assert.equal(allows('function scalarMul(p: pointer, s: number) {}'), false,
    '"pointer" must not supply EC context');
  assert.equal(allows('export type Point = { x: bigint; y: bigint };'), false,
    'naming a Point type is not doing point arithmetic');
});

test('MUTATION: without the gate, the tropical scalar multiply is credited again', () => {
  const ungated = { ...TERM, ctxRe: undefined };
  const line = 'export function scalarMul(c: Trop, x: Matrix): Matrix {';
  assert.equal(ctxAllows(ungated, line, '', false), true,
    'this is the behaviour before the fix, reproduced');
  assert.equal(ctxAllows(TERM, line, '', false), false, 'and the gated term refuses it');
});
