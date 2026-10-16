import test from 'node:test';
import assert from 'node:assert/strict';
import { PRIME, inverse, evaluate, interpolate, reconstruct, randomField, deal, possibleSecrets, compatiblePoints, CAMPAIGN, MEMBERS, dailyMission, assess, solutions } from '../games/secret-council/core.mjs';

const vector = [{x:1,y:12},{x:2,y:4},{x:3,y:0},{x:4,y:0},{x:5,y:4}];
test('hand-computed F17 polynomial 7 + 3x + 2x² and every 3-of-5 recovery', () => {
  assert.deepEqual(vector.map(p => evaluate([7,3,2], p.x)), [12,4,0,0,4]);
  for (let a = 0; a < 3; a++) for (let b = a + 1; b < 4; b++) for (let c = b + 1; c < 5; c++) {
    assert.equal(reconstruct([vector[a],vector[b],vector[c]], 3), 7);
  }
  assert.equal(reconstruct(vector, 3), 7);
  assert.equal(interpolate(vector.slice(0,3), 2), 4);
  for (let n = 1; n < PRIME; n++) assert.equal(n * inverse(n) % PRIME, 1);
  assert.throws(() => inverse(0));
});
test('all coefficient choices: fewer shares leave exactly equal counts per secret', () => {
  const one = Array(17).fill(0), two = Array(17).fill(0), three = Array(17).fill(0);
  for (let s = 0; s < 17; s++) for (let a = 0; a < 17; a++) for (let b = 0; b < 17; b++) {
    // Independent direct polynomial calculation, not the implementation evaluator.
    if ((s+a+b)%17 === 12) {
      one[s]++;
      if ((s+2*a+4*b)%17 === 4) {
        two[s]++;
        if ((s+3*a+9*b)%17 === 0) three[s]++;
      }
    }
  }
  assert.deepEqual(one, Array(17).fill(17)); assert.deepEqual(two, Array(17).fill(1));
  assert.deepEqual(three, Array.from({length:17}, (_,i) => Number(i === 7)));
  assert.equal(possibleSecrets(vector.slice(0,2), 3).length, 17);
  assert.deepEqual(possibleSecrets(vector.slice(0,3), 3), [7]);
});
test('each explorer candidate is an actual compatible finite-field polynomial', () => {
  for (let count = 0; count <= 3; count++) {
    const visible = vector.slice(0, count);
    for (const secret of possibleSecrets(visible, 3)) {
      const plot = compatiblePoints(visible, secret, 3);
      assert.equal(plot[0].y, secret);
      for (const p of visible) assert.equal(plot[p.x].y, p.y);
      // Third finite difference vanishes for a polynomial of degree at most two.
      for (let x = 0; x < 14; x++) assert.equal(((plot[x+3].y-3*plot[x+2].y+3*plot[x+1].y-plot[x].y)%17+17)%17, 0);
    }
  }
  assert.throws(() => compatiblePoints(vector.slice(0,3), 8, 3));
});
test('invalid, duplicate, insufficient and inconsistent shares are rejected', () => {
  assert.throws(() => reconstruct(vector.slice(0,2), 3));
  assert.throws(() => reconstruct([vector[0],vector[0],vector[2]], 3));
  for (const p of [{x:0,y:7},{x:17,y:0},{x:1.5,y:0},{x:1,y:-1},{x:1,y:17},{x:1,y:NaN}]) {
    assert.throws(() => reconstruct([p,vector[1],vector[2]], 3));
  }
  assert.throws(() => reconstruct([...vector.slice(0,3), {x:4,y:1}], 3));
  // Exactly k forged points are not authenticated by basic Shamir sharing.
  assert.notEqual(reconstruct([{x:1,y:13},vector[1],vector[2]], 3), 7);
  assert.throws(() => reconstruct(vector, 1));
  assert.throws(() => deal([0,0,1], 2)); assert.throws(() => deal([0,1], 3));
  assert.throws(() => deal([0,1,7], 2)); assert.throws(() => deal([0,1], 2, () => 17));
});
test('zero highest coefficients are allowed; selected members retain unique nonzero x', () => {
  const values = [7,0,0];
  const d = deal([0,3,6], 3, () => values.shift());
  assert.deepEqual(d.shares.map(p => [p.x,p.y]), [[1,7],[4,7],[7,7]]);
  assert.equal(reconstruct(d.shares,3),7);
});
test('browser randomness rejects byte 255, fails closed without RNG, and has no seed fallback', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis,'crypto');
  let calls = 0;
  try {
    Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(out){out[0] = calls++ === 0 ? 255 : 254;return out;}}});
    assert.equal(randomField(),16); assert.equal(calls,2);
    Object.defineProperty(globalThis,'crypto',{configurable:true,value:undefined});
    assert.throws(() => randomField(), /secure random/);
  } finally { if (descriptor) Object.defineProperty(globalThis,'crypto',descriptor); else delete globalThis.crypto; }
});
const policies = [
  {ids:[0,3,5],threshold:2}, {ids:[0,1,2,3,4],threshold:3},
  {ids:[0,1,3,4,5],threshold:3}, {ids:[0,1,3,4,5],threshold:3},
  {ids:[0,1,3,4,5,6],threshold:4}, {ids:[0,2,3,4,6],threshold:3},
];
test('all six chapters have independently checked winning policies and failing starts', () => {
  CAMPAIGN.forEach((mission,i) => {
    const policy = policies[i];
    for (const e of mission.events) {
      const affected = e.affected ? policy.ids.filter(id => e.affected.includes(id)).length : e.count;
      assert(e.kind === 'theft' ? affected < policy.threshold : mission.seats - affected >= policy.threshold);
    }
    assert(assess(mission, policy.ids, policy.threshold).pass);
    assert(!assess(mission, mission.initial, mission.initialThreshold).pass);
    assert(solutions(mission).length > 0);
  });
  assert.equal(assess(CAMPAIGN[0],[0,0,0],2).valid,false);
  assert.equal(assess(CAMPAIGN[0],[0,1],2).valid,false);
});
test('daily scenario is deterministic, varies, and stays solvable through a full year', () => {
  const seen = new Set();
  for (let day = 0; day < 366; day++) {
    const date = new Date(Date.UTC(2026,0,1+day)).toISOString().slice(0,10);
    const mission = dailyMission(date);
    assert.deepEqual(mission,dailyMission(date)); assert.equal(solutions(mission).length,7);
    assert(!assess(mission,mission.initial,mission.initialThreshold).pass);
    mission.events.forEach(e => { e.affected.forEach(id => assert(e.description.includes(MEMBERS[id].name))); });
    seen.add(JSON.stringify(mission.events.map(e=>e.affected)));
  }
  assert(seen.size > 300);
  assert.throws(() => dailyMission('not-a-date')); assert.throws(() => dailyMission('2026-02-31'));
});
