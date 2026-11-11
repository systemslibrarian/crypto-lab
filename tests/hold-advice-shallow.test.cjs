/**
 * A hold's "remove the entry" advice must not fire where the clone is fresh by
 * construction.
 *
 * fleet.yml makes every clone with `git clone --depth 1`, so in CI a clone is at
 * the remote head always, and the currency test that decides whether a hold is
 * still needed is answered the same way every time. Before this, every hold read
 * HOLD NO LONGER NEEDED on every CI run for ever -- advice that is always wrong
 * in the environment printing it, in a section people are meant to read.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { isShallowState } = require('../tools/catalog-evidence.js');

const SRC = fs.readFileSync(path.join(__dirname, '..', 'tools/catalog-evidence.js'), 'utf8');

test('the advice is gated on shallowness, not on currency alone', () => {
  assert.match(SRC, /const shallow = isShallowState\(dir\);/,
    'the hold branch must ask whether this checkout is the fresh kind');
  assert.match(SRC, /freshByConstruction: shallow\.readable \? shallow\.match : false/);
  assert.match(SRC, /unnecessary: shallow\.readable \? !shallow\.match : false/,
    'a shallow clone may never be called an unnecessary hold');
});

test('three outcomes, and the unreadable one offers no judgement', () => {
  assert.match(SRC, /this checkout is SHALLOW, so its currency says nothing/);
  assert.match(SRC, /could not tell whether this checkout is shallow, so no/);
  assert.match(SRC, /HOLD NO LONGER NEEDED/,
    'a full checkout that really is current must still be told to remove the entry');
});

test('the hold and its reason are still printed in every case', () => {
  /* Only the advice is withheld. A hold that stopped being reported would be a
     silent exemption, which is what clone-holds.json exists to prevent. */
  const branch = SRC.slice(SRC.indexOf('if (h.freshByConstruction)'), SRC.indexOf('CLONE-DIVERGED'));
  assert.ok(branch.includes('h.slug.padEnd(34)'), 'the lab is named in every branch');
  assert.match(SRC, /console\.log\(`\s*\$\{h\.reason/, 'the reason is printed');
});

test('a real depth-1 clone reads as shallow, which is what the gate turns on', () => {
  const probe = path.join(__dirname, '..', '..', 'crypto-lab-snap12-shallow-probe');
  if (!fs.existsSync(path.join(probe, '.git'))) return;   // only when the probe exists
  const s = isShallowState(probe);
  assert.equal(s.readable, true);
  assert.equal(s.match, true, 'a --depth 1 clone must read as shallow');
});
