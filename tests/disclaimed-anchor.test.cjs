'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ce = require(path.join(ROOT, 'tools/catalog-evidence.js'));
const { disclaimersIn, anchorDispositions, DISCLAIMERS } = ce;

/*
 * The eleven real lines this rule was built from, swept out of the catalog on
 * 2026-11-08. Each is the actual text an attack credit was anchored on, so a
 * phrase list that stops matching them stops catching the defect.
 */
const REAL_LINES = [
  ["kem-trap Timing side-channel", "'a working key-recovery or timing attack. The Kyber plaintext-checking oracle and KyberSlash timing recovery are named and linked, not executed here.'"],
  ["bike-vault Fault injection", "- **Physical fault injection:** Paiva et al. report HQC/BIKE key recovery using one fault; this lab does not reproduce the experiment."],
  ["fhe-arena Chosen-plaintext attack", "This shows <em>randomization</em>, not a proof of semantic security. IND-CPA security asks whether"],
  ["card-trick Brute force", "'It is min(1, 2^(q-k)) - a GENERIC, ILLUSTRATIVE bound on brute force against a k-bit primitive. It is not a measured result.'"],
  ["blind-oracle Key recovery", "- **Malicious-server feedback oracle:** a server can alter returned ciphertexts. This does not establish the result here."],
  ["ciphertext-mirror Chosen-ciphertext attack", '"It does not establish end-to-end key-recovery cost on a specific implementation, model the exact chosen-ciphertext construction"'],
  ["protocol-compose Chosen-ciphertext attack", '<p class="note">The attacks concern the naive protocols shown, not every construction. This is not a proof.</p>'],
];

for (const [label, line] of REAL_LINES) {
  test(`a disclaiming line is detected: ${label}`, () => {
    assert.ok(disclaimersIn(line).length > 0, `no phrase matched:\n  ${line}`);
  });
}

/*
 * The other half of the rule, and the harder half. These lines are ordinary code
 * and ordinary descriptive prose; flagging them would turn true credits into
 * removals, which is worse than the defect.
 */
const CLEAN_LINES = [
  ['real code', "export function gaussianSolve(A: number[][], target: number[], s: number[], q: number) {"],
  ['a WebCrypto call', "      return webcryptoDigest('SHA-256', bytes);"],
  ['an honest description', "  // Prange (1962) iterates a random information-set selection."],
  ['a chip label', '<span class="chip">Fault Injection</span>'],
  ['a heading', '<h2 id="heading-a">A. What is Oblivious Transfer?</h2>'],
  ['a normal sentence', 'The slider leaks the informative coordinates, so the bound below is this model best case.'],
];

for (const [label, line] of CLEAN_LINES) {
  test(`an ordinary line is not flagged: ${label}`, () => {
    assert.deepEqual(disclaimersIn(line), [], `false positive on:\n  ${line}`);
  });
}

test('the rule is disclaimer, not prose-ness', () => {
  /* "This anchor line is prose" would fire on crypto-lab-ot-gate, whose
     Chou-Orlandi OT is real and whose only written occurrence of the term is a UI
     string -- the irreducible unnamed-implementation class, where re-anchoring is
     forbidden and removal would delete a true credit. */
  for (const d of DISCLAIMERS) {
    assert.ok(/\bnot\b|\bneither\b|does not|illustrative/.test(d),
      `"${d}" is not a denial, so it would flag prose that merely describes`);
  }
});

test('every declared disposition names a repo, term, anchor and reason', () => {
  const d = anchorDispositions();
  assert.ok(d.size >= 1);
  for (const [key, v] of d) {
    assert.match(v.repo, /^crypto-lab-/);
    assert.ok(v.term && v.anchor, `${key}: a disposition must name what it rules`);
    assert.ok(v.reason && v.reason.length > 80, `${key}: a disposition without a reason is a silent exemption`);
    assert.ok(v.ruled, `${key}: a disposition records when it was ruled`);
    assert.equal(key, `${v.repo} ${v.term} ${v.anchor}`);
  }
});

test('an unreadable disposition file is refused, not read as "none ruled"', () => {
  const src = fs.readFileSync(path.join(ROOT, 'tools/catalog-evidence.js'), 'utf8');
  const fn = src.slice(src.indexOf('function anchorDispositions()'));
  assert.match(fn.slice(0, 900), /throw new Error\(`tools\/anchor-dispositions\.json is unreadable/);
});

test('a disclaimed anchor fails the run', () => {
  const src = fs.readFileSync(path.join(ROOT, 'tools/catalog-evidence.js'), 'utf8');
  assert.match(src, /behind\.length \|\| diverged\.length \|\| disclaimed\.length/,
    'DISCLAIMED-ANCHOR must reach the non-zero exit, not just print');
});

/*
 * The twelve credits removed in the sweep must stay removed. Asserted against
 * the published cards, so re-deriving at a new pin cannot quietly bring one back.
 */
test('no removed credit has come back to a card', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const { readCards } = require(path.join(ROOT, 'tools/card-reader.js'));
  const { cards } = readCards(html);
  const gone = {
    'crypto-lab-blind-oracle': ['Key recovery'],
    'crypto-lab-fhe-arena': ['Chosen-plaintext attack'],
    'crypto-lab-bike-vault': ['Fault injection', 'Key recovery', 'Timing side-channel'],
    'crypto-lab-hqc-vault': ['Timing side-channel'],
    'crypto-lab-protocol-compose': ['Chosen-ciphertext attack'],
    'crypto-lab-ciphertext-mirror': ['Chosen-ciphertext attack'],
    'crypto-lab-kem-trap': ['Timing side-channel'],
    'crypto-lab-card-trick': ['Brute force'],
    'crypto-lab-pq-families': ['Fault injection', 'Key recovery'],
  };
  for (const [slug, terms] of Object.entries(gone)) {
    const c = cards.find((x) => x.slug === slug);
    assert.ok(c, `${slug} has no card`);
    const attacks = (c.attr('data-attacks') || '').split('|').map((x) => x.trim().split('@')[0]);
    for (const t of terms) {
      assert.ok(!attacks.includes(t), `${slug} credits ${t} again; its anchor line denied the attack`);
    }
  }
});
