import {signingKey, randomId} from '../shared/crypto.mjs';
import {
  issueStamp, checkStamp, makeChain, checkChain, issueBatchStamp,
  verifyBatchDocument, renewTimestamp, assessArchiveEvidence
} from './core.mjs';

const $ = id => document.getElementById(id);
const BATCH_DOCUMENTS = [
  'Exhibition proposal · version 1',
  'Committee review · approved',
  'Loan agreement · signed',
  'Opening notice · published'
];
const TIMELINE = {
  oldValidFrom: '2029-01-01T00:00:00.000Z',
  oldTrustUntil: '2030-01-01T00:00:00.000Z',
  successorValidFrom: '2029-10-01T00:00:00.000Z',
  successorTrustUntil: '2035-01-01T00:00:00.000Z',
  evaluationTime: '2031-01-01T00:00:00.000Z',
  trustedTimeModel: true
};

let authority;
let token;
let nonce = randomId();
let busy = false;
let entries = [];
let pinned = '';
let documents = [];
let archiveAuthority;
let successorAuthority;
let batch;
let batchNonce;
let renewalCases;

function status(id, title, detail, tone = 'warn') {
  const box = $(id);
  box.dataset.tone = tone;
  box.replaceChildren();
  const strong = document.createElement('strong');
  strong.textContent = title;
  const paragraph = document.createElement('p');
  paragraph.textContent = detail;
  box.append(strong, paragraph);
}

function controls() {
  document.querySelectorAll('button').forEach(button => { button.disabled = busy || !authority; });
  for (const id of ['check', 'change', 'alter', 'backdate', 'replay']) $(id).disabled = busy || !token;
  for (const id of ['check-batch', 'wrong-path', 'wrong-root']) $(id).disabled = busy || !batch;
  $('document').disabled = busy;
  $('batch-document').disabled = busy || !batch;
  $('renewal-case').disabled = busy || !renewalCases;
  $('trusted-time').disabled = busy || !renewalCases;
}

async function run(fn) {
  if (busy) return;
  busy = true;
  controls();
  try { await fn(); }
  catch (error) { status('status', 'Operation failed', error.message, 'bad'); }
  finally { busy = false; controls(); }
}

function receipt() { $('receipt').textContent = JSON.stringify(token, null, 2); }

async function check() {
  const result = await checkStamp(authority.publicKey, token, $('document').value, nonce);
  receipt();
  const valid = result.signature && result.imprint && result.nonce;
  status(
    'status',
    valid ? 'Cryptographic checks pass — time still needs trust' : 'Evidence rejected',
    `Signature: ${result.signature ? 'valid' : 'INVALID'}. Document fingerprint: ${result.imprint ? 'matches' : 'MISMATCH'}. Request nonce: ${result.nonce ? 'matches' : 'MISMATCH'}. Claimed time: ${token.time}. This local signature cannot establish an independently trusted time.`,
    valid ? 'good' : 'bad'
  );
}

async function issue(time) {
  nonce = randomId();
  token = await issueStamp(authority.privateKey, $('document').value, nonce, time);
  await check();
}

function drawChain() {
  const list = $('chain');
  list.replaceChildren();
  entries.forEach((entry, index) => {
    const item = document.createElement('li');
    const paragraph = document.createElement('p');
    paragraph.textContent = documents[index];
    const code = document.createElement('code');
    code.textContent = entry.hash;
    item.append(paragraph, code);
    list.append(item);
  });
  $('anchor').textContent = pinned;
}

async function checkLog() {
  const result = await checkChain(entries, documents, pinned);
  status(
    'chain-status',
    result.links && result.anchor ? 'History matches its pinned checkpoint' : !result.links ? 'Document or link mismatch' : 'Consistent rewrite — checkpoint mismatch',
    `Internal links: ${result.links ? 'valid' : 'INVALID'}. Pinned final hash: ${result.anchor ? 'matches' : 'MISMATCH'}. ${result.links && !result.anchor ? 'The operator repaired the chain, but cannot silently replace the checkpoint held by a witness.' : 'A checkpoint must be retained outside the operator’s control to expose a complete rewrite.'}`,
    result.links && result.anchor ? 'good' : 'bad'
  );
  drawChain();
}

async function resetLog() {
  documents = ['Proposal version 1', 'Committee review completed', 'Exhibition announced'];
  entries = await makeChain(documents);
  pinned = entries.at(-1).hash;
  await checkLog();
}

function flipHex(value) { return `${value[0] === '0' ? '1' : '0'}${value.slice(1)}`; }

