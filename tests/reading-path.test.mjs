import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {chapters} from '../learn/applied-cryptography/chapters.mjs';
import {chapters as modernChapters} from '../learn/modern-cryptography/chapters.mjs';
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
test('all local links and resources on the four learning pages resolve',()=>{
 for(const slug of ['applied-cryptography','modern-cryptography','timestamping','fair-exchange']){
  const base=path.join(root,'learn',slug),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(https?:|#)/.test(url))continue;const file=path.resolve(base,url.split('#')[0]);assert.ok(fs.existsSync(file),`${slug}: ${url}`);
  }
 }
});
