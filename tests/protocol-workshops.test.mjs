import test from 'node:test';import assert from 'node:assert/strict';
import {digest,signingKey,randomId} from '../learn/shared/crypto.mjs';
import {
 issueStamp,checkStamp,makeChain,checkChain,makeMerkleBatch,verifyMerkleProof,
 issueBatchStamp,verifyBatchDocument,renewTimestamp,assessArchiveEvidence
} from '../learn/timestamping/core.mjs';
import {createExchange,act,inspectPacket,verdict,scenarios} from '../learn/fair-exchange/core.mjs';
test('SHA-256 known answer',async()=>assert.equal(await digest('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'));
test('timestamp verifies signature, document and nonce separately; signed time is not trusted time',async()=>{
 const keys=await signingKey(),nonce=randomId(),token=await issueStamp(keys.privateKey,'proposal',nonce,'1990-01-01T00:00:00.000Z');
 assert.deepEqual(await checkStamp(keys.publicKey,token,'proposal',nonce),{signature:true,imprint:true,nonce:true,trustedTime:false});
 const changed=await checkStamp(keys.publicKey,token,'proposal revised',nonce);assert.equal(changed.signature,true);assert.equal(changed.imprint,false);
 assert.equal((await checkStamp(keys.publicKey,{...token,time:'2026-01-01T00:00:00Z'},'proposal',nonce)).signature,false);
 assert.equal((await checkStamp(keys.publicKey,token,'proposal',randomId())).nonce,false);
 const wrong=await signingKey();assert.equal((await checkStamp(wrong.publicKey,token,'proposal',nonce)).signature,false);
 assert.equal((await checkStamp(keys.publicKey,{...token,signature:'bad'},'proposal',nonce)).signature,false);
});
test('a full internally consistent rewrite still fails the previously pinned checkpoint',async()=>{
 const docs=['one','two','three'],entries=await makeChain(docs),anchor=entries.at(-1).hash;
 assert.deepEqual(await checkChain(entries,docs,anchor),{links:true,anchor:true});
 docs[0]='forged';assert.deepEqual(await checkChain(entries,docs,anchor),{links:false,anchor:true});
 const rewritten=await makeChain(docs);assert.deepEqual(await checkChain(rewritten,docs,anchor),{links:true,anchor:false});
 assert.equal((await checkChain(rewritten.slice(0,2),docs,anchor)).links,false);
});
async function oracleHash(value){return Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))).toString('hex');}
async function oracleMerkleRoot(documents){
 let level=await Promise.all(documents.map(document=>oracleHash(JSON.stringify(['crypto-lab-ers-leaf-v1',document]))));
 while(level.length>1){const next=[];for(let i=0;i<level.length;i+=2)next.push(await oracleHash(JSON.stringify(['crypto-lab-ers-node-v1',level[i],level[i+1]])));level=next;}
 return level[0];
}
test('the bounded Merkle batch matches an independent root and every reduced proof',async()=>{
 const documents=['Proposal','Review','Approval','Publication'];
 const batch=await makeMerkleBatch(documents);
 assert.equal(batch.root,await oracleMerkleRoot(documents));
 assert.equal(batch.proofs.length,4);assert.ok(batch.proofs.every(proof=>proof.length===2));
 for(let i=0;i<documents.length;i++)assert.equal(await verifyMerkleProof(documents[i],batch.proofs[i],batch.root),true);
 assert.equal(await verifyMerkleProof('Proposal changed',batch.proofs[0],batch.root),false);
 const wrongPath=structuredClone(batch.proofs[0]);wrongPath[0].side='left';
 assert.equal(await verifyMerkleProof(documents[0],wrongPath,batch.root),false);
 const wrongHash=structuredClone(batch.proofs[0]);wrongHash[0].hash=(wrongHash[0].hash[0]==='0'?'1':'0')+wrongHash[0].hash.slice(1);
 assert.equal(await verifyMerkleProof(documents[0],wrongHash,batch.root),false);
 const wrongRoot=(batch.root[0]==='0'?'1':'0')+batch.root.slice(1);
 assert.equal(await verifyMerkleProof(documents[0],batch.proofs[0],wrongRoot),false);
 await assert.rejects(()=>makeMerkleBatch([]),/2, 4, or 8/);
 await assert.rejects(()=>makeMerkleBatch(['one','two','three']),/2, 4, or 8/);
 await assert.rejects(()=>makeMerkleBatch(['one',2]),/must be text/);
});
test('one signed root authenticates each inclusion while path and root failures remain separate',async()=>{
 const keys=await signingKey(),documents=['Proposal','Review','Approval','Publication'],nonce=randomId();
 const batch=await issueBatchStamp(keys.privateKey,documents,nonce,'2029-06-01T12:00:00.000Z','tsa-epoch-1');
 for(let i=0;i<documents.length;i++)assert.deepEqual(await verifyBatchDocument(keys.publicKey,batch,i,documents[i],nonce),{signature:true,root:true,nonce:true,inclusion:true,valid:true,trustedTime:false});
 const wrongPath=structuredClone(batch);wrongPath.proofs[1][0].hash=(wrongPath.proofs[1][0].hash[0]==='0'?'1':'0')+wrongPath.proofs[1][0].hash.slice(1);
 assert.deepEqual(await verifyBatchDocument(keys.publicKey,wrongPath,1,documents[1],nonce),{signature:true,root:true,nonce:true,inclusion:false,valid:false,trustedTime:false});
 const wrongRoot=structuredClone(batch);wrongRoot.root=(wrongRoot.root[0]==='0'?'1':'0')+wrongRoot.root.slice(1);
 const rootResult=await verifyBatchDocument(keys.publicKey,wrongRoot,0,documents[0],nonce);
 assert.equal(rootResult.signature,true);assert.equal(rootResult.root,false);assert.equal(rootResult.inclusion,false);assert.equal(rootResult.valid,false);
 assert.equal((await verifyBatchDocument(keys.publicKey,batch,0,documents[0],randomId())).nonce,false);
});
const renewalTimeline={
 oldValidFrom:'2029-01-01T00:00:00.000Z',oldTrustUntil:'2030-01-01T00:00:00.000Z',
 successorValidFrom:'2029-10-01T00:00:00.000Z',successorTrustUntil:'2035-01-01T00:00:00.000Z',
 evaluationTime:'2031-01-01T00:00:00.000Z',trustedTimeModel:true
};
async function renewalFixture(){
 const oldKeys=await signingKey(),successorKeys=await signingKey();
 const documents=['Proposal','Review','Approval','Publication'];
 const originalNonce=randomId(),renewalNonce=randomId();
 const batch=await issueBatchStamp(oldKeys.privateKey,documents,originalNonce,'2029-06-01T12:00:00.000Z','tsa-epoch-1');
 return {oldKeys,successorKeys,documents,originalNonce,renewalNonce,batch};
}
function assessArgs(fixture,overrides={}){return {
 oldPublicKey:fixture.oldKeys.publicKey,successorPublicKey:fixture.successorKeys.publicKey,
 batch:fixture.batch,document:fixture.documents[0],index:0,originalNonce:fixture.originalNonce,
 renewalNonce:fixture.renewalNonce,timeline:renewalTimeline,...overrides
};}
test('timely renewal covers the actual old token and preserves evidence past the old epoch',async()=>{
 const fixture=await renewalFixture();
 const renewal=await renewTimestamp(fixture.successorKeys.privateKey,fixture.batch.token,fixture.renewalNonce,'2029-12-01T12:00:00.000Z','tsa-epoch-2');
 const result=await assessArchiveEvidence(assessArgs(fixture,{renewal}));
 assert.equal(result.valid,true);assert.equal(result.reason,'accepted-renewed');
 assert.deepEqual({signature:result.renewal.signature,imprint:result.renewal.imprint,nonce:result.renewal.nonce},{signature:true,imprint:true,nonce:true});
 assert.equal(result.original.valid,true);assert.equal(result.timely,true);assert.equal(result.chronology,true);assert.equal(result.successorCurrent,true);
 const changed=structuredClone(fixture.batch);changed.token.time='2029-06-02T12:00:00.000Z';
 const tampered=await assessArchiveEvidence(assessArgs(fixture,{batch:changed,renewal}));
 assert.equal(tampered.valid,false);assert.equal(tampered.reason,'original-invalid');assert.equal(tampered.original.signature,false);
 const changedSignature=structuredClone(fixture.batch);changedSignature.token.signature=(changedSignature.token.signature[0]==='0'?'1':'0')+changedSignature.token.signature.slice(1);
 const rebound=await assessArchiveEvidence(assessArgs(fixture,{batch:changedSignature,renewal}));
 assert.equal(rebound.valid,false);assert.equal(rebound.original.signature,false);assert.equal(rebound.renewal.imprint,false,'the successor imprint covers the old signature bytes too');
 const changedRenewal={...renewal,imprint:'0'.repeat(64)};
 const badRenewal=await assessArchiveEvidence(assessArgs(fixture,{renewal:changedRenewal}));
 assert.equal(badRenewal.valid,false);assert.equal(badRenewal.reason,'renewal-invalid');assert.equal(badRenewal.renewal.signature,false);
 const unrelatedSuccessor=await signingKey();
 const wrongKey=await assessArchiveEvidence(assessArgs(fixture,{successorPublicKey:unrelatedSuccessor.publicKey,renewal}));
 assert.equal(wrongKey.valid,false);assert.equal(wrongKey.reason,'renewal-invalid');assert.equal(wrongKey.renewal.signature,false);
 const wrongNonce=await assessArchiveEvidence(assessArgs(fixture,{renewal,renewalNonce:randomId()}));
 assert.equal(wrongNonce.valid,false);assert.equal(wrongNonce.reason,'renewal-invalid');assert.equal(wrongNonce.renewal.nonce,false);
});
test('unrenewed and late records fail after cutoff even when their cryptographic checks pass',async()=>{
 const fixture=await renewalFixture();
 const unrenewed=await assessArchiveEvidence(assessArgs(fixture));
 assert.equal(unrenewed.valid,false);assert.equal(unrenewed.reason,'unrenewed-expired');assert.equal(unrenewed.original.valid,true);
 const late=await renewTimestamp(fixture.successorKeys.privateKey,fixture.batch.token,fixture.renewalNonce,'2030-02-01T12:00:00.000Z','tsa-epoch-2');
 const lateResult=await assessArchiveEvidence(assessArgs(fixture,{renewal:late}));
 assert.equal(lateResult.valid,false);assert.equal(lateResult.reason,'late-renewal');assert.equal(lateResult.timely,false);
 assert.deepEqual({old:lateResult.original.valid,signature:lateResult.renewal.signature,imprint:lateResult.renewal.imprint,nonce:lateResult.renewal.nonce},{old:true,signature:true,imprint:true,nonce:true});
 const atBoundary=await renewTimestamp(fixture.successorKeys.privateKey,fixture.batch.token,fixture.renewalNonce,renewalTimeline.oldTrustUntil,'tsa-epoch-2');
 assert.equal((await assessArchiveEvidence(assessArgs(fixture,{renewal:atBoundary}))).reason,'late-renewal');
 const current=await assessArchiveEvidence(assessArgs(fixture,{timeline:{...renewalTimeline,evaluationTime:'2029-09-01T00:00:00.000Z'}}));
 assert.equal(current.valid,true);assert.equal(current.reason,'accepted-current-epoch');
 const noClock=await assessArchiveEvidence(assessArgs(fixture,{renewal:late,timeline:{...renewalTimeline,trustedTimeModel:false}}));
 assert.equal(noClock.valid,false);assert.equal(noClock.reason,'trusted-time-required');
 const successorExpired=await assessArchiveEvidence(assessArgs(fixture,{renewal:await renewTimestamp(fixture.successorKeys.privateKey,fixture.batch.token,fixture.renewalNonce,'2029-12-01T12:00:00.000Z','tsa-epoch-2'),timeline:{...renewalTimeline,evaluationTime:renewalTimeline.successorTrustUntil}}));
 assert.equal(successorExpired.valid,false);assert.equal(successorExpired.reason,'successor-expired');assert.equal(successorExpired.renewal.signature,true);
 const beforeOldEpoch=await issueBatchStamp(fixture.oldKeys.privateKey,fixture.documents,fixture.originalNonce,'2028-12-31T23:59:59.000Z','tsa-epoch-1');
 const beforeResult=await assessArchiveEvidence(assessArgs(fixture,{batch:beforeOldEpoch,timeline:{...renewalTimeline,evaluationTime:'2029-09-01T00:00:00.000Z'}}));
 assert.equal(beforeResult.valid,false);assert.equal(beforeResult.reason,'original-invalid');assert.equal(beforeResult.original.valid,true);assert.equal(beforeResult.originalInEpoch,false);
});
test('a post-compromise backdated forgery is indistinguishable from genuine evidence renewed too late',async()=>{
 const fixture=await renewalFixture();
 const lateGenuine=await renewTimestamp(fixture.successorKeys.privateKey,fixture.batch.token,fixture.renewalNonce,'2030-02-01T12:00:00.000Z','tsa-epoch-2');
 const forgedDocuments=['Proposal [forged after compromise]',...fixture.documents.slice(1)];
 const forgedNonce=randomId();
 // This token is created only now, after the scenario's compromise event, while claiming an old time.
 const forgedBatch=await issueBatchStamp(fixture.oldKeys.privateKey,forgedDocuments,forgedNonce,'2029-06-01T12:00:00.000Z','tsa-epoch-1');
 const forgedRenewalNonce=randomId();
 const lateForgery=await renewTimestamp(fixture.successorKeys.privateKey,forgedBatch.token,forgedRenewalNonce,'2030-02-01T12:00:00.000Z','tsa-epoch-2');
 const genuineResult=await assessArchiveEvidence(assessArgs(fixture,{renewal:lateGenuine}));
 const forgeryResult=await assessArchiveEvidence(assessArgs(fixture,{batch:forgedBatch,document:forgedDocuments[0],originalNonce:forgedNonce,renewal:lateForgery,renewalNonce:forgedRenewalNonce}));
 const visible=result=>({reason:result.reason,old:result.original.valid,renewalSignature:result.renewal.signature,renewalImprint:result.renewal.imprint,renewalNonce:result.renewal.nonce,timely:result.timely});
 assert.deepEqual(visible(genuineResult),visible(forgeryResult));
 assert.deepEqual(visible(forgeryResult),{reason:'late-renewal',old:true,renewalSignature:true,renewalImprint:true,renewalNonce:true,timely:false});
 assert.equal(forgeryResult.valid,false);
});
for(const kind of Object.keys(scenarios)){
 test(`${kind}: direct delivery exposes the first sender to a stopped exchange`,async()=>{
  const s=await createExchange(kind,'direct');await act(s,'send-a');await act(s,'abort');
  assert.equal(s.received.a,null);assert.equal(s.received.b.text,scenarios[kind].texts[0]);assert.equal(verdict(s).tone,'bad');
  await assert.rejects(()=>act(s,'send-b'),/already stopped/);
 });
 test(`${kind}: two genuine deliveries complete but do not prove adversarial fairness`,async()=>{
  const s=await createExchange(kind,'direct');await act(s,'send-b');await act(s,'send-a');
  assert.equal(s.phase,'completed');assert.equal(s.received.a.text,scenarios[kind].texts[1]);assert.equal(s.received.b.text,scenarios[kind].texts[0]);
  assert.match(verdict(s).detail,/does not establish fairness/);
 });
 test(`${kind}: intermediary release requires both verified deposits and is irreversible`,async()=>{
  const s=await createExchange(kind,'escrow');await act(s,'send-a');await assert.rejects(()=>act(s,'resolve'),/Both verified/);
  assert.deepEqual(s.received,{a:null,b:null});await act(s,'send-b');await act(s,'resolve');
  assert.equal(s.received.a.text,scenarios[kind].texts[1]);assert.equal(s.received.b.text,scenarios[kind].texts[0]);
  await assert.rejects(()=>act(s,'abort'),/already resolved/);
 });
}
test('abort before release never gives either recipient the deposited item',async()=>{
 const s=await createExchange('contract','escrow');await act(s,'send-a');await act(s,'send-b');await act(s,'abort');
 assert.deepEqual(s.received,{a:null,b:null});await assert.rejects(()=>act(s,'resolve'),/already aborted/);
});
test('wrong sessions, swapped parties and corrupted signatures fail closed',async()=>{
 const s=await createExchange('mail','escrow'),other=await createExchange('mail','escrow');
 await assert.rejects(()=>inspectPacket(s,'a',other.packets.a),/Wrong session/);
 await assert.rejects(()=>inspectPacket(s,'a',s.packets.b),/Wrong session/);
 const signature=s.packets.a.signature;s.packets.a.signature=(signature.startsWith('00')?'01':'00')+signature.slice(2);
 await assert.rejects(()=>act(s,'send-a'),/Signature verification failed/);assert.equal(s.deposits.a,false);assert.deepEqual(s.received,{a:null,b:null});
});
test('a corrupted second deposit cannot cause a partial release',async()=>{
 const s=await createExchange('secrets','escrow');await act(s,'send-a');await act(s,'send-b');s.packets.b.payload.ciphertext+='00';
 await assert.rejects(()=>act(s,'resolve'));assert.deepEqual(s.received,{a:null,b:null});assert.equal(s.phase,'open');
});
test('overlapping abort cannot contradict an in-flight release decision',async()=>{
 const s=await createExchange('contract','escrow');await act(s,'send-a');await act(s,'send-b');const releasing=act(s,'resolve');
 await assert.rejects(()=>act(s,'abort'),/in progress/);await releasing;assert.equal(s.phase,'resolved');
});
