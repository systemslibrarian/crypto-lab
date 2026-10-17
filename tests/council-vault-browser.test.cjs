'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../tools/node_modules/playwright');
const root = path.resolve(__dirname, '..');
let server, browser, origin;
test.before(async () => {
  server = http.createServer((req,res) => {
    let file = path.resolve(root,'.' + new URL(req.url,'http://localhost').pathname);
    if (!file.startsWith(root+path.sep)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
    fs.readFile(file,(error,data) => {
      if(error){res.writeHead(404);res.end();return;}
      res.setHeader('Content-Type', ({'.html':'text/html','.mjs':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)] || 'text/plain');
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
  fs.mkdirSync(path.join(root,'test-results/secret-council'),{recursive:true});
});
test.after(async () => { await browser?.close(); await new Promise(resolve => server?.close(resolve)); });
async function open(width=1366, init) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  if(init)await page.addInitScript(init);
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  await page.route('https://**/*',route=>route.abort());
  await page.goto(origin+'/games/secret-council/vault.html');
  await page.waitForFunction(()=>document.querySelectorAll('.keeper').length===5);
  return {page,errors};
}
const phase=page=>page.locator('#game').getAttribute('data-phase');
async function events(page) {
  while(await phase(page)==='watch')await page.locator('#action').click();
  assert.equal(await phase(page),'recover');
}
async function collect(page) {
  for(const keeper of await page.locator('.keeper:not(.stranded)').all())await keeper.click();
  await page.locator('#action').click();
  assert.equal(await phase(page),'result');
}
async function help(page,kind,house){await page.locator('#dispatch-house').selectOption(String(house));await page.locator('#'+kind).click();}
async function independentSecret(page,ids) {
  const points=[];
  for(const id of ids){const m=(await page.locator(`[data-point="${id}"]`).innerText()).match(/\((\d+), (\d+)\)/);points.push(m.slice(1).map(Number));}
  const mod=n=>((n%17)+17)%17;
  let secret=0;
  for(let i=0;i<points.length;i++){
    let weight=1;
    for(let j=0;j<points.length;j++)if(i!==j){let inverse=1;while(mod((points[i][0]-points[j][0])*inverse)!==1)inverse++;weight=mod(weight*(-points[j][0])*inverse);}
    secret=mod(secret+points[i][1]*weight);
  }
  return secret;
}
test('purpose precedes play; first plan fails, free rewind changes the outcome and compares actual attempts',async()=>{
  const {page,errors}=await open();
  try{
    assert.match(await page.locator('.promise').innerText(),/learn.*splitting a secret/s);
    assert.equal(await page.locator('[data-threshold="4"]').getAttribute('aria-pressed'),'true');
    await page.locator('#hint').click();assert.equal(await page.locator('#hint-text').isVisible(),true);
    await page.screenshot({path:'test-results/secret-council/vault-plan-1366.png',fullPage:true});
    await page.locator('#action').click();await events(page);await collect(page);
    assert.match(await page.locator('#result-title').innerText(),/Locked out/);
    assert.match(await page.locator('#result-facts').innerText(),/3 keepers.*required 4/s);
    assert.equal(await page.locator('#lesson').isVisible(),true);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('crypto-lab-council-vault-v1'))?.completed?.[0]??false),false);
    await page.locator('#retry-result').click();
    assert.equal(await phase(page),'plan');
    assert.equal(await page.locator('#stolen-count').innerText(),'0 / 4 needed');
    assert.equal(await page.locator('.keeper.copied').count(),0);assert.equal(await page.locator('.house.flooded').count(),0);
    await page.locator('[data-threshold="3"]').click();await page.locator('#action').click();await events(page);
    await page.locator('#evidence summary').click();
    const expected=await independentSecret(page,[0,1,4]);
    await page.locator('#action').click();assert.equal(await phase(page),'recover');assert.match(await page.locator('#feedback').innerText(),/Choose 3 more/);
    await collect(page);
    assert.match(await page.locator('#vault-detail').innerText(),new RegExp(`Recovered secret: ${expected}$`));
    assert.match(await page.locator('#result-title').innerText(),/seeds are safe/);
    assert.match(await page.locator('#result-facts').innerText(),/All 17 possible/);
    assert.match(await page.locator('#comparison').innerText(),/Previous attempt: threshold 4.*This attempt: threshold 3/s);
    assert.match(await page.locator('#connection').innerText(),/encryption key/);
    assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('crypto-lab-council-vault-v1')).completed),[true,false,false]);
    await page.screenshot({path:'test-results/secret-council/vault-result-1366.png',fullPage:true});
    await page.reload();await page.waitForFunction(()=>document.querySelectorAll('.keeper').length===5);
    assert.equal(await page.locator('#nights .done').count(),1);
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('all missions can be saved with intervention; flood rescue uses real shares and no help erases theft',async()=>{
  const {page,errors}=await open();
  try{
    // Default threshold four needs a ferry after the flood.
    await page.locator('#action').click();await events(page);
    assert.equal(await page.locator('.keeper.stranded').count(),2);
    await help(page,'ferry',1);
    assert.equal(await page.locator('.keeper.stranded').count(),0);assert.equal(await page.locator('#reserve-count').innerText(),'0');
    assert.equal(await page.locator('#guard').isDisabled(),true);
    await collect(page);assert.match(await page.locator('#result-title').innerText(),/seeds are safe/);
    await page.locator('#next-night').click();await page.locator('#action').click();
    await help(page,'guard',0);await events(page);await collect(page);
    assert.match(await page.locator('#result-title').innerText(),/seeds are safe/);
    await page.locator('#next-night').click();await page.locator('#action').click();
    await help(page,'guard',0);await help(page,'ferry',1);await events(page);await collect(page);
    assert.match(await page.locator('#result-title').innerText(),/seeds are safe/);
    assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('crypto-lab-council-vault-v1')).completed),[true,true,true]);
    // Expose a low-threshold secret; late help cannot make it private again.
    await page.locator('[data-night="0"]').click();await page.locator('[data-threshold="2"]').click();await page.locator('#action').click();await page.locator('#action').click();
    assert.equal(await page.locator('#vault-state').innerText(),'Secret exposed');
    await help(page,'guard',0);await events(page);await collect(page);
    assert.match(await page.locator('#result-title').innerText(),/thieves learned/);
    assert.match(await page.locator('#result-facts').innerText(),/They actually reconstructed secret/);
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('keeper movement is free before dusk, costs reserves later, preserves stolen copies, and supports keyboard',async()=>{
  const {page,errors}=await open();
  try{
    await page.locator('[data-keeper="0"]').focus();await page.keyboard.press('Space');
    await page.locator('[data-move="2"]').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-house="2"] [data-keeper="0"]').count(),1);
    assert.equal(await page.locator('#reserve-count').innerText(),'1');
    await page.locator('#rewind').click();
    await page.locator('[data-night="1"]').click();await page.locator('#action').click();await page.locator('#action').click();
    assert.equal(await page.locator('#stolen-count').innerText(),'2 / 3 needed');
    await page.locator('[data-keeper="0"]').click();await page.locator('[data-move="2"]').click();
    assert.equal(await page.locator('#reserve-count').innerText(),'0');
    assert.equal(await page.locator('[data-house="2"] .keeper.copied').count(),1);
    assert.equal(await page.locator('#stolen-count').innerText(),'2 / 3 needed');
    await page.locator('#action').click();assert.equal(await page.locator('#stolen-count').innerText(),'3 / 3 needed');
    assert.equal(await page.locator('#vault-state').innerText(),'Secret exposed');
    await page.locator('#rewind').click();
    assert.equal(await page.locator('[data-house="0"] [data-keeper="0"]').count(),1);
    assert.equal(await page.locator('#reserve-count').innerText(),'1');
    assert.equal(await page.locator('.keeper.copied').count(),0);
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('responsive mission and result, meaningful native controls, reduced motion and chapter navigation',async()=>{
  for(const width of [320,390,768,1366]){
    const {page,errors}=await open(width);
    try{
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`plan overflow ${width}`);
      if(width<=700){
        await page.locator('#quick-action').waitFor({state:'visible'});
        const threshold=await page.locator('#threshold-controls').boundingBox(),city=await page.locator('#city').boundingBox();
        assert(threshold.y<city.y,'threshold precedes map on a phone');
        const quick=await page.locator('#quick-action').boundingBox();assert(quick.y+quick.height<=1000);
      }
      for(const keeper of await page.locator('.keeper').all()){const b=await keeper.boundingBox();assert(b.width>=44&&b.height>=44);}
      await page.screenshot({path:`test-results/secret-council/vault-plan-${width}.png`,fullPage:true});
      await page.locator('[data-threshold="3"]').click();await page.locator(width<=700?'#quick-action':'#action').click();
      if(width<=700){
        await page.locator('#quick-action').click();assert.match(await page.locator('#feedback').innerText(),/Thieves now hold 2/);
        const event=await page.locator('.event-card').boundingBox(),bar=await page.locator('#mobile-actions').boundingBox();
        assert(event.y>=0&&event.y+event.height<bar.y,'event outcome stays visible above the phone controls');
        await page.screenshot({path:`test-results/secret-council/vault-event-${width}.png`,fullPage:false});
      }
      await events(page);await collect(page);
      assert.equal(await page.locator('#mobile-actions').isVisible(),false);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`result overflow ${width}`);
      assert.equal(await page.locator('#vault').evaluate(el=>getComputedStyle(el).animationName),'none');
      await page.screenshot({path:`test-results/secret-council/vault-result-${width}.png`,fullPage:true});
      await page.locator('header').getByRole('link',{name:'Guided chapters'}).click();
      await page.waitForFunction(()=>document.querySelectorAll('.keeper').length===7);
      await page.goto(origin+'/games/secret-council/vault.html');
      await page.waitForFunction(()=>document.querySelectorAll('.keeper').length===5);
      assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }
});
test('blocked or corrupt storage and absent RNG fail honestly without disrupting other progress',async()=>{
  for(const init of [
    ()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}}),
    ()=>{localStorage.setItem('crypto-lab-council-vault-v1','{"completed":["true",99,null],"sound":"yes"}');localStorage.setItem('theme','dark');localStorage.setItem('crypto-lab-secret-council-v1','{"scores":[3,0,0,0,0,0]}');}
  ]){
    const {page,errors}=await open(390,init);
    try{
      assert.equal(await page.locator('#nights .done').count(),0);
      await page.locator('#sound').click();await page.locator('#sound').click();
      await page.locator('[data-threshold="3"]').click();await page.locator('#action').click();await events(page);await collect(page);
      assert.match(await page.locator('#result-title').innerText(),/seeds are safe/);
      await page.locator('#clear-progress').click();assert.equal(await page.locator('#nights .done').count(),0);
      if(await page.evaluate(()=>{try{return !!localStorage;}catch{return false;}})){
        assert.equal(await page.evaluate(()=>localStorage.getItem('theme')),'dark');
        assert.match(await page.evaluate(()=>localStorage.getItem('crypto-lab-secret-council-v1')),/"scores":\[3/);
      }
      assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }
  const {page,errors}=await open(390,()=>{Object.defineProperty(crypto,'getRandomValues',{value:undefined});});
  try{
    await page.locator('#action').click();
    assert.equal(await phase(page),'plan');assert.match(await page.locator('#feedback').innerText(),/secure random/);
    assert.equal(await page.locator('#share-table tr').count(),0);
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
