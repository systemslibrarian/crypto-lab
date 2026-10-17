import { STORE,COLS,ROWS,EXIT,NAMES,LEVELS,cleanProgress,create,start,move,tick,pause,hazards,explanation,recoveryEvidence } from './core.mjs';
const $=id=>document.getElementById(id),canvas=$('arena'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let storageOK=true,raw=null,saved;
try{raw=localStorage.getItem(STORE);}catch{storageOK=false;}
try{saved=cleanProgress(JSON.parse(raw));}catch{saved=cleanProgress(null);}
let state=create(),previous=null,held=null,nextMoveAt=0,lastFrame=null,audioContext,audioEpoch=0,lastSoundEvent=-1;
let seenResult=null;
let audience='home',removeOne=false,candidate=0,notice=null,trail=[];
const DIRS={up:[0,-1],left:[-1,0],down:[0,1],right:[1,0]};
const KEYS={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
function save(){try{localStorage.setItem(STORE,JSON.stringify(saved));}catch{storageOK=false;}storageNote();}
function storageNote(){$('storage-note').textContent=storageOK?'':'Progress cannot be saved here. Every arena and retry still works.';}
function sound(kind='move'){
 if(!saved.sound)return;
 const epoch=audioEpoch;
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audioContext||=new Audio();
  const play=()=>{if(epoch!==audioEpoch||!saved.sound)return;(kind==='win'?[440,554,659,880]:kind==='offline'?[180,100]:kind==='copy'?[620,880]:[kind==='deliver'?660:330]).forEach((frequency,i)=>{
   const o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime+i*.09;o.type='triangle';o.frequency.value=frequency;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+.17);
  });};
  if(audioContext.state==='suspended')audioContext.resume().then(play).catch(()=>{});else play();
 }catch{/* Audio is optional. */}
}
function change(next){
 const before=state;
 state=next;
 if(state.active!==before.active)trail=[];
 else if(state.x!==before.x||state.y!==before.y)trail=[...trail,{x:before.x,y:before.y}].slice(-7);
 const copied=state.copied.length>before.copied.length,offline=state.offline.length>before.offline.length,delivered=state.delivered.length>before.delivered.length;
 if(copied||offline||delivered){
  const id=offline?state.offline.at(-1):copied?state.copied.at(-1):state.delivered.at(-1);
  notice={kind:offline?'offline':copied?'copy':'deliver',at:state.elapsed,bot:id,
   title:offline?`${NAMES[id]} offline`:copied?`${NAMES[id]}’s share copied`:`${NAMES[id]} delivered`,
   copy:offline?(state.copied.includes(id)?'The stolen copy survives. This bot cannot deliver.':'No share copied. This bot cannot deliver.'):
    copied?(delivered?'Copied AND delivered. The original still worked.':'Original intact — this bot can still deliver!'):`${state.delivered.length} / ${state.threshold} distinct shares home.`};
 }
 if(state.active!==before.active||state.phase!=='playing')held=null;
 if(state.event!==before.event){
  if(state.phase==='result'&&state!==seenResult){
   seenResult=state;
   if(state.reason==='win'){saved.completed[state.level]=true;save();}
   audience=state.reason==='breach'?'scanners':'home';removeOne=false;candidate=0;renderLesson();
   $('lesson-title').focus({preventScroll:true});
  }
  if(state.event!==lastSoundEvent){sound(state.reason==='win'?'win':offline?'offline':copied?'copy':'deliver');lastSoundEvent=state.event;}
 }
 renderUI();draw();
}
function ready(level=state.level,threshold=LEVELS[level].threshold){
 if(state.phase==='result')previous={level:state.level,threshold:state.threshold,delivered:state.delivered.length,copied:state.copied.length,offline:state.offline.length,reason:state.reason};
 held=null;lastFrame=null;nextMoveAt=0;audioEpoch++;seenResult=null;lastSoundEvent=-1;notice=null;trail=[];audience='home';removeOne=false;candidate=0;
 state=create(level,threshold);$('lesson-panel').hidden=true;renderThresholds();renderUI();draw();
}
function beginRun(){
 try{if(state.phase==='result')ready(state.level,state.threshold);change(start(state));held=null;lastFrame=null;nextMoveAt=0;canvas.focus({preventScroll:true});if(innerWidth<=700)document.querySelector('.game-panel').scrollIntoView({block:'start'});}
 catch(e){$('game-status').textContent=e.message;}
}
function step(direction,boost=false){if(state.phase!=='playing')return;const d=DIRS[direction];if(d)change(move(state,d[0],d[1],boost));}
function doBoost(){if(state.phase==='playing'){change(move(state,state.dx,state.dy,true));nextMoveAt=state.elapsed+140;}}
function pauseRun(){held=null;lastFrame=null;change(pause(state));if(state.phase==='playing')canvas.focus({preventScroll:true});}
function renderThresholds(){
 $('thresholds').replaceChildren();
 for(let k=2;k<=LEVELS[state.level].bots;k++){const b=document.createElement('button');b.dataset.threshold=k;b.textContent=k;b.setAttribute('aria-label',`${k} shares needed`);b.addEventListener('click',()=>ready(state.level,k));$('thresholds').append(b);}
}
function renderLesson(){
 const e=explanation(state);$('lesson-panel').hidden=false;$('lesson-title').textContent=e.title;$('lesson').textContent=e.lesson;$('connection').textContent=e.connection;
 $('compare').hidden=!previous||previous.level!==state.level;
 if(previous&&previous.level===state.level)$('compare').textContent=`Last run: threshold ${previous.threshold}, ${previous.delivered} delivered, ${previous.copied} copied, ${previous.offline} offline. This run: threshold ${state.threshold}, ${state.delivered.length} delivered, ${state.copied.length} copied, ${state.offline.length} offline.`;
 renderRecovery();
}
function renderRecovery(){
 const e=recoveryEvidence(state,audience,removeOne,candidate),enough=e.value!==null;
 $('view-home').setAttribute('aria-pressed',String(audience==='home'));$('view-scanners').setAttribute('aria-pressed',String(audience==='scanners'));
 $('recovery-count').textContent=`${audience==='home'?'Home':'Scanners'} received ${e.received} distinct share${e.received===1?'':'s'}. Using ${e.points.length} of ${e.threshold} needed${e.removed?' after setting one aside':''}.`;
 $('recovery-shares').innerHTML=e.points.length?e.points.map(p=>`<span class="share-chip" data-recovery-id="${p.id}"><b>${NAMES[p.id]}</b><code>(${p.x}, ${p.y})</code></span>`).join(''):'<span class="no-shares">No shares received</span>';
 $('recovery-output').dataset.determined=String(enough);
 $('recovery-label').textContent=enough?'ONE POSSIBLE KEY · RECONSTRUCTED':'KEY STILL UNKNOWN';
 $('recovery-value').textContent=enough?String(e.value):`${e.possibilities.length} possibilities`;
 $('recovery-why').textContent=enough?`These ${e.points.length} shares pin down the key. They reconstruct ${e.value} using the calculation below.`:`From these shares alone, every key from 0 to 16 still fits. Being one share short does not mean knowing part of the key.`;
 $('remove-share').hidden=e.received<e.threshold;$('remove-share').setAttribute('aria-pressed',String(removeOne));$('remove-share').textContent=removeOne?'Put the share back':'Try one fewer share';
 $('removed-share').hidden=!e.removed;if(e.removed)$('removed-share').textContent=`Set aside ${NAMES[e.removed.id]}’s share (${e.removed.x}, ${e.removed.y}). This experiment does not change your finished run.`;
 $('candidate-panel').hidden=enough;
 for(const b of $('candidate-keys').children)b.setAttribute('aria-pressed',String(Number(b.dataset.candidate)===candidate));
 if(!enough)$('candidate-witness').textContent=`Candidate ${candidate} works: ${['f(0) = '+e.witness[0].y,...e.points.map(p=>`f(${p.x}) = ${e.witness[p.x].y}`)].join('; ')}. ${e.points.length?'Every shown share matches.':'With no shares observed, nothing rules this key out.'}`;
 $('recovery-steps').replaceChildren();
 if(enough){
  const intro=document.createElement('p');intro.textContent='Each y value is multiplied by its Lagrange weight at x = 0. All arithmetic wraps modulo 17.';$('recovery-steps').append(intro);
  const list=document.createElement('ol');for(const t of e.terms){const li=document.createElement('li');li.dataset.term=t.id;li.textContent=`${NAMES[t.id]}: ${t.y} × ${t.weight} = ${t.contribution} (mod 17)`;list.append(li);}$('recovery-steps').append(list);
  const sum=document.createElement('p');sum.className='recovery-sum';sum.textContent=`(${e.terms.map(t=>t.contribution).join(' + ')}) mod 17 = ${e.value}. That is the recovered key.`;$('recovery-steps').append(sum);
 }else{
  const p=document.createElement('p');p.textContent=`For each candidate, we construct a polynomial through (0, candidate) and all ${e.points.length} observed shares. Its degree is at most ${e.points.length}, below the threshold ${e.threshold}. Every candidate is compatible. Shamir’s uniformly random coefficients make the shares reveal no information about the secret.`;$('recovery-steps').append(p);
 }
}
function renderUI(){
 const level=LEVELS[state.level],playing=state.phase==='playing';
 $('arena-wrap').dataset.phase=state.phase;canvas.dataset.phase=state.phase;canvas.dataset.position=`${state.x},${state.y}`;canvas.dataset.active=String(state.active);canvas.dataset.elapsed=String(Math.round(state.elapsed));canvas.dataset.reason=state.reason||'';
 document.querySelector('.play-controls').hidden=state.phase==='result';$('controls-help').hidden=state.phase==='result';
 $('event-toast').hidden=!notice||state.phase!=='playing'||state.elapsed-notice.at>=1900;
 if(notice){$('event-toast').dataset.kind=notice.kind;$('event-title').textContent=notice.title;$('event-copy').textContent=notice.copy;}
 $('home-count').textContent=`${state.delivered.length} / ${state.threshold}`;$('copy-count').textContent=`${state.copied.length} / ${state.threshold}`;
 const seconds=Math.floor(state.elapsed/1000);$('time').textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
 // Update the live region only for meaningful events, never for animation frames.
 if($('game-status').textContent!==state.message)$('game-status').textContent=state.message;
 $('bots').innerHTML=Array.from({length:level.bots},(_,i)=>`<span class="bot-badge${state.active===i&&playing?' current':''}${state.delivered.includes(i)?' delivered':''}${state.copied.includes(i)?' copied':''}${state.offline.includes(i)?' offline':''}" aria-label="${NAMES[i]}: ${state.delivered.includes(i)?'delivered':state.offline.includes(i)?'offline':state.active===i?'current bot':'waiting'}${state.copied.includes(i)?', share copied':''}">${NAMES[i]}${state.delivered.includes(i)?' +':''}</span>`).join('');
 $('pause').disabled=!['playing','paused'].includes(state.phase);$('pause').textContent=state.phase==='paused'?'Resume':'Pause';
 $('boost').disabled=!playing||state.elapsed<state.boostAt;$('boost-state').textContent=state.elapsed<state.boostAt?'Recharging…':'Space / tap';
 for(const b of document.querySelectorAll('[data-direction]'))b.disabled=!playing;
 $('level-name').textContent=level.name;$('arena-tip').textContent=level.tip;
 for(const b of $('levels').children){const i=Number(b.dataset.level);b.setAttribute('aria-pressed',String(i===state.level));b.classList.toggle('complete',saved.completed[i]);}
 for(const b of $('thresholds').children){b.setAttribute('aria-pressed',String(Number(b.dataset.threshold)===state.threshold));b.disabled=['playing','paused'].includes(state.phase);}
 $('policy').textContent=`${state.threshold} of ${level.bots} deliveries unlock your key. ${state.threshold} distinct stolen shares expose it. You can lose ${level.bots-state.threshold} ${level.bots-state.threshold===1?'bot':'bots'} and still recover.`;
 $('slow').checked=saved.slow;$('slow').disabled=['playing','paused'].includes(state.phase);
 $('sound').textContent=saved.sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(saved.sound));
 $('overlay').hidden=playing;$('next').hidden=state.phase!=='result';
 if(state.phase==='ready'){$('overlay-kicker').textContent=level.name;$('overlay-title').textContent=`Get ${state.threshold} bots home.`;$('overlay-copy').textContent=`Each bot carries a different share of one secret key. Deliver ${state.threshold} to unlock it. Keep scanners below ${state.threshold} distinct stolen copies.`;$('start').textContent='Start run →';$('overlay-hint').textContent='Arrows / WASD or direction buttons. Space = boost.';}
 else if(state.phase==='paused'){$('overlay-kicker').textContent='Take a breath';$('overlay-title').textContent='Paused.';$('overlay-copy').textContent='Your bots and the hazards are frozen. Resume when you’re ready.';$('start').textContent='Keep going →';$('overlay-hint').textContent='P / Escape also resumes.';}
 else if(state.phase==='result'){
  const e=explanation(state);$('overlay-kicker').textContent=state.reason==='win'?'RUN COMPLETE':'RETRY IS FREE';$('overlay-title').textContent=e.title;
  $('overlay-copy').textContent=state.reason==='win'?`${state.delivered.length} shares home recovered key ${state.recovered}. Try removing one share below to see why the threshold matters.`:state.reason==='breach'?`${state.copied.length} different stolen shares reconstructed key ${state.exposed}. Compare the scanners’ shares with Home below.`:`Only ${level.bots-state.offline.length} bots remained available. Your threshold needed ${state.threshold}. See why the shares at Home are insufficient below.`;$('overlay-hint').textContent='Rebuild the key below the arena.';$('start').textContent='Run again →';$('next').textContent=state.reason==='win'?'Why did it unlock? ↓':state.reason==='breach'?'How was it exposed? ↓':'Why was it lost? ↓';$('next-arena').textContent=state.level===2?'First arena →':'Next arena →';
 }
 if(state.dealt){
  $('share-table').innerHTML=state.dealt.shares.map(p=>`<tr><th scope="row">${NAMES[p.id]}</th><td data-point="${p.id}">(${p.x}, ${p.y})</td><td>${state.delivered.includes(p.id)?'Yes':'No'}</td><td>${state.copied.includes(p.id)?'Yes':'No'}</td><td>${state.offline.includes(p.id)?'Yes':'No'}</td></tr>`).join('');
  $('math-summary').textContent=`Actual ${state.threshold}-of-${level.bots} Shamir shares, calculated modulo 17. ${state.phase==='result'?`Dealer’s secret: ${state.dealt.secret}. Delivered shares recovered: ${state.recovered??'not recovered'}. Scanners recovered: ${state.exposed??'not determined'}.`:'The original secret is shown after the run. This inspector is for learning; a real scanner would not see all shares.'}`;
 }else{$('share-table').replaceChildren();$('math-summary').textContent='Start a run to generate real Shamir shares. Replays use fresh randomness; no shares or secrets are saved.';}
 storageNote();
}
function roundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
function robot(x,y,color,size=1,copied=false){
 ctx.save();ctx.translate(x,y);ctx.scale(size,size);
 ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(0,23,25,8,0,0,Math.PI*2);ctx.fill();
 roundRect(-23,-18,46,40,11,color);roundRect(-16,-10,32,18,7,'#11192e');
 ctx.fillStyle='#f8ffff';ctx.fillRect(-10,-5,6,7);ctx.fillRect(4,-5,6,7);
 ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(0,-28);ctx.stroke();ctx.fillStyle='#ff99ca';ctx.beginPath();ctx.arc(0,-30,4,0,Math.PI*2);ctx.fill();
 roundRect(-17,20,10,9,3,'#7483a4');roundRect(7,20,10,9,3,'#7483a4');
 if(copied){ctx.fillStyle='#6de8f4';ctx.font='bold 22px Arial';ctx.fillText('!',25,-14);}
 ctx.restore();
}
function draw(){
 if(!ctx)return;
 const cell=80,h=hazards(state);ctx.clearRect(0,0,canvas.width,canvas.height);
 for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){ctx.fillStyle=(x+y)%2?'#10192c':'#121d33';ctx.fillRect(x*cell,y*cell,cell,cell);ctx.strokeStyle='#27324d55';ctx.lineWidth=1;ctx.strokeRect(x*cell,y*cell,cell,cell);}
 // Safe start lane and the bright exit are visible during planning as well as play.
 ctx.fillStyle='#c6ff5e12';ctx.fillRect(0,0,cell,canvas.height);ctx.fillRect(EXIT.x*cell,0,cell,canvas.height);
 ctx.font='bold 11px Arial';ctx.textAlign='center';ctx.fillStyle='#b7c5d9';ctx.fillText('START',40,20);ctx.fillStyle='#c6ff5e';ctx.fillText('HOME',840,20);
 roundRect(EXIT.x*cell+8,EXIT.y*cell+8,64,64,12,'#c6ff5e22','#c6ff5e');ctx.font='bold 38px Arial';ctx.fillStyle='#c6ff5e';ctx.fillText('→',840,EXIT.y*cell+53);
 for(const s of h.scanners){
  for(let y=0;y<ROWS;y++){
   if(y===s.gap){roundRect(s.x*cell+9,y*cell+8,62,64,8,'#c6ff5e0a','#749b51');ctx.fillStyle='#b9e38b';ctx.font='10px Arial';ctx.fillText('GAP',s.x*cell+40,y*cell+45);continue;}
   ctx.fillStyle=s.active?'#48e7f238':'#48e7f20b';ctx.fillRect(s.x*cell+20,y*cell,40,cell);ctx.fillStyle=s.active?'#6de8f4':'#375b70';ctx.fillRect(s.x*cell+37,y*cell,6,cell);
  }
  roundRect(s.x*cell+19,5,42,23,6,s.active?'#6de8f4':'#2b576a');ctx.fillStyle='#11192e';ctx.font='bold 9px Arial';ctx.fillText(s.active?'SCAN':'OFF',s.x*cell+40,21);
 }
 for(const j of h.jammers){
  ctx.save();ctx.translate(j.x*cell+40,j.y*cell+40);ctx.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?21:31;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fillStyle=j.active?'#fa79b4':'#50334c';ctx.fill();ctx.strokeStyle='#ffb1d2';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=j.active?'#391129':'#d69bb6';ctx.font='bold 24px Arial';ctx.fillText(j.active?'×':'·',0,8);ctx.restore();
 }
 for(const [x,y] of LEVELS[state.level].walls){roundRect(x*cell+4,y*cell+4,72,72,9,'#29324c','#4b5573');ctx.strokeStyle='#606c8d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x*cell+15,y*cell+25);ctx.lineTo(x*cell+65,y*cell+25);ctx.moveTo(x*cell+15,y*cell+50);ctx.lineTo(x*cell+65,y*cell+50);ctx.stroke();}
 if(!reduced.matches&&state.phase==='playing'){
  if(trail.length){ctx.beginPath();[...trail,{x:state.x,y:state.y}].forEach((p,i)=>i?ctx.lineTo(p.x*cell+40,p.y*cell+40):ctx.moveTo(p.x*cell+40,p.y*cell+40));ctx.strokeStyle='#c6ff5e35';ctx.lineWidth=9;ctx.lineCap='round';ctx.stroke();ctx.lineCap='butt';}
  if(notice&&notice.bot===state.active&&state.elapsed-notice.at<650){const t=(state.elapsed-notice.at)/650;ctx.beginPath();ctx.arc(state.x*cell+40,state.y*cell+40,25+t*28,0,Math.PI*2);ctx.strokeStyle=notice.kind==='offline'?'#ff8dbb':notice.kind==='copy'?'#6de8f4':'#c6ff5e';ctx.globalAlpha=1-t;ctx.lineWidth=3;ctx.stroke();ctx.globalAlpha=1;}
 }
 if(state.active!==null){robot(state.x*cell+40,state.y*cell+40,state.copied.includes(state.active)?'#8adce8':'#c6ff5e',.85,state.copied.includes(state.active));ctx.font='bold 11px Arial';ctx.fillStyle='#fff';ctx.fillText(NAMES[state.active],state.x*cell+40,state.y*cell+75);}
 if(state.reason==='win'&&!reduced.matches){for(let i=0;i<30;i++){const x=(i*137+29)%880,y=(i*83+47)%560;ctx.fillStyle=['#c6ff5e','#ff8dbb','#6de8f4'][i%3];ctx.fillRect(x,y,5,9);}}
}
function frame(now){
 if(lastFrame===null)lastFrame=now;
 const dt=Math.min(80,Math.max(0,now-lastFrame))*(saved.slow ? .6 : 1);lastFrame=now;
 if(state.phase==='playing'){
  change(tick(state,dt));
  if(held&&state.phase==='playing'&&state.elapsed>=nextMoveAt){step(held);nextMoveAt=state.elapsed+140;}
 }
 requestAnimationFrame(frame);
}
LEVELS.forEach((l,i)=>{const b=document.createElement('button');b.dataset.level=i;b.textContent=String(i+1);b.setAttribute('aria-label',`Arena ${i+1}: ${l.name}`);b.addEventListener('click',()=>ready(i));$('levels').append(b);});
$('start').addEventListener('click',()=>state.phase==='paused'?pauseRun():beginRun());
$('next').addEventListener('click',()=>{$('lesson-panel').scrollIntoView({block:'start'});$('lesson-title').focus({preventScroll:true});});
$('next-arena').addEventListener('click',()=>{ready((state.level+1)%LEVELS.length);document.querySelector('.game-panel').scrollIntoView({block:'start'});$('start').focus({preventScroll:true});});
$('reset').addEventListener('click',()=>ready(state.level,state.threshold));
$('pause').addEventListener('click',pauseRun);
$('boost').addEventListener('click',doBoost);
for(const b of document.querySelectorAll('[data-direction]')){
 b.addEventListener('pointerdown',e=>{e.preventDefault();if(state.phase!=='playing')return;b.setPointerCapture(e.pointerId);held=b.dataset.direction;step(held);nextMoveAt=state.elapsed+170;});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>{held=null;});
 b.addEventListener('click',e=>{if(e.detail===0)step(b.dataset.direction);});
}
document.addEventListener('keydown',e=>{
 if(e.target.matches('input,textarea,select'))return;
 if(['p','P','Escape'].includes(e.key)&&['playing','paused'].includes(state.phase)){e.preventDefault();if(!e.repeat)pauseRun();return;}
 if(state.phase!=='playing')return;
 if(KEYS[e.key]){e.preventDefault();if(!e.repeat){held=KEYS[e.key];step(held);nextMoveAt=state.elapsed+170;}}
 else if(e.code==='Space'&&(e.target===canvas||e.target===document.body)){e.preventDefault();if(!e.repeat)doBoost();}
});
document.addEventListener('keyup',e=>{if(KEYS[e.key]===held)held=null;});
window.addEventListener('blur',()=>{held=null;if(state.phase==='playing')pauseRun();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){held=null;if(state.phase==='playing')pauseRun();}});
$('slow').addEventListener('change',()=>{saved.slow=$('slow').checked;save();});
$('sound').addEventListener('click',()=>{saved.sound=!saved.sound;audioEpoch++;save();renderUI();sound();});
$('clear').addEventListener('click',()=>{try{localStorage.removeItem(STORE);}catch{storageOK=false;}saved=cleanProgress(null);previous=null;ready(0);$('game-status').textContent='Arcade progress and preferences cleared.';});
$('lesson-title').tabIndex=-1;
for(const party of ['home','scanners'])$('view-'+party).addEventListener('click',()=>{audience=party;removeOne=false;candidate=0;renderRecovery();});
$('remove-share').addEventListener('click',()=>{removeOne=!removeOne;candidate=0;renderRecovery();});
for(let i=0;i<17;i++){const b=document.createElement('button');b.dataset.candidate=i;b.textContent=i;b.setAttribute('aria-label',`Try key ${i}`);b.addEventListener('click',()=>{candidate=i;renderRecovery();});$('candidate-keys').append(b);}
renderThresholds();renderUI();draw();requestAnimationFrame(frame);
