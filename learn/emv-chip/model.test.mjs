import { test } from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { makeModel, newChallenge } from './model.mjs';

globalThis.crypto ??= webcrypto;
const key = new Uint8Array(32).fill(7); // Synthetic local fixture, never payment material.
const checkout = { amountCents: 1299, terminalId: 'TERMINAL-1', challenge: '1234567890abcdef12345678' };

test('a fresh card packet succeeds once, and a second counter permits a new checkout', async () => {
  const model = await makeModel(key);
  const packet = await model.card(checkout);
  assert.equal((await model.issuer(packet, checkout)).accepted, true);
  assert.match((await model.issuer(packet, checkout)).reason, /counter/);
  const second = await model.card({ ...checkout, challenge: 'abcdef1234567890abcdef12' });
  assert.equal((await model.issuer(second, { ...checkout, challenge: second.challenge })).accepted, true);
});

test('amount, terminal, challenge, and card identity cannot be changed', async () => {
  const model = await makeModel(key);
  const packet = await model.card(checkout);
  assert.equal((await model.issuer({ ...packet, amountCents: 1399 }, { ...checkout, amountCents: 1399 })).accepted, false);
  assert.equal((await model.issuer({ ...packet, terminalId: 'TERMINAL-2' }, { ...checkout, terminalId: 'TERMINAL-2' })).accepted, false);
  assert.equal((await model.issuer(packet, { ...checkout, challenge: 'abcdef1234567890abcdef12' })).accepted, false);
  assert.equal((await model.issuer({ ...packet, cardId: 'OTHER-CARD' }, checkout)).accepted, false);
  assert.equal((await model.issuer(packet, checkout)).accepted, true);
});

test('a generated challenge has 12 random bytes in hex', () => {
  assert.match(newChallenge((array) => array.fill(0xab)), /^(ab){12}$/);
});
