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
  fs.mkdirSync(path.join(root,'test-results/sealed-showdown'),{recursive:true});
});
test.after(async () => { await browser?.close(); await new Promise(resolve => server?.close(resolve)); });
async function open(width=1366, date=null) {
  const page = await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  await page.route('https://**/*',route=>route.abort());
  if(date) await page.addInitScript(date => { const OriginalDate=Date; globalThis.Date=class extends OriginalDate {constructor(...args){super(...(args.length?args:[date+'T12:00:00Z']));} static now(){return new OriginalDate(date+'T12:00:00Z').getTime();}}; },date);
  await page.goto(origin+'/games/sealed-showdown/');
  await ready(page);
  return {page,errors};
}
const {createHash}=require('node:crypto');
const H=value=>createHash('sha256').update(value).digest('hex');
async function ready(page){await page.waitForFunction(()=>document.querySelector('#play').getAttribute('aria-busy')==='false');}
async function action(page){await page.locator('#action').click();await ready(page);}
async function chapterAt(page,n){await page.locator(`[data-chapter="${n}"]`).click();await ready(page);}
async function solve(page,kind,{mistake=false}={}){
  assert.equal(await page.locator('#lesson-result').isVisible(),false);
  let move='rock';const seal=await page.locator('#bot-seal').textContent();
  if(kind==='guess'){
    for(const m of ['rock','paper','scissors'])await page.locator(`[data-guess="${m}"]`).click();
    const found=await page.locator('[data-guess].matched').getAttribute('data-guess');move={rock:'paper',paper:'scissors',scissors:'rock'}[found];
    assert.match(await page.locator('#guess-status').textContent(),new RegExp(found));
  }
  await page.locator(`[data-move="${move}"]`).click();
  assert.equal(await page.locator('#bot-seal').textContent(),seal);
  await action(page);
  if(kind!=='open'){
    assert.match(await page.locator('#your-seal').textContent(),/^[a-f0-9]{64}$/);assert.equal(await page.locator('#bot-seal').textContent(),seal);
    assert.equal(await page.locator('[data-move]:not(:disabled)').count(),0);
    await action(page);
    assert.equal(H(await page.locator('#human-opening').textContent()),await page.locator('#your-seal').textContent());
    if(kind==='swap'||kind==='replay'){
      await action(page);assert.notEqual(await page.locator('#computed-hash').textContent(),seal);
      const opening=await page.locator('#robot-opening').textContent();assert.equal(H(opening)===seal,kind==='replay');
      if(mistake){await page.locator('#accept').click();assert.equal(await page.locator('#lesson-result').isVisible(),false);}
      await page.locator('#reject').click();
    }else if(kind==='abort'){
      assert.equal(await page.locator('#robot-opening').count(),0);
      if(mistake){await page.locator('#declare-win').click();assert.equal(await page.locator('#lesson-result').isVisible(),false);}
      await page.locator('#incomplete').click();
    }else{assert.equal(H(await page.locator('#robot-opening').textContent()),seal);assert.match(await page.locator('#verification-title').innerText(),/matches/);}
  }
  await page.locator('#lesson-result').waitFor({state:'visible'});
  assert(await page.evaluate(()=>document.querySelector('#lesson-result').compareDocumentPosition(document.querySelector('#action')) & Node.DOCUMENT_POSITION_FOLLOWING));
  const keywords={open:/timing/,sealed:/Both hashes matched/,guess:/three possible moves/,swap:/binding/,replay:/current round/,abort:/cannot force participation/};
  assert.match(await page.locator('#lesson').innerText(),keywords[kind]);
}
test('six playable lessons, independently hashed openings, visible takeaways, scores and clipboard fallback',async()=>{
  const {page,errors}=await open();
  try{
    await page.screenshot({path:'test-results/sealed-showdown/desktop.png',fullPage:true});
    for(const kind of ['open','sealed','guess','swap','replay','abort']){await solve(page,kind);await action(page);}
    assert.match(await page.locator('#finish-text').innerText(),/6\/6.*18\/18/);
    await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new Error('denied');};});await page.locator('#copy-result').click();await page.locator('#copy-fallback').waitFor({state:'visible'});assert.match(await page.locator('#copy-fallback').inputValue(),/Sealed Showdown/);
    await page.reload();await ready(page);assert.equal(await page.locator('#progress').innerText(),'18 / 18 learning badges');
    await page.locator('#clear-progress').evaluate(b=>b.closest('details').open=true);await page.locator('#clear-progress').click();await ready(page);assert.match(await page.locator('#progress').innerText(),/^0 \/ 18/);assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('false verdicts and hints lower learning score; honest losses still complete the lesson',async()=>{
  const {page,errors}=await open();
  try{
    for(const [n,kind] of [[3,'swap'],[4,'replay'],[5,'abort']]){await chapterAt(page,n);await page.locator('#hint').click();await page.locator('#hint').click();await solve(page,kind,{mistake:true});assert.match(await page.locator('#earned').innerText(),/1 \/ 3/);}
    // Fixed independent robot choice produces a loss, without changing verification.
    await page.evaluate(()=>{crypto.getRandomValues=a=>{a.fill(1);return a;};});await chapterAt(page,1);await solve(page,'sealed');assert.equal(await page.locator('#outcome-title').innerText(),'Switch wins this round.');assert.match(await page.locator('#earned').innerText(),/3 \/ 3/);assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('five-round arena keeps RPS results separate and verifies every opening',async()=>{
  const {page,errors}=await open(390);
  try{
    await page.locator('[data-mode=arena]').click();await ready(page);
    for(let i=0;i<5;i++){await solve(page,'sealed');const total=await page.locator('#arena-score strong').evaluateAll(ns=>ns.reduce((s,n)=>s+Number(n.textContent),0));assert.equal(total,i+1);await action(page);}
    assert.match(await page.locator('#finish-text').innerText(),/5\/5 verified rounds/);const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('crypto-lab-sealed-showdown-v1')));assert.deepEqual(stored.best,[0,0,0,0,0,0]);assert.equal(stored.arenaBest,Number(await page.locator('#you-score').innerText()));assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('daily variants preserve one hint charge and captured date across all three lessons',async()=>{
  const {dailyPlan,LESSONS}=await import('../games/sealed-showdown/core.mjs');const covered=new Set();
  for(let d=1;covered.size<5&&d<40;d++){
    const date=new Date(Date.UTC(2026,0,d)).toISOString().slice(0,10),plan=dailyPlan(date);if(plan.chapters.every(c=>covered.has(c)))continue;
    const {page,errors}=await open(390,date);
    try{
      await page.locator('[data-mode=daily]').click();await ready(page);await page.locator('#hint').click();
      await page.evaluate(()=>{const D=Date;globalThis.Date=class extends D{constructor(...args){super(...(args.length?args:['2027-01-01T01:00:00Z']));}};});
      for(const c of plan.chapters){await solve(page,LESSONS[c].kind);covered.add(c);await action(page);}
      assert.match(await page.locator('#finish-text').innerText(),new RegExp(date));assert.match(await page.locator('#finish-text').innerText(),/2\/3/);assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }assert.equal(covered.size,5);
});
test('keyboard and responsive layouts include the learning result and public hashes',async()=>{
  for(const width of [320,390,768,1366]){
    const {page,errors}=await open(width);
    try{
      await page.locator('[data-move=paper]').focus();await page.keyboard.press('Space');assert.equal(await page.locator('[data-move=paper]').getAttribute('aria-pressed'),'true');
      await page.screenshot({path:`test-results/sealed-showdown/width-${width}.png`,fullPage:true});
      await chapterAt(page,2);await solve(page,'guess');await page.locator('#receipt summary').click();
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow ${width}`);
      await page.screenshot({path:`test-results/sealed-showdown/lesson-${width}.png`,fullPage:true});
      await page.goto(origin+'/games/');assert.equal(await page.getByRole('link',{name:/Sealed Showdown.*Play Sealed Showdown/}).count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }
});
test('storage, unsupported crypto, midround RNG errors and stale digests fail safely',async()=>{
  for(const denied of [false,true]){
    const page=await browser.newPage();try{
      await page.addInitScript(denied=>{localStorage.setItem('theme','sentinel');localStorage.setItem('crypto-lab-sealed-showdown-v1','{"best":[99]}');if(denied)for(const method of ['getItem','setItem','removeItem'])Storage.prototype[method]=()=>{throw new Error('blocked');};},denied);
      await page.goto(origin+'/games/sealed-showdown/');await ready(page);assert.match(await page.locator('#progress').innerText(),/^0 \/ 18/);await solve(page,'open');if(denied)assert.match(await page.locator('#storage-status').textContent(),/unavailable/);else assert.equal(await page.evaluate(()=>localStorage.getItem('theme')),'sentinel');
    }finally{await page.close();}
  }
  const {page,errors}=await open();try{
    await chapterAt(page,1);await page.locator('[data-move=rock]').click();
    await page.evaluate(()=>{const original=crypto.subtle.digest.bind(crypto.subtle);crypto.subtle.digest=(...args)=>new Promise(resolve=>setTimeout(()=>resolve(original(...args)),150));document.querySelector('#action').click();document.querySelector('[data-chapter="0"]').click();});
    await page.waitForTimeout(250);await ready(page);assert.equal(await page.locator('#round-title').innerText(),'After you, human');assert.equal(await page.locator('#your-seal').textContent(),'Not committed');
    await chapterAt(page,1);await page.locator('[data-move=rock]').click();await page.evaluate(()=>{crypto.getRandomValues=()=>{throw new Error('Random source unavailable');};});await action(page);assert.match(await page.locator('#feedback').innerText(),/Random source unavailable/);assert.equal(await page.locator('#lesson-result').isVisible(),false);assert.deepEqual(errors,[]);
  }finally{await page.close();}
  const unsupported=await browser.newPage();try{await unsupported.addInitScript(()=>{crypto.getRandomValues=undefined;});await unsupported.goto(origin+'/games/sealed-showdown/');await ready(unsupported);assert.match(await unsupported.locator('#feedback').innerText(),/needs Web Crypto/);assert.equal(await unsupported.locator('#action').isDisabled(),true);}finally{await unsupported.close();}
});
