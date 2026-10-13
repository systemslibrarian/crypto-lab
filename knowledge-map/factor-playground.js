(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FactorLesson = factory();
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';

  const CASES = Object.freeze([
    Object.freeze({ id: 'close', n: 9797n, label: 'Modulus A' }),
    Object.freeze({ id: 'apart', n: 9913n, label: 'Modulus B' })
  ]);
  const instances = new WeakMap();
  let nextInstance = 0;

  function integer(value, name) {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number' && Number.isSafeInteger(value)) return BigInt(value);
    throw new TypeError((name || 'Value') + ' must be a BigInt or a safe integer.');
  }

  function integerSqrt(value) {
    const n = integer(value, 'Square-root input');
    if (n < 0n) throw new RangeError('A square-root input must be nonnegative.');
    if (n < 2n) return n;
    // Integer Newton iteration; never convert the modulus to floating point.
    let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2));
    for (;;) {
      const y = (x + n / x) / 2n;
      if (y >= x) return x;
      x = y;
    }
  }

  function oddModulus(value) {
    const n = integer(value, 'Modulus');
    if (n < 3n || n % 2n === 0n) throw new RangeError('This Fermat lesson requires an odd integer greater than one.');
    return n;
  }

  function startFor(value) {
    const n = oddModulus(value), floor = integerSqrt(n);
    return floor * floor === n ? floor : floor + 1n;
  }

  function candidate(value, aValue) {
    const n = oddModulus(value), a = integer(aValue, 'Candidate a');
    if (a < startFor(n)) throw new RangeError('Candidate a must start at or above ceil(sqrt(N)).');
    const gap = a * a - n, root = integerSqrt(gap), square = root * root === gap;
    const factors = square ? [a - root, a + root] : null;
    return { n, a, gap, square, b: square ? root : null, factors, trivial: Boolean(factors && factors[0] === 1n) };
  }

  function fermat(value, options) {
    const n = oddModulus(value), start = startFor(n);
    const maxCandidates = options && options.maxCandidates !== undefined ? options.maxCandidates : 10000;
    if (!Number.isSafeInteger(maxCandidates) || maxCandidates < 1 || maxCandidates > 100000) {
      throw new RangeError('maxCandidates must be an integer from 1 to 100000.');
    }
    let result;
    for (let count = 1; count <= maxCandidates; count++) {
      result = candidate(n, start + BigInt(count - 1));
      if (result.square) return { ...result, start, candidates: count, complete: true };
    }
    return { ...result, start, candidates: maxCandidates, complete: false };
  }

  function bitLength(value) {
    const n = integer(value, 'Bit-length input');
    if (n < 1n) throw new RangeError('Bit-length input must be positive.');
    return n.toString(2).length;
  }

  function initialState() {
    return {
      prediction: '',
      runs: Object.fromEntries(CASES.map(item => [item.id, { count: 0, result: null, history: [] }]))
    };
  }

  function mount(element) {
    if (!element || typeof element.addEventListener !== 'function' || !('innerHTML' in element)) {
      throw new TypeError('mount requires a DOM element.');
    }
    const existing = instances.get(element);
    if (existing) { existing.render(); return existing; }

    const prefix = 'factor-lesson-' + (++nextInstance), state = initialState();
    const predictions = [
      { id: 'close', label: '9797 needs fewer candidates' },
      { id: 'apart', label: '9913 needs fewer candidates' },
      { id: 'same', label: 'Same bit length, same work' }
    ];
    const decimal = n => n.toString();
    const resultStatus = () => {
      const complete = CASES.every(item => state.runs[item.id].result?.square);
      if (complete) return 'Comparison complete. 9797 needs 1 candidate; 9913 needs 128. Nearby prime factors help Fermat.';
      const tested = CASES.reduce((sum, item) => sum + state.runs[item.id].count, 0);
      return tested ? tested + ' candidate values tested across the two moduli. Keep stepping or run both to compare.' :
        state.prediction ? 'Prediction recorded. Step the search or run both moduli to compare.' : 'Choose a prediction to begin.';
    };

    function card(item) {
      const run = state.runs[item.id], result = run.result, done = Boolean(result?.square);
      const start = startFor(item.n), current = result ? result.a : start;
      const count = run.count;
      const gap = result ? result.gap : null;
      return `<article class="factor-card${done ? ' factor-card-complete' : ''}" aria-labelledby="${prefix}-${item.id}">
        <div class="factor-card-top"><span class="factor-kicker">${item.label}</span><span class="factor-bits">${bitLength(item.n)} bits</span></div>
        <h3 id="${prefix}-${item.id}">N = ${decimal(item.n)}</h3>
        <p class="factor-start">Start at a = ${decimal(start)}, the first whole number with a² ≥ N.</p>
        <div class="factor-equation"><span>a² − N</span><strong>${result ? `${decimal(current)}² − ${decimal(item.n)} = ${decimal(gap)}` : 'Waiting for your prediction'}</strong>
        <span class="factor-square-state">${!result ? 'Look for a square gap: b².' : done ? `${decimal(gap)} = ${decimal(result.b)}² · a square` : 'This gap is not a perfect square. Increase a by 1.'}</span></div>
        <div class="factor-count"><strong>${count}</strong><span>candidate ${count === 1 ? 'value' : 'values'} tested</span></div>
        ${done ? `<div class="factor-reveal"><span class="factor-kicker">FACTORS FOUND</span><strong>${decimal(result.factors[0])} × ${decimal(result.factors[1])}</strong><p>(${decimal(result.a)} − ${decimal(result.b)}) × (${decimal(result.a)} + ${decimal(result.b)}) = ${decimal(item.n)}</p></div>` : ''}
        ${run.history.length ? `<ol class="factor-history" aria-label="Recent candidates for ${item.label}">${run.history.map(h => `<li><span>a = ${decimal(h.a)}</span><span>gap ${decimal(h.gap)}</span><strong>${h.square ? 'square ✓' : 'not square'}</strong></li>`).join('')}</ol>` : ''}
        <button class="factor-step" type="button" data-factor-action="step" data-factor-case="${item.id}"${!state.prediction || done ? ' disabled' : ''}>${done ? 'Factors found' : count ? 'Try the next a' : 'Test the first a'}</button>
      </article>`;
    }

    function render() {
      const completed = CASES.every(item => state.runs[item.id].result?.square);
      const hasSteps = CASES.some(item => state.runs[item.id].count > 0);
      const active = element.ownerDocument?.activeElement;
      const focusAction = element.contains?.(active) ? active?.dataset?.factorAction : null;
      const focusCase = focusAction ? active.dataset.factorCase : null;
      const focusPrediction = focusAction ? active.dataset.factorPrediction : null;
      element.innerHTML = `<section class="factor-lesson" aria-labelledby="${prefix}-title">
        <header class="factor-heading"><div><span class="factor-kicker">TRY THE IDEA</span><h2 id="${prefix}-title">Same size. Different work.</h2></div><span class="factor-toy-badge">TOY NUMBERS</span></header>
        <p class="factor-intro">Both numbers below need 14 bits. Fermat’s method tries to write N as the difference of two squares. Predict, test, then see what changes the work.</p>
        <div class="factor-predict"><p>Which modulus will need fewer candidate values of a?</p><div class="factor-predictions" role="group" aria-label="Predict the Fermat comparison">${predictions.map(p => `<button type="button" data-factor-action="predict" data-factor-prediction="${p.id}" aria-pressed="${state.prediction === p.id}"${hasSteps ? ' disabled' : ''}>${p.label}</button>`).join('')}</div></div>
        <div class="factor-controls"><button class="factor-run" type="button" data-factor-action="run"${!state.prediction || completed ? ' disabled' : ''}>${completed ? 'Comparison complete' : 'Run both searches'}</button><button class="factor-reset" type="button" data-factor-action="reset">Start again</button><p>Exact candidate counts, not elapsed times.</p></div>
        <div class="factor-comparison">${CASES.map(card).join('')}</div>
        <p class="factor-status" role="status" aria-live="polite" aria-atomic="true">${resultStatus()}</p>
        ${completed ? `<div class="factor-takeaway"><span class="factor-kicker">WHAT CHANGED?</span><h3>${state.prediction === 'close' ? 'Your prediction matched the result.' : 'Equal bit length did not mean equal work.'}</h3><p>9797 = 97 × 101 uses nearby primes. Its square gap appears immediately. For 9913 = 23 × 431, Fermat checks 128 values before it reaches a square gap.</p><div class="factor-identity">a² − b² = (a − b)(a + b) = N</div><p>Nearby prime factors help this method. Other factoring methods respond to other structures. A slow result here would not establish security.</p><button class="factor-continue" type="button" data-lab="factor-forge">Continue with Factor Forge <span aria-hidden="true">→</span></button></div>` : `<details class="factor-method"><summary>Why does a square gap reveal factors?</summary><p>If a² − N = b², then N = a² − b² = (a − b)(a + b). Fermat increases a until the gap is a perfect square. The two factors are a − b and a + b.</p></details>`}
        <p class="factor-limit">Learning example only: these tiny moduli are easy to factor. Candidate counts illustrate one method and do not estimate the security or lifetime of real RSA keys.</p>
      </section>`;
      if (focusAction) {
        const buttons = Array.from(element.querySelectorAll('[data-factor-action]'));
        const replacement = buttons.find(b => b.dataset.factorAction === focusAction &&
          (!focusCase || b.dataset.factorCase === focusCase) && (!focusPrediction || b.dataset.factorPrediction === focusPrediction));
        const fallback = element.querySelector('[data-factor-action="run"]:not(:disabled)') || element.querySelector('[data-factor-action="reset"]');
        (replacement && !replacement.disabled ? replacement : fallback)?.focus({ preventScroll: true });
      }
    }

    function step(item) {
      const run = state.runs[item.id];
      if (run.result?.square) return;
      const a = startFor(item.n) + BigInt(run.count);
      const result = candidate(item.n, a);
      run.count++;
      run.result = result;
      run.history.push(result);
      run.history = run.history.slice(-4);
    }

    function click(event) {
      const button = event.target?.closest?.('[data-factor-action]');
      if (!button || !element.contains(button) || button.disabled) return;
      const action = button.dataset.factorAction;
      if (action === 'predict') {
        if (CASES.some(item => state.runs[item.id].count > 0)) return;
        if (!predictions.some(p => p.id === button.dataset.factorPrediction)) return;
        state.prediction = button.dataset.factorPrediction;
      } else if (action === 'reset') {
        const fresh = initialState();
        state.prediction = fresh.prediction;
        state.runs = fresh.runs;
      } else if (state.prediction && action === 'step') {
        const item = CASES.find(item => item.id === button.dataset.factorCase);
        if (item) step(item);
      } else if (state.prediction && action === 'run') {
        // Only the two fixed lesson numbers enter this synchronous UI loop.
        for (const item of CASES) {
          while (!state.runs[item.id].result?.square) step(item);
        }
      } else return;
      render();
    }

    const controller = {
      render,
      getState: () => ({ prediction: state.prediction, runs: Object.fromEntries(CASES.map(item => {
        const run = state.runs[item.id];
        return [item.id, { count: run.count, complete: Boolean(run.result?.square), factors: run.result?.factors ? [...run.result.factors] : null }];
      })) }),
      destroy: () => { element.removeEventListener('click', click); instances.delete(element); element.innerHTML = ''; }
    };
    instances.set(element, controller);
    element.addEventListener('click', click);
    render();
    return controller;
  }

  return { CASES, integerSqrt, startFor, candidate, fermat, bitLength, mount };
});
