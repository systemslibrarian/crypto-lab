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
async function open(width=1366,init){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  if(init)await page.addInitScript(init);
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  await page.route('https://**/*',route=>route.abort());
  // Control only the browser clock. Every move and result still uses real UI events.
  await page.clock.install({time:new Date('2026-10-17T12:00:00Z')});
  await page.clock.pauseAt(new Date('2026-10-17T12:00:01Z'));
  await page.goto(origin+'/games/key-rush/');
  await page.locator('#thresholds button').first().waitFor();
  return {page,errors};
}
const attr=(page,key)=>page.locator('#arena').getAttribute('data-'+key);
const keys={U:'ArrowUp',D:'ArrowDown',L:'ArrowLeft',R:'ArrowRight'};
async function route(page,path){for(const d of path)await page.keyboard.press(keys[d]);}
async function begin(page){await page.locator('#start').click();assert.equal(await attr(page,'phase'),'playing');}
async function pointSecret(page,ids){
  const points=[];
  for(const id of ids){const m=(await page.locator(`[data-point="${id}"]`).textContent()).match(/\((\d+), (\d+)\)/);points.push(m.slice(1).map(Number));}
  const mod=n=>((n%17)+17)%17;
  let secret=0;
  for(let i=0;i<points.length;i++){
    let weight=1;
    for(let j=0;j<points.length;j++)if(i!==j){let inverse=1;while(mod((points[i][0]-points[j][0])*inverse)!==1)inverse++;weight=mod(weight*(-points[j][0])*inverse);}
    secret=mod(secret+points[i][1]*weight);
  }
  return secret;
}
test('all three arenas complete through controls and reconstruct the actual displayed shares',async()=>{
  const {page,errors}=await open();
  try{
    assert.match(await page.locator('.intro').innerText(),/learn why sharing a secret/);
    assert.match(await page.locator('#overlay-copy').innerText(),/different share.*Deliver 2/s);
    const paths=['RRRRRRRRRR','UURRRRDDURRRRRRD','UURRRRDDRRRRRR'];
    for(let level=0;level<3;level++){
      await page.locator(`[data-level="${level}"]`).click();await begin(page);
      if(level===1)await page.clock.runFor(240);
      const k=level===0?2:3;
      const expected=await pointSecret(page,Array.from({length:k},(_,i)=>i));
      for(let bot=0;bot<k;bot++)await route(page,paths[level]);
      assert.equal(await attr(page,'reason'),'win',`arena ${level+1}`);
      assert.equal(await page.locator('#lesson-panel').isVisible(),true);
      assert.match(await page.locator('#lesson').innerText(),/all 17 possible secret values/);
      assert.match(await page.locator('#math-summary').textContent(),new RegExp(`Delivered shares recovered: ${expected}\\.`));
    }
    assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('crypto-lab-key-rush-v1')).completed),[true,true,true]);
    await page.reload();await page.locator('#thresholds button').first().waitFor();
    assert.equal(await page.locator('#levels .complete').count(),3);
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('copies do not destroy originals; distinct copies expose the secret and a free retry changes the threshold tradeoff',async()=>{
  const {page,errors}=await open();
  try{
    await begin(page);await route(page,'URRRR');
    assert.equal(await page.locator('#copy-count').textContent(),'1 / 2');
    await route(page,'LR');assert.equal(await page.locator('#copy-count').textContent(),'1 / 2');
    await route(page,'RRRRRRD');assert.equal(await page.locator('#home-count').textContent(),'1 / 2');
    const expected=await pointSecret(page,[0,1]);
    await route(page,'URRRR');assert.equal(await attr(page,'reason'),'breach');
    assert.match(await page.locator('#math-summary').textContent(),new RegExp(`Scanners recovered: ${expected}\\.`));
    assert.match(await page.locator('#lesson').textContent(),/2 different shares.*reconstructed/);
    await page.locator('[data-threshold="3"]').click();await begin(page);
    assert.equal(await page.locator('#copy-count').textContent(),'0 / 3');
    for(let i=0;i<2;i++)await route(page,'URRRRRRRRRRD');
    assert.equal(await attr(page,'phase'),'playing');
    assert.equal(await page.locator('#home-count').textContent(),'2 / 3');
    assert.equal(await page.locator('#copy-count').textContent(),'2 / 3');
    await route(page,'RRRRRRRRRR');assert.equal(await attr(page,'reason'),'win');
    assert.match(await page.locator('#compare').textContent(),/Last run: threshold 2.*This run: threshold 3/s);
    await page.locator('#start').click();assert.equal(await attr(page,'phase'),'playing');
    assert.equal(await page.locator('#copy-count').textContent(),'0 / 3');
    assert.equal(await page.locator('#home-count').textContent(),'0 / 3');
    assert.equal(await page.locator('#lesson-panel').isVisible(),false);
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('traps cause availability failure without silently copying any shares',async()=>{
  const {page,errors}=await open();
  try{
    await page.locator('[data-level="1"]').click();await begin(page);
    for(let i=0;i<3;i++)await route(page,'UURRRRDDR');
    assert.equal(await attr(page,'reason'),'lost');
    assert.equal(await page.locator('#copy-count').textContent(),'0 / 3');
    assert.equal(await page.locator('.bot-badge.offline').count(),3);
    assert.match(await page.locator('#lesson').textContent(),/needed 3 shares.*only 2 bots/s);
    assert.match(await page.locator('#connection').textContent(),/Scanners copy a share; traps make it unavailable/);
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('held controls, boost traversal, cooldown, moving hazards, pause and slow practice use elapsed time',async()=>{
  const {page,errors}=await open();
  try{
    await begin(page);await route(page,'URR');await page.keyboard.press('Space');
    assert.equal(await attr(page,'position'),'5,2');
    assert.equal(await page.locator('#copy-count').textContent(),'1 / 2');
    await page.keyboard.press('Space');assert.equal(await attr(page,'position'),'5,2');
    assert.equal(await page.locator('#boost').isDisabled(),true);
    await page.locator('#reset').click();await begin(page);
    await page.keyboard.down('ArrowRight');await page.clock.runFor(400);await page.keyboard.up('ArrowRight');
    assert.equal(await attr(page,'position'),'3,3');
    await page.keyboard.press('ArrowRight');assert.equal(await attr(page,'position'),'4,3');
    await page.keyboard.press('p');assert.equal(await attr(page,'phase'),'paused');
    const elapsed=await attr(page,'elapsed');await page.clock.runFor(2400);
    assert.equal(await attr(page,'elapsed'),elapsed);assert.equal(await page.locator('#copy-count').textContent(),'0 / 2');
    await page.keyboard.press('p');await page.clock.runFor(1800);
    assert.equal(await page.locator('#copy-count').textContent(),'1 / 2','stationary bot scanned after gap moves');
    await page.locator('#reset').click();await page.locator('#slow').check();await begin(page);await page.clock.runFor(1000);
    const slow=Number(await attr(page,'elapsed'));assert(slow>540&&slow<650,`slow time ${slow}`);
    await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
    assert.equal(await attr(page,'phase'),'paused');
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('phone, tablet and desktop layouts expose touch controls, full result and legacy navigation',async()=>{
  for(const width of [320,390,768,1366]){
    const {page,errors}=await open(width);
    try{
      const fit=async label=>{
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${label}: width ${width}`);
        const arena=await page.locator('#arena-wrap').boundingBox(),card=await page.locator('.overlay-card').boundingBox();
        assert(card.y>=arena.y-1&&card.y+card.height<=arena.y+arena.height+1,`${label}: overlay fits arena at ${width}`);
      };
      await fit('ready');
      await page.screenshot({path:`test-results/secret-council/key-rush-ready-${width}.png`,fullPage:true});
      await begin(page);
      if(width<=700){
        const hud=await page.locator('.hud').boundingBox(),controls=await page.locator('.play-controls').boundingBox();
        assert(hud.y>=0&&controls.y+controls.height<=1000,'phone shows share counters and movement controls together');
      }
      await page.locator('[data-direction="up"]').click();assert.equal(await attr(page,'position'),'0,2');
      await page.locator('[data-direction="down"]').focus();await page.keyboard.press('Enter');assert.equal(await attr(page,'position'),'0,3');
      await page.locator('#arena').focus();await route(page,'RR');
      await page.screenshot({path:`test-results/secret-council/key-rush-playing-${width}.png`,fullPage:width>700});
      await route(page,'RRRRRRRR');await route(page,'RRRRRRRRRR');
      assert.equal(await attr(page,'reason'),'win');await fit('result');
      await page.screenshot({path:`test-results/secret-council/key-rush-result-${width}.png`,fullPage:true});
      await page.goto(origin+'/games/secret-council/');await page.waitForURL('**/games/key-rush/');
      await page.locator('#thresholds button').first().waitFor();
      assert.equal(await page.title(),'Key Rush · Crypto Lab');
      assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }
});
test('blocked/corrupt storage and absent secure randomness fail honestly and leave other progress alone',async()=>{
  for(const init of [
    ()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}}),
    ()=>{localStorage.setItem('crypto-lab-key-rush-v1','{"completed":["yes",7,null],"sound":"yes"}');localStorage.setItem('theme','dark');localStorage.setItem('crypto-lab-secret-council-v1','retained');}
  ]){
    const {page,errors}=await open(390,init);
    try{
      assert.equal(await page.locator('#levels .complete').count(),0);
      assert.equal(await page.locator('#sound').textContent(),'Sound off');
      await begin(page);await route(page,'RRRRRRRRRRRRRRRRRRRR');assert.equal(await attr(page,'reason'),'win');
      await page.locator('#clear').click();assert.equal(await page.locator('#levels .complete').count(),0);
      if(await page.evaluate(()=>{try{return !!localStorage;}catch{return false;}})){
        assert.equal(await page.evaluate(()=>localStorage.getItem('theme')),'dark');
        assert.equal(await page.evaluate(()=>localStorage.getItem('crypto-lab-secret-council-v1')),'retained');
      }
      assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }
  const {page,errors}=await open(390,()=>Object.defineProperty(crypto,'getRandomValues',{value:undefined}));
  try{
    await page.locator('#start').click();assert.equal(await attr(page,'phase'),'ready');
    assert.match(await page.locator('#game-status').textContent(),/secure random/);
    assert.equal(await page.locator('#share-table tr').count(),0);assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
