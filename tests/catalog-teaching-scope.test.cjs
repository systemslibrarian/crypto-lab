const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { attackContextAllows, lex } = require('../tools/catalog-evidence.js');
const { ALGORITHMS, ATTACKS } = require('../tools/catalog-vocab.js');
const exhibitManifest = require('../tools/catalog-exhibits.json');
const catalogReviewed = require('../tools/catalog-reviewed.json');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const paperReview = fs.readFileSync(path.join(__dirname, '..', 'docs', 'paper-review-extensions.md'), 'utf8');

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
  assert.match(card, /data-review-commit="ad7fab7a04aa29b370b7009f1a18bdb8a346cd90"/);
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

function checkLfsrForgeScope(source, manifest = exhibitManifest, reviewed = catalogReviewed) {
  const slug = 'crypto-lab-lfsr-forge';
  assert.deepEqual(implementationsFor(source, slug), ['A5/1', 'Trivium'],
    'Credit the executed historical A5/1 and Trivium primitives without promoting comparisons');
  assert.deepEqual(attacksFor(source, slug), ['Cube attack', 'Key recovery'],
    'Credit the executed toy-oracle cube attack and retain executable zero-round recovery');

  const opening = openingFor(source, slug);
  assert.match(opening, /data-category="[^"]*\bHISTORICAL\b/);
  assert.match(opening, /data-review-commit="c4ef2da4b33fd08382a4309d9665745cb30bbda5"/);
  assert.match(opening, /A5\/1@src\/a51\/a51\.ts:125/,
    'A5/1 must anchor at the actual majority-controlled clock step');
  assert.match(opening, /Trivium@src\/trivium\/trivium\.ts:29/,
    'Trivium must anchor at the actual state advance, not a panel mount');
  assert.match(opening, /Cube attack@src\/cube\/panel\.ts:24/,
    'Cube attack must anchor at the learner-visible executed two-phase lesson');
  for (const falseReference of ['Pairing', 'RC4', 'Shamir secret sharing']) {
    assert.ok(!referencesFor(source, slug).includes(falseReference),
      `${falseReference} is not an LFSR Forge algorithm reference`);
  }

  const block = blockFor(source, slug);
  assert.match(block, /inspect real Trivium clocking/);
  assert.match(block, /audit editable Boolean combiners/);
  assert.match(block, /execute toy-oracle cube sums that recover affine superpolys/);
  assert.match(block, /reverse-engineered historical A5\/1 majority clocking/);
  assert.match(block, /bounded leaked-state completion/);
  const chips = chipsFor(source, slug);
  assert.ok(chips.includes('Trivium'), 'The learner-facing card must expose its Trivium lesson');
  assert.ok(chips.includes('Boolean Function Audit'), 'The learner-facing card must expose the Boolean audit');
  assert.ok(chips.includes('Cube Sums'), 'The learner-facing card must expose the cube-sum lesson');
  assert.ok(chips.includes('Superpolys'), 'The learner-facing card must expose superpoly recovery');
  assert.ok(chips.includes('Historical A5/1'), 'The learner-facing card must identify the historical cipher');
  assert.ok(chips.includes('Majority Clocking'), 'The learner-facing card must expose irregular clocking');

  const sourceReview = reviewed[slug];
  assert.equal(sourceReview.commit, 'c4ef2da4b33fd08382a4309d9665745cb30bbda5');
  assert.deepEqual(sourceReview.add, [
    'A5/1@src/a51/a51.ts:125',
    'Trivium@src/trivium/trivium.ts:29',
  ]);
  assert.deepEqual(sourceReview.remove, ['Brute force', 'Known-plaintext attack']);
  assert.match(sourceReview.implementation, /historical A5\/1/);
  assert.match(sourceReview.implementation, /bounded state completion/);
  assert.match(sourceReview.note, /Independently transcribed setup code derives the post-key, post-COUNT and post-100 checkpoint states/);
  assert.match(sourceReview.note, /matches the two published consecutive 114-bit bursts/);
  assert.match(sourceReview.note, /separate controller-state comparison/);
  assert.match(sourceReview.note, /masked 52-bit disclosure, copied observations, clock model and run identifier/);
  assert.match(sourceReview.note, /no full hidden state or Kc/);
  assert.match(sourceReview.note, /not a published A5\/1 attack/);
  assert.match(sourceReview.note, /does not recover Kc/);
  for (const claimSource of [opening, sourceReview.note]) {
    assert.match(claimSource,
      /literal Brute force scanner hit appears only in the independent unit-test oracle/);
    assert.match(claimSource,
      /Panel 09 separately exhausts 2\^12 state completions under disclosure of 52 exact post-100 state bits/);
    assert.match(claimSource,
      /bounded state completion, not as a generic brute-force attack or A5\/1\/Kc attack/);
    assert.match(claimSource,
      /Known plaintext\/ciphertext remains prose[\s\S]*is not an attack workflow executed by this lab/);
  }

  const review = manifest.labs[slug];
  assert.equal(review.commit, 'c4ef2da4b33fd08382a4309d9665745cb30bbda5');
  assert.equal(review.reviewScope, 'complete');
  assert.equal(review.exhibits.length, 9);
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
  const cube = review.exhibits.find(exhibit => exhibit.id === 'cube-superpoly-recovery');
  assert.ok(cube);
  for (const anchor of [
    'src/cube/oracle.ts:15',
    'src/cube/oracle.ts:33',
    'src/cube/analysis.ts:105',
    'src/cube/analysis.ts:143',
    'src/cube/analysis.ts:176',
    'src/cube/analysis.ts:209',
    'src/cube/panel.ts:19',
    'src/cube/panel.ts:45',
    'src/cube/panel.ts:135',
    'src/cube/panel.ts:143',
    'src/cube/panel.ts:145',
    'src/cube/panel.ts:146',
  ]) assert.ok(cube.evidence.includes(anchor), `Missing cube-attack evidence ${anchor}`);
  assert.match(cube.outcome, /8 → 4 → 2 → 1 to key 110/);
  assert.match(cube.outcome, /C34 remains a valid cube with a quadratic superpoly/);
  assert.match(cube.outcome, /flipping C13 recovers 000 before held-outs reject it/);
  assert.match(cube.limits, /three-secret\/four-public degree-four toy oracle/);
  assert.match(cube.limits, /C34 is a valid cube whose quadratic superpoly is not a maxterm/);
  assert.match(cube.limits, /executes no Trivium state or round/);

  const a51 = review.exhibits.find(exhibit => exhibit.id === 'historical-a51');
  assert.ok(a51);
  for (const anchor of [
    'src/a51/a51.ts:16',
    'src/a51/a51.ts:94',
    'src/a51/a51.ts:113',
    'src/a51/a51.ts:125',
    'src/a51/a51.ts:139',
    'src/a51/a51.ts:158',
    'src/a51/a51.ts:182',
    'src/a51/recovery.ts:7',
    'src/a51/recovery.ts:58',
    'src/a51/recovery.ts:107',
    'src/a51/panel.ts:91',
    'src/a51/panel.ts:105',
    'src/a51/panel.ts:117',
  ]) assert.ok(a51.evidence.includes(anchor), `Missing historical A5/1 evidence ${anchor}`);
  assert.equal(a51.execution, 'real-crypto');
  assert.match(a51.action, /derive the post-key, post-COUNT and post-100 checkpoints/);
  assert.match(a51.action, /reproduce both 114-bit burst values/);
  assert.match(a51.outcome, /three derived setup checkpoints/);
  assert.match(a51.outcome, /candidate 1425/);
  assert.match(a51.outcome, /held-out bits before a separate controller-state comparison/);
  assert.match(a51.outcome, /Sixteen observations leave 11 completions/);
  assert.match(a51.outcome, /regular-clock model leaves none after two bits/);
  assert.match(a51.outcome, /candidate 1409/);
  assert.match(a51.outcome, /11 held-out mismatches reject it/);
  assert.match(a51.limits, /reverse-engineered historical BGW version/);
  assert.match(a51.limits, /52 exact post-100 state bits/);
  assert.match(a51.limits, /not proved reachable from Kc setup/);
  assert.match(a51.limits, /not a published A5\/1 attack/);
  assert.match(a51.limits, /does not recover Kc/);
  assert.match(a51.limits, /nothing about modern cellular encryption/);
}

test('LFSR Forge publishes historical A5/1, Trivium and exact Boolean analysis without false credits', () => {
  checkLfsrForgeScope(html);
});

