'use strict';

// Run with CRYPTO_MAP_JSDOM_PATH=/path/to/node_modules/jsdom node tests/knowledge-map-navigation.test.cjs.
// This exercises the shipped DOM runtime. It does not claim rendered browser QA.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM, VirtualConsole } = require(process.env.CRYPTO_MAP_JSDOM_PATH || 'jsdom');
const dir = path.join(__dirname, '../knowledge-map');
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const catalog = JSON.parse(fs.readFileSync(path.join(dir, 'catalog.json'), 'utf8'));
const progressKey = 'crypto-lab-learning-map-progress-v2';
const sessionKey = 'crypto-lab-learning-map-session-v3';
let assertions = 0;
const failures = [];

function check(value, message) { assert.ok(value, message); assertions++; }
function equal(actual, expected, message) { assert.equal(actual, expected, message); assertions++; }
const tick = () => new Promise(resolve => setTimeout(resolve, 0));

async function fixture({ hash = '', storage = {} } = {}) {
  const runtimeErrors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => runtimeErrors.push(error));
  const dom = new JSDOM(html, {
    url: 'https://learning-map.test/knowledge-map/' + hash,
    runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole
  });
  const w = dom.window;
  w.fetch = async url => {
    if (!String(url).endsWith('catalog.json')) throw new Error('Unexpected runtime fetch: ' + url);
    return { ok: true, json: async () => catalog };
  };
  w.matchMedia = query => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
  w.HTMLElement.prototype.scrollIntoView = function () {};
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, value);
  for (const script of w.document.querySelectorAll('script[src]')) {
    const source = script.getAttribute('src');
    if (!source.startsWith('./')) throw new Error('Unexpected external runtime script: ' + source);
    w.eval(fs.readFileSync(path.join(dir, source), 'utf8'));
  }
  for (let i = 0; i < 20 && !w.CryptoLearningMap; i++) await tick();
  check(Boolean(w.CryptoLearningMap), 'Production runtime booted');
  check(runtimeErrors.length === 0, 'No runtime errors: ' + runtimeErrors.map(e => e.message).join('; '));
  return {
    dom, w, document: w.document,
    state: () => w.CryptoLearningMap.getState(),
    model: w.CryptoLearningMap.model,
    click(selector) {
      const el = w.document.querySelector(selector);
      check(Boolean(el), 'Control exists: ' + selector);
      el.click();
      return el;
    },
    snapshot() {
      return Object.fromEntries(Array.from({ length: w.localStorage.length }, (_, i) => {
        const key = w.localStorage.key(i);
        return [key, w.localStorage.getItem(key)];
      }));
    },
    close() { dom.window.close(); }
  };
}

async function test(name, run) {
  try { await run(); console.log('PASS ' + name); }
  catch (error) { failures.push(name + ': ' + error.message); console.error('FAIL ' + name + ': ' + error.message); }
}

