const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { attackContextAllows, lex } = require('../tools/catalog-evidence.js');
const { ATTACKS } = require('../tools/catalog-vocab.js');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function attacksFor(source, slug) {
  const card = source.match(new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[^>]*>'));
  assert.ok(card, `Missing ${slug} card`);
  return (card[0].match(/\bdata-attacks="([^"]*)"/)?.[1] ?? '')
    .split(' | ').filter(Boolean).map((value) => value.split('@')[0]);
}

function implementationsFor(source, slug) {
  const card = source.match(new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[^>]*>'));
  assert.ok(card, `Missing ${slug} card`);
  return (card[0].match(/\bdata-implements="([^"]*)"/)?.[1] ?? '')
    .split(' | ').map(value => value.split('@')[0]);
}

test('comparison tables, parameter imports and symbolic terms are not primitive implementations', () => {
  for (const [slug, term] of [
    ['crypto-lab-zk-arena', 'STARK'],
    ['crypto-lab-broken-trust', 'ML-DSA'],
    ['crypto-lab-frozen-heart', 'Ed25519'],
    ['crypto-lab-credential-veil', 'BLS signatures'],
    ['crypto-lab-protocol-checker', 'Diffie-Hellman'],
    ['crypto-lab-isogeny-atlas', 'CGL hash'],
    ['crypto-lab-e91', 'BB84'],
  ]) assert.ok(!implementationsFor(html, slug).includes(term), `${slug}: ${term} is only referenced/modelled`);
  for (const [slug, term] of [
    ['crypto-lab-zk-arena', 'Schnorr'],
    ['crypto-lab-frozen-heart', 'ristretto255'],
    ['crypto-lab-credential-veil', 'BBS signatures'],
    ['crypto-lab-credential-veil', 'BLS12-381'],
    ['crypto-lab-isogeny-atlas', 'Isogeny walk'],
  ]) assert.ok(implementationsFor(html, slug).includes(term), `${slug}: preserve ${term}`);
});

test('visible catalog summaries distinguish BBS naming and bounded DP advantage', () => {
  const card = slug => html.match(new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[\\s\\S]*?</a>'))[0];
  assert.match(card('crypto-lab-credential-veil'), /BBS selective disclosure/);
  assert.doesNotMatch(card('crypto-lab-credential-veil'), /(?:project-copy|chip)">[^<]*BBS\+/);
  assert.match(card('crypto-lab-dp-noise'), /distinguishing advantage.*bounded/);
  assert.doesNotMatch(card('crypto-lab-dp-noise'), /become indistinguishable/);
});

function checkScope(source) {
  const bitcoin = attacksFor(source, 'crypto-lab-bitcoin-script');
  assert.ok(bitcoin.includes('Signature malleability'), 'Keep the actual high-S experiment');
  assert.ok(!bitcoin.includes('Key recovery'), 'Sibling key recovery is not executed here');
  assert.ok(!bitcoin.includes('Nonce reuse'), 'Sibling nonce reuse is not executed here');
  assert.deepEqual(attacksFor(source, 'crypto-lab-kmac-gate'), [],
    'KMAC scope contrasts and missing hardening are not demonstrated attacks');
  const frodo = attacksFor(source, 'crypto-lab-frodo-vault');
  assert.ok(frodo.includes('Chosen-ciphertext attack'),
    'Keep the real ciphertext-tamper and implicit-rejection experiment');
  assert.ok(!frodo.includes('Chosen-plaintext attack'),
    'CPA security discussion is not a chosen-plaintext experiment');
  assert.ok(!frodo.includes('Side-channel (unspecified)'),
    'Missing side-channel guarantees are not a demonstrated attack');
  for (const [slug, rejected] of Object.entries({
    'crypto-lab-iron-serpent': ['Brute force', 'Differential cryptanalysis'],
    'crypto-lab-sphincs-ledger': ['Factoring', 'Discrete log'],
    'crypto-lab-dead-sea-cipher': ['Side-channel (unspecified)'],
    'crypto-lab-kyber-vault': ['Brute force', 'Chosen-ciphertext attack', 'Side-channel (unspecified)'],
    'crypto-lab-dilithium-seal': ['Discrete log', 'Factoring', 'Fault injection', 'Key recovery', 'Side-channel (unspecified)'],
    'crypto-lab-kem-trap': ['Key recovery'],
    'crypto-lab-protocol-checker': ['Discrete log', 'Key recovery', 'Padding oracle', 'Side-channel (unspecified)', 'Timing side-channel'],
    'crypto-lab-isogeny-atlas': ['Factoring'],
    'crypto-lab-e91': ['Man-in-the-middle', 'Side-channel (unspecified)'],
    'crypto-lab-lwe-hints': ['Chosen-plaintext attack'],
  })) {
    for (const name of rejected) assert.ok(!attacksFor(source, slug).includes(name), `${slug}: reject ${name}`);
  }
  assert.ok(attacksFor(source, 'crypto-lab-dilithium-seal').includes('Timing side-channel'),
    'Preserve the measured signing-time variability exhibit');
  assert.ok(attacksFor(source, 'crypto-lab-dead-sea-cipher').includes('Brute force'));
  assert.ok(attacksFor(source, 'crypto-lab-isogeny-atlas').includes('Brute force'));
  assert.ok(attacksFor(source, 'crypto-lab-order-leak').includes('Frequency analysis'),
    'Preserve actual ciphertext-frequency recovery against public counts');
  assert.ok(attacksFor(source, 'crypto-lab-lwe-hints').includes('Power analysis'),
    'CPA beside DPA means correlation power analysis; preserve that reference');
  assert.ok(implementationsFor(source, 'crypto-lab-lwe-hints').includes('LWE'),
    'Preserve the actual toy LWE instance and perfect-hint recovery');
}

test('catalog keeps sibling attacks and negated limits out of attacks shown', () => {
  checkScope(html);
});

test('scope control detects reintroduced sibling and negated-limit credits', () => {
  for (const [slug, attack] of [
    ['crypto-lab-bitcoin-script', 'Key recovery'],
    ['crypto-lab-kmac-gate', 'Length extension'],
    ['crypto-lab-frodo-vault', 'Chosen-plaintext attack'],
    ['crypto-lab-frodo-vault', 'Side-channel (unspecified)'],
    ['crypto-lab-iron-serpent', 'Differential cryptanalysis'],
    ['crypto-lab-sphincs-ledger', 'Factoring'],
    ['crypto-lab-dilithium-seal', 'Key recovery'],
    ['crypto-lab-protocol-checker', 'Padding oracle'],
    ['crypto-lab-lwe-hints', 'Chosen-plaintext attack'],
  ]) {
    const marker = `href="https://systemslibrarian.github.io/${slug}/"`;
    const mutated = html.replace(marker, `${marker} data-attacks="${attack}@README.md:1"`);
    assert.throws(() => checkScope(mutated), assert.AssertionError);
  }
});

test('scope control detects loss of the actual frequency-recovery exhibit', () => {
  const mutated = html.replace(/Frequency analysis@src\/app.ts:\d+/, '');
  assert.notEqual(mutated, html, 'The mutation must remove the real catalog anchor');
  assert.throws(() => checkScope(mutated), assert.AssertionError);
});

test('LWE scope control detects loss of the real instance and power-analysis context', () => {
  for (const attr of ['implements', 'attacks']) {
    const marker = 'href="https://systemslibrarian.github.io/crypto-lab-lwe-hints/"';
    const mutated = html.replace(marker, `${marker} data-${attr}=""`);
    assert.notEqual(mutated, html, 'The mutation must alter the selected card');
    assert.throws(() => checkScope(mutated), assert.AssertionError);
  }
});

test('scanner rejects negated claims, risk warnings and biographies as attack evidence', () => {
  for (const [name, line] of [
    ['Key recovery', 'This is not a key-recovery attack.'],
    ['Key recovery', 'It does not reproduce key recovery or establish a break.'],
    ['Side-channel (unspecified)', 'Keys are never protected against side-channel extraction.'],
    ['Differential cryptanalysis', '<li>Co-inventor of differential cryptanalysis (with Adi Shamir).</li>'],
    ['Chosen-ciphertext attack', 'The FO transform prevents chosen-ciphertext attacks.'],
    ['Factoring', 'There are no number-theoretic assumptions (factoring, discrete log).'],
    ['Key recovery', 'Encryption is opaque: no key recovery, no side channels.'],
  ]) {
    const term = ATTACKS.find(t => t.name === name);
    assert.ok(term.re.test(line), `Fixture must actually match ${name}`);
    assert.equal(attackContextAllows(term, line), false, line);
  }
});

test('scanner retains computations and positive demonstrations beside bounded limits', () => {
  for (const [name, line] of [
    ['Key recovery', 'export function runKeyRecovery() { return recoverSecret(); }'],
    ['Brute force', 'export function bruteForce() { return enumerateCandidates(); }'],
    ['Key recovery', 'Run the key recovery demonstration; not production crypto.'],
    ['Timing side-channel', 'Measure the timing side-channel in this demonstration.'],
  ]) {
    const term = ATTACKS.find(t => t.name === name);
    assert.ok(term.re.test(line), `Fixture must actually match ${name}`);
    assert.equal(attackContextAllows(term, line, lex(line).code), true, line);
  }
});

test('an independent recovery clause survives an earlier key-access negation', () => {
  const term = ATTACKS.find(t => t.name === 'Frequency analysis');
  // Actual learner-facing source, independently checked against the grouping /
  // public-count recovery in src/attack/frequency.ts and its app.ts caller:
  // https://github.com/systemslibrarian/crypto-lab-order-leak/blob/d7b852c6faf13305af98e6787fb7f05221e7e323/src/app.ts#L243
  const source = '<section class="evidence"><h2>Authenticated, never decrypted, and recovered</h2><p>Every deterministic AES-GCM-SIV department ciphertext has a valid authentication tag: <strong data-verdict="dte-tags" data-result="${tagVerdict.result}">${tagVerdict.text}</strong>. The query module holds no key, equality still succeeds, and frequency analysis recovers cells from public counts.</p></section>';
  assert.equal(attackContextAllows(term, source, lex('`' + source + '`').code), true);
  assert.equal(attackContextAllows(term, source.replace('frequency analysis recovers', 'frequency analysis is not implemented')), false);
  assert.equal(attackContextAllows(term, source.replace('and frequency analysis', 'and no frequency analysis')), false);
});

test('coordinated negation lists and risk prose remain excluded', () => {
  const term = ATTACKS.find(t => t.name === 'Frequency analysis');
  for (const source of [
    'The module demonstrates no key recovery, and frequency analysis.',
    'The module demonstrates neither key recovery nor frequency analysis.',
    'The module demonstrates no key recovery, and frequency analysis recovery techniques.',
    'No key recovery, and frequency analysis does not recover cells.',
    'The query module holds no key, and never frequency analysis recovers cells.',
    'Production risk: the module holds no key, and frequency analysis recovers cells.',
  ]) {
    assert.ok(term.re.test(source));
    assert.equal(attackContextAllows(term, source), false, source);
  }
});
