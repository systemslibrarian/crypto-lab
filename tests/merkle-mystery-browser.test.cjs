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
async function open(width=1366, date=null) {
  const page = await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  await page.route('https://**/*',route=>route.abort());
  if(date) await page.addInitScript(date => { const OriginalDate=Date; globalThis.Date=class extends OriginalDate {constructor(...args){super(...(args.length?args:[date+'T12:00:00Z']));} static now(){return new OriginalDate(date+'T12:00:00Z').getTime();}}; },date);
  await page.goto(origin+'/games/merkle-mystery/');
  await ready(page);
  return {page,errors};
}
async function ready(page) { await page.waitForFunction(()=>document.querySelector('#play-area').getAttribute('aria-busy')==='false' && document.querySelectorAll('.node').length>0); }
async function select(page,ids) { for(const id of ids)await page.locator(`.node[data-node="${id}"]`).click(); }
async function submit(page) { await page.locator('#action').click(); await ready(page); }
async function closed(page) { await page.locator('#chapter-result').waitFor({state:'visible'}); }
async function chapterAt(page,index) { await page.locator(`[data-chapter="${index}"]`).click(); await ready(page); }
async function independentParcel(page) {
  const {createHash}=require('node:crypto');
  const title=await page.locator('#parcel h4').innerText(),passage=await page.locator('#parcel>p').innerText();
  const position=Number((await page.locator('#parcel small').innerText()).match(/Book (\d+)/)[1])-1;
  const proof=await page.locator('#parcel code').allTextContents();
  const H=(...parts)=>createHash('sha256').update(Buffer.concat(parts)).digest();
  let current=H(Buffer.from([0]),Buffer.from(JSON.stringify([title,passage]))),i=position;
  for(const line of proof){const sibling=Buffer.from(line.slice(3),'hex');current=i%2?H(Buffer.from([1]),sibling,current):H(Buffer.from([1]),current,sibling);i=Math.floor(i/2);}
  return current.toString('hex') === await page.locator('#trusted-root').innerText();
}
test('complete six chapters; independently check parcel verdicts, scores, persistence and clipboard fallback',async()=>{
  const {page,errors}=await open();
  try{
    await page.screenshot({path:'test-results/merkle-mystery/desktop.png',fullPage:true});
    await select(page,['0:2']);await submit(page);await closed(page);await submit(page);
    await select(page,['0:5','1:2','2:1','3:0']);await submit(page);await closed(page);await submit(page);
    await select(page,['0:3','1:0','2:1']);await submit(page);await closed(page);
    assert.equal(await page.locator('#proof-steps li').count(),5);
    await submit(page);
    for(const expected of [true,false,false]){
      assert.equal(await independentParcel(page),expected);
      await submit(page);await page.locator(expected?'#accept':'#quarantine').click();
    }
    await closed(page);await submit(page);
    await select(page,['0:1','0:6']);await submit(page);await closed(page);await submit(page);
    await page.locator('input[value=recorded]').check();
    assert.equal(await independentParcel(page),false);
    await submit(page);await page.locator('#quarantine').click();await closed(page);await submit(page);
    assert.match(await page.locator('#finish-text').innerText(),/6\/6 chapters.*18\/18 bookplates/);
    await page.context().grantPermissions(['clipboard-read','clipboard-write'],{origin});
    await page.locator('#copy-result').click();await page.waitForFunction(()=>document.querySelector('#copy-status').textContent==='Result copied.');
    assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/18\/18/);
    await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new Error('denied');};});
    await page.locator('#copy-result').click();await page.locator('#copy-fallback').waitFor({state:'visible'});
    assert.match(await page.locator('#copy-fallback').inputValue(),/Merkle Mystery/);
    await page.reload();await ready(page);assert.equal(await page.locator('#best-score').innerText(),'18 / 18 bookplates');
    await page.getByText('Progress, scoring, and daily mysteries',{exact:true}).click();await page.locator('#clear-progress').click();await ready(page);
    assert.equal(await page.locator('#best-score').innerText(),'0 / 18 bookplates');
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('wrong findings, extra proof pieces, hints, retries and untrusted seals cannot earn false wins',async()=>{
  const {page,errors}=await open();
  try{
    await submit(page);assert.match(await page.locator('#feedback').innerText(),/Select a book first/);
    await select(page,['0:0']);await submit(page);assert.equal(await page.locator('#chapter-result').isVisible(),false);
    await page.locator('#hint').click();await select(page,['0:0','0:2']);await submit(page);await closed(page);
    assert.match(await page.locator('#earned').innerText(),/1 \/ 3/);
    await chapterAt(page,2);await select(page,['0:3','1:0','2:1','3:0']);await submit(page);
    assert.equal(await page.locator('#chapter-result').isVisible(),false);
    await select(page,['3:0']);await submit(page);await closed(page);assert.match(await page.locator('#earned').innerText(),/2 \/ 3/);
    await chapterAt(page,5);await submit(page);assert.match(await page.locator('#feedback').innerText(),/Choose which seal/);
    await page.locator('input[value=courier]').check();await submit(page);
    assert.match(await page.locator('#feedback').innerText(),/proof matches the courier/);
    await page.locator('#accept').click();assert.equal(await page.locator('#chapter-result').isVisible(),false);
    await page.locator('input[value=recorded]').check();assert.equal(await page.locator('#decisions').isVisible(),false);
    await submit(page);await page.locator('#accept').click();assert.equal(await page.locator('#chapter-result').isVisible(),false);
    await page.locator('#quarantine').click();await closed(page);assert.match(await page.locator('#earned').innerText(),/1 \/ 3/);
    await page.locator('#restart').click();await ready(page);await page.locator('input[value=recorded]').check();await submit(page);await page.locator('#quarantine').click();await closed(page);
    assert.match(await page.locator('#earned').innerText(),/3 \/ 3/);assert.equal(await page.locator('#best-score').innerText(),'6 / 18 bookplates');
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('daily three-task mystery works for every parcel variant; penalties survive task transitions',async()=>{
  const {dailyPlan,siblingIds}=await import('../games/merkle-mystery/core.mjs');
  const plans=[];
  for(let i=1;plans.length<4 && i<367;i++){
    const plan=dailyPlan(new Date(Date.UTC(2026,0,i)).toISOString().slice(0,10));
    if(!plans.some(p=>p.parcelKind===plan.parcelKind))plans.push(plan);
  }
  for(const plan of plans){
    const {page,errors}=await open(390,plan.date);
    try{
      await page.locator('#daily-mode').click();await ready(page);
      assert.match(await page.locator('#daily-date').innerText(),new RegExp(plan.date));
      await page.locator('#hint').click();await select(page,plan.changed.map(i=>`0:${i}`));await submit(page);await closed(page);await submit(page);
      await select(page,siblingIds(plan.target,8));await submit(page);await closed(page);await submit(page);
      await page.locator('input[value=recorded]').check();const expected=await independentParcel(page);assert.equal(expected,plan.parcelKind==='genuine');
      await submit(page);await page.locator(expected?'#accept':'#quarantine').click();await closed(page);await submit(page);
      assert.match(await page.locator('#finish-text').innerText(),/2\/3 bookplates/);
      const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('crypto-lab-merkle-mystery-v1')));
      assert.deepEqual(persisted.daily,{date:plan.date,score:2});assert.deepEqual(persisted.best,[0,0,0,0,0,0]);
      assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }
});
test('phone and desktop layouts, node containment, keyboard selection, tree scrolling and games navigation',async()=>{
  for(const width of [320,390,768,1366]){
    const {page,errors}=await open(width);
    try{
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`page overflow at ${width}`);
      await page.locator('.node[data-node="0:0"]').focus();await page.keyboard.press('Space');assert.equal(await page.locator('.node[data-node="0:0"]').getAttribute('aria-pressed'),'true');
      await page.keyboard.press('Space');assert.equal(await page.locator('.node[data-node="0:0"]').getAttribute('aria-pressed'),'false');
      await page.screenshot({path:`test-results/merkle-mystery/width-${width}.png`,fullPage:true});
      await chapterAt(page,2);
      const outside=await page.locator('.node').evaluateAll(nodes=>{const tree=document.querySelector('#tree').getBoundingClientRect();return nodes.filter(node=>{const b=node.getBoundingClientRect();return b.left<tree.left-1||b.right>tree.right+1||b.top<tree.top||b.bottom>tree.bottom;}).map(n=>n.dataset.node);});
      assert.deepEqual(outside,[],`nodes outside scrollable tree at ${width}`);
      const collisions=await page.locator('.node').evaluateAll(nodes=>{const boxes=nodes.map(n=>n.getBoundingClientRect()),pairs=[];boxes.forEach((a,i)=>boxes.slice(i+1).forEach((b,j)=>{if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)pairs.push([i,i+j+1]);}));return pairs;});
      assert.deepEqual(collisions,[],`overlapping nodes at ${width}`);
      await page.locator('.node[data-node="0:7"]').focus();await page.keyboard.press('Space');assert.equal(await page.locator('.node[data-node="0:7"]').getAttribute('aria-pressed'),'true');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`eight-book page overflow at ${width}`);
      await page.screenshot({path:`test-results/merkle-mystery/proof-${width}.png`,fullPage:true});
      await page.goto(origin+'/games/');assert.equal(await page.getByRole('link',{name:/Merkle Mystery.*Play Merkle Mystery/}).count(),1);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`games overflow at ${width}`);
      assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }
});
test('storage refusal or corrupted values do not block play; theme storage is untouched',async()=>{
  for(const denied of [true,false]){
    const page=await browser.newPage();
    try{
      await page.addInitScript(denied=>{
        localStorage.setItem('theme','sentinel');
        if(denied){Storage.prototype.getItem=()=>{throw new Error('blocked');};Storage.prototype.setItem=()=>{throw new Error('blocked');};Storage.prototype.removeItem=()=>{throw new Error('blocked');};}
        else localStorage.setItem('crypto-lab-merkle-mystery-v1',JSON.stringify({best:[99,-1,'3'],daily:{date:'bad',score:100}}));
      },denied);
      await page.goto(origin+'/games/merkle-mystery/');await ready(page);assert.equal(await page.locator('#best-score').innerText(),'0 / 18 bookplates');
      await select(page,['0:2']);await submit(page);await closed(page);
      if(!denied)assert.equal(await page.evaluate(()=>localStorage.getItem('theme')),'sentinel');
    }finally{await page.close();}
  }
});
test('missing Web Crypto fails visibly; rapid chapter changes cannot apply stale work',async()=>{
  const page=await browser.newPage();
  try{
    await page.addInitScript(()=>Object.defineProperty(globalThis.crypto,'subtle',{value:undefined}));
    await page.goto(origin+'/games/merkle-mystery/');
    await page.waitForFunction(()=>document.querySelector('#case-title').textContent==='The archive could not open');
    assert.equal(await page.locator('#action').isDisabled(),true);
    assert.match(await page.locator('#feedback').innerText(),/Web Crypto/);
  }finally{await page.close();}
  const run=await open();
  try{
    await run.page.evaluate(()=>{document.querySelector('[data-chapter="5"]').click();document.querySelector('[data-chapter="2"]').click();document.querySelector('[data-chapter="0"]').click();});
    await ready(run.page);assert.equal(await run.page.locator('#case-title').innerText(),'A page out of place');assert.equal(await run.page.locator('.node.leaf').count(),4);
    assert.deepEqual(run.errors,[]);
  }finally{await run.page.close();}
});