(async () => {
  await test('skip link preserves topic, goal, lab and journey state', async () => {
    const f = await fixture({ hash: '#topic=3&goal=deeper&lab=hash-zoo' });
    try {
      const before = f.state();
      f.click('a.skip');
      await tick(); await tick();
      const after = f.state();
      for (const key of ['topic', 'goal', 'lab', 'path']) equal(after[key], before[key], 'Skip anchor preserves ' + key);
      check(f.document.querySelector('#hero h1').textContent.includes('Hash'), 'Skip preserves visible topic');
    } finally { f.close(); }
  });

  await test('outside-route labs do not acquire a false authored successor', async () => {
    const f = await fixture({ hash: '#topic=7&goal=understand' });
    try {
      const route = f.model.route('7', 'understand');
      const outside = f.model.topicLabs('7').find(lab => !route.some(step => step.id === lab.id));
      check(Boolean(outside), 'Factorization has a lab outside the suggested route');
      f.click('#labs [data-lab="' + outside.id + '"]');
      equal(f.state().lab, outside.id, 'Off-route lab is selected');
      const next = f.document.querySelector('#lab-detail .next-step');
      check(!next || !/AFTER THIS LAB/i.test(next.textContent), 'Off-route lab has no claimed authored successor');
      const nextButton = next?.querySelector('[data-lab]');
      check(!nextButton || nextButton.dataset.lab !== route[0].id, 'Off-route selection does not wrap to route start');
      check(typeof f.model.nextStep === 'function', 'Model exports nextStep');
      const ids = route.map(step => step.id);
      equal(f.model.nextStep(ids, outside.id, new Set()), null, 'nextStep returns null outside route');
      equal(f.model.nextStep(ids, ids[0], new Set()), ids[1], 'nextStep finds following lab');
      equal(f.model.nextStep(ids, ids[0], new Set([ids[1]])), ids[2] || null, 'nextStep skips explored later labs');
      equal(f.model.nextStep(ids, ids.at(-1), new Set()), null, 'nextStep does not wrap at route end');
    } finally { f.close(); }
  });

  await test('journey graph and preparation follow the selected lab', async () => {
    const f = await fixture();
    try {
      f.click('#paths [data-path="developer"]');
      const lab = f.model.byTitle.get('PQ TLS Handshake');
      check(Boolean(lab), 'Cross-topic journey lab exists');
      f.click('#route [data-lab="' + lab.id + '"]');
      equal(f.state().path, 'developer', 'Selecting a journey lab preserves the journey');
      equal(f.state().lab, lab.id, 'Journey lab selection is exact');
      check(f.model.topicLabs(f.state().topic).some(item => item.id === lab.id), 'Current graph topic contains selected lab');
      check(f.document.querySelector('#concept-map').textContent.includes(f.model.topicName(f.state().topic)), 'Graph names the selected lab topic');
      const preparation = f.document.querySelector('#lab-detail details')?.textContent || '';
      check(!preparation.includes('begin with Hash Zoo'), 'Selected PQ TLS lab does not receive hashing preparation');
    } finally { f.close(); }
  });

  await test('duplicate controls preserve keyboard focus within their region', async () => {
    const f = await fixture({ hash: '#topic=7&goal=understand' });
    try {
      let button = f.document.querySelectorAll('#route [data-lab]')[1];
      check(Boolean(button), 'Route has a second lab');
      button.focus(); button.click();
      check(Boolean(f.document.activeElement.closest('#route')), 'Route selection retains route focus');
      button = f.document.querySelector('#concept-map [data-lab]');
      check(Boolean(button), 'Graph has an interactive lab node');
      button.focus(); button.click();
      check(Boolean(f.document.activeElement.closest('#concept-map')), 'Graph lab selection retains graph focus');
      f.click('#concept-map [data-graph-view="concepts"]');
      button = f.document.querySelector('#concept-map [data-topic]');
      check(Boolean(button), 'Graph has a related topic control');
      button.focus(); button.click();
      check(!f.document.activeElement.closest('.sidebar'), 'Related-topic navigation does not move focus into sidebar');
      check(Boolean(f.document.activeElement.closest('#workspace')), 'Related-topic navigation retains focus in learning workspace');
    } finally { f.close(); }
  });

  await test('every catalog topic navigates and every displayed lab resolves', async () => {
    const f = await fixture();
    try {
      for (const topic of catalog.concepts) {
        f.click('#topics [data-topic="' + topic.id + '"]');
        equal(f.state().topic, topic.id, 'Topic selection ' + topic.id);
        equal(f.state().path, '', 'Topic leaves journey ' + topic.id);
        check(Boolean(f.model.labs.get(f.state().lab)), 'Selected lab resolves ' + topic.id);
        check(f.document.querySelector('#hero h1').textContent.includes(f.model.topicName(topic.id)), 'Topic heading ' + topic.id);
        const route = f.document.querySelectorAll('#route [data-lab]');
        check(route.length > 0, 'Topic has an interactive route ' + topic.id);
        for (const button of route) check(f.model.labs.has(button.dataset.lab), 'Route lab resolves ' + button.dataset.lab);
        check(f.document.querySelector('#lab-detail a.open-lab')?.href.startsWith('https://'), 'Selected lab opens its real site ' + topic.id);
      }
    } finally { f.close(); }
  });

  await test('progress persists and learner selection resumes after reload', async () => {
    const f = await fixture();
    let saved, before;
    try {
      f.click('#topics [data-topic="3"]');
      f.click('[data-goal="deeper"]');
      const button = f.document.querySelectorAll('#route [data-lab]')[1];
      check(Boolean(button), 'Resume scenario has another lab');
      button.click();
      f.click('#lab-detail [data-progress]');
      before = f.state(); saved = f.snapshot();
      check(Boolean(saved[progressKey]), 'Progress written to browser storage');
      check(Boolean(saved[sessionKey]), 'Selection written to resume storage');
      check(JSON.parse(saved[progressKey]).includes(before.lab), 'Selected lab is persisted as explored');
    } finally { f.close(); }
    const resumed = await fixture({ storage: saved });
    try {
      for (const key of ['topic', 'goal', 'lab', 'path']) equal(resumed.state()[key], before[key], 'Reload resumes ' + key);
      check(resumed.state().explored.includes(before.lab), 'Reload restores explored lab');
    } finally { resumed.close(); }
    const linked = await fixture({ hash: '#topic=7&goal=attack', storage: saved });
    try {
      equal(linked.state().topic, '7', 'Explicit topic link overrides saved session');
      equal(linked.state().goal, 'attack', 'Explicit goal link overrides saved session');
      check(linked.state().explored.includes(before.lab), 'Explicit link retains saved progress');
    } finally { linked.close(); }
  });

  await test('dismissed search reopens on focus and ArrowDown', async () => {
    const f = await fixture();
    try {
      const input = f.document.querySelector('#q');
      input.focus(); input.value = 'RSA';
      input.dispatchEvent(new f.w.Event('input', { bubbles: true }));
      check(!f.document.querySelector('#search-results').hidden, 'Typing opens search results');
      f.document.querySelector('#hero h1').focus();
      f.click('#hero');
      check(f.document.querySelector('#search-results').hidden, 'Outside click dismisses search results');
      input.focus();
      check(!f.document.querySelector('#search-results').hidden, 'Refocusing retained query reopens results');
      f.click('#hero');
      check(f.document.querySelector('#search-results').hidden, 'Results can be dismissed again');
      input.dispatchEvent(new f.w.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      check(!f.document.querySelector('#search-results').hidden, 'ArrowDown reopens retained results');
      check(Boolean(f.document.activeElement.closest('#search-results')), 'ArrowDown enters first search result');
    } finally { f.close(); }
  });

  await test('failed progress reset reports a visit-only result', async () => {
    const f = await fixture();
    try {
      f.click('#lab-detail [data-progress]');
      const saved = f.w.localStorage.getItem(progressKey);
      check(JSON.parse(saved).length > 0, 'Reset failure scenario starts with persisted progress');
      Object.defineProperty(f.w.Storage.prototype, 'setItem', { value() { throw new Error('Storage unavailable'); } });
      f.click('#reset-progress');
      equal(f.state().explored.length, 0, 'Reset clears progress in this visit');
      equal(f.w.localStorage.getItem(progressKey), saved, 'Failed storage write leaves persisted progress intact');
      const message = f.document.querySelector('#toast').textContent;
      check(/visit|session/i.test(message) && /unavailable|saving|storage/i.test(message), 'Reset explains failure to persist: ' + message);
    } finally { f.close(); }
  });

  await test('graph view controls remain valid while navigating', async () => {
    const f = await fixture();
    try {
      const controls = f.document.querySelectorAll('[data-graph-view]');
      check(controls.length > 1, 'Graph offers multiple relationship views');
      for (const view of [...controls].map(button => button.dataset.graphView)) {
        f.click('[data-graph-view="' + view + '"]');
        check(Boolean(f.document.querySelector('#concept-map').textContent.trim()), 'Graph has content for view ' + view);
        for (const button of f.document.querySelectorAll('#concept-map [data-lab]')) check(f.model.labs.has(button.dataset.lab), 'Graph lab resolves');
        for (const button of f.document.querySelectorAll('#concept-map [data-topic]')) check(f.model.topics.has(button.dataset.topic), 'Graph topic resolves');
      }
      // Some topic/views fit on one page, so pagination is exercised when exposed.
      for (const page of [...f.document.querySelectorAll('[data-graph-page]')].map(button => button.dataset.graphPage)) {
        const button = f.document.querySelector('[data-graph-page="' + page + '"]');
        if (button && !button.disabled) { button.click(); check(Boolean(f.document.querySelector('#concept-map').textContent.trim()), 'Graph pagination keeps content'); }
      }
    } finally { f.close(); }
  });

  await test('journey lab graph identifies the journey rather than a topic membership', async () => {
    const f = await fixture();
    try {
      f.click('#paths [data-path="developer"]');
      f.click('#concept-map [data-graph-view="labs"]');
      const journey = catalog.paths.find(item => item.id === 'developer');
      check(Boolean(journey), 'Developer journey is catalog-backed');
      equal(f.document.querySelector('#concept-map .node-center strong').textContent, journey.label, 'Journey labels graph center');
      check(/AUTHORED JOURNEY/i.test(f.document.querySelector('#concept-map .node-center').textContent), 'Graph identifies journey relationship');
      for (const node of f.document.querySelectorAll('#concept-map [data-lab]')) {
        const lab = f.model.labs.get(node.dataset.lab);
        check(journey.steps.includes(lab.title), 'Journey graph lab is a journey member');
        check(/on this journey/i.test(node.textContent), 'Journey lab is described as a journey connection');
        check(!/filed under this concept/i.test(node.textContent), 'Journey membership does not claim topic membership');
      }
    } finally { f.close(); }
  });

  await test('selecting a later journey lab reveals it while manual graph paging remains usable', async () => {
    const f = await fixture();
    try {
      const journey = catalog.paths.find(item => item.steps.length > 6);
      check(Boolean(journey), 'Catalog has a journey with more than one graph page');
      f.click('#paths [data-path="' + journey.id + '"]');
      f.click('#concept-map [data-graph-view="labs"]');
      const route = f.model.route(f.state().topic, f.state().goal, journey.id), last = route.at(-1);
      f.click('#route [data-lab="' + last.id + '"]');
      equal(f.state().lab, last.id, 'Last journey lab is selected');
      const selectedPage = Math.floor((route.length - 1) / 6);
      equal(f.state().graphPage, selectedPage, 'Graph reveals selected lab page');
      const node = f.document.querySelector('#concept-map [data-lab="' + last.id + '"]');
      check(Boolean(node), 'Selected late-route lab is visible in graph DOM');
      equal(node.getAttribute('aria-current'), 'true', 'Visible graph lab is marked current');
      check(/SELECTED LAB/.test(node.textContent), 'Visible graph node labels selected lab');
      f.click('#concept-map [data-graph-page="prev"]');
      equal(f.state().graphPage, selectedPage - 1, 'Manual previous page remains selected');
      equal(f.state().lab, last.id, 'Paging does not change selected lab');
      check(!f.document.querySelector('#concept-map [data-lab="' + last.id + '"]'), 'Manual previous page is not snapped back to selected lab');
      f.click('#concept-map [data-graph-page="next"]');
      equal(f.state().graphPage, selectedPage, 'Manual next returns to selected lab page');
      check(Boolean(f.document.querySelector('#concept-map [data-lab="' + last.id + '"]')), 'Selected lab returns on its graph page');
    } finally { f.close(); }
  });

  await test('finish and continue skips explored labs, preserves notes and focuses the next mission', async () => {
    const completed = catalog.exhibits.find(lab => lab.title === 'Locks and Keys');
    const skipped = catalog.exhibits.find(lab => lab.title === 'Educational RSA');
    const expected = catalog.exhibits.find(lab => lab.title === 'Factor Forge');
    check(Boolean(completed && skipped && expected), 'Finish scenario labs resolve');
    const f = await fixture({
      hash: '#topic=7&goal=understand&lab=' + completed.id,
      storage: { [progressKey]: JSON.stringify([skipped.id]) }
    });
    let saved;
    const observation = 'A public key closes the lock; <angle> & inverse stay literal.';
    try {
      const note = f.document.querySelector('#lab-detail textarea[data-note]');
      check(Boolean(note), 'Lab has an observation field');
      equal(note.dataset.note, completed.id, 'Observation is associated with selected lab');
      note.value = observation;
      note.dispatchEvent(new f.w.Event('input', { bubbles: true }));
      equal(f.state().notes[completed.id], observation, 'Observation stored in app state');
      f.click('#lab-detail [data-finish="' + completed.id + '"]');
      equal(f.state().lab, expected.id, 'Finish selects next unexplored lab');
      check(f.state().explored.includes(completed.id), 'Finish marks completed lab');
      check(f.state().explored.includes(skipped.id), 'Existing explored lab remains explored');
      check(!f.state().explored.includes(expected.id), 'Finish does not mark newly selected next lab');
      equal(f.state().explored.length, 2, 'Finish adds only the completed lab');
      equal(f.document.activeElement, f.document.querySelector('#lab-detail h2'), 'Finish focuses next lab mission heading');
      equal(f.document.querySelector('#lab-detail textarea[data-note]').value, '', 'Different lab starts with its own observation');
      f.click('#route [data-lab="' + completed.id + '"]');
      equal(f.document.querySelector('#lab-detail textarea[data-note]').value, observation, 'Observation survives selection changes');
      saved = f.snapshot();
    } finally { f.close(); }
    const resumed = await fixture({ storage: saved });
    try {
      equal(resumed.state().lab, completed.id, 'Reload returns to selected lab');
      equal(resumed.state().notes[completed.id], observation, 'Observation survives reload');
      equal(resumed.document.querySelector('#lab-detail textarea[data-note]').value, observation, 'Reloaded observation preserves literal text');
      check(!resumed.state().explored.includes(expected.id), 'Reload does not auto-mark next lab');
    } finally { resumed.close(); }
  });

  await test('FactorLesson survives app repaint and never auto-marks an external lab', async () => {
    const f = await fixture({ hash: '#topic=7&goal=understand' });
    try {
      check(Boolean(f.w.FactorLesson), 'Production FactorLesson asset is loaded');
      const disclosure = f.document.querySelector('#topic-primer details');
      check(Boolean(disclosure), 'FactorLesson has an expandable host');
      disclosure.open = true;
      const host = f.document.querySelector('#factor-lesson');
      const lesson = f.w.FactorLesson.mount(host);
      f.click('#factor-lesson [data-factor-action="predict"][data-factor-prediction="close"]');
      f.click('#factor-lesson [data-factor-action="step"][data-factor-case="apart"]');
      equal(lesson.getState().prediction, 'close', 'Prediction is recorded');
      equal(lesson.getState().runs.apart.count, 1, 'Step is recorded');
      equal(f.state().explored.length, 0, 'Predicting and stepping do not mark an external lab');
      f.click('[data-goal="attack"]');
      equal(f.document.querySelector('#factor-lesson'), host, 'App repaint retains FactorLesson host');
      equal(f.w.FactorLesson.mount(host), lesson, 'App repaint retains lesson controller');
      equal(lesson.getState().prediction, 'close', 'Prediction survives app repaint');
      equal(lesson.getState().runs.apart.count, 1, 'Candidate count survives app repaint');
      f.click('#topics [data-topic="3"]');
      f.click('#topics [data-topic="7"]');
      equal(lesson.getState().runs.apart.count, 1, 'Lesson state survives navigating away and returning');
      f.click('#factor-lesson [data-factor-action="run"]');
      equal(lesson.getState().runs.close.count, 1, 'Completed close-factor case has exact candidate count');
      equal(lesson.getState().runs.apart.count, 128, 'Completed separated-factor case has exact candidate count');
      check(lesson.getState().runs.close.complete && lesson.getState().runs.apart.complete, 'Both in-page examples complete');
      equal(f.state().explored.length, 0, 'Completing in-page examples does not mark an external lab');
      f.click('#factor-lesson [data-lab="factor-forge"]');
      equal(f.state().lab, 'factor-forge', 'In-page lesson continues to Factor Forge guide');
      equal(f.state().explored.length, 0, 'Continuing to external-lab guide does not mark it explored');
    } finally { f.close(); }
  });

  if (failures.length) {
    console.error('\nNavigation regression checks: FAIL (' + failures.length + ' groups; ' + assertions + ' assertions passed)');
    for (const failure of failures) console.error(' - ' + failure);
    process.exitCode = 1;
  } else {
    console.log('\nNavigation regression checks: PASS (' + assertions + ' assertions; production DOM runtime, no rendered visual QA)');
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
