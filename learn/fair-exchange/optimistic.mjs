// Bounded executable adaptation of Asokan–Shoup–Waidner Protocol E.
// All secrets remain in this browser-local teaching process. This is not a
// production signature, escrow, identity, transport, or durable-storage service.

const encoder = new TextEncoder();

export const ASW_ROUNDS = 16;
export const ASW_PROTOCOL = 'Asokan–Shoup–Waidner Protocol E (expanded 1999 report)';

// RFC 7919 Appendix A.1 ffdhe2048. The RFC defines p as a safe prime, g = 2,
// and q = (p - 1) / 2. We use the group as an explicit modern teaching
// instantiation of the paper's Schnorr reduction; RFC 7919 does not standardize
// Schnorr signatures or ASW fair exchange.
const P = BigInt('0x' +
  'FFFFFFFFFFFFFFFFADF85458A2BB4A9AAFDC5620273D3CF1' +
  'D8B9C583CE2D3695A9E13641146433FBCC939DCE249B3EF9' +
  '7D2FE363630C75D8F681B202AEC4617AD3DF1ED5D5FD6561' +
  '2433F51F5F066ED0856365553DED1AF3B557135E7F57C935' +
  '984F0C70E0E68B77E2A689DAF3EFE8721DF158A136ADE735' +
  '30ACCA4F483A797ABC0AB182B324FB61D108A94BB2C8E3FB' +
  'B96ADAB760D7F4681D4F42A3DE394DF4AE56EDE76372BB19' +
  '0B07A7C8EE0A6D709E02FCE1CDF7E2ECC03404CD28342F61' +
  '9172FE9CE98583FF8E4F1232EEF28183C3FE3B1B4C6FAD73' +
  '3BB5FCBC2EC22005C58EF1837D1683B2C6F34A26C1B2EFFA' +
  '886B423861285C97FFFFFFFFFFFFFFFF');
const Q = (P - 1n) / 2n;
const G = 2n;
const GROUP_BYTES = 256;
const CHALLENGE_BYTES = 32;
const RSA_BYTES = 384;
const THETA = 'schnorr-ffdhe2048-sha256-v1';

export const ASW_GROUP = Object.freeze({
  name: 'RFC 7919 ffdhe2048 subgroup',
  p: P.toString(16),
  q: Q.toString(16),
  g: G.toString(16),
  theta: THETA
});

const bytes = value => typeof value === 'string' ? encoder.encode(value) : new Uint8Array(value);
const concat = (...parts) => {
  const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) { output.set(part, offset); offset += part.length; }
  return output;
};
const hex = value => Array.from(bytes(value), byte => byte.toString(16).padStart(2, '0')).join('');
const unhex = value => {
  if (typeof value !== 'string' || value.length === 0 || value.length % 2 || !/^[0-9a-f]+$/.test(value)) throw new Error('Invalid hexadecimal bytes');
  return Uint8Array.from(value.match(/../g), pair => parseInt(pair, 16));
};
const os2ip = value => bytes(value).reduce((number, byte) => (number << 8n) | BigInt(byte), 0n);
const i2osp = (number, length) => {
  if (typeof number !== 'bigint' || number < 0n) throw new Error('Invalid non-negative integer');
  const output = new Uint8Array(length);
  for (let index = length - 1; index >= 0; index--) { output[index] = Number(number & 255n); number >>= 8n; }
  if (number !== 0n) throw new Error('Integer does not fit the requested length');
  return output;
};
const u32 = number => i2osp(BigInt(number), 4);
const sha256 = async value => new Uint8Array(await crypto.subtle.digest('SHA-256', bytes(value)));
async function domainHash(domain, ...parts) {
  const framed = [bytes(domain)];
  for (const part of parts) { const value = bytes(part); framed.push(u32(value.length), value); }
  return sha256(concat(...framed));
}
export function modPow(base, exponent, modulus) {
  if (modulus <= 0n || exponent < 0n) throw new Error('Invalid modular exponentiation');
  let result = 1n;
  base %= modulus;
  while (exponent > 0n) {
    if (exponent & 1n) result = result * base % modulus;
    base = base * base % modulus;
    exponent >>= 1n;
  }
  return result;
}
const scalar = value => {
  const number = typeof value === 'bigint' ? value : os2ip(unhex(value));
  if (number < 0n || number >= Q) throw new Error('Scalar is outside the Schnorr subgroup');
  return number;
};
const nonzeroScalar = value => {
  const number = scalar(value);
  if (number === 0n) throw new Error('Scalar must be nonzero');
  return number;
};
const scalarHex = value => hex(i2osp(value, GROUP_BYTES));
const element = value => {
  const number = typeof value === 'bigint' ? value : os2ip(unhex(value));
  if (number < 1n || number >= P || modPow(number, Q, P) !== 1n) throw new Error('Invalid subgroup element');
  return number;
};
const publicElement = value => {
  const number = element(value);
  if (number === 1n) throw new Error('Public key must not be the identity');
  return number;
};
const elementHex = value => hex(i2osp(value, GROUP_BYTES));
const divideElements = (left, right) => left * modPow(right, Q - 1n, P) % P;

