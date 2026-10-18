import {signingKey,randomId} from '../shared/crypto.mjs';
import {issueStamp,checkStamp,makeChain,checkChain} from './core.mjs';
const $=id=>document.getElementById(id);
let authority, token, nonce=randomId(), busy=false, entries=[], pinned='';
let documents=[];
function status(id,title,detail,tone='warn') {const box=$(id);box.dataset.tone=tone;box.replaceChildren();const strong=document.createElement('strong');strong.textContent=title;const p=document.createElement('p');p.textContent=detail;box.append(strong,p);}
function controls(){document.querySelectorAll('button').forEach(b=>b.disabled=busy||!authority);for(const id of ['check','change','alter','backdate','replay'])$(id).disabled=busy||!token;$('document').disabled=busy;}
async function run(fn){if(busy)return;busy=true;controls();try{await fn();}catch(e){status('status','Operation failed',e.message,'bad');}finally{busy=false;controls();}}
function receipt(){$('receipt').textContent=JSON.stringify(token,null,2);}
async function check(){const r=await checkStamp(authority.publicKey,token,$('document').value,nonce);receipt();status('status',r.signature&&r.imprint&&r.nonce?'Cryptographic checks pass — time still needs trust':'Evidence rejected',`Signature: ${r.signature?'valid':'INVALID'}. Document fingerprint: ${r.imprint?'matches':'MISMATCH'}. Request nonce: ${r.nonce?'matches':'MISMATCH'}. Claimed time: ${token.time}. This local signature cannot establish an independently trusted time.`,r.signature&&r.imprint&&r.nonce?'good':'bad');}
async function issue(time){nonce=randomId();token=await issueStamp(authority.privateKey,$('document').value,nonce,time);await check();}
function drawChain(){const list=$('chain');list.replaceChildren();entries.forEach((entry,i)=>{const li=document.createElement('li');const p=document.createElement('p');p.textContent=documents[i];const code=document.createElement('code');code.textContent=entry.hash;li.append(p,code);list.append(li);});$('anchor').textContent=pinned;}
async function checkLog(){const r=await checkChain(entries,documents,pinned);status('chain-status',r.links&&r.anchor?'History matches its pinned checkpoint':!r.links?'Document or link mismatch':'Consistent rewrite — checkpoint mismatch',`Internal links: ${r.links?'valid':'INVALID'}. Pinned final hash: ${r.anchor?'matches':'MISMATCH'}. ${r.links&&!r.anchor?'The operator repaired the chain, but cannot silently replace the checkpoint held by a witness.':'A checkpoint must be retained outside the operator’s control to expose a complete rewrite.'}`,r.links&&r.anchor?'good':'bad');drawChain();}
async function resetLog(){documents=['Proposal version 1','Committee review completed','Exhibition announced'];entries=await makeChain(documents);pinned=entries.at(-1).hash;await checkLog();}
$('issue').onclick=()=>run(()=>issue());$('check').onclick=()=>run(check);
$('change').onclick=()=>run(async()=>{$('document').value+=' [revised]';await check();});
$('alter').onclick=()=>run(async()=>{token.time=new Date(Date.parse(token.time)-86400000).toISOString();await check();});
$('backdate').onclick=()=>run(()=>issue(new Date(Date.now()-86400000).toISOString()));
$('replay').onclick=()=>run(async()=>{nonce=randomId();await check();});
$('document').addEventListener('input',()=>{if(token)status('status','Document edited — verification required','The previous result does not cover this edited text. Verify the evidence again.');});
$('edit-chain').onclick=()=>run(async()=>{documents[0]+=' [rewritten]';await checkLog();});
$('rebuild-chain').onclick=()=>run(async()=>{entries=await makeChain(documents);await checkLog();});
$('check-chain').onclick=()=>run(checkLog);$('reset-chain').onclick=()=>run(resetLog);
await run(async()=>{authority=await signingKey();await resetLog();status('status','Ready to timestamp','Issue a local timestamp, then test what each piece of evidence establishes.');});
