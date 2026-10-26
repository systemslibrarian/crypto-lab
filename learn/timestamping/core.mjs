import {digest, randomId, sign, verify} from '../shared/crypto.mjs';

const SHA256_HEX = /^[a-f0-9]{64}$/;
const POWER_OF_TWO = value => value > 0 && (value & (value - 1)) === 0;

// Fixed-order, domain-separated encoding. This is NOT RFC 3161 ASN.1/CMS.
export const stampBytes = token => JSON.stringify([
  'crypto-lab-timestamp-v2',
  token.serial,
  token.imprint,
  token.nonce,
  token.time,
  token.epoch
]);

// Timestamp renewal covers the complete prior token, including its signature.
// RFC 4998 uses the encoded timeStamp field; this browser model uses this
// documented JSON encoding instead of CMS/DER.
export const timestampTokenBytes = token => JSON.stringify([
  'crypto-lab-timestamp-token-v1',
  token.serial,
  token.imprint,
  token.nonce,
  token.time,
  token.epoch,
  token.signature
]);

export async function issueImprintStamp(key, imprint, nonce, time = new Date().toISOString(), epoch = 'local-ephemeral') {
  if (!SHA256_HEX.test(imprint)) throw new Error('A timestamp imprint must be a 32-byte lowercase SHA-256 value');
  const token = {serial: randomId(), imprint, nonce, time, epoch};
  return {...token, signature: await sign(key, stampBytes(token))};
}

export async function issueStamp(key, text, nonce, time = new Date().toISOString(), epoch = 'local-ephemeral') {
  return issueImprintStamp(key, await digest(text), nonce, time, epoch);
}

export async function checkImprintStamp(key, token, expectedImprint, expectedNonce) {
  return {
    signature: await verify(key, stampBytes(token), token.signature),
    imprint: token.imprint === expectedImprint,
    nonce: token.nonce === expectedNonce,
    trustedTime: false // A browser clock + ephemeral signer cannot establish external time.
  };
}

export async function checkStamp(key, token, text, expectedNonce) {
  return checkImprintStamp(key, token, await digest(text), expectedNonce);
}

const leafHash = document => digest(JSON.stringify(['crypto-lab-ers-leaf-v1', document]));
const nodeHash = (left, right) => digest(JSON.stringify(['crypto-lab-ers-node-v1', left, right]));

export async function makeMerkleBatch(documents) {
  if (!Array.isArray(documents) || documents.length < 2 || documents.length > 8 || !POWER_OF_TWO(documents.length)) {
    throw new Error('This bounded lesson accepts 2, 4, or 8 documents');
  }
  if (documents.some(document => typeof document !== 'string')) throw new Error('Every archived document must be text');

  const leaves = await Promise.all(documents.map(leafHash));
  const proofs = documents.map(() => []);
  let level = leaves.map((hash, index) => ({hash, indexes: [index]}));

  while (level.length > 1) {
    const next = [];
    for (let index = 0; index < level.length; index += 2) {
      const left = level[index];
      const right = level[index + 1];
      for (const leaf of left.indexes) proofs[leaf].push({side: 'right', hash: right.hash});
      for (const leaf of right.indexes) proofs[leaf].push({side: 'left', hash: left.hash});
      next.push({hash: await nodeHash(left.hash, right.hash), indexes: [...left.indexes, ...right.indexes]});
    }
    level = next;
  }
  return {root: level[0].hash, leaves, proofs};
}

export async function verifyMerkleProof(document, proof, expectedRoot) {
  if (typeof document !== 'string' || !Array.isArray(proof) || !SHA256_HEX.test(expectedRoot)) return false;
  let value = await leafHash(document);
  for (const step of proof) {
    if (!step || !['left', 'right'].includes(step.side) || !SHA256_HEX.test(step.hash)) return false;
    value = step.side === 'left' ? await nodeHash(step.hash, value) : await nodeHash(value, step.hash);
  }
  return value === expectedRoot;
}

export async function issueBatchStamp(key, documents, nonce, time, epoch = 'tsa-epoch-1') {
  const tree = await makeMerkleBatch(documents);
  const token = await issueImprintStamp(key, tree.root, nonce, time, epoch);
  return {...tree, token};
}

