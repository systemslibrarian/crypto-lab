#!/usr/bin/env node
/*
 * Run: node tools/knowledge-map-check.js
 * Prevents: learner-map navigation showing the wrong lab, broken topic search or links, inaccessible keyboard controls and horizontal overflow
 * Reads: knowledge-map/index.html, map.js, map.css and catalog.json via an isolated local HTTP server in Chromium
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');
const ROOT = path.join(__dirname,'..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT,'knowledge-map/catalog.json'),'utf8'));
let checks=0;
function check(value,message) { assert(value,message); checks++; }

async function main() {
  const server=http.createServer((req,res)=>{
    const file=path.resolve(ROOT,'.'+new URL(req.url,'http://local').pathname);
    if (!file.startsWith(ROOT+path.sep)) {res.writeHead(403).end();return;}
    const resolved=fs.existsSync(file)&&fs.statSync(file).isDirectory()?path.join(file,'index.html'):file;
    try {
      res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(resolved)]||'text/plain');
      res.end(fs.readFileSync(resolved));
    } catch {res.writeHead(404).end();}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  let browser;
  try {
    browser=await chromium.launch({headless:true});
    const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    // Optional external fonts are not required to navigate. No external lab is executed.
    await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
    await page.goto(base+'/knowledge-map/');
    await page.waitForSelector('#detail h2');
    check(Number(await page.locator('#n-exhibits').textContent())===data.exhibits.length,'current catalog count');
    for (const [view,items] of [['path',data.paths],['module',data.modules],['section',data.sections]]) {
      await page.locator(`[data-lens="${view}"]`).click();
      for (const item of items) {
        await page.locator(`[data-scope="${item.id}"]`).click();
        check(await page.locator('#spine [aria-current="true"]').count()===1,`${view}/${item.id}: selected lab belongs to view`);
        const selected=await page.locator('#spine [aria-current="true"]').getAttribute('data-id');
        check(await page.locator('#detail h2').textContent()===data.exhibits.find(e=>e.id===selected).title,`${view}/${item.id}: detail matches selection`);
      }
    }
    await page.locator('[data-lens="concept"]').click();
    for (const concept of data.concepts) {
      await page.locator('#concept-pick').selectOption(concept.id);
      check(await page.locator('#spine [aria-current="true"]').count()===1,'concept/'+concept.id+': selected lab belongs');
    }
    await page.locator('#q').fill('factorization');
    check(await page.locator('#hits [data-concept="7"]').count()===1,'factorization resolves to Factoring');
    await page.locator('#hits [data-concept="7"]').focus();
    await page.keyboard.press('Enter');
    check(await page.locator('#concept-pick').inputValue()==='7','keyboard opens topic');
    check(await page.locator('#spine [data-id="factor-forge"]').count()===1,'topic links Factor Forge');
    await page.locator('#spine [data-id="rsa-educational"]').click();
    await page.locator('#detail details summary').click();
    const module=data.modules.find(m=>m.id==='public-key');
    for(const requirement of module.prerequisites) check((await page.locator('#detail').textContent()).includes(requirement),'prerequisite text retained');
    for(const a of await page.locator('#spine a, #detail a').all()) {
      const href=await a.getAttribute('href');
      if(href.startsWith('../')) check((await page.request.get(new URL(href,base+'/knowledge-map/').href)).ok(),'local module link exists');
    }
    await page.locator('#detail [data-title="RSA Forge"][data-nav-lens="module"]').click();
    check(await page.locator('#detail h2').textContent()==='RSA Forge','next learning step opens destination');
    check((await page.locator('[data-lens="module"]').getAttribute('aria-pressed'))==='true','module next step retains its module');
    const deep=page.url();
    await page.reload();await page.waitForSelector('#detail h2');
    check(await page.locator('#detail h2').textContent()==='RSA Forge','reload retains deep link');
    await page.locator('[data-lens="section"]').click();
    await page.goBack();
    check(page.url()===deep && await page.locator('#detail h2').textContent()==='RSA Forge','back restores selection');
    await page.goForward();
    check((await page.locator('[data-lens="section"]').getAttribute('aria-pressed'))==='true','forward restores the newer view');
    await page.locator('[data-lens="concept"]').click();
    await page.locator('#concept-pick').selectOption('7');
    const related=page.locator('#spine [data-concept]').first();
    const relatedId=await related.getAttribute('data-concept');
    await related.click();
    check(await page.locator('#concept-pick').inputValue()===relatedId,'shared concept link opens its own filing');
    await page.locator('#q').fill('zzzz no matching lab');
    check((await page.locator('#search-status').textContent()).includes('No matching'),'no-results feedback');
    await page.locator('#q').press('Escape');
    check(await page.locator('#q').inputValue()==='' && await page.locator('#hits').isHidden(),'Escape dismisses search');
    await page.goto(base+'/knowledge-map/#view=concept&scope=missing&lab=missing');
    await page.waitForSelector('#detail h2');
    check(await page.locator('#spine [aria-current="true"]').count()===1,'invalid deep link safely selects a real member');
    for(const width of [320,390,768,1280]) {
      await page.setViewportSize({width,height:900});
      for(const view of ['path','concept','module','section','depth']) {
        await page.locator(`[data-lens="${view}"]`).click();
        check(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),`${width}px ${view}: no horizontal overflow`);
      }
    }
    check(errors.length===0,'no JavaScript errors: '+errors.join('; '));
    const failed=await browser.newPage();
    await failed.route('**/catalog.json',r=>r.fulfill({status:503,body:'unavailable'}));
    await failed.goto(base+'/knowledge-map/');
    await failed.waitForSelector('#spine[role="alert"]');
    check((await failed.locator('#spine').textContent()).includes('did not load'),'failed catalog load produces visible alert');
    console.log(`Knowledge map browser: PASS (${checks} assertions; all authored views, topic search, prerequisites, history, links, 320–1280px layout, load failure)`);
  } finally {
    await browser?.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
