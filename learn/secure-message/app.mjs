import { assess } from './model.mjs';
const form = document.getElementById('capabilities');
const result = document.getElementById('assessment');
function render() {
  const values = Object.fromEntries([...form.querySelectorAll('input')].map(input => [input.name, input.checked]));
  const r = assess(values);
  result.replaceChildren();
  for (const text of [
    `Read the agreement: ${r.contents ? 'possible under the selected assumptions' : 'no selected path succeeds in this limited model'}.`,
    `Infer a communication relationship: ${r.relationship ? 'possible under the selected traffic and identity assumptions; this does not establish its purpose' : 'not established by the selected assumptions'}.`,
    ...r.reasons,
    'Revoking or rotating a key now does not remove a copy already held by an observer. Unselected paths and real-world vulnerabilities remain outside this exercise.',
  ]) { const p = document.createElement('p'); p.textContent = text; result.append(p); }
}
form.addEventListener('change', render);
document.getElementById('reset-case').addEventListener('click', () => { form.reset(); render(); });
render();
