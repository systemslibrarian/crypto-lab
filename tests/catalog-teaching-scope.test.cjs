const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function attacksFor(source, slug) {
  const card = source.match(new RegExp('<a class="project-card"[^>]*href="https://systemslibrarian\\.github\\.io/' + slug + '/"[^>]*>'));
  assert.ok(card, `Missing ${slug} card`);
  return (card[0].match(/\bdata-attacks="([^"]*)"/)?.[1] ?? '')
    .split(' | ').filter(Boolean).map((value) => value.split('@')[0]);
}

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
  ]) {
    const marker = `href="https://systemslibrarian.github.io/${slug}/"`;
    const mutated = html.replace(marker, `${marker} data-attacks="${attack}@README.md:1"`);
    assert.throws(() => checkScope(mutated), assert.AssertionError);
  }
});
