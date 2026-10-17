import { STORE, HOUSES, KEEPERS, NIGHTS, cleanProgress, newNight, available, setThreshold, moveKeeper, begin, deploy, advance, gather, finish } from './vault-core.mjs';
const $ = id => document.getElementById(id);
let storageOK = true;
let saved;
try { saved = cleanProgress(JSON.parse(localStorage.getItem(STORE))); } catch { saved = cleanProgress(null); storageOK = false; }
let state = newNight(), selected = null, lastHouse = null, startPlan = null;
const previous = NIGHTS.map(() => null);
let soundContext, soundEpoch = 0;
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(saved)); } catch { storageOK = false; }
  $('storage-note').textContent = storageOK ? '' : 'Saving is unavailable. You can still play and retry in this tab.';
}
function sound(win = false) {
  if (!saved.sound) return;
  const epoch = soundEpoch;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    soundContext ||= new Audio();
    const play = () => {
      if (!saved.sound || epoch !== soundEpoch) return;
      (win ? [392, 494, 587] : [330]).forEach((frequency, i) => {
        const oscillator = soundContext.createOscillator(), gain = soundContext.createGain();
        const at = soundContext.currentTime + i * .12;
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(.035, at + .01); gain.gain.exponentialRampToValueAtTime(.001, at + .18);
        oscillator.connect(gain); gain.connect(soundContext.destination); oscillator.start(at); oscillator.stop(at + .2);
      });
    };
    if (soundContext.state === 'suspended') soundContext.resume().then(play).catch(() => {}); else play();
  } catch { /* Optional sound never blocks play. */ }
}
function feedback(text) { $('feedback').textContent = text; }
function run(change) {
  try { state = change(state); render(); return true; }
  catch (error) { feedback(error.message); return false; }
}
function focusGame() { $('game').focus({ preventScroll: true }); $('game').scrollIntoView({ block: 'start' }); }
function load(index, retry = false) {
  const plan = retry ? startPlan : null;
  if (state.phase === 'result') previous[state.index] = state.result;
  state = newNight(index);
  if (plan) { state.locations = [...plan.locations]; state.threshold = plan.threshold; }
  selected = null; lastHouse = null; startPlan = null; soundEpoch++;
  $('hint-text').hidden = true; $('result').hidden = true;
  $('dispatch-house').value = '0';
  feedback(retry ? 'Same forecast. Same starting plan. Change one choice and see what happens. Retries are free.' : 'Try a plan. Every retry and hint is free.');
  render(); focusGame();
}
const housePaths = [
  'M10 27h60M15 27V12h50v15M11 12 40 1l29 11M24 14v11m16-11v11m16-11v11',
  'M8 23q8-7 16 0t16 0 16 0 16 0M17 15h46l-6 7H23ZM37 2v13m0-12 17 9H37',
  'M17 28h46M25 28V12h30v16M21 12 40 1l19 11M35 28V17h10v11'
];
function renderCity() {
  const activeFocus = document.activeElement?.dataset.focus;
  const canArrive = available(state);
  $('city').innerHTML = HOUSES.map((name, house) => {
    const ids = state.locations.flatMap((h, id) => h === house ? [id] : []);
    const flooded = state.flooded.includes(house), ferry = state.ferries.includes(house), guard = state.guards.includes(house);
    const status = [guard ? 'Watch posted' : '', ferry ? 'Ferry ready' : '', flooded ? (ferry ? 'Flood route open' : 'Cut off by flood') : ''].filter(Boolean).join(' · ') || 'No help stationed';
    return `<section class="house${flooded ? ' flooded' : ''}${lastHouse === house ? ' active-event' : ''}${state.log.at(-1)?.kind === 'theft' && lastHouse === house ? ' raid' : ''}" data-house="${house}" aria-label="${name}">
      <svg class="house-icon" viewBox="0 0 80 32" aria-hidden="true"><path d="${housePaths[house]}"/></svg><h3>${name}</h3><p class="capacity">${ids.length} / 3 places</p><p class="house-status">${status}</p>
      <div class="tokens">${ids.map(id => {
        const copied = state.copied.includes(id), stranded = !canArrive.includes(id), chosen = state.phase === 'recover' ? state.gathered.includes(id) : selected === id;
        const label = [stranded ? 'Stranded' : state.gathered.includes(id) ? 'At the vault' : 'Can arrive', copied ? 'copy stolen' : ''].filter(Boolean).join(' · ');
        return `<button class="keeper${copied ? ' copied' : ''}${stranded ? ' stranded' : ''}" data-keeper="${id}" data-focus="keeper-${id}" aria-pressed="${chosen}" aria-label="${KEEPERS[id]}, ${name}, ${label}"${state.phase === 'result' ? ' disabled' : ''}><span class="initial" aria-hidden="true">${KEEPERS[id][0]}</span><span><strong>${KEEPERS[id]}</strong><small>${label}</small></span></button>`;
      }).join('')}</div><button class="move-here" data-move="${house}" data-focus="move-${house}"${selected === null || state.phase === 'result' ? ' hidden' : ''}${selected !== null && (state.locations[selected] === house || ids.length >= 3) ? ' disabled' : ''}>${selected === null ? 'Move here' : `Move ${KEEPERS[selected]} here`}</button></section>`;
  }).join('');
  if (activeFocus) $('city').querySelector(`[data-focus="${activeFocus}"]`)?.focus({ preventScroll: true });
  $('map-help').textContent = state.phase === 'result' ? 'Your final positions. Rewind to test a different plan.'
    : state.phase === 'recover' ? `Dawn: click ${state.threshold} reachable keepers to bring their shares to the vault. Send a ferry if you need stranded keepers.`
    : selected !== null ? `${KEEPERS[selected]} selected. Choose a house below. ${state.phase === 'plan' ? 'This move is free.' : 'This move costs one reserve; stolen copies stay stolen.'}`
    : 'Click a keeper, then a house to move them. Each house has room for three.';
}
function renderEvidence() {
  const canArrive = available(state);
  $('share-table').innerHTML = state.dealt ? state.dealt.shares.map(p => `<tr><th scope="row">${KEEPERS[p.id]}</th><td data-point="${p.id}">(${p.x}, ${p.y})</td><td>${state.copied.includes(p.id) ? 'Yes' : 'No'}</td><td>${canArrive.includes(p.id) ? 'Yes' : 'No'}</td></tr>`).join('') : '';
  $('math-summary').textContent = state.dealt ? `Five shares from one freshly randomized ${state.threshold}-of-5 deal, calculated modulo 17. ${state.phase === 'result' ? `Dealer’s original secret: ${state.dealt.secret}. Your recovered value: ${state.result.recovered ?? 'not recovered'}. Thieves’ recovered value: ${state.exposed ?? 'not determined'}.` : 'The dealer’s secret is shown after your recovery attempt. This inspector is for the learner; a real thief would not see all the shares.'}` : 'Begin the night to generate five shares using Shamir’s method.';
  $('night-log').replaceChildren(...state.log.map(event => {
    const item = document.createElement('li'), title = document.createElement('strong');
    title.textContent = event.title; item.append(title, document.createTextNode(event.text)); return item;
  }));
}
function renderResult() {
  const result = state.result;
  $('result').hidden = !result;
  if (!result) return;
  $('result-kicker').textContent = result.pass ? 'Both parts of your mission accomplished' : 'A useful experiment · rewind for free';
  $('result-title').textContent = result.pass ? 'The seeds are safe. The city can plant.' : !result.safe ? 'The thieves learned the secret.' : 'Safe from thieves. Locked out at dawn.';
  $('result-facts').innerHTML = `<article${result.safe ? '' : ' class="bad"'}><h3>${result.safe ? 'Secret kept' : 'Secret exposed'}</h3><p>Thieves collected ${result.copied} distinct shares. They needed ${result.threshold}. ${result.safe ? `All ${result.possibilities} possible secret values still fit their shares.` : `They actually reconstructed secret ${state.exposed}.`}</p></article><article${result.recovered !== null ? '' : ' class="bad"'}><h3>${result.recovered !== null ? 'Vault recovered' : 'Recovery blocked'}</h3><p>${result.available} keepers could arrive. You required ${result.threshold}. ${result.recovered !== null ? `Their shares reconstructed ${result.recovered}, matching the dealer’s original secret ${state.dealt.secret}.` : `You were short by ${result.threshold - result.available} share${result.threshold - result.available === 1 ? '' : 's'}.`}</p></article>`;
  $('lesson').textContent = `${result.copied} stolen < threshold ≤ ${result.available} available was the range your final situation needed. You chose ${result.threshold}. ${NIGHTS[state.index].lesson}`;
  $('connection').textContent = 'The cryptography connection: these are Shamir shares of one secret, like shares used to back up an encryption key. A share is not a readable slice of that key. The game recombines actual share values to decide recovery.';
  $('next-night').textContent = state.index < NIGHTS.length - 1 ? 'Try the next night →' : 'Replay the first night →';
  const before = previous[state.index];
  $('comparison').hidden = !before;
  if (before) $('comparison').textContent = `Previous attempt: threshold ${before.threshold}, ${before.copied} stolen, ${before.available} available — ${before.pass ? 'mission saved' : !before.safe ? 'secret exposed' : 'locked out'}. This attempt: threshold ${result.threshold}, ${result.copied} stolen, ${result.available} available.`;
  $('challenge').textContent = result.pass ? `${result.reserves} reserve${result.reserves === 1 ? '' : 's'} left. ${result.reserves < NIGHTS[state.index].reserves ? 'Can a different placement save a reserve?' : 'Can you make another threshold work?'} No scores or lives to lose.` : 'Try changing one decision: your threshold, the keeper locations, or when you send help. The forecast stays the same.';
}
function render() {
  const mission = NIGHTS[state.index], playing = ['watch', 'recover'].includes(state.phase);
  $('game').dataset.phase = state.phase;
  $('night-title').textContent = mission.title; $('night-subtitle').textContent = mission.subtitle; $('night-brief').textContent = mission.brief;
  $('reserve-count').textContent = state.reserves;
  $('phase-label').textContent = ({plan:'MAKE YOUR PLAN',watch:'NIGHT WATCH',recover:'DAWN · GATHER',result:'NIGHT COMPLETE'})[state.phase];
  $('move-cost').textContent = state.phase === 'plan' ? 'Moves are free before dusk' : 'Moving a keeper costs 1 reserve';
  for (const button of $('nights').children) {
    const i = Number(button.dataset.night); button.setAttribute('aria-pressed', String(i === state.index)); button.classList.toggle('done', saved.completed[i]);
    button.setAttribute('aria-label', `Night ${i + 1}: ${NIGHTS[i].title}${saved.completed[i] ? ', completed' : ''}`);
  }
  for (const button of $('thresholds').children) { button.setAttribute('aria-pressed', String(Number(button.dataset.threshold) === state.threshold)); button.disabled = state.phase !== 'plan'; }
  $('threshold-note').textContent = state.phase === 'plan' ? `Any ${state.threshold} distinct shares can recover the secret. Fewer reveal none of its value.` : `Locked at ${state.threshold}-of-5 for this deal. Rewind to choose another threshold.`;
  $('forecast-count').textContent = `${state.eventIndex} / ${mission.events.length}`;
  $('forecast').innerHTML = mission.events.map((e, i) => `<li class="${i < state.eventIndex ? 'done' : i === state.eventIndex ? 'next' : ''}">${e.title}</li>`).join('');
  const house = Number($('dispatch-house').value);
  $('dispatch-house').disabled = !playing;
  $('guard').disabled = !playing || state.reserves < 1 || state.guards.includes(house);
  $('ferry').disabled = !playing || state.reserves < 1 || state.ferries.includes(house);
  $('stolen-count').textContent = `${state.copied.length} / ${state.threshold} needed`;
  $('available-count').textContent = `${available(state).length} / ${state.threshold} needed`;
  for (const [id, count] of [['stolen-pips', state.copied.length], ['available-pips', available(state).length]]) $(id).innerHTML = Array.from({length:5}, (_,i) => `<i class="${i < count ? 'filled ' : ''}${i + 1 === state.threshold ? 'threshold' : ''}"></i>`).join('');
  $('vault').className = 'vault' + (state.result?.pass ? ' saved' : state.exposed !== null ? ' exposed' : '');
  $('vault-state').textContent = state.result?.pass ? 'Secret kept. Vault opened.' : state.exposed !== null ? 'Secret exposed' : state.phase === 'plan' ? 'Waiting for your plan' : state.phase === 'recover' ? `${state.gathered.length} / ${state.threshold} shares at the vault` : 'Secret still protected';
  $('vault-detail').textContent = state.result ? (state.result.recovered !== null ? `Recovered secret: ${state.result.recovered}` : 'Not enough reachable shares to recover.') : state.exposed !== null ? `The thieves reconstructed ${state.exposed}. Copies cannot be recalled.` : state.phase === 'plan' ? 'Your mission needs both secrecy and recovery.' : `Thieves need ${state.threshold}; so do your keepers.`;
  const last = state.log.at(-1);
  $('event-label').textContent = last ? 'What your decisions caused' : state.phase === 'plan' ? 'Your first decision' : 'Before the first event';
  $('event-title').textContent = last?.title || (state.phase === 'plan' ? 'How many keepers should it take?' : 'The night is yours to manage.');
  $('event-text').textContent = last?.text || (state.phase === 'plan' ? 'Two is easy to gather. Five needs everyone. What will survive this forecast?' : 'You can send help or move a keeper now. Resolve the next event when you are ready.');
  $('action').textContent = state.phase === 'plan' ? 'Begin the night →' : state.phase === 'watch' ? `Resolve ${HOUSES[mission.events[state.eventIndex].house]} ${mission.events[state.eventIndex].kind === 'theft' ? 'burglary' : 'flood'} →` : state.phase === 'recover' ? 'Open the vault →' : 'Rewind & change your plan';
  $('rewind').textContent = state.phase === 'plan' ? 'Reset plan' : 'Rewind this night';
  $('sound').textContent = saved.sound ? 'Sound on' : 'Sound off'; $('sound').setAttribute('aria-pressed', String(saved.sound));
  $('storage-note').textContent = storageOK ? '' : 'Saving is unavailable. You can still play and retry in this tab.';
  renderCity(); renderEvidence(); renderResult();
}
NIGHTS.forEach((night, i) => { const b = document.createElement('button'); b.dataset.night = i; b.textContent = `Night ${i + 1}`; b.addEventListener('click', () => load(i)); $('nights').append(b); });
[2,3,4,5].forEach(k => { const b = document.createElement('button'); b.dataset.threshold = k; b.textContent = k; b.setAttribute('aria-label', `${k} shares needed`); b.addEventListener('click', () => { if (run(s => setThreshold(s, k))) feedback(`Now ${k}-of-5. Both the thieves and your keepers need ${k} distinct shares.`); }); $('thresholds').append(b); });
$('city').addEventListener('click', event => {
  const keeper = event.target.closest('[data-keeper]'), destination = event.target.closest('[data-move]');
  if (keeper && state.phase !== 'result') {
    const id = Number(keeper.dataset.keeper);
    if (state.phase === 'recover') { if (run(s => gather(s, id))) { feedback(`${state.gathered.length} shares gathered; ${state.threshold} needed. The copied status does not stop an honest keeper from using their own share.`); sound(); } }
    else { selected = selected === id ? null : id; renderCity(); feedback(selected === null ? 'Keeper deselected.' : `${KEEPERS[id]} selected. Choose a destination under a house.`); }
  } else if (destination && selected !== null) {
    const id = selected, house = Number(destination.dataset.move);
    if (run(s => moveKeeper(s, id, house))) { selected = null; lastHouse = house; render(); feedback(`${KEEPERS[id]} moved to the ${HOUSES[house]}. ${state.phase === 'plan' ? 'Free move. Keep experimenting.' : 'One reserve spent. Any stolen copy remains stolen.'}`); $('city').querySelector(`[data-keeper="${id}"]`)?.focus({preventScroll:true}); sound(); }
  }
});
$('dispatch-house').addEventListener('change', render);
for (const kind of ['guard', 'ferry']) $(kind).addEventListener('click', () => {
  const house = Number($('dispatch-house').value);
  if (run(s => deploy(s, kind, house))) { selected = null; lastHouse = house; render(); feedback(`${kind === 'guard' ? 'Watch posted' : 'Ferry ready'} at the ${HOUSES[house]}. ${state.reserves} reserves left.`); sound(); }
});
$('action').addEventListener('click', () => {
  if (state.phase === 'result') { load(state.index, true); return; }
  if (state.phase === 'plan') {
    const plan = { locations: [...state.locations], threshold: state.threshold };
    if (run(begin)) { startPlan = plan; selected = null; render(); feedback('The shares are dealt. Send help now, or resolve the first event. You can intervene between events.'); sound(); }
  } else if (state.phase === 'watch') {
    lastHouse = NIGHTS[state.index].events[state.eventIndex].house; selected = null;
    if (run(advance)) { feedback(state.phase === 'recover' ? `Dawn. Click ${state.threshold} reachable keepers to bring their shares. You may still send a ferry.` : 'Read what happened. You can use reserves before the next event.'); sound(); if (state.phase === 'recover') { $('city').querySelector('.keeper:not(.stranded)')?.focus({ preventScroll: true }); $('city').scrollIntoView({ block: 'center' }); } }
  } else if (state.phase === 'recover' && run(finish)) {
    if (state.result.pass) { saved.completed[state.index] = true; save(); }
    render(); sound(state.result.pass); $('result').focus({ preventScroll: true }); $('result').scrollIntoView({ block: 'center' });
  }
});
$('rewind').addEventListener('click', () => load(state.index, state.phase !== 'plan'));
$('retry-result').addEventListener('click', () => load(state.index, true));
$('next-night').addEventListener('click', () => load((state.index + 1) % NIGHTS.length));
$('hint').addEventListener('click', () => { $('hint-text').hidden = !$('hint-text').hidden; $('hint-text').textContent = NIGHTS[state.index].hint; });
$('sound').addEventListener('click', () => { saved.sound = !saved.sound; soundEpoch++; save(); render(); sound(); });
$('clear-progress').addEventListener('click', () => {
  try { localStorage.removeItem(STORE); } catch { storageOK = false; }
  saved = cleanProgress(null); previous.fill(null); state = newNight(); startPlan = null; selected = null; lastHouse = null; soundEpoch++;
  $('hint-text').hidden = true; render(); feedback('Mission progress and sound preference cleared. Guided chapter progress is separate.');
});
render();
