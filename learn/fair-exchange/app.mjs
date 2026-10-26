import {createExchange,act,verdict,scenarios} from './core.mjs';
import {
  ASW_ROUNDS,createOptimisticExchange,generateEscrowKeyPair,optimisticAct,
  optimisticVerdict,optimisticView,setIntermediaryAvailable
} from './optimistic.mjs';

const $=id=>document.getElementById(id);
let session,busy=false,optimistic,optimisticBusy=false,escrowKeys;

function status(title,detail,tone='warn',id='status'){
  const box=$(id);box.dataset.tone=tone;box.replaceChildren();
  const strong=document.createElement('strong');strong.textContent=title;
  const p=document.createElement('p');p.textContent=detail;box.append(strong,p);
}
function controls(){
  document.querySelectorAll('#legacy-exchange button,#legacy-exchange select').forEach(el=>el.disabled=busy);
  if(!session)return;
  const done=session.phase!=='open';
  for(const party of ['a','b'])$(`send-${party}`).disabled=busy||done||session.deposits[party]||!!session.received[party==='a'?'b':'a'];
  $('resolve').hidden=session.method!=='escrow';
  $('resolve').disabled=busy||done||!session.deposits.a||!session.deposits.b;
  $('abort').disabled=busy||done;
  $('tamper').disabled=busy||done||session.deposits.a||!!session.received.b;
}
function draw(){
  if(!session)return;
  const s=session,spec=scenarios[s.kind],escrow=s.method==='escrow';
  $('goal').textContent=spec.goal;
  $('alice').textContent=s.received.a?`Received: ${spec.b}`:'Has not received Bob’s item.';
  $('bob').textContent=s.received.b?`Received: ${spec.a}`:'Has not received Alice’s item.';
  $('broker').textContent=escrow?`Alice’s deposit: ${s.deposits.a?'verified':'absent'}. Bob’s deposit: ${s.deposits.b?'verified':'absent'}. Decision: ${s.phase}.`:'Not involved. Delivery depends on each party’s cooperation.';
  $('send-a').textContent=escrow?'Alice deposits her item':'Alice sends her item';
  $('send-b').textContent=escrow?'Bob deposits his item':'Bob sends his item';
  $('abort').textContent=escrow?'Record abort':'Stop before next delivery';
  $('log').replaceChildren(...s.log.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  $('evidence').textContent=JSON.stringify({session:s.id,subject:s.subject,AliceReceived:s.received.a,BobReceived:s.received.b},null,2);
  const v=verdict(s);status(v.title,v.detail,v.tone);controls();
}
async function run(fn){
  if(busy)return;busy=true;controls();
  try{await fn();draw();}catch(error){status('Operation rejected',error.message,'bad');}
  finally{busy=false;controls();}
}
async function reset(){session=await createExchange($('scenario').value,$('method').value);}
for(const action of ['send-a','send-b','resolve','abort'])$(action).onclick=()=>run(()=>act(session,action));
$('tamper').onclick=()=>run(async()=>{const signature=session.packets.a.signature;session.packets.a.signature=(signature.startsWith('00')?'01':'00')+signature.slice(2);session.log.push('Alice’s signed packet was modified. Submit it to test verification.');});
$('reset').onclick=()=>run(reset);$('scenario').onchange=()=>run(reset);$('method').onchange=()=>run(reset);

function optimisticControls(){
  document.querySelectorAll('#optimistic-exchange button,#optimistic-exchange input,#optimistic-presets button').forEach(element=>element.disabled=optimisticBusy);
  if(!optimistic)return;
  $('opt-available').checked=optimistic.intermediary.available;
  const ledger=optimistic.intermediary.ledger;
  $('opt-abort').disabled=optimisticBusy||Boolean(optimistic.intermediary.durable&&optimistic.bob.usablePeerSignature&&!ledger.deposit);
  $('opt-forget').disabled=optimisticBusy||!ledger.abort&&!ledger.noAbort&&!ledger.deposit;
}
function yesNo(value){return value?'YES — independently verifiable':'NO';}
function drawOptimistic(){
  if(!optimistic)return;
  const view=optimisticView(optimistic),records=view.intermediary.records.length?view.intermediary.records.join(' + '):'none';
  $('opt-alice').textContent=`Bob promise: verified. Bob escrow: recoverable. Usable Bob signature: ${yesNo(view.alice.usablePeerSignature)}.`;
  $('opt-bob').textContent=`Alice ordinary escrow: received, but only the TTP can check its contents. Usable Alice signature: ${yesNo(view.bob.usablePeerSignature)}.`;
  $('opt-ttp').textContent=`${view.intermediary.available?'Available':'Unavailable'}. Durable records: ${records}. TTP contacts: ${view.intermediary.contacts}; attempts: ${view.intermediary.attempts}.`;
  $('opt-proof').textContent=`Protocol D proof: ${view.proof.rounds} rounds · challenge ${view.proof.challenge} · ${view.proof.verified?'VERIFIED':'REJECTED'} · condition ${view.proof.conditionHash.slice(0,16)}…`;
  $('opt-log').replaceChildren(...optimistic.log.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  $('opt-evidence').textContent=JSON.stringify(view,null,2);
  const result=optimisticVerdict(optimistic);status(result.title,result.detail,result.tone,'opt-status');
  optimisticControls();
}
async function resetOptimistic(){
  if(!escrowKeys)escrowKeys=await generateEscrowKeyPair();
  optimistic=await createOptimisticExchange({rounds:ASW_ROUNDS,escrowKeys});
}
async function optRun(fn){
  if(optimisticBusy)return;optimisticBusy=true;optimisticControls();
  try{await fn();drawOptimistic();}catch(error){drawOptimistic();status('Operation rejected',error.message,'bad','opt-status');}
  finally{optimisticBusy=false;optimisticControls();}
}
for(const action of ['send-alice','send-bob','abort','b-resolve','a-resolve'])$(`opt-${action}`).onclick=()=>optRun(()=>optimisticAct(optimistic,action));
$('opt-forget').onclick=()=>optRun(()=>optimisticAct(optimistic,'forget-state'));
$('opt-reset').onclick=()=>optRun(resetOptimistic);
$('opt-available').onchange=event=>{try{setIntermediaryAvailable(optimistic,event.target.checked);drawOptimistic();}catch(error){status('Availability change rejected',error.message,'bad','opt-status');}};

async function preset(actions,{available=true}={}){
  await resetOptimistic();setIntermediaryAvailable(optimistic,available);
  for(const action of actions)await optimisticAct(optimistic,action);
}
$('opt-honest').onclick=()=>optRun(()=>preset(['send-alice','send-bob']));
$('opt-abort-first').onclick=()=>optRun(()=>preset(['abort','b-resolve']));
$('opt-resolve-first').onclick=()=>optRun(()=>preset(['b-resolve','abort']));
$('opt-a-resolve-path').onclick=()=>optRun(()=>preset(['send-alice','a-resolve','b-resolve','abort']));
$('opt-unavailable-path').onclick=()=>optRun(()=>preset(['b-resolve'],{available:false}));
$('opt-lost-state').onclick=()=>optRun(()=>preset(['b-resolve','forget-state','abort']));

await run(reset);
await optRun(resetOptimistic);
