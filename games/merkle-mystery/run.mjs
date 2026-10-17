import { STORE,RUNS,range,progress,prepareRun,candidates,join,rewind,decide,takeaway } from './run-core.mjs';
const $=id=>document.getElementById(id),short=hash=>hash.slice(0,8)+'…'+hash.slice(-4);
let state=null,selected=null,busy=false,generation=0,requested=0,storageOK=true,saved,audioContext,audioEpoch=0;
try{saved=progress(JSON.parse(localStorage.getItem(STORE)));}catch{saved=progress(null);try{localStorage.getItem(STORE);}catch{storageOK=false;}}
function storageNote(){$('storage-note').textContent=storageOK?'':'Saving is unavailable here. All puzzles and retries still work.';}
function save(){try{localStorage.setItem(STORE,JSON.stringify(saved));}catch{storageOK=false;}storageNote();}
function tone(success=true){
 if(!saved.sound)return;
 const epoch=audioEpoch;
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audioContext||=new Audio();
  const play=()=>{if(epoch!==audioEpoch||!saved.sound)return;for(const [i,f] of (success?[440,660]:[240,200]).entries()){
   const o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime+i*.08;
   o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+.17);
  }};
  if(audioContext.state==='suspended')audioContext.resume().then(play).catch(()=>{});else play();
 }catch{/* Optional sound must never block play. */}
}
function cells(parent,first,last,size){parent.replaceChildren();for(let i=1;i<=size;i++){const cell=document.createElement('i');cell.classList.toggle('lit',i>=first&&i<=last);parent.append(cell);}}
function announce(message,warning=false){$('feedback').textContent=message;$('feedback').classList.toggle('warning',warning);}
function controls(){
 $('game').setAttribute('aria-busy',String(busy));
 for(const b of $('choices').children)b.disabled=busy;
 $('join-left').disabled=$('join-right').disabled=busy||!selected||state?.phase!=='build';
 $('undo').disabled=busy||!state?.steps.length;
 $('hint').disabled=busy||state?.phase!=='build';
 $('accept').disabled=$('reject').disabled=busy||state?.phase!=='judge';
 $('next').disabled=busy;
}
function renderRoute(){
 const count=Math.log2(state.mission.size);$('route').replaceChildren();
 for(let level=0;level<=count;level++){
  const p=document.createElement('div');p.className='platform';p.dataset.level=level;
  p.classList.toggle('reached',level<=state.level);p.classList.toggle('current',level===state.level);
  const coverage=range(level,Math.floor(state.mission.target/2**level));
  const title=document.createElement('span');title.textContent=level===count?'ROOT':coverage.label;
  const hash=document.createElement('small');hash.textContent=level<=state.level?short(level===0?(state.steps[0]?.input||state.current):state.steps[level-1].hash):'Next jump';
  p.append(title,hash);$('route').append(p);
 }
 $('budget').textContent=`${state.steps.length} / ${count}`;$('budget-note').textContent=`One item + ${count} hashes. The other ${state.mission.size-1} records stay behind.`;
}
function renderChoices(){
 $('choices').replaceChildren();
 for(const c of candidates(state)){
  const button=document.createElement('button');button.className='choice';button.dataset.node=c.id;button.dataset.index=c.index;button.setAttribute('aria-pressed',String(selected===c.id));
  const title=document.createElement('strong');title.textContent=c.label;
  const dots=document.createElement('div');dots.className='cells';dots.setAttribute('aria-hidden','true');cells(dots,c.first,c.last,state.mission.size);
  const hash=document.createElement('code');hash.textContent=short(c.hash);
  button.append(title,dots,hash);button.addEventListener('click',()=>{
   if(busy||state.phase!=='build')return;selected=c.id;
   for(const b of $('choices').children)b.setAttribute('aria-pressed',String(b.dataset.node===selected));
   $('selected').textContent=`${c.label} selected. Which side of your block?`;controls();
  });$('choices').append(button);
 }
 const choice=candidates(state).find(c=>c.id===selected);$('selected').textContent=choice?`${choice.label} selected. Which side of your block?`:'Choose a fingerprint tile.';
}
const ART=[
 '<path d="M23 13h25v31l16 9v13H19V50h4Z"/><path d="M27 22h16m-16 9h16M19 57h45m-7-44 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
 '<path d="m18 55 8-19 12-9 16 3 10 16-9 14H29Z"/><path d="m31 31-6-16 17 12m11 3 11-13-2 22M21 47 8 38l4 22 16 1m12-14v5m12-14v5m-16 9h10"/>',
 '<path d="m12 49 49-25 9 18-49 25Z"/><path d="m22 49 37-18m-25 4-1-14 9 7 6-16 2 15"/><circle cx="28" cy="66" r="4"/><circle cx="62" cy="49" r="4"/>',
 '<path d="M17 47V35a23 23 0 0 1 46 0v12"/><rect x="12" y="40" width="15" height="24" rx="6"/><rect x="53" y="40" width="15" height="24" rx="6"/><path d="m40 29 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z"/>'
];
function renderMath(){
 $('record-full').textContent=`Delivered item bytes (before the leaf prefix): ${JSON.stringify([state.record.title,state.record.text])}`;
 $('calculations').replaceChildren();
 for(const [i,s] of state.steps.entries()){
  const pre=document.createElement('pre');pre.textContent=`Jump ${i+1}: sibling on the ${s.side}\nLEFT  ${s.left}\nRIGHT ${s.right}\nSHA256(01 || left || right)\n=     ${s.hash}`;$('calculations').append(pre);
 }
 $('preview').textContent=state.preview?`Last rejected join (not added to your proof):\nLEFT ${state.preview.left}\nRIGHT ${state.preview.right}\nComputed SHA-256: ${state.preview.hash}`:'';
}
function render(){
 if(!state)return controls();
 $('game').dataset.phase=state.phase;$('game').dataset.level=state.level;$('game').dataset.target=state.mission.target;$('game').dataset.size=state.mission.size;
 $('run-number').textContent=`RUN ${String(state.run+1).padStart(2,'0')} / 04`;$('run-name').textContent=state.mission.name;$('goal').textContent=state.mission.goal;
 for(const b of $('runs').children){const i=Number(b.dataset.run);b.setAttribute('aria-pressed',String(i===state.run));b.classList.toggle('done',saved.completed[i]);}
 $('root-short').textContent=short(state.trustedRoot);$('root-short').title=state.trustedRoot;
 $('item-name').textContent=state.record.title;$('item-record').textContent=state.record.text;$('item-position').textContent=`Item ${state.mission.target+1} of ${state.mission.size}`;
 $('cargo-art').innerHTML=`<svg viewBox="0 0 80 80">${ART[state.run]}</svg>`;
 const held=range(state.level,state.position);$('held-range').textContent=held.label;cells($('held-cells'),held.first,held.last,state.mission.size);$('current-short').textContent=short(state.current);
 $('build-controls').hidden=state.phase!=='build';$('judge').hidden=state.phase!=='judge';$('result').hidden=state.phase!=='done';
 if(state.phase==='judge'){
  $('computed-root').textContent=state.current;$('saved-root').textContent=state.trustedRoot;
  $('root-match').textContent=state.verified?'MATCH — same as the saved root':'MISMATCH — different from the saved root';$('root-match').classList.toggle('mismatch',!state.verified);
  $('courier-check').hidden=state.mission.kind!=='seal';$('courier-root').textContent=state.offeredRoot;
  $('courier-match').textContent=state.offeredMatch?'MATCH — but this root came from the sender':'MISMATCH';
 }
 if(state.phase==='done'){
  $('result-kicker').textContent=saved.completed.every(Boolean)?'ALL FOUR RUNS COMPLETE':'RUN COMPLETE';
  $('result-title').textContent=state.verified?'Delivery unlocked.':'Fake caught.';
  $('lesson').textContent=takeaway(state);$('next').textContent=state.run===RUNS.length-1?'Play from the start →':'Next run →';
 }
 renderRoute();renderChoices();renderMath();announce(state.message,!!state.preview);controls();storageNote();
}
async function load(run=0){
 const token=++generation;audioEpoch++;requested=run;busy=true;state=null;selected=null;
 $('game').dataset.phase='loading';$('game').setAttribute('aria-busy','true');$('run-name').textContent='Building the checkpoint…';
 $('choices').replaceChildren();$('judge').hidden=true;$('result').hidden=true;$('build-controls').hidden=false;
 announce('Calculating real SHA-256 fingerprints…');controls();
 try{const prepared=await prepareRun(run);if(token!==generation)return;state=prepared;busy=false;render();}
 catch(e){if(token!==generation)return;busy=false;$('run-name').textContent='Hash engine unavailable';$('game').dataset.phase='error';announce(e.message,true);controls();}
}
async function combine(side){
 if(busy||!selected||state?.phase!=='build')return;
 const token=generation,before=state;busy=true;controls();
 try{
  const next=await join(before,selected,side);if(token!==generation)return;
  state=next;busy=false;const advanced=state.level>before.level;if(advanced)selected=null;
  render();tone(advanced);
  if(advanced){
   $('route').querySelector('.current')?.classList.add('flash');
   if(state.phase==='judge'){$('judge').setAttribute('tabindex','-1');$('judge').focus({preventScroll:true});if(innerWidth<=700)$('judge').scrollIntoView({block:'nearest'});}
   else $('choices').querySelector('button')?.focus({preventScroll:true});
  }
 }catch(e){if(token!==generation)return;busy=false;announce(e.message,true);controls();}
}
function decision(value){
 if(busy||state?.phase!=='judge')return;
 state=decide(state,value);
 if(state.phase==='done'){saved.completed[state.run]=true;save();}
 render();tone(state.phase==='done');
 if(state.phase==='done'){$('result').focus({preventScroll:true});if(innerWidth<=700)$('result').scrollIntoView({block:'nearest'});}
}
RUNS.forEach((r,i)=>{const b=document.createElement('button');b.dataset.run=i;b.innerHTML=`<b>0${i+1}</b><span>${r.name}</span>`;b.addEventListener('click',()=>load(i));$('runs').append(b);});
$('join-left').addEventListener('click',()=>combine('left'));$('join-right').addEventListener('click',()=>combine('right'));
$('accept').addEventListener('click',()=>decision('accept'));$('reject').addEventListener('click',()=>decision('reject'));
$('restart').addEventListener('click',()=>load(requested));
$('undo').addEventListener('click',()=>{if(busy||!state)return;state=rewind(state);selected=null;render();});
$('hint').addEventListener('click',()=>{if(busy||state?.phase!=='build')return;const sibling=range(state.level,state.position^1);announce(`Look for ${sibling.label.toLowerCase()}. It belongs on the ${state.position%2?'left':'right'}. Together, two equal-sized neighboring blocks make their parent. Hints are always free.`);});
$('next').addEventListener('click',()=>{load((requested+1)%RUNS.length);document.querySelector('.mission').scrollIntoView({block:'start'});});
$('sound').addEventListener('click',()=>{saved.sound=!saved.sound;audioEpoch++;save();$('sound').textContent=saved.sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(saved.sound));tone();});
$('clear').addEventListener('click',()=>{try{localStorage.removeItem(STORE);}catch{storageOK=false;}saved=progress(null);audioEpoch++;$('sound').textContent='Sound off';$('sound').setAttribute('aria-pressed','false');load(0);});
$('sound').textContent=saved.sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(saved.sound));load();