function randomScalar() {
  for (;;) {
    const candidate = os2ip(crypto.getRandomValues(new Uint8Array(GROUP_BYTES)));
    if (candidate > 0n && candidate < Q) return candidate;
  }
}

async function derivedScalar(seed, domain) {
  for (let attempt = 0; attempt < 128; attempt++) {
    const blocks = [];
    for (let block = 0; block < GROUP_BYTES / 32; block++) blocks.push(await domainHash(domain, seed, u32(attempt), u32(block)));
    const candidate = os2ip(concat(...blocks));
    if (candidate < Q) return candidate;
  }
  throw new Error('Could not derive a scalar');
}

async function challengeFor(message, commitment) {
  return os2ip(await domainHash('crypto-lab-asw-schnorr-challenge-v1', i2osp(commitment, GROUP_BYTES), bytes(message))) % Q;
}

export function schnorrKeyFromSecret(secret = randomScalar()) {
  secret = nonzeroScalar(secret);
  return {secret: scalarHex(secret), publicKey: elementHex(modPow(G, secret, P))};
}

export async function schnorrSign(message, key = schnorrKeyFromSecret(), nonce = randomScalar()) {
  const secret = nonzeroScalar(key.secret);
  const publicKey = publicElement(key.publicKey);
  if (modPow(G, secret, P) !== publicKey) throw new Error('Schnorr key does not match its public value');
  nonce = nonzeroScalar(nonce);
  const commitment = modPow(G, nonce, P);
  const c = await challengeFor(message, commitment);
  const z = (nonce + c * secret) % Q;
  return {c: hex(i2osp(c, CHALLENGE_BYTES)), z: scalarHex(z)};
}

export async function verifySchnorr(publicKeyValue, message, signature) {
  try {
    const publicKey = publicElement(publicKeyValue);
    if (!signature || typeof signature.c !== 'string' || unhex(signature.c).length !== CHALLENGE_BYTES) return false;
    const c = os2ip(unhex(signature.c));
    if (c >= Q) return false;
    const z = scalar(signature.z);
    const commitment = divideElements(modPow(G, z, P), modPow(publicKey, c, P));
    return c === await challengeFor(message, commitment);
  } catch { return false; }
}

export async function reduceSchnorr(publicKey, message, signature) {
  if (!await verifySchnorr(publicKey, message, signature)) throw new Error('Cannot reduce an invalid Schnorr signature');
  const z = scalar(signature.z);
  return {
    promise: {theta: THETA, d: elementHex(modPow(G, z, P)), c: signature.c},
    inverse: scalarHex(z)
  };
}

export async function verifyReduction(publicKeyValue, message, promise) {
  try {
    if (!promise || promise.theta !== THETA || typeof promise.c !== 'string' || unhex(promise.c).length !== CHALLENGE_BYTES) return false;
    const publicKey = publicElement(publicKeyValue), d = element(promise.d), c = os2ip(unhex(promise.c));
    if (c >= Q) return false;
    const commitment = divideElements(d, modPow(publicKey, c, P));
    return c === await challengeFor(message, commitment);
  } catch { return false; }
}

