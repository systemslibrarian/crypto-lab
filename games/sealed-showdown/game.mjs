import {LESSONS,MOVES,STORE,commit,counter,dailyPlan,encode,outcome,randomHex,randomMove,readProgress,requireCrypto,verify} from './core.mjs';
const $=s=>document.querySelector(s);
const title=s=>s[0].toUpperCase()+s.slice(1);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shapes={
  rock:'<path d="m18 57 8-29 24-12 23 12 11 28-22 25-28-4Z"/><path d="m26 28 25 15 22-15M51 43l11 38M18 57l33-14"/>',
  paper:'<path d="M27 14h36l14 15v56H27Z"/><path d="M63 14v17h14M37 44h29M37 55h29M37 66h20"/>',
  scissors:'<circle cx="30" cy="72" r="12"/><circle cx="72" cy="72" r="12"/><path d="m38 62 35-46-20 40m11 6L30 16l20 40"/><circle cx="51" cy="53" r="4"/>',
  sealed:'<rect x="17" y="29" width="68" height="48" rx="5"/><path d="m18 31 33 27 33-27M18 75l23-24m43 24L61 51"/><circle cx="51" cy="58" r="9"/>',
  robot:'<path d="M50 12v12"/><circle cx="50" cy="10" r="4"/><rect x="19" y="25" width="63" height="53" rx="13"/><rect x="27" y="35" width="47" height="22" rx="6"/><path d="M38 43v6m25-6v6M40 67h20M12 43v18m77-18v18"/>',
  unknown:'<path d="M38 32c0-18 31-18 31 0 0 14-18 12-18 28"/><circle cx="51" cy="77" r="2"/>',
};
function art(name){return `<svg viewBox="0 0 102 96" aria-hidden="true">${shapes[name]||shapes.unknown}</svg>`;}
let progress=readProgress(null),storageOK=true;
try{progress=readProgress(localStorage.getItem(STORE));}catch{storageOK=false;}
let mode='school',chapter=0,daily=null,dailyStage=0,arenaRound=0,arena=[],state,generation=0;
const badges=()=>Math.max(1,3-state.mistakes-Number(state.guided));
function save(){try{localStorage.setItem(STORE,JSON.stringify(progress));}catch{storageOK=false;}storageNote();}
function storageNote(){$('#storage-status').textContent=storageOK?'Only scores are saved in this browser. No account, uploads, or real secrets.':'Browser storage is unavailable. You can still play; scores will last for this visit only.';}
function chosenLesson(){return mode==='daily'?daily.chapters[dailyStage]:mode==='arena'?1:chapter;}
function stats(){
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
  $('#chapters').hidden=mode!=='school';
  $('#chapters').innerHTML=LESSONS.map((d,i)=>`<button data-chapter="${i}" ${i===chapter?'aria-current="step"':''}><span>0${i+1}<em>${progress.best[i]?progress.best[i]+'/3':''}</em></span>${d.title}</button>`).join('');
  $('#progress').textContent=mode==='school'?`${progress.best.reduce((a,b)=>a+b,0)} / 18 learning badges`:mode==='daily'?`${daily.date} UTC · ${progress.daily?.date===daily.date?'Best '+progress.daily.score+'/3':'New challenge'}`:`Arena best: ${progress.arenaBest===null?'unplayed':progress.arenaBest+' wins / 5'}`;
  $('#arena-score').hidden=mode!=='arena';
  $('#you-score').textContent=arena.filter(x=>x==='win').length;$('#tie-score').textContent=arena.filter(x=>x==='tie').length;$('#bot-score').textContent=arena.filter(x=>x==='loss').length;
}
async function begin({keepAttempt=false,focus=false}={}){
  const token=++generation,old=state,def={...LESSONS[chosenLesson()]};
  if(mode==='arena'){def.title=`Arena round ${arenaRound+1} of 5`;def.brief='Switch commits a random move before you choose. Pick yours, lock it, then reveal and verify. Five rounds, including ties. Your arena score is separate from learning badges.';def.hint='There is no guaranteed winning move against an independent random choice. Pick a move, seal it, and check both openings.';}
  state={def,phase:'choose',busy:true,ready:false,error:null,selected:null,robot:null,robotSeal:null,human:null,humanSeal:null,opening:null,verified:null,guesses:{},found:null,bubble:def.bubble,mistakes:keepAttempt?old.mistakes:0,guided:keepAttempt?old.guided:false,done:false,humanRevealed:false,outcome:null};
  $('#feedback').textContent='';$('#verification').hidden=true;$('#lesson-result').hidden=true;$('#finish').hidden=true;$('#hint-text').hidden=!state.guided;$('#copy-fallback').hidden=true;$('#copy-status').textContent='';$('#receipt').open=false;
  render();
  try{
    requireCrypto();
    const round=`${mode}-${mode==='daily'?daily.date+'-'+dailyStage:mode==='arena'?arenaRound:chapter}-${randomHex(8)}`;
    const robot={round:def.kind==='replay'?'old-'+round:round,player:'switch',move:randomMove(),nonce:randomHex()};
    const seal=def.kind==='open'?null:await commit(robot,def.kind==='guess');
    if(token!==generation)return;
    Object.assign(state,{round,robot,robotSeal:seal,ready:true,busy:false});
    render();if(focus)$('#round-title').focus({preventScroll:true});
  }catch(error){if(token===generation){state.error=error.message;state.busy=false;render();$('#feedback').textContent=error.message;}}
}
function render(){
  const s=state,d=s.def,visible=s.opening||((d.kind==='open'&&s.done)?s.robot:null);
  stats();storageNote();
  $('#play').setAttribute('aria-busy',String(s.busy));
  $('#round-tag').textContent=mode==='daily'?`Daily challenge / ${dailyStage+1} of 3`:mode==='arena'?'Five rounds / every opening verified':`Lesson 0${chapter+1} / ${d.concept}`;
  $('#round-title').textContent=s.error?'The table could not open':d.title;
  $('#brief').textContent=d.brief;$('#round-label').textContent=mode==='daily'?daily.date+' / UTC':d.kind==='open'?'OPEN PLAY':d.kind==='guess'?'WEAK HASH / NO NONCE':'LIVE SHA-256';
  $('#human-art').innerHTML=art(s.humanSeal&&!s.humanRevealed?'sealed':s.selected||'unknown');
  $('#human-move').textContent=s.humanSeal&&!s.humanRevealed?'Sealed.':s.selected?title(s.selected):'Your move?';
  $('#human-status').textContent=s.humanRevealed?'Opened':s.humanSeal?'Committed':'Choosing';
  $('#human-detail').textContent=s.humanRevealed?(d.kind==='open'?'Your move was shown first.':'Your opening is on the record.'):s.humanSeal?'Your move is fixed. Ready to reveal.':s.selected?'You can change this until you lock it.':'Choose a card below.';
  $('#bot-art').innerHTML=art(visible?visible.move:s.found||'robot');
  $('#bot-move').textContent=visible?title(visible.move):s.found?title(s.found):s.phase==='withheld'||(s.done&&d.kind==='abort')?'No reveal.':'Poker face.';
  $('#bot-status').textContent=visible?d.kind==='open'?'Chose second':s.verified?(s.verified.valid?'Verified':'Rejected'):'Claimed':s.found?'Inferred':s.robotSeal?'Seal received':'Waiting';
  $('#bot-detail').textContent=visible?d.kind==='open'?'Picked after seeing your move.':s.verified?(s.verified.valid?'Opening matches the stored seal.':'Opening fails this round’s check.'):'A displayed move is not yet verified.':s.found?'Found by your three-guess lookup.':s.robotSeal?'The hash is public. The move is hidden.':'A professional second-guesser.';
  $('#bubble').innerHTML=`<span>SWITCH SAYS</span>“${escape(s.bubble)}”`;
  $('#moves').innerHTML=MOVES.map((move,i)=>`<button data-move="${move}" aria-pressed="${s.selected===move}" ${s.phase!=='choose'||!s.ready||s.busy||s.error?'disabled':''}>${art(move)}<span>${title(move)}</span><small>BEATS ${['SCISSORS','ROCK','PAPER'][i]}</small></button>`).join('');
  $('#guess-lab').hidden=d.kind!=='guess';
  $('#guesses').innerHTML=MOVES.map(move=>{const g=s.guesses[move];return `<button data-guess="${move}" class="${g?.match?'matched':''}" ${g||s.phase!=='choose'||s.busy||!s.ready?'disabled':''}>Test ${title(move)}<code>${g?g.hash.slice(0,10)+'…':'SHA-256 → ?'}</code>${g?`<small>${g.match?'MATCH':'No match'}</small>`:''}</button>`;}).join('');
  $('#guess-status').textContent=s.found?`Match found: Switch committed to ${s.found}. Pick the move that beats it.`:'These experiments cost no badges.';
  $('#your-seal').textContent=s.humanSeal||'Not committed';$('#bot-seal').textContent=s.robotSeal||(s.busy?'Preparing…':'Not committed');$('#expected-round').textContent=s.round||'Preparing…';
  $('#record-note').textContent=d.kind==='open'?'No commitments were exchanged. Switch can wait for your move.':d.kind==='guess'?'This weak scheme hashes only the public context and one of three moves. There is no secret nonce.':'A seal hashes the round, player, move and a fresh secret nonce. The nonce stays hidden until reveal.';
  const records=[];
  if(s.humanRevealed&&s.human)records.push(`<h4>Your opening</h4><code id="human-opening">${escape(encode(s.human))}</code>`);
  if(s.opening)records.push(`<h4>Switch’s supplied opening</h4><code id="robot-opening">${escape(encode(s.opening,d.kind==='guess'))}</code>`);
  if(d.kind==='replay'&&s.verified)records.push(`<p>The supplied packet names <strong>${escape(s.opening.round)}</strong>. Its hash fits that old round, not the expected round above.</p>`);
  $('#opening-record').innerHTML=records.length?records.join(''):'Moves and secret random values appear here only when revealed.';
  const step=s.done||s.phase==='checked'?4:s.humanRevealed?3:s.humanSeal?2:1;
  $('#steps').innerHTML=['Choose','Commit','Reveal','Verify'].map((name,i)=>`<li class="${i<step?'done':''}">${name}${d.kind==='open'&&i>0?' · skipped':''}</li>`).join('');
  if(d.kind==='open')$('#steps').innerHTML='<li class="done">Choose</li><li>No seal</li><li>Show first</li><li>No check</li>';
  const decision=s.phase==='checked'||s.phase==='withheld';
  $('#decisions').hidden=!decision;$('#accept').hidden=s.phase!=='checked';$('#reject').hidden=s.phase!=='checked';$('#declare-win').hidden=s.phase!=='withheld';$('#incomplete').hidden=s.phase!=='withheld';
  $('#action').hidden=decision;$('#action').disabled=s.busy||!s.ready||!!s.error;
  $('#action').textContent=s.busy?'Checking the record…':s.done?nextLabel():s.phase==='choose'?d.kind==='open'?'Play openly →':'Seal my move →':s.phase==='sealed'?d.kind==='abort'?'Reveal my move →':d.kind==='swap'||d.kind==='replay'?'Reveal the moves →':'Reveal & verify →':'Verify Switch’s seal →';
  $('#hint').disabled=s.done||s.busy||!!s.error;$('#hint-text').textContent=d.hint;
  document.querySelectorAll('#decisions button').forEach(b=>{b.disabled=s.busy||!!s.error;});
}
function nextLabel(){return mode==='school'?chapter<5?'Next lesson →':'See my result →':mode==='daily'?dailyStage<2?'Next daily lesson →':'See daily result →':arenaRound<4?'Next arena round →':'See match result →';}
async function work(operation,apply){
  const token=generation,s=state;s.busy=true;render();
  try{const result=await operation();if(token!==generation)return;apply(result);}
  catch(error){if(token===generation){state.error=error.message;$('#feedback').textContent=error.message;}}
  finally{if(token===generation){state.busy=false;render();}}
}
function fail(message){state.mistakes++;$('#feedback').textContent=message+` Try again. ${badges()}/3 learning badges remain for this attempt.`;}
function displayVerification(check){
  $('#verification').hidden=false;$('#verification').classList.toggle('valid',check.valid);
  $('#verification-title').textContent=check.valid?'The opening matches.':check.contextOK?'The move changed. The hash does not match.':'That seal belongs to another round.';
  $('#verification-text').textContent=check.valid?'The supplied move and random value reproduce the seal fixed before the reveal.':check.contextOK?'Hashing the supplied opening produces a different value from Switch’s stored commitment. The opening must be rejected.':'Verification uses the current round identifier and expected player, supplied independently of the old packet. Reusing an old opening fails that check.';
  $('#stored-hash').textContent=state.robotSeal;$('#computed-hash').textContent=check.computed||'Invalid opening';
}
function complete(resultTitle){
  const s=state;s.done=true;s.phase='done';
  if(mode==='school')progress.best[chapter]=Math.max(progress.best[chapter],badges());
  if(mode==='daily'&&dailyStage===2)progress.daily={date:daily.date,score:Math.max(progress.daily?.date===daily.date?progress.daily.score:0,badges())};
  if(mode==='arena'){arena.push(s.outcome);if(arenaRound===4)progress.arenaBest=Math.max(progress.arenaBest||0,arena.filter(x=>x==='win').length);}
  save();$('#lesson-result').hidden=false;
  $('#earned').textContent=mode==='arena'?`Verified round ${arenaRound+1} / 5`:mode==='daily'&&dailyStage<2?`Lesson ${dailyStage+1} complete · ${badges()} badges still available`:`${badges()} / 3 learning badges`;
  $('#outcome-title').textContent=resultTitle;$('#lesson').textContent=s.def.lesson;
  $('#feedback').textContent='Read what happened, then continue.';render();$('#lesson-result').focus({preventScroll:true});$('#lesson-result').scrollIntoView({block:'nearest'});
}
function roundTitle(result){return result==='win'?'You win this round.':result==='tie'?'A verified tie.':'Switch wins this round.';}
async function reveal(){
  const s=state,kind=s.def.kind,opening=kind==='swap'?{...s.robot,move:counter(s.robot.move)}:{...s.robot};
  await work(async()=>{
    const humanCheck=await verify(s.humanSeal,s.human,{round:s.round,player:'you'});
    if(!humanCheck.valid)throw new Error('Your opening failed verification. Restart this round.');
    const botCheck=['sealed','guess'].includes(kind)?await verify(s.robotSeal,opening,{round:s.round,player:'switch'},kind==='guess'):null;
    return botCheck;
  },check=>{
    s.humanRevealed=true;
    if(kind==='abort'){s.phase='withheld';s.bubble='Actually… I have somewhere else to be.';$('#feedback').textContent='Your opening verified. Switch has withheld its move and nonce. There is no verified round outcome.';return;}
    s.opening=opening;
    if(check){
      if(!check.valid)throw new Error('The opening failed verification. No game result was awarded.');
      s.verified=check;s.outcome=outcome(s.selected,s.opening.move);s.bubble=s.outcome==='win'?'Fair enough. You got me.':s.outcome==='tie'?'Great minds. Same move.':'A clean win. You can check the receipt.';displayVerification(check);complete(roundTitle(s.outcome));
    }else{s.phase='revealed';s.bubble=kind==='swap'?'This was definitely my move all along.':'A seal is a seal. Does the date really matter?';$('#feedback').textContent='Switch has supplied an opening. Recompute its hash before accepting the move.';}
  });
}
$('#action').addEventListener('click',async()=>{
  const s=state;if(s.busy||s.error||!s.ready)return;
  if(s.done){
    if(mode==='school'&&chapter<5){chapter++;await begin({focus:true});}
    else if(mode==='daily'&&dailyStage<2){dailyStage++;await begin({keepAttempt:true,focus:true});}
    else if(mode==='arena'&&arenaRound<4){arenaRound++;await begin({focus:true});}
    else finish();return;
  }
  if(s.phase==='choose'){
    if(!s.selected){$('#feedback').textContent='Choose rock, paper or scissors first.';return;}
    if(s.def.kind==='open'){s.robot.move=counter(s.selected);s.outcome='loss';s.humanRevealed=true;s.bubble=`I saw ${s.selected}. So I choose ${s.robot.move}.`;complete('Switch waited. Switch won.');return;}
    if(s.def.kind==='guess'){
      if(!s.found){$('#feedback').textContent='Find the matching hash with the guess buttons before locking your move.';return;}
      if(outcome(s.selected,s.found)!=='win'){fail(`The matching hash identified ${s.found}. Choose ${counter(s.found)} to beat that move.`);return;}
    }
    let human;
    await work(()=>{human={round:s.round,player:'you',move:s.selected,nonce:randomHex()};return commit(human);},seal=>{s.human=human;s.humanSeal=seal;s.phase='sealed';s.bubble='Two seals on the table. No take-backs.';$('#feedback').textContent='Your move and secret nonce are now committed. Both hashes are fixed before the reveals.';});
  }else if(s.phase==='sealed')await reveal();
  else if(s.phase==='revealed')await work(()=>verify(s.robotSeal,s.opening,{round:s.round,player:'switch'}),check=>{s.verified=check;s.phase='checked';displayVerification(check);$('#feedback').textContent='Use the computed result to decide whether this opening counts.';});
});
$('#moves').addEventListener('click',event=>{
  const b=event.target.closest('[data-move]');if(!b||b.disabled||state.phase!=='choose'||state.busy)return;
  state.selected=b.dataset.move;render();$(`[data-move="${state.selected}"]`).focus({preventScroll:true});
});
$('#guesses').addEventListener('click',async event=>{
  const b=event.target.closest('[data-guess]');if(!b||b.disabled||state.busy||state.phase!=='choose')return;
  const s=state,move=b.dataset.guess;
  await work(()=>commit({round:s.round,player:'switch',move},true),hash=>{const match=hash===s.robotSeal;s.guesses[move]={hash,match};if(match){s.found=move;s.bubble='Wait. How did you know?';}});
  if(state===s)$(`[data-move="${counter(s.found||move)}"]`).focus({preventScroll:true});
});
$('#accept').addEventListener('click',()=>{if(state.phase!=='checked'||state.busy)return;if(!state.verified.valid)fail('The opening failed verification. A displayed move or an old valid seal does not make this round valid.');});
$('#reject').addEventListener('click',()=>{if(state.phase!=='checked'||state.busy)return;if(state.verified.valid){fail('This opening matches. Rejecting a valid move is not what the check calls for.');return;}state.bubble=state.def.kind==='replay'?'Fine. I will bring a fresh promise next time.':'Caught by my own hash.';complete(state.def.kind==='replay'?'Old seal. Wrong round.':'The switch did not stick.');});
$('#declare-win').addEventListener('click',()=>{if(state.phase==='withheld')fail('The opponent never opened its commitment. Without an agreed forfeit rule, you cannot call this a verified win.');});
$('#incomplete').addEventListener('click',()=>{if(state.phase==='withheld')complete('Incomplete. Honestly recorded.');});
$('#hint').addEventListener('click',()=>{state.guided=true;$('#hint-text').hidden=false;$('#hint-text').textContent=state.def.hint;$('#feedback').textContent=mode==='arena'?'Arena hint open. No learning badges are at stake.':`Guidance used. This attempt can earn ${badges()}/3 learning badges.`;});
$('#chapters').addEventListener('click',event=>{const b=event.target.closest('[data-chapter]');if(b){mode='school';chapter=Number(b.dataset.chapter);void begin({focus:true});}});
for(const b of document.querySelectorAll('[data-mode]'))b.addEventListener('click',()=>{mode=b.dataset.mode;if(mode==='daily'){daily=dailyPlan(new Date().toISOString().slice(0,10));dailyStage=0;}if(mode==='arena'){arenaRound=0;arena=[];}void begin();});
$('#restart').addEventListener('click',()=>{if(mode==='daily')dailyStage=0;if(mode==='arena'){arenaRound=0;arena=[];}void begin({focus:true});});
function finish(){
  $('#finish').hidden=false;
  $('#finish-title').textContent=mode==='arena'?arena.filter(x=>x==='win').length>arena.filter(x=>x==='loss').length?'You won the match.':arena.filter(x=>x==='win').length===arena.filter(x=>x==='loss').length?'An even match.':'Switch takes this match.':mode==='daily'?'Today’s promises checked.':'Promises checked. Lessons earned.';
  $('#finish-text').textContent=mode==='arena'?`5/5 verified rounds · You ${arena.filter(x=>x==='win').length}, Switch ${arena.filter(x=>x==='loss').length}, ties ${arena.filter(x=>x==='tie').length}. Every recorded move matched its commitment.`:mode==='daily'?`${daily.date} UTC · 3/3 lessons completed · ${badges()}/3 learning badges this attempt.`:`${progress.best.filter(x=>x>0).length}/6 lessons completed · ${progress.best.reduce((a,b)=>a+b,0)}/18 best learning badges. Try the arena to put honest commit–reveal rounds into practice.`;
  $('#finish').scrollIntoView({block:'nearest'});$('#copy-result').focus({preventScroll:true});
}
$('#copy-result').addEventListener('click',async()=>{const text=`Sealed Showdown · ${$('#finish-text').textContent}\nhttps://crypto-lab.systemslibrarian.dev/games/sealed-showdown/`;try{await navigator.clipboard.writeText(text);$('#copy-status').textContent='Result copied.';$('#copy-fallback').hidden=true;}catch{$('#copy-fallback').value=text;$('#copy-fallback').hidden=false;$('#copy-fallback').focus();$('#copy-fallback').select();$('#copy-status').textContent='Select and copy your result below.';}});
$('#clear-progress').addEventListener('click',()=>{progress=readProgress(null);try{localStorage.removeItem(STORE);}catch{storageOK=false;}mode='school';chapter=0;void begin();});
void begin();
