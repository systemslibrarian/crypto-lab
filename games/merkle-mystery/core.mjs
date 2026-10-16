// Merkle Mystery: fixed, complete binary trees for a visual learning game.
// RFC 9162 §2.1 leaf/node domain separation; this is not a CT implementation.
const encoder = new TextEncoder();
const HEX = /^[0-9a-f]{64}$/;
export const BOOKS = Object.freeze([
  { title: 'Atlas of Tides', text: 'The northern ferry leaves at dawn.', color: 'blue' },
  { title: 'A Cabinet of Seeds', text: 'Plant the silver beans after the first rain.', color: 'green' },
  { title: 'Letters to the Moon', text: 'Leave a lantern in the western window.', color: 'gold' },
  { title: 'The Clockmaker', text: 'The tower bell rings thirteen times.', color: 'rust' },
  { title: 'A Map of Quiet Roads', text: 'The stone bridge leads to the orchard.', color: 'blue' },
  { title: 'Winter at the Observatory', text: 'Look for the red star before sunrise.', color: 'gold' },
  { title: 'The Glass Garden', text: 'Keep the blue flowers beneath the glass.', color: 'green' },
  { title: 'Songs of the Harbor', text: 'The last boat carries a white sail.', color: 'rust' }
]);
export const CHAPTERS = Object.freeze([
  { title: 'A page out of place', short: 'Find', kind: 'find', size: 4, changed: [2], target: 2,
    story: 'Someone returned a book with one sentence changed. The librarian saved yesterday’s fingerprints. Follow the differences to the altered volume.',
    task: 'Select the one altered book, then check your finding.',
    lesson: 'A changed page changes its leaf fingerprint and every ancestor up to the root. Unrelated branches stay the same. A mismatch detects a change; it does not explain who made it.' },
  { title: 'The trail of fingerprints', short: 'Trace', kind: 'trace', size: 8, changed: [5], target: 5,
    story: 'A new sentence has appeared in Winter at the Observatory. How far does its change travel through the tree?',
    task: 'Select every affected node: the book, its ancestors, and the root.',
    lesson: 'Only the path from this book to the root changes. The other branches keep their fingerprints. The root commits to the ordered collection, through the hashes below it.' },
  { title: 'Travel light', short: 'Pack', kind: 'pack', size: 8, changed: [], target: 2,
    story: 'A neighboring library wants to check Letters to the Moon. Its librarian already has the trusted root and the book. Your satchel has room for just three fingerprints.',
    task: 'Pack the three sibling nodes needed to rebuild the root from Book 3.',
    lesson: 'Eight books need only three sibling hashes for one inclusion proof. At each level, combine the current hash with its sibling in the correct left/right order. The recipient also needs the book’s position and the tree size.' },
  { title: 'The counterfeit parcel', short: 'Inspect', kind: 'inspect', size: 8, changed: [], target: 0,
    story: 'Three parcels have arrived. Each contains a book and a proof. Check each against the root your library saved independently, then decide whether to accept it.',
    task: 'Verify each parcel, then accept a matching proof or quarantine a mismatch.',
    lesson: 'A proof binds a particular book, position, and tree size to a root. Changing the book or substituting a proof breaks that link. Passing does not certify the truth of the book’s contents.' },
  { title: 'A new edition', short: 'Compare', kind: 'compare', size: 8, changed: [1,6], target: 1,
    story: 'The editor has issued an authorized new edition. Compare the saved and current snapshots to find both revised books. A different root is expected.',
    task: 'Select the two revised books. Shared ancestors only need to change once.',
    lesson: 'A changed root can reflect an authorized revision. Hashes show differences, not intent. Comparing these full snapshots is not an append-only consistency proof.' },
  { title: 'The stolen seal', short: 'Trust', kind: 'trust', size: 8, changed: [4], target: 4,
    story: 'A courier brings an altered book, a proof, and a new seal. Everything in the parcel agrees with itself. Your archive also has a root recorded before the courier arrived.',
    task: 'Choose the reference you trust, verify the parcel, and decide its fate.',
    lesson: 'An attacker can build a valid tree for altered data. An inclusion proof is useful only relative to a root you trust through an independent channel. This game simulates that channel; it does not implement signatures.' }
]);
export function validSize(size) { return Number.isInteger(size) && size >= 1 && size <= 64 && (size & (size - 1)) === 0; }
function assertSize(size) { if (!validSize(size)) throw new RangeError('Use a complete tree of 1, 2, 4, 8, 16, 32 or 64 books.'); }
function bytes(hex) { if (typeof hex !== 'string' || !HEX.test(hex)) throw new TypeError('Expected a full lowercase SHA-256 hash.'); return Uint8Array.from(hex.match(/../g), s => parseInt(s, 16)); }
async function hash(data) {
  if (!globalThis.crypto?.subtle) throw new Error('SHA-256 needs a browser with Web Crypto on HTTPS.');
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
}
export async function leafHash(text) {
  if (typeof text !== 'string') throw new TypeError('Book data must be text.');
  const data = encoder.encode(text), input = new Uint8Array(data.length + 1);
  input.set(data, 1); return hash(input);
}
export async function nodeHash(left, right) {
  const input = new Uint8Array(65); input[0] = 1; input.set(bytes(left), 1); input.set(bytes(right), 33); return hash(input);
}
export function bookData(book) { return JSON.stringify([book.title, book.text]); }
export async function buildTree(records) {
  if (!Array.isArray(records)) throw new TypeError('Expected a list of book records.');
  assertSize(records.length);
  const levels = [await Promise.all(records.map(leafHash))];
  while (levels.at(-1).length > 1) {
    const row = levels.at(-1), next = [];
    for (let i = 0; i < row.length; i += 2) next.push(nodeHash(row[i], row[i + 1]));
    levels.push(await Promise.all(next));
  }
  return { size: records.length, levels, root: levels.at(-1)[0] };
}
function assertIndex(index, size) { assertSize(size); if (!Number.isInteger(index) || index < 0 || index >= size) throw new RangeError('Book position is outside the tree.'); }
export function pathIds(index, size) {
  assertIndex(index, size); const result = [];
  for (let level = 0; level <= Math.log2(size); level++, index = Math.floor(index / 2)) result.push(`${level}:${index}`);
  return result;
}
export function siblingIds(index, size) {
  assertIndex(index, size); const result = [];
  for (let level = 0; level < Math.log2(size); level++, index = Math.floor(index / 2)) result.push(`${level}:${index ^ 1}`);
  return result;
}
export function nodeAt(tree, id) {
  if (typeof id !== 'string' || !/^(0|[1-9]\d*):(0|[1-9]\d*)$/.test(id)) throw new TypeError('Invalid node identifier.');
  const [level, index] = id.split(':').map(Number), value = tree.levels[level]?.[index];
  if (!value) throw new RangeError('Node is outside the tree.');
  return { level, index, hash: value, id };
}
export function makeProof(tree, index) { return siblingIds(index, tree.size).map(id => nodeAt(tree, id).hash); }
export async function proofTrace(record, index, size, proof) {
  assertIndex(index, size);
  if (!Array.isArray(proof) || proof.length !== Math.log2(size)) throw new RangeError('Proof has the wrong number of sibling hashes.');
  proof.forEach(bytes);
  let current = await leafHash(record), position = index;
  const steps = [{ hash: current, label: 'Book fingerprint' }];
  for (let level = 0; level < proof.length; level++) {
    const side = position % 2 ? 'left' : 'right';
    current = side === 'left' ? await nodeHash(proof[level], current) : await nodeHash(current, proof[level]);
    steps.push({ hash: current, sibling: proof[level], side, label: `Combine sibling on the ${side}` });
    position = Math.floor(position / 2);
  }
  return { root: current, steps };
}
export async function verifyProof(record, index, size, proof, trustedRoot) {
  try { bytes(trustedRoot); return (await proofTrace(record, index, size, proof)).root === trustedRoot; }
  catch { return false; }
}
export async function verifyBundle(tree, record, index, ids) {
  try {
    if (!Array.isArray(ids) || new Set(ids).size !== ids.length || ids.length !== Math.log2(tree.size)) return false;
    const nodes = ids.map(id => nodeAt(tree, id)).sort((a,b) => a.level - b.level);
    if (nodes.some((node, i) => node.level !== i)) return false;
    return verifyProof(record, index, tree.size, nodes.map(node => node.hash), tree.root);
  } catch { return false; }
}
export function sameSet(values, expected) { return values.length === expected.length && new Set(values).size === values.length && values.every(value => expected.includes(value)); }
export function changedNodes(before, after) {
  if (before.size !== after.size) throw new RangeError('Compare snapshots of the same size.');
  return before.levels.flatMap((row, level) => row.flatMap((value, i) => value !== after.levels[level][i] ? [`${level}:${i}`] : []));
}
export function score(failures, guided) { return Math.max(1, 3 - failures - Number(guided)); }
export function dailyPlan(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date + 'T00:00:00Z')) || new Date(date + 'T00:00:00Z').toISOString().slice(0,10) !== date) throw new TypeError('Expected a valid UTC calendar date.');
  let seed = 2166136261;
  for (const char of date) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
  const first = seed % 8, second = (first + 1 + ((seed >>> 3) % 7)) % 8;
  return { date, changed: [first, second].sort((a,b) => a-b), target: (seed >>> 7) % 8, parcelKind: ['genuine', 'text', 'proof', 'seal'][(seed >>> 11) % 4] };
}
export async function prepare(chapter, daily = null, phase = 0) {
  const base = daily ? CHAPTERS[[4,2,5][phase]] : CHAPTERS[chapter];
  if (!base) throw new RangeError('Unknown chapter.');
  const mission = { ...base, changed: [...base.changed] };
  if (daily) {
    mission.changed = phase === 0 ? daily.changed : phase === 2 && daily.parcelKind === 'seal' ? [daily.target] : [];
    mission.target = daily.target;
    mission.title = ['The overnight revisions', 'The morning satchel', 'A parcel at the door'][phase];
    mission.story = [
      'Two books changed overnight. Compare the recorded and current snapshots to identify the revised volumes.',
      'The archive has been restored to its recorded edition. Prepare a compact proof for today’s requested book.',
      'A courier brings today’s delivery. Choose a trusted reference, check the proof, and decide whether the parcel belongs in the recorded archive.'
    ][phase];
    mission.task = [ 'Select the two revised books.', `Pack the three sibling hashes for Book ${daily.target + 1}.`, 'Choose a reference, verify the proof, then accept or quarantine.' ][phase];
  }
  const original = BOOKS.slice(0, mission.size).map(book => ({ ...book }));
  const current = original.map((book, i) => ({ ...book, text: mission.changed.includes(i) ? book.text.replace(/\.$/, '') + ' Bring the brass key.' : book.text }));
  const [before, after] = await Promise.all([buildTree(original.map(bookData)), buildTree(current.map(bookData))]);
  let parcels = [];
  if (mission.kind === 'inspect') {
    for (const [i, kind] of ['genuine','text','proof'].entries()) parcels.push(await parcel(original, before, i * 2, kind));
  } else if (mission.kind === 'trust') parcels = [await parcel(original, before, mission.target, daily?.parcelKind || 'seal')];
  return { mission, original, current, before, after, parcels };
}
export async function parcel(books, tree, index, kind) {
  const book = { ...books[index] };
  let proof = makeProof(tree, index), offeredRoot = tree.root;
  if (kind === 'text' || kind === 'seal') book.text += ' Deliver the master key to the courier.';
  if (kind === 'proof') proof = makeProof(tree, (index + 1) % tree.size);
  if (kind === 'seal') {
    const changed = books.map((entry, i) => bookData(i === index ? book : entry));
    const forged = await buildTree(changed); proof = makeProof(forged, index); offeredRoot = forged.root;
  }
  return { book, index, size: tree.size, proof, offeredRoot };
}
export const STORAGE_KEY = 'crypto-lab-merkle-mystery-v1';
export function cleanProgress(value) {
  const best = Array.from({length:6}, (_,i) => Number.isInteger(value?.best?.[i]) && value.best[i] >= 0 && value.best[i] <= 3 ? value.best[i] : 0);
  let daily = null;
  try { if (value?.daily && Number.isInteger(value.daily.score) && value.daily.score >= 1 && value.daily.score <= 3) { dailyPlan(value.daily.date); daily = { date: value.daily.date, score: value.daily.score }; } } catch { /* malformed saved data is discarded */ }
  return { best, daily };
}
