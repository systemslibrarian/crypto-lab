#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const sourcePath=path.join(here,'optimistic.mjs');
const testPath=path.join(root,'tests/fair-exchange-optimistic.test.mjs');
const original=fs.readFileSync(sourcePath,'utf8');
let restored=false;

function restore(){if(!restored)fs.writeFileSync(sourcePath,original);restored=true;}
process.on('exit',restore);
process.on('SIGINT',()=>{restore();process.exit(130);});
process.on('SIGTERM',()=>{restore();process.exit(143);});
const runTests=()=>spawnSync(process.execPath,['--test',testPath],{cwd:root,encoding:'utf8'});

const baseline=runTests();
if(baseline.status!==0){restore();process.stdout.write(baseline.stdout);process.stderr.write(baseline.stderr);throw new Error('baseline: unmutated optimistic fair-exchange tests FAILED');}
console.log('baseline: unmutated optimistic fair-exchange tests PASSED');

const mutations=[
 {name:'Schnorr verification accepts every challenge',owner:'ASW Schnorr reduction matches an independent fixed computation',from:'    const commitment = divideElements(modPow(G, z, P), modPow(publicKey, c, P));\n    return c === await challengeFor(message, commitment);',to:'    const commitment = divideElements(modPow(G, z, P), modPow(publicKey, c, P));\n    return true;'},
 {name:'signature recovery skips independent signature verification',owner:'ASW Schnorr reduction matches an independent fixed computation',from:'    return await verifySchnorr(publicKey, message, signature) ? signature : null;',to:'    return signature;'},
 {name:'Protocol D accepts a different escrow condition',owner:'Protocol D verifies both branches, binds its condition',from:'    if (proof.conditionHash !== await conditionHash(condition)) return false;',to:'    if (false && proof.conditionHash !== await conditionHash(condition)) return false;'},
 {name:'Protocol D ignores its aggregate commitment',owner:'Protocol D verifies both branches, binds its condition',from:'    return proof.commitment === await aggregateCommitment(commitments);',to:'    return true;'},
 {name:'the all-zero verifier challenge is admitted',owner:'Protocol D verifies both branches, binds its condition',from:"  if (!Array.isArray(challenge) || challenge.length !== rounds || challenge.some(bit => bit !== 0 && bit !== 1) || !challenge.some(Boolean)) throw new Error('Challenge must be a nonzero bit vector of the declared length');",to:"  if (!Array.isArray(challenge) || challenge.length !== rounds || challenge.some(bit => bit !== 0 && bit !== 1)) throw new Error('Challenge must be a bit vector of the declared length');"},
 {name:'the honest path starts with a fictitious TTP contact',owner:'the ASW honest path produces two independently usable signatures',from:'    intermediary:{available:true, attempts:0, contacts:0, durable:true, ledger:emptyLedger()},',to:'    intermediary:{available:true, attempts:0, contacts:1, durable:true, ledger:emptyLedger()},'},
 {name:'abort overrides an existing NO-ABORT record',owner:'A-resolve records NO-ABORT with recovery',from:'    if (ledger.noAbort) {',to:'    if (false && ledger.noAbort) {'},
 {name:'Alice aborts after sending E4 instead of using A-resolve',owner:'A-resolve records NO-ABORT with recovery',from:"  if (session.intermediary.durable && session.bob.usablePeerSignature && !session.intermediary.ledger.deposit) throw new Error('After Alice sends E4 directly, the honest schedule uses A-resolve rather than abort');",to:"  if (false && session.intermediary.durable && session.bob.usablePeerSignature && !session.intermediary.ledger.deposit) throw new Error('After Alice sends E4 directly, the honest schedule uses A-resolve rather than abort');"},
 {name:'abort discards an earlier matching deposit',owner:'abort first and B-resolve first give compatible opposite race outcomes',from:'    if (ledger.deposit && ledger.deposit.d === session.bob.promise.d) {',to:'    if (false && ledger.deposit && ledger.deposit.d === session.bob.promise.d) {'},
 {name:'B-resolve ignores a prior ABORT',owner:'abort first and B-resolve first give compatible opposite race outcomes',from:'    if (ledger.abort) {\n      session.lastOutcome = \'b-resolve-refused-abort\';',to:'    if (false && ledger.abort) {\n      session.lastOutcome = \'b-resolve-refused-abort\';'},
 {name:'A-resolve fails to persist NO-ABORT',owner:'A-resolve records NO-ABORT with recovery',from:'    ledger.noAbort = true;',to:'    ledger.noAbort = false;'},
 {name:'an unavailable TTP still processes the request',owner:'unavailable intermediary changes no durable record',from:'  if (!session.intermediary.available) {',to:'  if (false && !session.intermediary.available) {'},
 {name:'Alice’s abort and resolve requests skip the transaction preimage check',owner:'only Alice’s transaction preimage authorizes abort and A-resolve',from:"  if (await transactionId(unhex(session.secrets.preimage)) !== session.transaction) throw new Error('Alice did not supply the preimage for this transaction');",to:'  return true;'},
 {name:'the lost-state control still claims durable storage',owner:'erasing a durable deposit permits the exact one-sided failure',from:'    session.intermediary.durable = false;',to:'    session.intermediary.durable = true;'},
 {name:'Bob’s verifiable escrow drops Alice’s ciphertext from its condition',owner:'OAEP conditions bind both escrows to the actual transaction',from:"  return ['asw-e-beta-v1', session.transaction, session.alpha.ciphertext, session.alice.publicKey, session.messages.alice, THETA, session.bob.promise.d];",to:"  return ['asw-e-beta-v1', session.transaction, session.alice.publicKey, session.messages.alice, THETA, session.bob.promise.d];"},
 {name:'concurrent requests bypass the session lock',owner:'intermediary requests serialize',from:"  if (session.busy) throw new Error('Another optimistic-exchange action is in progress');",to:"  if (false && session.busy) throw new Error('Another optimistic-exchange action is in progress');"}
];

let caught=0;
try{
 for(const mutation of mutations){
  const occurrences=original.split(mutation.from).length-1;
  if(occurrences!==1)throw new Error(`${mutation.name}: expected one source match, found ${occurrences}`);
  const changed=original.replace(mutation.from,mutation.to);
  if(changed===original)throw new Error(`${mutation.name}: mutation did not change the source`);
  fs.writeFileSync(sourcePath,changed);restored=false;
  const result=runTests();restore();
  const output=`${result.stdout}\n${result.stderr}`;
  if(result.status===0)throw new Error(`${mutation.name}: SURVIVED`);
  if(!output.includes(mutation.owner))throw new Error(`${mutation.name}: failed, but not in its owning test\n${output}`);
  caught++;console.log(`caught ${caught}/${mutations.length}: ${mutation.name}`);
 }
}finally{restore();}
if(fs.readFileSync(sourcePath,'utf8')!==original)throw new Error('optimistic.mjs was not restored byte for byte');
console.log(`all ${caught} mutation(s) caught`);
