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
  fs.mkdirSync(path.join(root,'test-results/quantum-courier'),{recursive:true});
});
test.after(async () => { await browser?.close(); await new Promise(resolve => server?.close(resolve)); });
async function open(width=1366, date=null) {
  const page = await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  await page.route('https://**/*',route=>route.abort());
  if(date) await page.addInitScript(date => { const OriginalDate=Date; globalThis.Date=class extends OriginalDate {constructor(...args){super(...(args.length?args:[date+'T12:00:00Z']));} static now(){return new OriginalDate(date+'T12:00:00Z').getTime();}}; },date);
  await page.goto(origin+'/games/quantum-courier/');
  await ready(page);
  return {page,errors};
}
async function ready(page) { await page.waitForFunction(()=>document.querySelector('#flight').getAttribute('aria-busy')==='false' && document.querySelector('#flight-title').textContent.length>0); }
async function action(page) { await page.locator('#action').click(); await ready(page); }
async function solved(page) { await page.locator('#result').waitFor({state:'visible'}); }
async function chapterAt(page,n) { await page.locator(`[data-chapter="${n}"]`).click();await ready(page); }
async function select(page,ids) { for(const id of ids)await page.locator(`[data-pulse="${id}"]`).click(); }
async function observation(page) {
  // Derive solutions from visible labels, independently of core.mjs.
  return page.locator('[data-pulse]').evaluateAll(cards=>cards.map(card=>{
    const bases=[...card.querySelectorAll('.basis-line b')].map(n=>n.textContent);
    const values=card.querySelector('.values').textContent.match(/A: ([01]) \/ B: ([01])/);
    return {id:Number(card.dataset.pulse),match:bases[0]===bases[1],sample:card.classList.contains('public'),error:values?values[1]!==values[2]:false};
  }));
}
async function tune(page) {
  for(const button of await page.locator('[data-receiver]').all()){
    const label=await button.getAttribute('aria-label');
    if(label.match(/Alice basis (\S)/)[1]!==label.match(/Bob basis (\S)/)[1])await button.click();
  }
  await action(page);await solved(page);
}
async function siftFlight(page,discard=false) {
  if((await page.locator('#action').innerText()).startsWith('Send'))await action(page);
  const visible=await observation(page);
  await select(page,visible.filter(p=>p.match&&(!discard||!p.sample)).map(p=>p.id));
  await action(page);await solved(page);
}
async function inspectFlight(page) {
  if((await page.locator('#action').innerText()).startsWith('Send'))await action(page);
  const errors=(await observation(page)).filter(p=>p.error);
  await select(page,errors.map(p=>p.id));
  await page.locator(`input[value=${errors.length?'pause':'process'}]`).check();await action(page);await solved(page);
  return errors.length;
}
async function setBudget(page,n) { await page.locator('#sample-size').evaluate((input,n)=>{input.value=String(n);input.dispatchEvent(new Event('input',{bubbles:true}));},n); }

