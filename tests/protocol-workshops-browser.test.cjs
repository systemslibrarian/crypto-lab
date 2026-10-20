const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('../tools/node_modules/playwright');
const AxeBuilder=require('../tools/node_modules/@axe-core/playwright').default;
const root=path.resolve(__dirname,'..');let server,browser,origin;
test.before(async()=>{server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end();}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(error,body)=>{if(error){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.mjs':'text/javascript','.css':'text/css','.js':'text/javascript','.json':'application/json'})[path.extname(file)]||'text/plain');res.end(body);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));origin=`http://127.0.0.1:${server.address().port}`;browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined});});
test.after(async()=>{await browser?.close();if(server)await new Promise(r=>server.close(r));});
async function pageAt(slug,width=1280){const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',r=>r.abort());await page.goto(origin+'/learn/'+slug+'/');return {page,errors};}
async function audit(page){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();assert.deepEqual(result.violations,[]);}
async function contains(page,id,text){await page.waitForFunction(({id,text})=>document.getElementById(id)?.textContent.includes(text),{id,text});}
test('timestamp UI distinguishes valid signatures, wrong documents, false clocks, replay and anchored rewrites',async()=>{
 const {page,errors}=await pageAt('timestamping',390);try{
  await page.locator('#issue').click();await contains(page,'status','Cryptographic checks pass');
  await page.locator('#change').click();await contains(page,'status','Document fingerprint: MISMATCH');
  await page.locator('#issue').click();await page.locator('#alter').click();await contains(page,'status','Signature: INVALID');
  await page.locator('#backdate').click();await contains(page,'status','Cryptographic checks pass');await contains(page,'status','cannot establish an independently trusted time');
  await page.locator('#replay').click();await contains(page,'status','Request nonce: MISMATCH');
  await page.locator('#edit-chain').click();await contains(page,'chain-status','Document or link mismatch');
  await page.locator('#rebuild-chain').click();await contains(page,'chain-status','Consistent rewrite');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await audit(page);assert.deepEqual(errors,[]);
 }finally{await page.context().close();}
});
test('all three exchange scenarios expose direct loss, validate deposits, release both and reject forged evidence',async()=>{
 const {page,errors}=await pageAt('fair-exchange');try{
  for(const kind of ['mail','contract','secrets']){
   await page.locator('#scenario').selectOption(kind);await page.locator('#method').selectOption('direct');await page.locator('#send-a').click();assert.equal(await page.locator('#resolve').isVisible(),false);await page.locator('#abort').click();await contains(page,'status','One party has the advantage');
   await page.locator('#method').selectOption('escrow');await page.locator('#send-a').click();assert.equal(await page.locator('#resolve').isDisabled(),true);await page.locator('#send-b').click();await page.locator('#resolve').click();await contains(page,'status','Both sides have their evidence');assert.equal(await page.locator('#abort').isDisabled(),true);
   await page.locator('#reset').click();await page.locator('#send-a').click();await page.locator('#abort').click();await contains(page,'status','Aborted — neither item released');
   await page.locator('#reset').click();await page.locator('#tamper').click();await page.locator('#send-a').click();await contains(page,'status','Signature verification failed');await contains(page,'broker','Alice’s deposit: absent');
  }await audit(page);assert.deepEqual(errors,[]);
 }finally{await page.context().close();}
});
test('reading filters, browser-local progress, no-JS links and hub guide discovery work',async()=>{
 const {page,errors}=await pageAt('applied-cryptography',390);try{
  assert.equal(await page.locator('.chapter').count(),25);await page.locator('#search').fill('chapter 8');assert.equal(await page.locator('.chapter:visible').count(),1);
  await page.locator('#chapter-8 input').check();await contains(page,'progress','1 of 25');await page.reload();assert.equal(await page.locator('#chapter-8 input').isChecked(),true);
  await page.locator('#coverage').selectOption('intro');assert.equal(await page.locator('.chapter:visible').count(),4);
  await page.locator('#search').fill('no matching chapter xyz');assert.equal(await page.locator('#empty').isVisible(),true);await page.locator('#clear').click();assert.equal(await page.locator('.chapter:visible').count(),25);
  await page.locator('#clear-progress').click();await contains(page,'progress','0 of 25');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await audit(page);assert.deepEqual(errors,[]);
  await page.goto(origin+'/');await page.locator('#path-band-applied-cryptography summary').click();assert.equal(await page.locator('#path-band-applied-cryptography .path-guide a').getAttribute('href'),'learn/applied-cryptography/');
  await page.locator('#path-band-applied-cryptography .path-guide a').click();await page.locator('h1').waitFor();assert.match(await page.title(),/Applied Cryptography/);
 }finally{await page.context().close();}
 const noJS=await browser.newPage({javaScriptEnabled:false});try{await noJS.goto(origin+'/learn/applied-cryptography/');assert.equal(await noJS.locator('.chapter a').count()>50,true);}finally{await noJS.close();}
});
test('modern reading path filters exact chapters, restores progress and keeps the books separate',async()=>{
 const {page,errors}=await pageAt('modern-cryptography',390);try{
  assert.equal(await page.locator('.chapter').count(),15);
  await page.locator('#search').fill('chapter 1');assert.equal(await page.locator('.chapter:visible').count(),1);assert.equal(await page.locator('#chapter-1').isVisible(),true);
  await page.locator('#search').fill('chapter 12');assert.equal(await page.locator('.chapter:visible').count(),1);assert.equal(await page.locator('#chapter-12').isVisible(),true);
  await page.locator('#clear').click();await page.locator('#part').selectOption('Symmetric cryptography');assert.equal(await page.locator('.chapter:visible').count(),6);
  await page.locator('#coverage').selectOption('intro');assert.equal(await page.locator('.chapter:visible').count(),1);assert.equal(await page.locator('#chapter-8').isVisible(),true);
  await page.locator('#clear').click();assert.equal(await page.locator('#chapter-2').isVisible(),true);assert.equal(await page.locator('.chapter:visible').count(),15);
  await page.locator('#chapter-2 input').check();await contains(page,'progress','1 of 15');await page.reload();assert.equal(await page.locator('#chapter-2 input').isChecked(),true);
  await page.goto(origin+'/learn/applied-cryptography/');assert.equal(await page.locator('#chapter-2 input').isChecked(),false);await page.locator('#chapter-4 input').check();
  await page.goto(origin+'/learn/modern-cryptography/');assert.equal(await page.locator('#chapter-2 input').isChecked(),true);assert.equal(await page.locator('#chapter-4 input').isChecked(),false);
  await page.locator('#clear-progress').click();await contains(page,'progress','0 of 15');
  await page.locator('#coverage').selectOption('modern');assert.equal(await page.locator('.chapter:visible').count(),1);assert.equal(await page.locator('#chapter-14').isVisible(),true);
  await page.locator('#search').fill('no matching chapter xyz');assert.equal(await page.locator('#empty').isVisible(),true);await page.locator('#clear').click();assert.equal(await page.locator('.chapter:visible').count(),15);
  await audit(page);assert.deepEqual(errors,[]);
  await page.goto(origin+'/learn/applied-cryptography/');assert.equal(await page.locator('#chapter-4 input').isChecked(),true,'resetting Katz–Lindell must preserve Schneier progress');
  await page.goto(origin+'/');await page.locator('#path-band-modern-cryptography summary').click();assert.equal(await page.locator('#path-band-modern-cryptography .path-guide a').getAttribute('href'),'learn/modern-cryptography/');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await page.locator('#path-band-modern-cryptography .path-guide a').click();await page.locator('h1').waitFor();assert.match(await page.title(),/Introduction to Modern Cryptography/);
  await page.goto(origin+'/');await page.locator('#menuToggle').click();await page.locator('.nav-menu-educators[href="learn/modern-cryptography/"]').click();await page.locator('h1').waitFor();assert.match(await page.title(),/Introduction to Modern Cryptography/);
 }finally{await page.context().close();}
 const noJS=await browser.newPage({javaScriptEnabled:false});try{await noJS.goto(origin+'/learn/modern-cryptography/');assert.equal(await noJS.locator('.chapter:visible').count(),15);assert.ok(await noJS.locator('.chapter-labs a').count()>40);assert.equal(await noJS.locator('#reader-controls').isVisible(),false);}finally{await noJS.close();}
});
test('modern reading path tolerates malformed, out-of-range and unavailable progress storage',async()=>{
 for(const mode of ['malformed','invalid-ids','denied']){
  const {page,errors}=await pageAt('modern-cryptography');try{
   await page.addInitScript(mode=>{
    if(mode==='denied'){Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});return;}
    localStorage.setItem('crypto-lab-modern-cryptography-progress-v1',mode==='malformed'?'{bad-json':JSON.stringify([0,1,1,15,16,'2',null,2.5]));
   },mode);
   await page.reload();await contains(page,'progress',`${mode==='invalid-ids'?2:0} of 15`);
   await page.locator('#chapter-2 input').check();await contains(page,'progress',`${mode==='invalid-ids'?3:1} of 15`);
   await page.locator('#search').fill('Paillier');assert.equal(await page.locator('#chapter-15').isVisible(),true);assert.deepEqual(errors,[]);
  }finally{await page.context().close();}
 }
});
test('workshops remain keyboard reachable and fit phone and desktop widths',async()=>{
 for(const slug of ['applied-cryptography','modern-cryptography','timestamping','fair-exchange'])for(const width of [390,1280]){
  const {page,errors}=await pageAt(slug,width);try{await page.keyboard.press('Tab');assert.equal(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);assert.equal(await page.locator('h1').count(),1);await audit(page);assert.deepEqual(errors,[]);}finally{await page.context().close();}
 }
});
