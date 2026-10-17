// A classical BB84 teaching model. Never use its replay seeds as key material.
export const STORAGE_KEY = 'crypto-lab-quantum-courier-v1';
const bit = value => {
  if (value !== 0 && value !== 1) throw new TypeError('Expected a bit.');
  return value;
};
const basis = value => {
  if (value !== '+' && value !== 'x') throw new TypeError('Expected a + or x basis.');
  return value;
};
export function measure(state, receiver, randomBit) {
  basis(state.basis); bit(state.bit); basis(receiver);
  return {basis: receiver, bit: state.basis === receiver ? state.bit : bit(randomBit())};
}
export function transmit(alice, bobBasis, eveBasis, randomBit) {
  const eve = eveBasis === null ? null : measure(alice, eveBasis, randomBit);
  return {alice: {...alice}, eve, bob: measure(eve || alice, bobBasis, randomBit)};
}
export function secureBit() {
  if (typeof globalThis.crypto?.getRandomValues !== 'function') throw new Error('This experiment needs browser random-number support.');
  return globalThis.crypto.getRandomValues(new Uint8Array(1))[0] & 1;
}
export function seededRandom(seed) {
  let state = 2166136261;
  for (const char of String(seed)) state = Math.imul(state ^ char.charCodeAt(0), 16777619) >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffle(values, random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function sift(pulses) { return pulses.filter(p => p.alice.basis === p.bob.basis).map(p => p.id); }
export function inspect(pulses, sample) {
  if (!Array.isArray(pulses) || !Array.isArray(sample)) throw new TypeError('Expected pulse and sample arrays.');
  const ids = pulses.map(p => p.id);
  if (new Set(ids).size !== ids.length || ids.some(i => !Number.isInteger(i) || i < 0)) throw new RangeError('Invalid pulse identifiers.');
  for (const p of pulses) {basis(p.alice.basis); basis(p.bob.basis); bit(p.alice.bit); bit(p.bob.bit);}
  const matched = sift(pulses);
  if (new Set(sample).size !== sample.length || sample.some(i => !matched.includes(i))) throw new RangeError('Samples must be distinct sifted positions.');
  return {
    matched,
    remaining: matched.filter(i => !sample.includes(i)),
    errors: sample.filter(i => {const p = pulses.find(p => p.id === i); return p.alice.bit !== p.bob.bit;}),
  };
}
export function sameSet(actual, expected) {
  const a = [...actual], b = [...expected];
  return new Set(a).size === a.length && new Set(b).size === b.length && a.length === b.length && a.every(v => b.includes(v));
}
// Exactly eight matches make a compact, solvable replay. This is not a
// statistical experiment in random basis matching. Sampling is before review.
export function makeReplay(seed, intercepted = false) {
  const random = seededRandom(seed), randomBit = () => Number(random() >= 0.5);
  const matching = new Set(shuffle(Array.from({length:12}, (_,i) => i), random).slice(0,8));
  const pulses = Array.from({length:12}, (_,id) => {
    const alice = {basis: randomBit() ? 'x' : '+', bit: randomBit()};
    const bobBasis = matching.has(id) ? alice.basis : alice.basis === '+' ? 'x' : '+';
    return {id, ...transmit(alice, bobBasis, intercepted ? randomBit() ? 'x' : '+' : null, randomBit)};
  });
  const sample = shuffle(sift(pulses), random).slice(0,3).sort((a,b) => a-b);
  return {pulses, sample, intercepted};
}
export function detectionProbability(sampleSize) {
  if (!Number.isInteger(sampleSize) || sampleSize < 0 || sampleSize > 100000) throw new RangeError('Invalid sample size.');
  return 1 - (3 / 4) ** sampleSize;
}
export function minimumSample(target) {
  if (!Number.isFinite(target) || target < 0 || target >= 1) throw new RangeError('Target must be between 0 and 1, excluding 1.');
  let n = 0;
  while (detectionProbability(n) < target) n++;
  return n;
}
export function validDate(date) {
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0,10) === date;
}
export function dailyPlan(date) {
  if (!validDate(date)) throw new RangeError('Expected a UTC calendar date.');
  const intercepted = seededRandom('traffic:' + date)() >= 0.5;
  return {date, ...makeReplay('flight:' + date, intercepted)};
}
export function readProgress(raw) {
  const empty = {best:[0,0,0,0,0,0], daily:null};
  try {
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.best) || data.best.length !== 6) return empty;
    empty.best = data.best.map(n => Number.isInteger(n) && n >= 0 && n <= 3 ? n : 0);
    if (data.daily && validDate(data.daily.date) && Number.isInteger(data.daily.score) && data.daily.score >= 1 && data.daily.score <= 3) empty.daily = {date:data.daily.date,score:data.daily.score};
  } catch { /* Storage is optional. */ }
  return empty;
}
export const CHAPTERS = [
  {title:'Tune the receiver',kind:'tune',tag:'01 / Calibration',brief:'Four practice pulses are ready. Tap each receiver to match the sender’s basis, then send the flight.',hint:'Match the symbols: + with +, and × with ×. A lucky bit from the wrong basis does not count.',lesson:'In this ideal model, measuring in the preparation basis gives the prepared bit. A different basis gives a random bit. Real BB84 receivers choose before the sender reveals their bases.'},
  {title:'Night delivery',kind:'sift',tag:'02 / Keep the matches',brief:'Send the flight. When the basis labels arrive, select every pulse where Alice and Bob used the same basis.',hint:'Select only cards with the same symbol for Alice’s basis and Bob’s basis. Matching bit values alone are not the rule.',lesson:'Basis sifting keeps positions measured in matching bases. These are candidate bits, not a finished secure key.'},
  {title:'Public tickets',kind:'discard',tag:'03 / Spend a sample',brief:'Send the flight. Three sifted positions will be compared in public. Pack only the matching-basis bits that have not been revealed.',hint:'Keep matching bases, then remove every card stamped PUBLIC. Publicly revealed values cannot stay in a secret key.',lesson:'A test sample is spent when its values become public. Even perfectly agreeing sampled bits must be removed from the candidate key.'},
  {title:'A shadow in the channel',kind:'inspect',tag:'04 / Read the evidence',brief:'Send the flight. Flag any public samples where Alice’s and Bob’s bits differ. Then choose what the crew should do.',hint:'Compare the two values on each PUBLIC card. Flag the disagreements. Our conservative training rule pauses a flight on any sampled error.',lesson:'This authored flight includes interception. Disturbance is a reason to stop and investigate; in a real system, noise can also cause errors. An error alone does not identify an eavesdropper.'},
  {title:'Quiet skies',kind:'inspect',tag:'05 / A clean sample',brief:'This flight looks peaceful. Check the public samples, flag any disagreements, and decide how much a clean sample really tells you.',hint:'Zero sampled errors does not prove no interception. Continue processing means more security work, never “the key is ready.”',lesson:'An interceptor was present in this authored replay, yet the small public sample showed no errors. A clean sample is limited evidence. Parameter estimation, error correction and privacy amplification still matter.'},
  {title:'Plan the flight',kind:'budget',tag:'06 / The cost of confidence',brief:'You have 24 sifted bits. Use the smallest public sample that reaches 95% detection in the stated attack model, while leaving at least 12 candidate bits.',hint:'Try 10 and 11 sampled bits. The target is at least 95%, and every sample costs one candidate bit.',lesson:'Eleven samples detect at least one error with about 95.8% probability in this specific full intercept/resend model, leaving 13 candidate bits. This is not a general security guarantee or the probability that the channel is safe.'},
];
