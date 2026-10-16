'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('../tools/node_modules/playwright');

// Exercise discovery through the real filters and generated path links. A metadata
// edit alone cannot establish that a beginner can find and open the game.
test('learning game is discoverable by beginners and fits desktop and phone cards', async () => {
  const browser = await chromium.launch();
  const gameURL = 'https://systemslibrarian.github.io/crypto-lab-lattice-builder/';
  try {
    for (const width of [1366, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      try {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('https://**/*', route => route.abort());
        await page.goto(pathToFileURL(path.join(__dirname, '../index.html')).href);
        const card = page.locator('.project-card[href="' + gameURL + '"]');
        if (width < 761) await page.locator('#filter-toggle').click();
        await page.locator('.level-btn[data-level="beginner"]').click();
        await page.locator('#demo-search').fill('learning game');
        assert.equal(await card.isVisible(), true, 'beginner game search must retain Lattice Builder');
        assert.match(await card.innerText(), /Beginner entry · Advanced exploration/);
        assert.match(await card.innerText(), /geometric analogy/);
        assert.equal(await card.locator('.card-action').innerText(), 'Play Lattice Builder →');
        assert.equal(await page.getByRole('link', { name: /Lattice Builder.*Play Lattice Builder/s }).count(), 1);
        await card.focus();
        assert.equal(await card.evaluate(el => document.activeElement === el), true);
        const fit = await card.evaluate(el => {
          const box = el.getBoundingClientRect();
          return { page: document.documentElement.scrollWidth - innerWidth,
            card: el.scrollWidth - el.clientWidth,
            childrenFit: [...el.querySelectorAll('.card-kicker, .card-entry, .card-action, .chip')]
              .every(child => { const r = child.getBoundingClientRect(); return r.left >= box.left && r.right <= box.right; }) };
        });
        assert(fit.page <= 1 && fit.card <= 1 && fit.childrenFit, JSON.stringify({ width, ...fit }));
        await page.locator('.level-btn[data-level="advanced"]').click();
        assert.equal(await card.isVisible(), false, 'advanced mode does not make the entry-level classification advanced');
        const pq = page.locator('#path-band-post-quantum');
        await pq.locator('summary').click();
        const links = pq.locator('.path-steps a');
        const names = await links.allTextContents();
        const game = names.indexOf('Lattice Builder');
        assert(game >= 0);
        assert.deepEqual(names.slice(game, game + 3), ['Lattice Builder', 'Lattice Gentle', 'Kyber Vault']);
        assert.equal(await links.nth(game).getAttribute('href'), gameURL);
        assert.equal(await links.nth(game).isVisible(), true);
        assert.deepEqual(errors, []);
      } finally { await page.close(); }
    }
  } finally { await browser.close(); }
});
