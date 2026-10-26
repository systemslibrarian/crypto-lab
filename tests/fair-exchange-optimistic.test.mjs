import test from 'node:test';
import assert from 'node:assert/strict';
import nodeCrypto from 'node:crypto';
import {
  ASW_GROUP,ASW_PROTOCOL,ASW_ROUNDS,createOptimisticExchange,createVerifiableEscrow,
  decryptVerifiableEscrow,generateEscrowKeyPair,internalsForTests,optimisticAct,
  optimisticVerdict,optimisticView,recoverSchnorr,reduceSchnorr,schnorrKeyFromSecret,
  schnorrSign,setIntermediaryAvailable,verifyReduction,verifySchnorr,verifyVerifiableEscrow
} from '../learn/fair-exchange/optimistic.mjs';

const {p,q,g}=internalsForTests;
const RFC7919_FFDHE2048_P=[
 'FFFFFFFFFFFFFFFFADF85458A2BB4A9AAFDC5620273D3CF1',
 'D8B9C583CE2D3695A9E13641146433FBCC939DCE249B3EF9',
 '7D2FE363630C75D8F681B202AEC4617AD3DF1ED5D5FD6561',
 '2433F51F5F066ED0856365553DED1AF3B557135E7F57C935',
 '984F0C70E0E68B77E2A689DAF3EFE8721DF158A136ADE735',
 '30ACCA4F483A797ABC0AB182B324FB61D108A94BB2C8E3FB',
 'B96ADAB760D7F4681D4F42A3DE394DF4AE56EDE76372BB19',
 '0B07A7C8EE0A6D709E02FCE1CDF7E2ECC03404CD28342F61',
 '9172FE9CE98583FF8E4F1232EEF28183C3FE3B1B4C6FAD73',
 '3BB5FCBC2EC22005C58EF1837D1683B2C6F34A26C1B2EFFA',
 '886B423861285C97FFFFFFFFFFFFFFFF'
].join('');
const fixedHex=(number,length=256)=>number.toString(16).padStart(length*2,'0');
function oraclePow(base,exponent,modulus){let result=1n;base%=modulus;while(exponent){if(exponent&1n)result=result*base%modulus;base=base*base%modulus;exponent>>=1n;}return result;}
function oracleChallenge(message,commitment){
 const domain=Buffer.from('crypto-lab-asw-schnorr-challenge-v1');
 const parts=[Buffer.from(fixedHex(commitment),'hex'),Buffer.from(message)];
 const framed=[domain];for(const part of parts){const length=Buffer.alloc(4);length.writeUInt32BE(part.length);framed.push(length,part);}
 return BigInt('0x'+nodeCrypto.createHash('sha256').update(Buffer.concat(framed)).digest('hex'))%q;
}
const flipHex=value=>(value[0]==='0'?'1':'0')+value.slice(1);

let escrowKeys;
test.before(async()=>{escrowKeys=await generateEscrowKeyPair();});

test('ASW Schnorr reduction matches an independent fixed computation',async()=>{
 assert.equal(ASW_PROTOCOL,'Asokan–Shoup–Waidner Protocol E (expanded 1999 report)');
 assert.equal(ASW_GROUP.p.toUpperCase(),RFC7919_FFDHE2048_P);
 assert.equal((p-1n)/2n,q);assert.equal(oraclePow(g,q,p),1n);assert.notEqual(g,1n);
 assert.equal(BigInt('0x'+ASW_GROUP.p),p);assert.equal(BigInt('0x'+ASW_GROUP.q),q);
 const secret=5n,nonce=7n,key=schnorrKeyFromSecret(secret),signature=await schnorrSign('fixed ASW vector',key,nonce);
 const commitment=oraclePow(g,nonce,p),challenge=oracleChallenge('fixed ASW vector',commitment);
 assert.equal(signature.c,fixedHex(challenge,32));
 assert.equal(signature.z,fixedHex((nonce+challenge*secret)%q));
 assert.equal(await verifySchnorr(key.publicKey,'fixed ASW vector',signature),true);
 assert.equal(await verifySchnorr(key.publicKey,'changed message',signature),false);
 assert.equal(await verifySchnorr(key.publicKey,'fixed ASW vector',{...signature,c:flipHex(signature.c)}),false);
 const reduced=await reduceSchnorr(key.publicKey,'fixed ASW vector',signature);
 assert.equal(reduced.promise.d,fixedHex(oraclePow(g,BigInt('0x'+signature.z),p)));
 assert.equal(await verifyReduction(key.publicKey,'fixed ASW vector',reduced.promise),true);
 assert.equal(await verifyReduction(key.publicKey,'changed message',reduced.promise),false);
 assert.deepEqual(await recoverSchnorr(key.publicKey,'fixed ASW vector',reduced.promise,reduced.inverse),signature);
 assert.equal(await recoverSchnorr(key.publicKey,'fixed ASW vector',reduced.promise,flipHex(reduced.inverse)),null);
 assert.equal(await recoverSchnorr(key.publicKey,'fixed ASW vector',{...reduced.promise,c:flipHex(reduced.promise.c)},reduced.inverse),null);
});

