import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {leafHash,nodeHash,buildTree,makeProof,verifyProof,proofTrace,verifyBundle,pathIds,siblingIds,changedNodes,sameSet,prepare,dailyPlan,bookData,score,cleanProgress} from '../games/merkle-mystery/core.mjs';
const H = (...parts) => createHash('sha256').update(Buffer.concat(parts)).digest();
const independentLeaf = text => H(Buffer.from([0]),Buffer.from(text,'utf8'));
function independentTree(records) {
  if(records.length===1)return independentLeaf(records[0]);
  const middle=records.length/2;
  return H(Buffer.from([1]),independentTree(records.slice(0,middle)),independentTree(records.slice(middle)));
}
test('domain-separated full SHA-256 values match an independent recursive implementation',async()=>{
  assert.equal(await leafHash(''),'6e340b9cffb37a989ca544e6bb780a2c78901d3fb33738768511a30617afa01d');
  for(const records of [['a'],['a','b'],['a','b','c','d'],['Moon 🌒','漢字','a\n"b','é']]){
    const tree=await buildTree(records);
    assert.equal(tree.root,independentTree(records).toString('hex'));
    assert.equal(tree.levels[0][0],independentLeaf(records[0]).toString('hex'));
  }
  const left=await leafHash('a'),right=await leafHash('b');
  assert.notEqual(await nodeHash(left,right),await nodeHash(right,left));
  assert.notEqual(await leafHash(left+right),await nodeHash(left,right));
});
test('every leaf in all supported complete tree sizes verifies with exactly the sibling path',async()=>{
  for(const size of [1,2,4,8,16,32,64]){
    const records=Array.from({length:size},(_,i)=>`Record ${i}`), tree=await buildTree(records);
    for(let index=0;index<size;index++){
      const proof=makeProof(tree,index);
      assert.equal(proof.length,Math.log2(size));
      assert(await verifyProof(records[index],index,size,proof,tree.root));
      assert(await verifyBundle(tree,records[index],index,siblingIds(index,size)));
      assert.equal((await proofTrace(records[index],index,size,proof)).root,independentTree(records).toString('hex'));
    }
  }
});
test('modified content, wrong order/index/size/root, shortened and extra proofs fail closed',async()=>{
  const records=['a','b','c','d','e','f','g','h'],tree=await buildTree(records),proof=makeProof(tree,2);
  const cases=[['C',2,8,proof,tree.root],['c',3,8,proof,tree.root],['c',2,4,proof,tree.root],['c',2,8,proof.slice(1),tree.root],['c',2,8,[...proof,proof[0]],tree.root],['c',2,8,[...proof].reverse(),tree.root],['c',2,8,proof,'0'.repeat(64)],['c',2,8,['x',...proof.slice(1)],tree.root],['c',-1,8,proof,tree.root],['c',8,8,proof,tree.root],['c',2.5,8,proof,tree.root],['c',2,0,proof,tree.root],['c',2,3,proof,tree.root],['c',2,8,null,tree.root],['c',2,8,proof,tree.root.slice(0,8)],['c',2,8,proof,tree.root.toUpperCase()]];
  for(const args of cases)assert.equal(await verifyProof(...args),false,JSON.stringify(args));
  assert.equal(await verifyBundle(tree,'c',2,['0:3','0:3','2:1']),false);
  assert.equal(await verifyBundle(tree,'c',2,['0:0','1:0','2:1']),false);
  assert.equal(await verifyBundle(tree,'c',2,['0:3','1:0','3:0']),false);
  for(const records of [[],['a','b','c']])await assert.rejects(buildTree(records));
});
test('mutation propagation is exactly the ancestor union, with unrelated branches unchanged',async()=>{
  const records=Array.from({length:8},(_,i)=>`Record ${i}`),before=await buildTree(records);
  for(const indices of [[0],[5],[1,6],[2,3]]){
    const after=await buildTree(records.map((r,i)=>indices.includes(i)?r+' changed':r));
    assert(sameSet(changedNodes(before,after),[...new Set(indices.flatMap(i=>pathIds(i,8)))]));
  }
});
test('all six chapters have valid solutions and real proof-based parcel verdicts',async()=>{
  for(let chapter=0;chapter<6;chapter++){
    const data=await prepare(chapter),m=data.mission;
    if(m.changed.length)assert(sameSet(changedNodes(data.before,data.after).filter(id=>id.startsWith('0:')),m.changed.map(i=>`0:${i}`)));
    if(m.kind==='pack')assert(await verifyBundle(data.before,bookData(data.original[m.target]),m.target,siblingIds(m.target,m.size)));
    if(m.kind==='inspect'){
      const verdicts=await Promise.all(data.parcels.map(p=>verifyProof(bookData(p.book),p.index,p.size,p.proof,data.before.root)));
      assert.deepEqual(verdicts,[true,false,false]);
    }
    if(m.kind==='trust'){
      const p=data.parcels[0];
      assert(await verifyProof(bookData(p.book),p.index,p.size,p.proof,p.offeredRoot));
      assert.equal(await verifyProof(bookData(p.book),p.index,p.size,p.proof,data.before.root),false);
      assert.notEqual(p.offeredRoot,data.before.root);
    }
  }
});
test('366 daily dates are deterministic, varied and solvable; every parcel variant has expected semantics',async()=>{
  const kinds=new Set(),targets=new Set(),dates=[];
  for(let i=0;i<366;i++){
    const date=new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10),plan=dailyPlan(date);
    assert.deepEqual(plan,dailyPlan(date));assert.equal(new Set(plan.changed).size,2);
    assert(plan.changed.every(n=>n>=0&&n<8));kinds.add(plan.parcelKind);targets.add(plan.target);
    if(!dates.some(p=>p.parcelKind===plan.parcelKind))dates.push(plan);
  }
  assert.equal(kinds.size,4);assert.equal(targets.size,8);
  for(const plan of dates){
    const comparison=await prepare(0,plan,0);
    assert(sameSet(changedNodes(comparison.before,comparison.after).filter(id=>id.startsWith('0:')),plan.changed.map(i=>`0:${i}`)));
    const packing=await prepare(0,plan,1);
    assert(await verifyBundle(packing.before,bookData(packing.original[plan.target]),plan.target,siblingIds(plan.target,8)));
    const inspection=await prepare(0,plan,2),p=inspection.parcels[0];
    assert.equal(await verifyProof(bookData(p.book),p.index,p.size,p.proof,inspection.before.root),plan.parcelKind==='genuine');
  }
  for(const date of ['2026-02-30','bad','2026-13-01','2026-1-01',null])assert.throws(()=>dailyPlan(date));
});
test('scores do not fall below one; corrupted progress cannot inject or inflate values',()=>{
  assert.equal(score(0,false),3);assert.equal(score(0,true),2);assert.equal(score(1,true),1);assert.equal(score(20,true),1);
  assert.deepEqual(cleanProgress({best:[3,9,-1,'3',2.2,null],daily:{date:'bad',score:3}}),{best:[3,0,0,0,0,0],daily:null});
  assert.deepEqual(cleanProgress({best:[3,2,1,0,3,2],daily:{date:'2026-10-16',score:2}}),{best:[3,2,1,0,3,2],daily:{date:'2026-10-16',score:2}});
  assert.equal(sameSet(['a','a'],['a','b']),false);
});
