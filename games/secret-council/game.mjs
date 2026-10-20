import { PRIME, MEMBERS, CAMPAIGN, deal, reconstruct, possibleSecrets, compatiblePoints, dailyMission, eventOutcome } from './core.mjs';

const $ = id => document.getElementById(id);
const STORAGE = 'crypto-lab-secret-council-v1';
const svgNS = 'http://www.w3.org/2000/svg';
const today = () => new Date().toISOString().slice(0, 10);
const cleanScores = input => Array.from({ length: CAMPAIGN.length }, (_, i) => [1,2,3].includes(input?.[i]) ? input[i] : 0);
function readSaved() {
  try {
    const input = JSON.parse(localStorage.getItem(STORAGE));
    return { scores: cleanScores(input?.scores), best: Number.isInteger(input?.best) && input.best >= 0 && input.best <= 18 ? input.best : 0,
      daily: input?.daily && /^\d{4}-\d{2}-\d{2}$/.test(input.daily.date) && [1,2,3].includes(input.daily.score) ? input.daily : null,
      sound: input?.sound === true };
  } catch { return { scores: cleanScores(), best: 0, daily: null, sound: false }; }
}
let saved = readSaved();
let storageOK = true;
function save() { try { localStorage.setItem(STORAGE, JSON.stringify(saved)); } catch { storageOK = false; } }
let mode = 'campaign';
let chapter = Math.max(0, saved.scores.findIndex(s => s === 0));
let date = today();
let mission, selected, threshold, phase, trialIndex, currentDeal, outcome, gathered;
let failures = 0, guided = false, mathDeal, candidate = 0;
let audioContext;
const keeperFlavors = [
  'Every record has its place. Ada knows exactly where.',
  'Bram remembers the city before its newest walls.',
  'Cleo never leaves a story half written.',
  'Dara reads the tides before setting out.',
  'Enzo insists every good journey starts with a map.',
  'Faye keeps watch long after the city sleeps.',
  'Gus is always first to spot a visitor on the horizon.'
];
function trialStory(event, result) {
  const names = result.affected.map(id => `${MEMBERS[id].name} (${MEMBERS[id].zone})`).join(', ');
  if (!names) return 'None of your share holders is caught in this trial. Your distribution kept them clear.';
  return event.kind === 'theft'
    ? `Shares exposed in this scenario: ${names}. The intruder now has ${result.affected.length} distinct share${result.affected.length === 1 ? '' : 's'}.`
    : `Unable to reach the chamber: ${names}. ${result.available.length} share${result.available.length === 1 ? '' : 's'} can still arrive.`;
}
function renderRecap() {
  const recap = $('charter-recap'); recap.replaceChildren(); recap.hidden = false;
  const heading = document.createElement('h3'); heading.textContent = 'Your council held';
  const policy = document.createElement('p');
  const locations = new Set(selected.map(id => MEMBERS[id].zone)).size;
  policy.textContent = `${threshold}-of-${selected.length} across ${locations} location${locations === 1 ? '' : 's'}. Every trial below starts afresh.`;
  const list = document.createElement('ul');
  for (const event of mission.events) {
    const result = eventOutcome(selected, threshold, event), item = document.createElement('li');
    item.textContent = `${event.name}: ${event.kind === 'theft' ? `${result.affected.length} copied; fewer than ${threshold}, so the secret stayed private.` : `${result.available.length} available; enough to recover with ${threshold}.`}`;
    list.append(item);
  }
  recap.append(heading, policy, list);
}
function sound(kind) {
  if (!saved.sound) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioContext ||= new Audio();
    const play = () => {
      const notes = kind === 'win' ? [392, 494, 587] : kind === 'fail' ? [196, 147] : [kind === 'select' ? 392 : 523];
      notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
        const start = audioContext.currentTime + i * .1;
        oscillator.type = 'sine'; oscillator.frequency.value = freq;
        gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.045, start + .012); gain.gain.exponentialRampToValueAtTime(.001, start + .23);
        oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(start); oscillator.stop(start + .25);
      });
    };
    if (audioContext.state === 'suspended') audioContext.resume().then(play).catch(() => {}); else play();
  } catch { /* Audio is optional. Gameplay never depends on audio support. */ }
}
function feedback(message, tone = '') {
  $('feedback').textContent = message;
  $('feedback').className = 'feedback' + (tone ? ' ' + tone : '');
}
function actionLabel(label) {
  $('action').replaceChildren(document.createTextNode(label));
  const arrow = document.createElement('span'); arrow.textContent = '→'; arrow.setAttribute('aria-hidden', 'true'); $('action').append(arrow);
}
function totalScore() { return saved.scores.reduce((sum, score) => sum + score, 0); }
function renderHud() {
  $('campaign-mode').setAttribute('aria-pressed', String(mode === 'campaign'));
  $('daily-mode').setAttribute('aria-pressed', String(mode === 'daily'));
  $('daily-date').textContent = date + ' UTC';
  $('chapter-label').textContent = mode === 'daily' ? 'DAILY CHARTER' : `CHAPTER ${String(chapter + 1).padStart(2, '0')} / 06`;
  $('best-score').textContent = mode === 'daily' ? `BEST ${saved.daily?.date === date ? saved.daily.score + '/3' : '—'}` : `BEST ${saved.best || '—'}${saved.best ? '/18' : ''}`;
  $('chapter-stars').textContent = mode === 'daily' ? `DAILY SEALS  ${saved.daily?.date === date ? saved.daily.score : 0} / 3` : `CHARTER SEALS  ${totalScore()} / 18`;
  $('progress').replaceChildren();
  if (mode === 'campaign') CAMPAIGN.forEach((m, i) => {
    const b = document.createElement('button'); b.textContent = String(i + 1);
    b.setAttribute('aria-label', `Chapter ${i + 1}: ${m.title}${saved.scores[i] ? `, ${saved.scores[i]} seals earned` : ''}`);
    b.className = (i === chapter ? 'current ' : '') + (saved.scores[i] ? 'done' : '');
    if (i === chapter) b.setAttribute('aria-current', 'step');
    b.disabled = i > 0 && !saved.scores[i - 1];
    b.addEventListener('click', () => { chapter = i; loadMission(); focusGame(); });
    $('progress').append(b);
  });
  $('sound').textContent = saved.sound ? 'Sound on' : 'Sound off';
  $('sound').setAttribute('aria-pressed', String(saved.sound));
}
function setVault(kind, value, caption) {
  $('vault').className = 'vault' + (kind ? ' ' + kind : '');
  $('vault-value').textContent = value; $('vault-caption').textContent = caption;
}
function renderKeepers() {
  $('keepers').replaceChildren(); $('threads').replaceChildren();
  MEMBERS.forEach((member, id) => {
    const chosen = selected.includes(id), affected = phase !== 'plan' && outcome?.affected.includes(id);
    const inHand = gathered.includes(id);
    const share = currentDeal?.shares.find(s => s.id === id);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'keeper';
    b.dataset.member = id; b.dataset.zone = member.zone;
    if (chosen) b.classList.add('chosen'); else if (phase !== 'plan') b.classList.add('unassigned');
    if (affected && chosen) b.classList.add('affected');
    if (inHand) b.classList.add('gathered');
    b.setAttribute('aria-pressed', String(phase === 'plan' ? chosen : inHand));
    let status = chosen ? 'Share assigned' : 'No share';
    if (phase !== 'plan' && chosen) {
      status = affected ? (mission.events[trialIndex]?.kind === 'theft' ? 'Copied' : 'Unavailable') : inHand ? 'Collected' : 'Available';
    }
    b.title = `${member.role}. ${keeperFlavors[id]}`;
    b.setAttribute('aria-label', `${member.name}, ${member.role}, ${member.zone}. ${status}${share ? `. Share (${share.x}, ${share.y})` : ''}`);
    const display = [['sigil', member.symbol], ['name', member.name], ['zone', member.zone],
      ['share-value', phase === 'plan' ? (chosen ? 'Share assigned' : 'Invite keeper') : (share ? `${status} · ${share.x},${share.y}` : 'No share')]];
    for (const [className, value] of display) { const span = document.createElement('span'); span.className = className; span.textContent = value; b.append(span); }
    b.disabled = phase !== 'plan' && !(phase === 'recover' && chosen && !affected);
    b.addEventListener('click', () => {
      if (phase === 'plan') {
        if (chosen) selected = selected.filter(x => x !== id);
        else if (selected.length < mission.seats) selected = [...selected, id].sort((a, b) => a - b);
        else { feedback(`This charter has ${mission.seats} seats. Remove a keeper before inviting ${member.name}.`); return; }
        feedback(`${member.name}, ${member.role.toLowerCase()}: ${keeperFlavors[id]} ${selected.length} of ${mission.seats} shares assigned.`);
      } else if (phase === 'recover') {
        gathered = inHand ? gathered.filter(x => x !== id) : [...gathered, id];
        feedback(gathered.length < threshold ? `${gathered.length} collected; ${threshold - gathered.length} more distinct share${threshold - gathered.length === 1 ? '' : 's'} needed. Every secret value is still possible from this collection alone.` : `${gathered.length} distinct shares collected. You can now recover the secret.`, gathered.length >= threshold ? 'success' : '');
        $('trial-count').textContent = `${gathered.length} collected / ${threshold} needed`;
      }
      sound('select'); renderKeepers();
      $('keepers').querySelector(`[data-member="${id}"]`)?.focus({ preventScroll: true });
    });
    $('keepers').append(b);
    if (chosen) {
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', '300'); line.setAttribute('y1', '265'); line.dataset.member = id;
      line.setAttribute('class', 'thread' + (affected ? ' affected' : inHand ? ' gathered' : '')); $('threads').append(line);
    }
  });
  alignThreads();
  $('seat-count').textContent = `${selected.length} / ${mission.seats} shares assigned`;
}
function alignThreads() {
  const chamber = $('chamber').getBoundingClientRect();
  for (const line of $('threads').children) {
    const node = $('keepers').querySelector(`[data-member="${line.dataset.member}"]`).getBoundingClientRect();
    line.setAttribute('x2', (node.left + node.width / 2 - chamber.left) / chamber.width * 600);
    line.setAttribute('y2', (node.top + node.height / 2 - chamber.top) / chamber.height * 530);
  }
}
if (globalThis.ResizeObserver) new ResizeObserver(alignThreads).observe($('chamber'));
function renderRisks() {
  $('risks').replaceChildren();
  for (const event of mission.events) {
    const li = document.createElement('li'), glyph = document.createElement('span'), text = document.createElement('div');
    glyph.className = 'risk-symbol'; glyph.textContent = event.kind === 'theft' ? '◇' : '−'; glyph.setAttribute('aria-hidden', 'true');
    const strong = document.createElement('strong'), small = document.createElement('small');
    strong.textContent = event.name; small.textContent = event.description;
    text.append(strong, small); li.append(glyph, text); $('risks').append(li);
  }
}
function scoreNote() {
  $('score-note').textContent = `Up to 3 seals per chapter. ${failures} failed attempt${failures === 1 ? '' : 's'}${guided ? ' · guidance used (free)' : ''}. Guidance is free. No timer.${storageOK ? '' : ' Browser storage unavailable; this session still works.'}`;
}
function planAgain() {
  $('charter-recap').hidden = true;
  $('chamber').classList.remove('recovery-celebration');
  phase = 'plan'; trialIndex = 0; currentDeal = null; outcome = null; gathered = [];
  $('planning-controls').hidden = false; $('trial-panel').hidden = true; $('hint').hidden = false;
  $('retry').hidden = true; $('completion').hidden = true; $('action').disabled = false;
  $('threshold').max = mission.seats; $('threshold').value = threshold; $('threshold-value').textContent = threshold;
  $('threshold').setAttribute('aria-valuetext', `${threshold} distinct shares needed`);
  $('board-label').textContent = 'The council chamber';
  $('board-help').textContent = 'Select keepers to give each one a distinct share. Select again to remove.';
  setVault('', 'SEALED', 'Shared trust begins here');
  feedback(`Assign ${mission.seats} shares, choose a threshold, then seal the charter to test your council.`);
  actionLabel('Seal the charter'); renderKeepers(); renderHud(); scoreNote();
}
function loadMission() {
  mission = mode === 'daily' ? dailyMission(date) : CAMPAIGN[chapter];
  selected = [...mission.initial]; threshold = mission.initialThreshold; failures = 0; guided = false;
  $('mission-title').textContent = mission.title; $('mission-subtitle').textContent = mission.subtitle; $('mission-brief').textContent = mission.brief;
  $('restart').textContent = mode === 'daily' ? 'Restart daily' : 'Restart journey';
  renderRisks(); planAgain();
}
function enterTrial() {
  $('chamber').classList.remove('recovery-celebration');
  const event = mission.events[trialIndex];
  outcome = eventOutcome(selected, threshold, event); gathered = [];
  $('planning-controls').hidden = true; $('trial-panel').hidden = false; $('hint').hidden = true; $('retry').hidden = false;
  $('trial-number').textContent = `INDEPENDENT TRIAL ${trialIndex + 1} / ${mission.events.length}`;
  $('trial-title').textContent = event.name; $('trial-description').textContent = `${event.description} ${trialStory(event, outcome)}`;
  $('board-label').textContent = event.kind === 'theft' ? 'The intruder’s view' : 'Bring the council together';
  if (!outcome.pass) {
    phase = 'failed'; failures++; sound('fail');
    if (event.kind === 'theft') {
      const secret = reconstruct(currentDeal.shares.filter(s => outcome.affected.includes(s.id)), threshold);
      setVault('breached', `SECRET ${String(secret).padStart(2, '0')}`, 'The intruder reconstructed it');
      $('trial-count').textContent = `${outcome.affected.length} stolen / ${threshold} needed`;
      $('trial-verdict').textContent = 'The secret was exposed';
      feedback(`The intruder has ${outcome.affected.length} distinct shares and needs only ${threshold}. Their actual interpolation recovered ${secret}. Raise the threshold or change who holds shares.`, 'failure');
    } else {
      setVault('', 'LOCKED OUT', 'Too few shares can arrive');
      $('trial-count').textContent = `${outcome.available.length} available / ${threshold} needed`;
      $('trial-verdict').textContent = 'The council cannot recover';
      feedback(`Only ${outcome.available.length} shares remain available, but your threshold is ${threshold}. Lower the threshold or move shares away from this shared risk.`, 'failure');
    }
    $('board-help').textContent = 'A failed trial is a clue. Revise your council and try again.';
    actionLabel('Revise the council');
  } else if (event.kind === 'theft') {
    phase = 'theft'; setVault('', 'STILL SECRET', `${PRIME} possible values remain`);
    $('trial-count').textContent = `${outcome.affected.length} stolen / ${threshold} needed`;
    $('trial-verdict').textContent = 'Every secret is still possible';
    const candidates = possibleSecrets(currentDeal.shares.filter(s => outcome.affected.includes(s.id)), threshold);
    feedback(`The intruder has ${outcome.affected.length} of the ${threshold} shares needed. All ${candidates.length} secret values remain compatible with those shares. Your charter passes this trial.`, 'success');
    $('board-help').textContent = 'Copied shares are marked in coral. Shares are not fragments of the secret.';
    actionLabel('Next trial'); sound('pass');
  } else {
    phase = 'recover'; setVault('', 'AWAITING SHARES', `${threshold} keepers must contribute`);
    $('trial-count').textContent = `0 collected / ${threshold} needed`;
    $('trial-verdict').textContent = `${outcome.available.length} shares can still arrive`;
    feedback(`Select ${threshold} available keepers in the chamber to collect their distinct shares, then recover the secret.`);
    $('board-help').textContent = 'Select available keepers to collect shares. Coral keepers cannot participate.';
    actionLabel('Recover the secret');
  }
  renderKeepers(); scoreNote();
}
function award() {
  const seals = Math.max(1, 3 - failures);
  if (mode === 'campaign') { saved.scores[chapter] = Math.max(saved.scores[chapter], seals); saved.best = Math.max(saved.best, totalScore()); }
  else saved.daily = { date, score: Math.max(saved.daily?.date === date ? saved.daily.score : 0, seals) };
  save(); renderRecap(); phase = 'won'; $('retry').hidden = true;
  $('board-label').textContent = 'The charter holds';
  $('trial-title').textContent = 'Every trial passed'; $('trial-number').textContent = 'CHARTER COMPLETE';
  $('trial-description').textContent = mission.lesson;
  $('trial-count').textContent = `${mission.events.length} / ${mission.events.length} independent trials passed`;
  $('trial-verdict').textContent = `${seals} of 3 seals earned`;
  feedback(mission.lesson, 'success');
  $('board-help').textContent = 'Your chosen keepers and threshold passed every scenario in this charter.';
  actionLabel(mode === 'daily' ? 'See daily result' : chapter === CAMPAIGN.length - 1 ? 'Complete the journey' : 'Next chapter');
  renderKeepers(); renderHud(); scoreNote(); sound('win');
}
function nextTrial() { trialIndex++; if (trialIndex < mission.events.length) enterTrial(); else award(); }
function finish() {
  phase = 'complete'; $('completion').hidden = false; $('action').disabled = true;
  $('completion-title').textContent = mode === 'daily' ? 'Today’s council stands.' : 'The secret is in good hands.';
  $('completion-text').textContent = mode === 'daily' ? `${date} (UTC) · ${saved.daily.score}/3 seals. You found a council that survives every trial in today’s charter. Come back for a different council tomorrow.` : `${totalScore()}/18 seals across six chapters. You balanced secrecy, availability, and shared risks. Take that intuition into Shamir Gate to explore secret sharing in more depth.`;
  $('copy-status').textContent = ''; $('copy-fallback').hidden = true;
  $('completion').focus();
}
function focusGame() { $('game').focus({ preventScroll: true }); }
$('action').addEventListener('click', () => {
  if (phase === 'plan') {
    if (selected.length !== mission.seats) { feedback(`Choose exactly ${mission.seats} keepers; you currently have ${selected.length}.`); return; }
    try { currentDeal = deal(selected, threshold); enterTrial(); }
    catch (error) { feedback(error.message, 'failure'); }
  } else if (phase === 'failed') planAgain();
  else if (phase === 'theft' || phase === 'recovered') nextTrial();
  else if (phase === 'recover') {
    if (gathered.length < threshold) { feedback(`Collect ${threshold - gathered.length} more distinct share${threshold - gathered.length === 1 ? '' : 's'} from available keepers.`); return; }
    const secret = reconstruct(currentDeal.shares.filter(s => gathered.includes(s.id)), threshold);
    if (secret !== currentDeal.secret) { feedback('The reconstructed value did not match. Revise the council to start a fresh example.', 'failure'); return; }
    phase = 'recovered'; setVault('open', `SECRET ${String(secret).padStart(2, '0')}`, 'Recovered from your chosen shares');
    $('trial-verdict').textContent = 'The secret is recovered';
    feedback(`Your ${gathered.length} distinct shares reconstruct ${secret}, exactly matching the generated secret. Any ${threshold} valid shares from this deal would work.`, 'success');
    $('board-help').textContent = 'The gold seal opens only after the selected shares actually reconstruct the secret.';
    actionLabel('Next trial'); renderKeepers(); $('chamber').classList.add('recovery-celebration'); sound('win');
  } else if (phase === 'won') {
    if (mode === 'daily' || chapter === CAMPAIGN.length - 1) finish();
    else { chapter++; loadMission(); focusGame(); }
  }
});
$('threshold').addEventListener('input', e => {
  threshold = Number(e.target.value); $('threshold-value').textContent = threshold;
  e.target.setAttribute('aria-valuetext', `${threshold} distinct shares needed`);
  feedback(`Any ${threshold} valid, distinct shares can recover the secret. Think about both stolen shares and unavailable keepers.`); sound('select');
});
$('hint').addEventListener('click', () => {
  guided = true;
  const risks = mission.events.map(e => ({ event: e, outcome: eventOutcome(selected, threshold, e) }));
  const maxStolen = Math.max(0, ...risks.filter(r => r.event.kind === 'theft').map(r => r.outcome.affected.length));
  const minAvailable = Math.min(selected.length, ...risks.filter(r => r.event.kind === 'outage').map(r => r.outcome.available.length));
  feedback(`With your current keepers, an intruder could get up to ${maxStolen} shares, and as few as ${minAvailable} could remain available. You need: ${maxStolen} < threshold ≤ ${minAvailable}.${maxStolen >= minAvailable ? ' No threshold fits yet. Change who holds the shares.' : ''} Guidance is free. Try a different council whenever you like.`);
  scoreNote();
});
$('retry').addEventListener('click', planAgain);
$('restart').addEventListener('click', () => { if (mode === 'campaign') chapter = 0; loadMission(); focusGame(); });
$('play-again').addEventListener('click', () => { if (mode === 'campaign') chapter = 0; loadMission(); $('game').scrollIntoView(); focusGame(); });
for (const nextMode of ['campaign', 'daily']) $(nextMode + '-mode').addEventListener('click', () => {
  if (mode === nextMode) return;
  mode = nextMode; date = today();
  if (mode === 'campaign') chapter = Math.max(0, saved.scores.findIndex(s => s === 0));
  loadMission();
});
$('sound').addEventListener('click', () => { saved.sound = !saved.sound; save(); renderHud(); sound('select'); });
$('clear-progress').addEventListener('click', () => {
  try { localStorage.removeItem(STORAGE); } catch { storageOK = false; }
  saved = { scores: cleanScores(), best: 0, daily: null, sound: false }; chapter = 0; loadMission();
  feedback('Saved progress, best scores, and sound preference have been cleared.');
});
$('copy-result').addEventListener('click', async () => {
  const result = `Secret Council · ${mode === 'daily' ? `${date} UTC · ${saved.daily.score}/3` : `Campaign · ${totalScore()}/18`} seals\nShared trust. Every trial passed.\nhttps://crypto-lab.systemslibrarian.dev/games/secret-council/`;
  try { await navigator.clipboard.writeText(result); $('copy-status').textContent = 'Result copied. Share your council’s achievement.'; }
  catch { $('copy-fallback').hidden = false; $('copy-fallback').value = result; $('copy-fallback').focus(); $('copy-fallback').select(); $('copy-status').textContent = 'Select and copy the result below.'; }
});
function svgElement(tag, attributes) {
  const element = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  return element;
}
function renderMath() {
  if (!mathDeal) return;
  const count = Number($('visible-shares').value), points = mathDeal.shares.slice(0, count);
  const options = possibleSecrets(points, 3);
  if (!options.includes(candidate)) candidate = options[0];
  $('visible-count').textContent = `${count} / 3 needed`;
  $('possibility-copy').textContent = count < 3 ? `All ${PRIME} secret values remain possible with ${count} visible share${count === 1 ? '' : 's'}.` : `Three distinct shares determine one secret: ${options[0]}.`;
  $('candidate-secrets').replaceChildren();
  for (let s = 0; s < PRIME; s++) {
    const b = document.createElement('button'); b.textContent = s; b.disabled = !options.includes(s);
    b.setAttribute('aria-label', `Candidate secret ${s}`); b.setAttribute('aria-pressed', String(candidate === s));
    b.addEventListener('click', () => { candidate = s; renderMath(); $('candidate-secrets').children[s].focus({ preventScroll: true }); });
    $('candidate-secrets').append(b);
  }
  const generated = compatiblePoints(points, candidate, 3);
  $('plot-description').textContent = `Candidate secret ${candidate} at x zero. The plotted polynomial matches ${count} visible shares. ${options.length} secrets remain possible. Dots are finite-field values, not a continuous real-valued curve.`;
  $('plot-grid').replaceChildren(); $('plot-dots').replaceChildren();
  const x = value => 36 + value * 20, y = value => 288 - value * 16;
  for (let i = 0; i < PRIME; i++) {
    $('plot-grid').append(svgElement('line', { x1: x(i), y1: y(0), x2: x(i), y2: y(16), stroke: '#294144', 'stroke-width': '.6' }),
      svgElement('line', { x1: x(0), y1: y(i), x2: x(16), y2: y(i), stroke: '#294144', 'stroke-width': '.6' }));
    if (i % 4 === 0) {
      const a = svgElement('text', { x: x(i), y: 307, fill: '#a3b8b4', 'font-size': 10, 'text-anchor': 'middle' }); a.textContent = i;
      const b = svgElement('text', { x: 22, y: y(i) + 3, fill: '#a3b8b4', 'font-size': 10, 'text-anchor': 'end' }); b.textContent = i;
      $('plot-grid').append(a, b);
    }
  }
  for (const p of generated) $('plot-dots').append(svgElement('circle', { cx: x(p.x), cy: y(p.y), r: 3.3, fill: 'none', stroke: '#edc381', 'stroke-width': 1.2 }));
  for (const p of points) $('plot-dots').append(svgElement('circle', { cx: x(p.x), cy: y(p.y), r: 5.5, fill: '#a7e5cf', stroke: '#08191c', 'stroke-width': 1 }));
  $('plot-dots').append(svgElement('path', { d: `M${x(0)},${y(candidate) - 7}l7,7 -7,7 -7,-7Z`, fill: '#edc381' }));
  const axis = svgElement('text', { x: 200, y: 328, fill: '#a3b8b4', 'font-size': 10, 'text-anchor': 'middle' }); axis.textContent = 'x · share index (0 holds the secret)'; $('plot-grid').append(axis);
  const ylabel = svgElement('text', { x: 36, y: 17, fill: '#a3b8b4', 'font-size': 10 }); ylabel.textContent = 'y · value modulo 17'; $('plot-grid').append(ylabel);
  $('share-table').replaceChildren();
  if (!points.length) { const row = document.createElement('tr'), td = document.createElement('td'); td.colSpan = 2; td.textContent = 'No shares visible'; row.append(td); $('share-table').append(row); }
  for (const p of points) { const row = document.createElement('tr'); for (const value of [p.x, p.y]) { const td = document.createElement('td'); td.textContent = value; row.append(td); } $('share-table').append(row); }
}
$('visible-shares').addEventListener('input', renderMath);
$('fresh-example').addEventListener('click', () => { mathDeal = deal([0,1,2,3,4], 3); renderMath(); });
$('math-details').addEventListener('toggle', () => { if ($('math-details').open) renderMath(); });
loadMission();
try { mathDeal = deal([0,1,2,3,4], 3); renderMath(); }
catch (error) { feedback(`The game could not initialize: ${error.message}`, 'failure'); $('action').disabled = true; $('fresh-example').disabled = true; }
