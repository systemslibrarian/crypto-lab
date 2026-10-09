const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=__dirname;
const hub=process.argv[2]||'hub-integrated';const ref=process.argv[3]||'ba295530';
const {chromium}=require(path.join(root,hub+'/tools/node_modules/playwright'));
const html=fs.readFileSync(path.join(root,hub+'/index.html'),'utf8');
const expected=[...html.matchAll(/<a class="project-card[^\"]*"[^>]*href="([^\"]+)"/g)].map(m=>m[1]);
(async()=>{
 const browser=await chromium.launch({headless:true});const records=[];
 try{for(const width of [1366,390]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const response=await page.goto('https://crypto-lab.systemslibrarian.dev/?fleet_verify='+ref,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  const links=await page.locator('.project-card').evaluateAll(cards=>cards.map(c=>c.href));assert.equal(links.length,expected.length);assert.equal(new Set(links).size,expected.length);assert.deepEqual([...links].sort(),[...expected].sort());
  for(const [query,title] of [['WEP Crack','WEP Crack'],['LFSR Forge','LFSR Forge'],['RSA Small Roots','RSA Small Roots'],['dilithum','Dilithium']]){
   await page.locator('#demo-search').fill(query);await page.waitForTimeout(180);
   assert.ok(await page.locator('.project-card:visible .project-title').evaluateAll((cards,t)=>cards.some(c=>c.textContent.includes(t)),title),query);
  }
  await page.locator('#demo-search').fill('no_such_lab_unreadable_negative_control');await page.waitForTimeout(180);assert.equal(await page.locator('.project-card:visible').count(),0);assert.equal(await page.locator('#no-results').isVisible(),true);
  await page.locator('#demo-search').fill('');await page.waitForTimeout(180);
  await page.locator('#sort-order').selectOption('updated-desc');assert.equal(await page.locator('.project-card:visible').count(),expected.length);
  const dates=await page.locator('.project-card:visible').evaluateAll(cards=>cards.map(c=>c.dataset.updated||c.dataset.added||''));assert.deepEqual(dates,[...dates].sort().reverse());
  await page.locator('#sort-order').selectOption('curriculum');
  if(width<600)await page.locator('#filter-toggle').click();
  await page.locator('.level-btn[data-level="beginner"]').click();assert.ok(await page.locator('.project-card:visible').count()>0);assert.equal(await page.locator('.project-card:visible').evaluateAll(c=>c.every(x=>x.dataset.level==='beginner')),true);
  await page.locator('.level-btn[data-level=""]').click();
  await page.locator('#filter-chips button[data-category="ATTACKS"]').click();assert.ok(await page.locator('.project-card:visible').count()>0);assert.equal(await page.locator('.project-card:visible').evaluateAll(c=>c.every(x=>x.dataset.category.split(' | ').includes('ATTACKS'))),true);
  if(width<600 && await page.locator('#filter-toggle').getAttribute('aria-expanded')==='false')await page.locator('#filter-toggle').click();
  await page.locator('#filter-clear').click();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);assert.deepEqual(errors,[]);
  await page.addScriptTag({path:path.join(root,'crypto-compare/node_modules/axe-core/axe.js')});
  if(process.argv[4]==='--negative-a11y')await page.evaluate(()=>{
   const button=document.createElement('button');button.textContent='Visible control';
   button.setAttribute('aria-label','Unrelated accessible name');button.style.cssText='position:fixed;top:10px;left:10px;z-index:999999';document.body.prepend(button);
  });
  const axe=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']},rules:{'label-content-name-mismatch':{enabled:true}}});return r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
  records.push({sourceSha:ref,width,labs:links.length,unique:new Set(links).size,queriesPassed:5,sortPassed:true,filtersPassed:true,horizontalOverflow:overflow,consoleErrors:errors,accessibilityViolations:axe});
  assert.deepEqual(axe,[],`Accessibility failed at ${width}px`);
  await page.screenshot({path:path.join(root,'hub-live-'+width+'.png'),fullPage:false});await page.close();
 }}finally{await browser.close();fs.writeFileSync(path.join(root,'production-browser-checks-'+ref+(process.argv[4]==='--negative-a11y'?'-negative-a11y':'')+'.json'),JSON.stringify(records,null,2)+'\n');}
 console.log(JSON.stringify(records,null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
