#!/usr/bin/env node
/*
 * evidence-shape-proof.js — the declaration shape's two suppressions, asserted.
 *
 * Run: node tools/evidence-shape-proof.js
 * Prevents: a variable name crediting a lab with an algorithm it does not implement
 * Reads: tools/catalog-evidence.js (its PRESENTS and MODELS guards) and tools/catalog-vocab.js
 *
 * The decl shape reads identifiers, and an identifier is executable code, so the
 * string-blanking lexer cannot help here. Two guards narrow it, and both exist
 * because a real card carried a real false claim:
 *
 *   PRESENTS  `renderModuleLWE` paints a diagram of Module-LWE and does not
 *             compute it.
 *   MODELS    `const aes128 = extrapolate(128, rate, multiplier)` in
 *             crypto-lab-export-grade holds a projection of the learner's own
 *             measured search rate. The lab implements no AES; it plots
 *             published results from a citation table. `aes128` camel-splits to
 *             "aes 128" and the decl shape credited it.
 *
 * The negative cases matter more than the positive one: a guard that suppressed
 * everything would also pass a test that only checked the bad line.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { ALGORITHMS } = require('./catalog-vocab.js');

const SRC = fs.readFileSync(path.join(__dirname, 'catalog-evidence.js'), 'utf8');
const grab = (name) => {
  const m = new RegExp(`const ${name} = (/.*/[a-z]*);`).exec(SRC);
  if (!m) { console.error(`${name} not found in catalog-evidence.js`); process.exit(1); }
  // eslint-disable-next-line no-eval
  return eval(m[1]);
};
const PRESENTS = grab('PRESENTS');
const MODELS = grab('MODELS');

const camelSplit = (t) => t.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Za-z])(\d)/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
const DECL = /(?:^|[\s;{(,])(?:async\s+)?(?:function|class)\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]{1,80})?=/g;

/* The decl branch of shapeOf, re-derived here from the same two guards the tool
   uses, so this proof cannot drift into testing a copy of the rule. */
function declShape(code, re) {
  DECL.lastIndex = 0;
  let d;
  while ((d = DECL.exec(code)) !== null) {
    const id = d[1] || d[2];
    if (!id) continue;
    if (PRESENTS.test(id)) continue;
    const init = /=\s*([A-Za-z_$][\w$]*)\s*\(/.exec(code.slice(d.index + d[0].length - 1));
    if (init && MODELS.test(init[1])) continue;
    if (re.test(id) || re.test(camelSplit(id))) return 'decl';
  }
  return null;
}

const term = (n) => {
  const t = ALGORITHMS.find((a) => a.name === n);
  if (!t) { console.error(`no vocabulary term ${n}`); process.exit(1); }
  return t.re;
};

const CASES = [
  // the defect
  ['const aes128 = extrapolate(128, rate.candidatesPerSecond, multiplier);', 'AES', null,
    'S1  the export-grade line: a rate projection named for the algorithm'],
  ['const rsaCost = estimate(2048, rate);', 'RSA', null,
    'S2  estimate() is a projection too'],
  // the negatives that keep the guard narrow
  ['const aes128 = aesEncryptBlock(key, block);', 'AES', 'decl',
    'S3  same identifier, real computation -> still credited'],
  ['const aesKey = await importKey(raw);', 'AES', 'decl',
    'S4  an ordinary AES declaration is untouched'],
  ['function aes128Encrypt(k, b) {', 'AES', 'decl',
    'S5  a function declaration is untouched'],
  ['const labelled = extrapolate(80, rate, m);', 'AES', null,
    'S6  a projection NOT named for an algorithm credits nothing either way'],
  // the digit-suffix variant that was measured and rejected: these must stay credited
  ['const hmacSha256 = createHmac(key);', 'HMAC', 'decl',
    'S7  hmacSha256 stays HMAC (the rejected digit rule suppressed it)'],
  ['const shake128 = newShake(128);', 'SHAKE', 'decl',
    'S8  shake128 stays SHAKE — the digits are the standard instance name'],
  ['const mlKem768 = kemFromParams(768);', 'ML-KEM', 'decl',
    'S9  mlKem768 stays ML-KEM'],
  // PRESENTS still works
  ['const renderAes = () => {};', 'AES', null,
    'S10 PRESENTS still suppresses a drawing function'],
];

let pass = 0;
const failed = [];
console.log('DECLARATION SHAPE — a name is not an implementation\n');
for (const [code, name, want, why] of CASES) {
  const got = declShape(code, term(name));
  if (got === want) { pass += 1; console.log(`  ok    ${why}`); }
  else { failed.push(why); console.log(`  FAIL  ${why}\n          got ${String(got)}, want ${String(want)}`); }
}
console.log(`\n${pass} passed, ${failed.length} failed.`);
if (failed.length) process.exit(1);
