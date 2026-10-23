/**
 * A browser-only model of online transaction authentication. Its HMAC-SHA-256
 * format and issuer replay ledger are NOT EMV commands, application cryptograms,
 * or issuer rules. Never use real card numbers, payment data, or keys here.
 */
const encoder = new TextEncoder();

const hex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
const unhex = (value) => {
  if (typeof value !== 'string' || value.length % 2 || !/^[0-9a-f]*$/i.test(value)) {
    throw new TypeError('Expected even-length hexadecimal bytes');
  }
  return Uint8Array.from(value.match(/.{2}/g) ?? [], (pair) => Number.parseInt(pair, 16));
};

export function newChallenge(randomBytes = crypto.getRandomValues.bind(crypto)) {
  return hex(randomBytes(new Uint8Array(12)));
}

export function transactionBytes(packet) {
  if (!Number.isSafeInteger(packet.counter) || packet.counter < 1 ||
      !Number.isSafeInteger(packet.amountCents) || packet.amountCents < 1 ||
      !/^[0-9a-f]{24}$/.test(packet.challenge) ||
      !/^[A-Z0-9-]{1,24}$/.test(packet.terminalId) ||
      !/^[A-Z0-9-]{1,24}$/.test(packet.cardId)) {
    throw new TypeError('Invalid teaching-model transaction fields');
  }
  // Domain-separated fixed-order tuple, so altered fields cannot be confused.
  return encoder.encode(JSON.stringify([
    'crypto-lab-online-card-model-v1', packet.cardId, packet.counter,
    packet.amountCents, packet.terminalId, packet.challenge,
  ]));
}

async function importKey(secret) {
  if (!(secret instanceof Uint8Array) || secret.length !== 32) {
    throw new TypeError('Expected 32 synthetic random key bytes');
  }
  return crypto.subtle.importKey('raw', secret, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

/** Separate card and issuer operations, joined only through the packet. */
export async function makeModel(secret, cardId = 'DEMO-CARD') {
  const cardKey = await importKey(secret);
  const issuerKey = await importKey(secret);
  const acceptedCounters = new Set();
  let nextCounter = 0;
  return {
    async card({ amountCents, terminalId, challenge }) {
      const fields = { cardId, counter: ++nextCounter, amountCents, terminalId, challenge };
      const authenticator = hex(new Uint8Array(await crypto.subtle.sign('HMAC', cardKey, transactionBytes(fields))));
      return { ...fields, authenticator };
    },
    async issuer(packet, expected) {
      if (packet.cardId !== cardId) return { accepted: false, reason: 'Wrong card identity for this issuer key.' };
      if (packet.challenge !== expected.challenge) return { accepted: false, reason: 'Terminal challenge differs from this checkout.' };
      if (packet.amountCents !== expected.amountCents || packet.terminalId !== expected.terminalId) {
        return { accepted: false, reason: 'Amount or terminal differs from this checkout.' };
      }
      let authentic;
      try {
        authentic = await crypto.subtle.verify('HMAC', issuerKey, unhex(packet.authenticator), transactionBytes(packet));
      } catch {
        return { accepted: false, reason: 'Malformed transaction or authenticator.' };
      }
      if (!authentic) return { accepted: false, reason: 'Changed fields fail the issuer authenticator check.' };
      if (acceptedCounters.has(packet.counter)) return { accepted: false, reason: 'This model already accepted the card counter.' };
      acceptedCounters.add(packet.counter);
      return { accepted: true, reason: 'Fresh, matching model transaction accepted.' };
    },
  };
}
