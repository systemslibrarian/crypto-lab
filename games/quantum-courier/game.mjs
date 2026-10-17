import {CHAPTERS, STORAGE_KEY, dailyPlan, detectionProbability, inspect, makeReplay, measure, minimumSample, readProgress, sameSet, secureBit} from './core.mjs';
const $ = selector => document.querySelector(selector);
const symbol = value => value === 'x' ? '×' : value;
let progress = readProgress(null), storageAvailable = true;
try { progress = readProgress(localStorage.getItem(STORAGE_KEY)); } catch { storageAvailable = false; }
let mode = 'campaign', chapter = 0, dailyStage = 0, daily = null, state, generation = 0;
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch { storageAvailable = false; }
  storageNote();
}
function storageNote() { $('#storage-status').textContent = storageAvailable ? 'Progress stays in this browser. No account or uploads.' : 'Browser storage is unavailable. You can still play; progress will last only while this page stays open.'; }
function score() { return Math.max(1, 3 - state.mistakes - Number(state.guidance)); }
function definition() {
  if (mode === 'campaign') return CHAPTERS[chapter];
  const def = {...CHAPTERS[[1,2,4][dailyStage]]};
  def.title = ['Sift the night mail','Pack the private remainder','Make the flight call'][dailyStage];
  def.tag = `Daily route / Task ${dailyStage + 1} of 3`;
  if (dailyStage === 2) {
    def.brief = 'Flag any public samples with different values, then choose whether to pause this flight or continue processing.';
    def.hint = 'Flag disagreements between the two public values. Any sampled error means pause in this teaching game; otherwise continue processing, with no claim of a finished secure key.';
  }
  return def;
}
function stats() {
  $('#best-score').textContent = mode === 'campaign' ? `${progress.best.reduce((a,b)=>a+b,0)} / 18 flight badges` : progress.daily?.date === daily.date ? `${daily.date} · Best ${progress.daily.score}/3` : `${daily.date} · UTC daily route`;
  $('#campaign-mode').setAttribute('aria-pressed', String(mode === 'campaign'));
  $('#daily-mode').setAttribute('aria-pressed', String(mode === 'daily'));
  $('#chapters').hidden = mode !== 'campaign';
  $('#chapters').innerHTML = CHAPTERS.map((c,i) => `<button data-chapter="${i}" ${chapter === i ? 'aria-current="step"' : ''}><span class="chapter-number">0${i+1}<span class="chapter-badge">${progress.best[i] ? progress.best[i]+'/3' : ''}</span></span>${c.title}</button>`).join('');
}
function begin({keepAttempt = false, focus = false} = {}) {
  generation++;
  const old = state;
  let replay;
  if (mode === 'daily') replay = daily;
  else if (chapter === 3) replay = makeReplay('shadow-14', true);
  else if (chapter === 4) replay = makeReplay('quiet-0', true);
  else replay = makeReplay('school-'+chapter);
  state = {replay, sent:mode === 'daily' && dailyStage > 0, solved:false, busy:false, selected:new Set(), receivers:['x','+','x','+'], outputs:null, mistakes:keepAttempt ? old.mistakes : 0, guidance:keepAttempt ? old.guidance : false};
  $('#sample-size').value = '1';
  document.querySelectorAll('input[name=decision]').forEach(input => {input.checked = false;input.disabled = false;});
  $('#result').hidden = true; $('#finish').hidden = true;
  $('#copy-fallback').hidden = true; $('#copy-status').textContent = '';
  $('#feedback').textContent = ''; $('#hint-text').hidden = !state.guidance;
  $('#space-route').classList.remove('flying');
  render();
  if (focus) $('#flight-title').focus({preventScroll:true});
}
const practice = [{basis:'+',bit:0},{basis:'x',bit:1},{basis:'+',bit:1},{basis:'x',bit:0}];
function pulseMarkup(p, def) {
  const id = p.id, sample = state.replay.sample.includes(id), selected = state.selected.has(id);
  const canSelect = state.sent && !state.solved && !state.busy && (def.kind !== 'inspect' || sample);
  const showSample = state.sent && sample && ['discard','inspect'].includes(def.kind);
  const label = !state.sent ? `Pulse ${id+1}: waiting to send` : `Pulse ${id+1}. Alice basis ${symbol(p.alice.basis)}. Bob basis ${symbol(p.bob.basis)}.${showSample ? ` Public sample: Alice ${p.alice.bit}, Bob ${p.bob.bit}.` : ' Values undisclosed.'}`;
  return `<button class="pulse ${showSample ? 'public' : ''}" data-pulse="${id}" aria-label="${label}" aria-pressed="${selected}" ${canSelect ? '' : 'disabled'}><span class="pulse-id">PULSE ${String(id+1).padStart(2,'0')}</span><span class="photon unknown" aria-hidden="true"></span><span class="basis-line">Alice <b>${state.sent ? symbol(p.alice.basis) : '?'}</b></span><span class="basis-line">Bob <b>${state.sent ? symbol(p.bob.basis) : '?'}</b></span>${showSample ? `<span class="values">A: ${p.alice.bit} / B: ${p.bob.bit}</span><span class="public-tag">PUBLIC SAMPLE</span>` : '<span class="values">· · ·</span><span class="public-tag">VALUES HIDDEN</span>'}</button>`;
}
function renderBoard() {
  const def = definition();
  $('#pulses').hidden = def.kind === 'budget';
  $('#budget').hidden = def.kind !== 'budget';
  $('#space-route').hidden = def.kind === 'budget';
  $('#pulses').classList.toggle('tuning', def.kind === 'tune');
  $('#decision').hidden = def.kind !== 'inspect' || !state.sent;
  $('#selection-count').textContent = ['sift','discard','inspect'].includes(def.kind) && state.sent ? `${state.selected.size} ${def.kind === 'inspect' ? 'flagged' : 'selected'}` : '';
  $('#board-label').textContent = {tune:'Tap a card to turn its receiver',sift:state.sent ? 'Keep matching bases' : 'States stay hidden until the flight arrives',discard:state.sent ? 'Pack matching, undisclosed positions' : 'The public sample is chosen before review',inspect:state.sent ? 'Flag disagreements in the public sample' : 'Observe first. Decide second.',budget:'Flight budget / 24 sifted bits'}[def.kind];
  if (def.kind === 'budget') { renderBudget(); return; }
  if (def.kind === 'tune') {
    $('#pulses').innerHTML = practice.map((p,i) => `<button class="pulse" data-receiver="${i}" aria-label="Pulse ${i+1}. Alice basis ${symbol(p.basis)}, bit ${p.bit}. Bob basis ${symbol(state.receivers[i])}. Turn receiver." ${state.solved || state.busy ? 'disabled' : ''}><span class="pulse-id">PULSE 0${i+1}</span><span class="photon" data-state="${p.basis+p.bit}" aria-hidden="true"></span><span>Alice: ${symbol(p.basis)} / ${p.bit}</span><strong>Bob: ${symbol(state.receivers[i])}</strong><span class="public-tag">${state.outputs ? 'MEASURED BIT '+state.outputs[i].bit : 'TAP TO TURN'}</span></button>`).join('');
  } else $('#pulses').innerHTML = state.replay.pulses.map(p => pulseMarkup(p,def)).join('');
}
function renderBudget() {
  const n = Number($('#sample-size').value);
  $('#sample-number').textContent = n;
  $('#detection-number').textContent = (detectionProbability(n)*100).toFixed(1)+'%';
  $('#remaining-number').textContent = 24-n;
  $('#budget-tiles').innerHTML = Array.from({length:24},(_,i)=>`<i class="${i<n ? 'spent' : ''}"></i>`).join('');
  $('#sample-size').setAttribute('aria-valuetext', `${n} public samples; ${(detectionProbability(n)*100).toFixed(1)} percent modeled detection; ${24-n} candidate bits left`);
  $('#sample-size').disabled = state.solved;
}
function render() {
  const def = definition();
  $('#flight-tag').textContent = def.tag;
  $('#flight-title').textContent = def.title;
  $('#brief').textContent = def.brief;
  $('#route-label').textContent = mode === 'daily' ? daily.date+' / UTC' : 'TRAINING ROUTE';
  $('#flight').setAttribute('aria-busy', String(state.busy));
  $('#action').disabled = state.busy;
  $('#hint').disabled = state.solved || state.busy;
  $('#hint-text').textContent = def.hint;
  $('#action').textContent = state.solved ? mode === 'daily' ? dailyStage < 2 ? 'Next task →' : 'Open my flight log →' : chapter < 5 ? 'Next flight →' : 'Open my flight log →' : state.busy ? 'Pulses in flight…' : def.kind === 'tune' ? 'Send practice flight ↗' : def.kind === 'budget' ? 'Check flight plan →' : !state.sent ? 'Send the flight ↗' : {sift:'Check my selection →',discard:'Check my cargo →',inspect:'Make the call →'}[def.kind];
  stats(); renderBoard(); storageNote();
}
function fail(message) {
  state.mistakes++;
  $('#feedback').textContent = message + ` You can revise and try again. This attempt can earn ${score()}/3 badges.`;
}
function win() {
  state.solved = true;
  const def = definition(), review = inspect(state.replay.pulses, state.replay.sample);
  if (mode === 'campaign') {progress.best[chapter] = Math.max(progress.best[chapter], score()); save();}
  else if (dailyStage === 2) {progress.daily = {date:daily.date,score:Math.max(progress.daily?.date === daily.date ? progress.daily.score : 0,score())};save();}
  render();
  document.querySelectorAll('input[name=decision]').forEach(input => {input.disabled = true;});
  $('#feedback').textContent = 'Flight task complete.';
  $('#earned').textContent = mode === 'daily' && dailyStage < 2 ? `Task ${dailyStage+1} of 3 complete / ${score()} badges still available` : `${score()} / 3 flight badges earned`;
  $('#result-title').textContent = def.kind === 'inspect' ? review.errors.length ? 'Good call. Pause the flight.' : 'Good call. Keep asking questions.' : ['Receivers aligned.','The right pulses made the cut.','Private cargo packed.'][['tune','sift','discard'].indexOf(def.kind)] || 'A well-planned flight.';
  $('#lesson').textContent = mode === 'daily' && dailyStage === 2 ? review.errors.length ? 'Your sample contains a disagreement. This teaching route pauses on any sampled error; real systems need a justified error threshold and security analysis.' : 'The sample agrees. That is useful evidence, but it does not prove the absence of interception or produce a finished secure key. More security processing is required.' : def.lesson;
  $('#reveal').textContent = def.kind === 'inspect' ? `Replay debrief: ${state.replay.intercepted ? 'Eve intercepted and resent every pulse' : 'this replay had no interceptor'}. Public sample: ${review.errors.length}/${state.replay.sample.length} errors. ${review.remaining.length} unsampled candidate bits remain. The replays are authored examples, not attack-frequency measurements.` : def.kind === 'tune' ? 'Sender states are visible for calibration only. In later flights, the bases are revealed after Bob has measured.' : '';
  $('#result').hidden = false;
}
async function send() {
  const token = generation;
  state.busy = true; render(); $('#space-route').classList.add('flying');
  await new Promise(resolve => setTimeout(resolve, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850));
  if (token !== generation) return;
  $('#space-route').classList.remove('flying'); state.busy = false; state.sent = true;
  if (definition().kind === 'tune') {
    // Authored replay bits keep this training step reproducible. The light bench
    // below uses independent browser randomness for the actual experiment.
    state.outputs = practice.map((p,i) => measure(p,state.receivers[i],()=>[1,1,0,0][i]));
    if (practice.every((p,i) => p.basis === state.receivers[i])) {win(); return;}
    render(); fail('Some receiver bases differ. A matching output bit by luck does not fix a mismatched basis.');
  } else {render(); $('#feedback').textContent = 'Flight arrived. Basis labels are now public.';}
}
function finish() {
  $('#finish').hidden = false;
  $('#finish-title').textContent = mode === 'daily' ? 'Today’s route is in the log.' : 'You earned your wings.';
  $('#finish-text').textContent = mode === 'daily' ? `${daily.date} UTC · 3/3 tasks completed · ${score()}/3 flight badges this attempt.` : `${progress.best.filter(n=>n>0).length}/6 flights completed · ${progress.best.reduce((a,b)=>a+b,0)}/18 best flight badges. Revisit a flight or try the daily route.`;
  $('#finish').scrollIntoView({block:'nearest',behavior:'auto'});
  $('#copy-result').focus({preventScroll:true});
}
$('#action').addEventListener('click', async () => {
  if (state.busy) return;
  if (state.solved) {
    if (mode === 'daily' && dailyStage < 2) {dailyStage++; begin({keepAttempt:true,focus:true});}
    else if (mode === 'campaign' && chapter < 5) {chapter++;begin({focus:true});}
    else finish();
    return;
  }
  const def = definition();
  if (def.kind === 'tune' || (!state.sent && def.kind !== 'budget')) {await send(); return;}
  const review = inspect(state.replay.pulses, state.replay.sample);
  if (def.kind === 'budget') {
    const n = Number($('#sample-size').value);
    if (n === minimumSample(.95) && 24-n >= 12) win();
    else fail(detectionProbability(n) < .95 ? 'The modeled detection probability is still below 95%.' : 24-n < 12 ? 'Too much of the cargo is public: fewer than 12 candidate bits remain.' : 'That reaches the target, but you can spend fewer bits. Find the smallest qualifying sample.');
  } else if (def.kind === 'inspect') {
    const choice = $('input[name=decision]:checked')?.value;
    if (!choice) {$('#feedback').textContent = 'Choose the crew’s next step before making the call.'; return;}
    if (!sameSet(state.selected,review.errors)) {fail('Check the public values again. Flag every disagreement, and only disagreements.');return;}
    const expected = review.errors.length ? 'pause' : 'process';
    if (choice === expected) win();
    else fail(choice === 'ready' ? 'Sifting and sampling do not produce a finished secure key. Authentication, security analysis, error correction and privacy amplification are still needed.' : expected === 'pause' ? 'The public sample contains disturbance. Our training rule pauses on any sampled error.' : 'This sample has no disagreements. Continue security processing; the sample alone does not justify declaring interception or a finished key.');
  } else {
    if (!state.selected.size) {$('#feedback').textContent = 'Select the pulse cards you want to keep.';return;}
    const expected = def.kind === 'sift' ? review.matched : review.remaining;
    if (sameSet(state.selected,expected)) win();
    else fail(def.kind === 'sift' ? 'Keep all and only the positions with matching bases, regardless of bit values.' : 'Keep all matching-basis positions except those marked PUBLIC SAMPLE. Their values have been revealed.');
  }
});
$('#pulses').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.disabled || state.solved || state.busy) return;
  if (button.hasAttribute('data-receiver')) {
    const i = Number(button.dataset.receiver);
    state.receivers[i] = state.receivers[i] === '+' ? 'x' : '+';
    state.outputs = null; renderBoard(); $(`[data-receiver="${i}"]`).focus({preventScroll:true});
  } else {
    const id = Number(button.dataset.pulse);
    if (state.selected.has(id)) state.selected.delete(id); else state.selected.add(id);
    renderBoard(); $(`[data-pulse="${id}"]`).focus({preventScroll:true});
  }
});
$('#chapters').addEventListener('click',event => {
  const button = event.target.closest('[data-chapter]');
  if (!button) return;
  mode = 'campaign'; chapter = Number(button.dataset.chapter); begin({focus:true});
});
$('#campaign-mode').addEventListener('click',()=>{mode='campaign';begin();});
$('#daily-mode').addEventListener('click',()=>{mode='daily';dailyStage=0;daily=dailyPlan(new Date().toISOString().slice(0,10));begin();});
$('#restart').addEventListener('click',()=>{if(mode==='daily')dailyStage=0;begin({focus:true});});
$('#hint').addEventListener('click',()=>{state.guidance=true;$('#hint-text').hidden=false;$('#hint-text').textContent=definition().hint;$('#feedback').textContent=`Guidance used. This attempt can earn ${score()}/3 badges.`;});
$('#sample-size').addEventListener('input',renderBudget);
$('#clear-progress').addEventListener('click',()=>{
  progress = readProgress(null);
  try { localStorage.removeItem(STORAGE_KEY); } catch { storageAvailable=false; }
  mode='campaign';chapter=0;begin();$('#feedback').textContent='Saved progress cleared. A fresh flight is ready.';
});
$('#copy-result').addEventListener('click',async()=>{
  const result = `Quantum Courier · ${$('#finish-text').textContent}\nhttps://crypto-lab.systemslibrarian.dev/games/quantum-courier/`;
  try {await navigator.clipboard.writeText(result);$('#copy-status').textContent='Flight log copied.';$('#copy-fallback').hidden=true;}
  catch {$('#copy-fallback').value=result;$('#copy-fallback').hidden=false;$('#copy-fallback').focus();$('#copy-fallback').select();$('#copy-status').textContent='Copy is unavailable. Select and copy your flight log below.';}
});
$('#bench-send').addEventListener('click',()=>{
  const value=$('#bench-state').value, prepared={basis:value[0],bit:Number(value[1])}, receiver=$('#bench-basis').value;
  try {
    // Require the RNG even in same-basis experiments so a missing capability
    // cannot silently turn the experiment into a different kind of replay.
    secureBit();
    let ones=0;
    for(let i=0;i<64;i++)ones+=measure(prepared,receiver,secureBit).bit;
    $('#zero-bar').style.width=`${(64-ones)/64*100}%`;$('#one-bar').style.width=`${ones/64*100}%`;
    $('#bench-result').textContent=`64 fresh photons · Sender ${symbol(prepared.basis)} / ${prepared.bit} → receiver ${symbol(receiver)}. Bit 0: ${64-ones}. Bit 1: ${ones}.`;
  } catch(error) {$('#bench-result').textContent=error.message;}
});
for(const id of ['#bench-state','#bench-basis']) $(id).addEventListener('change',()=>{$('#bench-result').textContent='Settings changed. Make a prediction and send a fresh batch.';$('#zero-bar').style.width='50%';$('#one-bar').style.width='50%';});
begin();
