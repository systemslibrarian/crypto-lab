import {randomHex,seal,verify,el,say,button,secureIndex} from '../shared/crypto.mjs';
const cases=['honest','leaky','forged','honest','aborted','leaky'];
let state,busy=false;
const safe=async fn=>{if(busy)return;busy=true;try{await fn();}catch(e){feedback(`Unable to continue: ${e.message}`, 'bad');}finally{busy=false;}};
function feedback(s,tone=''){el('feedback').className=`feed ${tone}`;say('feedback',s);}
function missionCopy(){return {
 honest:'The opponent claims to play fair. A matching fingerprint can prove the opening stayed unchanged.',
 leaky:'A debugging message leaked secret randomness before you locked your bit! Can you break the hiding property?',
 forged:'Something feels off. Remember: a commitment must reject a changed opening.',
 aborted:'The opponent might walk away when asked to reveal. Does a commitment force them to finish?'
}[state.type];}
async function newRun(){let order=[...cases];for(let i=order.length-1;i>0;i--){const j=secureIndex(i+1);[order[i],order[j]]=[order[j],order[i]];}state={order,score:0,correct:0,index:0,history:[]};await makeMission();}
async function makeMission(){
  const {order,index}=state;const type=order[index];
  Object.assign(state,{type,stage:'choose',bit:null,botBit:secureIndex(2),nonce:randomHex(16),myNonce:null,guessed:null,probed:false,checked:false});
  state.commit=await seal(`coin-${index}`,state.botBit,state.nonce);
  say('round',`${index+1} / ${state.order.length}`);say('score',state.score);say('correct',state.correct);
  say('mission','The rival has locked their bit.');say('story',missionCopy());say('phase',`MISSION ${index+1} / ${state.order.length}`);
  say('seal',state.commit);say('me','?');say('them','🔒');say('computed','Reveal required');say('leak-note',type==='leaky'?`LEAK ALERT · Public nonce: ${state.nonce}`:'Nonce remains private until opening.');
  say('probe-result','Try both candidates. The matching fingerprint exposes the secret bit.');
  el('probes').hidden=type!=='leaky';el('select-bit').hidden=false;el('reveal-zone').hidden=true;el('verdict-zone').hidden=true;el('end').hidden=true;el('mission-summary').hidden=true;
  el('bits').replaceChildren();
  for(const bit of [0,1]){let b=button(el('bits'),bit===0?'0 · Heads':'1 · Tails',()=>{state.bit=bit;showSelection();},'choice');b.setAttribute('aria-pressed','false');b.dataset.bit=String(bit);}
  el('lock').disabled=true;el('progress').style.width='16%';
  say('lesson-title','What is the question?');say('lesson','A hash commitment can keep a 0-or-1 choice fixed, but only a secret random nonce keeps someone from brute-forcing both guesses.');
  feedback('Opponent commitment posted. Choose your private bit, or investigate a public nonce leak first.');
}
function showSelection(){for(const b of el('bits').querySelectorAll('button'))b.setAttribute('aria-pressed',String(Number(b.dataset.bit)===state.bit));el('lock').disabled=false;say('me',state.bit===0?'0':'1');}
async function probe(bit){if(state.type!=='leaky'||state.stage!=='choose')return;const candidate=await seal(`coin-${state.index}`,bit,state.nonce);const match=candidate===state.commit;if(match){state.guessed=bit;state.probed=true;}say('probe-result',match?`MATCH! The rival sealed ${bit===0?'0 (Heads)':'1 (Tails)'}. You can force Heads by choosing the SAME bit.`:`NO MATCH. ${bit===0?'0':'1'} is not the rival's sealed bit. Try the other candidate.`);}
async function lock(){if(state.stage!=='choose'||state.bit===null)return;state.myNonce=randomHex(16);state.myCommit=await seal(`you-${state.index}`,state.bit,state.myNonce);state.stage='locked';el('select-bit').hidden=true;el('probes').hidden=true;el('reveal-zone').hidden=false;el('reveal').disabled=false;el('check').disabled=true;say('mission','Both choices are sealed.');say('open-info',`Your saved commitment: ${state.myCommit}. Your private bit is ${state.bit}, with a fresh 16-byte nonce.`);el('progress').style.width='42%';feedback('Your bit is locked. The rival must now reveal the value matching the earlier fingerprint.');}
async function reveal(){if(state.stage!=='locked')return;state.stage='opened';el('reveal').disabled=true;el('check').disabled=false;el('progress').style.width='67%';if(state.type==='aborted'){state.opening=null;say('them','…');say('open-info','NO OPENING: The rival disconnected without revealing a bit or nonce.');say('computed','No opening to recompute');feedback('The rival has gone silent. Decide whether this is a forged hash or an aborted protocol.','bad');return;}
state.opening={bit:state.type==='forged'?1-state.botBit:state.botBit,nonce:state.nonce};say('them',String(state.opening.bit));say('open-info',`Revealed bit ${state.opening.bit}, nonce ${state.opening.nonce}. The verifier must hash these exact values.`);feedback('Opening received. Compute the fingerprint yourself before deciding what happened.');}
async function check(){if(state.stage!=='opened')return;state.stage='checked';state.valid=state.opening?await verify(`coin-${state.index}`,state.opening.bit,state.opening.nonce,state.commit):false;const calculated=state.opening?await seal(`coin-${state.index}`,state.opening.bit,state.opening.nonce):'NO OPENING';say('computed',calculated);
/* BOTH openings are verified, because the page claims both are. The rules said
   "both parties' verified bits are XORed" and "A valid result requires both
   genuine openings" while only the rival's seal was ever checked: the player's
   bit went into the XOR unverified, and state.myCommit was computed in lock()
   and never read again. Checking it here is what a fair coin flip actually is --
   each side binds its bit before either opens -- so the claim and the code now
   agree, and the honest direction was to make the code true rather than to
   weaken the sentence. */
state.mineValid=state.myCommit?await verify(`you-${state.index}`,state.bit,state.myNonce,state.myCommit):false;
const outcome=(state.valid&&state.mineValid)?state.bit^state.opening.bit:null;state.outcome=outcome;
if(state.opening){say('open-info',`The rival's opening ${state.valid?'MATCHES':'DOES NOT MATCH'} the pre-published hash, and your own opening ${state.mineValid?'matches yours':'does NOT match yours'}. ${outcome!==null?`Both bits verified, so the XOR stands: ${outcome===0?'HEADS':'TAILS'}.`:'Do not accept or score a coin result unless BOTH openings verify.'}`);}
else say('open-info','No revealed bit or nonce: verification cannot run. There is no agreed coin result.');
el('check').disabled=true;el('verdict-zone').hidden=false;el('progress').style.width='84%';el('verdicts').replaceChildren();
for(const [kind,label] of [['honest','Fair ✓'],['forged','Forged ✕'],['aborted','Aborted ⏱'],['leaky','Leaky ⚡']])button(el('verdicts'),label,()=>judge(kind),'choice');
feedback(outcome!==null?'Both cryptographic hashes match. Did anything else compromise fairness?':'The verification did not produce a valid confirmed coin. Classify why.');}
function showSummary(){
 const names={honest:'Fair',leaky:'Leaky',forged:'Forged',aborted:'Aborted'};
 const list=el('summary-list');list.replaceChildren();
 for(const [i,item] of state.history.entries()){
  const row=document.createElement('li');
  row.textContent=`${i+1}. ${names[item.type]}: ${item.correct?'correctly identified':`you chose ${names[item.choice]}; review the ${names[item.type].toLowerCase()} case`}${item.exploited?' · nonce leak exploited for the bonus':''}.`;
  list.append(row);
 }
 say('summary-takeaway',`You classified ${state.correct} of ${state.order.length} missions correctly. A matching hash is not enough by itself: hiding, binding and a fair abort policy all matter.`);
 el('mission-summary').hidden=false;
}
function judge(kind){if(state.stage!=='checked')return;state.stage='done';let ok=kind===state.type;state.score+=ok?2:0;state.correct+=ok?1:0;const exploit=ok&&state.type==='leaky'&&state.probed&&state.bit===state.botBit;state.score+=exploit?1:0;
state.history.push({type:state.type,choice:kind,correct:ok,exploited:exploit});
const lessons={honest:'Two valid committed openings can be XORed. If at least one honest bit was uniform and hidden until the other bit was fixed, the outcome is unbiased before aborts.',forged:'A mismatched opening cannot rewrite a prior hash. Verification detects changed input; it does not prevent someone from attempting fraud.',aborted:'A commitment cannot force disclosure. An opponent who withholds an opening can deny the outcome, and may gain selective-abort leverage.',leaky:'Publishing the nonce of a binary commitment makes both possible bits easy to test. A valid hash can still fail the HIDING requirement.'};
say('lesson-title',`${state.type.toUpperCase()} / Lesson`);say('lesson',lessons[state.type]);say('result-title',ok?'Correct classification!':'Not quite — investigate the evidence.');
say('result-body',`${ok?'You earned 2 trust points.':'No points this round, but nothing was lost.'} ${exploit?' Bonus +1: you exploited the leaked nonce to force Heads.':''} ${lessons[state.type]}`);
el('verdict-zone').hidden=true;el('end').hidden=false;el('progress').style.width='100%';say('score',state.score);say('correct',state.correct);
if(state.history.length===state.order.length)showSummary();
el('next').textContent=state.index===state.order.length-1?'Replay six missions ↻':'Next mission →';feedback(ok?`Case closed. ${state.type} verified.${exploit?' Clever exploit!':''}`:`Actual outcome: ${state.type}. Recheck which property failed and try again in a new run.`,ok?'good':'bad');}
async function next(){if(state.stage!=='done')return;if(state.index===state.order.length-1){await newRun();return;}state.index++;await makeMission();}
el('probe-h').addEventListener('click',()=>safe(()=>probe(0)));el('probe-t').addEventListener('click',()=>safe(()=>probe(1)));el('lock').addEventListener('click',()=>safe(lock));el('reveal').addEventListener('click',()=>safe(reveal));el('check').addEventListener('click',()=>safe(check));el('next').addEventListener('click',()=>safe(next));safe(newRun);
