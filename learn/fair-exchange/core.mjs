import {digest,randomId,signingKey,sign,verify,aesKey,encrypt,decrypt} from '../shared/crypto.mjs';
export const scenarios={
  mail:{title:'Certified mail',a:'The message',b:'A signed conditional receipt',texts:['Fictional notice: your exhibition proposal has been accepted.','I authorize release of this session’s message in exchange for this receipt.'],goal:'Alice gets Bob’s receipt; Bob gets access to Alice’s message.'},
  contract:{title:'Contract signing',a:'Alice’s signature',b:'Bob’s signature',texts:['Fictional agreement: exhibit loan from 1–30 November, no payment.','Fictional agreement: exhibit loan from 1–30 November, no payment.'],goal:'Both receive the other’s signature on the same terms.'},
  secrets:{title:'Secret exchange',a:'Alice’s secret',b:'Bob’s secret',texts:['Fictional north-door code: CEDAR-17','Fictional south-door code: AMBER-42'],goal:'Each gains the other’s secret, or neither gains it.'}
};
const packetBytes=p=>JSON.stringify(['crypto-lab-exchange-v1',p.session,p.kind,p.party,p.subject,p.imprint,p.payload.iv,p.payload.ciphertext]);
export async function createExchange(kind='mail',method='direct') {
  if(!scenarios[kind]||!['direct','escrow'].includes(method))throw new Error('Unknown scenario');
  const id=randomId(), spec=scenarios[kind];
  // Bind both offers to the same exchange, identities and pair of document digests.
  const subject=await digest(JSON.stringify([kind,'Alice','Bob',...spec.texts]));
  const s={id,kind,method,subject,phase:'open',deposits:{a:false,b:false},received:{a:null,b:null},packets:{},keys:{},signers:{},log:[]};
  for(const [i,party] of ['a','b'].entries()) {
    s.keys[party]=await aesKey();s.signers[party]=await signingKey();
    const context=JSON.stringify([id,kind,party,subject]);
    const packet={session:id,kind,party,subject,imprint:await digest(spec.texts[i]),payload:await encrypt(s.keys[party],spec.texts[i],context)};
    packet.signature=await sign(s.signers[party].privateKey,packetBytes(packet));
    s.packets[party]=packet;
  }
  return s;
}
export async function inspectPacket(s,party,packet=s.packets[party]) {
  if(!['a','b'].includes(party)||packet.session!==s.id||packet.kind!==s.kind||packet.party!==party||packet.subject!==s.subject)throw new Error('Wrong session, item or subject');
  if(!await verify(s.signers[party].publicKey,packetBytes(packet),packet.signature))throw new Error('Signature verification failed');
  const text=await decrypt(s.keys[party],packet.payload,JSON.stringify([s.id,s.kind,party,s.subject]));
  if(await digest(text)!==packet.imprint || text!==scenarios[s.kind].texts[party==='a'?0:1])throw new Error('Document fingerprint mismatch');
  return {text,signature:packet.signature,imprint:packet.imprint};
}
function open(s){if(s.phase!=='open')throw new Error('Session already '+s.phase);}
async function transition(s,action){
  open(s);
  if(action==='abort'){
    if(s.method==='direct') {s.phase='stopped';s.log.push('Direct exchange stopped. Already delivered information cannot be recalled.');}
    else {s.phase='aborted';s.log.push('Intermediary recorded ABORT. Neither deposited item is released.');}
    return;
  }
  if(action==='resolve'){
    if(s.method!=='escrow')throw new Error('No intermediary in direct mode');
    if(!s.deposits.a||!s.deposits.b)throw new Error('Both verified deposits are required');
    // Validate BOTH before committing either right to retrieve. No partial release.
    const a=await inspectPacket(s,'a'),b=await inspectPacket(s,'b');
    s.received={a:b,b:a};s.phase='resolved';
    s.log.push('Intermediary recorded RELEASE. Both items are available to their recipients.');return;
  }
  const party=action==='send-a'?'a':action==='send-b'?'b':null;
  if(!party)throw new Error('Unknown action');
  const other=party==='a'?'b':'a';
  if(s.deposits[party]||s.received[other])throw new Error('Item already submitted');
  const evidence=await inspectPacket(s,party);
  if(s.method==='escrow'){
    s.deposits[party]=true;s.log.push(`${party==='a'?'Alice':'Bob'} deposited an item. Intermediary checked its signature, session and ciphertext.`);
  }else{
    s.received[other]=evidence;s.log.push(`${party==='a'?'Alice':'Bob'} delivered a verified item directly. Its recipient can now read it.`);
    if(s.received.a&&s.received.b)s.phase='completed';
  }
}
export function verdict(s){
  const a=!!s.received.a,b=!!s.received.b;
  if(a!==b)return {tone:'bad',title:'One party has the advantage',detail:'One item has been delivered while the other has not. A valid signature cannot force the remaining delivery.'};
  if(a&&b)return {tone:'good',title:'Both sides have their evidence',detail:s.method==='escrow'?'The modeled intermediary made both items retrievable in one decision. This relies on its honest, available, consistent behavior.':'Both parties cooperated. This successful run does not establish fairness against a party that stops early.'};
  return {tone:'warn',title:s.phase==='aborted'?'Aborted — neither item released':'Neither item has been delivered',detail:s.phase==='aborted'?'The terminal abort decision prevents a later release in this session.':'Choose an action and watch who gains access first.'};
}

export async function act(s,action){if(s.busy)throw new Error("Another action is in progress");s.busy=true;try{return await transition(s,action);}finally{s.busy=false;}}
