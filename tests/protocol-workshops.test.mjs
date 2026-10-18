import test from 'node:test';import assert from 'node:assert/strict';
import {digest,signingKey,randomId} from '../learn/shared/crypto.mjs';
import {issueStamp,checkStamp,makeChain,checkChain} from '../learn/timestamping/core.mjs';
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
