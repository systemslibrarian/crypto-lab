import { deal, reconstruct, possibleSecrets } from './core.mjs';

export const STORE = 'crypto-lab-council-vault-v1';
export const HOUSES = ['Archive', 'Harbor', 'Tower'];
export const KEEPERS = ['Ada', 'Bram', 'Dara', 'Enzo', 'Faye'];
const raid = (house, title) => ({ kind: 'theft', house, title });
const flood = (house, title) => ({ kind: 'outage', house, title });
export const NIGHTS = [
  { title: 'The river is rising', subtitle: 'Keep the seed vault ready for morning.', reserves: 1,
    brief: 'Thieves are heading for the Archive. A flood will strand the Harbor. Keep the secret from the thieves and recover it at dawn.',
    events: [raid(0, 'Dusk · Archive burglary'), flood(1, 'Midnight · Harbor flood')],
    hint: 'Try the same placement with thresholds 2, 3 and 4. Compare how many shares thieves copy with how many keepers can still arrive.',
    lesson: 'The threshold balances secrecy and recovery. A higher threshold requires more stolen shares, but also more available keepers.' },
  { title: 'One thief, two stops', subtitle: 'A copied share never forgets.', reserves: 1,
    brief: 'The same thieves will visit the Archive, then the Tower. The Harbor will flood. Their stolen shares add up across the whole night.',
    events: [raid(0, 'Dusk · Archive burglary'), raid(2, 'Midnight · Tower burglary'), flood(1, 'Before dawn · Harbor flood')],
    hint: 'Protect a house before thieves visit it, or move keepers out of their next target. Copies from earlier thefts stay with the thieves.',
    lesson: 'Shares copied from the same deal accumulate. Moving a keeper or posting a guard later cannot take back an earlier copy.' },
  { title: 'The long night', subtitle: 'People in one place share its risks.', reserves: 2,
    brief: 'Two burglaries. Two flooded houses. Only two reserves. Decide where people should wait, and when to send help.',
    events: [raid(0, 'Dusk · Archive burglary'), flood(1, 'Evening · Harbor flood'), raid(2, 'Midnight · Tower burglary'), flood(0, 'Before dawn · Archive flood')],
    hint: 'Guards prevent future copying. Ferries keep a house reachable, including after it floods. A quiet house can become the next target: read the whole forecast.',
    lesson: 'Different people can share a common failure. Placement, protection and the threshold must work together against the events you expect.' },
];
export function cleanProgress(value) {
  return { completed: NIGHTS.map((_, i) => value?.completed?.[i] === true), sound: value?.sound === true };
}
export function newNight(index = 0) {
  if (!Number.isInteger(index) || !NIGHTS[index]) throw new RangeError('Unknown night.');
  return { index, phase: 'plan', locations: [0, 0, 1, 1, 2], threshold: index === 0 ? 4 : 3,
    reserves: NIGHTS[index].reserves, guards: [], ferries: [], flooded: [], copied: [],
    gathered: [], eventIndex: 0, log: [], dealt: null, exposed: null, result: null };
}
const validHouse = n => Number.isInteger(n) && n >= 0 && n < HOUSES.length;
const validKeeper = n => Number.isInteger(n) && n >= 0 && n < KEEPERS.length;
export function available(state) {
  return KEEPERS.flatMap((_, id) => !state.flooded.includes(state.locations[id]) || state.ferries.includes(state.locations[id]) ? [id] : []);
}
export function setThreshold(state, threshold) {
  if (state.phase !== 'plan' || !Number.isInteger(threshold) || threshold < 2 || threshold > 5) throw new RangeError('Choose 2–5 shares before the night begins.');
  return { ...state, threshold };
}
export function moveKeeper(state, id, house) {
  if (!validKeeper(id) || !validHouse(house) || !['plan', 'watch', 'recover'].includes(state.phase)) throw new RangeError('Cannot move that keeper now.');
  if (state.locations[id] === house) throw new RangeError('That keeper is already here.');
  if (state.locations.filter(h => h === house).length >= 3) throw new RangeError('This house has room for three keepers.');
  if (state.phase !== 'plan' && !available(state).includes(id)) throw new RangeError('This keeper is stranded. Send a ferry to their house first.');
  if (state.flooded.includes(house) && !state.ferries.includes(house)) throw new RangeError('That house is cut off. Send a ferry before moving there.');
  if (state.phase !== 'plan' && state.reserves < 1) throw new RangeError('No reserves left. Rewind to try another plan.');
  const locations = [...state.locations]; locations[id] = house;
  return { ...state, locations, gathered: [], reserves: state.reserves - (state.phase === 'plan' ? 0 : 1),
    log: state.phase === 'plan' ? state.log : [...state.log, { kind: 'move', house, title: `${KEEPERS[id]} moved to the ${HOUSES[house]}`, text: 'One reserve used. Any stolen copy of this share remains with the thieves.' }] };
}
export function begin(state, random) {
  if (state.phase !== 'plan') throw new RangeError('The night has already begun.');
  const dealt = deal([0, 1, 2, 3, 4], state.threshold, random);
  return { ...state, phase: 'watch', dealt };
}
export function deploy(state, kind, house) {
  if (!['watch', 'recover'].includes(state.phase) || !['guard', 'ferry'].includes(kind) || !validHouse(house)) throw new RangeError('Begin the night before sending help.');
  const field = kind === 'guard' ? 'guards' : 'ferries';
  if (state[field].includes(house)) throw new RangeError('That help is already stationed here.');
  if (state.reserves < 1) throw new RangeError('No reserves left. Rewind to try another plan.');
  return { ...state, [field]: [...state[field], house], reserves: state.reserves - 1, gathered: [],
    log: [...state.log, { kind, house, title: `${kind === 'guard' ? 'Watch' : 'Ferry'} sent to the ${HOUSES[house]}`,
      text: kind === 'guard' ? 'Future burglaries here are blocked. Earlier stolen copies are not erased.' : 'Keepers here can reach the vault, even if this house floods.' }] };
}
export function advance(state) {
  if (state.phase !== 'watch') throw new RangeError('There is no next event.');
  const event = NIGHTS[state.index].events[state.eventIndex];
  const occupants = state.locations.flatMap((house, id) => house === event.house ? [id] : []);
  let next = { ...state, eventIndex: state.eventIndex + 1 };
  let text;
  if (event.kind === 'theft') {
    const blocked = state.guards.includes(event.house);
    next.copied = [...new Set([...state.copied, ...(blocked ? [] : occupants)])];
    const count = next.copied.length;
    if (count >= state.threshold) next.exposed = reconstruct(state.dealt.shares.filter(p => next.copied.includes(p.id)), state.threshold);
    text = blocked ? `The watch turned the thieves away. They still hold ${count} distinct shares.`
      : `${occupants.length ? occupants.map(id => KEEPERS[id]).join(', ') + ': shares copied.' : 'The house was empty; nothing was copied.'} Thieves now hold ${count} distinct shares; they need ${state.threshold}.`;
    if (next.exposed !== null) text += ` They reconstructed secret ${next.exposed}. Later help cannot undo this.`;
  } else {
    next.flooded = [...new Set([...state.flooded, event.house])];
    text = state.ferries.includes(event.house) ? `The ferry keeps ${occupants.length} keeper${occupants.length === 1 ? '' : 's'} connected.`
      : occupants.length ? `${occupants.map(id => KEEPERS[id]).join(', ')} stranded. Their shares still exist, but cannot reach the vault.` : 'The house was empty; no keeper was stranded.';
    text += ` ${available(next).length} of 5 shares can now arrive.`;
  }
  next.log = [...state.log, { ...event, text }];
  if (next.eventIndex === NIGHTS[state.index].events.length) next.phase = 'recover';
  return next;
}
export function gather(state, id) {
  if (state.phase !== 'recover' || !validKeeper(id) || !available(state).includes(id)) throw new RangeError('Only reachable keepers can bring a share.');
  return { ...state, gathered: state.gathered.includes(id) ? state.gathered.filter(n => n !== id) : [...state.gathered, id] };
}
export function finish(state) {
  if (state.phase !== 'recover') throw new RangeError('Wait until dawn.');
  const canArrive = available(state);
  if (canArrive.length >= state.threshold && state.gathered.length < state.threshold) throw new RangeError(`Choose ${state.threshold - state.gathered.length} more reachable keeper${state.threshold - state.gathered.length === 1 ? '' : 's'} on the map to bring their shares.`);
  const recovered = state.gathered.length >= state.threshold ? reconstruct(state.dealt.shares.filter(p => state.gathered.includes(p.id)), state.threshold) : null;
  if (recovered !== null && recovered !== state.dealt.secret) throw new Error('Recovery did not match the dealt secret.');
  const options = possibleSecrets(state.dealt.shares.filter(p => state.copied.includes(p.id)), state.threshold);
  const result = { safe: state.exposed === null, recovered, pass: state.exposed === null && recovered !== null,
    copied: state.copied.length, available: canArrive.length, threshold: state.threshold,
    possibilities: options.length, reserves: state.reserves, locations: [...state.locations] };
  return { ...state, phase: 'result', result };
}
