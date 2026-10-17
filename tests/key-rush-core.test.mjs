import test from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,create,start,move,tick,pause,explanation,cleanProgress} from '../games/key-rush/core.mjs';
const dirs={R:[1,0],L:[-1,0],U:[0,-1],D:[0,1]};
const walk=(s,path)=>[...path].reduce((s,c)=>move(s,...dirs[c]),s);
const deal0=()=>0;

test('distinct deliveries really reconstruct a zero secret; no result before the threshold',()=>{
 let s=start(create(0,2),deal0);
 s=walk(s,'RRRRRRRRRR');assert.deepEqual(s.delivered,[0]);assert.equal(s.phase,'playing');assert.equal(s.recovered,null);
 s=walk(s,'RRRRRRRRRR');assert.equal(s.reason,'win');assert.equal(s.recovered,0);assert.equal(s.exposed,null);
 assert.equal(explanation(s).possibilities,17);
 assert.equal(move(s,1,0),s);assert.equal(tick(s,100),s);
});
test('a copied share remains usable, while repeated scans of the same bot are not new shares',()=>{
 let s=start(create(0,2),()=>7);
 s=walk(s,'URRRR');assert.deepEqual(s.copied,[0]);assert.equal(s.offline.length,0);assert.equal(s.active,0);
 s=tick(s,200);assert.deepEqual(s.copied,[0]);assert.equal(s.phase,'playing');
 s=walk(s,'RRRRRRD');assert.deepEqual(s.delivered,[0]);assert.deepEqual(s.copied,[0]);
 s=walk(s,'URRRR');assert.equal(s.reason,'breach');assert.deepEqual(s.copied,[0,1]);assert.equal(s.exposed,7);
 assert.equal(explanation(s).possibilities,1);
});
test('a higher threshold survives those two copied shares but requires a third delivery',()=>{
 let s=start(create(0,3),()=>9);
 for(let i=0;i<2;i++)s=walk(s,'URRRRRRRRRRD');
 assert.equal(s.phase,'playing');assert.deepEqual(s.copied,[0,1]);assert.deepEqual(s.delivered,[0,1]);
 s=walk(s,'RRRRRRRRRR');assert.equal(s.reason,'win');assert.equal(s.recovered,9);assert.equal(explanation(s).possibilities,17);
});
test('pink traps remove availability without creating stolen copies',()=>{
 let s=start(create(1,4),()=>5);
 // Cross the first scanner at its gap, approach the trap from above.
 s=walk(s,'UURRRRDD R'.replaceAll(' ',''));
 assert.equal(s.phase,'playing');assert.deepEqual(s.offline,[0]);assert.deepEqual(s.copied,[]);assert.equal(s.active,1);
 s=walk(s,'UURRRRDDR');assert.equal(s.reason,'lost');assert.deepEqual(s.offline,[0,1]);assert.equal(s.exposed,null);
 assert.equal(s.delivered.length,0);assert.equal(explanation(s).possibilities,17);
});
test('boost checks every traversed square, obeys cooldown and cannot move a newly spawned bot',()=>{
 let s=walk(start(create(),()=>3),'URR');
 s=move(s,1,0,true);assert.equal(s.x,5);assert.deepEqual(s.copied,[0]);
 assert.equal(move(s,1,0,true),s);
 s=walk(start(create(),()=>3),'RRRRRRRR');s=move(s,1,0,true);
 assert.deepEqual(s.delivered,[0]);assert.equal(s.active,1);assert.equal(s.x,0);
 s=walk(start(create(),()=>3),'UURRRR');s=move(s,1,0,true);assert.equal(s.x,4,'wall stops a boost before x5,y1');
});
test('hazards keep moving, pause freezes them, and a scanner can catch a stationary bot',()=>{
 let s=walk(start(create(),deal0),'RRRR'); // First gap is safe at row 3.
 assert.equal(s.copied.length,0);
 const frozen=pause(s);assert.equal(tick(frozen,1000),frozen);assert.equal(move(frozen,1,0),frozen);
 s=pause(frozen);s=tick(tick(s,1000),1000);assert.deepEqual(s.copied,[0]);
 assert.equal(s.phase,'playing');assert.throws(()=>tick(s,Infinity));assert.throws(()=>tick(s,1001));
});
test('each authored arena has a playable safe route at an explicit hazard phase',()=>{
 const routes=['RRRRRRRRRR','UURRRRDDURRRRRRD','UURRRRDDRRRRRR'];
 for(let level=0;level<LEVELS.length;level++){
  let s=start(create(level),()=>11);
  if(level===1)s=tick(s,200); // Second scanner is off; first has a row-one gap.
  const route=routes[level];
  for(let i=0;i<s.threshold;i++)s=walk(s,route);
  assert.equal(s.reason,'win',`level ${level}: ${JSON.stringify({x:s.x,y:s.y,copied:s.copied,offline:s.offline,delivered:s.delivered})}`);
  assert.equal(s.recovered,11);
 }
});
test('fresh games, validated preferences and RNG failures cannot inherit a win or disclose a stale secret',()=>{
 assert.deepEqual(cleanProgress({completed:[true,'true',2],sound:'yes',slow:1}),{completed:[true,false,false],sound:false,slow:false});
 assert.throws(()=>create(0,4));assert.throws(()=>create(3));assert.throws(()=>start(create(),()=>17));
 for(const s of [create(),create(1),create(2)]){assert.equal(s.dealt,null);assert.deepEqual(s.copied,[]);assert.deepEqual(s.delivered,[]);assert.deepEqual(s.offline,[]);assert.throws(()=>explanation(s));}
});