export async function verifyBatchDocument(key, batch, index, document, expectedNonce) {
  const proof = Number.isInteger(index) ? batch?.proofs?.[index] : undefined;
  const signature = batch?.token ? await verify(key, stampBytes(batch.token), batch.token.signature) : false;
  const root = Boolean(batch?.token && batch.token.imprint === batch.root);
  const nonce = Boolean(batch?.token && batch.token.nonce === expectedNonce);
  const inclusion = await verifyMerkleProof(document, proof, batch?.root ?? '');
  return {signature, root, nonce, inclusion, valid: signature && root && nonce && inclusion, trustedTime: false};
}

export async function renewTimestamp(key, previousToken, nonce, time, epoch = 'tsa-epoch-2') {
  return issueStamp(key, timestampTokenBytes(previousToken), nonce, time, epoch);
}

function instant(value, label) {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`${label} must be an ISO date-time`);
  return parsed;
}

export async function assessArchiveEvidence({
  oldPublicKey,
  successorPublicKey,
  batch,
  document,
  index,
  originalNonce,
  renewal = null,
  renewalNonce = null,
  timeline
}) {
  const original = await verifyBatchDocument(oldPublicKey, batch, index, document, originalNonce);
  const originalTime = instant(batch.token.time, 'Original timestamp time');
  const oldValidFrom = instant(timeline.oldValidFrom, 'Old epoch start');
  const oldTrustUntil = instant(timeline.oldTrustUntil, 'Old epoch end');
  const successorValidFrom = instant(timeline.successorValidFrom, 'Successor epoch start');
  const successorTrustUntil = instant(timeline.successorTrustUntil, 'Successor epoch end');
  const evaluationTime = instant(timeline.evaluationTime, 'Evaluation time');
  const trustedTimeModel = timeline.trustedTimeModel === true;
  const originalInEpoch = oldValidFrom <= originalTime && originalTime < oldTrustUntil && originalTime <= evaluationTime;

  if (!renewal) {
    const oldEpochCurrent = evaluationTime < oldTrustUntil;
    const valid = original.valid && originalInEpoch && oldEpochCurrent && trustedTimeModel;
    const reason = !trustedTimeModel ? 'trusted-time-required'
      : !original.valid || !originalInEpoch ? 'original-invalid'
        : !oldEpochCurrent ? 'unrenewed-expired'
          : 'accepted-current-epoch';
    return {valid, reason, original, renewal: null, originalInEpoch, oldEpochCurrent, timely: false, chronology: true, successorCurrent: false, trustedTimeModel};
  }

  const renewalCheck = await checkStamp(successorPublicKey, renewal, timestampTokenBytes(batch.token), renewalNonce);
  const renewalTime = instant(renewal.time, 'Renewal timestamp time');
  const chronology = originalTime <= renewalTime && renewalTime <= evaluationTime;
  const timely = renewalTime < oldTrustUntil;
  const renewalInSuccessorEpoch = successorValidFrom <= renewalTime && renewalTime < successorTrustUntil;
  const successorCurrent = evaluationTime < successorTrustUntil;
  const renewalValid = renewalCheck.signature && renewalCheck.imprint && renewalCheck.nonce;
  const valid = original.valid && originalInEpoch && renewalValid && chronology && timely && renewalInSuccessorEpoch && successorCurrent && trustedTimeModel;
  const reason = !trustedTimeModel ? 'trusted-time-required'
    : !original.valid || !originalInEpoch ? 'original-invalid'
      : !renewalValid ? 'renewal-invalid'
        : !chronology || !renewalInSuccessorEpoch ? 'timeline-invalid'
          : !timely ? 'late-renewal'
            : !successorCurrent ? 'successor-expired'
              : 'accepted-renewed';
  return {valid, reason, original, renewal: renewalCheck, originalInEpoch, oldEpochCurrent: false, timely, chronology, renewalInSuccessorEpoch, successorCurrent, trustedTimeModel};
}

export async function makeChain(documents) {
  let previous = '0'.repeat(64);
  const entries = [];
  for (let index = 0; index < documents.length; index++) {
    const entry = {index, imprint: await digest(documents[index]), previous};
    entry.hash = await digest(JSON.stringify(['crypto-lab-link-v1', entry.index, entry.imprint, entry.previous]));
    entries.push(entry);
    previous = entry.hash;
  }
  return entries;
}

export async function checkChain(entries, documents, pinnedHead) {
  const expected = await makeChain(documents);
  const links = entries.length === expected.length && entries.every((entry, index) => ['index', 'imprint', 'previous', 'hash'].every(key => entry[key] === expected[index][key]));
  return {links, anchor: entries.length > 0 && entries.at(-1).hash === pinnedHead};
}