test('Protocol D verifies both branches, binds its condition, and decrypts the promised inverse',async()=>{
 const bob=schnorrKeyFromSecret(17n),signature=await schnorrSign('Bob signs',bob,19n);
 const reduced=await reduceSchnorr(bob.publicKey,'Bob signs',signature);
 const condition=['test-condition','transaction-7',bob.publicKey,reduced.promise.d];
 const challenge=[0,1,0,1,1,0,1,0];
 const proof=await createVerifiableEscrow(escrowKeys.publicKey,reduced.inverse,reduced.promise,condition,{rounds:8,challenge});
 assert.equal(proof.challenge.join(''),challenge.join(''));
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,reduced.promise,condition,proof),true);
 assert.equal(await decryptVerifiableEscrow(escrowKeys.privateKey,escrowKeys.publicKey,reduced.promise,condition,proof),reduced.inverse);
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,reduced.promise,[...condition,'changed'],proof),false);
 await assert.rejects(()=>decryptVerifiableEscrow(escrowKeys.privateKey,escrowKeys.publicKey,reduced.promise,[...condition,'changed'],proof),/did not pass Protocol D/);
 const wrongCommitment=structuredClone(proof);wrongCommitment.commitment=flipHex(wrongCommitment.commitment);
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,reduced.promise,condition,wrongCommitment),false);
 const wrongOpening=structuredClone(proof);wrongOpening.responses[0].opening=flipHex(wrongOpening.responses[0].opening);
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,reduced.promise,condition,wrongOpening),false);
 const wrongShift=structuredClone(proof);wrongShift.responses[1].shifted=flipHex(wrongShift.responses[1].shifted);
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,reduced.promise,condition,wrongShift),false);
 const changedChallenge=structuredClone(proof);changedChallenge.challenge[0]=1;
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,reduced.promise,condition,changedChallenge),false);
 const allOneProof=await createVerifiableEscrow(escrowKeys.publicKey,reduced.inverse,reduced.promise,condition,{rounds:4,challenge:[1,1,1,1]});
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,reduced.promise,condition,allOneProof),true);
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,reduced.promise,[...condition,'changed'],allOneProof),false);
 await assert.rejects(()=>createVerifiableEscrow(escrowKeys.publicKey,reduced.inverse,reduced.promise,condition,{rounds:4,challenge:[0,0,0,0]}),/nonzero bit vector/);
});

test('the ASW honest path produces two independently usable signatures with zero intermediary contacts',async()=>{
 const session=await createOptimisticExchange({rounds:8,escrowKeys});
 const before=optimisticView(session);
 assert.equal(before.intermediary.contacts,0);assert.equal(before.alice.usablePeerSignature,false);assert.equal(before.bob.usablePeerSignature,false);
 assert.equal(before.alice.promise,'verified');assert.equal(before.proof.verified,true);
 assert.match(before.bob.escrow,/not publicly verifiable/);
 await optimisticAct(session,'send-alice');
 assert.equal(await verifySchnorr(session.alice.publicKey,session.messages.alice,session.bob.usablePeerSignature),true);
 assert.equal(optimisticVerdict(session).title,'Temporarily one-sided — resolution remains available');
 await optimisticAct(session,'send-bob');
 assert.equal(await verifySchnorr(session.bob.publicKey,session.messages.bob,session.alice.usablePeerSignature),true);
 assert.equal(optimisticView(session).intermediary.contacts,0);
 assert.equal(optimisticVerdict(session).title,'Fair completion — both signatures usable');
});

