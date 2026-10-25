const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { attackContextAllows, lex } = require('../tools/catalog-evidence.js');
const { ALGORITHMS, ATTACKS } = require('../tools/catalog-vocab.js');
const exhibitManifest = require('../tools/catalog-exhibits.json');

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

function openingFor(source, slug) {
  const card = source.match(new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[^>]*>'));
  assert.ok(card, `Missing ${slug} card`);
  return card[0];
}

function blockFor(source, slug) {
  const card = source.match(new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[\\s\\S]*?</a>'));
  assert.ok(card, `Missing ${slug} card block`);
  return card[0];
}

function referencesFor(source, slug) {
  return (openingFor(source, slug).match(/\bdata-references="([^"]*)"/)?.[1] ?? '')
    .split(' | ').filter(Boolean);
}

function chipsFor(source, slug) {
  return [...blockFor(source, slug).matchAll(/class="chip">([^<]+)</g)].map(match => match[1]);
}

function checkEnvelopeKmsScope(source) {
  const slug = 'crypto-lab-envelope-kms';
  assert.deepEqual(implementationsFor(source, slug), [
    'AES',
    'AES-CTR',
    'AES-GCM',
    'AES-KW',
    'HKDF',
    'HMAC',
    'SHA-256',
  ]);
  assert.deepEqual(attacksFor(source, slug), [],
    'Claim-mutation tests and modeled logger compromise are not executed fault or side-channel attacks');
  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-envelope-kms\/"[^>]*>/)[0];
  assert.match(card, /data-review-commit="d2b6614a9fad2fe9667b05d35e3a1e6895ad3293"/);
  assert.match(card, /HMAC@src\/kms\/forward-secure-log\.ts:220/);
  assert.match(card, /bounded single-logger\/private-verifier adaptation/);
  const references = card.match(/data-references="([^"]*)"/)[1].split(' | ');
  assert.ok(references.includes('Merkle tree'),
    'The lesson compares its linear checkpoint with Merkle consistency proofs without implementing one');
}

test('Envelope KMS credits S02 HMAC without inventing attacks or stronger log guarantees', () => {
  checkEnvelopeKmsScope(html);
});

test('Envelope KMS scope controls reject lost, misplaced, or invented S02 credit', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-envelope-kms\/"[^>]*>/;
  for (const changed of [
    html.replace(cardRe, (card) => card.replace(/HMAC@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(
      'HMAC@src/kms/forward-secure-log.ts:220',
      'HMAC@src/kms/forward-secure-log.ts:219',
    )),
    html.replace(cardRe, (card) => card.replace(
      'data-standards="',
      'data-attacks="Fault injection@e2e/key-evolving-audit-claims.spec.ts:1 | Side-channel (unspecified)@SECURITY.md:1" data-standards="',
    )),
    html.replace(cardRe, (card) => card.replace('Merkle tree | ', '')),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the Envelope KMS card');
    assert.throws(() => checkEnvelopeKmsScope(changed), assert.AssertionError);
  }
});

function checkDcNetScope(source) {
  const slug = 'crypto-lab-dc-net';
  assert.deepEqual(implementationsFor(source, slug), ['DC-net', 'SHA-256']);
  assert.deepEqual(attacksFor(source, slug), ['Known-plaintext attack'],
    'The known-empty first round and exact mask reuse recover the next private inputs; other failure cases are not catalogued as cryptanalytic attacks');
  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-dc-net\/"[^>]*>/)[0];
  assert.match(card, /data-review-commit="8de5cb25042cc70b991fe53211d85e3324bc9684"/);
  assert.match(card, /DC-net@src\/dcnet\/round\.ts:171/);
  assert.match(card, /bounded collect-all-then-reveal teaching adaptation/);
  assert.match(card, /does not prove hiding, equation compliance, identity, availability, accountability or Dissent\/Verdict properties/);
  const references = card.match(/data-references="([^"]*)"/)[1].split(' | ');
  assert.ok(references.includes('Shamir secret sharing'),
    'Silent Tally is a comparison to Shamir aggregation, not a DC-net implementation dependency');
}

test('DC-net credits the executable anonymous broadcast without importing comparison-system guarantees', () => {
  checkDcNetScope(html);
});

test('DC-net vocabulary recognizes the construction without matching generic network prose', () => {
  const dcnet = ALGORITHMS.find((term) => term.name === 'DC-net');
  assert.ok(dcnet);
  assert.ok(dcnet.re.test('DC-net'));
  assert.ok(dcnet.re.test('dcnet'));
  assert.ok(dcnet.re.test('Dining Cryptographers'));
  assert.equal(dcnet.re.test('DC network configuration'), false);
  assert.ok(dcnet.pathRe.test('src/dcnet/round.ts'));

  const knownPlaintext = ATTACKS.find((term) => term.name === 'Known-plaintext attack');
  assert.ok(knownPlaintext);
  assert.ok(knownPlaintext.re.test('known plaintext'));
  assert.ok(knownPlaintext.re.test('known-empty inputs'));
  assert.equal(knownPlaintext.re.test('firstRoundKnownEmpty'), false);
  assert.equal(knownPlaintext.re.test('empty-message handling'), false);
});

test('DC-net scope controls reject lost, moved or invented credit', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-dc-net\/"[^>]*>/;
  for (const changed of [
    html.replace(cardRe, (card) => card.replace(/DC-net@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(
      'DC-net@src/dcnet/round.ts:171',
      'DC-net@src/dcnet/round.ts:170',
    )),
    html.replace(cardRe, (card) => card.replace(/Known-plaintext attack@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(
      'data-attacks="',
      'data-attacks="Fault injection@src/ui/disruption.ts:287 | ',
    )),
    html.replace(cardRe, (card) => card.replace(
      'data-implements="',
      'data-implements="Dissent@README.md:113 | Verdict@README.md:114 | ',
    )),
    html.replace(cardRe, (card) => card.replace('Shamir secret sharing', '')),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the DC-net card');
    assert.throws(() => checkDcNetScope(changed), assert.AssertionError);
  }
});

function checkHpkeS01Scope(source) {
  const slug = 'crypto-lab-hpke-envelope';
  const implementations = implementationsFor(source, slug);
  assert.ok(implementations.includes('Ed25519'),
    'S01 executes strict Ed25519 signing and verification, not merely a comparison label');
  assert.ok(implementations.includes('Sign-then-Encrypt'),
    'S01 executes the reviewed identity-bound Sign-then-Encrypt construction');
  assert.ok(attacksFor(source, slug).includes('Key-compromise impersonation'),
    'S01 executes the RFC 9180 Auth recipient-key KCI forgery');
  assert.ok(!attacksFor(source, slug).includes('Key recovery'),
    'Apple iCloud key recovery is a provider feature, not an executed recovery attack');
  assert.ok(!attacksFor(source, slug).includes('Nonce reuse'),
    'a sibling nonce-collision link is not an executed nonce-reuse attack');

  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-hpke-envelope\/"[^>]*>/)[0];
  assert.match(card, /data-review-commit="fcf3b56c06e1ef16b10b0db8e1b7fec60d295de8"/);
  assert.match(card, /Ed25519@src\/signcryption\/ste\.ts:325/);
  assert.match(card, /Sign-then-Encrypt@src\/signcryption\/ste\.ts:311/);
  assert.match(card, /bounded Sign-then-Encrypt teaching profile/);
}

test('HPKE Envelope credits executable S01 construction and KCI without overstating evidence', () => {
  checkHpkeS01Scope(html);
  assert.ok(!attacksFor(html, 'crypto-lab-ake-ladder').includes('Key-compromise impersonation'),
    'AKE Ladder has a related-link mention, not this executable KCI forgery');
});

test('S01 vocabulary names the construction and only executable KCI-forgery spellings', () => {
  const ste = ALGORITHMS.find((term) => term.name === 'Sign-then-Encrypt');
  const kci = ATTACKS.find((term) => term.name === 'Key-compromise impersonation');
  assert.ok(ste);
  assert.ok(kci);
  assert.ok(ste.re.test('Sign-then-Encrypt'));
  assert.ok(ste.re.test('signcrypt'));
  assert.equal(ste.re.test('sign and later encrypt'), false);
  assert.ok(kci.re.test('forgeAuthAfterRecipientCompromise'));
  assert.ok(kci.re.test('KCI-forgery'));
  assert.equal(kci.re.test('key-compromise impersonation'), false);
  assert.equal(kci.re.test('see the KCI lesson'), false);
});

test('HPKE S01 scope controls reject lost or displaced reviewed credit', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-hpke-envelope\/"[^>]*>/;
  for (const changed of [
    html.replace(cardRe, (card) => card.replace(/Sign-then-Encrypt@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(
      'Ed25519@src/signcryption/ste.ts:325',
      'Ed25519@src/signcryption/ste.ts:673',
    )),
    html.replace(cardRe, (card) => card.replace(/Key-compromise impersonation@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(
      'data-attacks="Key-compromise impersonation@src/signcryption/ste.ts:641"',
      'data-attacks="Key recovery@src/ui/statics.ts:21 | Key-compromise impersonation@src/signcryption/ste.ts:641"',
    )),
    html.replace(cardRe, (card) => card.replace(
      'data-attacks="Key-compromise impersonation@src/signcryption/ste.ts:641"',
      'data-attacks="Key-compromise impersonation@src/signcryption/ste.ts:641 | Nonce reuse@src/ui/links.ts:12"',
    )),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the HPKE Envelope card');
    assert.throws(() => checkHpkeS01Scope(changed), assert.AssertionError);
  }
});

function checkLfsrForgeScope(source, manifest = exhibitManifest) {
  const slug = 'crypto-lab-lfsr-forge';
  assert.deepEqual(implementationsFor(source, slug), ['Trivium'],
    'Only the vocabulary-named, executed Trivium primitive belongs in data-implements');
  assert.deepEqual(attacksFor(source, slug), ['Key recovery'],
    'Retain executable zero-round recovery without promoting test or provenance prose to attacks');

  const opening = openingFor(source, slug);
  assert.match(opening, /data-review-commit="7c6246133b9ea5d2acda5ee1cddeada6e5b1e607"/);
  assert.match(opening, /Trivium@src\/trivium\/trivium\.ts:29/,
    'Trivium must anchor at the actual state advance, not a panel mount');
  for (const falseReference of ['Pairing', 'RC4', 'Shamir secret sharing']) {
    assert.ok(!referencesFor(source, slug).includes(falseReference),
      `${falseReference} is not an LFSR Forge algorithm reference`);
  }

  const block = blockFor(source, slug);
  assert.match(block, /inspect real Trivium clocking/);
  assert.match(block, /editable four-input Boolean combiners/);
  const chips = chipsFor(source, slug);
  assert.ok(chips.includes('Trivium'), 'The learner-facing card must expose its Trivium lesson');
  assert.ok(chips.includes('Boolean Function Audit'), 'The learner-facing card must expose the Boolean audit');

  const review = manifest.labs[slug];
  assert.equal(review.commit, '7c6246133b9ea5d2acda5ee1cddeada6e5b1e607');
  assert.equal(review.reviewScope, 'complete');
  assert.equal(review.exhibits.length, 7);
  const trivium = review.exhibits.find(exhibit => exhibit.id === 'trivium');
  assert.ok(trivium);
  assert.ok(trivium.evidence.includes('src/trivium/trivium.ts:29'));
  assert.ok(trivium.evidence.includes('src/trivium/zero-round.ts:54'),
    'The map must retain the full-observation candidate recheck');
  const booleanAudit = review.exhibits.find(exhibit => exhibit.id === 'boolean-combiner-audit');
  assert.ok(booleanAudit);
  for (const anchor of [
    'src/boolean/analysis.ts:73',
    'src/boolean/analysis.ts:92',
    'src/boolean/analysis.ts:108',
    'src/boolean/analysis.ts:146',
    'src/boolean/attacks.ts:49',
    'src/boolean/attacks.ts:63',
    'src/boolean/attacks.ts:79',
    'src/boolean/panel.ts:155',
  ]) assert.ok(booleanAudit.evidence.includes(anchor), `Missing Boolean evidence ${anchor}`);
  assert.match(booleanAudit.limits, /independent uniform bits/);
  assert.match(booleanAudit.limits, /127 states or 105 state pairs/);
  assert.match(booleanAudit.limits, /does not exclude every fast algebraic relation/);
}

test('LFSR Forge publishes Trivium and exact Boolean analysis without inherited false credits', () => {
  checkLfsrForgeScope(html);
});

test('LFSR Forge scope controls reject lost, moved, hidden or invented credit', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-lfsr-forge\/"[\s\S]*?<\/a>/;
  for (const changed of [
    html.replace(cardRe, card => card.replace(/Trivium@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, card => card.replace('Trivium@src/trivium/trivium.ts:29', 'Trivium@src/trivium/trivium.ts:28')),
    html.replace(cardRe, card => card.replace('data-attacks="Key recovery@src/trivium/panel.ts:37"',
      'data-attacks="Brute force@README.md:80 | Key recovery@src/trivium/panel.ts:37 | Known-plaintext attack@src/main.ts:140"')),
    html.replace(cardRe, card => card.replace('data-references="', 'data-references="Pairing | RC4 | Shamir secret sharing | ')),
    html.replace(cardRe, card => card.replace('7c6246133b9ea5d2acda5ee1cddeada6e5b1e607', '2800c76acf9ddc7bd79210327372b95b64d444e6')),
    html.replace(cardRe, card => card.replace('<span class="chip">Trivium</span>', '')),
    html.replace(cardRe, card => card.replace('<span class="chip">Boolean Function Audit</span>', '')),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the LFSR Forge card');
    assert.throws(() => checkLfsrForgeScope(changed), assert.AssertionError);
  }

  const missingBoolean = JSON.parse(JSON.stringify(exhibitManifest));
  missingBoolean.labs['crypto-lab-lfsr-forge'].exhibits = missingBoolean.labs['crypto-lab-lfsr-forge'].exhibits
    .filter(exhibit => exhibit.id !== 'boolean-combiner-audit');
  assert.throws(() => checkLfsrForgeScope(html, missingBoolean), assert.AssertionError);

  const missingRecheck = JSON.parse(JSON.stringify(exhibitManifest));
  const trivium = missingRecheck.labs['crypto-lab-lfsr-forge'].exhibits.find(exhibit => exhibit.id === 'trivium');
  trivium.evidence = trivium.evidence.filter(anchor => anchor !== 'src/trivium/zero-round.ts:54');
  assert.throws(() => checkLfsrForgeScope(html, missingRecheck), assert.AssertionError);
});

function checkDictionaryScope(source) {
  const executable = [
    'crypto-lab-phantom-vault',
    'crypto-lab-bcrypt-forge',
    'crypto-lab-commit-gate',
    'crypto-lab-opaque-gate',
    'crypto-lab-psi-gate',
    'crypto-lab-pake-gate',
    'crypto-lab-spake-gate',
    'crypto-lab-dnssec-chain',
    'crypto-lab-dedup-vault',
    'crypto-lab-search-vault',
  ];
  for (const slug of executable) {
    assert.ok(attacksFor(source, slug).includes('Dictionary attack'),
      `${slug}: keep the learner-executed dictionary attack`);
  }
  assert.ok(!attacksFor(source, 'crypto-lab-quantum-vault-kpqc').includes('Dictionary attack'),
    'Quantum Vault describes this threat as out of scope; it does not execute the attack');
  assert.ok(implementationsFor(source, 'crypto-lab-dedup-vault').includes('Message-Locked Encryption'),
    'Dedup Vault must credit its executable message-locked construction');
  assert.ok(implementationsFor(source, 'crypto-lab-commit-gate').includes('P-256'),
    'Commit Gate must retain its reviewed live P-256 point arithmetic');
  assert.ok(!implementationsFor(source, 'crypto-lab-commit-gate').includes('Hash-to-curve'),
    'Commit Gate explicitly uses a non-RFC 9380 teaching map, not a credited hash-to-curve suite');
}

test('dictionary-attack credit follows executable lessons, not a threat-only mention', () => {
  checkDictionaryScope(html);
});

test('dictionary and message-locked vocabulary recognizes the executable symbols', () => {
  const dictionary = ATTACKS.find((term) => term.name === 'Dictionary attack');
  const mle = ALGORITHMS.find((term) => term.name === 'Message-Locked Encryption');
  assert.ok(dictionary);
  assert.ok(mle);
  assert.ok(dictionary.re.test('offlineDictionaryAttack'));
  assert.ok(dictionary.re.test('online-server-dictionary-attack'));
  assert.equal(dictionary.re.test('dictionary lookup'), false);
  assert.ok(mle.re.test('Message-Locked Encryption'));
  assert.ok(mle.re.test('deriveLocalDataKey'));
  assert.equal(mle.re.test('deriveLocalDataKeys'), false);
});

test('PEKS, OXT and keyword-inference vocabulary name the constructions and attack narrowly', () => {
  const peks = ALGORITHMS.find((term) => term.name === 'PEKS');
  const oxt = ALGORITHMS.find((term) => term.name === 'OXT');
  const inference = ATTACKS.find((term) => term.name === 'Keyword inference');
  assert.ok(peks);
  assert.ok(oxt);
  assert.ok(inference);
  assert.ok(peks.re.test('PEKS'));
  assert.ok(peks.re.test('public-key encryption with keyword search'));
  assert.equal(peks.re.test('ordinary keyword search'), false);
  assert.ok(oxt.re.test('OXT'));
  assert.ok(oxt.re.test('oxt'));
  assert.equal(oxt.re.test('next'), false);
  assert.ok(inference.re.test('IKK attack'));
  assert.ok(inference.re.test('keyword-inference'));
  assert.ok(inference.re.test('query recovery'));
  assert.equal(inference.re.test('keyword search'), false);
});

function checkSearchVaultScope(source) {
  assert.deepEqual(implementationsFor(source, 'crypto-lab-search-vault'), [
    'AES',
    'AES-GCM',
    'BLS12-381',
    'Hash-to-curve',
    'HMAC',
    'OXT',
    'Pairing',
    'PEKS',
    'ristretto255',
    'SHA-256',
    'SHA-512',
  ]);
  assert.deepEqual(attacksFor(source, 'crypto-lab-search-vault'), [
    'Dictionary attack',
    'Keyword inference',
  ]);
  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-search-vault\/"[^>]*>/)[0];
  assert.match(card, /data-review-commit="d904972690e1514d70d5f36fc25b75840b0e4590"/);
  const references = card.match(/data-references="([^"]*)"/)[1].split(' | ');
  assert.ok(!references.includes('Ed25519'),
    'noble’s ristretto module filename must not invent an Ed25519 reference');
}

test('Search Vault credits real SSE, OXT and PEKS operations without signature, Ed25519 or fault false positives', () => {
  checkSearchVaultScope(html);
});

test('dictionary and message-locked scope controls reject lost or invented credit', () => {
  for (const slug of [
    'crypto-lab-phantom-vault',
    'crypto-lab-bcrypt-forge',
    'crypto-lab-commit-gate',
    'crypto-lab-opaque-gate',
    'crypto-lab-psi-gate',
    'crypto-lab-pake-gate',
    'crypto-lab-spake-gate',
    'crypto-lab-dnssec-chain',
    'crypto-lab-dedup-vault',
    'crypto-lab-search-vault',
  ]) {
    const re = new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[^>]*>');
    const removed = html.replace(re, (card) =>
      card.replace(/Dictionary attack@[^|" ]+(?: \| )?/, ''));
    assert.notEqual(removed, html, `${slug}: mutation must remove the real anchor`);
    assert.throws(() => checkDictionaryScope(removed), assert.AssertionError);
  }

  const dedupRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-dedup-vault\/"[^>]*>/;
  const lostMle = html.replace(dedupRe, (card) =>
    card.replace(/Message-Locked Encryption@[^|" ]+(?: \| )?/, ''));
  assert.notEqual(lostMle, html);
  assert.throws(() => checkDictionaryScope(lostMle), assert.AssertionError);

  const quantum = 'href="https://systemslibrarian.github.io/crypto-lab-quantum-vault-kpqc/"';
  const invented = html.replace(quantum,
    `${quantum} data-attacks="Dictionary attack@docs/threat-model.md:239"`);
  assert.notEqual(invented, html);
  assert.throws(() => checkDictionaryScope(invented), assert.AssertionError);

  const commitRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-commit-gate\/"[^>]*>/;
  const lostP256 = html.replace(commitRe, (card) =>
    card.replace(/P-256@[^|" ]+(?: \| )?/, ''));
  assert.notEqual(lostP256, html);
  assert.throws(() => checkDictionaryScope(lostP256), assert.AssertionError);
  const inventedHashToCurve = html.replace(commitRe, (card) =>
    card.replace(/data-implements="/, 'data-implements="Hash-to-curve@src/pedersen.ts:168 | '));
  assert.notEqual(inventedHashToCurve, html);
  assert.throws(() => checkDictionaryScope(inventedHashToCurve), assert.AssertionError);
});

test('Search Vault scope controls reject removed or invented implementation credit', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-search-vault\/"[^>]*>/;
  for (const name of [
    'AES-GCM',
    'BLS12-381',
    'Hash-to-curve',
    'OXT',
    'Pairing',
    'PEKS',
    'ristretto255',
    'SHA-512',
  ]) {
    const removed = html.replace(cardRe, (card) =>
      card.replace(new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}@[^|" ]+(?: \\| )?`), ''));
    assert.notEqual(removed, html, `${name}: mutation must remove the reviewed anchor`);
    assert.throws(() => checkSearchVaultScope(removed), assert.AssertionError);
  }
  for (const name of ['Dictionary attack', 'Keyword inference']) {
    const removed = html.replace(cardRe, (card) =>
      card.replace(new RegExp(`${name}@[^|" ]+(?: \\| )?`), ''));
    assert.notEqual(removed, html, `${name}: mutation must remove the attack anchor`);
    assert.throws(() => checkSearchVaultScope(removed), assert.AssertionError);
  }
  const inventedSignature = html.replace(cardRe, (card) =>
    card.replace('data-implements="', 'data-implements="BLS signatures@src/peks/core.ts:19 | '));
  assert.notEqual(inventedSignature, html);
  assert.throws(() => checkSearchVaultScope(inventedSignature), assert.AssertionError);
  const inventedFault = html.replace(cardRe, (card) =>
    card.replace('data-attacks="', 'data-attacks="Fault injection@src/sse/attack.ts:29 | '));
  assert.notEqual(inventedFault, html);
  assert.throws(() => checkSearchVaultScope(inventedFault), assert.AssertionError);
  const inventedEd25519 = html.replace(cardRe, (card) =>
    card.replace('data-references="', 'data-references="Ed25519 | '));
  assert.notEqual(inventedEd25519, html);
  assert.throws(() => checkSearchVaultScope(inventedEd25519), assert.AssertionError);
});

function checkHybridSignScope(source) {
  const slug = 'crypto-lab-hybrid-sign';
  assert.deepEqual(implementationsFor(source, slug), ['Ed25519', 'ML-DSA', 'SHA-512']);
  assert.deepEqual(attacksFor(source, slug), [],
    'Modeled component compromise and explanatory Shor/factoring text are not executed attacks');
  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-hybrid-sign\/"[^>]*>/)[0];
  assert.match(card, /data-review-commit="e9e4ddb545c6f934064483f43e924416d26f009d"/);
  assert.match(card, /TBD7/);
  const references = card.match(/data-references="([^"]*)"/)[1].split(' | ');
  assert.ok(!references.includes('Pairing'),
    'Ordinary-language pairing of two signatures is not a bilinear-pairing reference');
}

test('Hybrid Sign retains real signatures without crediting modeled or explanatory attacks', () => {
  checkHybridSignScope(html);
});

test('Hybrid Sign scope controls reject false attacks, pairing, and loss of real primitives', () => {
  const marker = 'href="https://systemslibrarian.github.io/crypto-lab-hybrid-sign/"';
  for (const attack of ['Discrete log', 'Factoring', 'Side-channel (unspecified)']) {
    const changed = html.replace(marker, `${marker} data-attacks="${attack}@src/breaks.ts:101"`);
    assert.notEqual(changed, html);
    assert.throws(() => checkHybridSignScope(changed), assert.AssertionError);
  }
  const falsePairing = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-hybrid-sign\/"[^>]*>/,
    card => card.replace('data-references="', 'data-references="Pairing | '));
  assert.notEqual(falsePairing, html);
  assert.throws(() => checkHybridSignScope(falsePairing), assert.AssertionError);
  for (const name of ['Ed25519', 'ML-DSA', 'SHA-512']) {
    const removed = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-hybrid-sign\/"[^>]*>/,
      card => card.replace(new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}@[^|" ]+(?: \\| )?`), ''));
    assert.notEqual(removed, html, `${name}: mutation must remove a real implementation anchor`);
    assert.throws(() => checkHybridSignScope(removed), assert.AssertionError);
  }
});

function checkRekeyScope(source) {
  // Inspected5780db419dd548127908286d19b146057329b301: vectors.ts:296
  // encrypts with BBS98 PRE; group.ts:1 uses curve/pairing arithmetic, not
  // either signature scheme. undelegate.ts:96 is another paper's title;
  // main.ts:189 explicitly says the discrete-log reduction is not reproduced.
  assert.deepEqual(implementationsFor(source, 'crypto-lab-rekey-relay'),
    ['AES', 'AES-GCM', 'BLS12-381', 'HKDF', 'Pairing', 'SHA-256']);
  assert.deepEqual(attacksFor(source, 'crypto-lab-rekey-relay'), []);
  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-rekey-relay\/"[^>]*>/)[0];
  const references = card.match(/data-references="([^"]*)"/)[1].split(' | ');
  assert.ok(!references.includes('BBS signatures'));
  assert.ok(!references.includes('BLS signatures'));
  assert.ok(implementationsFor(source, 'crypto-lab-credential-veil').includes('BBS signatures'),
    'Keep actual selective-disclosure signatures in their own lab');
  assert.ok(implementationsFor(source, 'crypto-lab-pairing-gate').includes('BLS signatures'),
    'Keep actual BLS signature callers in their own lab');
}

test('Rekey Relay distinguishes proxy encryption and pairing from signatures and cited attacks', () => {
  checkRekeyScope(html);
});

test('Rekey scope catches false credits while retaining executed primitives', () => {
  const marker = 'href="https://systemslibrarian.github.io/crypto-lab-rekey-relay/"';
  for (const [field, value] of [
    ['implements', 'BBS signatures@src/ui/vectors.ts:296'],
    ['implements', 'BLS signatures@src/crypto/group.ts:1'],
    ['attacks', 'Chosen-ciphertext attack@src/ui/undelegate.ts:96'],
    ['attacks', 'Discrete log@src/main.ts:189'],
    ['references', 'BBS signatures'],
    ['references', 'BLS signatures'],
  ]) {
    const changed = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-rekey-relay\/"[^>]*>/,
      card => {
        const attribute = new RegExp(`data-${field}="([^"]*)"`);
        return attribute.test(card)
          ? card.replace(attribute, (_, current) => `data-${field}="${current} | ${value}"`)
          : card.replace(marker, `${marker} data-${field}="${value}"`);
      });
    assert.notEqual(changed, html, 'Negative control must change an actual card');
    assert.throws(() => checkRekeyScope(changed), assert.AssertionError);
  }
  for (const name of ['AES-GCM', 'BLS12-381', 'Pairing']) {
    const changed = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-rekey-relay\/"[^>]*>/,
      card => card.replace(new RegExp(`${name}@[^|" ]+`), ''));
    assert.notEqual(changed, html, `${name} control must remove an actual anchor`);
    assert.throws(() => checkRekeyScope(changed), assert.AssertionError);
  }
});

function checkAttributeGateScope(source) {
  const slug = 'crypto-lab-attribute-gate';
  assert.deepEqual(implementationsFor(source, slug), [
    'AES',
    'AES-GCM',
    'BLS12-381',
    'Hash-to-curve',
    'HKDF',
    'Pairing',
    'SHA-256',
  ]);
  assert.deepEqual(attacksFor(source, slug), []);
  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-attribute-gate\/"[^>]*>/)[0];
  assert.match(card, /data-review-commit="ab293fd0386fac2a4e89cede2b414056df3188eb"/);
  assert.match(card, /Pairing@src\/fame\/bls\.ts:191/);
  assert.doesNotMatch(card, /Pairing@src\/fame\/bls\.ts:183/);
  assert.match(card, /BLS signatures is a scanner false positive and is removed/);
  assert.match(card, /CCA-security limit is not an executed chosen-ciphertext attack/);
}

test('Attribute Gate credits pairing operations without inventing BLS signatures', () => {
  checkAttributeGateScope(html);
});

test('Attribute Gate scope rejects false signature credit and loss of real primitives', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-attribute-gate\/"[^>]*>/;
  const inventedSignature = html.replace(cardRe, (card) =>
    card.replace('data-implements="', 'data-implements="BLS signatures@src/fabesa/fabesa.ts:29 | '));
  assert.notEqual(inventedSignature, html);
  assert.throws(() => checkAttributeGateScope(inventedSignature), assert.AssertionError);

  const inventedCca = html.replace(cardRe, (card) =>
    card.replace('data-standards="', 'data-attacks="Chosen-ciphertext attack@README.md:53" data-standards="'));
  assert.notEqual(inventedCca, html);
  assert.throws(() => checkAttributeGateScope(inventedCca), assert.AssertionError);

  const resetCounterAnchor = html.replace(cardRe, (card) =>
    card.replace('Pairing@src/fame/bls.ts:191', 'Pairing@src/fame/bls.ts:183'));
  assert.notEqual(resetCounterAnchor, html);
  assert.throws(() => checkAttributeGateScope(resetCounterAnchor), assert.AssertionError);

  for (const name of ['AES-GCM', 'BLS12-381', 'Hash-to-curve', 'Pairing']) {
    const removed = html.replace(cardRe, (card) =>
      card.replace(new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}@[^|" ]+(?: \\| )?`), ''));
    assert.notEqual(removed, html, `${name}: mutation must remove the reviewed anchor`);
    assert.throws(() => checkAttributeGateScope(removed), assert.AssertionError);
  }
});

function checkAblationScope(source) {
  // Inspected f0c5328848ca7de14af3df18751050352c556131:
  // codetalker-core/src/threat.rs:144 marks A5 OutOfScope and explicitly
  // unmeasured. README's side-channel warning is an assurance limit.
  const slug = 'crypto-lab-ablation-wire';
  assert.deepEqual(attacksFor(source, slug), [
    'Discrete log', 'Known-plaintext attack', 'Man-in-the-middle', 'Nonce reuse',
  ]);
  // Keep the actual Rust/WASM primitives, not just the removal above.
  assert.deepEqual(implementationsFor(source, slug), [
    'AES-GCM', 'ChaCha20-Poly1305', 'Ed25519', 'HKDF', 'ML-DSA',
    'ML-KEM', 'SHA-256', 'X25519',
  ]);
}

test('Ablation Wire separates unmeasured side channels from real exhibits', () => {
  checkAblationScope(html);
});

test('Ablation scope rejects an assurance-limit credit and loss of real attacks', () => {
  const marker = 'href="https://systemslibrarian.github.io/crypto-lab-ablation-wire/"';
  const falseCredit = html.replace(marker,
    `${marker} data-attacks="Side-channel (unspecified)@README.md:278"`);
  assert.notEqual(falseCredit, html);
  assert.throws(() => checkAblationScope(falseCredit), assert.AssertionError);
  for (const name of ['Known-plaintext attack', 'Nonce reuse']) {
    const changed = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-ablation-wire\/"[\s\S]*?<\/a>/,
      card => card.replace(new RegExp(`${name}@[^|" ]+`), ''));
    assert.notEqual(changed, html, `${name} control must change an actual anchor`);
    assert.throws(() => checkAblationScope(changed), assert.AssertionError);
  }
});

function checkModelBreachScope(source) {
  // Inspected 8558ee8cca7dcd38537adf621d75fee50b6b1a3e: README.md:142
  // describes a cited paper's separate nonce-misuse result. The demo's own
  // reduced-seed oracle model does not reuse a nonce or execute that attack.
  const slug = 'crypto-lab-model-breach';
  assert.deepEqual(implementationsFor(source, slug), ['Toy HiAE']);
  assert.deepEqual(attacksFor(source, slug), [
    'Brute force', 'Key recovery', 'Man-in-the-middle',
  ]);
}

test('Model Breach separates cited nonce misuse from its executed toy oracle model', () => {
  checkModelBreachScope(html);
});

test('Model Breach scope rejects the cited nonce-misuse false credit', () => {
  const marker = 'href="https://systemslibrarian.github.io/crypto-lab-model-breach/"';
  const changed = html.replace(marker,
    `${marker} data-attacks="Nonce reuse@README.md:142"`);
  assert.notEqual(changed, html);
  assert.throws(() => checkModelBreachScope(changed), assert.AssertionError);
});

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
  assert.match(card('crypto-lab-credential-veil'), /checked against draft-\d+ vectors/);
  assert.match(card('crypto-lab-credential-veil'), /custom over-18 proof/);
  // README's q-signature key-recovery paper is research context, not an executed attack.
  assert.deepEqual(attacksFor(html, 'crypto-lab-credential-veil'), []);
  assert.doesNotMatch(card('crypto-lab-credential-veil'), /(?:project-copy|chip)">[^<]*BBS\+/);
  assert.match(card('crypto-lab-dp-noise'), /distinguishing advantage.*bounded/);
  assert.doesNotMatch(card('crypto-lab-dp-noise'), /become indistinguishable/);
  assert.match(card('crypto-lab-rsa-educational'), /projected 2048-bit factoring cost/);
  assert.doesNotMatch(card('crypto-lab-rsa-educational'), /while a 2048-bit key holds/);
});

function checkBookReviewScope(source) {
  // Current default branches inspected 2026-10-22. Related-lab links,
  // comparison tables and ordinary-English uses of "chosen" or "factoring"
  // must not become credits for attacks executed by the card's own lab.
  const executed = {
    'crypto-lab-ec-point-arithmetic': ['Brute force', 'Discrete log'],
    'crypto-lab-vigenere-break': ['Frequency analysis'],
    'crypto-lab-otp-vault': ['Nonce reuse'],
    'crypto-lab-nonce-collision': [
      'Birthday bound', 'Chosen-plaintext attack', 'IV reuse', 'Key recovery', 'Nonce reuse',
    ],
    'crypto-lab-matsui-line': ['Key recovery', 'Known-plaintext attack', 'Linear cryptanalysis'],
  };
  for (const [slug, attacks] of Object.entries(executed)) {
    assert.deepEqual(attacksFor(source, slug), attacks, `${slug}: count only its own bounded exhibits`);
  }
  assert.deepEqual(implementationsFor(source, 'crypto-lab-vigenere-break'), ['Vigenere cipher']);
  assert.deepEqual(implementationsFor(source, 'crypto-lab-otp-vault'), ['One-time pad']);
  assert.ok(implementationsFor(source, 'crypto-lab-nonce-collision').includes('ChaCha20-Poly1305'),
    'Nonce Collision actually encrypts and verifies this AEAD, not just mentions it');
  assert.ok(!implementationsFor(source, 'crypto-lab-pki-chain').includes('ML-DSA'),
    'PKI Chain presents FIPS 204 reference sizes; it does not sign with ML-DSA');
  const pki = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-pki-chain\/"[^>]*>/)?.[0] ?? '';
  assert.match(pki, /data-comment-only="[^"]*ML-DSA@src\/main\.ts:180(?:\s|\")/);
}

test('book-review cards credit executed attacks and primitives, not related reading', () => {
  checkBookReviewScope(html);
});

test('book-review scope rejects false credits and losing a real CBC experiment', () => {
  const alterations = [
    ['crypto-lab-ec-point-arithmetic', 'attacks', 'Nonce reuse@README.md:35'],
    ['crypto-lab-vigenere-break', 'attacks', 'Factoring@src/ui/transcript.ts:22'],
    ['crypto-lab-otp-vault', 'attacks', 'Chosen-plaintext attack@src/ui/perfectSecrecyPanel.ts:63'],
    ['crypto-lab-nonce-collision', 'attacks', 'Padding oracle@README.md:73'],
    ['crypto-lab-matsui-line', 'attacks', 'Differential cryptanalysis@README.md:73'],
    ['crypto-lab-pki-chain', 'implements', 'ML-DSA@src/main.ts:180'],
  ];
  for (const [slug, field, falseCredit] of alterations) {
    const cardPattern = new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[^>]*>');
    const attribute = new RegExp(`data-${field}="([^"]*)"`);
    const changed = html.replace(cardPattern, card => card.replace(attribute,
      (_, current) => `data-${field}="${current} | ${falseCredit}"`));
    assert.notEqual(changed, html, `${slug}: negative control must modify the card`);
    assert.throws(() => checkBookReviewScope(changed), assert.AssertionError);
  }
  const missingCbc = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-nonce-collision\/"[^>]*>/,
    card => card.replace(/Chosen-plaintext attack@src\/main\.ts:391\s*\|\s*/, ''));
  assert.notEqual(missingCbc, html, 'CBC negative control must remove the executed exhibit');
  assert.throws(() => checkBookReviewScope(missingCbc), assert.AssertionError);
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

test('differential fault analysis vocabulary does not claim deterministic finite automata', () => {
  const term = ATTACKS.find(t => t.name === 'Differential fault analysis');
  assert.ok(term, 'The catalog must be able to name the AES fault-recovery lesson');
  assert.ok(term.re.test('differential fault analysis'));
  assert.ok(term.re.test('run differential fault recovery'));
  for (const line of [
    'DFA transition table',
    'deterministic finite automaton',
    'export function buildDFA() { return compileRegex(); }',
  ]) assert.equal(term.re.test(line), false, line);
  assert.equal(
    attackContextAllows(term, 'Run differential fault recovery and verify the recovered AES key.'),
    true,
  );
});

test('statistical ineffective fault vocabulary names the executable SIFA lesson narrowly', () => {
  const term = ATTACKS.find(t => t.name === 'Statistical ineffective fault attack');
  assert.ok(term, 'The catalog must be able to name the bounded AES SIFA lesson');
  for (const line of [
    'statistical ineffective fault attack',
    'statistical_ineffective_fault_analysis',
    'export function rankSifaKeyByte(selected, bit) {',
    'DFA + bounded SIFA',
  ]) assert.ok(term.re.test(line), line);
  for (const line of [
    'reliable ineffective fault analysis',
    'IFA witness',
    'SIFA: Exploiting Ineffective Fault Inductions',
    'statistical power analysis',
  ]) assert.equal(term.re.test(line), false, line);
  const negated = 'This lab does not implement statistical ineffective fault attacks.';
  assert.ok(term.re.test(negated));
  assert.equal(attackContextAllows(term, negated), false);
  assert.equal(
    attackContextAllows(term, 'Rank SIFA key byte candidates from accepted-output selection.'),
    true,
  );
});

function checkAesFaultScope(source) {
  const slug = 'crypto-lab-aes-anatomy';
  assert.deepEqual(attacksFor(source, slug), [
    'Chosen-plaintext attack',
    'Differential fault analysis',
    'Key recovery',
    'Known-plaintext attack',
    'Statistical ineffective fault attack',
  ]);
  assert.deepEqual(implementationsFor(source, slug), ['AES']);
  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-aes-anatomy\/"[\s\S]*?<\/a>/)[0];
  assert.match(card, /rank one byte from accepted-output bias in a bounded statistical ineffective fault attack \(SIFA\) model/);
  assert.match(card, /<span class="chip">Bounded SIFA<\/span>/);
  assert.doesNotMatch(card, /data-attacks="[^"]*(?:Timing side-channel|Side-channel \(unspecified\))/);
}

test('AES Anatomy card separates executed DFA and bounded SIFA from excluded channels', () => {
  checkAesFaultScope(html);
});

test('AES fault-scope controls reject a bare acronym, IFA-only text and lost attack credits', () => {
  const marker = 'href="https://systemslibrarian.github.io/crypto-lab-aes-anatomy/"';
  for (const falseCredit of ['SIFA', 'Ineffective fault analysis', 'Timing side-channel']) {
    const changed = html.replace(marker, `${marker} data-attacks="${falseCredit}@README.md:1"`);
    assert.notEqual(changed, html);
    assert.throws(() => checkAesFaultScope(changed), assert.AssertionError);
  }
  for (const name of ['Differential fault analysis', 'Statistical ineffective fault attack']) {
    const changed = html.replace(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-aes-anatomy\/"[\s\S]*?<\/a>/,
      card => card.replace(new RegExp(name + '@[^|" ]+'), ''));
    assert.notEqual(changed, html, `${name} control must remove an actual card credit`);
    assert.throws(() => checkAesFaultScope(changed), assert.AssertionError);
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

function checkNewResearchScope(source) {
  for (const [slug, excluded, retained] of [
    ['crypto-lab-frost-threshold', 'Discrete log', 'Nonce reuse'],
    ['crypto-lab-shamir-vs-frost', 'Discrete log', 'Nonce reuse'],
    ['crypto-lab-babel-hash', 'Collision attack', 'Length extension'],
    ['crypto-lab-hash-zoo', 'Collision attack', 'Length extension'],
  ]) {
    const attacks = attacksFor(source, slug);
    assert.ok(!attacks.includes(excluded), `${slug}: a cited research result is not a demonstrated attack`);
    assert.ok(attacks.includes(retained), `${slug}: keep the actual demonstration`);
  }
}

test('new FROST and SHA2 reading panels do not become demonstrated attacks', () => {
  checkNewResearchScope(html);
});

test('research scope controls reject false credits and loss of actual demonstrations', () => {
  for (const [slug, excluded, retained] of [
    ['crypto-lab-frost-threshold', 'Discrete log', 'Nonce reuse'],
    ['crypto-lab-shamir-vs-frost', 'Discrete log', 'Nonce reuse'],
    ['crypto-lab-babel-hash', 'Collision attack', 'Length extension'],
    ['crypto-lab-hash-zoo', 'Collision attack', 'Length extension'],
  ]) {
    const re = new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[^>]*>');
    const added = html.replace(re, card => card.replace(/data-attacks="/, `data-attacks="${excluded}@README.md:1 | `));
    assert.notEqual(added, html);
    assert.throws(() => checkNewResearchScope(added), assert.AssertionError);
    const removed = html.replace(re, card => card.replace(new RegExp(retained + '@[^|" ]+'), ''));
    assert.notEqual(removed, html);
    assert.throws(() => checkNewResearchScope(removed), assert.AssertionError);
  }
});

test('new number-theory vocabulary keeps primality and exponent recovery distinct from factoring', () => {
  const { ALGORITHMS } = require('../tools/catalog-vocab.js');
  const named = name => ALGORITHMS.find(t => t.name === name).re;
  assert.ok(named('Miller–Rabin').test('millerRabin'));
  assert.ok(named('Fermat primality test').test('Fermat primality test'));
  assert.ok(!named('Fermat primality test').test('Fermat difference-of-squares factorization'));
  assert.ok(named('Pollard rho (discrete log)').test('Pollard rho (discrete log)'));
  assert.ok(!named('Pollard rho (discrete log)').test('Pollard rho integer factorization'));
  assert.ok(!named('Rabin encryption').test('Miller–Rabin primality test'));
});

test('new lab cards retain real computations without borrowing neighboring attacks', () => {
  for (const [slug, present, absent] of [
    ['prime-witness', ['Miller–Rabin', 'Fermat primality test'], ['Factoring']],
    ['residue-gate', ['Goldwasser–Micali', 'Rabin encryption', 'Jacobi symbol', 'Tonelli–Shanks'], []],
    ['hash-hunt', ['SHA-256', 'HMAC', 'Hellman chains', 'Rainbow chains'], ['Length extension']],
    ['log-forge', ['Baby-step giant-step', 'Pohlig–Hellman', 'Index calculus', 'EC point arithmetic'], ['Factoring', 'Man-in-the-middle']],
  ]) {
    const repo = 'crypto-lab-' + slug;
    for (const name of present) assert.ok(implementationsFor(html, repo).includes(name), `${repo}: keep ${name}`);
    for (const name of absent) assert.ok(!attacksFor(html, repo).includes(name), `${repo}: no ${name} exhibit`);
  }
  assert.ok(attacksFor(html, 'crypto-lab-residue-gate').includes('Chosen-ciphertext attack'));
  assert.ok(attacksFor(html, 'crypto-lab-hash-hunt').includes('Collision attack'));
  assert.ok(attacksFor(html, 'crypto-lab-log-forge').includes('Discrete log'));
});