async function drawBatch(view = batch, label = 'Original batch') {
  const list = $('batch-results');
  list.replaceChildren();
  let passed = 0;
  for (let index = 0; index < BATCH_DOCUMENTS.length; index++) {
    const result = await verifyBatchDocument(archiveAuthority.publicKey, view, index, BATCH_DOCUMENTS[index], batchNonce);
    if (result.valid) passed++;
    const item = document.createElement('li');
    const title = document.createElement('strong');
    title.textContent = `${index + 1} · ${BATCH_DOCUMENTS[index]} — ${result.valid ? 'PASS' : 'REJECT'}`;
    const detail = document.createElement('p');
    detail.textContent = `Signed root: ${result.signature && result.root ? 'matches' : 'FAIL'}. Request nonce: ${result.nonce ? 'matches' : 'FAIL'}. ${view.proofs[index]?.length ?? 0}-step inclusion path: ${result.inclusion ? 'valid' : 'FAIL'}.`;
    item.append(title, detail);
    list.append(item);
  }
  const selected = Number($('batch-document').value);
  $('batch-proof').textContent = JSON.stringify({
    document: BATCH_DOCUMENTS[selected],
    leaf: view.leaves[selected],
    proof: view.proofs[selected],
    calculatedAgainstRoot: view.root,
    signedImprint: view.token.imprint
  }, null, 2);
  status(
    'batch-status',
    passed === BATCH_DOCUMENTS.length ? `${label}: all ${passed} inclusions verify` : `${label}: ${passed} of ${BATCH_DOCUMENTS.length} inclusions verify`,
    `One ECDSA timestamp signs the SHA-256 Merkle root. Each document keeps its own reduced path; the root and path are checked separately from the timestamp signature and nonce.`,
    passed === BATCH_DOCUMENTS.length ? 'good' : 'bad'
  );
}

async function prepareArchiveCases() {
  archiveAuthority = await signingKey();
  successorAuthority = await signingKey();
  batchNonce = randomId();
  batch = await issueBatchStamp(archiveAuthority.privateKey, BATCH_DOCUMENTS, batchNonce, '2029-06-01T12:00:00.000Z', 'tsa-epoch-1');

  const timelyNonce = randomId();
  const lateNonce = randomId();
  const timelyRenewal = await renewTimestamp(successorAuthority.privateKey, batch.token, timelyNonce, '2029-12-01T12:00:00.000Z', 'tsa-epoch-2');
  const lateRenewal = await renewTimestamp(successorAuthority.privateKey, batch.token, lateNonce, '2030-02-01T12:00:00.000Z', 'tsa-epoch-2');

  const forgedDocuments = ['Exhibition proposal · forged after compromise', ...BATCH_DOCUMENTS.slice(1)];
  const forgedNonce = randomId();
  // Ground truth retained by the teaching view: this token is created after the
  // scenario's old-key compromise while claiming the same old generation time.
  const forgedBatch = await issueBatchStamp(archiveAuthority.privateKey, forgedDocuments, forgedNonce, '2029-06-01T12:00:00.000Z', 'tsa-epoch-1');
  const forgedRenewalNonce = randomId();
  const forgedRenewal = await renewTimestamp(successorAuthority.privateKey, forgedBatch.token, forgedRenewalNonce, '2030-02-01T12:00:00.000Z', 'tsa-epoch-2');

  renewalCases = {
    unrenewed: {label: 'Unrenewed original', batch, documents: BATCH_DOCUMENTS, originalNonce: batchNonce, renewal: null, renewalNonce: null, groundTruth: 'The original batch is genuine, but epoch 1 is no longer trusted at evaluation.'},
    timely: {label: 'Timely renewal', batch, documents: BATCH_DOCUMENTS, originalNonce: batchNonce, renewal: timelyRenewal, renewalNonce: timelyNonce, groundTruth: 'Epoch 2 covers the complete epoch-1 token before epoch 1 loses assurance.'},
    late: {label: 'Late renewal of genuine history', batch, documents: BATCH_DOCUMENTS, originalNonce: batchNonce, renewal: lateRenewal, renewalNonce: lateNonce, groundTruth: 'The old record is genuine, but the successor first sees it after the cutoff.'},
    forged: {label: 'Late renewal of backdated forgery', batch: forgedBatch, documents: forgedDocuments, originalNonce: forgedNonce, renewal: forgedRenewal, renewalNonce: forgedRenewalNonce, groundTruth: 'After compromise, the attacker uses the real old private key to sign a changed root while claiming an old time.'}
  };
}

async function assessCase(item) {
  return assessArchiveEvidence({
    oldPublicKey: archiveAuthority.publicKey,
    successorPublicKey: successorAuthority.publicKey,
    batch: item.batch,
    document: item.documents[0],
    index: 0,
    originalNonce: item.originalNonce,
    renewal: item.renewal,
    renewalNonce: item.renewalNonce,
    timeline: {...TIMELINE, trustedTimeModel: $('trusted-time').checked}
  });
}

