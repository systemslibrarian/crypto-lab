import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {chapters} from '../learn/applied-cryptography/chapters.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('every chapter has a scoped connection, original practice prompt and known coverage label',()=>{
 assert.deepEqual(chapters.map(c=>c.chapter),Array.from({length:25},(_,i)=>i+1));
 for(const c of chapters){assert.ok(['direct','modern','intro'].includes(c.coverage));assert.ok(c.labs.length&&c.try&&c.limit);}
 execFileSync(process.execPath,['learn/applied-cryptography/build.mjs','--check'],{cwd:root});
});
test('all local links and resources on the three learning pages resolve',()=>{
 for(const slug of ['applied-cryptography','timestamping','fair-exchange']){
  const base=path.join(root,'learn',slug),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(https?:|#)/.test(url))continue;const file=path.resolve(base,url.split('#')[0]);assert.ok(fs.existsSync(file),`${slug}: ${url}`);
  }
 }
});