test('LFSR Forge scope controls reject lost, moved, hidden or invented credit', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-lfsr-forge\/"[\s\S]*?<\/a>/;
  for (const changed of [
    html.replace(cardRe, card => card.replace(/A5\/1@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, card => card.replace('A5/1@src/a51/a51.ts:125', 'A5/1@src/a51/a51.ts:124')),
    html.replace(cardRe, card => card.replace(/Trivium@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, card => card.replace('Trivium@src/trivium/trivium.ts:29', 'Trivium@src/trivium/trivium.ts:28')),
    html.replace(cardRe, card => card.replace(/Cube attack@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, card => card.replace('Cube attack@src/cube/panel.ts:24', 'Cube attack@src/cube/panel.ts:45')),
    html.replace(cardRe, card => card.replace('data-attacks="Cube attack@src/cube/panel.ts:24 | Key recovery@src/trivium/panel.ts:37"',
      'data-attacks="Brute force@README.md:80 | Cube attack@src/cube/panel.ts:24 | Key recovery@src/trivium/panel.ts:37 | Known-plaintext attack@src/main.ts:140"')),
    html.replace(cardRe, card => card.replace('data-references="', 'data-references="Pairing | RC4 | Shamir secret sharing | ')),
    html.replace(cardRe, card => card.replace('c4ef2da4b33fd08382a4309d9665745cb30bbda5', '66d95370b0a3f5bb6641d349b5bdb1135b3ad8a4')),
    html.replace(cardRe, card => card.replace(' | HISTORICAL', '')),
    html.replace(cardRe, card => card.replace('<span class="chip">Trivium</span>', '')),
    html.replace(cardRe, card => card.replace('<span class="chip">Boolean Function Audit</span>', '')),
    html.replace(cardRe, card => card.replace('<span class="chip">Cube Sums</span>', '')),
    html.replace(cardRe, card => card.replace('<span class="chip">Superpolys</span>', '')),
    html.replace(cardRe, card => card.replace('<span class="chip">Historical A5/1</span>', '')),
    html.replace(cardRe, card => card.replace('<span class="chip">Majority Clocking</span>', '')),
    html.replace(cardRe, card => card.replace('execute toy-oracle cube sums that recover affine superpolys', 'describe cube terminology')),
    html.replace(cardRe, card => card.replace('reverse-engineered historical A5/1 majority clocking', 'a cellular cipher')),
    html.replace(cardRe, card => card.replace('bounded leaked-state completion', 'key recovery')),
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

  const missingCube = JSON.parse(JSON.stringify(exhibitManifest));
  missingCube.labs['crypto-lab-lfsr-forge'].exhibits = missingCube.labs['crypto-lab-lfsr-forge'].exhibits
    .filter(exhibit => exhibit.id !== 'cube-superpoly-recovery');
  assert.throws(() => checkLfsrForgeScope(html, missingCube), assert.AssertionError);

  const mislabeledCube = JSON.parse(JSON.stringify(exhibitManifest));
  const cube = mislabeledCube.labs['crypto-lab-lfsr-forge'].exhibits
    .find(exhibit => exhibit.id === 'cube-superpoly-recovery');
  cube.limits = cube.limits.replace('executes no Trivium state or round', 'executes reduced-round Trivium');
  assert.throws(() => checkLfsrForgeScope(html, mislabeledCube), assert.AssertionError);

  const missingA51 = JSON.parse(JSON.stringify(exhibitManifest));
  missingA51.labs['crypto-lab-lfsr-forge'].exhibits = missingA51.labs['crypto-lab-lfsr-forge'].exhibits
    .filter(exhibit => exhibit.id !== 'historical-a51');
  assert.throws(() => checkLfsrForgeScope(html, missingA51), assert.AssertionError);

  const missingA51Checkpoint = JSON.parse(JSON.stringify(exhibitManifest));
  const a51 = missingA51Checkpoint.labs['crypto-lab-lfsr-forge'].exhibits
    .find(exhibit => exhibit.id === 'historical-a51');
  a51.evidence = a51.evidence.filter(anchor => anchor !== 'src/a51/a51.ts:182');
  assert.throws(() => checkLfsrForgeScope(html, missingA51Checkpoint), assert.AssertionError);

  const overclaimedA51 = JSON.parse(JSON.stringify(exhibitManifest));
  overclaimedA51.labs['crypto-lab-lfsr-forge'].exhibits
    .find(exhibit => exhibit.id === 'historical-a51').limits = 'A published A5/1 attack recovers Kc.';
  assert.throws(() => checkLfsrForgeScope(html, overclaimedA51), assert.AssertionError);

  const missingReviewedA51 = JSON.parse(JSON.stringify(catalogReviewed));
  missingReviewedA51['crypto-lab-lfsr-forge'].add = ['Trivium@src/trivium/trivium.ts:29'];
  assert.throws(
    () => checkLfsrForgeScope(html, exhibitManifest, missingReviewedA51),
    assert.AssertionError,
  );

  const blurredPublicationBoundary = JSON.parse(JSON.stringify(catalogReviewed));
  blurredPublicationBoundary['crypto-lab-lfsr-forge'].note = blurredPublicationBoundary['crypto-lab-lfsr-forge'].note
    .replace(
      'Independently transcribed setup code derives the post-key, post-COUNT and post-100 checkpoint states',
      'The published source supplies the three internal checkpoint states',
    );
  assert.throws(
    () => checkLfsrForgeScope(html, exhibitManifest, blurredPublicationBoundary),
    assert.AssertionError,
  );
});

test('historical A5/1 and Montgomery multiplication vocabulary stays narrow', () => {
  const a51 = ALGORITHMS.find(term => term.name === 'A5/1');
  assert.ok(a51);
  assert.equal(a51.std, null);
  for (const spelling of ['A5/1', 'A5-1', 'A5_1', 'A51']) assert.ok(a51.re.test(spelling));
  for (const falseMatch of ['A5/2', 'A5/10', 'A51x', 'A5', 'SHA51'])
    assert.equal(a51.re.test(falseMatch), false);
  assert.ok(a51.chipRe.test('Historical A5/1'));
  assert.equal(a51.chipRe.test('Historical A5/2'), false);

  const montgomery = ALGORITHMS.find(term => term.name === 'Montgomery multiplication');
  assert.ok(montgomery);
  assert.equal(montgomery.std, null);
  for (const spelling of ['Montgomery multiplication', 'montgomeryMultiply', 'Montgomery reduction', 'REDC'])
    assert.ok(montgomery.re.test(spelling));
  for (const falseMatch of ['Montgomery ladder', 'Montgomery curve'])
    assert.equal(montgomery.re.test(falseMatch), false);
  assert.ok(montgomery.chipRe.test('Montgomery REDC'));
  assert.equal(montgomery.chipRe.test('Montgomery ladder'), false);
});

function checkClockArithmeticScope(source, manifest = exhibitManifest, reviewed = catalogReviewed) {
  const slug = 'crypto-lab-clock-arithmetic';
  assert.deepEqual(implementationsFor(source, slug), [
    'Diffie-Hellman',
    'Montgomery multiplication',
  ]);
  assert.deepEqual(attacksFor(source, slug), [],
    'Bounded enumeration, trial division and historical CRT-fault prose are not attack exhibits');

  const opening = openingFor(source, slug);
  assert.match(opening, /data-review-commit="e6e1e39b124c877fd17c5d9b0a3fa03a070dfd6e"/);
  assert.match(opening, /Diffie-Hellman@src\/nt\/toyDh\.ts:26/,
    'Diffie-Hellman credit must anchor at the executable toy exchange');
  assert.match(opening, /Montgomery multiplication@src\/nt\/montgomery\.ts:96/,
    'Montgomery credit must anchor at the executed REDC implementation');
  assert.doesNotMatch(opening, /\bdata-attacks=/);
  const references = referencesFor(source, slug);
  assert.ok(references.includes('Montgomery ladder'),
    'The learner-facing distinction may retain Montgomery ladder as a reference');
  assert.equal(references.includes('Montgomery multiplication'), false,
    'The executed construction belongs in implementations, not references');

  const block = blockFor(source, slug);
  assert.match(block, /exact BigInt arithmetic under RSA and finite-field Diffie–Hellman/);
  assert.match(block, /encode, multiply and square through Montgomery REDC/);
  assert.match(block, /cancellation, radix shifts, final subtraction and bounded fixed-work timings/);
  assert.ok(chipsFor(source, slug).includes('Montgomery REDC'));

  const sourceReview = reviewed[slug];
  assert.equal(sourceReview.commit, 'e6e1e39b124c877fd17c5d9b0a3fa03a070dfd6e');
  assert.equal(sourceReview.reviewed, '2026-10-25');
  assert.deepEqual(sourceReview.add, [
    'Diffie-Hellman@src/nt/toyDh.ts:26',
    'Montgomery multiplication@src/nt/montgomery.ts:96',
  ]);
  assert.deepEqual(sourceReview.remove, [
    'Brute force',
    'Discrete log',
    'Factoring',
    'Fault injection',
    'Man-in-the-middle',
  ]);
  assert.equal(sourceReview.implementation,
    'hand-rolled exact BigInt arithmetic, including power-of-two Montgomery REDC');
  assert.match(sourceReview.note, /power-of-two Montgomery specialization for odd N at most 10\^12/);
  assert.match(sourceReview.note, /N=9, R=16 fixture exposes candidate 9 before subtraction to 0/);
  assert.match(sourceReview.note, /same 4,096-operation alternating multiply\/square schedule/);
  assert.match(sourceReview.note,
    /not a benchmark, a speedup claim or evidence of constant-time behavior/);
  assert.match(sourceReview.note, /Montgomery multiplication is distinct from the Montgomery ladder/);
  assert.match(sourceReview.note,
    /software CRT faults and adjacent algorithms occur only in historical handoff prose or related links/);

  const review = manifest.labs[slug];
  assert.equal(review.commit, 'b97b515033e235b05f55cc461bb454cf88c003b5');
  assert.equal(review.reviewed, '2026-10-25');
  assert.equal(review.reviewScope, 'complete');
  assert.equal(review.exhibits.length, 7);

  const expectedLegacyEvidence = {
    'wrap-around': [
      'src/main.ts:15',
      'src/main.ts:29',
      'src/ui/act1.ts:10',
      'src/ui/act1.ts:25',
      'src/main.ts:323',
      'src/worker.ts:12',
    ],
    'inverse-euclid': [
      'src/main.ts:35',
      'src/main.ts:42',
      'src/main.ts:44',
      'src/ui/act2.ts:9',
      'src/ui/act2.ts:19',
      'src/ui/act2.ts:32',
      'src/main.ts:323',
    ],
    'euler-units': [
      'src/main.ts:51',
      'src/main.ts:62',
      'src/ui/act3.ts:9',
      'src/ui/act3.ts:15',
      'src/ui/act3.ts:17',
      'src/main.ts:323',
    ],
    'power-cycles': [
      'src/main.ts:70',
      'src/main.ts:79',
      'src/main.ts:80',
      'src/ui/act4.ts:17',
      'src/ui/act4.ts:21',
      'src/ui/act4.ts:44',
      'src/ui/act4.ts:49',
      'src/ui/clock.ts:41',
      'src/main.ts:323',
    ],
    'subgroups-dh': [
      'src/nt/toyDh.ts:26',
      'src/main.ts:86',
      'src/main.ts:115',
      'src/main.ts:116',
      'src/main.ts:117',
      'src/ui/act5.ts:13',
      'src/ui/act5.ts:15',
      'src/ui/act5.ts:16',
      'src/ui/act5.ts:17',
      'src/ui/act5.ts:29',
      'src/ui/act5.ts:31',
      'src/ui/act5.ts:35',
      'src/ui/act5.ts:36',
      'src/main.ts:323',
    ],
    'crt-recombine': [
      'src/main.ts:123',
      'src/main.ts:135',
      'src/main.ts:136',
      'src/ui/act6.ts:8',
      'src/ui/act6.ts:24',
      'src/ui/act6.ts:52',
      'src/ui/act6.ts:62',
      'src/main.ts:323',
      'src/ui/act6.ts:80',
    ],
  };
  for (const [id, evidence] of Object.entries(expectedLegacyEvidence)) {
    const exhibit = review.exhibits.find(candidate => candidate.id === id);
    assert.ok(exhibit, `Missing Clock Arithmetic exhibit ${id}`);
    assert.deepEqual(exhibit.evidence, evidence,
      `${id} must use semantic anchors from the merged seven-exhibit source`);
  }

  const montgomery = review.exhibits.find(exhibit => exhibit.id === 'montgomery-redc');
  assert.ok(montgomery);
  assert.equal(montgomery.execution, 'real-values');
  for (const anchor of [
    'src/main.ts:140',
    'src/main.ts:163',
    'src/nt/montgomery.ts:69',
    'src/nt/montgomery.ts:76',
    'src/nt/montgomery.ts:96',
    'src/nt/montgomery.ts:123',
    'src/nt/montgomery.ts:153',
    'src/nt/montgomery.ts:176',
    'src/nt/montgomery.ts:196',
    'src/nt/montgomery.ts:213',
    'src/ui/act7.ts:22',
    'src/ui/act7.ts:93',
    'src/ui/act7.ts:98',
    'src/ui/act7.ts:100',
    'src/ui/act7.ts:130',
    'src/ui/act7.ts:138',
    'src/ui/act7.ts:143',
    'src/ui/act7.ts:157',
    'src/ui/act7.ts:165',
    'src/ui/predictions.ts:40',
    'src/worker.ts:12',
  ]) assert.ok(montgomery.evidence.includes(anchor), `Missing Montgomery evidence ${anchor}`);
  assert.match(montgomery.action, /fixed 4,096-operation ordinary\/Montgomery comparison/);
  assert.match(montgomery.outcome, /N = 17 and R = 32/);
  assert.match(montgomery.outcome, /N′ = 15/);
  assert.match(montgomery.outcome, /keeps \(a·b\)²·a encoded to result 12/);
  assert.match(montgomery.outcome, /N = 9 and R = 16 expose raw candidate 9/);
  assert.match(montgomery.outcome, /both fixed schedules agree/);
  assert.match(montgomery.limits, /odd N at most 10\^12/);
  assert.match(montgomery.limits, /neither a general performance result nor constant-time behavior/);
  assert.match(montgomery.limits, /JavaScript BigInt is not constant-time/);
  assert.match(montgomery.limits, /distinct from the Montgomery ladder/);
}

test('Clock Arithmetic publishes executable Montgomery REDC without inherited false attack credit', () => {
  checkClockArithmeticScope(html);
});

test('Clock Arithmetic scope controls reject lost, stale, moved or invented credit', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-clock-arithmetic\/"[\s\S]*?<\/a>/;
  for (const changed of [
    html.replace(cardRe, card => card.replace(
      ' | Montgomery multiplication@src/nt/montgomery.ts:96',
      '',
    )),
    html.replace(cardRe, card => card.replace(
      'Montgomery multiplication@src/nt/montgomery.ts:96',
      'Montgomery multiplication@src/nt/montgomery.ts:95',
    )),
    html.replace(cardRe, card => card.replace(
      'Montgomery multiplication@src/nt/montgomery.ts:96',
      'Montgomery multiplication@src/nt/montgomery.ts:96 | Montgomery ladder@src/ui/act7.ts:165',
    )),
    html.replace(cardRe, card => card.replace(
      '            data-standards="IETF"',
      '            data-attacks="Fault injection@catalog-handoff.md:67"\n            data-standards="IETF"',
    )),
    html.replace(cardRe, card => card.replace(
      'e6e1e39b124c877fd17c5d9b0a3fa03a070dfd6e',
      '5bb86840fab4806e3681c1a378fd4c643831035d',
    )),
    html.replace(cardRe, card => card.replace('<span class="chip">Montgomery REDC</span>', '')),
    html.replace(cardRe, card => card.replace(
      'encode, multiply and square through Montgomery REDC',
      'read about Montgomery arithmetic',
    )),
    html.replace(cardRe, card => card.replace(
      'cancellation, radix shifts, final subtraction and bounded fixed-work timings',
      'implementation details',
    )),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the Clock Arithmetic card');
    assert.throws(() => checkClockArithmeticScope(changed), assert.AssertionError);
  }

  const missingMontgomery = JSON.parse(JSON.stringify(exhibitManifest));
  missingMontgomery.labs['crypto-lab-clock-arithmetic'].exhibits =
    missingMontgomery.labs['crypto-lab-clock-arithmetic'].exhibits
      .filter(exhibit => exhibit.id !== 'montgomery-redc');
  assert.throws(() => checkClockArithmeticScope(html, missingMontgomery), assert.AssertionError);

  for (const anchor of [
    'src/nt/montgomery.ts:96',
    'src/ui/act7.ts:100',
    'src/ui/act7.ts:130',
    'src/ui/act7.ts:143',
    'src/ui/act7.ts:157',
  ]) {
    const missingEvidence = JSON.parse(JSON.stringify(exhibitManifest));
    const exhibit = missingEvidence.labs['crypto-lab-clock-arithmetic'].exhibits
      .find(candidate => candidate.id === 'montgomery-redc');
    exhibit.evidence = exhibit.evidence.filter(candidate => candidate !== anchor);
    assert.throws(() => checkClockArithmeticScope(html, missingEvidence), assert.AssertionError);
  }

  const staleLegacyAnchor = JSON.parse(JSON.stringify(exhibitManifest));
  const euler = staleLegacyAnchor.labs['crypto-lab-clock-arithmetic'].exhibits
    .find(exhibit => exhibit.id === 'euler-units');
  euler.evidence = euler.evidence.map(anchor => anchor === 'src/main.ts:51'
    ? 'src/main.ts:69'
    : anchor);
  assert.throws(() => checkClockArithmeticScope(html, staleLegacyAnchor), assert.AssertionError);

  const overclaimedTiming = JSON.parse(JSON.stringify(exhibitManifest));
  overclaimedTiming.labs['crypto-lab-clock-arithmetic'].exhibits
    .find(exhibit => exhibit.id === 'montgomery-redc').limits =
      'The benchmark proves a constant-time speedup over ordinary modular arithmetic.';
  assert.throws(() => checkClockArithmeticScope(html, overclaimedTiming), assert.AssertionError);

  const missingReviewedMontgomery = JSON.parse(JSON.stringify(catalogReviewed));
  missingReviewedMontgomery['crypto-lab-clock-arithmetic'].add = [
    'Diffie-Hellman@src/nt/toyDh.ts:26',
  ];
  assert.throws(
    () => checkClockArithmeticScope(html, exhibitManifest, missingReviewedMontgomery),
    assert.AssertionError,
  );

  const creditedHistoricalFault = JSON.parse(JSON.stringify(catalogReviewed));
  creditedHistoricalFault['crypto-lab-clock-arithmetic'].remove =
    creditedHistoricalFault['crypto-lab-clock-arithmetic'].remove
      .filter(name => name !== 'Fault injection');
  assert.throws(
    () => checkClockArithmeticScope(html, exhibitManifest, creditedHistoricalFault),
    assert.AssertionError,
  );

  const blurredLadderBoundary = JSON.parse(JSON.stringify(catalogReviewed));
  blurredLadderBoundary['crypto-lab-clock-arithmetic'].note =
    blurredLadderBoundary['crypto-lab-clock-arithmetic'].note
      .replace(
        'Montgomery multiplication is distinct from the Montgomery ladder.',
        'Montgomery arithmetic includes the Montgomery ladder.',
      );
  assert.throws(
    () => checkClockArithmeticScope(html, exhibitManifest, blurredLadderBoundary),
    assert.AssertionError,
  );
});

test('cube-attack vocabulary credits execution but rejects a negated full-Trivium claim', () => {
  const term = ATTACKS.find(entry => entry.name === 'Cube attack');
  assert.ok(term);
  assert.ok(term.re.test('cube attack'));
  assert.ok(term.re.test('cube-attacks'));
  assert.equal(term.re.test('hypercube attack'), false);
  assert.equal(attackContextAllows(term,
    'This companion lesson executes the two phases of a cube attack on a deliberately tiny, inspectable oracle.'), true);
  assert.equal(attackContextAllows(term,
    'This page executes only the zero-round linear attack, not a cube attack.'), false);
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
  assert.match(card, /data-review-commit="2ecc6612c2602c0f01ac9869fb07c589c5c9bc91"/);
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
    'crypto-lab-matsui-line': [
      'Chosen-plaintext attack',
      'Differential cryptanalysis',
      'Key recovery',
      'Known-plaintext attack',
      'Linear cryptanalysis',
    ],
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
    ['crypto-lab-matsui-line', 'attacks', 'Fault injection@README.md:102'],
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

function checkMatsuiAd14Scope(source, manifest = exhibitManifest, reviewed = catalogReviewed) {
  const slug = 'crypto-lab-matsui-line';
  const opening = openingFor(source, slug);
  const block = blockFor(source, slug);
  assert.deepEqual(attacksFor(source, slug), [
    'Chosen-plaintext attack',
    'Differential cryptanalysis',
    'Key recovery',
    'Known-plaintext attack',
    'Linear cryptanalysis',
  ]);
  assert.match(opening, /data-review-commit="7a85fbf1e6f566f7b0b718cb93f5dd737950faaa"/);
  assert.ok(!referencesFor(source, slug).includes('Shamir secret sharing'),
    'Biham and Shamir names authors here; it is not a secret-sharing reference');
  assert.match(block, /join a chosen-difference prefix to a parity suffix/);
  assert.match(block, /rank a last-round whitening byte/);
  assert.deepEqual(chipsFor(source, slug), [
    'Linear Cryptanalysis',
    'LAT',
    'Piling-Up Lemma',
    'Known-Plaintext',
    'Multiple Masks',
    'Differential Cryptanalysis',
  ]);

  const sourceReview = reviewed[slug];
  assert.equal(sourceReview.commit, '7a85fbf1e6f566f7b0b718cb93f5dd737950faaa');
  assert.deepEqual(sourceReview.remove, ['Brute force', 'Fault injection']);
  assert.deepEqual(sourceReview.removeReferences, ['Shamir secret sharing']);
  assert.deepEqual(sourceReview.addAttacks, [
    'Chosen-plaintext attack@src/crypto/difflin.ts:310',
    'Differential cryptanalysis@src/crypto/difflin.ts:136',
    'Key recovery@src/crypto/attack.ts:159',
    'Known-plaintext attack@src/crypto/attack.ts:46',
    'Linear cryptanalysis@src/crypto/attack.ts:159',
  ]);

  const mapped = manifest.labs[slug];
  assert.equal(mapped.commit, '7a85fbf1e6f566f7b0b718cb93f5dd737950faaa');
  assert.equal(mapped.reviewScope, 'complete');
  assert.equal(mapped.exhibits.length, 11);
  const composition = mapped.exhibits.find(exhibit => exhibit.id === 'differential-linear-composition');
  assert.ok(composition);
  assert.equal(composition.execution, 'real-operation');
  assert.equal(composition.section, 'Weld the two attacks together');
  for (const anchor of [
    'src/crypto/difflin.ts:136',
    'src/crypto/difflin.ts:310',
    'src/crypto/difflin.ts:419',
    'src/ui/difflin.ts:344',
    'src/workers/dl.worker.ts:24',
  ]) {
    assert.ok(composition.evidence.includes(anchor), `A-D-14 must retain evidence ${anchor}`);
  }
  assert.ok(composition.concepts.includes('explicit joining state'));
  assert.ok(composition.concepts.includes('failing-assumption control'));
  assert.match(composition.limits, /does not recover the 16-bit master key/);
  assert.match(composition.limits, /full four-round toy cipher/);
  assert.match(composition.limits, /deterministic 512-key sample/);
  const fidelity = mapped.exhibits.find(exhibit => exhibit.id === 'fidelity');
  assert.ok(fidelity.concepts.includes('heuristic boundary'));
  assert.match(fidelity.outcome, /legacy linear attack recovers four final-subkey bits/);
  assert.match(fidelity.outcome, /differential–linear route ranks a final whitening byte/);
  assert.match(fidelity.limits, /does not recover the master key/);
  assert.match(fidelity.limits, /production cryptography/);
}

test('Matsui Line credits the executable A-D-14 composition with bounded claims', () => {
  checkMatsuiAd14Scope(html);
});

test('Matsui Line A-D-14 controls reject lost credit, stale pins and weakened limits', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-matsui-line\/"[\s\S]*?<\/a>/;
  const mutations = [
    html.replace(cardRe, card => card.replace(
      /Chosen-plaintext attack@src\/crypto\/difflin\.ts:310\s*\|\s*/, '')),
    html.replace(cardRe, card => card.replace(
      'Linear cryptanalysis@src/crypto/attack.ts:159',
      'Linear cryptanalysis@src/crypto/attack.ts:159 | Brute force@README.md:100')),
    html.replace(cardRe, card => card.replace(
      'data-references="AES', 'data-references="Shamir secret sharing | AES')),
    html.replace(cardRe, card => card.replace(
      '7a85fbf1e6f566f7b0b718cb93f5dd737950faaa',
      'e218f2e71938d1514cbfde224fc61b1d68fc2e3a')),
    html.replace(cardRe, card => card.replace(
      'join a chosen-difference prefix to a parity suffix',
      'compare only linear trails')),
    html.replace(cardRe, card => card.replace(
      '<span class="chip">Differential Cryptanalysis</span>', '')),
  ];
  for (const changed of mutations) {
    assert.notEqual(changed, html, 'Matsui negative control must change its card');
    assert.throws(() => checkMatsuiAd14Scope(changed), assert.AssertionError);
  }

  const missingExhibit = JSON.parse(JSON.stringify(exhibitManifest));
  missingExhibit.labs['crypto-lab-matsui-line'].exhibits =
    missingExhibit.labs['crypto-lab-matsui-line'].exhibits
      .filter(exhibit => exhibit.id !== 'differential-linear-composition');
  assert.throws(() => checkMatsuiAd14Scope(html, missingExhibit), assert.AssertionError);

  const missingAnchor = JSON.parse(JSON.stringify(exhibitManifest));
  const composition = missingAnchor.labs['crypto-lab-matsui-line'].exhibits
    .find(exhibit => exhibit.id === 'differential-linear-composition');
  composition.evidence = composition.evidence.filter(anchor => anchor !== 'src/crypto/difflin.ts:310');
  assert.throws(() => checkMatsuiAd14Scope(html, missingAnchor), assert.AssertionError);

  const overclaim = JSON.parse(JSON.stringify(exhibitManifest));
  overclaim.labs['crypto-lab-matsui-line'].exhibits
    .find(exhibit => exhibit.id === 'differential-linear-composition').limits =
      'This recovers the full key of a production cipher.';
  assert.throws(() => checkMatsuiAd14Scope(html, overclaim), assert.AssertionError);

  const staleFidelity = JSON.parse(JSON.stringify(exhibitManifest));
  staleFidelity.labs['crypto-lab-matsui-line'].exhibits
    .find(exhibit => exhibit.id === 'fidelity').outcome =
      'The text limits the result to four final-subkey bits of the toy cipher.';
  assert.throws(() => checkMatsuiAd14Scope(html, staleFidelity), assert.AssertionError);

  const staleReview = JSON.parse(JSON.stringify(catalogReviewed));
  staleReview['crypto-lab-matsui-line'].commit = 'e218f2e71938d1514cbfde224fc61b1d68fc2e3a';
  assert.throws(() => checkMatsuiAd14Scope(html, exhibitManifest, staleReview), assert.AssertionError);
});

function checkHiddenBitS09Scope(source, manifest = exhibitManifest) {
  const slug = 'crypto-lab-hidden-bit';
  const block = blockFor(source, slug);
  assert.match(block, /compare target-before-key with key-first collision games/);
  assert.ok(chipsFor(source, slug).includes('Target Collision'));
  assert.ok(!implementationsFor(source, slug).includes('UOWHF'),
    'The finite order game is not a UOWHF construction credit');
  assert.doesNotMatch(openingFor(source, slug), /UOWHF@/);

  const mapped = manifest.labs[slug];
  assert.equal(mapped.commit, '2f1ea68ada54b88a89ccb0ae2c026eccabd37a83');
  assert.equal(mapped.reviewScope, 'complete');
  assert.equal(mapped.exhibits.length, 9);
  const tcr = mapped.exhibits.find(exhibit => exhibit.id === 'target-collision-order');
  assert.ok(tcr);
  assert.equal(tcr.execution, 'real-operation');
  assert.equal(tcr.section, 'The same family, two orders of play');
  assert.match(tcr.action, /target-before-key and key-first state machines/);
  assert.match(tcr.outcome, /2-of-256 target-first and 256-of-256 key-first/);
  assert.match(tcr.outcome, /signed \(key, digest\) application boundary/);
  for (const anchor of [
    'index.html:164',
    'src/ui/tcr.ts:61',
    'src/ui/tcr.ts:175',
    'src/game/tcr.ts:128',
    'src/game/tcr.ts:221',
    'src/game/tcr.ts:330',
    'src/game/tcr.ts:412',
    'src/game/tcr.ts:531',
  ]) {
    assert.ok(tcr.evidence.includes(anchor), `S09 must retain evidence ${anchor}`);
  }
  assert.match(tcr.limits, /not a UOWHF construction/);
  assert.match(tcr.limits, /not .* asymptotic separation/);
  assert.match(tcr.limits, /not .* evidence about a real hash/);
  assert.match(tcr.limits, /does not establish malicious-signer non-repudiation/);
}

test('Hidden Bit records S09 order-of-play evidence without claiming a UOWHF construction', () => {
  checkHiddenBitS09Scope(html);
});

test('Hidden Bit S09 controls reject lost order credit, stale pins and weakened limits', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-hidden-bit\/"[\s\S]*?<\/a>/;
  for (const changed of [
    html.replace(cardRe, card => card.replace('compare target-before-key with key-first collision games', 'compare collision games')),
    html.replace(cardRe, card => card.replace('<span class="chip">Target Collision</span>', '')),
    html.replace(cardRe, card => card.replace('data-implements="', 'data-implements="UOWHF@src/game/tcr.ts:1 | ')),
  ]) {
    assert.notEqual(changed, html, 'S09 negative control must change its card');
    assert.throws(() => checkHiddenBitS09Scope(changed), assert.AssertionError);
  }

  const stale = structuredClone(exhibitManifest);
  stale.labs['crypto-lab-hidden-bit'].commit = '7f143a4e94038a534198c3f69af8d93ccedd86c1';
  assert.throws(() => checkHiddenBitS09Scope(html, stale), assert.AssertionError);

  const missingCount = structuredClone(exhibitManifest);
  missingCount.labs['crypto-lab-hidden-bit'].exhibits
    .find(exhibit => exhibit.id === 'target-collision-order').outcome =
      'Compare the two orders with a bounded sample.';
  assert.throws(() => checkHiddenBitS09Scope(html, missingCount), assert.AssertionError);

  const missingAnchor = structuredClone(exhibitManifest);
  const tcr = missingAnchor.labs['crypto-lab-hidden-bit'].exhibits
    .find(exhibit => exhibit.id === 'target-collision-order');
  tcr.evidence = tcr.evidence.filter(anchor => anchor !== 'src/game/tcr.ts:531');
  assert.throws(() => checkHiddenBitS09Scope(html, missingAnchor), assert.AssertionError);

  const overclaim = structuredClone(exhibitManifest);
  overclaim.labs['crypto-lab-hidden-bit'].exhibits
    .find(exhibit => exhibit.id === 'target-collision-order').limits =
      'This constructs a secure UOWHF and proves an asymptotic separation.';
  assert.throws(() => checkHiddenBitS09Scope(html, overclaim), assert.AssertionError);
});

function checkSumcheckGkrScope(source, manifest = exhibitManifest) {
  const slug = 'crypto-lab-zk-proof-lab';
  const opening = openingFor(source, slug);
  const block = blockFor(source, slug);
  assert.deepEqual(implementationsFor(source, slug), [
    'Fiat-Shamir',
    'GKR',
    'Miller–Rabin',
    'RSA',
    'RSA-PSS',
    'Schnorr',
    'SHA-256',
    'Sum-check',
  ]);
  assert.match(opening, /GKR@js\/gkr\.js:207/);
  assert.match(opening, /Sum-check@js\/sumcheck\.js:89/);
  assert.match(block, /Eight exhibits from Ali Baba cave to exact interactive proofs/);
  assert.match(block, /interactive verifiable computation, not zero knowledge or a SNARK/);
  assert.ok(chipsFor(source, slug).includes('Sum-check'));
  assert.ok(chipsFor(source, slug).includes('GKR'));

  const mapped = manifest.labs[slug];
  assert.equal(mapped.commit, 'df4db000b0c8ec2ecbc33fea39505de42f036a4e');
  assert.equal(mapped.reviewScope, 'complete');
  assert.equal(mapped.exhibits.length, 10);
  const lesson = mapped.exhibits.find(exhibit => exhibit.id === 'sumcheck-gkr');
  assert.ok(lesson);
  assert.equal(lesson.execution, 'real-operation');
  assert.equal(lesson.section, 'Sum-check and a GKR layer walk');
  assert.match(lesson.outcome, /every round polynomial, degree and recurrence check/);
  assert.match(lesson.outcome, /post-message challenge and direct final evaluation/);
  assert.match(lesson.outcome, /two wiring-identity reductions/);
  assert.match(lesson.outcome, /terminal multilinear-extension evaluation/);
  for (const anchor of [
    'index.html:238',
    'exhibits/sumcheck-gkr.html:66',
    'exhibits/sumcheck-gkr.html:216',
    'js/sumcheck.js:89',
    'js/sumcheck.js:308',
    'js/sumcheck.js:513',
    'js/gkr.js:87',
    'js/gkr.js:207',
    'js/gkr.js:334',
    'js/gkr.js:562',
  ]) {
    assert.ok(lesson.evidence.includes(anchor), `RR-SUMCHECK-GKR must retain evidence ${anchor}`);
  }
  assert.match(lesson.limits, /interactive proof, not zero knowledge or a SNARK/);
  assert.match(lesson.limits, /omits GKR's uniformity machinery, sublinear verifier and general theorem/);
  assert.match(lesson.limits, /seeded challenges are replay controls/);
  assert.match(lesson.limits, /do not satisfy the displayed soundness premise/);
}

test('ZK Proof Lab credits executable Sum-check and bounded GKR with explicit proof boundaries', () => {
  checkSumcheckGkrScope(html);
});

test('Sum-check and GKR vocabulary selects executable proof code, not its UI retirement helper', () => {
  const sumcheck = ALGORITHMS.find(term => term.name === 'Sum-check');
  const gkr = ALGORITHMS.find(term => term.name === 'GKR');
  assert.ok(sumcheck);
  assert.ok(gkr);
  assert.ok(sumcheck.re.test('create sum-check verifier'));
  assert.equal(sumcheck.re.test('retire Sumcheck'), false);
  assert.ok(gkr.re.test('create GKR verifier'));
  assert.equal(gkr.re.test('background renderer'), false);
});

test('Sum-check/GKR controls reject lost credit, stale pins and theorem overclaims', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-zk-proof-lab\/"[\s\S]*?<\/a>/;
  for (const changed of [
    html.replace(cardRe, card => card.replace(/GKR@js\/gkr\.js:207\s*\|\s*/, '')),
    html.replace(cardRe, card => card.replace('Sum-check@js/sumcheck.js:89', 'Sum-check@js/sumcheck-ui.js:260')),
    html.replace(cardRe, card => card.replace('Eight exhibits', 'Six exhibits')),
    html.replace(cardRe, card => card.replace('<span class="chip">Sum-check</span>', '')),
    html.replace(cardRe, card => card.replace('not zero knowledge or a SNARK', 'a zero-knowledge SNARK')),
  ]) {
    assert.notEqual(changed, html, 'Sum-check/GKR negative control must change its card');
    assert.throws(() => checkSumcheckGkrScope(changed), assert.AssertionError);
  }

  const stale = structuredClone(exhibitManifest);
  stale.labs['crypto-lab-zk-proof-lab'].commit = '9af5d31e20b0559999611e6536c767da7b890a70';
  assert.throws(() => checkSumcheckGkrScope(html, stale), assert.AssertionError);

  const missingAnchor = structuredClone(exhibitManifest);
  const lesson = missingAnchor.labs['crypto-lab-zk-proof-lab'].exhibits
    .find(exhibit => exhibit.id === 'sumcheck-gkr');
  lesson.evidence = lesson.evidence.filter(anchor => anchor !== 'js/sumcheck.js:513');
  assert.throws(() => checkSumcheckGkrScope(html, missingAnchor), assert.AssertionError);

  const missingOrder = structuredClone(exhibitManifest);
  missingOrder.labs['crypto-lab-zk-proof-lab'].exhibits
    .find(exhibit => exhibit.id === 'sumcheck-gkr').outcome =
      'Inspect a few prover messages and a circuit result.';
  assert.throws(() => checkSumcheckGkrScope(html, missingOrder), assert.AssertionError);

  const overclaim = structuredClone(exhibitManifest);
  overclaim.labs['crypto-lab-zk-proof-lab'].exhibits
    .find(exhibit => exhibit.id === 'sumcheck-gkr').limits =
      'This is a zero-knowledge SNARK implementing the general GKR theorem.';
  assert.throws(() => checkSumcheckGkrScope(html, overclaim), assert.AssertionError);
});

function checkConfirmerAd09Scope(source, manifest = exhibitManifest, reviews = catalogReviewed) {
  const slug = 'crypto-lab-confirmer-signatures';
  const opening = openingFor(source, slug);
  const block = blockFor(source, slug);
  assert.match(opening, /data-review-commit="db6695e0f136507572dcc10e652bff83ea357383"/);
  assert.match(block, /one-message designated-verifier proof that either the branch witness or its verifier can make/);
  assert.match(block, /not a security proof of the complete confirmer scheme/);
  assert.ok(chipsFor(source, slug).includes('Designated-Verifier Proof'));
  assert.deepEqual(attacksFor(source, slug), [],
    'Research limitations and proof obligations are not executed cryptanalytic attacks');

  const review = reviews[slug];
  assert.equal(review.commit, 'db6695e0f136507572dcc10e652bff83ea357383');
  assert.match(review.note, /concrete trapdoor-commitment realization of the semantic disjunction/);
  assert.match(review.note, /not a generic Cramer–Damgård–Schoenmakers OR composition/);
  assert.match(review.note, /no proof-of-knowledge, soundness or unforgeability theorem/);
  assert.match(review.note, /all 8 clean-baseline designated-verifier mutations/);
  assert.match(review.note, /all 12 served files matched it byte for byte/);

  const mapped = manifest.labs[slug];
  assert.equal(mapped.commit, review.commit);
  assert.equal(mapped.reviewed, '2026-10-25');
  assert.equal(mapped.reviewScope, 'complete');
  assert.equal(mapped.exhibits.length, 7);
  const lesson = mapped.exhibits.find(exhibit => exhibit.id === 'designated-verifier-proof');
  assert.ok(lesson);
  assert.equal(lesson.execution, 'real-crypto');
  assert.equal(lesson.section, 'A proof addressed to one verifier.');
  assert.match(lesson.outcome, /accepts both permitted designated-proof origins/);
  assert.match(lesson.outcome, /false statement/);
  assert.match(lesson.outcome, /equations any reader can recompute/);
  for (const anchor of [
    'research/real-pairing/index.html:11',
    'research/real-pairing/app.mjs:210',
    'research/real-pairing/app.mjs:226',
    'research/real-pairing/app.mjs:241',
    'research/real-pairing/app.mjs:256',
    'research/real-pairing/app.mjs:265',
    'research/real-pairing/designated-verifier.mjs:195',
    'research/real-pairing/designated-verifier.mjs:225',
    'research/real-pairing/designated-verifier.mjs:272',
    'research/real-pairing/designated-verifier.mjs:323',
    'research/real-pairing/designated-verifier.mjs:337',
    'research/real-pairing/designated-verifier.mjs:374',
  ]) {
    assert.ok(lesson.evidence.includes(anchor), `A-D-09 must retain evidence ${anchor}`);
  }
  assert.match(lesson.limits, /implements Definition 1 only/);
  assert.match(lesson.limits, /not the generic Cramer–Damgård–Schoenmakers OR composition/);
  assert.match(lesson.limits, /not .* strong designated-verifier protocol/);
  assert.match(lesson.limits, /no section 5 security theorem/);
  assert.match(lesson.limits, /no lab-supplied proof-of-knowledge, soundness or unforgeability theorem/);
}

test('Signature Gate records A-D-09 as a bounded designated-verifier proof, not a full DCS theorem', () => {
  checkConfirmerAd09Scope(html);
});

test('Signature Gate A-D-09 controls reject stale evidence and stronger proof claims', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-confirmer-signatures\/"[\s\S]*?<\/a>/;
  for (const changed of [
    html.replace(cardRe, card => card.replace(
      'one-message designated-verifier proof that either the branch witness or its verifier can make',
      'one-message proof')),
    html.replace(cardRe, card => card.replace('<span class="chip">Designated-Verifier Proof</span>', '')),
    html.replace(cardRe, card => card.replace(
      'data-review-commit="db6695e0f136507572dcc10e652bff83ea357383"',
      'data-review-commit="4cf5a00f4fd11eb1dd3a343930859813f6e8da5d"')),
  ]) {
    assert.notEqual(changed, html, 'A-D-09 negative control must change its card');
    assert.throws(() => checkConfirmerAd09Scope(changed), assert.AssertionError);
  }

  const missingExhibit = structuredClone(exhibitManifest);
  missingExhibit.labs['crypto-lab-confirmer-signatures'].exhibits =
    missingExhibit.labs['crypto-lab-confirmer-signatures'].exhibits
      .filter(exhibit => exhibit.id !== 'designated-verifier-proof');
  assert.throws(() => checkConfirmerAd09Scope(html, missingExhibit), assert.AssertionError);

  const missingAnchor = structuredClone(exhibitManifest);
  const lesson = missingAnchor.labs['crypto-lab-confirmer-signatures'].exhibits
    .find(exhibit => exhibit.id === 'designated-verifier-proof');
  lesson.evidence = lesson.evidence
    .filter(anchor => anchor !== 'research/real-pairing/designated-verifier.mjs:225');
  assert.throws(() => checkConfirmerAd09Scope(html, missingAnchor), assert.AssertionError);

  const overclaim = structuredClone(exhibitManifest);
  overclaim.labs['crypto-lab-confirmer-signatures'].exhibits
    .find(exhibit => exhibit.id === 'designated-verifier-proof').limits =
      'This is a strong designated-verifier signature with a complete security theorem.';
  assert.throws(() => checkConfirmerAd09Scope(html, overclaim), assert.AssertionError);

  const staleReview = structuredClone(catalogReviewed);
  staleReview['crypto-lab-confirmer-signatures'].commit = '4cf5a00f4fd11eb1dd3a343930859813f6e8da5d';
  assert.throws(() => checkConfirmerAd09Scope(html, exhibitManifest, staleReview), assert.AssertionError);
});

function checkEk09Lr02Scope(source, manifests = exhibitManifest, reviews = catalogReviewed) {
  const lll = 'crypto-lab-lll-break';
  const lllOpening = openingFor(source, lll);
  assert.deepEqual(implementationsFor(source, lll), ['Algorithm SV', 'LWE', 'Merkle–Hellman']);
  assert.deepEqual(attacksFor(source, lll), ['Brute force', 'Lattice reduction']);
  assert.match(lllOpening, /Lattice reduction@src\/bkz\.ts:446/,
    'Lattice-reduction credit must point at the executable attackLWE entry point');
  assert.doesNotMatch(lllOpening, /Lattice reduction@playwright\.a11y\.config\.ts/,
    'The lab slug inside a Playwright base URL is not attack evidence');
  assert.equal(reviews[lll].commit, '3f7ca812858c87e0ad6d3c403c86c705dde3e16a');
  assert.ok(reviews[lll].addAttacks.includes('Lattice reduction@src/bkz.ts:446'));
  assert.match(reviews[lll].note, /overrides the scanner's false playwright\.a11y\.config\.ts anchor/);
  assert.equal(manifests.labs[lll].commit, reviews[lll].commit);
  assert.ok(manifests.labs[lll].exhibits.some(exhibit => exhibit.id === 'merkle-hellman-algorithm-sv'));

  const mac = 'crypto-lab-mac-race';
  const macOpening = openingFor(source, mac);
  assert.ok(implementationsFor(source, mac).includes('PMAC'));
  assert.match(macOpening, /PMAC@src\/pmac\/pmac\.ts:178/);
  assert.deepEqual(attacksFor(source, mac), ['Brute force', 'Length extension', 'Timing side-channel']);
  assert.match(macOpening, /Brute force@src\/poly1305\.ts:142/);
  assert.match(macOpening, /Length extension@src\/lengthext\.ts:111/);
  assert.match(macOpening, /Timing side-channel@src\/timing\.ts:127/,
    'Timing credit must point at the executable oracle recovery');
  assert.doesNotMatch(macOpening, /Timing side-channel@src\/crc\/panel\.ts/,
    'A link to a sibling Timing Oracle lab is not attack evidence');
  assert.ok(!attacksFor(source, mac).includes('Nonce reuse'),
    'The raw GHASH field toy explicitly has no nonce');
  assert.ok(!attacksFor(source, mac).includes('Side-channel (unspecified)'),
    'A glossary adjective is not an executed side-channel lesson');
  assert.equal(reviews[mac].commit, '695391521cfdaf4aee0dc3814b1d324b3b1bbdf1');
  assert.equal(manifests.labs[mac].commit, reviews[mac].commit);
  const pmac = manifests.labs[mac].exhibits.find(exhibit => exhibit.id === 'pmac');
  assert.ok(pmac);
  assert.match(pmac.limits, /not a browser speed benchmark/);
  assert.match(pmac.limits, /does not implement Q2 oracle access/);
}

test('E-K-09 and L-R-02 catalog evidence points at executable source with bounded claims', () => {
  checkEk09Lr02Scope(html);
});

test('Merkle-tree vocabulary excludes every supported Merkle–Hellman separator', () => {
  const tree = ALGORITHMS.find(term => term.name === 'Merkle tree');
  const knapsack = ALGORITHMS.find(term => term.name === 'Merkle–Hellman');
  assert.ok(tree);
  assert.ok(knapsack);
  assert.ok(tree.re.test('Merkle tree'));
  for (const spelling of ['Merkle-Hellman', 'Merkle Hellman', 'Merkle_Hellman', 'Merkle–Hellman']) {
    assert.ok(knapsack.re.test(spelling), `${spelling} must resolve to the historical knapsack`);
    assert.equal(tree.re.test(spelling), false, `${spelling} must not resolve to Merkle tree`);
  }
});

test('E-K-09 and L-R-02 scope controls reject scanner-only anchors and lost boundaries', () => {
  const lllCard = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-lll-break\/"[\s\S]*?<\/a>/;
  const macCard = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-mac-race\/"[\s\S]*?<\/a>/;
  for (const changed of [
    html.replace(lllCard, card => card.replace(
      'Lattice reduction@src/bkz.ts:446',
      'Lattice reduction@playwright.a11y.config.ts:10')),
    html.replace(lllCard, card => card.replace(/Lattice reduction@src\/bkz\.ts:446(?: \| )?/, '')),
    html.replace(macCard, card => card.replace('PMAC@src/pmac/pmac.ts:178', 'PMAC@src/pmac/panel.ts:9')),
    html.replace(macCard, card => card.replace('Brute force@src/poly1305.ts:142', 'Brute force@src/ui.ts:474')),
    html.replace(macCard, card => card.replace('Length extension@src/lengthext.ts:111', 'Length extension@src/lengthext.ts:5')),
    html.replace(macCard, card => card.replace(
      'Timing side-channel@src/timing.ts:127',
      'Timing side-channel@src/crc/panel.ts:60')),
    html.replace(macCard, card => card.replace('data-attacks="',
      'data-attacks="Nonce reuse@src/crc/panel.ts:57 | ')),
    html.replace(macCard, card => card.replace('data-attacks="',
      'data-attacks="Side-channel (unspecified)@src/ui.ts:473 | ')),
  ]) {
    assert.notEqual(changed, html, 'E-K-09/L-R-02 negative control must change its card');
    assert.throws(() => checkEk09Lr02Scope(changed), assert.AssertionError);
  }

  const stale = structuredClone(catalogReviewed);
  stale['crypto-lab-lll-break'].commit = 'a7eea56efd93cb05bc578fe18512416698366f0d';
  assert.throws(() => checkEk09Lr02Scope(html, exhibitManifest, stale), assert.AssertionError);

  const overclaim = structuredClone(exhibitManifest);
  overclaim.labs['crypto-lab-mac-race'].exhibits.find(exhibit => exhibit.id === 'pmac').limits =
    'Measured browser parallelism with post-quantum security.';
  assert.throws(() => checkEk09Lr02Scope(html, overclaim), assert.AssertionError);
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
  for (const name of ['Chosen-plaintext attack', 'Fault injection', 'Timing side-channel', 'Side-channel (unspecified)']) {
    assert.ok(!attacks.includes(name), `Power Trace does not demonstrate ${name}`);
  }
  for (const name of ['Power analysis', 'Key recovery', 'Known-plaintext attack']) {
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

test('Power Trace distinguishes correlation CPA, the known-plaintext cache model, sibling attacks and simulated leakage', () => {
  checkPowerScope(html);
});

test('Power Trace controls reject false attacks, timing guarantees and loss of actual analysis', () => {
  const marker = 'href="https://systemslibrarian.github.io/crypto-lab-power-trace/"';
  for (const name of ['Chosen-plaintext attack', 'Fault injection', 'Timing side-channel', 'Side-channel (unspecified)']) {
    assert.throws(() => checkPowerScope(html.replace(marker, `${marker} data-attacks="${name}@README.md:1"`)), assert.AssertionError);
  }
  for (const name of ['Power analysis', 'Key recovery', 'Known-plaintext attack']) {
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

test('selective-failure vocabulary does not turn an ordinary abort into an attack', () => {
  const term = ATTACKS.find(t => t.name === 'Selective failure');
  assert.ok(term.re.test('selective-failure attack'));
  assert.ok(term.re.test('selective failure oracle'));
  assert.equal(term.re.test('ordinary MAC check abort'), false);
  assert.equal(term.re.test('fail closed after malformed input'), false);
  assert.equal(attackContextAllows(term,
    '- **Selective-failure attacks.** If the garbler can make evaluation depend on the private input, the abort leaks a bit — a known pitfall that careful protocol design must close.'), false);
  assert.equal(attackContextAllows(term,
    'Run the selective-failure oracle and derive the hidden bit from the observed abort.'), true);
});

function checkSpdzOffKeyScope(source, manifests = exhibitManifest, reviews = catalogReviewed) {
  const slug = 'crypto-lab-spdz-forge';
  const attacks = attacksFor(source, slug);
  assert.ok(attacks.includes('Selective failure'), 'SPDZ Forge keeps its executable Off-Key selective-failure credit');
  for (const name of ['Key recovery', 'Side-channel (unspecified)']) {
    assert.ok(!attacks.includes(name), `recovering shared input y must not become ${name}`);
  }
  const card = source.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-spdz-forge\/"[\s\S]*?<\/a>/)[0];
  assert.match(card, /data-attacks="Selective failure@src\/ui\/panels\/offkey\.ts:128"/);
  assert.match(card, /bounded Off-Key fixture/);
  assert.match(card, /consistent α with β=α\+Δ preprocessing/);
  assert.match(card, /masked one-bit selective-failure result/);
  assert.match(card, /<span class="chip">Selective Failure<\/span>/);
  assert.match(card, /data-review-commit="2bfdc83b0ef587a598afad95d6ef0e72bdfd904b"/);
  assert.match(card, /omniscient audit is separately labeled/);
  assert.match(card, /three-party trusted-dealer, nonzero-mu, unbatched algebraic adaptation/);

  const review = reviews[slug];
  assert.equal(review.commit, '2bfdc83b0ef587a598afad95d6ef0e72bdfd904b');
  assert.deepEqual(review.addAttacks, ['Selective failure@src/ui/panels/offkey.ts:128']);
  assert.match(review.note, /same-context comparison restores the modeled assumption through protocol state/);
  assert.match(review.note, /not a reproduction of distributed preprocessing, persistence, concurrency or an evaluated framework/);

  const mapped = manifests.labs[slug];
  assert.equal(mapped.commit, review.commit);
  assert.ok(mapped.exhibits.find((item) => item.id === 'preprocessing').evidence.includes('index.html:260'));
  assert.ok(mapped.exhibits.find((item) => item.id === 'hospital-variance').evidence.includes('index.html:266'));
  const offkey = mapped.exhibits.find((item) => item.id === 'off-key-selective-failure');
  assert.ok(offkey.evidence.includes('src/ui/panels/offkey.ts:128'));
  assert.match(offkey.limits, /three-party trusted-dealer algebraic adaptation/);
  assert.match(offkey.limits, /omniscient audit is not attacker-visible/);
}

test('SPDZ Forge credits the protocol-derived Off-Key privacy oracle without calling its input a key', () => {
  checkSpdzOffKeyScope(html);
});

test('SPDZ Off-Key scope control rejects lost or invented attack credit', () => {
  const marker = 'href="https://systemslibrarian.github.io/crypto-lab-spdz-forge/"';
  const lost = html.replace('Selective failure@src/ui/panels/offkey.ts:128', '');
  assert.notEqual(lost, html);
  assert.throws(() => checkSpdzOffKeyScope(lost), assert.AssertionError);
  for (const name of ['Key recovery', 'Side-channel (unspecified)']) {
    const invented = html.replace(marker, `${marker} data-attacks="${name}@README.md:20"`);
    assert.notEqual(invented, html);
    assert.throws(() => checkSpdzOffKeyScope(invented), assert.AssertionError);
  }
  const wrongReview = structuredClone(catalogReviewed);
  wrongReview['crypto-lab-spdz-forge'].commit = '0'.repeat(40);
  assert.throws(() => checkSpdzOffKeyScope(html, exhibitManifest, wrongReview), assert.AssertionError);
  const missingBoundary = structuredClone(exhibitManifest);
  missingBoundary.labs['crypto-lab-spdz-forge'].exhibits
    .find((item) => item.id === 'off-key-selective-failure').limits = 'Teaching model.';
  assert.throws(() => checkSpdzOffKeyScope(html, missingBoundary, catalogReviewed), assert.AssertionError);
});

function checkProofTallyImplementationScope(source, reviews = catalogReviewed) {
  const slug = 'crypto-lab-proof-tally';
  const opening = openingFor(source, slug);
  assert.match(opening,
    /data-implementation="local TypeScript Field64\/Prio3 and exact BigInt DP model; @noble TurboSHAKE128"/);
  assert.match(opening, /data-review-commit="9394e3fd3fd84cab5cfa95016f21808ca9f4e395"/);
  assert.match(opening, /local two-aggregator Prio3Count\/Prio3Sum teaching implementation/);
  assert.match(opening, /@noble supplies TurboSHAKE128 only, not Prio3 or field\/proof logic/);
  const review = reviews[slug];
  assert.equal(review.commit, '9394e3fd3fd84cab5cfa95016f21808ca9f4e395');
  assert.match(review.note, /public, aborter-only and omniscient teaching views remain distinct/i);
  assert.match(review.note, /does not establish the paper's general bounds or imply that every abort violates differential privacy/);
}

test('Proof Tally attributes its local Prio3 and exact DP work instead of assigning the whole lab to noble', () => {
  checkProofTallyImplementationScope(html);
});

test('Proof Tally implementation provenance rejects a stale pin or library-only label', () => {
  const libraryOnly = html.replace(
    'local TypeScript Field64/Prio3 and exact BigInt DP model; @noble TurboSHAKE128',
    '@noble',
  );
  assert.notEqual(libraryOnly, html);
  assert.throws(() => checkProofTallyImplementationScope(libraryOnly), assert.AssertionError);
  const stale = structuredClone(catalogReviewed);
  stale['crypto-lab-proof-tally'].commit = '0'.repeat(40);
  assert.throws(() => checkProofTallyImplementationScope(html, stale), assert.AssertionError);
});

test('paper-extension exhibit maps keep their reviewed UI sections, not merely nonblank lines', () => {
  const proof = exhibitManifest.labs['crypto-lab-proof-tally'];
  assert.deepEqual(proof.exhibits.find((item) => item.id === 'collusion').evidence.filter((at) => at.startsWith('index.html:')),
    ['index.html:210', 'index.html:211', 'index.html:212', 'index.html:213']);
  assert.deepEqual(proof.exhibits.find((item) => item.id === 'proof-limits').evidence.filter((at) => at.startsWith('index.html:')),
    ['index.html:217', 'index.html:218', 'index.html:222', 'index.html:224', 'index.html:229', 'index.html:231']);
  assert.deepEqual(proof.exhibits.find((item) => item.id === 'vdaf-vectors').evidence.filter((at) => at.startsWith('index.html:')),
    ['index.html:236', 'index.html:237', 'index.html:238', 'index.html:242', 'index.html:243']);
  const abortRetry = proof.exhibits.find((item) => item.id === 'abort-retry-transcript');
  assert.match(abortRetry.action, /one- through three-attempt cap/);
  assert.doesNotMatch(abortRetry.action, /five-attempt/);

  const stark = exhibitManifest.labs['crypto-lab-stark-tower'];
  assert.equal(stark.commit, '51b29f35a0c593b724c1925d2bbc1c2fcd1fd0af');
  assert.deepEqual(stark.exhibits.find((item) => item.id === 'stark-proof').evidence.filter((at) => at.startsWith('index.html:')),
    ['index.html:401', 'index.html:403', 'index.html:404', 'index.html:418', 'index.html:419', 'index.html:420']);
  assert.deepEqual(stark.exhibits.find((item) => item.id === 'zk-masking').evidence.filter((at) => at.startsWith('index.html:')),
    ['index.html:452', 'index.html:454', 'index.html:456', 'index.html:463', 'index.html:472']);
  assert.deepEqual(stark.exhibits.find((item) => item.id === 'stark-deployments').evidence,
    ['index.html:496', 'index.html:498', 'index.html:501', 'index.html:505', 'index.html:509', 'index.html:513']);
  assert.deepEqual(stark.exhibits.find((item) => item.id === 'stark-size-tradeoff').evidence.filter((at) => at.startsWith('index.html:')),
    ['index.html:354', 'index.html:359', 'index.html:370', 'index.html:373', 'index.html:376', 'index.html:380', 'index.html:404']);
});

test('PR-06 ledger attributes CL084 correctly and retains the implemented retry cap', () => {
  assert.match(paperReview, /Source: Fredrik Meisingseth, \*On Aborts in Differential Privacy\*/);
  assert.doesNotMatch(paperReview, /Source: (?!Fredrik Meisingseth)[^\n]+, \*On Aborts in Differential Privacy\*/);
  assert.match(exhibitManifest.labs['crypto-lab-proof-tally'].exhibits
    .find((item) => item.id === 'abort-retry-transcript').action, /one- through three-attempt cap/);
});

function checkSnarkConstraintGapScope(source, manifests = exhibitManifest, reviews = catalogReviewed) {
  const slug = 'crypto-lab-snark-arena';
  assert.deepEqual(implementationsFor(source, slug), ['Groth16', 'KZG commitment']);
  assert.deepEqual(attacksFor(source, slug), [],
    'A computation/constraint inconsistency and retained-toxic-waste KZG forgery must not borrow an unrelated attack name');

  const opening = openingFor(source, slug);
  assert.match(opening, /Groth16@src\/ui\/realproof\.ts:92/);
  assert.match(opening, /KZG commitment@src\/crypto\/setup\.ts:116/);
  assert.match(opening, /data-unscanned="WebAssembly:3"/);
  assert.match(opening, /data-review-commit="025f878b22b2fa3df945359548c2422d9548c1f4"/);
  assert.match(opening, /snarkjs Groth16 over compiled Circom WASM\/BN254; local TypeScript toy-field arithmetic/);
  assert.doesNotMatch(opening, /data-attacks=/);

  const block = blockFor(source, slug);
  assert.match(block, /deliberately weak XOR relation/);
  assert.match(block, /in-circuit bit-constrained repair/);
  assert.match(block, /PLONK remains comparison-only/);
  assert.deepEqual(chipsFor(source, slug), ['Groth16', 'R1CS', 'Constraint Gap', 'Trusted Setup', 'vs. PLONK']);

  const review = reviews[slug];
  assert.equal(review.commit, '025f878b22b2fa3df945359548c2422d9548c1f4');
  assert.deepEqual(review.add, ['Groth16@src/ui/realproof.ts:92']);
  assert.deepEqual(review.remove, ['PLONK', 'Discrete log']);
  assert.match(review.note, /browser input check is not the repair/);
  assert.match(review.note, /does not implement CCC-Check/);

  const mapped = manifests.labs[slug];
  assert.equal(mapped.commit, review.commit);
  assert.equal(mapped.reviewed, '2026-10-25');
  assert.equal(mapped.reviewScope, 'complete');
  assert.equal(mapped.exhibits.length, 9);
  assert.deepEqual(mapped.exhibits.find((item) => item.id === 'r1cs').evidence.filter((at) => at.startsWith('index.html:')),
    ['index.html:177', 'index.html:200', 'index.html:202', 'index.html:216']);
  assert.deepEqual(mapped.exhibits.find((item) => item.id === 'groth16-real').evidence.filter((at) => at.startsWith('src/ui/realproof.ts:')),
    ['src/ui/realproof.ts:92', 'src/ui/realproof.ts:133', 'src/ui/realproof.ts:158']);
  const gap = mapped.exhibits.find((item) => item.id === 'constraint-gap');
  assert.equal(gap.execution, 'real-crypto');
  assert.ok(gap.evidence.includes('public/zk/xor_weak.circom:11'));
  assert.ok(gap.evidence.includes('public/zk/xor_repaired.circom:10'));
  assert.ok(gap.evidence.includes('src/ui/constraint-gap.ts:129'));
  assert.ok(gap.evidence.includes('src/ui/constraint-gap.ts:192'));
  assert.ok(gap.evidence.includes('src/ui/constraint-gap.ts:230'));
  assert.match(gap.outcome, /unmodified proof/);
  assert.match(gap.outcome, /prevent proof generation/);
  assert.match(gap.limits, /public-input Circom\/Groth16 relations/);
  assert.match(gap.limits, /does not implement CCC-Check/);
  assert.match(gap.limits, /does not .*treat a browser input check as a relation repair/);
}

test('SNARK Arena catalogs the real constraint-gap lesson without inventing attack or PLONK credit', () => {
  checkSnarkConstraintGapScope(html);
});

test('SNARK Arena constraint-gap controls reject stale pins, moved anchors and weakened scope', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-snark-arena\/"[^>]*>/;
  for (const changed of [
    html.replace(cardRe, (card) => card.replace('Groth16@src/ui/realproof.ts:92', 'Groth16@src/ui/realproof.ts:97')),
    html.replace(cardRe, (card) => card.replace('KZG commitment@src/crypto/setup.ts:116', 'KZG commitment@src/crypto/setup.ts:101')),
    html.replace(cardRe, (card) => card.replace('data-unscanned="WebAssembly:3"', 'data-unscanned="WebAssembly:1"')),
    html.replace(cardRe, (card) => card.replace('data-review-commit="025f878b22b2fa3df945359548c2422d9548c1f4"', 'data-review-commit="5999c14d2565ad4393f505b7f5c00ac9fdba7f49"')),
    html.replace(cardRe, (card) => card.replace('data-references="', 'data-attacks="Discrete log@src/ui/ceremony.ts:122" data-references="')),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the SNARK Arena card');
    assert.throws(() => checkSnarkConstraintGapScope(changed), assert.AssertionError);
  }

  const wrongPin = structuredClone(exhibitManifest);
  wrongPin.labs['crypto-lab-snark-arena'].commit = '0'.repeat(40);
  assert.throws(() => checkSnarkConstraintGapScope(html, wrongPin, catalogReviewed), assert.AssertionError);

  const missingGap = structuredClone(exhibitManifest);
  missingGap.labs['crypto-lab-snark-arena'].exhibits = missingGap.labs['crypto-lab-snark-arena'].exhibits
    .filter((item) => item.id !== 'constraint-gap');
  assert.throws(() => checkSnarkConstraintGapScope(html, missingGap, catalogReviewed), assert.AssertionError);

  const weakened = structuredClone(exhibitManifest);
  weakened.labs['crypto-lab-snark-arena'].exhibits
    .find((item) => item.id === 'constraint-gap').limits = 'Real Groth16 proof.';
  assert.throws(() => checkSnarkConstraintGapScope(html, weakened, catalogReviewed), assert.AssertionError);
});

test('STARK Tower card pins executable Fiat-Shamir and current implementation anchors', () => {
  const opening = openingFor(html, 'crypto-lab-stark-tower');
  const implementations = implementationsFor(html, 'crypto-lab-stark-tower');
  assert.deepEqual(implementations, ['Fiat-Shamir', 'FRI', 'Merkle tree', 'SHA-256', 'STARK']);
  assert.match(opening, /Fiat-Shamir@src\/stark\.ts:421/);
  assert.match(opening, /FRI@src\/stark\.ts:754/);
  assert.match(opening, /Merkle tree@src\/merkle\.ts:72/);
  assert.match(opening, /SHA-256@src\/merkle\.ts:55/);
  assert.match(opening, /STARK@src\/stark\.ts:189/);
  assert.doesNotMatch(opening, /data-attacks=/);
  assert.doesNotMatch(opening, /data-comment-only="[^"]*Fiat-Shamir/);
  assert.match(opening, /data-review-commit="51b29f35a0c593b724c1925d2bbc1c2fcd1fd0af"/);
  assert.match(opening, /data-updated="2026-10"/);
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

function checkIpsecIkeScope(source, manifests = exhibitManifest, reviews = catalogReviewed) {
  const slug = 'crypto-lab-ipsec-ike';
  assert.deepEqual(implementationsFor(source, slug), [
    'AES',
    'AES-GCM',
    'Diffie-Hellman',
    'HMAC',
    'IKEv2',
    'IPsec ESP',
    'SHA-256',
    'X25519',
  ]);
  assert.deepEqual(attacksFor(source, slug), [],
    'Replay and wrong-generation-key cases are receiver controls, not catalogued cryptanalytic attacks');

  const opening = openingFor(source, slug);
  assert.match(opening, /data-review-commit="3019cef4c514b5649aa530b74f3a6053deda4b4c"/);
  assert.match(opening, /IKEv2@src\/protocol\/ike-wire\.ts:91/);
  assert.match(opening, /IPsec ESP@src\/protocol\/esp\.ts:149/);
  assert.match(opening, /WebCrypto AES-GCM, HMAC and SHA-256 \/ local TypeScript and BigInt X25519, IKEv2, ESP, IPv4 and protocol-state teaching implementations/);
  assert.match(opening, /bounded IPv4 teaching profile, not an interoperable VPN daemon or production credential store/);
  assert.deepEqual(referencesFor(source, slug), ['EC point arithmetic', 'X448']);
  assert.deepEqual(chipsFor(source, slug), ['IKEv2', 'ESP', 'AES-GCM-16', 'Anti-Replay']);

  const review = reviews[slug];
  assert.equal(review.commit, '3019cef4c514b5649aa530b74f3a6053deda4b4c');
  assert.deepEqual(review.add, [
    'IKEv2@src/protocol/ike-wire.ts:91',
    'IPsec ESP@src/protocol/esp.ts:149',
  ]);
  assert.match(review.note, /README and src remain byte-identical to the implementation tree/);
  assert.match(review.note, /authentication-before-window-commit/);
  assert.match(review.note, /Current-main quality\/deployment run 40229891529/);
  assert.match(review.note, /all three public files byte for byte/);

  const mapped = manifests.labs[slug];
  assert.equal(mapped.commit, review.commit);
  assert.equal(mapped.reviewScope, 'complete');
  assert.deepEqual(mapped.exhibits.map((item) => item.id), [
    'policy-selectors',
    'ikev2-handshake',
    'child-sa-directions',
    'mode-negotiation',
    'esp-packet',
    'anti-replay',
    'child-sa-rekey',
  ]);
  assert.equal(mapped.exhibits.find((item) => item.id === 'ikev2-handshake').execution, 'real-crypto');
  assert.match(mapped.exhibits.find((item) => item.id === 'anti-replay').outcome,
    /invalid tag cannot advance the window/);
  assert.match(mapped.exhibits.find((item) => item.id === 'child-sa-rekey').limits,
    /without a fresh DH transform/);
}

test('IPsec / IKE credits the executable protocols without promoting receiver controls to attacks', () => {
  checkIpsecIkeScope(html);
});

test('IKEv2 and IPsec ESP vocabulary requires their protocol identities, not generic prose', () => {
  const ikev2 = ALGORITHMS.find((term) => term.name === 'IKEv2');
  const esp = ALGORITHMS.find((term) => term.name === 'IPsec ESP');
  assert.ok(ikev2);
  assert.ok(esp);
  assert.ok(ikev2.re.test('IKEv2'));
  assert.equal(ikev2.re.test('bike version 2'), false);
  assert.ok(esp.re.test('IPsec ESP'));
  assert.ok(esp.re.test('Encapsulating Security Payload'));
  assert.equal(esp.re.test('an ESP32 microcontroller'), false);
  assert.deepEqual(esp.structures, ['EspSa', 'ReplayWindow']);
});

test('IPsec / IKE scope controls reject lost, moved, invented or incomplete evidence', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-ipsec-ike\/"[^>]*>/;
  for (const changed of [
    html.replace(cardRe, (card) => card.replace(/IKEv2@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(
      'IPsec ESP@src/protocol/esp.ts:149',
      'IPsec ESP@src/protocol/esp.ts:148',
    )),
    html.replace(cardRe, (card) => card.replace(
      'data-references="',
      'data-attacks="Replay attack@src/lab.ts:387" data-references="',
    )),
    html.replace(cardRe, (card) => card.replace(
      'data-review-commit="3019cef4c514b5649aa530b74f3a6053deda4b4c"',
      'data-review-commit="ecbf8413e81d43967b0a0fbb3b7dda812d6f4f8d"',
    )),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the IPsec / IKE card');
    assert.throws(() => checkIpsecIkeScope(changed), assert.AssertionError);
  }

  const missingExhibit = structuredClone(exhibitManifest);
  missingExhibit.labs['crypto-lab-ipsec-ike'].exhibits = missingExhibit.labs['crypto-lab-ipsec-ike'].exhibits
    .filter((item) => item.id !== 'anti-replay');
  assert.throws(() => checkIpsecIkeScope(html, missingExhibit, catalogReviewed), assert.AssertionError);

  const staleReview = structuredClone(catalogReviewed);
  staleReview['crypto-lab-ipsec-ike'].commit = '0'.repeat(40);
  assert.throws(() => checkIpsecIkeScope(html, exhibitManifest, staleReview), assert.AssertionError);
});

function checkResidueGateAd13Scope(source, manifests = exhibitManifest, reviews = catalogReviewed) {
  const slug = 'crypto-lab-residue-gate';
  assert.deepEqual(implementationsFor(source, slug), [
    'Blum–Blum–Shub',
    'Blum–Goldwasser',
    'Goldwasser–Micali',
    'Jacobi symbol',
    'Miller–Rabin',
    'Rabin encryption',
    'Tonelli–Shanks',
  ]);
  assert.deepEqual(attacksFor(source, slug), [
    'Chosen-ciphertext attack',
    'Ciphertext malleability',
    'Factoring',
  ]);
  assert.deepEqual(referencesFor(source, slug), ['Paillier', 'RSA', 'RSA-OAEP']);

  const opening = openingFor(source, slug);
  assert.match(opening, /data-category="ENCRYPTION \| ATTACKS \| RANDOMNESS"/);
  assert.match(opening, /data-review-commit="f20e6db42edc5d654c9934dda27855dd6e340dfa"/);
  assert.match(opening, /Blum–Blum–Shub@src\/bbs\/bbs\.ts:108/);
  assert.match(opening, /Blum–Goldwasser@src\/bbs\/bbs\.ts:128/);
  assert.match(opening, /Rabin encryption@src\/rabin\/oracle\.ts:20/);
  assert.doesNotMatch(opening, /data-standards=/,
    'Number-theoretic BBS/BG must not inherit the CFRG signature draft or SEED RFC');
  assert.doesNotMatch(opening, /data-references="[^"]*(?:BBS signatures|Boneh-Franklin IBE|\bSEED\b)/,
    'Explicit out-of-scope prose must not become a catalog reference');
  assert.deepEqual(chipsFor(source, slug), [
    'Goldwasser–Micali',
    'Rabin Encryption',
    'BBS Generator',
    'Blum–Goldwasser',
  ]);

  const review = reviews[slug];
  assert.equal(review.commit, 'f20e6db42edc5d654c9934dda27855dd6e340dfa');
  assert.equal(review.reviewed, '2026-10-25');
  assert.ok(review.add.includes('Blum–Blum–Shub@src/bbs/bbs.ts:108'));
  assert.ok(review.add.includes('Blum–Goldwasser@src/bbs/bbs.ts:128'));
  assert.ok(review.addAttacks.includes('Ciphertext malleability@src/bbs/bbs.ts:242'));
  assert.match(review.note, /HAC 8\.56 state\/block convention/);
  assert.match(review.note, /all 40 clean-baseline mutations/);

  const mapped = manifests.labs[slug];
  assert.equal(mapped.commit, review.commit);
  assert.equal(mapped.reviewScope, 'complete');
  assert.deepEqual(mapped.exhibits.map((item) => item.id), [
    'prime-roots', 'jacobi', 'gm', 'rabin', 'oracle', 'bbs-bg',
  ]);
  assert.deepEqual(mapped.exhibits.slice(0, 5).map((item) => item.evidence[0]), [
    'src/main.ts:12', 'src/main.ts:13', 'src/main.ts:19', 'src/main.ts:21', 'src/main.ts:25',
  ]);
  const gm = mapped.exhibits.find((item) => item.id === 'gm');
  assert.equal(gm.outcome,
    'The current run reports whether repeated randomized encryptions differ; decryption recovers the bits, and ciphertext multiplication flips a bit without an integrity check.');
  const bbs = mapped.exhibits.find((item) => item.id === 'bbs-bg');
  assert.equal(bbs.execution, 'real-crypto');
  assert.deepEqual(bbs.evidence, [
    'src/main.ts:32',
    'src/bbs/bbs.ts:108',
    'src/bbs/bbs.ts:128',
    'src/worker/compute.worker.ts:10',
  ]);
  assert.match(bbs.limits, /not security evidence/);
}

test('Residue Gate credits A-D-13 BBS/BG computation without inheriting signature or SEED standards', () => {
  checkResidueGateAd13Scope(html);
  assert.deepEqual(referencesFor(html, 'crypto-lab-next-number'), ['Blum–Blum–Shub']);
  assert.ok(implementationsFor(html, 'crypto-lab-credential-veil').includes('BBS signatures'));
  assert.ok(implementationsFor(html, 'crypto-lab-world-ciphers').includes('SEED'));
});

test('BBS and SEED vocabulary keeps overloaded names separated', () => {
  const generator = ALGORITHMS.find((term) => term.name === 'Blum–Blum–Shub');
  const bg = ALGORITHMS.find((term) => term.name === 'Blum–Goldwasser');
  const credential = ALGORITHMS.find((term) => term.name === 'BBS signatures');
  const seed = ALGORITHMS.find((term) => term.name === 'SEED');
  assert.ok(generator && bg && credential && seed);

  for (const value of ['bbsBits', 'BBS (Residue Gate)', 'Blum–Blum–Shub']) {
    assert.ok(generator.re.test(value), `generator should recognize ${value}`);
  }
  for (const value of ['BBS generator', 'BBS generators', 'BBS proof', 'BBS signature', 'bbsCredential']) {
    assert.equal(generator.re.test(value), false, `generator must not claim ${value}`);
  }
  for (const value of ['BBS proof', 'BBS signature', 'bbsCredential']) {
    assert.ok(credential.re.test(value), `credential scheme should recognize ${value}`);
  }
  assert.equal(credential.re.test('bbsBits'), false);
  assert.equal(credential.re.test('BBS generator'), false);
  assert.ok(generator.chipRe.test('BBS Generator'));
  assert.ok(credential.chipRe.test('BBS'));
  assert.ok(bg.re.test('encryptBG'));
  assert.ok(bg.re.test('Blum–Goldwasser'));

  assert.ok(seed.re.test('seedBlockEncrypt'));
  assert.ok(seed.re.test('KISA_SEED'));
  assert.ok(seed.re.test('SEED cipher'));
  assert.equal(seed.re.test('same-seed ciphertexts'), false);
  assert.equal(seed.re.test('seed ciphertext'), false);
});

test('Residue Gate A-D-13 scope controls reject missing credit, false standards, stale anchors or an incomplete exhibit map', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-residue-gate\/"[^>]*>/;
  for (const changed of [
    html.replace(cardRe, (card) => card.replace(/Blum–Goldwasser@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(
      'Rabin encryption@src/rabin/oracle.ts:20',
      'Rabin encryption@src/rabin/oracle.ts:9',
    )),
    html.replace(cardRe, (card) => card.replace(
      'data-implementation="',
      'data-standards="IETF" data-implementation="',
    )),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the Residue Gate card');
    assert.throws(() => checkResidueGateAd13Scope(changed), assert.AssertionError);
  }

  const missingExhibit = structuredClone(exhibitManifest);
  missingExhibit.labs['crypto-lab-residue-gate'].exhibits = missingExhibit.labs['crypto-lab-residue-gate'].exhibits
    .filter((item) => item.id !== 'bbs-bg');
  assert.throws(() => checkResidueGateAd13Scope(html, missingExhibit, catalogReviewed), assert.AssertionError);

  const overstatedGm = structuredClone(exhibitManifest);
  overstatedGm.labs['crypto-lab-residue-gate'].exhibits.find((item) => item.id === 'gm').outcome =
    'Randomized encryptions differ while decryption recovers the bits; ciphertext multiplication flips a bit without an integrity check.';
  assert.throws(() => checkResidueGateAd13Scope(html, overstatedGm, catalogReviewed), assert.AssertionError);

  const staleReview = structuredClone(catalogReviewed);
  staleReview['crypto-lab-residue-gate'].commit = '0'.repeat(40);
  assert.throws(() => checkResidueGateAd13Scope(html, exhibitManifest, staleReview), assert.AssertionError);
});

function checkAttestationGateAd08Scope(source, manifests = exhibitManifest, reviews = catalogReviewed) {
  const slug = 'crypto-lab-attestation-gate';
  assert.deepEqual(implementationsFor(source, slug), [
    'AES',
    'AES-CFB',
    'BBS+',
    'BLS12-381',
    'Direct Anonymous Attestation',
    'ECDH',
    'ECDSA',
    'Fiat-Shamir',
    'Hash-to-curve',
    'HMAC',
    'P-256',
    'Pairing',
    'Schnorr identification',
    'SHA-256',
  ]);
  assert.deepEqual(attacksFor(source, slug), [],
    'Nonce-extraction regression tests are controls, not an executed nonce-reuse attack exhibit');
  assert.deepEqual(referencesFor(source, slug), [
    'Merkle tree', 'RSA', 'SHA-1', 'SHA-384', 'SHA-512',
  ]);

  const opening = openingFor(source, slug);
  assert.match(opening, /data-category="PROTOCOLS \| PRIVACY"/);
  assert.match(opening, /data-review-commit="89b2bb4cee6dcdfa0dbbabdc6ad1c82163659e61"/);
  assert.match(opening, /BBS\+@src\/daa\/protocol\.ts:271/);
  assert.match(opening, /Direct Anonymous Attestation@src\/daa\/protocol\.ts:384/);
  assert.match(opening, /AES-CFB@src\/tpm\/credential\.ts:121/);
  assert.match(opening, /ECDSA@src\/tpm\/key\.ts:511/);
  assert.match(opening, /Fiat-Shamir@src\/daa\/protocol\.ts:214/);
  assert.match(opening, /Pairing@src\/daa\/groups\.ts:177/);
  assert.match(opening, /Schnorr identification@src\/daa\/protocol\.ts:259/);
  assert.match(opening, /zero-application-attribute, named-basename-only algebraic teaching adaptation/);
  assert.match(opening, /anonymous provenance still does not establish runtime integrity/);
  assert.deepEqual(chipsFor(source, slug), [
    'TPM 2.0', 'RATS', 'Direct Anonymous Attestation', 'Controlled Linkability',
  ]);

  const review = reviews[slug];
  assert.equal(review.commit, '89b2bb4cee6dcdfa0dbbabdc6ad1c82163659e61');
  assert.equal(review.reviewed, '2026-10-26');
  assert.ok(review.add.includes('BBS+@src/daa/protocol.ts:271'));
  assert.ok(review.add.includes('Direct Anonymous Attestation@src/daa/protocol.ts:384'));
  assert.ok(review.add.includes('AES-CFB@src/tpm/credential.ts:121'));
  assert.ok(review.add.includes('ECDSA@src/tpm/key.ts:511'));
  assert.ok(review.add.includes('Fiat-Shamir@src/daa/protocol.ts:214'));
  assert.ok(review.add.includes('Schnorr identification@src/daa/protocol.ts:259'));
  assert.ok(review.remove.includes('BLS signatures'));
  assert.ok(review.remove.includes('Nonce reuse'));
  assert.deepEqual(review.removeReferences, ['Pedersen commitment', 'Schnorr', 'Shamir secret sharing']);

  const mapped = manifests.labs[slug];
  assert.equal(mapped.commit, review.commit);
  assert.equal(mapped.reviewScope, 'complete');
  assert.deepEqual(mapped.exhibits.map((item) => item.id), [
    'measured-boot',
    'quote-verify',
    'magic-value',
    'break-it',
    'time-of-use',
    'whose-signature',
    'failure-taxonomy',
    'anonymous-membership',
  ]);
  assert.deepEqual(mapped.exhibits.slice(0, 6).map((item) => item.evidence[0]), [
    'src/ui/app.ts:29',
    'src/ui/app.ts:30',
    'src/ui/app.ts:31',
    'src/ui/app.ts:32',
    'src/ui/app.ts:33',
    'src/ui/app.ts:34',
  ]);
  const daa = mapped.exhibits.find((item) => item.id === 'anonymous-membership');
  assert.equal(daa.execution, 'real-crypto');
  assert.deepEqual(daa.evidence, [
    'src/ui/app.ts:35',
    'src/ui/panels/daa.ts:85',
    'src/daa/attestation.ts:33',
    'src/daa/protocol.ts:222',
    'src/daa/protocol.ts:271',
    'src/daa/protocol.ts:384',
    'src/daa/protocol.ts:493',
    'src/daa/protocol.ts:621',
    'src/daa/lesson.ts:157',
    'src/daa/lesson.ts:209',
    'src/daa/lesson.ts:224',
  ]);
  assert.match(daa.limits, /not a TPM\/ISO ECDAA profile or hardware implementation/);
  assert.match(daa.limits, /anonymous provenance does not establish runtime integrity/);
}

test('Attestation Gate credits A-D-08 DAA and BBS+ computation without inventing BLS or nonce-reuse claims', () => {
  checkAttestationGateAd08Scope(html);
});

test('BBS+ and Direct Anonymous Attestation vocabulary remain distinct from CFRG BBS and generic attestation', () => {
  const bbsPlus = ALGORITHMS.find((term) => term.name === 'BBS+');
  const bbs = ALGORITHMS.find((term) => term.name === 'BBS signatures');
  const daa = ALGORITHMS.find((term) => term.name === 'Direct Anonymous Attestation');
  assert.ok(bbsPlus && bbs && daa);

  for (const value of ['BBS+', 'bbs_plus', 'BBS-plus', 'BBS plus']) {
    assert.ok(bbsPlus.re.test(value), `BBS+ should recognize ${value}`);
  }
  for (const value of ['BBS proof', 'BBS signature', 'bbsBits']) {
    assert.equal(bbsPlus.re.test(value), false, `BBS+ must not claim ${value}`);
  }
  assert.equal(bbs.re.test('BBS+ credential'), false);
  assert.ok(bbsPlus.chipRe.test('BBS+'));

  assert.ok(daa.re.test('Direct Anonymous Attestation'));
  assert.ok(daa.re.test('Pi_DAA+'));
  assert.ok(daa.chipRe.test('DAA'));
  assert.equal(daa.re.test('remote attestation'), false);
  assert.equal(daa.re.test('anonymous credential'), false);
});

test('Attestation Gate A-D-08 scope controls reject missing credit, false claims, stale pins or an incomplete exhibit map', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-attestation-gate\/"[^>]*>/;
  for (const changed of [
    html.replace(cardRe, (card) => card.replace(/BBS\+@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(/Direct Anonymous Attestation@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(/AES-CFB@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(/ECDSA@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(/Fiat-Shamir@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(/Schnorr identification@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(
      'Pairing@src/daa/groups.ts:177',
      'Pairing@src/daa/groups.ts:176',
    )),
    html.replace(cardRe, (card) => card.replace(
      'data-implements="',
      'data-implements="BLS signatures@src/daa/groups.ts:14 | ',
    )),
    html.replace(cardRe, (card) => card.replace(
      'data-standards="',
      'data-attacks="Nonce reuse@src/daa/protocol.test.ts:1" data-standards="',
    )),
    html.replace(cardRe, (card) => card.replace(
      '89b2bb4cee6dcdfa0dbbabdc6ad1c82163659e61',
      '0'.repeat(40),
    )),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the Attestation Gate card');
    assert.throws(() => checkAttestationGateAd08Scope(changed), assert.AssertionError);
  }

  const missingExhibit = structuredClone(exhibitManifest);
  missingExhibit.labs['crypto-lab-attestation-gate'].exhibits =
    missingExhibit.labs['crypto-lab-attestation-gate'].exhibits
      .filter((item) => item.id !== 'anonymous-membership');
  assert.throws(() => checkAttestationGateAd08Scope(html, missingExhibit, catalogReviewed), assert.AssertionError);

  const overstatedLimits = structuredClone(exhibitManifest);
  overstatedLimits.labs['crypto-lab-attestation-gate'].exhibits
    .find((item) => item.id === 'anonymous-membership').limits =
      'A production TPM/ISO ECDAA implementation with complete revocation.';
  assert.throws(() => checkAttestationGateAd08Scope(html, overstatedLimits, catalogReviewed), assert.AssertionError);

  const staleReview = structuredClone(catalogReviewed);
  staleReview['crypto-lab-attestation-gate'].commit = '0'.repeat(40);
  assert.throws(() => checkAttestationGateAd08Scope(html, exhibitManifest, staleReview), assert.AssertionError);
});

function checkIbeGateAd07Scope(source, manifests = exhibitManifest, reviews = catalogReviewed) {
  const slug = 'crypto-lab-ibe-gate';
  assert.deepEqual(implementationsFor(source, slug), [
    'BLS12-381',
    'Boneh-Franklin IBE',
    'ECDSA',
    'Hash-to-curve',
    'HIBE',
    'HMAC',
    'P-256',
    'Pairing',
    'RSA',
    'RSA-OAEP',
    'SHA-256',
  ]);
  assert.deepEqual(attacksFor(source, slug), [],
    'Security warnings and imported BLS group code are not executed attacks or BLS signatures');

  const card = openingFor(source, slug);
  assert.match(card, /data-review-commit="6c0b3fbd9ebf167491eedff70b1b7cb7fee5f26f"/);
  assert.match(card, /WebCrypto RSA-OAEP, P-256 ECDSA, HMAC and SHA-256/);
  assert.doesNotMatch(card, /data-implements="[^"]*BLS signatures@/);

  const review = reviews[slug];
  assert.equal(review.commit, '6c0b3fbd9ebf167491eedff70b1b7cb7fee5f26f');
  assert.deepEqual(review.remove, [
    'BLS signatures',
    'Chosen-ciphertext attack',
    'Chosen-plaintext attack',
    'Ciphertext malleability',
    'Malleability (unspecified)',
  ]);

  const mapped = manifests.labs[slug];
  assert.equal(mapped.commit, review.commit);
  assert.equal(mapped.reviewScope, 'complete');
  assert.deepEqual(mapped.exhibits.map((item) => item.id), [
    'setup-bilinearity',
    'encrypt-before-enroll',
    'wrong-identity',
    'time-identity',
    'escrow',
    'hibe-delegation',
    'certificateless-ownership',
  ]);
  const time = mapped.exhibits.find((item) => item.id === 'time-identity');
  assert.match(time.action, /PKG issue, refuse or improperly issue/);
  assert.match(time.outcome, /colluding PKG can issue early and defeat the policy/);
  const cle = mapped.exhibits.find((item) => item.id === 'certificateless-ownership');
  assert.equal(cle.execution, 'real-crypto');
  assert.ok(cle.evidence.includes('src/certificateless.ts:453'));
  assert.match(cle.limits, /BasicIdent, so the cited IND-CCA theorem does not apply/);
  assert.match(cle.limits, /not full adaptive games/);
}

test('IBE Gate credits A-D-07 computation without promoting BLS imports or security warnings', () => {
  checkIbeGateAd07Scope(html);
});

test('IBE Gate A-D-07 controls reject false credit, stale pins, stale time prose or an incomplete exhibit map', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-ibe-gate\/"[^>]*>/;
  for (const changed of [
    html.replace(cardRe, (card) => card.replace(/RSA-OAEP@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(
      'data-implements="',
      'data-implements="BLS signatures@src/pairing.ts:1 | ',
    )),
    html.replace(cardRe, (card) => card.replace(
      'data-standards="',
      'data-attacks="Chosen-ciphertext attack@README.md:84" data-standards="',
    )),
    html.replace(cardRe, (card) => card.replace(
      '6c0b3fbd9ebf167491eedff70b1b7cb7fee5f26f',
      '0'.repeat(40),
    )),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the IBE Gate card');
    assert.throws(() => checkIbeGateAd07Scope(changed), assert.AssertionError);
  }

  const missingExhibit = structuredClone(exhibitManifest);
  missingExhibit.labs['crypto-lab-ibe-gate'].exhibits =
    missingExhibit.labs['crypto-lab-ibe-gate'].exhibits
      .filter((item) => item.id !== 'certificateless-ownership');
  assert.throws(() => checkIbeGateAd07Scope(html, missingExhibit, catalogReviewed), assert.AssertionError);

  const staleTimeClaim = structuredClone(exhibitManifest);
  staleTimeClaim.labs['crypto-lab-ibe-gate'].exhibits
    .find((item) => item.id === 'time-identity').outcome =
      'A date string cryptographically prevents all early decryption.';
  assert.throws(() => checkIbeGateAd07Scope(html, staleTimeClaim, catalogReviewed), assert.AssertionError);

  const staleReview = structuredClone(catalogReviewed);
  staleReview['crypto-lab-ibe-gate'].remove = ['BLS signatures'];
  assert.throws(() => checkIbeGateAd07Scope(html, exhibitManifest, staleReview), assert.AssertionError);
});

function checkDistanceBoundingS06Scope(source, manifests = exhibitManifest, reviews = catalogReviewed) {
  const slug = 'crypto-lab-distance-bounding';
  assert.deepEqual(implementationsFor(source, slug), ['HMAC', 'SHA-256']);
  assert.deepEqual(attacksFor(source, slug), [],
    'The nonce-reuse recovery is a unit control, not a learner-executed attack exhibit');

  const card = openingFor(source, slug);
  assert.match(card, /data-review-commit="4458307b57a02da4362cee5b799f20bdade03fd4"/);
  assert.match(card, /exact rational timing\/probability and attack-event teaching models/);
  assert.deepEqual(chipsFor(source, slug), [
    'Hancke–Kuhn',
    'Distance Bounding',
    'Mafia Fraud',
    'Exact Probabilities',
  ]);

  const review = reviews[slug];
  assert.equal(review.commit, '4458307b57a02da4362cee5b799f20bdade03fd4');
  assert.deepEqual(review.remove, ['Nonce reuse']);
  const mapped = manifests.labs[slug];
  assert.equal(mapped.commit, review.commit);
  assert.equal(mapped.reviewScope, 'complete');
  assert.deepEqual(mapped.exhibits.map((item) => item.id), [
    'session-controls',
    'ordinary-authenticated-relay',
    'rapid-timing-relay',
    'mafia-preask',
    'distance-fraud',
    'noisy-channel',
    'scope-and-sources',
  ]);
  assert.equal(mapped.exhibits.find((item) => item.id === 'ordinary-authenticated-relay').execution, 'real-crypto');
  assert.equal(mapped.exhibits.find((item) => item.id === 'rapid-timing-relay').execution, 'simulation');
  assert.match(mapped.exhibits.find((item) => item.id === 'rapid-timing-relay').limits,
    /no browser or network clock measures physical propagation/);
  assert.match(mapped.exhibits.find((item) => item.id === 'scope-and-sources').limits,
    /not additional executed protocols, attacks or empirical measurements/);
}

test('Distance Bounding records S06 computation and modeled actors without a false nonce-reuse attack credit', () => {
  checkDistanceBoundingS06Scope(html);
});

test('Distance Bounding S06 controls reject lost credit, a false attack, stale pins or an incomplete exhibit map', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-distance-bounding\/"[^>]*>/;
  for (const changed of [
    html.replace(cardRe, (card) => card.replace(/HMAC@[^|" ]+(?: \| )?/, '')),
    html.replace(cardRe, (card) => card.replace(
      'data-standards="',
      'data-attacks="Nonce reuse@README.md:19" data-standards="',
    )),
    html.replace(cardRe, (card) => card.replace(
      '4458307b57a02da4362cee5b799f20bdade03fd4',
      '0'.repeat(40),
    )),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the Distance Bounding card');
    assert.throws(() => checkDistanceBoundingS06Scope(changed), assert.AssertionError);
  }

  const missingExhibit = structuredClone(exhibitManifest);
  missingExhibit.labs['crypto-lab-distance-bounding'].exhibits =
    missingExhibit.labs['crypto-lab-distance-bounding'].exhibits
      .filter((item) => item.id !== 'ordinary-authenticated-relay');
  assert.throws(() => checkDistanceBoundingS06Scope(html, missingExhibit, catalogReviewed), assert.AssertionError);

  const overstatedTiming = structuredClone(exhibitManifest);
  overstatedTiming.labs['crypto-lab-distance-bounding'].exhibits
    .find((item) => item.id === 'rapid-timing-relay').limits =
      'The browser measures physical propagation and proves the prover distance.';
  assert.throws(() => checkDistanceBoundingS06Scope(html, overstatedTiming, catalogReviewed), assert.AssertionError);

  const staleReview = structuredClone(catalogReviewed);
  staleReview['crypto-lab-distance-bounding'].remove = [];
  assert.throws(() => checkDistanceBoundingS06Scope(html, exhibitManifest, staleReview), assert.AssertionError);
});

function checkShamirGateS07Scope(source, manifests = exhibitManifest, reviews = catalogReviewed) {
  const slug = 'crypto-lab-shamir-gate';
  assert.deepEqual(implementationsFor(source, slug), [
    'AES',
    'AES-GCM',
    'Shamir secret sharing',
  ]);
  assert.deepEqual(attacksFor(source, slug), [],
    'Adi Shamir biography text is not an executed differential-cryptanalysis attack');

  const card = openingFor(source, slug);
  assert.match(card, /data-review-commit="48a7a3ab9298edf708f5496159c39f2cdb9d3227"/);
  assert.doesNotMatch(card, /data-attacks=/);

  const review = reviews[slug];
  assert.equal(review.commit, '48a7a3ab9298edf708f5496159c39f2cdb9d3227');
  assert.deepEqual(review.remove, ['Differential cryptanalysis']);

  const mapped = manifests.labs[slug];
  assert.equal(mapped.commit, review.commit);
  assert.equal(mapped.reviewScope, 'complete');
  assert.deepEqual(mapped.exhibits.map((item) => item.id), [
    'lesson',
    'gate',
    'polynomial',
    'privacy',
    'visual-sharing',
    'aes-vault',
    'failure-lab',
    'context',
  ]);
  const visual = mapped.exhibits.find((item) => item.id === 'visual-sharing');
  assert.equal(visual.execution, 'real-operation');
  assert.ok(visual.evidence.includes('demos/shamir-gate/src/visual.ts:165'));
  assert.ok(visual.evidence.includes('demos/shamir-gate/src/visual-ui.ts:283'));
  assert.match(visual.action, /Boolean OR/);
  assert.match(visual.outcome, /identical complete one-share distributions/);
  assert.match(visual.limits, /Binary 2-of-2 teaching construction only/);
  assert.match(visual.limits, /no authenticity or printing and optical model/);
}

test('Shamir Gate records S07 visual sharing without a biography-derived attack credit', () => {
  checkShamirGateS07Scope(html);
});

test('Shamir Gate S07 controls reject a false attack, stale pins, missing evidence or stronger scope', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-shamir-gate\/"[^>]*>/;
  for (const changed of [
    html.replace(cardRe, (card) => card.replace(
      'data-standards="',
      'data-attacks="Differential cryptanalysis@demos/shamir-gate/src/main.ts:1479" data-standards="',
    )),
    html.replace(cardRe, (card) => card.replace(
      '48a7a3ab9298edf708f5496159c39f2cdb9d3227',
      '0'.repeat(40),
    )),
  ]) {
    assert.notEqual(changed, html, 'Negative control must change the Shamir Gate card');
    assert.throws(() => checkShamirGateS07Scope(changed), assert.AssertionError);
  }

  const missingExhibit = structuredClone(exhibitManifest);
  missingExhibit.labs['crypto-lab-shamir-gate'].exhibits =
    missingExhibit.labs['crypto-lab-shamir-gate'].exhibits
      .filter((item) => item.id !== 'visual-sharing');
  assert.throws(() => checkShamirGateS07Scope(html, missingExhibit, catalogReviewed), assert.AssertionError);

  const missingEvidence = structuredClone(exhibitManifest);
  missingEvidence.labs['crypto-lab-shamir-gate'].exhibits
    .find((item) => item.id === 'visual-sharing').evidence = [];
  assert.throws(() => checkShamirGateS07Scope(html, missingEvidence, catalogReviewed), assert.AssertionError);

  const overstatedLimits = structuredClone(exhibitManifest);
  overstatedLimits.labs['crypto-lab-shamir-gate'].exhibits
    .find((item) => item.id === 'visual-sharing').limits =
      'A production authenticated k-of-n visual-cryptography and printing system.';
  assert.throws(() => checkShamirGateS07Scope(html, overstatedLimits, catalogReviewed), assert.AssertionError);

  const staleReview = structuredClone(catalogReviewed);
  staleReview['crypto-lab-shamir-gate'].remove = [];
  assert.throws(() => checkShamirGateS07Scope(html, exhibitManifest, staleReview), assert.AssertionError);
});

function checkObliviousShelfReview(source, manifests = exhibitManifest) {
  const slug = 'crypto-lab-oblivious-shelf';
  assert.deepEqual(implementationsFor(source, slug), ['Private information retrieval']);

  const card = openingFor(source, slug);
  assert.match(card, /data-implements="Private information retrieval@src\/pir\.ts:160"/);
  const cardBlock = blockFor(source, slug);
  assert.match(cardBlock, /Retrieve one catalog bit/);
  assert.match(cardBlock, /<span class="chip">Robust PIR<\/span>/);
  assert.doesNotMatch(cardBlock, /retrieves any book|retrieves (?:the )?selected record/);

  const mapped = manifests.labs[slug];
  assert.equal(mapped.commit, '7529bf0099a8fb835a7108150ca082e61928ba7e');
  assert.equal(mapped.reviewed, '2026-10-26');
  assert.equal(mapped.reviewScope, 'complete');
  assert.deepEqual(mapped.exhibits.map((item) => item.id), [
    'privacy-problem',
    'live-query',
    'cost',
    'dilemma',
    'robust-pir',
  ]);

  const live = mapped.exhibits.find((item) => item.id === 'live-query');
  assert.equal(live.execution, 'real-operation');
  assert.match(live.outcome, /one-bit checked-out flag/);
  assert.match(live.outcome, /direct database comparison checks correctness/);
  assert.match(live.outcome, /retains all 16 indices/);
  assert.match(live.limits, /retrieves one bit rather than a catalog record/);
  assert.match(live.limits, /loses privacy if the query shares are combined/);
  assert.ok(live.evidence.includes('src/pir.ts:160'));
  assert.ok(live.evidence.includes('src/pir.ts:214'));

  const cost = mapped.exhibits.find((item) => item.id === 'cost');
  assert.equal(cost.execution, 'conceptual');
  assert.doesNotMatch(cost.action, /^Change /);
  assert.match(cost.outcome, /executed basic scheme's two O\(n\)-bit queries/);
  assert.match(cost.limits, /executed basic XOR and bounded GF\(8\) routes/);
  assert.match(cost.limits, /do not claim those asymptotic or deployment efficiencies/);

  const robust = mapped.exhibits.find((item) => item.id === 'robust-pir');
  assert.equal(robust.execution, 'real-operation');
  assert.match(robust.outcome, /degree-one Reed-Solomon word/);
  assert.match(robust.outcome, /beyond-bound transcript accepts the wrong bit/);
  assert.match(robust.outcome, /one query view retains every target/);
  assert.match(robust.outcome, /two distinct views interpolate the one-hot target/);
  assert.match(robust.limits, /twice the Byzantine count plus the unavailable count to be at most three/);
  assert.match(robust.limits, /no provenance, freshness or privacy against two colluding query recipients/);
  assert.match(robust.limits, /not Beimel-Stahl Theorem 5\.2/);
  assert.ok(robust.evidence.includes('src/robust-pir.ts:464'));
  assert.ok(robust.evidence.includes('src/robust-ui.ts:393'));
}

test('Oblivious Shelf review keeps one-bit XOR PIR and bounded robust-PIR claims separate', () => {
  checkObliviousShelfReview(html);
});

test('Oblivious Shelf controls reject stale pins, whole-record claims, stronger cost execution and weakened robustness boundaries', () => {
  const cardRe = /<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-oblivious-shelf\/"[^>]*>/;
  const staleAnchor = html.replace(cardRe, (card) => card.replace('src/pir.ts:160', 'src/pir.ts:89'));
  assert.notEqual(staleAnchor, html);
  assert.throws(() => checkObliviousShelfReview(staleAnchor), assert.AssertionError);

  const wholeRecord = html.replace('Retrieve one catalog bit', 'Retrieve the selected record');
  assert.notEqual(wholeRecord, html);
  assert.throws(() => checkObliviousShelfReview(wholeRecord), assert.AssertionError);

  const stalePin = structuredClone(exhibitManifest);
  stalePin.labs['crypto-lab-oblivious-shelf'].commit = '0'.repeat(40);
  assert.throws(() => checkObliviousShelfReview(html, stalePin), assert.AssertionError);

  const recordClaim = structuredClone(exhibitManifest);
  recordClaim.labs['crypto-lab-oblivious-shelf'].exhibits
    .find((item) => item.id === 'live-query').outcome =
      'The responses retrieve the complete selected catalog record.';
  assert.throws(() => checkObliviousShelfReview(html, recordClaim), assert.AssertionError);

  const interactiveCost = structuredClone(exhibitManifest);
  const cost = interactiveCost.labs['crypto-lab-oblivious-shelf'].exhibits
    .find((item) => item.id === 'cost');
  cost.execution = 'real-operation';
  cost.action = 'Change server assumptions and execute every advanced PIR construction.';
  cost.limits = 'All cited constructions are implemented.';
  assert.throws(() => checkObliviousShelfReview(html, interactiveCost), assert.AssertionError);

  const missingRobust = structuredClone(exhibitManifest);
  missingRobust.labs['crypto-lab-oblivious-shelf'].exhibits =
    missingRobust.labs['crypto-lab-oblivious-shelf'].exhibits
      .filter((item) => item.id !== 'robust-pir');
  assert.throws(() => checkObliviousShelfReview(html, missingRobust), assert.AssertionError);

  const strongerRobust = structuredClone(exhibitManifest);
  strongerRobust.labs['crypto-lab-oblivious-shelf'].exhibits
    .find((item) => item.id === 'robust-pir').limits =
      'Production robust PIR authenticates every answer, stays fresh and preserves privacy against colluding servers.';
  assert.throws(() => checkObliviousShelfReview(html, strongerRobust), assert.AssertionError);

  const hiddenFailure = structuredClone(exhibitManifest);
  hiddenFailure.labs['crypto-lab-oblivious-shelf'].exhibits
    .find((item) => item.id === 'robust-pir').outcome =
      'Every threshold violation is detected and refused.';
  assert.throws(() => checkObliviousShelfReview(html, hiddenFailure), assert.AssertionError);
});

function checkCompressionLeakReview(manifests = exhibitManifest) {
  const mapped = manifests.labs['crypto-lab-compression-leak'];
  assert.equal(mapped.commit, '9f9c83e0d60ea18671c65fcf1510a95dc847f4b9');
  assert.equal(mapped.reviewed, '2026-10-26');
  assert.equal(mapped.reviewScope, 'complete');
  assert.deepEqual(mapped.exhibits.map((item) => item.id), [
    'length-oracle',
    'compression-controls',
    'authenticated-length-boundary',
  ]);

  const probe = mapped.exhibits.find((item) => item.id === 'length-oracle');
  assert.equal(probe.execution, 'real-crypto');
  assert.match(probe.outcome, /measured ciphertext byte count/);
  assert.match(probe.outcome, /16-byte authentication tag/);
  assert.match(probe.outcome, /decrypt-and-authenticate check remains valid/);
  assert.doesNotMatch(probe.outcome, /Reports raw, compressed and ciphertext byte counts/);
  assert.ok(probe.evidence.includes('src/crypto/oracle.ts:40'));
  assert.ok(probe.evidence.includes('src/crypto/oracle.ts:42'));

  const boundary = mapped.exhibits.find((item) => item.id === 'authenticated-length-boundary');
  assert.equal(boundary.section, 'What passed, and what failed?');
  assert.equal(boundary.execution, 'real-values');
  assert.match(boundary.outcome, /without breaking AES/);
  assert.match(boundary.outcome, /one sample or tied lengths remain inconclusive/);
  assert.match(boundary.limits, /not HTTP or TLS records/);
  assert.match(boundary.limits, /equal lengths do not prove secrecy/);
}

test('Compression Leak review reports only learner-visible lengths and retains its security boundary', () => {
  checkCompressionLeakReview();
});

test('Compression Leak controls reject stale pins, hidden byte-count claims and missing boundaries', () => {
  const stalePin = structuredClone(exhibitManifest);
  stalePin.labs['crypto-lab-compression-leak'].commit = '0'.repeat(40);
  assert.throws(() => checkCompressionLeakReview(stalePin), assert.AssertionError);

  const hiddenCounts = structuredClone(exhibitManifest);
  hiddenCounts.labs['crypto-lab-compression-leak'].exhibits
    .find((item) => item.id === 'length-oracle').outcome =
      'Reports raw, compressed and ciphertext byte counts while authentication remains valid.';
  assert.throws(() => checkCompressionLeakReview(hiddenCounts), assert.AssertionError);

  const missingBoundary = structuredClone(exhibitManifest);
  missingBoundary.labs['crypto-lab-compression-leak'].exhibits =
    missingBoundary.labs['crypto-lab-compression-leak'].exhibits
      .filter((item) => item.id !== 'authenticated-length-boundary');
  assert.throws(() => checkCompressionLeakReview(missingBoundary), assert.AssertionError);

  const secrecyProof = structuredClone(exhibitManifest);
  const boundary = secrecyProof.labs['crypto-lab-compression-leak'].exhibits
    .find((item) => item.id === 'authenticated-length-boundary');
  boundary.outcome = 'Equal ciphertext lengths prove general length secrecy.';
  boundary.limits = 'The result applies to arbitrary HTTPS traffic.';
  assert.throws(() => checkCompressionLeakReview(secrecyProof), assert.AssertionError);
});
