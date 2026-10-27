const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),nodeCrypto=require('node:crypto');
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
function timestampHash(value){return nodeCrypto.createHash('sha256').update(value).digest('hex');}
function proofRoot(document,proof){let value=timestampHash(JSON.stringify(['crypto-lab-ers-leaf-v1',document]));for(const step of proof)value=timestampHash(JSON.stringify(['crypto-lab-ers-node-v1',...(step.side==='left'?[step.hash,value]:[value,step.hash]) ]));return value;}
test('timestamp batching and renewal claims come from the rendered run and keep late evidence ambiguous',async()=>{
 const {page,errors}=await pageAt('timestamping',390);try{
  await page.locator('#check-batch').click();await contains(page,'batch-status','all 4 inclusions verify');
  assert.equal(await page.locator('#batch-results li').count(),4);assert.equal(await page.locator('#batch-results li').filter({hasText:'PASS'}).count(),4);
  const proof=JSON.parse(await page.locator('#batch-proof').textContent());
  assert.equal(proofRoot(proof.document,proof.proof),proof.calculatedAgainstRoot);assert.equal(proof.calculatedAgainstRoot,proof.signedImprint);
  await page.locator('#batch-document').selectOption('1');await page.locator('#wrong-path').click();await contains(page,'batch-status','3 of 4 inclusions verify');
  assert.match(await page.locator('#batch-results li').nth(1).textContent(),/REJECT.*inclusion path: FAIL/s);
  await page.locator('#wrong-root').click();await contains(page,'batch-status','0 of 4 inclusions verify');
  assert.equal(await page.locator('#batch-results li').filter({hasText:'REJECT'}).count(),4);
  await page.locator('#check-batch').click();await contains(page,'batch-status','all 4 inclusions verify');
  await contains(page,'renewal-status','Timely renewal: evidence accepted');assert.equal(await page.locator('#renewal-summary article').count(),4);
  assert.equal((await page.locator('#renewal-summary article').nth(1).locator('.scenario-verdict').textContent()).trim(),'ACCEPT');
  await page.locator('#renewal-case').selectOption('unrenewed');await contains(page,'renewal-status','evidence refused');await contains(page,'renewal-status','expired without a timely successor stamp');
  await page.locator('#renewal-case').selectOption('late');await contains(page,'renewal-status','valid cryptography after the cutoff');
  const genuineLate=JSON.parse(await page.locator('#renewal-ledger').textContent());
  await page.locator('#renewal-case').selectOption('forged');await contains(page,'renewal-status','valid cryptography after the cutoff');
  const forgedLate=JSON.parse(await page.locator('#renewal-ledger').textContent());
  for(const ledger of [genuineLate,forgedLate]){assert.equal(ledger.originalChecks.valid,true);assert.equal(ledger.renewalChecks.signature,true);assert.equal(ledger.renewalChecks.imprint,true);assert.equal(ledger.timely,false);assert.equal(ledger.accepted,false);}
  assert.match(forgedLate.groundTruthTeachingView,/attacker uses the real old private key/);
  await page.locator('#trusted-time').uncheck();await contains(page,'renewal-status','signatures alone do not establish either generation time');
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
test('ASW optimistic exchange renders current evidence, both race orders, availability and durable-state failure',async()=>{
 const {page,errors}=await pageAt('fair-exchange',390);try{
  await contains(page,'opt-proof','16 rounds');await contains(page,'opt-proof','VERIFIED');
  let view=JSON.parse(await page.locator('#opt-evidence').textContent());
  assert.equal(view.proof.rounds,16);assert.equal(view.proof.challenge.length,16);assert.notEqual(view.proof.challenge,'0'.repeat(16));
  assert.equal(view.intermediary.contacts,0);assert.equal(view.alice.usablePeerSignature,false);assert.equal(view.bob.usablePeerSignature,false);
  assert.equal(await page.locator('a[href="https://link.springer.com/chapter/10.1007/BFb0054156"]').count(),1);
  await page.locator('#opt-send-alice').click();await contains(page,'opt-log','E4: Alice sent');assert.equal(await page.locator('#opt-abort').isDisabled(),true);
  await page.locator('#opt-reset').click();await contains(page,'opt-status','Recoverable promises, no usable peer signature yet');
  await page.locator('#opt-honest').click();await contains(page,'opt-status','Fair completion — both signatures usable');
  view=JSON.parse(await page.locator('#opt-evidence').textContent());assert.equal(view.intermediary.contacts,0);assert.equal(view.alice.usablePeerSignature,true);assert.equal(view.bob.usablePeerSignature,true);

  await page.locator('#opt-abort-first').click();await contains(page,'opt-status','Compatible abort — neither signature usable');
  view=JSON.parse(await page.locator('#opt-evidence').textContent());assert.deepEqual(view.intermediary.records,['ABORT']);assert.equal(view.alice.usablePeerSignature,false);assert.equal(view.bob.usablePeerSignature,false);await contains(page,'opt-log','B-resolve refused');

  await page.locator('#opt-resolve-first').click();await contains(page,'opt-status','Fair completion — both signatures usable');
  view=JSON.parse(await page.locator('#opt-evidence').textContent());assert.deepEqual(view.intermediary.records,['DEPOSIT']);assert.equal(view.lastOutcome,'abort-returned-deposit');await contains(page,'opt-log','returned its inverse to Alice');

  await page.locator('#opt-a-resolve-path').click();await contains(page,'opt-status','Fair completion — both signatures usable');
  view=JSON.parse(await page.locator('#opt-evidence').textContent());assert.deepEqual(view.intermediary.records,['NO-ABORT','DEPOSIT']);assert.equal(view.lastOutcome,'abort-refused-no-abort');

  await page.locator('#opt-unavailable-path').click();await contains(page,'opt-status','Termination waits for intermediary availability');
  view=JSON.parse(await page.locator('#opt-evidence').textContent());assert.equal(view.intermediary.attempts,1);assert.equal(view.intermediary.contacts,0);assert.deepEqual(view.intermediary.records,[]);
  await page.locator('#opt-available').check();await page.locator('#opt-b-resolve').click();await contains(page,'opt-status','Temporarily one-sided — resolution remains available');
  view=JSON.parse(await page.locator('#opt-evidence').textContent());assert.equal(view.intermediary.contacts,1);assert.deepEqual(view.intermediary.records,['DEPOSIT']);

  await page.locator('#opt-lost-state').click();await contains(page,'opt-status','Fairness lost when durable state is erased');
  view=JSON.parse(await page.locator('#opt-evidence').textContent());assert.equal(view.intermediary.durable,false);assert.deepEqual(view.intermediary.records,['ABORT']);assert.equal(view.alice.usablePeerSignature,false);assert.equal(view.bob.usablePeerSignature,true);
  assert.match(await page.locator('#optimistic-exchange').textContent(),/recoverable evidence/i);assert.match(await page.locator('main').textContent(),/1\/65,535/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await audit(page);assert.deepEqual(errors,[]);
 }finally{await page.context().close();}
});
test('reading filters, browser-local progress, no-JS links and historical guide discovery work',async()=>{
 const {page,errors}=await pageAt('applied-cryptography',390);try{
  assert.equal(await page.locator('.chapter').count(),25);await page.locator('#search').fill('chapter 8');assert.equal(await page.locator('.chapter:visible').count(),1);
  await page.locator('#chapter-8 input').check();await contains(page,'progress','1 of 25');await page.reload();assert.equal(await page.locator('#chapter-8 input').isChecked(),true);
  await page.locator('#coverage').selectOption('intro');assert.equal(await page.locator('.chapter:visible').count(),4);
  await page.locator('#search').fill('no matching chapter xyz');assert.equal(await page.locator('#empty').isVisible(),true);await page.locator('#clear').click();assert.equal(await page.locator('.chapter:visible').count(),25);
  await page.locator('#clear-progress').click();await contains(page,'progress','0 of 25');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await audit(page);assert.deepEqual(errors,[]);
  await page.goto(origin+'/');assert.equal(await page.locator('#path-band-applied-cryptography').count(),0);
  assert.equal(await page.locator('.nav-menu-educators[href="learn/applied-cryptography/"]').count(),0,'the historical companion is not a prominent recommendation');
  assert.equal(await page.locator('#learning-paths #path-applied-cryptography').count(),0,'the primary learning-path set excludes the historical companion');
  await page.locator('#menuToggle').click();
  const historical=page.locator('#historical-paths #path-applied-cryptography');await historical.waitFor({state:'visible'});
  assert.match(await historical.locator('summary').textContent(),/historical/i);assert.match(await historical.locator('summary').textContent(),/1996/);
  await historical.locator('summary').click();await historical.locator('a[href="learn/applied-cryptography/"]').click();await page.waitForURL(origin+'/learn/applied-cryptography/');
  assert.equal((await page.locator('h1').textContent()).trim(),'Applied Cryptography — Historical Reading Companion (1996)');assert.equal(await page.locator('.chapter').count(),25);assert.match(await page.title(),/Applied Cryptography/);assert.deepEqual(errors,[]);
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
  await page.goto(origin+'/');
  assert.equal(await page.locator('#path-band-modern-cryptography').count(),0,'the book companion stays off the home-page learning-path band');
  assert.equal(await page.locator('#path-band-applied-cryptography').count(),0);
  assert.equal(await page.locator('#path-band-start-here').count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  assert.equal(await page.locator('.nav-menu-educators[href="learn/modern-cryptography/"]').count(),1,'the book companion remains in the menu');
  await page.locator('#menuToggle').click();await page.locator('.nav-menu-educators[href="learn/modern-cryptography/"]').click();await page.locator('h1').waitFor();assert.match(await page.title(),/Introduction to Modern Cryptography/);
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
test('Boneh–Shoup filters, draft boundaries, part navigation, progress isolation and no-JS reading work',async()=>{
 const {page,errors}=await pageAt('boneh-shoup',390);try{
  assert.equal(await page.locator('.chapter').count(),23);
  await page.locator('#search').fill('chapter 2');assert.equal(await page.locator('.chapter:visible').count(),1);assert.equal(await page.locator('#chapter-2').isVisible(),true);
  await page.locator('#chapter-2 input').check();await page.reload();assert.equal(await page.locator('#chapter-2 input').isChecked(),true);
  await page.locator('#part').selectOption('Protocols');assert.equal(await page.locator('.chapter:visible').count(),6);
  await page.locator('#search').fill('unmatched xyz');assert.equal(await page.locator('#empty').isVisible(),true);
  await page.locator('.part-jumps a[href="#chapter-18"]').click();assert.equal(await page.locator('#chapter-18').isVisible(),true);assert.equal(await page.locator('.chapter:visible').count(),23);
  await page.locator('#search').fill('unmatched xyz');await page.locator('.part-jumps a[href="#chapter-18"]').click();assert.equal(await page.locator('#chapter-18').isVisible(),true,'same fragment also clears a hiding filter');
  await page.locator('#coverage').selectOption('supplement');assert.equal(await page.locator('.chapter:visible').count(),2);assert.equal(await page.locator('#chapter-17 .draft-note').isVisible(),true);
  await page.locator('#clear').click();await contains(page,'progress','1 of 23');
  await page.goto(origin+'/learn/modern-cryptography/');assert.equal(await page.locator('#chapter-2 input').isChecked(),false);await page.locator('#chapter-3 input').check();
  await page.goto(origin+'/learn/boneh-shoup/');await contains(page,'progress','1 of 23');await page.locator('#clear-progress').click();await contains(page,'progress','0 of 23');
  await page.goto(origin+'/learn/modern-cryptography/');assert.equal(await page.locator('#chapter-3 input').isChecked(),true);
  await page.goto(origin+'/');
  assert.equal(await page.locator('#path-band-boneh-shoup').count(),0,'the book companion stays off the home-page learning-path band');
  assert.equal(await page.locator('.nav-menu-educators[href="learn/boneh-shoup/"]').count(),1,'the book companion remains in the menu');
  await page.locator('#menuToggle').click();await page.locator('.nav-menu-educators[href="learn/boneh-shoup/"]').click();await page.locator('h1').waitFor();assert.match(await page.title(),/Graduate Course/);
  await audit(page);assert.deepEqual(errors,[]);
 }finally{await page.context().close();}
 const noJS=await browser.newPage({javaScriptEnabled:false});try{await noJS.goto(origin+'/learn/boneh-shoup/');assert.equal(await noJS.locator('.chapter:visible').count(),23);assert.ok(await noJS.locator('.chapter-labs a').count()>45);assert.equal(await noJS.locator('#reader-controls').isVisible(),false);}finally{await noJS.close();}
});
test('Boneh–Shoup stays usable with blocked or malformed browser storage',async()=>{
 for(const mode of ['denied','malformed','invalid-ids']){
  const {page,errors}=await pageAt('boneh-shoup');try{
   await page.addInitScript(mode=>{
    if(mode==='denied'){Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});return;}
    localStorage.setItem('crypto-lab-boneh-shoup-progress-v1',mode==='malformed'?'broken':JSON.stringify([0,1,1,23,24,'2',null]));
   },mode);
   await page.reload();await contains(page,'progress',`${mode==='invalid-ids'?2:0} of 23`);await page.locator('#chapter-2 input').check();await contains(page,'progress',`${mode==='invalid-ids'?3:1} of 23`);
   await page.locator('#search').fill('pairings');assert.equal(await page.locator('#chapter-15').isVisible(),true);assert.deepEqual(errors,[]);
  }finally{await page.context().close();}
 }
});
test('Understanding Cryptography is discoverable from the menu and preserves its chapter and SHA-3 reading stops',async()=>{
 const {page,errors}=await pageAt('understanding-cryptography',390);try{
  await page.goto(origin+'/');assert.equal(await page.locator('#path-band-understanding-cryptography').count(),0,'the guide does not add a home-page band');assert.equal(await page.locator('#path-band-start-here').count(),1,'the hub has initialized its existing paths');
  await page.locator('#menuToggle').click();await page.locator('.nav-menu-educators[href="learn/understanding-cryptography/"]').click();await page.waitForURL(origin+'/learn/understanding-cryptography/');
  assert.match(await page.title(),/Understanding Cryptography/);assert.equal(await page.locator('.chapter').count(),15);assert.equal(await page.locator('.chapter[data-kind="chapter"]').count(),14);assert.equal(await page.locator('.chapter[data-kind="focus"]').count(),1);
  await page.locator('#search').fill('chapter 11');assert.equal(await page.locator('.chapter:visible').count(),2);assert.equal(await page.locator('#chapter-11').isVisible(),true);assert.equal(await page.locator('#sha3-focus').isVisible(),true);
  await page.locator('#search').fill('section11.5');assert.equal(await page.locator('#sha3-focus').isVisible(),true);assert.equal(await page.locator('.chapter:visible:not([data-chapter="11"])').count(),0);
  await page.locator('#clear').click();await page.locator('#chapter-11 input').check();await page.locator('#sha3-focus input').check();await contains(page,'progress','2 of 15');
  await page.reload();assert.equal(await page.locator('#chapter-11 input').isChecked(),true);assert.equal(await page.locator('#sha3-focus input').isChecked(),true);
  await page.locator('#chapter-11 input').uncheck();await contains(page,'progress','1 of 15');assert.equal(await page.locator('#sha3-focus input').isChecked(),true,'the focus has its own progress record');
  assert.equal(await page.locator('a[href="https://github.com/systemslibrarian/crypto-lab/blob/main/CATALOG.md"]').count(),1);
  assert.equal(await page.locator('a[href="https://github.com/systemslibrarian/crypto-lab/blob/main/audits/UNDERSTANDING-CRYPTOGRAPHY-GAP-CHECK-2026-10-21.md"]').count(),2);
  assert.equal(await page.locator('footer a[href="https://github.com/systemslibrarian/crypto-lab/tree/main/learn/understanding-cryptography"]').count(),1);
  assert.equal(await page.locator('a[href*="draft/understanding-cryptography-2e"]').count(),0);assert.doesNotMatch(await page.locator('.companion-note').textContent(),/Draft/);
  await page.locator('#clear-progress').click();await contains(page,'progress','0 of 15');await audit(page);assert.deepEqual(errors,[]);
 }finally{await page.context().close();}
 const noJS=await browser.newPage({javaScriptEnabled:false});try{
  await noJS.goto(origin+'/learn/understanding-cryptography/');assert.equal(await noJS.locator('.chapter:visible').count(),15);assert.equal(await noJS.locator('.chapter[data-kind="chapter"]:visible').count(),14);assert.equal(await noJS.locator('#sha3-focus').isVisible(),true);
  assert.equal(await noJS.locator('.chapter-toc a').count(),15);assert.ok(await noJS.locator('.chapter-labs a').count()>30);assert.equal(await noJS.locator('#reader-controls').isVisible(),false);assert.equal(await noJS.locator('.chapter input:disabled').count(),15);
 }finally{await noJS.close();}
});
test('workshops remain keyboard reachable and fit phone and desktop widths',async()=>{
 for(const slug of ['applied-cryptography','modern-cryptography','boneh-shoup','understanding-cryptography','timestamping','fair-exchange'])for(const width of [390,1280]){
  const {page,errors}=await pageAt(slug,width);try{await page.keyboard.press('Tab');assert.equal(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);assert.equal(await page.locator('h1').count(),1);await audit(page);assert.deepEqual(errors,[]);}finally{await page.context().close();}
 }
});
