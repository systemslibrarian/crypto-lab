import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {RUNS,prepareRun,candidates,join,decide,rewind,takeaway,progress} from '../games/merkle-mystery/run-core.mjs';
const H=(...parts)=>createHash('sha256').update(Buffer.concat(parts)).digest('hex');
const parent=(left,right)=>H(Buffer.from([1]),Buffer.from(left,'hex'),Buffer.from(right,'hex'));
const leaf=record=>H(Buffer.from([0]),Buffer.from(JSON.stringify([record.title,record.text])));
async function climb(s){while(s.phase==='build')s=await join(s,`${s.level}:${s.position^1}`,s.position%2?'left':'right');return s;}

test('all four routes use logarithmic proof sizes and independently recomputed full hashes',async()=>{
 for(let run=0;run<RUNS.length;run++){
  let s=await prepareRun(run);assert.equal(s.current,leaf(s.record));
  s=await climb(s);assert.equal(s.phase,'judge');assert.equal(s.steps.length,Math.log2(s.mission.size));
  let value=leaf(s.record);
  for(const step of s.steps){value=step.side==='left'?parent(step.sibling,value):parent(value,step.sibling);assert.equal(step.hash,value);}
  assert.equal(s.current,value);assert.equal(s.verified,value===s.trustedRoot);
  assert.equal(s.verified,run<2);assert.equal(s.offeredMatch,run!==2);
  s=decide(s,s.verified?'accept':'reject');assert.equal(s.phase,'done');assert(takeaway(s).length>100);
 }
});
test('wrong sibling and reversed ordering compute real preview hashes without spending a jump',async()=>{
 let s=await prepareRun(1),original=s.current;
 const wrong=candidates(s).find(c=>c.index!==(s.position^1));
 let next=await join(s,wrong.id,'left');assert.equal(next.current,original);assert.equal(next.level,0);assert.equal(next.steps.length,0);
 assert.equal(next.preview.hash,parent(wrong.hash,original));assert.match(next.message,/wrong block/);
 const sibling=candidates(s).find(c=>c.index===(s.position^1));
 next=await join(s,sibling.id,'right');assert.equal(next.current,original);assert.equal(next.preview.hash,parent(original,sibling.hash));assert.match(next.message,/wrong order/);
 next=await join(next,sibling.id,'left');assert.equal(next.level,1);assert.equal(next.preview,null);
 assert.notEqual(next.current,parent(original,sibling.hash));
 await assert.rejects(()=>join(s,'4:0','left'));await assert.rejects(()=>join(s,sibling.id,'middle'));
});
test('final decisions depend on actual verification and a sender root cannot authorize an altered record',async()=>{
 const genuine=await climb(await prepareRun(0));assert.equal(decide(genuine,'reject').phase,'judge');assert.throws(()=>decide({...genuine,phase:'build'},'accept'));
 const forged=await climb(await prepareRun(3));assert.equal(forged.current,forged.offeredRoot);assert.notEqual(forged.current,forged.trustedRoot);
 assert.equal(decide(forged,'accept').phase,'judge');assert.match(takeaway(decide(forged,'reject')),/not.*trustworthy/);
 // Keep the authored 'genuine' label but alter the actual record and leaf value.
 let changed=await prepareRun(0);changed.record={...changed.record,text:changed.record.text+' altered'};changed.current=leaf(changed.record);
 changed=await climb(changed);assert.equal(changed.mission.kind,'genuine');assert.equal(changed.verified,false);assert.equal(decide(changed,'accept').phase,'judge');
});
test('undo restores the exact previous input and fresh attempts clear all verdict state',async()=>{
 const fresh=await prepareRun(2),complete=await climb(fresh),back=rewind(decide(complete,'reject'));
 assert.equal(back.phase,'build');assert.equal(back.level,3);assert.equal(back.current,complete.steps[3].input);
 assert.equal(back.verified,null);assert.equal(back.offeredMatch,null);assert.equal(back.decision,null);
 const again=await join(back,`${back.level}:${back.position^1}`,back.position%2?'left':'right');assert.equal(again.current,complete.current);
 assert.equal(rewind(fresh).level,0);assert.throws(()=>takeaway(fresh));assert.equal((await prepareRun(2)).phase,'build');
});
test('candidates retain the required sibling at every size and progress accepts only real booleans',async()=>{
 for(let run=0;run<RUNS.length;run++){
  let s=await prepareRun(run);
  while(s.phase==='build'){
   const deck=candidates(s);assert.equal(new Set(deck.map(c=>c.id)).size,deck.length);
   assert(deck.some(c=>c.index===(s.position^1)));assert(deck.every(c=>c.last-c.first+1===2**s.level));
   s=await join(s,`${s.level}:${s.position^1}`,s.position%2?'left':'right');
  }
  assert.deepEqual(candidates(s),[]);await assert.rejects(()=>join(s,'0:0','left'));
 }
 assert.deepEqual(progress({completed:[true,'true',1,null],sound:'yes'}),{completed:[true,false,false,false],sound:false});
 await assert.rejects(()=>prepareRun(-1));
});
