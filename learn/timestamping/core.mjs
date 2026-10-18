import {digest, randomId, sign, verify} from '../shared/crypto.mjs';
// Fixed-order, domain-separated encoding. This is NOT RFC 3161 ASN.1/CMS.
export const stampBytes = token => JSON.stringify(['crypto-lab-timestamp-v1',token.serial,token.imprint,token.nonce,token.time]);
export async function issueStamp(key, text, nonce, time=new Date().toISOString()) {
  const token={serial:randomId(),imprint:await digest(text),nonce,time};
  return {...token,signature:await sign(key,stampBytes(token))};
}
export async function checkStamp(key, token, text, expectedNonce) {
  return {
    signature:await verify(key,stampBytes(token),token.signature),
    imprint:token.imprint===await digest(text),
    nonce:token.nonce===expectedNonce,
    trustedTime:false // A browser clock + ephemeral signer cannot establish external time.
  };
}
export async function makeChain(documents) {
  let previous='0'.repeat(64); const entries=[];
  for(let i=0;i<documents.length;i++) {
    const entry={index:i,imprint:await digest(documents[i]),previous};
    entry.hash=await digest(JSON.stringify(['crypto-lab-link-v1',entry.index,entry.imprint,entry.previous]));
    entries.push(entry);previous=entry.hash;
  }
  return entries;
}
export async function checkChain(entries, documents, pinnedHead) {
  const expected=await makeChain(documents);
  const links=entries.length===expected.length && entries.every((e,i)=>['index','imprint','previous','hash'].every(k=>e[k]===expected[i][k]));
  return {links,anchor:entries.length>0 && entries.at(-1).hash===pinnedHead};
}