const REASONS = {
  'accepted-current-epoch': 'Accepted while the original epoch is still current.',
  'accepted-renewed': 'Accepted: the successor bound the old token before its trust cutoff.',
  'unrenewed-expired': 'Refused: the original epoch expired without a timely successor stamp.',
  'late-renewal': 'Refused: valid cryptography after the cutoff cannot recover the missing trustworthy ordering.',
  'trusted-time-required': 'Refused: signatures alone do not establish either generation time.',
  'original-invalid': 'Refused: the original root, proof, nonce, signature, or epoch interval is invalid.',
  'renewal-invalid': 'Refused: the successor stamp does not bind the exact prior token.',
  'timeline-invalid': 'Refused: the signed times are out of order or outside the successor epoch.',
  'successor-expired': 'Refused: the successor epoch also needs renewal.'
};

async function drawRenewal() {
  const summary = $('renewal-summary');
  summary.replaceChildren();
  const results = {};
  for (const [id, item] of Object.entries(renewalCases)) {
    const result = await assessCase(item);
    results[id] = result;
    const card = document.createElement('article');
    card.className = 'panel';
    const heading = document.createElement('h3');
    heading.textContent = item.label;
    const verdict = document.createElement('p');
    verdict.className = 'scenario-verdict';
    verdict.textContent = result.valid ? 'ACCEPT' : 'REFUSE';
    const explanation = document.createElement('p');
    explanation.textContent = REASONS[result.reason];
    card.append(heading, verdict, explanation);
    summary.append(card);
  }

  const selectedId = $('renewal-case').value;
  const item = renewalCases[selectedId];
  const result = results[selectedId];
  const renewalChecks = result.renewal ? ` Successor signature: ${result.renewal.signature ? 'valid' : 'FAIL'}; exact-token imprint: ${result.renewal.imprint ? 'matches' : 'FAIL'}; nonce: ${result.renewal.nonce ? 'matches' : 'FAIL'}.` : ' No successor timestamp is present.';
  status(
    'renewal-status',
    `${item.label}: ${result.valid ? 'evidence accepted' : 'evidence refused'}`,
    `${REASONS[result.reason]} Original root/proof/signature: ${result.original.valid ? 'valid' : 'FAIL'}.${renewalChecks} Renewal before 2030-01-01: ${result.timely ? 'yes' : 'no'}.`,
    result.valid ? 'good' : 'bad'
  );
  $('renewal-ledger').textContent = JSON.stringify({
    groundTruthTeachingView: item.groundTruth,
    visibleVerifierDecision: result.reason,
    oldEpoch: `${TIMELINE.oldValidFrom} to (not including) ${TIMELINE.oldTrustUntil}`,
    successorEpoch: `${TIMELINE.successorValidFrom} to (not including) ${TIMELINE.successorTrustUntil}`,
    evaluationTime: TIMELINE.evaluationTime,
    originalClaimedTime: item.batch.token.time,
    renewalClaimedTime: item.renewal?.time ?? null,
    originalChecks: result.original,
    renewalChecks: result.renewal,
    timely: result.timely,
    chronology: result.chronology,
    trustedTimeModel: result.trustedTimeModel,
    accepted: result.valid
  }, null, 2);
}

$('issue').onclick = () => run(() => issue());
$('check').onclick = () => run(check);
$('change').onclick = () => run(async () => { $('document').value += ' [revised]'; await check(); });
$('alter').onclick = () => run(async () => { token.time = new Date(Date.parse(token.time) - 86400000).toISOString(); await check(); });
$('backdate').onclick = () => run(() => issue(new Date(Date.now() - 86400000).toISOString()));
$('replay').onclick = () => run(async () => { nonce = randomId(); await check(); });
$('document').addEventListener('input', () => { if (token) status('status', 'Document edited — verification required', 'The previous result does not cover this edited text. Verify the evidence again.'); });
$('edit-chain').onclick = () => run(async () => { documents[0] += ' [rewritten]'; await checkLog(); });
$('rebuild-chain').onclick = () => run(async () => { entries = await makeChain(documents); await checkLog(); });
$('check-chain').onclick = () => run(checkLog);
$('reset-chain').onclick = () => run(resetLog);
$('check-batch').onclick = () => run(() => drawBatch());
$('wrong-path').onclick = () => run(async () => {
  const control = structuredClone(batch);
  const selected = Number($('batch-document').value);
  control.proofs[selected][0].hash = flipHex(control.proofs[selected][0].hash);
  await drawBatch(control, 'Wrong-path control');
});
$('wrong-root').onclick = () => run(async () => {
  const control = structuredClone(batch);
  control.root = flipHex(control.root);
  await drawBatch(control, 'Wrong-root control');
});
$('batch-document').onchange = () => run(() => drawBatch());
$('renewal-case').onchange = () => run(drawRenewal);
$('trusted-time').onchange = () => run(drawRenewal);

await run(async () => {
  authority = await signingKey();
  await resetLog();
  await prepareArchiveCases();
  await drawBatch();
  await drawRenewal();
  status('status', 'Ready to timestamp', 'Issue a local timestamp, then test what each piece of evidence establishes.');
});