export async function recoverSchnorr(publicKey, message, promise, inverse) {
  try {
    const z = scalar(inverse);
    if (promise.theta !== THETA || modPow(G, z, P) !== element(promise.d)) return null;
    const signature = {c: promise.c, z: scalarHex(z)};
    return await verifySchnorr(publicKey, message, signature) ? signature : null;
  } catch { return null; }
}

const signatureBytes = signature => concat(unhex(signature.c), unhex(signature.z));
const parseSignature = value => {
  value = bytes(value);
  if (value.length !== CHALLENGE_BYTES + GROUP_BYTES) throw new Error('Escrowed signature has the wrong length');
  return {c: hex(value.slice(0, CHALLENGE_BYTES)), z: hex(value.slice(CHALLENGE_BYTES))};
};
const conditionBytes = condition => encoder.encode(JSON.stringify(condition));
const conditionHash = async condition => hex(await domainHash('crypto-lab-asw-condition-v1', conditionBytes(condition)));

export async function generateEscrowKeyPair() {
  return crypto.subtle.generateKey({name:'RSA-OAEP', modulusLength:3072, publicExponent:new Uint8Array([1,0,1]), hash:'SHA-256'}, false, ['encrypt','decrypt']);
}

const rsaCache = new WeakMap();
const decodeBase64Url = value => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  if (typeof Buffer !== 'undefined') return Uint8Array.from(Buffer.from(normalized, 'base64'));
  return Uint8Array.from(atob(normalized), character => character.charCodeAt(0));
};
async function rsaParameters(publicKey) {
  if (rsaCache.has(publicKey)) return rsaCache.get(publicKey);
  const jwk = await crypto.subtle.exportKey('jwk', publicKey);
  const modulusBytes = decodeBase64Url(jwk.n);
  const parameters = {n:os2ip(modulusBytes), e:os2ip(decodeBase64Url(jwk.e)), length:modulusBytes.length};
  if (parameters.length !== RSA_BYTES || parameters.e !== 65537n) throw new Error('Expected a 3072-bit RSA-OAEP key with exponent 65537');
  rsaCache.set(publicKey, parameters);
  return parameters;
}

async function mgf1(seed, length) {
  const output = new Uint8Array(length);
  for (let offset = 0, counter = 0; offset < length; counter++) {
    const block = await sha256(concat(seed, u32(counter)));
    const take = Math.min(block.length, length - offset);
    output.set(block.slice(0, take), offset);
    offset += take;
  }
  return output;
}
const xor = (left, right) => Uint8Array.from(left, (value, index) => value ^ right[index]);
async function deterministicOaepEncrypt(publicKey, message, label, seed) {
  message = bytes(message); label = bytes(label); seed = bytes(seed);
  const {n,e,length} = await rsaParameters(publicKey);
  const hashLength = 32;
  if (seed.length !== hashLength) throw new Error('OAEP seed must be 32 bytes');
  if (message.length > length - 2 * hashLength - 2) throw new Error('Message is too long for RSA-OAEP');
  const labelHash = await sha256(label);
  const padding = new Uint8Array(length - message.length - 2 * hashLength - 2);
  const dataBlock = concat(labelHash, padding, new Uint8Array([1]), message);
  const maskedDataBlock = xor(dataBlock, await mgf1(seed, dataBlock.length));
  const maskedSeed = xor(seed, await mgf1(maskedDataBlock, hashLength));
  const encoded = concat(new Uint8Array([0]), maskedSeed, maskedDataBlock);
  return i2osp(modPow(os2ip(encoded), e, n), length);
}

