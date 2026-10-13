'use strict';
const assert = require('node:assert/strict');
const lesson = require('../knowledge-map/factor-playground.js');
let assertions = 0;
function check(actual, expected, description) { assert.deepEqual(actual, expected, description); assertions++; }
function rejects(fn, type, description) { assert.throws(fn, type, description); assertions++; }

// Exact square roots, including integers too large for Number arithmetic.
for (const value of [0n, 1n, 2n, 3n, 4n, 15n, 16n, 17n, 9913n, 2n ** 256n - 1n, 2n ** 256n]) {
  const root = lesson.integerSqrt(value);
  check(root * root <= value && (root + 1n) * (root + 1n) > value, true, 'floor sqrt bounds for ' + value);
}
check(lesson.integerSqrt(2n ** 256n), 2n ** 128n, 'large square exactness');
check(lesson.integerSqrt(81), 9n, 'safe Number input supported');
rejects(() => lesson.integerSqrt(-1n), RangeError, 'negative square root rejected');
rejects(() => lesson.integerSqrt('81'), TypeError, 'string input is not silently coerced');
rejects(() => lesson.integerSqrt(3.5), TypeError, 'fraction rejected');
rejects(() => lesson.integerSqrt(Number.MAX_SAFE_INTEGER + 1), TypeError, 'unsafe integer rejected');

const close = lesson.fermat(9797n), apart = lesson.fermat(9913n);
check(close.candidates, 1, 'first example takes exactly one candidate');
check(apart.candidates, 128, 'second example counts every tested a including the successful one');
check(close.factors, [97n, 101n], 'close prime factors');
check(apart.factors, [23n, 431n], 'separated prime factors');
check([close.start, close.a, close.b, close.gap], [99n, 99n, 2n, 4n], 'first square-gap identity');
check([apart.start, apart.a, apart.b, apart.gap], [100n, 227n, 204n, 41616n], 'second square-gap identity');
check([lesson.bitLength(9797n), lesson.bitLength(9913n)], [14, 14], 'equal bit lengths');
for (const result of [close, apart]) {
  check(result.factors[0] * result.factors[1], result.n, 'recovered factors multiply to modulus');
  check(result.a * result.a - result.b * result.b, result.n, 'difference of squares equals modulus');
  check(result.complete && !result.trivial, true, 'nontrivial complete result');
}
for (let a = 100n; a < 227n; a++) {
  const tested = lesson.candidate(9913n, a);
  check(tested.square, false, 'no earlier perfect-square gap at a=' + a);
  check(tested.factors, null, 'unsuccessful candidate cannot expose factors');
}
const stopped = lesson.fermat(9913n, { maxCandidates: 127 });
check([stopped.complete, stopped.candidates, stopped.a, stopped.factors], [false, 127, 226n, null], 'bounded search does not fabricate completion');
check(lesson.fermat(9913n, { maxCandidates: 128 }).complete, true, 'boundary includes successful candidate');
check(lesson.fermat(49n).factors, [7n, 7n], 'perfect-square modulus');
check([lesson.fermat(13n).trivial, lesson.fermat(13n).factors], [true, [1n, 13n]], 'prime returns the trivial identity, not a nontrivial factorization');
for (const n of [0n, 1n, -3n, 2n, 100n]) rejects(() => lesson.fermat(n), RangeError, 'invalid or even modulus rejected');
for (const limit of [0, -1, 1.5, 100001, Infinity, '128']) rejects(() => lesson.fermat(9913n, { maxCandidates: limit }), RangeError, 'invalid search budget rejected');
rejects(() => lesson.candidate(9913n, 99n), RangeError, 'negative gap prevented');
rejects(() => lesson.candidate(9913n, 100.2), TypeError, 'fractional candidate rejected');
rejects(() => lesson.bitLength(0n), RangeError, 'zero bit-length input rejected');
rejects(() => lesson.mount(null), TypeError, 'mount requires an element');

// A minimal DOM-shaped harness checks event behavior and repeated-mount state.
// It does not claim to substitute for rendered browser QA.
const listeners = new Map();
const host = { innerHTML: '', ownerDocument: { activeElement: null },
  addEventListener(type, handler) { listeners.set(type, handler); },
  removeEventListener(type, handler) { if (listeners.get(type) === handler) listeners.delete(type); },
  contains(node) { return Boolean(node && node.host === this); },
  querySelectorAll() { return []; }, querySelector() { return null; }
};
function click(action, extra = {}) {
  const button = { host, disabled: false, dataset: { factorAction: action, ...extra } };
  button.closest = () => button;
  listeners.get('click')({ target: button });
}
const controller = lesson.mount(host);
check(host.innerHTML.includes('Waiting for your prediction'), true, 'starts before experiment');
click('run');
check(controller.getState().runs.close.count, 0, 'cannot run without prediction');
click('predict', { factorPrediction: 'same' });
click('step', { factorCase: 'apart' });
check(controller.getState().runs.apart.count, 1, 'step tests one candidate');
check(controller.getState().runs.apart.complete, false, 'one unsuccessful test stays incomplete');
check(lesson.mount(host), controller, 'same host reuses controller');
check(controller.getState().prediction, 'same', 'prediction survives remount');
check(controller.getState().runs.apart.count, 1, 'stepped run survives remount');
click('predict', { factorPrediction: 'close' });
check(controller.getState().prediction, 'same', 'prediction cannot be changed after observation');
click('run');
check(controller.getState().runs.close.count, 1, 'UI records exact first-case count');
check(controller.getState().runs.apart.count, 128, 'run resumes without double counting');
check(host.innerHTML.includes('data-lab="factor-forge"'), true, 'completed activity supplies next lab action');
click('step', { factorCase: 'apart' });
check(controller.getState().runs.apart.count, 128, 'completion does not add extra candidates');
const exposed = controller.getState(); exposed.runs.close.factors[0] = 0n;
check(controller.getState().runs.close.factors, [97n, 101n], 'state snapshot cannot alter recovered factors');
click('reset');
check(controller.getState().prediction, '', 'reset clears prediction');
check(controller.getState().runs.apart.count, 0, 'reset clears candidate counts');
controller.destroy();
check(listeners.size, 0, 'destroy removes event listener');
check(host.innerHTML, '', 'destroy clears content');
console.log('Factor lesson: ' + assertions + ' assertions passed. Exact counts: 1 and 128.');
