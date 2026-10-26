#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sourcePath = path.join(here, 'core.mjs');
const testPath = path.join(root, 'tests/protocol-workshops.test.mjs');
const original = fs.readFileSync(sourcePath, 'utf8');
let restored = false;

function restore() {
  if (!restored) fs.writeFileSync(sourcePath, original);
  restored = true;
}

process.on('exit', restore);
process.on('SIGINT', () => { restore(); process.exit(130); });
process.on('SIGTERM', () => { restore(); process.exit(143); });

function runTests() {
  return spawnSync(process.execPath, ['--test', testPath], {cwd: root, encoding: 'utf8'});
}

const baseline = runTests();
if (baseline.status !== 0) {
  restore();
  process.stdout.write(baseline.stdout);
  process.stderr.write(baseline.stderr);
  throw new Error('baseline: unmutated timestamping tests FAILED');
}
console.log('baseline: unmutated timestamping tests PASSED');

const mutations = [
  {
    name: 'leaf domain separation changes',
    owner: 'the bounded Merkle batch matches an independent root',
    from: "const leafHash = document => digest(JSON.stringify(['crypto-lab-ers-leaf-v1', document]));",
    to: "const leafHash = document => digest(JSON.stringify(['crypto-lab-ers-leaf-v0', document]));"
  },
  {
    name: 'left siblings are placed on the wrong side',
    owner: 'the bounded Merkle batch matches an independent root',
    from: "value = step.side === 'left' ? await nodeHash(step.hash, value) : await nodeHash(value, step.hash);",
    to: "value = await nodeHash(value, step.hash);"
  },
  {
    name: 'signed root equality is bypassed',
    owner: 'one signed root authenticates each inclusion',
    from: "const root = Boolean(batch?.token && batch.token.imprint === batch.root);",
    to: "const root = Boolean(batch?.token);"
  },
  {
    name: 'renewal stops covering the old signature',
    owner: 'timely renewal covers the actual old token',
    from: "  token.epoch,\n  token.signature\n]);",
    to: "  token.epoch,\n  ''\n]);"
  },
  {
    name: 'the exact cutoff becomes timely',
    owner: 'unrenewed and late records fail after cutoff',
    from: "const timely = renewalTime < oldTrustUntil;",
    to: "const timely = renewalTime <= oldTrustUntil;"
  },
  {
    name: 'the trusted-time premise is silently granted',
    owner: 'unrenewed and late records fail after cutoff',
    from: "const trustedTimeModel = timeline.trustedTimeModel === true;",
    to: "const trustedTimeModel = true;"
  },
  {
    name: 'late renewal is accepted',
    owner: 'unrenewed and late records fail after cutoff',
    from: "const valid = original.valid && originalInEpoch && renewalValid && chronology && timely && renewalInSuccessorEpoch && successorCurrent && trustedTimeModel;",
    to: "const valid = original.valid && originalInEpoch && renewalValid && chronology && renewalInSuccessorEpoch && successorCurrent && trustedTimeModel;"
  },
  {
    name: 'an expired successor is treated as current',
    owner: 'unrenewed and late records fail after cutoff',
    from: "const successorCurrent = evaluationTime < successorTrustUntil;",
    to: "const successorCurrent = true;"
  },
  {
    name: 'timestamps before the old epoch are admitted',
    owner: 'unrenewed and late records fail after cutoff',
    from: "const originalInEpoch = oldValidFrom <= originalTime && originalTime < oldTrustUntil && originalTime <= evaluationTime;",
    to: "const originalInEpoch = originalTime < oldTrustUntil && originalTime <= evaluationTime;"
  }
];

let caught = 0;
try {
  for (const mutation of mutations) {
    const occurrences = original.split(mutation.from).length - 1;
    if (occurrences !== 1) throw new Error(`${mutation.name}: expected one source match, found ${occurrences}`);
    const changed = original.replace(mutation.from, mutation.to);
    if (changed === original) throw new Error(`${mutation.name}: mutation did not change the source`);
    fs.writeFileSync(sourcePath, changed);
    restored = false;
    const result = runTests();
    restore();
    const output = `${result.stdout}\n${result.stderr}`;
    if (result.status === 0) throw new Error(`${mutation.name}: SURVIVED`);
    if (!output.includes(mutation.owner)) throw new Error(`${mutation.name}: failed, but not in its owning test\n${output}`);
    caught++;
    console.log(`caught ${caught}/${mutations.length}: ${mutation.name}`);
  }
} finally {
  restore();
}

if (fs.readFileSync(sourcePath, 'utf8') !== original) throw new Error('core.mjs was not restored byte for byte');
console.log(`all ${caught} mutation(s) caught`);