async function h1(opening) {
  return {
    oaepSeed: await domainHash('crypto-lab-asw-h1-oaep-v1', opening),
    mask: await derivedScalar(opening, 'crypto-lab-asw-h1-scalar-v1')
  };
}
async function roundCommitment(ciphertext, image) {
  return concat(ciphertext, i2osp(image, GROUP_BYTES));
}
async function aggregateCommitment(commitments) {
  return hex(await domainHash('crypto-lab-asw-h2-vector-v1', ...commitments));
}
function randomChallenge(rounds) {
  for (;;) {
    const randomness = crypto.getRandomValues(new Uint8Array(Math.ceil(rounds / 8)));
    const result = Array.from({length:rounds}, (_, index) => (randomness[index >> 3] >> (index & 7)) & 1);
    if (result.some(Boolean)) return result;
  }
}
function checkedChallenge(challenge, rounds) {
  if (!Array.isArray(challenge) || challenge.length !== rounds || challenge.some(bit => bit !== 0 && bit !== 1) || !challenge.some(Boolean)) throw new Error('Challenge must be a nonzero bit vector of the declared length');
  return [...challenge];
}

export async function createVerifiableEscrow(publicKey, inverse, promise, condition, {rounds=ASW_ROUNDS, challenge}={}) {
  if (!Number.isInteger(rounds) || rounds < 2 || rounds > 40) throw new Error('Round count must be between 2 and 40');
  const secret = scalar(inverse), d = element(promise.d);
  if (promise.theta !== THETA || modPow(G, secret, P) !== d) throw new Error('Escrowed inverse does not match the signature promise');
  const label = conditionBytes(condition), records = [];
  for (let index = 0; index < rounds; index++) {
    const opening = crypto.getRandomValues(new Uint8Array(32));
    const derived = await h1(opening);
    const ciphertext = await deterministicOaepEncrypt(publicKey, i2osp(derived.mask, GROUP_BYTES), label, derived.oaepSeed);
    const image = modPow(G, derived.mask, P);
    records.push({opening, mask:derived.mask, ciphertext, commitment:await roundCommitment(ciphertext, image)});
  }
  // D1 completes and commits to every pair before D2 samples the verifier's
  // challenge. Keeping this ordering explicit rules out challenge-dependent
  // commitments even though prover and verifier share one teaching process.
  const commitment = await aggregateCommitment(records.map(record => record.commitment));
  const bits = checkedChallenge(challenge ?? randomChallenge(rounds), rounds);
  const responses = records.map((record, index) => bits[index] === 0
    ? {branch:0, opening:hex(record.opening)}
    : {branch:1, ciphertext:hex(record.ciphertext), shifted:scalarHex((record.mask + secret) % Q)});
  return {
    version:'crypto-lab-asw-verifiable-escrow-v1',
    theta:THETA,
    d:promise.d,
    conditionHash:await conditionHash(condition),
    rounds,
    commitment,
    challenge:bits,
    responses
  };
}

export async function verifyVerifiableEscrow(publicKey, promise, condition, proof) {
  try {
    if (!proof || proof.version !== 'crypto-lab-asw-verifiable-escrow-v1' || proof.theta !== THETA || proof.d !== promise.d) return false;
    if (!Number.isInteger(proof.rounds) || proof.rounds < 2 || proof.rounds > 40 || proof.responses?.length !== proof.rounds) return false;
    const challenge = checkedChallenge(proof.challenge, proof.rounds);
    if (proof.conditionHash !== await conditionHash(condition)) return false;
    const label = conditionBytes(condition), d = element(promise.d), commitments = [];
    for (let index = 0; index < proof.rounds; index++) {
      const response = proof.responses[index];
      if (!response || response.branch !== challenge[index]) return false;
      if (response.branch === 0) {
        const opening = unhex(response.opening);
        if (opening.length !== 32) return false;
        const derived = await h1(opening);
        const ciphertext = await deterministicOaepEncrypt(publicKey, i2osp(derived.mask, GROUP_BYTES), label, derived.oaepSeed);
        commitments.push(await roundCommitment(ciphertext, modPow(G, derived.mask, P)));
      } else {
        const ciphertext = unhex(response.ciphertext);
        if (ciphertext.length !== RSA_BYTES) return false;
        const shifted = scalar(response.shifted);
        commitments.push(await roundCommitment(ciphertext, divideElements(modPow(G, shifted, P), d)));
      }
    }
    return proof.commitment === await aggregateCommitment(commitments);
  } catch { return false; }
}

