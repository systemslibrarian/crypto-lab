'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const http=require('node:http');
const {chromium}=require('../tools/node_modules/playwright');
const root=path.resolve(__dirname,'..');let server,browser,origin;
test.before(async()=>{
 server=http.createServer((req,res)=>{
   let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
   if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
   if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
   fs.readFile(file,(err,body)=>{if(err){res.writeHead(404);return res.end();}
      res.setHeader('Content-Type',({'.html':'text/html','.mjs':'text/javascript','.css':'text/css'})[path.extname(file)]||'text/plain');res.end(body);});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch();
});
test.after(async()=>{await browser?.close();await new Promise(resolve=>server?.close(resolve));});
async function open(slug,width=1280){
 const page=await browser.newPage({viewport:{width,height:940},reducedMotion:'reduce'});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
 await page.route('https://**/*',r=>r.abort());
 await page.goto(`${origin}/games/${slug}/`);
 return {page,errors};
}
test('mental poker deals 5 hands and audit independently re-checks the sealed opening',async()=>{
 const {page,errors}=await open('mental-poker',390);
 try{
  await page.locator('#seal').click();await page.locator('#hand button').first().waitFor();
  assert.equal(await page.locator('#hand button').count(),5);
  for(let i=0;i<5;i++)await page.locator('#hand button').first().click();
  await page.locator('#verify').click();
  await page.locator('#authentic:not([disabled])').waitFor();
  const receipt=await page.locator('#deck-check').textContent();
  await page.locator(receipt.includes('Seal matches')?'#authentic':'#forged').click();
  assert.equal(await page.locator('#bonus').textContent(),'+5');
  assert.equal(await page.locator('#replay').isVisible(),true);
  assert.deepEqual(errors,[]);
 }finally{await page.close();}
});
test('coin flip resolves all six missions with real SHA-256 and correct fairness verdicts',async()=>{
 const {page,errors}=await open('coin-flip-challenge');
 try{
  for(let i=0;i<6;i++){
    if(await page.locator('#probes').isVisible()){await page.locator('#probe-h').click();await page.locator('#probe-t').click();}
    await page.locator('#bits button').first().click();await page.locator('#lock').click();
    await page.locator('#reveal').click();await page.locator('#check').click();
    const leak=(await page.locator('#leak-note').textContent()).includes('LEAK ALERT');
    const abort=(await page.locator('#computed').textContent())==='NO OPENING';
    const different=(await page.locator('#computed').textContent())!==(await page.locator('#seal').textContent());
    const index=leak?3:abort?2:different?1:0;
    await page.locator('#verdicts button').nth(index).click();
    assert.match(await page.locator('#result-title').textContent(),/Correct classification/);
    if(i<5)await page.locator('#next').click();
  }
  assert.equal(await page.locator('#correct').textContent(),'6');assert.deepEqual(errors,[]);
 }finally{await page.close();}
});
test('trade escrow delivers an authentic item, refunds counterfeit and times out a vanishing trader',async()=>{
 const {page,errors}=await open('the-digital-trade',390);
 const act=async name=>page.getByRole('button',{name:new RegExp('^'+name)}).click();
 try{
   await act('Deposit in escrow');await act('Verify deposit');await act('Release swap');
   assert.equal(await page.locator('#wins').textContent(),'1');await page.locator('#next').click();
   await act('Deposit in escrow');await act('Verify deposit');
   assert.match(await page.locator('#match').textContent(),/MISMATCH/);
   await act('Claim refund');assert.equal(await page.locator('#wins').textContent(),'2');await page.locator('#next').click();
   await act('Deposit in escrow');await act('Wait one tick');await act('Wait one tick');await act('Claim refund');
   assert.equal(await page.locator('#wins').textContent(),'3');await page.locator('#next').click();
   await act('Deposit in escrow');
   if((await page.locator('#their-status').textContent()).includes('No deposit')){await act('Wait one tick');await act('Wait one tick');await act('Claim refund');}
   else {await act('Verify deposit');if((await page.locator('#match').textContent()).startsWith('MATCH'))await act('Release swap');else await act('Claim refund');}
   assert.equal(await page.locator('#wins').textContent(),'4');assert.deepEqual(errors,[]);
 }finally{await page.close();}
});