test('abort first and B-resolve first give compatible opposite race outcomes',async()=>{
 const aborted=await createOptimisticExchange({rounds:8,escrowKeys});
 await optimisticAct(aborted,'abort');await optimisticAct(aborted,'b-resolve');
 assert.deepEqual(optimisticView(aborted).intermediary.records,['ABORT']);
 assert.equal(aborted.alice.usablePeerSignature,null);assert.equal(aborted.bob.usablePeerSignature,null);
 assert.equal(aborted.lastOutcome,'b-resolve-refused-abort');
 assert.equal(optimisticVerdict(aborted).title,'Compatible abort — neither signature usable');

 const resolved=await createOptimisticExchange({rounds:8,escrowKeys});
 await optimisticAct(resolved,'b-resolve');
 assert.equal(Boolean(resolved.bob.usablePeerSignature),true);assert.equal(resolved.alice.usablePeerSignature,null);
 assert.deepEqual(optimisticView(resolved).intermediary.records,['DEPOSIT']);
 await optimisticAct(resolved,'abort');
 assert.equal(await verifySchnorr(resolved.bob.publicKey,resolved.messages.bob,resolved.alice.usablePeerSignature),true);
 assert.deepEqual(optimisticView(resolved).intermediary.records,['DEPOSIT']);
 assert.equal(resolved.lastOutcome,'abort-returned-deposit');
 assert.equal(optimisticVerdict(resolved).tone,'good');
});

test('A-resolve records NO-ABORT with recovery and leaves Bob a compatible resolution',async()=>{
 const session=await createOptimisticExchange({rounds:8,escrowKeys});
 await optimisticAct(session,'send-alice');
 await assert.rejects(()=>optimisticAct(session,'abort'),/honest schedule uses A-resolve/);
 assert.deepEqual(optimisticView(session).intermediary.records,[]);
 await optimisticAct(session,'a-resolve');
 assert.deepEqual(optimisticView(session).intermediary.records,['NO-ABORT']);
 assert.equal(await verifySchnorr(session.bob.publicKey,session.messages.bob,session.alice.usablePeerSignature),true);
 await optimisticAct(session,'b-resolve');
 assert.deepEqual(optimisticView(session).intermediary.records,['NO-ABORT','DEPOSIT']);
 assert.equal(await verifySchnorr(session.alice.publicKey,session.messages.alice,session.bob.usablePeerSignature),true);
 await optimisticAct(session,'abort');assert.equal(session.lastOutcome,'abort-refused-no-abort');
 assert.equal(optimisticVerdict(session).tone,'good');
});

test('A-resolve persists NO-ABORT before a later escrow error, as Protocol E specifies',async()=>{
 const session=await createOptimisticExchange({rounds:8,escrowKeys});
 session.beta.commitment=flipHex(session.beta.commitment);
 await assert.rejects(()=>optimisticAct(session,'a-resolve'),/did not pass Protocol D/);
 assert.deepEqual(optimisticView(session).intermediary.records,['NO-ABORT']);
 assert.equal(session.alice.usablePeerSignature,null);assert.equal(session.bob.usablePeerSignature,null);
 await optimisticAct(session,'abort');assert.equal(session.lastOutcome,'abort-refused-no-abort');
 assert.deepEqual(optimisticView(session).intermediary.records,['NO-ABORT']);
});

