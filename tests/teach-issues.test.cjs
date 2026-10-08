'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const playwright = require('../tools/node_modules/playwright');
const { checkNote, measureOverflow } = require('../tools/teach-issues');

test('browser launch failures remain unreadable and do not hide other engines', async () => {
  const originals = {};
  const visited = [];
  for (const engine of ['chromium', 'firefox', 'webkit']) {
    originals[engine] = playwright[engine].launch;
    playwright[engine].launch = async () => {
      visited.push(engine);
      if (engine === 'webkit') throw new Error('missing host libraries');
      return {
        newPage: async () => ({
          goto: async () => {}, waitForTimeout: async () => {},
          locator: () => ({ innerText: async () => 'the recorded needle' }),
          evaluate: async () => 288, close: async () => {},
        }),
        close: async () => {},
      };
    };
  }
  try {
    const seen = await checkNote({ url: 'https://fixture.invalid', issue: { needle: 'recorded needle' } });
    assert.deepEqual(seen, { chromium: true, firefox: true, webkit: 'error: missing host libraries' });
    assert.deepEqual(visited, ['chromium', 'firefox', 'webkit']);
    const bad = await measureOverflow({ engine: 'WebKit', viewport: '390x844' });
    assert.equal(bad.error, 'missing host libraries');
    const good = await measureOverflow({ engine: 'Chromium', viewport: '390x844' });
    assert.deepEqual(good, { overflow: 288, at: '390x844' });
  } finally {
    for (const engine of Object.keys(originals)) playwright[engine].launch = originals[engine];
  }
});
