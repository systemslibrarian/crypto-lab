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

function checkLatticeModelScope(source) {
  const slug = 'crypto-lab-lattice-fault';
  // Inspected immutable source at 6b127eb85b647f573408f2e9a90cbe0fcca2c94b:
  // src/timing.ts:88 counts a model's divide steps; src/loopabort.ts:37 is
  // a parameter object. runLoopAbortAttack at :560 generates one polynomial
  // relation, not a complete ML-DSA key/signature/verification implementation.
  const implementations = implementationsFor(source, slug);
  assert.deepEqual(implementations, ['Keccak', 'NTT', 'SHAKE'],
    'Keep executed primitives without crediting complete Kyber or ML-DSA');
  const attacks = attacksFor(source, slug);
  // src/main.ts:40 uses CPA for correlation power analysis, not a chosen-
  // plaintext attack; :618 is only a related padding-oracle lab name.
  assert.ok(!attacks.includes('Chosen-plaintext attack'));
  assert.ok(!attacks.includes('Padding oracle'));
  for (const name of ['Fault injection', 'Key recovery', 'Lattice reduction',
    'Power analysis', 'Timing side-channel']) {
    assert.ok(attacks.includes(name), `Preserve the bounded ${name} exhibit`);
  }
  const card = source.match(new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[\\s\\S]*?</a>'))[0];
  assert.match(card, /Modelled ML-KEM decode/);
  assert.match(card, /Modelled ML-DSA components/);
  assert.match(card, /one secret polynomial in a signing model/);
  assert.doesNotMatch(card, /whole ML-DSA secret/);
}

test('Lattice Fault separates component and cycle models from complete standards', () => {
  checkLatticeModelScope(html);
});

test('Lattice Fault scope rejects false credits and loss of real computations', () => {
  const marker = 'href="https://systemslibrarian.github.io/crypto-lab-lattice-fault/"';
  for (const [attribute, value] of [
    ['implements', 'Kyber@src/timing.ts:88'],
    ['implements', 'ML-DSA@src/loopabort.ts:37'],
    ['attacks', 'Chosen-plaintext attack@src/main.ts:40'],
    ['attacks', 'Padding oracle@src/main.ts:618'],
  ]) {
    assert.throws(() => checkLatticeModelScope(html.replace(marker,
      `${marker} data-${attribute}="${value}"`)), assert.AssertionError);
  }
  for (const name of ['Keccak', 'NTT', 'SHAKE']) {
    const changed = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-lattice-fault\/"[\s\S]*?<\/a>/,
      card => card.replace(new RegExp(`${name}@src/(?:shake256|loopabort)\\.ts:\\d+`), ''));
    assert.notEqual(changed, html, `${name} control must change the actual anchor`);
    assert.throws(() => checkLatticeModelScope(changed), assert.AssertionError);
  }
});

