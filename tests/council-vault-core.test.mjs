import test from 'node:test';
import assert from 'node:assert/strict';
import { NIGHTS, newNight, available, setThreshold, moveKeeper, begin, deploy, advance, gather, finish, cleanProgress } from '../games/secret-council/vault-core.mjs';
const fixed = () => 0; // A valid zero secret and zero high coefficients must work.
function dawn(state) { while (state.phase === 'watch') state = advance(state); return state; }
function collect(state) { for (const id of available(state)) state = gather(state, id); return finish(state); }

test('the same placement teaches both sides of the threshold tradeoff through actual recovery', () => {
  for (const k of [2,3,4,5]) {
    const state = collect(dawn(begin(setThreshold(newNight(), k), fixed)));
    assert.equal(state.result.safe, k > 2);
    assert.equal(state.result.recovered, k <= 3 ? 0 : null);
    assert.equal(state.result.pass, k === 3);
    assert.equal(state.result.possibilities, k === 2 ? 1 : 17);
    assert.equal(state.result.copied, 2); assert.equal(state.result.available, 3);
  }
});
test('guards prevent future copies, late guards cannot erase a recovered zero secret', () => {
  let state = begin(setThreshold(newNight(), 2), fixed);
  state = deploy(state, 'guard', 0);
  assert.equal(collect(dawn(state)).result.pass, true);
  state = advance(begin(setThreshold(newNight(), 2), fixed));
  assert.equal(state.exposed, 0);
  state = deploy(state, 'guard', 0);
  state = collect(dawn(state));
  assert.equal(state.exposed, 0); assert.equal(state.result.safe, false); assert.deepEqual(state.copied, [0,1]);
});
test('ferries restore reachable original shares without removing stolen copies', () => {
  let state = dawn(begin(newNight(), fixed));
  assert.deepEqual(available(state), [0,1,4]);
  state = deploy(state, 'ferry', 1);
  assert.equal(available(state).length, 5);
  assert.deepEqual(state.copied, [0,1]);
  state = collect(state);
  assert.equal(state.result.pass, true); assert.equal(state.result.reserves, 0);
});
test('moving a copied share into the next burglary accumulates distinct shares only', () => {
  let state = advance(begin(newNight(1), fixed));
  state = moveKeeper(state, 0, 2);
  assert.deepEqual(state.copied, [0,1]);
  state = advance(state);
  assert.deepEqual(new Set(state.copied), new Set([0,1,4]));
  assert.equal(state.exposed, 0);
  assert.equal(collect(dawn(state)).result.pass, false);
});
test('constrained interventions, capacity and phase changes cannot manufacture success', () => {
  let state = newNight();
  assert.throws(() => deploy(state,'guard',0)); assert.throws(() => finish(state));
  assert.throws(() => setThreshold(state, 1)); assert.throws(() => setThreshold(state, 6));
  state = moveKeeper(state, 4, 0);
  assert.throws(() => moveKeeper(state, 2, 0), /room for three/);
  state = begin(state, fixed);
  assert.throws(() => setThreshold(state,3)); assert.throws(() => begin(state));
  state = deploy(state,'guard',0);
  assert.throws(() => deploy(state,'guard',0)); assert.throws(() => deploy(state,'ferry',1), /No reserves/);
  assert.throws(() => moveKeeper(state,0,2), /No reserves/);
  state = dawn(state);
  assert.throws(() => gather(state,2), /reachable/); assert.throws(() => moveKeeper(state,2,2), /stranded/);
  state = collect(state);
  assert.throws(() => advance(state)); assert.throws(() => deploy(state,'ferry',1)); assert.throws(() => gather(state,0));
});
test('all three missions have concrete solutions and multiple strategies', () => {
  const scenarios = [
    { i:0, k:3, help:[] }, { i:0, k:2, help:[['guard',0]] }, { i:0, k:4, help:[['ferry',1]] },
    { i:1, k:3, help:[['guard',0]] }, { i:1, k:3, help:[['guard',2]] },
    { i:2, k:3, help:[['guard',0],['ferry',1]] }, { i:2, k:3, help:[['guard',2],['ferry',0]] },
  ];
  for (const scenario of scenarios) {
    let state = begin(setThreshold(newNight(scenario.i), scenario.k), () => 7);
    for (const [kind,house] of scenario.help) state = deploy(state,kind,house);
    state = collect(dawn(state));
    assert.equal(state.result.pass, true, JSON.stringify(scenario));
    assert.equal(state.result.recovered, 7);
  }
  // Rearrangement saves a reserve in the hardest night: one in Archive, one in Harbor, three in Tower.
  let state = moveKeeper(moveKeeper(newNight(2),1,2),3,2);
  state = deploy(begin(state,()=>9),'guard',2);
  state = collect(dawn(state));
  assert.equal(state.result.pass,true); assert.equal(state.result.reserves,1);
});
test('available subsets recover the independently evaluated polynomial; incomplete collection refuses', () => {
  let coefficients = [11,4,8], at = 0;
  let state = dawn(begin(setThreshold(newNight(),3),()=>coefficients[at++]));
  assert.deepEqual(state.dealt.shares.map(s=>s.y),[6,0,10,2,10]);
  assert.throws(()=>finish(state), /Choose 3 more/);
  state=gather(state,0); state=gather(state,0); assert.equal(state.gathered.length,0);
  state=collect(state); assert.equal(state.result.recovered,11);
  assert.equal(state.result.safe,true);
});
test('fresh attempts clear threats and malformed progress never becomes a completion', () => {
  assert.deepEqual(cleanProgress({completed:[1,true,'true',true],sound:'yes'}),{completed:[false,true,false],sound:false});
  assert.deepEqual(cleanProgress(null),{completed:[false,false,false],sound:false});
  for(let index=0;index<NIGHTS.length;index++) {
    const fresh = newNight(index);
    assert.deepEqual(fresh.copied,[]); assert.deepEqual(fresh.flooded,[]); assert.equal(fresh.dealt,null);
    assert.equal(fresh.reserves,NIGHTS[index].reserves);
  }
  assert.throws(()=>newNight(3));
  assert.throws(()=>begin(newNight(),()=>17), /invalid field/);
});
