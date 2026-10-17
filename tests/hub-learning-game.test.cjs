'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('../tools/node_modules/playwright');

// Exercise real grid filtering and the menu route. Games remain available while
// source evidence is retained separately from the visible exhibit display.
test('games stay out of the main grid and remain reachable through the menu', async () => {
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
        const game = page.locator('.project-card[href="' + gameURL + '"]');
        assert.equal(await game.isVisible(),false);
        const count=await page.locator('.project-card:not([data-format="learning-game"])').count();
        assert.equal(Number(await page.locator('#exhibit-count').textContent()),count);
        if (width < 761) await page.locator('#filter-toggle').click();
        await page.locator('.level-btn[data-level="beginner"]').click();
        for(const query of ['learning game','Lattice Builder']){
          await page.locator('#demo-search').fill(query);
          assert.equal(await game.isVisible(),false,'search must not resurrect the hidden game');
        }
        await page.locator('.level-btn[data-level="advanced"]').click();
        await page.locator('#demo-search').fill('');
        assert.equal(await game.isVisible(),false);
        const pq = page.locator('#path-band-post-quantum');
        await pq.locator('summary').click();
        assert.equal(await pq.getByRole('link',{name:'Lattice Builder',exact:true}).count(),0);
        assert.equal(await pq.getByRole('link',{name:'Lattice Gentle',exact:true}).count(),1);
        await page.locator('#menuToggle').click();
        const games=page.locator('#nav-menu a[href="games/"]');
        assert.equal(await games.isVisible(),true);assert.match(await games.innerText(),/Learn through play/);
        assert.equal(await games.getAttribute('href'),'games/');
        // file:// has no directory index routing; load the index at the menu target.
        await page.goto(new URL('index.html',await games.evaluate(a=>a.href)).href);
        assert.equal(await page.locator('.arcade-card').count(),5);
        assert.equal(await page.locator('.arcade-card[href="'+gameURL+'"]').isVisible(),true);
        for(const slug of ['sealed-showdown','secret-council','merkle-mystery','quantum-courier'])assert.equal(await page.locator(`.arcade-card[href="${slug}/"]`).isVisible(),true);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        assert.deepEqual(errors,[]);
      } finally { await page.close(); }
    }
    const noJS=await browser.newPage({javaScriptEnabled:false});
    try{await noJS.goto(pathToFileURL(path.join(__dirname,'../index.html')).href);assert.equal(await noJS.locator('.project-card[data-format="learning-game"]').isVisible(),false);}finally{await noJS.close();}
  } finally { await browser.close(); }
});
