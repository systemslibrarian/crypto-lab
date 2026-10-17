import test from 'node:test';
import assert from 'node:assert/strict';
import {measure, transmit, makeReplay, inspect, sift, sameSet, detectionProbability, minimumSample, dailyPlan, readProgress, validDate} from '../games/quantum-courier/core.mjs';

test('basis measurement rules; random-bit source is consulted only for a different basis',()=>{
  for(const basis of ['+','x'])for(const bit of [0,1]){
    assert.deepEqual(measure({basis,bit},basis,()=>{throw new Error('Must not draw');}),{basis,bit});
    const other=basis==='+'?'x':'+';
    for(const draw of [0,1])assert.deepEqual(measure({basis,bit},other,()=>draw),{basis:other,bit:draw});
    assert.equal(transmit({basis,bit},basis,null,()=>{throw new Error('No noise');}).bob.bit,bit);
  }
  assert.throws(()=>measure({basis:'?',bit:0},'+',()=>0));
  assert.throws(()=>measure({basis:'+',bit:2},'+',()=>0));
  assert.throws(()=>measure({basis:'+',bit:0},'x',()=>2));
});
test('exhaustive fair intercept/resend outcomes yield exactly 25% errors among sifted bits',()=>{
  let total=0,errors=0;
  for(const basis of ['+','x'])for(const bit of [0,1])for(const eveBasis of ['+','x'])for(const first of [0,1])for(const second of [0,1]){
    let draws=0;
    const pulse=transmit({basis,bit},basis,eveBasis,()=>[first,second][draws++]);
    total++;errors+=Number(pulse.bob.bit!==bit);
    assert.equal(pulse.eve.basis,eveBasis);
  }
  assert.equal(total,32);assert.equal(errors,8);
  assert.equal(detectionProbability(0),0);assert.equal(detectionProbability(1),.25);
  for(let t=1;t<=15;t++)assert.equal(detectionProbability(t),1-3**t/4**t);
  assert(detectionProbability(10)<.95);assert(detectionProbability(11)>=.95);
  assert.equal(minimumSample(.95),11);assert.equal(minimumSample(0),0);assert.equal(24-minimumSample(.95),13);
  for(const bad of [-1,1.1,NaN,Infinity])assert.throws(()=>detectionProbability(bad));
  for(const bad of [-1,1,NaN,Infinity])assert.throws(()=>minimumSample(bad));
});
test('authored flights have the promised evidence, and public samples never remain in the cargo',()=>{
  const normal=makeReplay('school-1');
  assert.equal(sift(normal.pulses).length,8);
  assert.equal(inspect(normal.pulses,normal.sample).errors.length,0);
  const shadow=makeReplay('shadow-14',true),quiet=makeReplay('quiet-0',true);
  assert.deepEqual(inspect(shadow.pulses,shadow.sample).errors,[4,5]);
  const q=inspect(quiet.pulses,quiet.sample);
  assert.equal(q.errors.length,0);
  assert(quiet.pulses.some(p=>q.remaining.includes(p.id)&&p.alice.bit!==p.bob.bit));
  assert(quiet.pulses.some(p=>q.remaining.includes(p.id)&&p.eve.basis===p.alice.basis));
  for(const replay of [normal,shadow,quiet]){
    const checked=inspect(replay.pulses,replay.sample);
    assert.equal(checked.remaining.length,5);
    assert(checked.remaining.every(i=>!replay.sample.includes(i)));
    assert(!sameSet(checked.remaining,checked.matched));
  }
  assert(!sameSet([1,1],[1,2]));assert(sameSet([1,2],[2,1]));
  assert.throws(()=>inspect(normal.pulses,[normal.sample[0],normal.sample[0]]));
  assert.throws(()=>inspect(normal.pulses,[99]));
  assert.throws(()=>inspect(normal.pulses,[normal.pulses.find(p=>p.alice.basis!==p.bob.basis).id]));
  assert.throws(()=>inspect([...normal.pulses,normal.pulses[0]],normal.sample));
});
test('daily routes are deterministic and solvable, and include clean, intercepted-clean and disturbed samples',()=>{
  const variants=new Set();
  for(let day=1;day<=366;day++){
    const date=new Date(Date.UTC(2026,0,day)).toISOString().slice(0,10);
    const plan=dailyPlan(date),review=inspect(plan.pulses,plan.sample);
    assert.deepEqual(plan,dailyPlan(date));
    assert.equal(review.matched.length,8);assert.equal(review.remaining.length,5);
    variants.add(`${plan.intercepted}/${review.errors.length>0}`);
    if(!plan.intercepted)assert.equal(review.errors.length,0);
  }
  assert.deepEqual([...variants].sort(),['false/false','true/false','true/true']);
  for(const bad of ['2026-02-29','2026-13-01','nope',null])assert.equal(validDate(bad),false);
  assert.throws(()=>dailyPlan('2026-02-30'));
});
test('persisted progress validates every field without importing unexpected data',()=>{
  assert.deepEqual(readProgress('{'),{best:[0,0,0,0,0,0],daily:null});
  assert.deepEqual(readProgress(JSON.stringify({best:[1,2,3,99,-1,'3'],daily:{date:'2026-10-16',score:2},junk:'discard'})),{best:[1,2,3,0,0,0],daily:{date:'2026-10-16',score:2}});
  assert.equal(readProgress(JSON.stringify({best:[0,0,0,0,0,0],daily:{date:'2026-02-30',score:3}})).daily,null);
});
