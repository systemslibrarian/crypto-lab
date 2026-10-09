'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('../tools/node_modules/playwright');

test('award link can be addressed by its visible words on desktop and mobile', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [1366, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      try {
        // External images are irrelevant to the browser-computed link name.
        await page.route('https://**/*', route => route.abort());
        await page.goto(pathToFileURL(path.join(__dirname, '../index.html')).href);
        const link = page.locator('.award-banner');
        const visibleWords = (await link.innerText()).replace(/\s+/g, ' ').trim();
        assert.equal(visibleWords, 'Gold Winner 2026 Cybersecurity Excellence Awards');
        assert.equal(await page.getByRole('link', { name: visibleWords, exact: true }).count(), 1);

        // The previous reversed aria-label breaks speech-input matching even
        // though the link remains clickable and looks identical.
        await link.evaluate(element => element.setAttribute('aria-label',
          '2026 Cybersecurity Excellence Awards — Gold Winner'));
        assert.equal(await page.getByRole('link', { name: visibleWords, exact: true }).count(), 0);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
});