test('unavailable intermediary changes no durable record and retry remains possible',async()=>{
 const session=await createOptimisticExchange({rounds:8,escrowKeys});
 setIntermediaryAvailable(session,false);await optimisticAct(session,'b-resolve');
 let view=optimisticView(session);assert.equal(view.intermediary.attempts,1);assert.equal(view.intermediary.contacts,0);assert.deepEqual(view.intermediary.records,[]);
 assert.equal(optimisticVerdict(session).title,'Termination waits for intermediary availability');
 setIntermediaryAvailable(session,true);await optimisticAct(session,'b-resolve');
 view=optimisticView(session);assert.equal(view.intermediary.contacts,1);assert.deepEqual(view.intermediary.records,['DEPOSIT']);
});

test('only Alice’s transaction preimage authorizes abort and A-resolve',async()=>{
 const abortSession=await createOptimisticExchange({rounds:8,escrowKeys});
 abortSession.secrets.preimage=flipHex(abortSession.secrets.preimage);
 await assert.rejects(()=>optimisticAct(abortSession,'abort'),/preimage for this transaction/);
 assert.deepEqual(optimisticView(abortSession).intermediary.records,[]);
 const resolveSession=await createOptimisticExchange({rounds:8,escrowKeys});
 resolveSession.secrets.preimage=flipHex(resolveSession.secrets.preimage);
 await assert.rejects(()=>optimisticAct(resolveSession,'a-resolve'),/preimage for this transaction/);
 assert.deepEqual(optimisticView(resolveSession).intermediary.records,[]);assert.equal(resolveSession.alice.usablePeerSignature,null);
});

test('erasing a durable deposit permits the exact one-sided failure the assumption prevents',async()=>{
 const session=await createOptimisticExchange({rounds:8,escrowKeys});
 await optimisticAct(session,'b-resolve');await optimisticAct(session,'forget-state');await optimisticAct(session,'abort');
 assert.equal(session.intermediary.durable,false);assert.equal(Boolean(session.bob.usablePeerSignature),true);assert.equal(session.alice.usablePeerSignature,null);
 assert.deepEqual(optimisticView(session).intermediary.records,['ABORT']);
 assert.equal(optimisticVerdict(session).title,'Fairness lost when durable state is erased');
});

test('OAEP conditions bind both escrows to the actual transaction and Alice ciphertext',async()=>{
 const session=await createOptimisticExchange({rounds:8,escrowKeys});
 const originalCondition=internalsForTests.betaCondition(session);
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,session.bob.promise,originalCondition,session.beta),true);
 session.alpha.ciphertext=flipHex(session.alpha.ciphertext);
 const changedCondition=internalsForTests.betaCondition(session);
 assert.notDeepEqual(changedCondition,originalCondition);
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,session.bob.promise,changedCondition,session.beta),false);
 await assert.rejects(()=>optimisticAct(session,'b-resolve'),/decrypt|operation-specific|data provided|ciphertext/i);
 assert.equal(session.intermediary.ledger.deposit,null);
 assert.equal(session.bob.usablePeerSignature,null);
});

test('intermediary requests serialize and the public view excludes private recovery material',async()=>{
 const session=await createOptimisticExchange({rounds:8,escrowKeys});
 const [first,second]=await Promise.allSettled([optimisticAct(session,'b-resolve'),optimisticAct(session,'abort')]);
 assert.equal(first.status,'fulfilled');assert.equal(second.status,'rejected');assert.match(second.reason.message,/in progress/);
 assert.equal(session.intermediary.contacts,1);
 const publicJson=JSON.stringify(optimisticView(session));
 assert.doesNotMatch(publicJson,new RegExp(session.secrets.preimage));
 assert.doesNotMatch(publicJson,new RegExp(session.secrets.bobInverse));
 assert.doesNotMatch(publicJson,/privateKey|secret/);
});

test('the learner route uses the declared 16-round nonzero current-run proof',async()=>{
 const session=await createOptimisticExchange({escrowKeys});
 assert.equal(ASW_ROUNDS,16);assert.equal(session.beta.rounds,16);assert.equal(session.beta.challenge.length,16);assert.equal(session.beta.challenge.some(Boolean),true);
 assert.equal(session.beta.verified,true);
 assert.equal(await verifyVerifiableEscrow(escrowKeys.publicKey,session.bob.promise,internalsForTests.betaCondition(session),session.beta),true);
});
