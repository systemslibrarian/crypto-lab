import {hash,el,say,button,secureIndex} from '../shared/crypto.mjs';
const missions=[
 {kind:'honest',title:'A Clean Swap',story:'A rare Star Crystal is offered for your Neon Fox. Can you exchange both items without trusting a promise?',objective:'Get the promised Crystal AND keep the other trader protected through the escrow rules.'},
 {kind:'counterfeit',title:'The Lookalike',story:'The seller insists their Star Crystal is authentic. The item in escrow might not match the published fingerprint.',objective:'Detect a counterfeit by checking the deposit hash and recover your Fox without releasing it.'},
 {kind:'vanished',title:'The Ghost Trader',story:'Your rival promised a Crystal but may never deposit. Can you recover a locked item after the deadline?',objective:'Safely reclaim your Fox after the refund clock runs out. Do not send it directly.'},
 {kind:'random',title:'Mystery Exchange',story:'You have no idea whether the rival is honest, a counterfeiter or absent. Make decisions using observed evidence.',objective:'Adapt: release only an authentic verified deposit, or refund when verification fails or time expires.'}
];
const listed='STAR-CRYSTAL|ID:ST-204|RARITY:RARE|COLOR:BLUE';
const fake='STAR-CRYSTAL|ID:ST-204|RARITY:COMMON|COLOR:BLUE';
let state,busy=false;
const guard=async fn=>{if(busy)return;busy=true;try{await fn();}catch(e){feedback(`Could not finish: ${e.message}`, 'bad');}finally{busy=false;}};
function feedback(str,tone=''){el('feedback').className=`feed ${tone}`;say('feedback',str);}
function render(){
 say('round',`${state.index+1} / 4`);say('wins',state.wins);say('moves',state.steps);
 say('phase',`TRADE ${state.index+1} / 4`);say('mission',missions[state.index].title);say('story',missions[state.index].story);say('objective',missions[state.index].objective);
 say('your-status',state.lost?'Sent away directly':state.released?'Swapped for Crystal':state.refunded?'Returned to inventory':state.locked?'Locked in escrow':'In your inventory');
 say('their-status',state.released?'Crystal transferred to you':state.kind==='vanished'?'No deposit yet':state.locked?'Deposit received, authenticity unknown':'Promised, not verified');
 say('escrow-status',state.released?'✅ Released':state.refunded?'↩ Refunded':state.locked?'🔐 Holding Fox':'🔒 Empty');
 say('timer',`Refund clock: ${state.ticks} / 2 ticks${state.ticks>=2?' · AVAILABLE':''}`);
 say('match',state.proofChecked?(state.valid?'MATCH: deposited item fingerprint is exactly the expected digest.':'MISMATCH: the deposited item differs from the promised digest.'):'A promised hash is not proof that the right item was deposited.');
 el('result').hidden=!state.finished;
 const entries=[['Deposit in escrow','Lock your Fox. The rival may respond.',()=>act('deposit')],['Verify deposit','Compute the item hash, not just the listing.',()=>act('verify')],['Release swap','Complete only after verified deposits.',()=>act('release')],['Wait one tick','Move closer to the refund deadline.',()=>act('wait')],['Claim refund','Recover your Fox if a failure or timeout permits.',()=>act('refund')],['Send directly ⚠','Trust the rival without escrow (risky).',()=>act('direct')]];
 el('actions').replaceChildren();
 for(const [title,caption,run] of entries){const b=button(el('actions'),title,()=>guard(run),'btn');const sub=document.createElement('span');sub.textContent=caption;b.append(sub);b.disabled=state.finished;}
}
async function prepare(index=0,wins=0,oldKind=null){
 const scenario=missions[index];const kind=oldKind||(scenario.kind==='random'?['honest','counterfeit','vanished'][secureIndex(3)]:scenario.kind);
 state={index,wins,kind,stage:'start',steps:0,locked:false,partnerDeposit:false,proofChecked:false,valid:false,released:false,refunded:false,lost:false,ticks:0,finished:false};
 state.listedHash=await hash('digital-trade-item-v1',listed);
 say('listed-hash',state.listedHash);say('actual-hash','Deposit, then verify');
 say('lesson-title','Your goal');say('lesson','The listed digest is assumed to have come from an authenticated source. The actual deposited bytes must still be checked before release.');
 el('next').hidden=false;el('retry').hidden=true;el('next').textContent=index===3?'Play all trades again ↻':'Next trade →';
 feedback('Take your first action. Try a risky shortcut if you like; losing a pretend item is free to retry.');render();
}
function finish(won,reason,lesson){
 state.finished=true;state.wins+=won?1:0;
 say('result-title',won?'TRADE SECURED!':'TRADE FAILED — RETRY FREE');say('result-detail',`${reason} ${lesson}`);
 const comparison=state.lost
 ? 'Compare the paths: sending directly gave up control before you checked anything. Retry using Deposit → Verify → Release or Refund; the simulated escrow can block a bad exchange and return your item.'
 : state.released
 ? 'Compare the risky path: sending directly would depend on the rival’s goodwill. Here the escrow held both deposits until the expected bytes were verified.'
 : 'Compare the risky path: sending directly could lose the item permanently. Here a verified mismatch or elapsed timeout allowed the escrow to return it.';
 say('trade-contrast',comparison);
 say('lesson-title',won?'Why that worked':'What went wrong');say('lesson',lesson);
 el('next').hidden=!won;el('retry').hidden=won;
 feedback(won?'You handled the counterparty safely.':'A flawed exchange rule lost the trade. Test another path!',won?'good':'bad');render();
}
async function act(action){
 if(state.finished)return;state.steps++;
 const before=()=>{render();};
 switch(action){
 case 'deposit':
   if(state.locked){feedback('Your Fox is already locked. Inspect the partner deposit before releasing.');break;}
   state.locked=true;state.partnerDeposit=state.kind!=='vanished';
   feedback(state.partnerDeposit?'Both sides deposited something. Verify the actual Crystal now.':'Your Fox is protected in escrow, but no partner deposit arrived. Advance the refund clock.');
   break;
 case 'verify':
   if(!state.locked){feedback('Nothing is deposited yet. Verify the actual item AFTER escrow receives it.','bad');break;}
   if(!state.partnerDeposit){feedback('No Crystal was deposited. There is no item to hash.','bad');break;}
   state.proofChecked=true;
   const actual=state.kind==='counterfeit'?fake:listed;
   const digest=await hash('digital-trade-item-v1',actual);
   state.valid=digest===state.listedHash;
   say('actual-hash',digest);
   feedback(state.valid?'REAL MATCH! The deposited item matches the authenticated listing digest. Release is now safe under the game escrow rules.':'COUNTERFEIT! The escrowed bytes fail the published SHA-256 fingerprint. Refund to protect your collectible.',state.valid?'good':'bad');
   break;
 case 'release':
   if(!state.locked){feedback('The escrow is empty; there is nothing to release.');break;}
   if(!state.partnerDeposit||!state.proofChecked||!state.valid){feedback('ESCROW BLOCKED RELEASE: Both deposits and a matching fingerprint are required. This is why the policy matters.','bad');break;}
   state.released=true;finish(true,'Both items transferred after verification.','The trusted escrow service enforced the condition; SHA-256 only checked the item against an assumed authentic listing. Hashes alone cannot make this swap atomic.');return;
 case 'wait':
   if(!state.locked){feedback('The timer only matters after an escrow deposit.');break;}
   state.ticks=Math.min(2,state.ticks+1);
   feedback(state.ticks>=2?'Refund deadline reached. If you have not released the trade, you can now reclaim your deposit.':`Refund clock now ${state.ticks}/2. The other side may still fail to deliver.`);
   break;
 case 'refund':
   if(!state.locked){feedback('Nothing was escrowed, so there is nothing to refund.');break;}
   if(!state.proofChecked||state.valid){if(state.ticks<2){feedback('Refund is locked until timeout OR a verified mismatch. Wait, or inspect the partner item.');break;}}
   state.refunded=true;
   if(state.kind==='honest')finish(false,'Your asset returned, but the valid trade never completed.','For an available verified item, an on-time release would have completed the exchange.');
   else finish(true,'Your Fox returned; the suspicious exchange never released it.','A mismatch or timeout made refund eligible. This relies on the escrow policy, not the hash alone.');return;
 case 'direct':
   state.lost=true;
   finish(false,state.kind==='honest'?'Your honest partner sent the Crystal, but you bypassed the protection.':'You sent your Fox, and the adversary kept it.',
      'Sending first grants the counterparty the power to disappear. A lucky honest outcome is not a fair-exchange guarantee.');return;
 }
 before();
}
el('next').addEventListener('click',()=>guard(async()=>{if(!state.finished)return;await prepare(state.index===3?0:state.index+1,state.index===3?0:state.wins);}));
el('retry').addEventListener('click',()=>guard(()=>prepare(state.index,state.wins,state.kind)));
guard(()=>prepare());
