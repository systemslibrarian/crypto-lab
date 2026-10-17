import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {MOVES,commit,verify,encode,counter,outcome,randomMove,randomHex,dailyPlan,readProgress} from '../games/sealed-showdown/core.mjs';
const opening={round:'lesson-1',player:'switch',move:'paper',nonce:'0123456789abcdef0123456789abcdef'};
const context={round:opening.round,player:opening.player};
const hash=x=>createHash('sha256').update(x).digest('hex');
test('real SHA-256 encoding, binding, context independence and malformed openings',async()=>{
  const encoded='["crypto-lab/sealed-showdown/v1","lesson-1","switch","paper","0123456789abcdef0123456789abcdef"]';
  assert.equal(encode(opening),encoded);const seal=await commit(opening);assert.equal(seal,hash(encoded));
  assert.equal((await verify(seal,opening,context)).valid,true);
  for(const changed of [{move:'rock'},{nonce:'f'.repeat(32)},{round:'another'},{player:'you'}])assert.equal((await verify(seal,{...opening,...changed},context)).valid,false);
  assert.equal((await verify(seal,opening,{round:'new-match',player:'switch'})).valid,false);
  for(const bad of [null,{}, {...opening,nonce:'short'}, {...opening,move:'lizard'}])assert.equal((await verify(seal,bad,context)).valid,false);
  for(const bad of ['',seal.toUpperCase(),'0'.repeat(63)])assert.equal((await verify(bad,opening,context)).valid,false);
  assert.throws(()=>encode({...opening,round:'injection"'}));
});
test('weak commitments permit three-guess lookup; secret nonce changes the strong seal',async()=>{
  const seal=await commit(opening,true);
  assert.equal(seal,hash('["crypto-lab/sealed-showdown/weak-v1","lesson-1","switch","paper"]'));
  const matches=[];for(const move of MOVES)if(await commit({...opening,move},true)===seal)matches.push(move);
  assert.deepEqual(matches,['paper']);assert.notEqual(await commit(opening),await commit({...opening,nonce:'f'.repeat(32)}));
});
test('all nine game results and unbiased byte rejection',()=>{
  const expected=[['tie','loss','win'],['win','tie','loss'],['loss','win','tie']];
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)assert.equal(outcome(MOVES[i],MOVES[j]),expected[i][j]);
  for(const m of MOVES)assert.equal(outcome(counter(m),m),'win');
  const counts={rock:0,paper:0,scissors:0};for(let b=0;b<252;b++)counts[randomMove(()=>b)]++;
  assert.deepEqual(counts,{rock:84,paper:84,scissors:84});const bytes=[255,252,254,253,2];assert.equal(randomMove(()=>bytes.shift()),'scissors');
  assert.throws(()=>randomMove(()=>256));assert.throws(()=>randomMove(()=>255));assert.match(randomHex(),/^[a-f0-9]{32}$/);
});
test('daily lessons are distinct, reproducible and varied; only validated scores survive storage',()=>{
  const seen=new Set();for(let d=1;d<=100;d++){const date=new Date(Date.UTC(2026,0,d)).toISOString().slice(0,10),plan=dailyPlan(date);assert.deepEqual(plan,dailyPlan(date));assert.equal(new Set(plan.chapters).size,3);plan.chapters.forEach(c=>{assert(c>=1&&c<=5);seen.add(c);});}assert.equal(seen.size,5);
  for(const date of ['2026-02-30','x','2026-1-1'])assert.throws(()=>dailyPlan(date));
  assert.deepEqual(readProgress('{broken'),{best:[0,0,0,0,0,0],daily:null,arenaBest:null});
  assert.deepEqual(readProgress(JSON.stringify({best:[3,4,-1,'3',2,1],daily:{date:'2026-02-30',score:3},arenaBest:6})),{best:[3,0,0,0,2,1],daily:null,arenaBest:null});
});