export async function decryptVerifiableEscrow(privateKey, publicKey, promise, condition, proof) {
  if (!await verifyVerifiableEscrow(publicKey, promise, condition, proof)) throw new Error('The verifiable escrow did not pass Protocol D verification');
  // The recipient checks this proof before accepting it; the TTP repeats that
  // check and then performs the condition-bound decryption and image test.
  const label = conditionBytes(condition), d = element(promise.d);
  for (let index = 0; index < proof.rounds; index++) {
    if (proof.challenge[index] !== 1) continue;
    const response = proof.responses[index];
    try {
      const plaintext = new Uint8Array(await crypto.subtle.decrypt({name:'RSA-OAEP', label}, privateKey, unhex(response.ciphertext)));
      if (plaintext.length !== GROUP_BYTES) continue;
      const mask = os2ip(plaintext), shifted = scalar(response.shifted);
      if (mask >= Q) continue;
      const recovered = (shifted - mask + Q) % Q;
      if (modPow(G, recovered, P) === d) return scalarHex(recovered);
    } catch { /* Try the next challenge-one ciphertext, as Protocol D specifies. */ }
  }
  throw new Error('The verifiable escrow did not decrypt to the promised inverse');
}

async function encryptSignature(publicKey, signature, condition) {
  return hex(await crypto.subtle.encrypt({name:'RSA-OAEP', label:conditionBytes(condition)}, publicKey, signatureBytes(signature)));
}
async function decryptSignature(privateKey, ciphertext, condition) {
  const plaintext = await crypto.subtle.decrypt({name:'RSA-OAEP', label:conditionBytes(condition)}, privateKey, unhex(ciphertext));
  return parseSignature(plaintext);
}

const sessionMessages = Object.freeze({
  alice:'Fictional agreement: Alice lends exhibit K-17 to Bob from 1–30 November; no payment.',
  bob:'Fictional agreement: Bob accepts exhibit K-17 from Alice from 1–30 November; no payment.'
});
const transactionId = async preimage => hex(await domainHash('crypto-lab-asw-one-way-id-v1', preimage));
const emptyLedger = () => ({abort:false, noAbort:false, deposit:null});
async function verifyAliceTransaction(session) {
  if (await transactionId(unhex(session.secrets.preimage)) !== session.transaction) throw new Error('Alice did not supply the preimage for this transaction');
}

function alphaCondition(session) {
  return ['asw-e-alpha-v1', session.transaction, session.alice.publicKey, session.messages.alice, THETA, session.bob.promise.d];
}
function betaCondition(session) {
  return ['asw-e-beta-v1', session.transaction, session.alpha.ciphertext, session.alice.publicKey, session.messages.alice, THETA, session.bob.promise.d];
}

