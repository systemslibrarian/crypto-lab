import { CHAPTERS, STORAGE_KEY, cleanProgress, prepare, dailyPlan, bookData, nodeAt, changedNodes, pathIds, siblingIds, sameSet, verifyBundle, verifyProof, proofTrace, score } from './core.mjs';
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let saved = cleanProgress(null), storageWorks = true;
try { saved = cleanProgress(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch { storageWorks = false; }
let chapter = 0, mode = 'campaign', daily = null, phase = 0, data = null, selected = new Set(), inspected = null;
let failures = 0, guided = false, parcelIndex = 0, verification = null, done = false, busy = false, epoch = 0, lastResult = '';
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }
  catch { storageWorks = false; }
  $('storage-status').textContent = storageWorks ? '' : 'Scores work for this visit. This browser could not save them.';
}
function feedback(text, tone = '') { $('feedback').textContent = text; $('feedback').dataset.tone = tone; }
function setBusy(value) { busy = value; $('play-area').setAttribute('aria-busy', String(value)); $('action').disabled = value; $('root-choices').disabled = value; $('accept').disabled = value; $('quarantine').disabled = value; }
function total() { return saved.best.reduce((a,b) => a+b, 0); }
function updateProgress() {
  $('best-score').textContent = mode === 'daily' ? `Daily best ${saved.daily?.date === daily?.date ? saved.daily.score : 0} / 3` : `${total()} / 18 bookplates`;
  $('chapters').innerHTML = CHAPTERS.map((item,i) => `<button type="button" data-chapter="${i}" class="${saved.best[i] ? 'done' : ''}" ${mode === 'campaign' && chapter === i ? 'aria-current="step"' : ''} aria-label="Chapter ${i+1}: ${esc(item.title)}. Best ${saved.best[i]} of 3 bookplates"><span>${String(i+1).padStart(2,'0')}</span>${item.short}</button>`).join('');
  $('chapters').hidden = mode === 'daily';
  $('daily-date').hidden = mode !== 'daily';
  $('daily-date').textContent = daily ? `${daily.date} UTC · Task ${phase+1} of 3 · Same mystery for everyone` : '';
  $('campaign-mode').setAttribute('aria-pressed', String(mode === 'campaign'));
  $('daily-mode').setAttribute('aria-pressed', String(mode === 'daily'));
}
function comparison() { return ['find','trace','compare'].includes(data.mission.kind); }
function displayTree() { return comparison() ? data.after : data.before; }
function position(level, index, tree) {
  const depth = tree.levels.length - 1;
  return { x: (index + .5) * 100 / tree.levels[level].length, y: 12 + (depth - level) * 72 / Math.max(1, depth) };
}
function nodeName(level,index,tree) {
  if (!level) return `Book ${index + 1}`;
  if (level === tree.levels.length - 1) return 'Root seal';
  const start = index * 2 ** level + 1, end = (index+1)*2**level;
  return `Books ${start}–${end}`;
}
function renderTree() {
  const tree = displayTree(), kind = data.mission.kind;
  const changed = changedNodes(data.before, data.after), showChanges = ['find','compare'].includes(kind) || done;
  const oldFocus = document.activeElement?.dataset?.node;
  let edges = '', nodes = '';
  for (let level = 0; level < tree.levels.length; level++) tree.levels[level].forEach((hash,index) => {
    const id = `${level}:${index}`, p = position(level,index,tree), isRoot = level === tree.levels.length - 1;
    if (!isRoot) {
      const parent = position(level+1, Math.floor(index/2), tree);
      edges += `<line x1="${p.x}" y1="${p.y}" x2="${parent.x}" y2="${parent.y}" class="${selected.has(id) ? 'selected-edge' : ''}"/>`;
    }
    const label = nodeName(level,index,tree), changedVisible = comparison() && showChanges && changed.includes(id);
    const target = kind === 'pack' && level === 0 && index === data.mission.target;
    const selectMode = kind === 'trace' || (kind === 'pack' && !target) || (!level && ['find','compare'].includes(kind));
    nodes += `<button type="button" class="node ${!level ? 'leaf' : ''} ${isRoot ? 'root' : ''} ${selected.has(id) ? 'selected' : ''} ${changedVisible ? 'changed' : ''} ${target ? 'target' : ''}" data-node="${id}" ${!level ? `data-color="${data.original[index].color}"` : ''} style="left:${p.x}%;top:${p.y}%" ${selectMode ? `aria-pressed="${selected.has(id)}"` : ''} aria-label="${esc(label + (!level ? ': '+data.original[index].title : '') + (changedVisible ? ', changed fingerprint' : '') + (target ? ', book already in the parcel' : ''))}"><strong>${esc(!level ? String(index+1).padStart(2,'0') : label)}</strong><code>${hash.slice(0,6)}</code></button>`;
  });
  $('tree').className = `tree ${tree.size === 4 ? 'four' : ''}`;
  $('tree').innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${edges}</svg>${nodes}`;
  if (oldFocus) $('tree').querySelector(`[data-node="${oldFocus}"]`)?.focus({preventScroll:true});
  $('legend-text').textContent = comparison() && showChanges ? 'Changed fingerprint' : kind === 'pack' ? 'Outline = packed piece; dashed = target book' : kind === 'trace' ? 'Outline = selected node' : 'Select a node to inspect its fingerprint';
}
function inspect(id) {
  inspected = id;
  const tree = displayTree(), node = nodeAt(tree,id), before = nodeAt(data.before,id).hash;
  $('evidence-id').textContent = `LEVEL ${node.level} / NODE ${node.index+1}`;
  $('evidence-title').textContent = node.level === 0 ? data.original[node.index].title : nodeName(node.level,node.index,tree);
  let content = '';
  if (node.level === 0) {
    const book = data.original[node.index], current = data.current[node.index];
    content = comparison() ? `<div class="passages"><div><strong>Recorded passage</strong><p>${esc(book.text)}</p></div><div><strong>Current passage</strong><p>${esc(current.text)}</p></div></div>` : `<p>${esc(book.text)}</p>`;
  } else content = `<p>${node.level === tree.levels.length-1 ? 'This root summarizes the whole ordered collection.' : 'This node summarizes the books beneath its two branches.'} ${comparison() ? before === node.hash ? 'Its recorded and current fingerprints match.' : 'Its recorded and current fingerprints differ.' : 'A single fingerprint can represent this whole subtree in a proof.'}</p>`;
  content += `<details><summary>Full SHA-256 fingerprint${comparison() ? 's' : ''}</summary><p class="hash-label">${comparison() ? 'Recorded' : 'Node hash'}</p><code>${before}</code>${comparison() ? `<p class="hash-label">Current</p><code>${node.hash}</code>` : ''}</details>`;
  $('evidence-content').innerHTML = content;
}
function selectionSummary() {
  const kind = data.mission.kind;
  if (kind === 'inspect') $('selection-summary').textContent = `Parcel ${parcelIndex+1} of ${data.parcels.length} · ${verification ? 'Proof checked' : 'Awaiting verification'}`;
  else if (kind === 'trust') $('selection-summary').textContent = verification ? 'Proof checked · Choose a disposition' : 'Choose a reference seal above';
  else if (kind === 'pack') $('selection-summary').textContent = `${selected.size} / 3 proof pieces packed · Book ${data.mission.target+1} included`;
  else if (kind === 'trace') $('selection-summary').textContent = `${selected.size} nodes marked on the trail`;
  else $('selection-summary').textContent = selected.size ? `Books selected: ${[...selected].map(id=>Number(id.split(':')[1])+1).sort((a,b)=>a-b).join(', ')}` : 'No books selected yet';
}
function renderParcel() {
  const item = data.parcels[parcelIndex];
  $('parcel').hidden = !item;
  if (!item) return;
  $('parcel').innerHTML = `<span class="small-label">Delivery ${parcelIndex+1} / ${data.parcels.length}</span><h4>${esc(item.book.title)}</h4><p>${esc(item.book.text)}</p><small>Book ${item.index+1} · ${item.size}-book archive · ${item.proof.length} proof pieces</small><details><summary>Inspect the supplied proof</summary>${item.proof.map((hash,i)=>`<code>${i+1}. ${hash}</code>`).join('')}</details>`;
  $('recorded-full').textContent = data.before.root;
  $('courier-full').textContent = item.offeredRoot;
}
function render() {
  const {mission,before} = data;
  updateProgress();
  $('case-number').textContent = mode === 'daily' ? `Daily mystery / ${phase+1} of 3` : `Chapter ${String(chapter+1).padStart(2,'0')} / 06`;
  $('case-title').textContent = mission.title;
  $('restart').textContent = mode === 'daily' ? 'Restart daily' : 'Restart chapter';
  $('board-title').textContent = comparison() ? mission.kind === 'compare' ? 'Two editions, one archive' : 'Follow the fingerprints' : 'The recorded archive';
  $('tree-size').textContent = `${before.size} books`;
  $('trusted-root').textContent = before.root;
  $('story').textContent = mission.story;
  $('task').textContent = mission.task;
  $('tree-instruction').textContent = ({ find: 'Select a book. Compare its saved and current passages below.', trace: 'Select nodes to mark the trail. Inspect their hashes in the drawer.', pack: `Book ${mission.target+1} is already included. Select its missing sibling hashes.`, inspect: 'Use the parcel in the case file. This tree is the recorded reference.', compare: 'Select revised books. Compare both snapshots in the evidence drawer.', trust: 'The archive record predates the courier. Compare the seals in the case file.' })[mission.kind];
  if (before.size === 8) $('tree-instruction').textContent += ' On small screens, scroll the tree sideways.';
  $('root-choices').hidden = mission.kind !== 'trust';
  for (const radio of document.querySelectorAll('[name=root-choice]')) radio.checked = false;
  $('decisions').hidden = true; $('proof-details').hidden = true; $('proof-details').open = false;
  $('chapter-result').hidden = true; $('hint-text').hidden = !guided;
  $('hint').disabled = false;
  $('action').textContent = ({find:'Check the altered book',trace:'Check the trail',pack:'Send the proof',inspect:'Verify parcel',compare:'Check both revisions',trust:'Verify against chosen seal'})[mission.kind];
  renderTree(); renderParcel(); selectionSummary(); inspect(`0:${mission.target}`);
  feedback('Examine the evidence, then make your move.');
}

async function start({ reset = true } = {}) {
  const ticket = ++epoch;
  done = false; selected = new Set(); inspected = null; parcelIndex = 0; verification = null;
  if (reset) { failures = 0; guided = false; }
  $('finish').hidden = true; $('play-area').hidden = false; setBusy(true); $('action').textContent = 'Opening the archive…';
  try {
    const next = await prepare(chapter, mode === 'daily' ? daily : null, phase);
    if (ticket !== epoch) return;
    data = next; render(); setBusy(false);
    if (guided) showHint(false);
  } catch (error) {
    if (ticket !== epoch) return;
    feedback(`The archive could not open. ${error.message} Reload to try again.`, 'bad');
    $('case-title').textContent = 'The archive could not open';
    $('action').textContent = 'Cryptographic engine unavailable';
    $('play-area').setAttribute('aria-busy','false');
  }
}
function fail(message) { failures++; feedback(message, 'bad'); }
function complete() {
  done = true; verification = null;
  const earned = score(failures, guided);
  if (mode === 'campaign') saved.best[chapter] = Math.max(saved.best[chapter], earned);
  else if (phase === 2) saved.daily = { date: daily.date, score: Math.max(saved.daily?.date === daily.date ? saved.daily.score : 0, earned) };
  persist(); updateProgress();
  $('chapter-result').hidden = false;
  $('earned').textContent = mode === 'daily' && phase < 2 ? `Task ${phase+1} complete` : `${earned} / 3 bookplates earned`;
  $('lesson').textContent = data.mission.lesson;
  $('hint').disabled = true; $('decisions').hidden = true; $('root-choices').disabled = true;
  $('action').textContent = mode === 'daily' ? phase < 2 ? 'Continue the daily mystery →' : 'See daily result →' : chapter < 5 ? 'Open the next chapter →' : 'See your investigation →';
  feedback('Evidence checked. Read the finding, then continue.', 'good');
  renderTree();
}
function finish() {
  $('play-area').hidden = true; $('finish').hidden = false;
  const dailyMode = mode === 'daily', count = saved.best.filter(Boolean).length;
  $('finish-title').textContent = dailyMode ? 'Today’s mystery, solved.' : count === 6 ? 'The archive is in good hands.' : 'Another case for your collection.';
  $('finish-text').textContent = dailyMode ? `You earned ${score(failures,guided)}/3 bookplates for ${daily.date} UTC. You found the revisions, packed a proof, and checked a delivery against a trusted reference.` : `${count}/6 chapters completed. Your best scores total ${total()}/18 bookplates. Follow a change, build a proof, and keep the source of trust in sight.`;
  lastResult = dailyMode ? `Merkle Mystery · ${daily.date} UTC · ${score(failures,guided)}/3 bookplates` : `Merkle Mystery · ${count}/6 chapters · ${total()}/18 bookplates`;
  lastResult += '\nhttps://crypto-lab.systemslibrarian.dev/games/merkle-mystery/';
  $('copy-status').textContent = ''; $('copy-fallback').hidden = true;
  $('finish').focus({preventScroll:true}); $('finish').scrollIntoView({behavior:'smooth',block:'start'});
}
async function advance() {
  if (mode === 'daily') { if (phase === 2) return finish(); phase++; await start({reset:false}); }
  else { if (chapter === 5) return finish(); chapter++; await start(); }
  $('case-title').scrollIntoView({behavior:'smooth',block:'start'});
}
function showProof(trace, expected) {
  $('proof-details').hidden = false;
  $('proof-steps').innerHTML = trace.steps.map(step=>`<li>${esc(step.label)}<code>${step.hash}</code></li>`).join('') + `<li>Compare with the selected reference<code>${expected}</code></li>`;
}
async function check() {
  if (busy || !data) return;
  if (done) return advance();
  const ticket = epoch, kind = data.mission.kind;
  setBusy(true);
  try {
    if (kind === 'find' || kind === 'compare') {
      if (!selected.size) feedback('Select a book first. Use its passage and fingerprints as evidence.');
      else if (sameSet([...selected], data.mission.changed.map(i=>`0:${i}`))) complete();
      else fail('That selection does not match all the revisions. Compare the passages and follow the changed branches, then try again.');
    } else if (kind === 'trace') {
      if (!selected.size) feedback('Select the book and each ancestor on its route to the root.');
      else if (sameSet([...selected], changedNodes(data.before,data.after))) complete();
      else fail('The trail is not exact yet. Include the changed book and every ancestor; leave unrelated branches unmarked.');
    } else if (kind === 'pack') {
      if (!selected.size) feedback('Select sibling nodes on the tree to pack the proof.');
      else {
        const valid = await verifyBundle(data.before, bookData(data.original[data.mission.target]), data.mission.target, [...selected]);
        if (ticket !== epoch) return;
        if (valid) {
          const trace = await proofTrace(bookData(data.original[data.mission.target]), data.mission.target, data.before.size, [...selected].map(id=>nodeAt(data.before,id)).sort((a,b)=>a.level-b.level).map(node=>node.hash));
          if (ticket !== epoch) return;
          showProof(trace,data.before.root); complete();
        } else fail('The parcel does not reconstruct the recorded root. Pack exactly one sibling from each level, starting beside the book.');
      }
    } else {
      const rootChoice = kind === 'trust' ? document.querySelector('[name=root-choice]:checked')?.value : 'recorded';
      if (!rootChoice) { feedback('Choose which seal will be your reference first.'); return; }
      const item = data.parcels[parcelIndex], expected = rootChoice === 'courier' ? item.offeredRoot : data.before.root;
      const [matches, trace] = await Promise.all([verifyProof(bookData(item.book),item.index,item.size,item.proof,expected), proofTrace(bookData(item.book),item.index,item.size,item.proof)]);
      if (ticket !== epoch) return;
      verification = { matches, rootChoice };
      showProof(trace, expected); $('decisions').hidden = false;
      $('action').textContent = 'Recheck proof';
      feedback(rootChoice === 'courier' ? `The proof ${matches ? 'matches' : 'does not match'} the courier’s seal. That seal came with the parcel. Compare it with your independent archive record before trusting the delivery.` : matches ? 'The full computed root matches the independent archive record. The book is included at this position.' : 'The computed root differs from the independent archive record. This parcel fails verification.', matches && rootChoice === 'recorded' ? 'good' : 'bad');
      selectionSummary();
    }
  } catch (error) { if (ticket === epoch) feedback(`Verification could not finish: ${error.message}`, 'bad'); }
  finally { if (ticket === epoch) { setBusy(false); if (done) $('root-choices').disabled = true; } }
}
function decide(accept) {
  if (busy || done || !verification) return;
  if (data.mission.kind === 'trust' && verification.rootChoice !== 'recorded') {
    fail('A courier’s seal cannot authenticate its own parcel. Select the independently saved archive record and verify again.');
    verification = null; $('decisions').hidden = true; selectionSummary(); return;
  }
  if (accept !== verification.matches) { fail(verification.matches ? 'This proof matches the trusted record. Accepting it is the supported decision for inclusion in this archive.' : 'This proof does not match the trusted record. Quarantine the parcel.'); return; }
  if (parcelIndex + 1 < data.parcels.length) {
    parcelIndex++; verification = null; $('decisions').hidden = true; $('proof-details').hidden = true;
    $('action').textContent = 'Verify parcel'; renderParcel(); selectionSummary();
    feedback('Decision recorded. Inspect and verify the next parcel.', 'good');
  } else complete();
}
function showHint(charge = true) {
  if (!data || busy || done) return;
  if (charge) guided = true;
  const {mission} = data;
  const names = ids => ids.map(id=>{const node=nodeAt(data.before,id);return nodeName(node.level,node.index,data.before);}).join(' → ');
  const hints = {
    find: `Look at Book ${mission.changed[0]+1}. Its current passage differs from the saved one.`,
    compare: `The revised books are ${mission.changed.map(i=>i+1).join(' and ')}. Inspect both passages to see what changed.`,
    trace: `Follow this trail: ${names(pathIds(mission.target,mission.size))}.`,
    pack: `The missing siblings are: ${names(siblingIds(mission.target,mission.size))}. You already have Book ${mission.target+1}; do not pack it again.`,
    inspect: 'Run the proof calculation for each parcel. Accept if its computed root matches the independently saved root; quarantine if it differs.',
    trust: 'Use the archive record saved independently before delivery. A matching courier seal proves only that the courier’s own data fits together. Verify against the archive record, then follow the result.'
  };
  $('hint-text').hidden = false; $('hint-text').textContent = hints[mission.kind];
}
$('tree').addEventListener('click', event => {
  const button = event.target.closest('[data-node]');
  if (!button || busy || !data) return;
  const id = button.dataset.node, [level,index] = id.split(':').map(Number), kind = data.mission.kind;
  if (!done && (kind === 'trace' || kind === 'pack' && !(level===0 && index===data.mission.target) || level===0 && ['find','compare'].includes(kind))) {
    if (selected.has(id)) selected.delete(id); else selected.add(id);
    renderTree(); selectionSummary();
  }
  inspect(id);
});
$('chapters').addEventListener('click', event => { const button=event.target.closest('[data-chapter]'); if (button) {chapter=Number(button.dataset.chapter); mode='campaign'; start();} });
$('campaign-mode').addEventListener('click', () => {mode='campaign'; start();});
$('daily-mode').addEventListener('click', () => {mode='daily'; daily=dailyPlan(new Date().toISOString().slice(0,10)); phase=0; start();});
$('restart').addEventListener('click', () => {if(mode==='daily')phase=0; start();});
$('action').addEventListener('click', check);
$('hint').addEventListener('click', () => showHint());
$('accept').addEventListener('click', () => decide(true));
$('quarantine').addEventListener('click', () => decide(false));
$('root-choices').addEventListener('change', () => {verification=null; $('decisions').hidden=true; $('proof-details').hidden=true; selectionSummary(); feedback('Reference changed. Verify the parcel against this seal.');});
$('play-again').addEventListener('click', () => {mode='campaign'; chapter=0; start();});
$('clear-progress').addEventListener('click', () => {
  saved=cleanProgress(null); storageWorks=true;
  try {localStorage.removeItem(STORAGE_KEY);} catch {storageWorks=false;}
  mode='campaign'; chapter=0;
  $('storage-status').textContent=storageWorks?'Saved progress cleared.':'Scores cleared for this visit. Browser storage could not be accessed.';
  start();
});
$('copy-result').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(lastResult); $('copy-status').textContent='Result copied.'; $('copy-fallback').hidden=true; }
  catch { $('copy-fallback').value=lastResult; $('copy-fallback').hidden=false; $('copy-fallback').focus(); $('copy-fallback').select(); $('copy-status').textContent='Select and copy the result below.'; }
});
updateProgress();
if (!storageWorks) $('storage-status').textContent='Saved progress could not be read. You can still play.';
start();