test('visible catalog summaries distinguish BBS naming and bounded DP advantage', () => {
  const card = slug => html.match(new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[\\s\\S]*?</a>'))[0];
  assert.match(card('crypto-lab-credential-veil'), /BBS selective disclosure/);
  assert.doesNotMatch(card('crypto-lab-credential-veil'), /(?:project-copy|chip)">[^<]*BBS\+/);
  assert.match(card('crypto-lab-dp-noise'), /distinguishing advantage.*bounded/);
  assert.doesNotMatch(card('crypto-lab-dp-noise'), /become indistinguishable/);
  assert.match(card('crypto-lab-rsa-educational'), /projected 2048-bit factoring cost/);
  assert.doesNotMatch(card('crypto-lab-rsa-educational'), /while a 2048-bit key holds/);
});

function checkScope(source) {
  // HQC Timing Break cc4305c7: src/engine.ts runs a repetition-code cache
  // model. data.ts's 2020 chosen-ciphertext event and README's Lattice Fault
  // sibling link describe other work, not attacks executed by this model.
  assert.deepEqual(attacksFor(source, 'crypto-lab-hqc-timing-break'),
    ['Cache timing', 'Key recovery', 'Side-channel (unspecified)', 'Timing side-channel']);
  assert.deepEqual(implementationsFor(source, 'crypto-lab-hqc-timing-break'),
    ['Repetition code']);
  // Educational RSA 81e413b19: factor.ts computes integer factors, not
  // discrete logarithms; real-world.ts links to a sibling padding oracle.
  assert.deepEqual(attacksFor(source, 'crypto-lab-rsa-educational'),
    ['Ciphertext malleability', 'Factoring', 'Key recovery']);
  assert.deepEqual(implementationsFor(source, 'crypto-lab-rsa-educational'),
    ['RSA', 'RSA-OAEP']);
  // Current Stego Suite 145f8f49b6e0a5ec649704472722a41d8df34ea8:
  // src/main.ts:326 lists image detectors RS/SPA/ML, not physical power
  // analysis. src/lib/crypto.ts performs the real encrypt-before-hide calls.
  assert.deepEqual(attacksFor(source, 'crypto-lab-stego-suite'), []);
  assert.deepEqual(implementationsFor(source, 'crypto-lab-stego-suite'),
    ['AES', 'AES-GCM', 'PBKDF2', 'SHA-256']);
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
    'crypto-lab-lwe-hints': ['Chosen-plaintext attack', 'Lattice reduction', 'Power analysis'],
  })) {
    for (const name of rejected) assert.ok(!attacksFor(source, slug).includes(name), `${slug}: reject ${name}`);
  }
  assert.ok(attacksFor(source, 'crypto-lab-dilithium-seal').includes('Timing side-channel'),
    'Preserve the measured signing-time variability exhibit');
  assert.ok(attacksFor(source, 'crypto-lab-dead-sea-cipher').includes('Brute force'));
  assert.ok(attacksFor(source, 'crypto-lab-isogeny-atlas').includes('Brute force'));
  assert.ok(attacksFor(source, 'crypto-lab-order-leak').includes('Frequency analysis'),
    'Preserve actual ciphertext-frequency recovery against public counts');
  assert.ok(attacksFor(source, 'crypto-lab-lwe-hints').includes('Side-channel (unspecified)'),
    'Preserve the assumed inner-product leakage setting, without claiming a physical channel');
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
    ['crypto-lab-lwe-hints', 'Lattice reduction'],
    ['crypto-lab-lwe-hints', 'Power analysis'],
    ['crypto-lab-hqc-timing-break', 'Chosen-ciphertext attack'],
    ['crypto-lab-hqc-timing-break', 'Fault injection'],
    ['crypto-lab-rsa-educational', 'Discrete log'],
    ['crypto-lab-rsa-educational', 'Padding oracle'],
    ['crypto-lab-stego-suite', 'Power analysis'],
  ]) {
    const marker = `href="https://systemslibrarian.github.io/${slug}/"`;
    const mutated = html.replace(marker, `${marker} data-attacks="${attack}@README.md:1"`);
    assert.throws(() => checkScope(mutated), assert.AssertionError);
  }
});

test('scope control detects loss of Stego Suite encrypt-before-hide cryptography', () => {
  for (const name of ['AES-GCM', 'PBKDF2', 'SHA-256']) {
    const changed = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-stego-suite\/"[\s\S]*?<\/a>/,
      card => card.replace(new RegExp(`${name}@src/lib/crypto\\.ts:\\d+`), ''));
    assert.notEqual(changed, html, `${name} mutation must change the actual card`);
    assert.throws(() => checkScope(changed), assert.AssertionError);
  }
});

test('scope control detects loss of the actual frequency-recovery exhibit', () => {
  const mutated = html.replace(/Frequency analysis@src\/app.ts:\d+/, '');
  assert.notEqual(mutated, html, 'The mutation must remove the real catalog anchor');
  assert.throws(() => checkScope(mutated), assert.AssertionError);
});

test('LWE scope control detects loss of the real instance and assumed leakage context', () => {
  for (const attr of ['implements', 'attacks']) {
    const marker = 'href="https://systemslibrarian.github.io/crypto-lab-lwe-hints/"';
    const mutated = html.replace(marker, `${marker} data-${attr}=""`);
    assert.notEqual(mutated, html, 'The mutation must alter the selected card');
    assert.throws(() => checkScope(mutated), assert.AssertionError);
  }
});

test('HQC scope control preserves the modeled cache channel, recovery and repetition code', () => {
  for (const [field, name] of [
    ['data-implements', 'Repetition code'],
    ['data-attacks', 'Cache timing'], ['data-attacks', 'Key recovery'],
  ]) {
    const mutated = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-hqc-timing-break\/"[\s\S]*?<\/a>/,
      card => card.replace(new RegExp(`${field}="([^"]*)"`), (attribute, value) => {
        const entries = value.split(' | ').filter(entry => entry.split('@')[0] !== name);
        assert.notEqual(entries.length, value.split(' | ').length, `${name} mutation must apply`);
        return `${field}="${entries.join(' | ')}"`;
      }));
    assert.notEqual(mutated, html, 'Mutate the actual card');
    assert.throws(() => checkScope(mutated), assert.AssertionError);
  }
});