export async function createOptimisticExchange({rounds=ASW_ROUNDS, escrowKeys}={}) {
  const keys = escrowKeys ?? await generateEscrowKeyPair();
  const alice = schnorrKeyFromSecret(), bob = schnorrKeyFromSecret();
  const aliceSignature = await schnorrSign(sessionMessages.alice, alice);
  const bobSignature = await schnorrSign(sessionMessages.bob, bob);
  const reducedBob = await reduceSchnorr(bob.publicKey, sessionMessages.bob, bobSignature);
  if (!await verifyReduction(bob.publicKey, sessionMessages.bob, reducedBob.promise)) throw new Error('Bob produced an invalid signature promise');
  const preimage = crypto.getRandomValues(new Uint8Array(32));
  const session = {
    protocol:ASW_PROTOCOL,
    id:hex(crypto.getRandomValues(new Uint8Array(16))),
    transaction:await transactionId(preimage),
    messages:{...sessionMessages},
    phase:'promises-verified',
    alice:{publicKey:alice.publicKey, usablePeerSignature:null},
    bob:{publicKey:bob.publicKey, promise:reducedBob.promise, usablePeerSignature:null},
    alpha:null,
    beta:null,
    intermediary:{available:true, attempts:0, contacts:0, durable:true, ledger:emptyLedger()},
    lastOutcome:'prepared',
    log:[],
    busy:false,
    secrets:{keys, preimage:hex(preimage), alice, bob, aliceSignature, bobSignature, bobInverse:reducedBob.inverse}
  };
  const alphaLabel = alphaCondition(session);
  session.alpha = {
    ciphertext:await encryptSignature(keys.publicKey, aliceSignature, alphaLabel),
    conditionHash:await conditionHash(alphaLabel),
    state:'recoverable-by-intermediary'
  };
  const betaLabel = betaCondition(session);
  session.beta = await createVerifiableEscrow(keys.publicKey, reducedBob.inverse, reducedBob.promise, betaLabel, {rounds});
  session.beta.verified = await verifyVerifiableEscrow(keys.publicKey, reducedBob.promise, betaLabel, session.beta);
  if (!session.beta.verified) throw new Error('Alice rejected Bob’s verifiable escrow');
  session.log.push('E1–E3: Bob’s Schnorr promise, Alice’s RSA-OAEP signature escrow, and Bob’s cut-and-choose inverse escrow verified. The intermediary was not contacted.');
  return session;
}

