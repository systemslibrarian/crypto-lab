// Secret Council: exact educational Shamir arithmetic over F_17.
// All coefficients, including the highest, may be zero. No real secrets belong here.
export const PRIME = 17;
export const mod = n => ((n % PRIME) + PRIME) % PRIME;
const fieldElement = n => Number.isInteger(n) && n >= 0 && n < PRIME;
export function inverse(n) {
  n = mod(n);
  if (!n) throw new RangeError('Zero has no inverse.');
  for (let i = 1; i < PRIME; i++) if (mod(n * i) === 1) return i;
  throw new RangeError('No inverse.');
}
export function evaluate(coefficients, x) {
  return coefficients.reduceRight((value, c) => mod(value * x + c), 0);
}
function validatePoints(points, allowZero = false) {
  const seen = new Set();
  for (const { x, y } of points) {
    if (!fieldElement(x) || (!allowZero && x === 0) || !fieldElement(y) || seen.has(x)) {
      throw new RangeError('Shares need distinct nonzero x coordinates and field values.');
    }
    seen.add(x);
  }
}
export function interpolate(points, at = 0) {
  if (!points.length || !fieldElement(at)) throw new RangeError('Missing points or invalid coordinate.');
  validatePoints(points, true);
  return mod(points.reduce((sum, a, i) => {
    const weight = points.reduce((w, b, j) => i === j ? w : mod(w * mod(at - b.x) * inverse(a.x - b.x)), 1);
    return mod(sum + a.y * weight);
  }, 0));
}
export function reconstruct(points, threshold) {
  if (!Number.isInteger(threshold) || threshold < 2 || threshold >= PRIME) throw new RangeError('Invalid threshold.');
  validatePoints(points);
  if (points.length < threshold) throw new RangeError('Not enough distinct shares.');
  const basis = points.slice(0, threshold);
  if (points.some(p => interpolate(basis, p.x) !== p.y)) throw new RangeError('Inconsistent shares.');
  return interpolate(basis);
}
export function randomField() {
  if (!globalThis.crypto?.getRandomValues) throw new Error('This browser needs secure random-number support.');
  const byte = new Uint8Array(1);
  // 255 is divisible by 17: reject 255 rather than biasing residue zero.
  do { globalThis.crypto.getRandomValues(byte); } while (byte[0] >= 255);
  return byte[0] % PRIME;
}
export function deal(memberIds, threshold, random = randomField) {
  if (!Number.isInteger(threshold) || threshold < 2 || threshold > memberIds.length || memberIds.length >= PRIME ||
      new Set(memberIds).size !== memberIds.length || memberIds.some(id => !Number.isInteger(id) || id < 0 || id > 6)) {
    throw new RangeError('Choose distinct council members and a valid threshold.');
  }
  const coefficients = Array.from({ length: threshold }, () => random());
  if (!coefficients.every(fieldElement)) throw new RangeError('Random source returned an invalid field element.');
  return { secret: coefficients[0], coefficients, threshold,
    shares: memberIds.map(id => ({ id, x: id + 1, y: evaluate(coefficients, id + 1) })) };
}
export function possibleSecrets(points, threshold) {
  validatePoints(points);
  if (!Number.isInteger(threshold) || threshold < 2 || threshold >= PRIME) throw new RangeError('Invalid threshold.');
  return points.length < threshold ? Array.from({ length: PRIME }, (_, i) => i) : [reconstruct(points, threshold)];
}
export function compatiblePoints(points, candidate, threshold) {
  const options = possibleSecrets(points, threshold);
  if (!options.includes(candidate)) throw new RangeError('Candidate is inconsistent with these shares.');
  const basis = points.length < threshold ? [{ x: 0, y: candidate }, ...points] : points.slice(0, threshold);
  return Array.from({ length: PRIME }, (_, x) => ({ x, y: interpolate(basis, x) }));
}

export const MEMBERS = [
  { name: 'Ada', role: 'The archivist', zone: 'Archive', symbol: 'A' },
  { name: 'Bram', role: 'The historian', zone: 'Archive', symbol: 'B' },
  { name: 'Cleo', role: 'The scribe', zone: 'Archive', symbol: 'C' },
  { name: 'Dara', role: 'The navigator', zone: 'Harbor', symbol: 'D' },
  { name: 'Enzo', role: 'The cartographer', zone: 'Harbor', symbol: 'E' },
  { name: 'Faye', role: 'The astronomer', zone: 'Tower', symbol: 'F' },
  { name: 'Gus', role: 'The watchkeeper', zone: 'Tower', symbol: 'G' },
];
const theft = (name, affected, description) => ({ kind: 'theft', name, affected, description });
const outage = (name, affected, description) => ({ kind: 'outage', name, affected, description });
const any = (kind, count) => ({ kind, count, name: kind === 'theft' ? `${count === 1 ? 'One' : count} stolen share${count === 1 ? '' : 's'}` : `${count === 1 ? 'One' : count} absent keeper${count === 1 ? '' : 's'}`,
  description: kind === 'theft' ? `An intruder copies any ${count} of the issued shares.` : `Any ${count} share holders become unavailable.` });
