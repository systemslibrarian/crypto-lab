const $ = id => document.getElementById(id);
const cards = [...document.querySelectorAll('.chapter')];
const boxes = [...document.querySelectorAll('input[data-chapter]')];
const chapterIds = new Set(boxes.map(box => Number(box.dataset.chapter)));
const storageKey = 'crypto-lab-boneh-shoup-progress-v1';

function filter() {
  const query = $('search').value.trim().toLowerCase();
  const chapterQuery = query.match(/\bchapter\s+(\d+)\b/);
  const chapterNumber = chapterQuery ? Number(chapterQuery[1]) : null;
  const terms = (chapterQuery ? query.replace(chapterQuery[0], '') : query).trim();
  const part = $('part').value;
  const coverage = $('coverage').value;
  let count = 0;
  for (const card of cards) {
    card.hidden = Boolean(
      (chapterNumber !== null && card.id !== `chapter-${chapterNumber}`) ||
      (terms && !card.textContent.toLowerCase().includes(terms)) ||
      (part !== 'all' && card.dataset.part !== part) ||
      (coverage !== 'all' && card.dataset.coverage !== coverage)
    );
    if (!card.hidden) count++;
  }
  $('results').textContent = `${count} of ${cards.length} chapter connections`;
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
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) checked = new Set(saved.filter(n => Number.isInteger(n) && chapterIds.has(n)));
} catch { /* Progress is optional; storage access must never block the reading path. */ }

function progress() {
  for (const box of boxes) box.checked = checked.has(Number(box.dataset.chapter));
  $('progress').textContent = `${checked.size} of ${cards.length} explored`;
}

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify([...checked])); }
  catch { /* Continue with in-memory exploration progress when storage is unavailable. */ }
  progress();
}

for (const box of boxes) {
  box.disabled = false;
  box.addEventListener('change', () => {
    const n = Number(box.dataset.chapter);
    if (box.checked) checked.add(n);
    else checked.delete(n);
    save();
  });
}
$('clear-progress').addEventListener('click', () => { checked.clear(); save(); });

$('reader-controls').hidden = false;
progress();
filter();

// A part or chapter link must remain usable after filtering hid its target.
function revealHashTarget() {
  const target = document.getElementById(location.hash.slice(1));
  if (target?.classList.contains('chapter')) {
    clearFilters();
    target.scrollIntoView();
  }
}
window.addEventListener('hashchange', revealHashTarget);
for (const link of document.querySelectorAll('a[href^="#chapter-"]')) {
  link.addEventListener('click', clearFilters);
}
revealHashTarget();