test('all six flights work; exact scoring, persistent bests and clipboard fallback',async()=>{
  const {page,errors}=await open();
  try {
    await page.screenshot({path:'test-results/quantum-courier/desktop.png',fullPage:true});
    await tune(page);await action(page);
    assert.equal(await page.locator('[data-pulse]:not(:disabled)').count(),0);
    await siftFlight(page);await action(page);await siftFlight(page,true);await action(page);
    assert.equal(await inspectFlight(page),2);await action(page);
    assert.equal(await inspectFlight(page),0);assert.match(await page.locator('#reveal').innerText(),/Eve intercepted/);await action(page);
    await setBudget(page,11);assert.equal(await page.locator('#detection-number').innerText(),'95.8%');assert.equal(await page.locator('#remaining-number').innerText(),'13');
    await action(page);await solved(page);await action(page);
    assert.match(await page.locator('#finish-text').innerText(),/6\/6 flights completed.*18\/18/);
    assert.equal(await page.locator('#best-score').textContent(),'18 / 18 flight badges');
    await page.context().grantPermissions(['clipboard-read','clipboard-write'],{origin});await page.locator('#copy-result').click();
    await page.waitForFunction(()=>document.querySelector('#copy-status').textContent==='Flight log copied.');
    assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Quantum Courier.*18\/18/);
    await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new Error('denied');};});await page.locator('#copy-result').click();
    await page.locator('#copy-fallback').waitFor({state:'visible'});assert.match(await page.locator('#copy-fallback').inputValue(),/Quantum Courier/);
    await page.reload();await ready(page);assert.equal(await page.locator('#best-score').textContent(),'18 / 18 flight badges');
    await page.locator('.progress-details summary').click();await page.locator('#clear-progress').click();await ready(page);
    assert.equal(await page.locator('#best-score').textContent(),'0 / 18 flight badges');assert.deepEqual(errors,[]);
  } finally {await page.close();}
});
test('wrong bases, disclosed bits, false certainty and excessive sampling never earn false wins',async()=>{
  const {page,errors}=await open();
  try {
    await action(page);assert.equal(await page.locator('#result').isVisible(),false);assert.match(await page.locator('#feedback').innerText(),/matching output bit by luck/);
    await page.locator('#hint').click();await page.locator('#hint').click();await tune(page);assert.match(await page.locator('#earned').innerText(),/1 \/ 3/);
    await chapterAt(page,2);await action(page);const cards=await observation(page);await select(page,cards.filter(p=>p.match).map(p=>p.id));await action(page);
    assert.equal(await page.locator('#result').isVisible(),false);assert.match(await page.locator('#feedback').innerText(),/PUBLIC SAMPLE/);
    await select(page,cards.filter(p=>p.sample).map(p=>p.id));await action(page);await solved(page);assert.match(await page.locator('#earned').innerText(),/2 \/ 3/);
    await chapterAt(page,4);await action(page);await action(page);assert.match(await page.locator('#feedback').innerText(),/Choose the crew/);
    await page.locator('input[value=ready]').check();await action(page);assert.equal(await page.locator('#result').isVisible(),false);assert.match(await page.locator('#feedback').innerText(),/privacy amplification/);
    await page.locator('input[value=pause]').check();await action(page);assert.equal(await page.locator('#result').isVisible(),false);
    await page.locator('input[value=process]').check();await action(page);await solved(page);assert.match(await page.locator('#earned').innerText(),/1 \/ 3/);
    await chapterAt(page,5);for(const n of [10,12,24]){await setBudget(page,n);await action(page);assert.equal(await page.locator('#result').isVisible(),false);}
    await setBudget(page,11);await action(page);await solved(page);assert.match(await page.locator('#earned').innerText(),/1 \/ 3/);
    assert.deepEqual(errors,[]);
  } finally {await page.close();}
});
test('daily route has three solvable tasks across every scenario; hint penalty and date persist',async()=>{
  const {dailyPlan,inspect}=await import('../games/quantum-courier/core.mjs');
  const plans=new Map();
  for(let d=1;plans.size<3&&d<367;d++){
    const date=new Date(Date.UTC(2026,0,d)).toISOString().slice(0,10),plan=dailyPlan(date);
    const key=`${plan.intercepted}/${inspect(plan.pulses,plan.sample).errors.length>0}`;if(!plans.has(key))plans.set(key,plan);
  }
  assert.equal(plans.size,3);
  for(const plan of plans.values()){
    const {page,errors}=await open(390,plan.date);
    try{
      await page.locator('#daily-mode').click();await ready(page);await page.locator('#hint').click();
      await siftFlight(page);await action(page);assert.match(await page.locator('#hint-text').innerText(),/PUBLIC/);
      await siftFlight(page,true);await action(page);assert.match(await page.locator('#hint-text').innerText(),/disagreements/);
      await page.evaluate(()=>{const D=Date;globalThis.Date=class extends D{constructor(...args){super(...(args.length?args:['2027-01-01T01:00:00Z']));}};});
      await inspectFlight(page);await action(page);
      assert.match(await page.locator('#finish-text').innerText(),new RegExp(plan.date));assert.match(await page.locator('#finish-text').innerText(),/2\/3/);
      const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('crypto-lab-quantum-courier-v1')));
      assert.deepEqual(saved,{best:[0,0,0,0,0,0],daily:{date:plan.date,score:2}});assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }
});
test('responsive layouts, keyboard controls, card containment and games link',async()=>{
  for(const width of [320,390,768,1366]){
    const {page,errors}=await open(width);
    try {
      const button=page.locator('[data-receiver="0"]');await button.focus();await page.keyboard.press('Space');assert.match(await button.getAttribute('aria-label'),/Bob basis \+/);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow ${width}`);
      await page.screenshot({path:`test-results/quantum-courier/width-${width}.png`,fullPage:true});
      await chapterAt(page,3);await action(page);
      const collisions=await page.locator('.pulse').evaluateAll(nodes=>{const boxes=nodes.map(n=>n.getBoundingClientRect()),pairs=[];boxes.forEach((a,i)=>boxes.slice(i+1).forEach((b,j)=>{if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)pairs.push([i,i+j+1]);}));return pairs;});
      assert.deepEqual(collisions,[]);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`inspection overflow ${width}`);
      await page.locator('[data-pulse="4"]').focus();await page.keyboard.press('Space');assert.equal(await page.locator('[data-pulse="4"]').getAttribute('aria-pressed'),'true');
      await page.screenshot({path:`test-results/quantum-courier/inspect-${width}.png`,fullPage:true});
      await chapterAt(page,5);await page.locator('#sample-size').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#sample-size').inputValue(),'2');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`budget overflow ${width}`);
      await page.screenshot({path:`test-results/quantum-courier/budget-${width}.png`,fullPage:true});
      await page.goto(origin+'/games/');assert.equal(await page.getByRole('link',{name:/Quantum Courier.*Play Quantum Courier/}).count(),1);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`games overflow ${width}`);assert.deepEqual(errors,[]);
    } finally {await page.close();}
  }
});
test('light bench uses fresh measurements, reports its setup and fails visibly when RNG is missing',async()=>{
  const {page,errors}=await open();
  try{
    await page.locator('.light-bench summary').click();await page.locator('#bench-send').click();assert.match(await page.locator('#bench-result').innerText(),/Bit 0: 64. Bit 1: 0./);
    await page.locator('#bench-state').selectOption('x1');await page.locator('#bench-basis').selectOption('x');await page.locator('#bench-send').click();assert.match(await page.locator('#bench-result').innerText(),/Bit 0: 0. Bit 1: 64./);
    await page.locator('#bench-basis').selectOption('+');assert.match(await page.locator('#bench-result').innerText(),/Settings changed/);
    // Inject a known alternating random source to verify that cross-basis draws
    // are consumed independently, without a flaky distribution assertion.
    await page.evaluate(()=>{let n=0;crypto.getRandomValues=array=>{array[0]=n++%2;return array;};});
    await page.locator('#bench-send').click();assert.match(await page.locator('#bench-result').innerText(),/Bit 0: 32. Bit 1: 32./);
    await page.evaluate(()=>{crypto.getRandomValues=undefined;});await page.locator('#bench-send').click();assert.match(await page.locator('#bench-result').innerText(),/needs browser random-number support/);
    await tune(page);assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('blocked/corrupt storage preserves play and other storage keys; a stale animation cannot change chapters',async()=>{
  for(const denied of [true,false]){
    const page=await browser.newPage();
    try{
      await page.addInitScript(denied=>{
        localStorage.setItem('theme','sentinel');
        if(denied){Storage.prototype.getItem=()=>{throw new Error('blocked');};Storage.prototype.setItem=()=>{throw new Error('blocked');};Storage.prototype.removeItem=()=>{throw new Error('blocked');};}
        else localStorage.setItem('crypto-lab-quantum-courier-v1',JSON.stringify({best:[9,'3',-1],daily:{date:'bad',score:99}}));
      },denied);
      await page.goto(origin+'/games/quantum-courier/');await ready(page);assert.equal(await page.locator('#best-score').textContent(),'0 / 18 flight badges');
      await tune(page);
      if(denied)assert.match(await page.locator('#storage-status').textContent(),/unavailable/);else assert.equal(await page.evaluate(()=>localStorage.getItem('theme')),'sentinel');
    }finally{await page.close();}
  }
  const page=await browser.newPage({reducedMotion:'no-preference'});
  try{
    await page.goto(origin+'/games/quantum-courier/');await ready(page);await chapterAt(page,1);
    await page.evaluate(()=>{document.querySelector('#action').click();document.querySelector('[data-chapter="5"]').click();});
    await page.waitForTimeout(1000);assert.equal(await page.locator('#flight-title').innerText(),'Plan the flight');assert.equal(await page.locator('#budget').isVisible(),true);assert.equal(await page.locator('#result').isVisible(),false);
  }finally{await page.close();}
});
