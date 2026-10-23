import { makeModel, newChallenge } from './model.mjs';

const $ = (id) => document.getElementById(id);
const secret = crypto.getRandomValues(new Uint8Array(32)); // browser-local synthetic key
const model = await makeModel(secret);
let checkout;
let packet;
let originalAccepted = false;

function report(scenario, verdict) {
  $('result').className = verdict.accepted ? 'accepted' : 'rejected';
  $('result').textContent = `${scenario}: ${verdict.accepted ? 'Accepted' : 'Rejected'}. ${verdict.reason}`;
}

async function fresh() {
  checkout = { amountCents: 1299, terminalId: 'TERMINAL-1', challenge: newChallenge() };
  packet = await model.card(checkout);
  originalAccepted = false;
  $('challenge').textContent = checkout.challenge;
  $('counter').textContent = String(packet.counter);
  $('authenticator').textContent = `${packet.authenticator.slice(0, 20)}…`;
  $('result').className = '';
  $('result').textContent = 'A new synthetic card packet is ready. Predict which checks will pass.';
}

$('fresh').addEventListener('click', fresh);
$('honest').addEventListener('click', async () => {
  const verdict = await model.issuer(packet, checkout);
  if (verdict.accepted) originalAccepted = true;
  report('Original packet', verdict);
});
$('tamper').addEventListener('click', async () => {
  const changed = { ...packet, amountCents: 1399 };
  report('Changed amount', await model.issuer(changed, { ...checkout, amountCents: 1399 }));
});
$('replay').addEventListener('click', async () => {
  if (!originalAccepted) {
    $('result').className = '';
    $('result').textContent = 'Approve the original packet first, then replay it.';
    return;
  }
  report('Replayed packet', await model.issuer(packet, checkout));
});
$('challenge-test').addEventListener('click', async () => {
  report('Different checkout', await model.issuer(packet, { ...checkout, challenge: newChallenge() }));
});
await fresh();
