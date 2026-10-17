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
  fs.mkdirSync(path.join(root,'test-results/merkle-mystery'),{recursive:true});
});
test.after(async () => { await browser?.close(); await new Promise(resolve => server?.close(resolve)); });
async function open(width=1366,init){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 if(init)await page.addInitScript(init);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.route('https://**/*',route=>route.abort());await page.goto(origin+'/games/merkle-mystery/');await ready(page);
 return {page,errors};
}
async function ready(page){await page.waitForFunction(()=>document.querySelector('#game').getAttribute('aria-busy')==='false');}
const phase=page=>page.locator('#game').getAttribute('data-phase');
async function runAt(page,index){await page.locator(`[data-run="${index}"]`).click();await ready(page);}
async function step(page){
 const level=Number(await page.locator('#game').getAttribute('data-level')),target=Number(await page.locator('#game').getAttribute('data-target'));
 const position=Math.floor(target/2**level),sibling=position^1;
 await page.locator(`[data-node="${level}:${sibling}"]`).click();await page.locator(position%2?'#join-left':'#join-right').click();await ready(page);
}
async function climb(page){while(await phase(page)==='build')await step(page);assert.equal(await phase(page),'judge');}
async function independentlyCheck(page){
 const {createHash}=require('node:crypto');
 const H=(...parts)=>createHash('sha256').update(Buffer.concat(parts)).digest('hex');
 const record=(await page.locator('#record-full').textContent()).split(': ').slice(1).join(': ');
 let hash=H(Buffer.from([0]),Buffer.from(record));
 for(const text of await page.locator('#calculations pre').allTextContents()){
  const left=text.match(/LEFT  ([0-9a-f]{64})/)[1],right=text.match(/RIGHT ([0-9a-f]{64})/)[1],out=text.match(/=     ([0-9a-f]{64})/)[1];
  assert.equal(text.includes('sibling on the left')?right:left,hash);
  hash=H(Buffer.from([1]),Buffer.from(left,'hex'),Buffer.from(right,'hex'));assert.equal(out,hash);
 }
 assert.equal(await page.locator('#computed-root').textContent(),hash);
 return hash===await page.locator('#saved-root').textContent();
}
test('all four routes are played, use actual SHA-256 inputs, explain the result and preserve completions',async()=>{
 const {page,errors}=await open();
 try{
  assert.match(await page.locator('.promise').innerText(),/neighboring hashes.*one item.*root you trust/s);
  for(let run=0;run<4;run++){
   await runAt(page,run);await climb(page);const verified=await independentlyCheck(page);assert.equal(verified,run<2);
   assert.equal(await page.locator('#budget').textContent(),`${[2,3,4,4][run]} / ${[2,3,4,4][run]}`);
   if(run===3){assert.equal(await page.locator('#computed-root').textContent(),await page.locator('#courier-root').textContent());assert.match(await page.locator('#root-match').textContent(),/MISMATCH/);}
   await page.locator(verified?'#accept':'#reject').click();assert.equal(await phase(page),'done');
   assert.equal(await page.locator('#lesson').isVisible(),true);assert((await page.locator('#lesson').textContent()).length>100);
  }
  assert.match(await page.locator('#result-kicker').textContent(),/ALL FOUR/);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('crypto-lab-merkle-run-v1')).completed),[true,true,true,true]);
  await page.reload();await ready(page);assert.equal(await page.locator('#runs .done').count(),4);
  assert.deepEqual(errors,[]);
 }finally{await page.close();}
});
test('wrong joins, order, hints and decisions give free feedback, while undo restores the route',async()=>{
 const {page,errors}=await open();
 try{
  const initial=await page.locator('#current-short').textContent();
  await page.locator('[data-node="0:2"]').click();await page.locator('#join-left').click();await ready(page);
  assert.equal(await page.locator('#budget').textContent(),'0 / 2');assert.equal(await page.locator('#current-short').textContent(),initial);
  assert.match(await page.locator('#feedback').textContent(),/wrong block/);assert.match(await page.locator('#preview').textContent(),/Computed SHA-256/);
  await page.locator('[data-node="0:0"]').click();await page.locator('#join-right').click();await ready(page);
  assert.match(await page.locator('#feedback').textContent(),/wrong order/);assert.equal(await page.locator('#budget').textContent(),'0 / 2');
  await page.locator('#hint').click();assert.match(await page.locator('#feedback').textContent(),/Hints are always free/);
  await page.locator('[data-node="0:0"]').focus();await page.keyboard.press('Enter');await page.locator('#join-left').focus();await page.keyboard.press('Enter');await ready(page);
  assert.equal(await page.locator('#budget').textContent(),'1 / 2');await page.locator('#undo').click();assert.equal(await page.locator('#current-short').textContent(),initial);
  await climb(page);await page.locator('#reject').click();assert.equal(await phase(page),'judge');assert.equal(await page.locator('#runs .done').count(),0);
  await page.locator('#accept').click();assert.equal(await phase(page),'done');
  await page.locator('#next').click();await ready(page);assert.equal(await page.locator('#run-name').textContent(),'Travel light');
  assert.equal(await page.locator('#budget').textContent(),'0 / 3');assert.equal(await page.locator('#result').isVisible(),false);
  await runAt(page,3);await climb(page);await page.locator('#accept').click();assert.equal(await phase(page),'judge');assert.match(await page.locator('#feedback').textContent(),/does not match/);
  await page.locator('#reject').click();assert.match(await page.locator('#lesson').textContent(),/does not make that root trustworthy/);
  assert.deepEqual(errors,[]);
 }finally{await page.close();}
});
test('phone, tablet and desktop keep tiles, decisions and full root values inside the viewport',async()=>{
 for(const width of [320,390,768,1366]){
  const {page,errors}=await open(width);
  try{
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`initial ${width}`);
   for(const tile of await page.locator('.choice').all()){const b=await tile.boundingBox();assert(b.width>=44&&b.height>=44);}
   await page.screenshot({path:`test-results/merkle-mystery/run-ready-${width}.png`,fullPage:true});
   await step(page);assert.equal(await page.locator('.platform.current').evaluate(el=>getComputedStyle(el).animationName),'none');
   await page.screenshot({path:`test-results/merkle-mystery/run-jump-${width}.png`,fullPage:true});
   await runAt(page,3);await climb(page);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`judge ${width}`);
   const workshop=await page.locator('#workshop').boundingBox();
   for(const id of ['computed-root','saved-root','courier-root']){const b=await page.locator('#'+id).boundingBox();assert(b.x>=workshop.x&&b.x+b.width<=workshop.x+workshop.width);}
   await page.screenshot({path:`test-results/merkle-mystery/run-forged-${width}.png`,fullPage:true});
   await page.locator('#reject').click();await page.screenshot({path:`test-results/merkle-mystery/run-result-${width}.png`,fullPage:true});
   await page.getByRole('link',{name:'Explore the original archive chapters'}).click();await page.waitForFunction(()=>document.querySelector('#play-area')?.getAttribute('aria-busy')==='false');
   await page.getByRole('link',{name:'Play Proof Run'}).click();await ready(page);assert.equal(await phase(page),'build');
   assert.deepEqual(errors,[]);
  }finally{await page.close();}
 }
});
test('unavailable storage, corrupt progress and absent Web Crypto do not create success or change other game data',async()=>{
 for(const init of [
  ()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('denied');}}),
  ()=>{localStorage.setItem('crypto-lab-merkle-run-v1','{"completed":["true",4,null],"sound":1}');localStorage.setItem('crypto-lab-merkle-mystery-v1','legacy score');localStorage.setItem('theme','dark');}
 ]){
  const {page,errors}=await open(390,init);
  try{
   assert.equal(await page.locator('#runs .done').count(),0);assert.equal(await page.locator('#sound').textContent(),'Sound off');
   await page.locator('#sound').click();await page.locator('#sound').click();await climb(page);await page.locator('#accept').click();assert.equal(await phase(page),'done');
   await page.locator('#clear').click();await ready(page);assert.equal(await page.locator('#runs .done').count(),0);
   if(await page.evaluate(()=>{try{return !!localStorage;}catch{return false;}})){
    assert.equal(await page.evaluate(()=>localStorage.getItem('crypto-lab-merkle-mystery-v1')),'legacy score');assert.equal(await page.evaluate(()=>localStorage.getItem('theme')),'dark');
   }
   assert.deepEqual(errors,[]);
  }finally{await page.close();}
 }
 const {page,errors}=await open(390,()=>Object.defineProperty(crypto,'subtle',{value:undefined}));
 try{assert.equal(await phase(page),'error');assert.equal(await page.locator('.choice').count(),0);assert.match(await page.locator('#feedback').textContent(),/Web Crypto/);assert.deepEqual(errors,[]);}finally{await page.close();}
});
test('a delayed hash cannot overwrite a new run or restore a cleared completion',async()=>{
 const {page,errors}=await open(390,()=>{
  const original=crypto.subtle.digest.bind(crypto.subtle);
  crypto.subtle.digest=async(...args)=>{
   if(window.holdNextHash){window.holdNextHash=false;await new Promise(resolve=>{window.releaseHash=resolve;});const value=await original(...args);window.releasedHashFinished=true;return value;}
   return original(...args);
  };
 });
 try{
  await page.evaluate(()=>{window.holdNextHash=true;});await page.locator('[data-node="0:0"]').click();await page.locator('#join-left').click();
  await page.waitForFunction(()=>typeof window.releaseHash==='function');assert.equal(await page.locator('#game').getAttribute('aria-busy'),'true');
  await runAt(page,2);assert.equal(await page.locator('#run-name').textContent(),'Glitch check');
  await page.evaluate(()=>window.releaseHash());await page.waitForFunction(()=>window.releasedHashFinished===true);
  assert.equal(await page.locator('#run-name').textContent(),'Glitch check');assert.equal(await page.locator('#budget').textContent(),'0 / 4');
  await climb(page);await page.locator('#reject').click();await page.locator('#clear').click();await ready(page);
  assert.equal(await phase(page),'build');assert.equal(await page.locator('#runs .done').count(),0);assert.equal(await page.locator('#result').isVisible(),false);
  assert.deepEqual(errors,[]);
 }finally{await page.close();}
});
