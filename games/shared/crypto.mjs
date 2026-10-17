/* Browser-native, educational primitives. The games are NOT secure protocols. */
const enc = new TextEncoder();
export function randomHex(bytes = 16) {
  if (!globalThis.crypto?.getRandomValues) throw new Error('Secure browser randomness is required.');
  const a = new Uint8Array(bytes); crypto.getRandomValues(a);
  return Array.from(a, x => x.toString(16).padStart(2, '0')).join('');
}
export async function hash(...fields) {
  if (!globalThis.crypto?.subtle) throw new Error('Web Crypto SHA-256 is required (open via HTTPS).');
  const sum = await crypto.subtle.digest('SHA-256', enc.encode(JSON.stringify(fields)));
  return Array.from(new Uint8Array(sum), x => x.toString(16).padStart(2, '0')).join('');
}
export function short(hex) { return `${hex.slice(0, 12)}…${hex.slice(-8)}`; }
export async function seal(label, choice, nonce) { return hash('crypto-lab-game-v1', label, choice, nonce); }
export async function verify(label, choice, nonce, expected) {
  return (await seal(label, choice, nonce)) === expected;
}
/** Deterministic, rejection-sampled Fisher–Yates shuffle for an AUDITABLE toy deck.
 * SHA-256 is used as a deterministic source only; this is not a vetted DRBG. */
export async function shuffle(items, seed) {
  const deck = [...items]; let counter = 0;
  for (let i = deck.length - 1; i > 0; --i) {
    const n = i + 1; const limit = Math.floor(0x100000000 / n) * n;
    let r;
    do {
      const digest = await hash('crypto-lab-shuffle-v1', seed, counter++);
      r = Number.parseInt(digest.slice(0, 8), 16);
    } while (r >= limit);
    const j = r % n;
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
export const el = id => document.getElementById(id);
export function say(id, value) { el(id).textContent = value; }
export function button(parent, title, action, className = '') {
  const item = document.createElement('button'); item.type='button'; item.textContent=title;
  if(className) item.className=className;
  item.addEventListener('click', action); parent.append(item); return item;
}
export function secureIndex(length) {
  if (!Number.isSafeInteger(length) || length < 1 || length > 0xffffffff) throw new RangeError('Invalid range');
  const lim = Math.floor(0x100000000 / length)*length;
  const x = new Uint32Array(1); do { crypto.getRandomValues(x); } while (x[0] >= lim);
  return x[0] % length;
}