export const CAMPAIGN = [
  { title: 'The first oath', subtitle: 'One secret. Shared responsibility.', seats: 3, initial: [0, 3, 5], initialThreshold: 3,
    brief: 'The city’s seed vault needs three keepers. One stolen share must reveal nothing; one absent keeper must not lock everyone out.',
    lesson: 'A 2-of-3 council tolerates one missing share while one stolen share remains insufficient.',
    events: [any('theft', 1), any('outage', 1)] },
  { title: 'A larger circle', subtitle: 'Find the balance.', seats: 5, initial: [0, 1, 2, 3, 4], initialThreshold: 2,
    brief: 'Five keepers will guard the city charter. Protect it against two stolen shares and keep it recoverable when two keepers are away.',
    lesson: 'The threshold must exceed the number of stolen shares and fit within the number still available: here, 3-of-5.',
    events: [any('theft', 2), any('outage', 2)] },
  { title: 'When the river rises', subtitle: 'Location is part of the puzzle.', seats: 5, initial: [0, 1, 2, 3, 4], initialThreshold: 3,
    brief: 'Choose five keepers. Two stolen shares remain a risk. A flood could cut off every keeper in the Archive at once.',
    lesson: 'Independent people can still share a common failure. Distribute shares across locations as well as people.',
    events: [any('theft', 2), outage('The Archive floods', [0, 1, 2], 'Ada, Bram, and Cleo cannot send their shares.')] },
  { title: 'Three houses', subtitle: 'No house holds all the power.', seats: 5, initial: [0, 1, 2, 3, 4], initialThreshold: 3,
    brief: 'Choose five keepers. Any one house could lose its connection—or have all of its shares copied. Your council must withstand each possibility.',
    lesson: 'A 2–2–1 distribution with a threshold of 3 survives every single-house trial in this mission.',
    events: ['Archive', 'Harbor', 'Tower'].flatMap(zone => {
      const ids = MEMBERS.flatMap((m, i) => m.zone === zone ? [i] : []);
      return [theft(`${zone} shares copied`, ids, `An intruder copies every issued share held in the ${zone}.`),
        outage(`${zone} goes silent`, ids, `Every keeper in the ${zone} becomes unavailable.`)];
    }) },
  { title: 'The sixth seat', subtitle: 'More shares, a new balance.', seats: 6, initial: [0, 1, 2, 3, 4, 5], initialThreshold: 3,
    brief: 'Six keepers must resist three stolen shares. A whole house may also go offline. Choose the sixth seat carefully.',
    lesson: 'Six shares split 2–2–2 allow a threshold of 4: three stolen shares are insufficient and any one house can be absent.',
    events: [any('theft', 3), ...['Archive', 'Harbor', 'Tower'].map(zone => outage(`${zone} goes silent`,
      MEMBERS.flatMap((m, i) => m.zone === zone ? [i] : []), `Every keeper in the ${zone} becomes unavailable.`))] },
  { title: 'The lasting council', subtitle: 'Read the people, not just the places.', seats: 5, initial: [0, 1, 2, 3, 4], initialThreshold: 3,
    brief: 'Your final charter has five seats. Keep the secret safe and recoverable across these overlapping risks. A sound plan must pass every trial.',
    lesson: 'The right policy depends on the threats you model. Passing these trials is not a promise against every possible failure.',
    events: [theft('The Archive is compromised', [0, 1, 2], 'All issued shares in the Archive are copied.'),
      theft('A quiet alliance', [1, 4, 6], 'Bram, Enzo, and Gus combine any shares they hold.'),
      outage('The harbor closes', [3, 4], 'Dara and Enzo are unreachable.'),
      outage('The long expedition', [0, 3, 5], 'Ada, Dara, and Faye are away from the council.')] },
];
export function eventOutcome(ids, threshold, event) {
  const affected = event.affected ? ids.filter(id => event.affected.includes(id)) : ids.slice(0, Math.min(ids.length, event.count));
  const available = ids.filter(id => !affected.includes(id));
  return { affected, available, pass: event.kind === 'theft' ? affected.length < threshold : available.length >= threshold };
}
export function assess(mission, ids, threshold) {
  const valid = ids.length === mission.seats && new Set(ids).size === ids.length &&
    ids.every(id => Number.isInteger(id) && id >= 0 && id < MEMBERS.length) && Number.isInteger(threshold) && threshold >= 2 && threshold <= ids.length;
  const outcomes = valid ? mission.events.map(e => eventOutcome(ids, threshold, e)) : [];
  return { valid, outcomes, pass: valid && outcomes.every(o => o.pass) };
}
export function solutions(mission) {
  const found = [];
  for (let mask = 0; mask < 128; mask++) {
    const ids = MEMBERS.flatMap((_, i) => mask & (1 << i) ? [i] : []);
    if (ids.length !== mission.seats) continue;
    for (let k = 2; k <= ids.length; k++) if (assess(mission, ids, k).pass) found.push({ ids, threshold: k });
  }
  return found;
}
// Seeded randomness is ONLY for the public puzzle layout, never Shamir coefficients.
export function dailyMission(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date + 'T00:00:00Z')) || new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) !== date) throw new RangeError('Invalid UTC date.');
  let state = [...date].reduce((s, c) => Math.imul(s ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
  const next = () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
  const permutation = MEMBERS.map((_, i) => i);
  for (let i = 6; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [permutation[i], permutation[j]] = [permutation[j], permutation[i]]; }
  const base = CAMPAIGN[5];
  return { ...base, title: 'The daily council', subtitle: date + ' · UTC', date,
    brief: 'One charter, shared worldwide today. Choose five keepers and a threshold that survives all four independent trials. Share numbers are freshly randomized for each attempt.',
    initial: base.initial.map(id => permutation[id]), events: base.events.map((event, i) => ({ ...event,
      name: ['A stolen ledger', 'A secret alliance', 'The broken bridge', 'A distant mission'][i],
      affected: event.affected.map(id => permutation[id]),
      description: event.affected.map(id => MEMBERS[permutation[id]].name).join(', ') + (event.kind === 'theft' ? ' combine any shares they hold.' : ' are unavailable.') })) };
}
