const $=id=>document.getElementById(id),cards=[...document.querySelectorAll('.chapter')];
function filter(){const query=$('search').value.trim().toLowerCase(),part=$('part').value,coverage=$('coverage').value;let count=0;for(const card of cards){card.hidden=!!(query&&!card.textContent.toLowerCase().includes(query)||part!=='all'&&card.dataset.part!==part||coverage!=='all'&&card.dataset.coverage!==coverage);if(!card.hidden)count++;}$('results').textContent=`${count} of ${cards.length} chapter connections`;$('empty').hidden=count!==0;}
for(const id of ['search','part','coverage'])$(id).addEventListener('input',filter);
$('clear').onclick=()=>{$('search').value='';$('part').value='all';$('coverage').value='all';filter();};
const storageKey='crypto-lab-reading-path-v1';let checked=new Set();
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(saved))checked=new Set(saved.filter(n=>Number.isInteger(n)&&n>=1&&n<=25));}catch{/* Progress is optional. */}
const boxes=[...document.querySelectorAll('[data-chapter]')];
function progress(){for(const box of boxes)box.checked=checked.has(Number(box.dataset.chapter));$('progress').textContent=`${checked.size} of 25 explored`;}
function save(){try{localStorage.setItem(storageKey,JSON.stringify([...checked]));}catch{/* No persistence does not block learning. */}progress();}
for(const box of boxes)box.onchange=()=>{const n=Number(box.dataset.chapter);box.checked?checked.add(n):checked.delete(n);save();};
$('clear-progress').onclick=()=>{checked.clear();save();};progress();
