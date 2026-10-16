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
async function open(width=1366) {
  const page = await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  await page.route('https://**/*',route=>route.abort());
  await page.goto(origin+'/games/secret-council/');
  await page.waitForFunction(()=>document.querySelectorAll('.keeper').length===7);
  return {page,errors};
}
async function setPolicy(page,ids,k) {
  for(let i=0;i<7;i++){
    const keeper=page.locator(`[data-member="${i}"]`);
    if((await keeper.getAttribute('aria-pressed'))==='true'&&!ids.includes(i))await keeper.click();
  }
  for(const i of ids){const keeper=page.locator(`[data-member="${i}"]`);if((await keeper.getAttribute('aria-pressed'))!=='true')await keeper.click();}
  await page.locator('#threshold').fill(String(k));
}
async function passTrials(page,mission,policy) {
  await setPolicy(page,policy.ids,policy.threshold);
  await page.locator('#action').click();
  for (const event of mission.events) {
    if (event.kind === 'outage') {
      const affected=event.affected ? policy.ids.filter(id=>event.affected.includes(id)) : policy.ids.slice(0,event.count);
      const available=policy.ids.filter(id=>!affected.includes(id));
      for(const id of available.slice(0,policy.threshold))await page.locator(`[data-member="${id}"]`).click();
      // Independently recover from the displayed share values and compare UI output.
      const points=await page.locator('.keeper.gathered').evaluateAll(keepers=>keepers.map(el=>{
        const m=el.getAttribute('aria-label').match(/Share \((\d+), (\d+)\)/);return [Number(m[1]),Number(m[2])];
      }));
      const mod=n=>((n%17)+17)%17;
      let expected=0;
      for(let i=0;i<points.length;i++){
        let w=1;
        for(let j=0;j<points.length;j++)if(i!==j){let inv=1;while(mod((points[i][0]-points[j][0])*inv)!==1)inv++;w=mod(w*(-points[j][0])*inv);}
        expected=mod(expected+points[i][1]*w);
      }
      await page.locator('#action').click();
      assert.equal(await page.locator('#vault-value').innerText(),`SECRET ${String(expected).padStart(2,'0')}`);
      assert.equal(await page.locator('#trial-verdict').innerText(),'The secret is recovered');
    } else assert.equal(await page.locator('#trial-verdict').innerText(),'Every secret is still possible');
    await page.locator('#action').click();
  }
  assert.equal(await page.locator('#trial-title').innerText(),'Every trial passed');
}
test('full six-chapter campaign, actual recovery, results and persistent best scores',async()=>{
  const {page,errors}=await open();
  try{
    const {CAMPAIGN}=await import('../games/secret-council/core.mjs');
    const policies=[{ids:[0,3,5],threshold:2},{ids:[0,1,2,3,4],threshold:3},{ids:[0,1,3,4,5],threshold:3},{ids:[0,1,3,4,5],threshold:3},{ids:[0,1,3,4,5,6],threshold:4},{ids:[0,2,3,4,6],threshold:3}];
    await page.screenshot({path:'test-results/secret-council/desktop.png',fullPage:true});
    for(let i=0;i<6;i++){await passTrials(page,CAMPAIGN[i],policies[i]);await page.locator('#action').click();}
    assert.match(await page.locator('#completion-text').innerText(),/18\/18 seals/);
    await page.locator('#copy-result').click();
    assert.match(await page.locator('#copy-status').innerText(),/copied|copy the result/);
    await page.reload();await page.waitForFunction(()=>document.querySelectorAll('.keeper').length===7);
    assert.equal(await page.locator('#best-score').innerText(),'BEST 18/18');
    await page.locator('#clear-progress').click();assert.equal(await page.locator('#best-score').innerText(),'BEST —');
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('failure, hints, insufficient collection and revision cannot produce false wins',async()=>{
  const {page,errors}=await open();
  try{
    await page.locator('#action').click();await page.locator('#action').click();
    assert.equal(await page.locator('#trial-verdict').innerText(),'The council cannot recover');
    await page.locator('#action').click();
    await page.locator('#hint').click();
    assert.match(await page.locator('#feedback').innerText(),/1 < threshold ≤ 2/);
    await page.locator('#threshold').fill('2');await page.locator('#action').click();await page.locator('#action').click();
    await page.locator('#action').click();assert.match(await page.locator('#feedback').innerText(),/Collect 2 more/);
    assert.equal(await page.locator('#vault-value').innerText(),'AWAITING SHARES');
    await page.locator('[data-member="3"]').click();await page.locator('[data-member="3"]').click();
    await page.locator('#action').click();assert.match(await page.locator('#feedback').innerText(),/Collect 2 more/);
    await page.locator('[data-member="3"]').click();await page.locator('[data-member="5"]').click();
    await page.locator('#action').click();await page.locator('#action').click();
    assert.equal(await page.locator('#trial-verdict').innerText(),'1 of 3 seals earned');
    await page.locator('#action').click();await page.locator('#action').click();
    assert.equal(await page.locator('#trial-verdict').innerText(),'The secret was exposed');
    assert.match(await page.locator('#vault-value').innerText(),/^SECRET \d{2}$/);
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('daily challenge completes; explorer changes from 17 possibilities to one',async()=>{
  const {page,errors}=await open(390);
  try{
    await page.locator('#daily-mode').click();
    const date=(await page.locator('#daily-date').innerText()).slice(0,10);
    const {dailyMission,solutions}=await import('../games/secret-council/core.mjs');
    const mission=dailyMission(date),solution=solutions(mission)[0];
    await passTrials(page,mission,solution);await page.locator('#action').click();
    assert.match(await page.locator('#completion-text').innerText(),/3\/3 seals/);
    await page.locator('#math-details summary').click();
    assert.equal(await page.locator('#candidate-secrets button:enabled').count(),17);
    await page.getByRole('button',{name:'Candidate secret 16',exact:true}).click();
    assert.match(await page.locator('#plot-description').textContent(),/Candidate secret 16/);
    await page.locator('#visible-shares').fill('3');
    assert.equal(await page.locator('#candidate-secrets button:enabled').count(),1);
    assert.equal(await page.locator('#share-table tr').count(),3);
    await page.locator('#visible-shares').fill('0');assert.equal(await page.locator('#candidate-secrets button:enabled').count(),17);
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('phone, small phone and desktop layouts, keyboard controls and navigation',async()=>{
  for(const width of [320,390,1366]){
    const {page,errors}=await open(width);
    try{
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow at ${width}`);
      const collisions=await page.locator('.keeper').evaluateAll(nodes=>{
        const boxes=nodes.map(n=>n.getBoundingClientRect());let pairs=[];
        boxes.forEach((a,i)=>boxes.slice(i+1).forEach((b,j)=>{if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)pairs.push([i,i+j+1]);}));return pairs;
      });
      assert.deepEqual(collisions,[],`overlapping keeper buttons at ${width}`);
      await page.locator('#threshold').focus();await page.keyboard.press('ArrowLeft');
      assert.equal(await page.locator('#threshold').inputValue(),'2');
      await page.locator('[data-member="0"]').focus();await page.keyboard.press('Space');
      assert.equal(await page.locator('[data-member="0"]').getAttribute('aria-pressed'),'false');
      await page.keyboard.press('Space');assert.equal(await page.locator('[data-member="0"]').getAttribute('aria-pressed'),'true');
      await page.screenshot({path:`test-results/secret-council/width-${width}.png`,fullPage:true});
      await page.locator('#math-details summary').click();
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`math overflow at ${width}`);
      await page.goto(origin+'/games/');
      assert.equal(await page.getByRole('link',{name:/Secret Council.*Play Secret Council/}).count(),1);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`arcade overflow at ${width}`);
      assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }
});
test('storage denied or malformed never blocks play',async()=>{
  for(const denied of [true,false]){
    const page=await browser.newPage();
    try{
      await page.addInitScript(denied?()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}});}:()=>{localStorage.setItem('crypto-lab-secret-council-v1','{"scores":[99,"3",null],"best":999,"sound":"yes","daily":null}');});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(origin+'/games/secret-council/');await page.waitForFunction(()=>document.querySelectorAll('.keeper').length===7);
      assert.equal(await page.locator('#best-score').innerText(),'BEST —');
      await page.locator('#sound').click();await page.locator('#sound').click();
      await page.locator('#threshold').fill('2');await page.locator('#action').click();
      assert.equal(await page.locator('#trial-verdict').innerText(),'Every secret is still possible');
      await page.locator('#clear-progress').click();assert.deepEqual(errors,[]);
    }finally{await page.close();}
  }
});