function usable(session, party, signature) {
  session[party].usablePeerSignature = structuredClone(signature);
}
function updatePhase(session) {
  const alice = Boolean(session.alice.usablePeerSignature), bob = Boolean(session.bob.usablePeerSignature);
  if (alice && bob) session.phase = 'completed';
  else if (session.intermediary.ledger.abort) session.phase = 'aborted';
  else if (alice || bob) session.phase = 'one-sided-recoverable';
  else session.phase = 'promises-verified';
}
async function contactIntermediary(session, operation, callback) {
  session.intermediary.attempts++;
  if (!session.intermediary.available) {
    session.lastOutcome = 'intermediary-unavailable';
    session.log.push(`${operation}: the intermediary is unavailable. No durable state changed; termination remains pending.`);
    return false;
  }
  session.intermediary.contacts++;
  await callback();
  updatePhase(session);
  return true;
}
async function sendAlice(session) {
  if (session.intermediary.ledger.abort) throw new Error('The exchange was already aborted');
  if (session.bob.usablePeerSignature) throw new Error('Bob already has Alice’s signature');
  if (!await verifySchnorr(session.alice.publicKey, session.messages.alice, session.secrets.aliceSignature)) throw new Error('Alice’s signature is invalid');
  usable(session, 'bob', session.secrets.aliceSignature);
  session.lastOutcome = 'alice-signature-sent';
  session.log.push('E4: Alice sent her actual signature directly. Bob verified it; the intermediary was not contacted.');
  updatePhase(session);
}
async function sendBob(session) {
  if (session.intermediary.ledger.abort) throw new Error('The exchange was already aborted');
  if (!session.bob.usablePeerSignature) throw new Error('Bob sends his inverse only after obtaining Alice’s valid signature');
  if (session.alice.usablePeerSignature) throw new Error('Alice already has Bob’s signature');
  const recovered = await recoverSchnorr(session.bob.publicKey, session.messages.bob, session.bob.promise, session.secrets.bobInverse);
  if (!recovered) throw new Error('Bob’s inverse does not recover his promised signature');
  usable(session, 'alice', recovered);
  session.lastOutcome = 'honest-path-complete';
  session.log.push('E5–E6: Bob sent the promised inverse directly. Alice recovered and independently verified his signature. Total intermediary contacts: 0.');
  updatePhase(session);
}
async function abort(session) {
  if (session.intermediary.durable && session.bob.usablePeerSignature && !session.intermediary.ledger.deposit) throw new Error('After Alice sends E4 directly, the honest schedule uses A-resolve rather than abort');
  await contactIntermediary(session, 'Abort', async () => {
    await verifyAliceTransaction(session);
    const ledger = session.intermediary.ledger;
    if (ledger.noAbort) {
      session.lastOutcome = 'abort-refused-no-abort';
      session.log.push('Abort refused: a durable NO-ABORT record already exists for this transaction.');
      return;
    }
    if (ledger.deposit && ledger.deposit.d === session.bob.promise.d) {
      const recovered = await recoverSchnorr(session.bob.publicKey, session.messages.bob, session.bob.promise, ledger.deposit.inverse);
      if (!recovered) throw new Error('The stored deposit does not match Bob’s promise');
      usable(session, 'alice', recovered);
      session.lastOutcome = 'abort-returned-deposit';
      session.log.push('Abort found Bob’s earlier DEPOSIT and returned its inverse to Alice instead of recording ABORT.');
      return;
    }
    ledger.abort = true;
    session.lastOutcome = 'abort-recorded';
    session.log.push('Abort won the race: the intermediary durably recorded ABORT. A later B-resolve must refuse release.');
  });
}
async function bResolve(session) {
  await contactIntermediary(session, 'B-resolve', async () => {
    const ledger = session.intermediary.ledger;
    if (ledger.abort) {
      session.lastOutcome = 'b-resolve-refused-abort';
      session.log.push('B-resolve refused: a durable ABORT record already exists for this transaction.');
      return;
    }
    const inverse = session.secrets.bobInverse;
    if (modPow(G, scalar(inverse), P) !== element(session.bob.promise.d)) throw new Error('Bob submitted an inverse for a different promise');
    const signature = await decryptSignature(session.secrets.keys.privateKey, session.alpha.ciphertext, alphaCondition(session));
    if (!await verifySchnorr(session.alice.publicKey, session.messages.alice, signature)) throw new Error('Alice’s escrow did not contain her valid signature');
    ledger.deposit = {d:session.bob.promise.d, inverse};
    usable(session, 'bob', signature);
    session.lastOutcome = 'b-resolve-deposited';
    session.log.push('B-resolve won the race: the intermediary verified Alice’s escrow, durably stored Bob’s matching DEPOSIT, and returned Alice’s signature to Bob.');
  });
}
async function aResolve(session) {
  await contactIntermediary(session, 'A-resolve', async () => {
    await verifyAliceTransaction(session);
    const ledger = session.intermediary.ledger;
    if (ledger.abort) {
      session.lastOutcome = 'a-resolve-refused-abort';
      session.log.push('A-resolve refused: a durable ABORT record already exists for this transaction.');
      return;
    }
    // Protocol E records NO-ABORT before checking the escrows. Remark 16 says
    // requests are processed atomically (without interleaving); the report's
    // pseudocode does not roll this record back if a later check returns error.
    ledger.noAbort = true;
    const aliceSignature = await decryptSignature(session.secrets.keys.privateKey, session.alpha.ciphertext, alphaCondition(session));
    if (!await verifySchnorr(session.alice.publicKey, session.messages.alice, aliceSignature)) throw new Error('Alice’s escrow did not contain her valid signature');
    const inverse = await decryptVerifiableEscrow(session.secrets.keys.privateKey, session.secrets.keys.publicKey, session.bob.promise, betaCondition(session), session.beta);
    const bobSignature = await recoverSchnorr(session.bob.publicKey, session.messages.bob, session.bob.promise, inverse);
    if (!bobSignature) throw new Error('Bob’s escrow did not recover his promised signature');
    usable(session, 'alice', bobSignature);
    session.lastOutcome = 'a-resolve-no-abort';
    session.log.push('A-resolve won the race: the intermediary durably recorded NO-ABORT, checked Alice’s escrow, and recovered Bob’s promised signature for Alice. Bob can still B-resolve Alice’s escrow.');
  });
}

