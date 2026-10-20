import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {chapters} from '../learn/applied-cryptography/chapters.mjs';
import {chapters as modernChapters} from '../learn/modern-cryptography/chapters.mjs';
import {chapters as bonehChapters} from '../learn/boneh-shoup/chapters.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('every chapter has a scoped connection, original practice prompt and known coverage label',()=>{
 assert.deepEqual(chapters.map(c=>c.chapter),Array.from({length:25},(_,i)=>i+1));
 for(const c of chapters){assert.ok(['direct','modern','intro'].includes(c.coverage));assert.ok(c.labs.length&&c.try&&c.limit);}
 execFileSync(process.execPath,['learn/applied-cryptography/build.mjs','--check'],{cwd:root});
});
test('Katz–Lindell follows the 15-chapter outline and builds only catalog-backed connections',()=>{
 assert.deepEqual(modernChapters.map(c=>c.chapter),Array.from({length:15},(_,i)=>i+1));
 assert.equal(modernChapters.filter(c=>c.part==='Foundations').length,2);
 assert.equal(modernChapters.filter(c=>c.part==='Symmetric cryptography').length,6);
 assert.equal(modernChapters.filter(c=>c.part==='Public-key cryptography').length,7);
 assert.equal(modernChapters[7].coverage,'intro','theoretical construction chain remains a partial bridge');
 const catalog=new Map(JSON.parse(fs.readFileSync(path.join(root,'knowledge-map/catalog.json'),'utf8')).exhibits.map(e=>[e.title,e.href]));
 for(const c of modernChapters){
  assert.ok(c.bookTitle&&c.title&&c.sections&&c.predict&&c.try&&c.reflect&&c.limit,`chapter ${c.chapter} has a book title, reading reference, predict–try–explain activity and boundary`);
  for(const lab of c.labs){assert.ok(catalog.has(lab.title),`catalog has ${lab.title}`);assert.ok(lab.note);assert.ok(['direct','modern','intro'].includes(lab.coverage));}
 }
 for(const title of ['Kyber Vault','Dilithium Seal'])assert.equal(modernChapters[13].labs.find(lab=>lab.title===title)?.coverage,'modern','later standards are labeled counterparts');
 execFileSync(process.execPath,['learn/modern-cryptography/build.mjs','--check'],{cwd:root});
});
test('Boneh–Shoup maps the pinned outline and distinguishes missing text from implemented concepts',()=>{
 assert.deepEqual(bonehChapters.map(c=>c.chapter),Array.from({length:23},(_,i)=>i+1));
 assert.deepEqual(['Introduction','Secret key cryptography','Public key cryptography','Protocols'].map(part=>bonehChapters.filter(c=>c.part===part).length),[1,8,8,6]);
 for(const n of [1,17]){assert.equal(bonehChapters[n-1].coverage,'supplement');assert.match(bonehChapters[n-1].sections,/absent/);}
 for(const title of ['Bulletproofs','SNARK Arena'])assert.equal(bonehChapters[19].labs.find(l=>l.title===title).coverage,'supplement');
 const catalog=new Map(JSON.parse(fs.readFileSync(path.join(root,'knowledge-map/catalog.json'),'utf8')).exhibits.map(e=>[e.title,e.href]));
 for(const c of bonehChapters){
  for(const field of ['bookTitle','title','sections','predict','try','reflect','limit'])assert.ok(c[field]?.trim(),`chapter ${c.chapter}: ${field}`);
  assert.ok(c.labs.length);
  for(const lab of c.labs){assert.ok(catalog.has(lab.title),lab.title);assert.ok(lab.note);assert.ok(['direct','modern','intro','supplement'].includes(lab.coverage));}
 }
 execFileSync(process.execPath,['learn/boneh-shoup/build.mjs','--check'],{cwd:root});
 const html=fs.readFileSync(path.join(root,'learn/boneh-shoup/index.html'),'utf8');
 assert.match(html,/BonehShoup_0_6\.pdf#page=1011/,'chapter 23 opens in the pinned PDF');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(id),`anchor ${id}`);
});
test('all local links and resources on the five learning pages resolve',()=>{
 for(const slug of ['applied-cryptography','modern-cryptography','boneh-shoup','timestamping','fair-exchange']){
  const base=path.join(root,'learn',slug),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(https?:|#)/.test(url))continue;const file=path.resolve(base,url.split('#')[0]);assert.ok(fs.existsSync(file),`${slug}: ${url}`);
  }
 }
});