function checkHqcVisibleScope(source) {
  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-hqc-timing-break\/"[\s\S]*?<\/a>/)[0];
  const copy = card.match(/<div class="project-copy">([^<]*)<\/div>/)[1];
  assert.match(copy, /cache-channel simulation/);
  assert.match(copy, /repetition-code stand-in/);
  assert.match(copy, /majority and reliability-weighted bit recovery/);
  assert.match(copy, /No full HQC decoder or target-hardware timing measurements/);
  assert.doesNotMatch(copy, /A full-decryption oracle on HQC/);
  assert.match(card, /chip">Reliability-Weighted Recovery<\/span>/);
  assert.doesNotMatch(card, /chip">Soft-ISD<\/span>/);
}

test('HQC visible teaching scope describes a cache simulation, not a working HQC oracle', () => {
  checkHqcVisibleScope(html);
  const changed = html.replace(/cache-channel simulation inspired by HQC decryption-oracle attacks/, 'full-decryption oracle on HQC');
  assert.notEqual(changed, html, 'The negative control must change visible learner-facing text');
  assert.throws(() => checkHqcVisibleScope(changed), assert.AssertionError);
  const unqualified = html.replace('chip">Reliability-Weighted Recovery</span>', 'chip">Soft-ISD</span>');
  assert.notEqual(unqualified, html);
  assert.throws(() => checkHqcVisibleScope(unqualified), assert.AssertionError);
});

test('scope control preserves Educational RSA arithmetic and executed attacks', () => {
  for (const [field, name] of [
    ['data-implements', 'RSA'], ['data-implements', 'RSA-OAEP'],
    ['data-attacks', 'Ciphertext malleability'], ['data-attacks', 'Factoring'],
    ['data-attacks', 'Key recovery'],
  ]) {
    const mutated = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-rsa-educational\/"[\s\S]*?<\/a>/,
      card => card.replace(new RegExp(`${field}="([^"]*)"`), (attribute, value) => {
        const entries = value.split(' | ').filter(entry => entry.split('@')[0] !== name);
        assert.notEqual(entries.length, value.split(' | ').length, `${name} mutation must apply`);
        return `${field}="${entries.join(' | ')}"`;
      }));
    assert.notEqual(mutated, html, 'Mutate the actual card');
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


function checkPowerScope(source) {
  const slug = 'crypto-lab-power-trace';
  const attacks = attacksFor(source, slug);
  for (const name of ['Chosen-plaintext attack', 'Fault injection', 'Timing side-channel']) {
    assert.ok(!attacks.includes(name), `Power Trace does not demonstrate ${name}`);
  }
  for (const name of ['Power analysis', 'Key recovery', 'Side-channel (unspecified)']) {
    assert.ok(attacks.includes(name), `Preserve Power Trace's actual ${name} exhibit`);
  }
  assert.ok(implementationsFor(source, slug).includes('AES'));
  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-power-trace\/"[\s\S]*?<\/a>/)[0];
  const copy = card.match(/<div class="project-copy">([^<]*)<\/div>/)[1];
  assert.match(card, /data-implements="AES@src\/aes\/aes\.ts:123"/,
    'AES source evidence points to the tested encryption function, not a SBOX import');
  assert.match(copy, /simulated power traces/i);
  assert.match(copy, /Correlation and differential power analysis/i);
  assert.match(copy, /JavaScript AES is not constant-time/);
  assert.doesNotMatch(copy, /(?:cipher is correct and|JavaScript AES is) constant-time/);
}

test('Power Trace distinguishes correlation CPA, sibling attacks and simulated leakage', () => {
  checkPowerScope(html);
});

test('Power Trace controls reject false attacks, timing guarantees and loss of actual analysis', () => {
  const marker = 'href="https://systemslibrarian.github.io/crypto-lab-power-trace/"';
  for (const name of ['Chosen-plaintext attack', 'Fault injection', 'Timing side-channel']) {
    assert.throws(() => checkPowerScope(html.replace(marker, `${marker} data-attacks="${name}@README.md:1"`)), assert.AssertionError);
  }
  for (const name of ['Power analysis', 'Key recovery', 'Side-channel (unspecified)']) {
    const token = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '@[^"|]+');
    const markerAt = html.indexOf(marker);
    const prefix = html.slice(0, markerAt);
    const suffix = html.slice(markerAt).replace(token, '');
    assert.notEqual(prefix + suffix, html);
    assert.throws(() => checkPowerScope(prefix + suffix), assert.AssertionError);
  }
  const mutated = html.replace('the JavaScript AES is not constant-time.', 'the JavaScript AES is constant-time.');
  assert.notEqual(mutated, html);
  assert.throws(() => checkPowerScope(mutated), assert.AssertionError);
  const importAnchor = html.replace('AES@src/aes/aes.ts:123', 'AES@src/attack/cpa.ts:15');
  assert.notEqual(importAnchor, html, 'The negative control must replace the actual implementation anchor');
  assert.throws(() => checkPowerScope(importAnchor), assert.AssertionError);
});