async function transition(session, action) {
  if (action === 'send-alice') return sendAlice(session);
  if (action === 'send-bob') return sendBob(session);
  if (action === 'abort') return abort(session);
  if (action === 'b-resolve') return bResolve(session);
  if (action === 'a-resolve') return aResolve(session);
  if (action === 'forget-state') {
    const ledger = session.intermediary.ledger;
    if (!ledger.abort && !ledger.noAbort && !ledger.deposit) throw new Error('There is no intermediary decision to erase');
    session.intermediary.ledger = emptyLedger();
    session.intermediary.durable = false;
    session.lastOutcome = 'durable-state-erased';
    session.log.push('COUNTERFACTUAL FAILURE CONTROL: the intermediary lost its durable record. The paper’s state assumption no longer holds.');
    updatePhase(session);
    return;
  }
  throw new Error('Unknown optimistic-exchange action');
}

export async function optimisticAct(session, action) {
  if (session.busy) throw new Error('Another optimistic-exchange action is in progress');
  session.busy = true;
  try { return await transition(session, action); }
  finally { session.busy = false; }
}

export function setIntermediaryAvailable(session, available) {
  if (session.busy) throw new Error('Cannot change availability during an action');
  session.intermediary.available = Boolean(available);
  session.log.push(`Intermediary availability set to ${session.intermediary.available ? 'available' : 'unavailable'}.`);
}

export function optimisticView(session) {
  const ledger = session.intermediary.ledger;
  return {
    protocol:session.protocol,
    phase:session.phase,
    transaction:session.transaction,
    intermediary:{
      available:session.intermediary.available,
      attempts:session.intermediary.attempts,
      contacts:session.intermediary.contacts,
      durable:session.intermediary.durable,
      records:[ledger.abort?'ABORT':null, ledger.noAbort?'NO-ABORT':null, ledger.deposit?'DEPOSIT':null].filter(Boolean)
    },
    alice:{promise:'verified', escrow:'verified and recoverable by the intermediary', usablePeerSignature:Boolean(session.alice.usablePeerSignature)},
    bob:{escrow:'ordinary ciphertext received; contents are not publicly verifiable and only the intermediary can check them', usablePeerSignature:Boolean(session.bob.usablePeerSignature)},
    proof:{rounds:session.beta.rounds, challenge:session.beta.challenge.join(''), verified:session.beta.verified, conditionHash:session.beta.conditionHash},
    lastOutcome:session.lastOutcome
  };
}

export function optimisticVerdict(session) {
  const alice = Boolean(session.alice.usablePeerSignature), bob = Boolean(session.bob.usablePeerSignature);
  if (alice && bob) return {tone:'good', title:'Fair completion — both signatures usable', detail:`The parties can independently verify each signature. This run used ${session.intermediary.contacts} intermediary contact${session.intermediary.contacts===1?'':'s'}.`};
  if (alice !== bob && !session.intermediary.durable) return {tone:'bad', title:'Fairness lost when durable state is erased', detail:'One party has a usable signature and the contradictory later decision left the other without one. This is outside ASW’s durable, atomic intermediary model.'};
  if (session.intermediary.ledger.abort && !alice && !bob) return {tone:'good', title:'Compatible abort — neither signature usable', detail:'ABORT won the serialized race. The recoverable escrows remain ciphertexts, and later resolve requests must refuse.'};
  if (session.lastOutcome === 'intermediary-unavailable' || alice !== bob && !session.intermediary.available) return {tone:'warn', title:'Termination waits for intermediary availability', detail:'No synchronized timeout fixes this. Timeliness assumes an honest intermediary will eventually become reachable and process one request atomically.'};
  if (alice !== bob) return {tone:'warn', title:'Temporarily one-sided — resolution remains available', detail:'One party has a usable signature. The other retains the transaction preimage or compatible escrow path and can force the matching outcome while the intermediary remains available and durable.'};
  return {tone:'warn', title:'Recoverable promises, no usable peer signature yet', detail:'The E1–E3 evidence is verified, but neither party can use it as the other party’s signature without the direct inverse or a compatible intermediary resolution.'};
}

export const internalsForTests = Object.freeze({
  p:P, q:Q, g:G, groupBytes:GROUP_BYTES, signatureBytes, parseSignature,
  alphaCondition, betaCondition, conditionHash
});
