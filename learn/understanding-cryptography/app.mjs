const $ = id => document.getElementById(id);
const cards = [...document.querySelectorAll('.chapter')];
const boxes = [...document.querySelectorAll('input[data-entry]')];
const entryIds = new Set(boxes.map(box => box.dataset.entry));
const storageKey = 'crypto-lab-understanding-cryptography-2e-progress-v1';

function filter() {
  let query = $('search').value.trim().toLowerCase();
  const chapterQuery = query.match(/\b(?:chapter|ch\.?)\s*(\d+)\b/);
  const chapterNumber = chapterQuery ? Number(chapterQuery[1]) : null;
  if (chapterQuery) query = query.replace(chapterQuery[0], '').trim();
  const sectionQuery = query.match(/(?:\b(?:section|sec\.?)\s*|§\s*)(\d+(?:\.\d+)+)\b/);
  const sectionNumber = sectionQuery ? sectionQuery[1] : null;
  if (sectionQuery) query = query.replace(sectionQuery[0], '').trim();
  const part = $('part').value;
  const coverage = $('coverage').value;
  let count = 0;
  for (const card of cards) {
    const sections = card.dataset.sections.match(/\d+(?:\.\d+)+/g) || [];
    card.hidden = Boolean(
      (chapterNumber !== null && Number(card.dataset.chapter) !== chapterNumber) ||
      (sectionNumber !== null && !sections.some(section => section === sectionNumber || section.startsWith(`${sectionNumber}.`))) ||
      (query && !card.textContent.toLowerCase().includes(query)) ||
      (part !== 'all' && card.dataset.part !== part) ||
      (coverage !== 'all' && card.dataset.coverage !== coverage)
    );
    if (!card.hidden) count++;
  }
  $('results').textContent = `${count} of ${cards.length} study stops`;
  $('empty').hidden = count !== 0;
}

function clearFilters() {
  $('search').value = '';
  $('part').value = 'all';
  $('coverage').value = 'all';
  filter();
}

for (const id of ['search', 'part', 'coverage']) $(id).addEventListener('input', filter);
$('clear').addEventListener('click', clearFilters);

let checked = new Set();
let persistent = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) checked = new Set(saved.filter(id => typeof id === 'string' && entryIds.has(id)));
} catch { persistent = false; }

function progress() {
  for (const box of boxes) box.checked = checked.has(box.dataset.entry);
  $('progress').textContent = `${checked.size} of ${cards.length} explored`;
  $('storage-note').textContent = persistent ? 'This browser only.' : 'Progress is available for this visit only.';
}

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify([...checked])); persistent = true; }
  catch { persistent = false; }
  progress();
}

for (const box of boxes) {
  box.disabled = false;
  box.addEventListener('change', () => {
    const id = box.dataset.entry;
    if (box.checked) checked.add(id);
    else checked.delete(id);
    save();
  });
}
$('clear-progress').addEventListener('click', () => { checked.clear(); save(); });

$('reader-controls').hidden = false;
progress();
filter();

// Contents links remain usable even after a filter hides their target.
function revealHashTarget() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); }
  catch { return; }
  const target = $(id);
  if (target?.classList.contains('chapter')) {
    clearFilters();
    target.scrollIntoView();
  }
}
window.addEventListener('hashchange', revealHashTarget);
for (const link of document.querySelectorAll('a[href^="#"]')) {
  const target = $(link.getAttribute('href').slice(1));
  if (target?.classList.contains('chapter')) link.addEventListener('click', clearFilters);
}
revealHashTarget();
