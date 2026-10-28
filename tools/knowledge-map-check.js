#!/usr/bin/env node
/*
 * knowledge-map-check.js — Exercise the generated learner map in Chromium and verify its navigation, content, accessibility, persistence, responsive layout and failure handling.
 *
 * Run: node tools/knowledge-map-check.js
 * Prevents: learner-map navigation showing the wrong lab, broken topic search or links, inaccessible keyboard controls and horizontal overflow
 * Reads: knowledge-map/index.html, map.js, map-model.js, guides.js, map.css, factor-playground.js,
 *        factor-playground.css, catalog.json and linked teach/ module pages via an isolated local HTTP server in Chromium
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const {chromium} = require('playwright');
const ROOT = path.join(__dirname, '..'), MAP = path.join(ROOT, 'knowledge-map');
const data = JSON.parse(fs.readFileSync(path.join(MAP, 'catalog.json'), 'utf8'));
const guidance = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(MAP, 'guides.js'), 'utf8'), guidance);
const guides = guidance.window.LearningGuides;
const topicNames = require(path.join(MAP, 'map-model.js')).names;
const FactorLesson = require(path.join(MAP, 'factor-playground.js'));
const byTitle = new Map(data.exhibits.map(lab => [lab.title, lab]));
const byId = new Map(data.exhibits.map(lab => [lab.id, lab]));
const levels = {beginner: 0, intermediate: 1, advanced: 2};
const goals = ['understand', 'attack', 'deeper'];
let checks = 0;
function check(value, message) { assert(value, message); checks++; }
function equal(actual, expected, message) { assert.deepEqual(actual, expected, message); checks++; }
const text = value => String(value).replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&nbsp;/g, ' ');
const topicName = id => text(guides[id]?.name || topicNames[id] || data.concepts.find(t => t.id === id).title);
const members = id => data.concepts.find(t => t.id === id).exhibits.map(title => byTitle.get(title)).sort((a, b) => levels[a.level] - levels[b.level]);
function expectedRoute(id, goal) {
  if (guides[id]?.routes[goal]) return Array.from(guides[id].routes[goal], title => byTitle.get(title));
  const items = members(id);
  const priority = goal === 'deeper' ? lab => lab.level === 'advanced' : lab => lab.section === 'cryptanalysis' || lab.categories.includes('ATTACKS');
  return goal === 'understand' ? items : [...items.filter(priority), ...items.filter(lab => !priority(lab))];
}
function expectedConnections(id) {
  const topic = data.concepts.find(t => t.id === id);
  const suggested = Array.from(guides[id]?.connections || [], c => ({...c, kind: 'suggested'}));
  const excluded = new Set([id, ...suggested.map(c => c.topic)]);
  const shared = data.concepts.filter(t => !excluded.has(t.id)).map(t => ({topic: t.id, kind: 'shared', shared: t.exhibits.filter(title => topic.exhibits.includes(title))})).filter(c => c.shared.length).sort((a, b) => b.shared.length - a.shared.length);
  return [...suggested, ...shared];
}
async function main() {
  const server = http.createServer((req, res) => {
    const file = path.resolve(ROOT, '.' + new URL(req.url, 'http://local').pathname);
    if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; }
    const resolved = fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, 'index.html') : file;
    try {
      res.setHeader('Content-Type', ({'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json'})[path.extname(resolved)] || 'text/plain');
      res.end(fs.readFileSync(resolved));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port, entry = base + '/knowledge-map/';
  let browser;
  try {
    browser = await chromium.launch({headless: true});
    const context = await browser.newContext({viewport: {width: 1280, height: 900}, reducedMotion: 'reduce'});
    const errors = [];
    context.on('page', tab => tab.on('pageerror', error => errors.push(error.message)));
    // Fonts are optional; external labs are never loaded or executed by this check.
    await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    const page = await context.newPage();
    const state = () => page.evaluate(() => window.CryptoLearningMap.getState());
    const ids = selector => page.locator(selector).evaluateAll(nodes => nodes.map(node => node.dataset.lab));
    async function loaded() { await page.waitForFunction(() => Boolean(window.CryptoLearningMap)); }
    async function open(hash = '') {
      await page.goto(entry + hash);
      // Changing only the hash can preserve the DOM and lesson controller. Fixtures
      // need a fresh document; the explicit history checks below remain in-page.
      await page.reload();
      await loaded();
    }
    async function expandExperiment() {
      const disclosure = page.locator('#topic-primer .primer-disclosure');
      if (await disclosure.getAttribute('open') === null) await disclosure.locator(':scope > summary').click();
      await page.locator('#factor-lesson .factor-lesson').waitFor({state: 'visible'});
    }
    async function chooseTopic(id) {
      const button = page.locator(`#topics [data-topic="${id}"]`);
      await button.evaluate(node => { for (let p = node.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true; });
      await button.click();
      equal((await state()).topic, id, `topic ${id}: navigation selects requested topic`);
    }
    async function selectedMatches(route, topic, label) {
      const current = await state();
      check([...route, ...members(topic)].some(lab => lab.id === current.lab), label + ': selected lab belongs to route or topic');
      equal(await page.locator('#lab-detail h2').textContent(), text(byId.get(current.lab).title), label + ': details match selected lab');
      equal(await page.locator('#lab-detail .open-lab').getAttribute('href'), text(byId.get(current.lab).href), label + ': external destination matches catalog');
      equal(await page.locator('#route [aria-current="true"]').count(), route.some(lab => lab.id === current.lab) ? 1 : 0, label + ': route selection is truthful');
    }
    await open();
    equal(await page.evaluate(() => window.CryptoLearningMap.model.catalog.exhibits.length), data.exhibits.length, 'current catalog count loaded');
    check((await page.locator('#source-stamp').textContent()).includes(`${data.exhibits.length} labs`), 'visible count uses current catalog');
    equal(await page.locator('#topics [data-topic]').count(), data.concepts.length, 'every catalog topic has a navigation control');
    equal(await page.locator('#paths [data-path]').count(), data.paths.length, 'every catalog path has a navigation control');
    await page.locator('.skip').focus(); await page.keyboard.press('Enter');
    equal(await page.evaluate(() => document.activeElement.id), 'workspace', 'keyboard skip link focuses workspace');
    await page.keyboard.press('/');
    equal(await page.evaluate(() => document.activeElement.id), 'q', 'slash focuses topic search');
    await page.locator('#q').fill('factorization');
    equal(await page.locator('#search-results [data-topic="7"]').count(), 1, 'factorization alias finds the factoring topic');
    await page.keyboard.press('ArrowDown');
    equal(await page.evaluate(() => document.activeElement.dataset.topic), '7', 'ArrowDown enters search results');
    await page.keyboard.press('Enter'); equal((await state()).topic, '7', 'keyboard search opens topic');
    await page.locator('#q').fill('zzzz no matching lab');
    check((await page.locator('#search-status').textContent()).includes('No matching'), 'no-results feedback is announced');
    await page.keyboard.press('Escape');
    check(await page.locator('#q').inputValue() === '' && await page.locator('#search-results').isHidden(), 'Escape clears search');

    // Assert source-derived routes and membership, without fixing catalog size or incidental prose.
    for (const topic of data.concepts) {
      await chooseTopic(topic.id);
      equal(await page.locator('#hero h1').textContent(), topicName(topic.id), `topic ${topic.id}: heading`);
      equal(await ids('#labs [data-lab]'), members(topic.id).map(lab => lab.id), `topic ${topic.id}: complete membership in level order`);
      for (const goal of goals) {
        await page.locator(`#goal-switch [data-goal="${goal}"]`).click();
        const route = expectedRoute(topic.id, goal);
        equal((await state()).goal, goal, `topic ${topic.id}/${goal}: selected goal`);
        equal(await page.locator(`#goal-switch [data-goal="${goal}"]`).getAttribute('aria-pressed'), 'true', `topic ${topic.id}/${goal}: accessible selection`);
        equal(await ids('#route [data-lab]'), route.map(lab => lab.id), `topic ${topic.id}/${goal}: correct route order`);
        await selectedMatches(route, topic.id, `topic ${topic.id}/${goal}`);
      }
      const quiz = guides[topic.id]?.quiz;
      if (quiz) {
        await page.locator(`#checkpoint [data-answer="${quiz.correct}"]`).click();
        equal(await page.locator('#checkpoint .correct').getAttribute('data-answer'), String(quiz.correct), `topic ${topic.id}: correct quiz answer`);
        check((await page.locator('#checkpoint .quiz-feedback').textContent()).includes(text(quiz.explanation)), `topic ${topic.id}: authored answer explanation`);
      } else check(await page.locator('#checkpoint').isHidden(), `topic ${topic.id}: no invented quiz`);
    }
    for (const journey of data.paths) {
      await page.locator(`#paths [data-path="${journey.id}"]`).click();
      const route = journey.steps.map(title => byTitle.get(title));
      equal(await ids('#route [data-lab]'), route.map(lab => lab.id), `path ${journey.id}: catalog order`);
      check(await page.locator('#goal-switch').isHidden(), `path ${journey.id}: goals do not overwrite path order`);
      for (const lab of route) {
        await page.locator(`#route [data-lab="${lab.id}"]`).click();
        const current = await state();
        equal(current.path, journey.id, `path ${journey.id}/${lab.id}: path retained`);
        equal(await page.locator('#hero h1').textContent(), text(journey.label), `path ${journey.id}/${lab.id}: source journey heading`);
        equal(await page.locator('#concept-map .node-center strong').textContent(), text(journey.label), `path ${journey.id}/${lab.id}: graph identifies journey, not false topic membership`);
        equal(await ids('#labs [data-lab]'), route.map(item => item.id), `path ${journey.id}/${lab.id}: cards stay within journey`);
        check(members(current.topic).some(item => item.id === lab.id), `path ${journey.id}/${lab.id}: selected topic is a real membership`);
        await selectedMatches(route, current.topic, `path ${journey.id}/${lab.id}`);
      }
    }
    // Visit every page, so a truncated graph cannot pass by showing only its first six nodes.
    for (const topic of data.concepts) {
      await chooseTopic(topic.id);
      await page.locator('#goal-switch [data-goal="understand"]').click();
      await page.locator(`#labs [data-lab="${members(topic.id)[0].id}"]`).click();
      for (const view of ['labs', 'concepts']) {
        await page.locator(`#concept-map [data-graph-view="${view}"]`).click();
        const expected = view === 'labs' ? members(topic.id).map(lab => lab.id) : expectedConnections(topic.id).map(c => c.topic);
        const pages = Math.max(1, Math.ceil(expected.length / 6));
        for (let index = 0; index < pages; index++) {
          const actual = await page.locator('#concept-map .graph-node').evaluateAll(nodes => nodes.map(node => node.dataset.lab || node.dataset.topic));
          equal(actual, expected.slice(index * 6, (index + 1) * 6), `topic ${topic.id}/${view}: graph page ${index + 1}`);
          if (view === 'concepts') for (const c of expectedConnections(topic.id).slice(index * 6, (index + 1) * 6)) {
            equal(await page.locator(`#concept-map .graph-node[data-topic="${c.topic}"] .eyebrow`).textContent(), c.kind === 'shared' ? 'SHARES A LAB' : 'RELATED IDEA', `topic ${topic.id}/${c.topic}: shared source and guidance labels differ`);
          }
          if (pages > 1) {
            equal(await page.locator('[data-graph-page="prev"]').isDisabled(), index === 0, `topic ${topic.id}/${view}: previous boundary`);
            equal(await page.locator('[data-graph-page="next"]').isDisabled(), index === pages - 1, `topic ${topic.id}/${view}: next boundary`);
            if (index + 1 < pages) await page.locator('[data-graph-page="next"]').click();
          }
        }
        if (pages > 1) { await page.locator('[data-graph-page="prev"]').click(); equal((await state()).graphPage, pages - 2, `topic ${topic.id}/${view}: reverse paging`); }
      }
    }
    const wideTopic = data.concepts.find(topic => topic.exhibits.length > 6);
    await chooseTopic(wideTopic.id);
    await page.locator('[data-graph-view="labs"]').click();
    const lastMember = members(wideTopic.id).at(-1);
    await page.locator(`#labs [data-lab="${lastMember.id}"]`).click();
    equal((await state()).graphPage, Math.floor((members(wideTopic.id).length - 1) / 6), 'selecting a later lab reveals its graph page');
    equal(await page.locator('#concept-map .graph-node[aria-current="true"]').getAttribute('data-lab'), lastMember.id, 'revealed graph marks the selected lab');
    await chooseTopic('7'); await page.locator('[data-graph-view="concepts"]').click();
    const related = expectedConnections('7')[0].topic;
    await page.locator(`#concept-map .graph-node[data-topic="${related}"]`).focus(); await page.keyboard.press('Enter');
    equal((await state()).topic, related, 'keyboard graph connection opens destination');
    // Requirements remain source-faithful and explicitly scoped to their whole course module.
    for (const module of data.modules) {
      const lab = byTitle.get(module.exhibits[0].title), topic = data.concepts.find(t => t.exhibits.includes(lab.title));
      await open(`#topic=${topic.id}&lab=${lab.id}`);
      const prep = page.locator('.module-prep').filter({has: page.locator(`a[href="${module.href}"]`)});
      equal(await prep.locator('summary').textContent(), text(module.label) + ': whole-module requirements', `module ${module.id}: module scope`);
      equal(await prep.locator('li').allTextContents(), module.prerequisites.map(text), `module ${module.id}: source prerequisites`);
      check((await page.request.get(new URL(module.href, entry).href)).ok(), `module ${module.id}: local course link exists`);
    }
    // Partial/unknown/N/A remain recorded evidence states, not clean-scan claims.
    for (const lab of data.exhibits.filter(lab => lab.unscanned?.length || lab.implements.some(term => ['N/A', 'UNKNOWN', 'NOT-SCANNED'].includes(term)))) {
      const topic = data.concepts.find(t => t.exhibits.includes(lab.title));
      await open(`#topic=${topic.id}&lab=${lab.id}`);
      const evidence = await page.locator('.index-evidence').textContent();
      for (const term of lab.implements) check(evidence.includes(text(term)), `${lab.id}: implementation index preserved`);
      for (const unread of lab.unscanned || []) check(evidence.includes(text(unread)), `${lab.id}: partial source coverage preserved`);
    }
    await open('#topic=7&goal=understand'); await page.locator('#reset-progress').click();
    const route = expectedRoute('7', 'understand'), [first, second, third] = route;
    await page.locator(`#route [data-lab="${first.id}"]`).click();
    const observation = 'A remembered observation <script> is plain text.';
    await page.locator('#reflection').fill(observation);
    await page.locator(`#route [data-lab="${second.id}"]`).click();
    equal(await page.locator('#reflection').inputValue(), '', 'notes belong to their own lab');
    await page.locator('#lab-detail [data-progress]').click(); await page.locator(`#route [data-lab="${first.id}"]`).click();
    equal(await page.locator('#reflection').inputValue(), observation, 'switching restores observation safely');
    await page.locator('#lab-detail [data-finish]').click();
    equal((await state()).lab, third.id, 'Finish skips an explored step and selects the next unexplored step');
    equal((await state()).explored.sort(), [first.id, second.id].sort(), 'Finish marks only completed lab');
    equal(await page.locator('#route-progress').textContent(), `2 / ${route.length} explored`, 'route progress counts members');
    equal(await page.evaluate(() => document.activeElement.tagName), 'H2', 'Finish focuses destination heading');
    const deep = page.url();
    equal(await page.locator('[data-share]').getAttribute('href'), new URL(deep).hash, 'share link includes selection');
    await page.reload(); await loaded();
    equal((await state()).lab, third.id, 'reload retains deep-linked lab');
    equal((await state()).explored.sort(), [first.id, second.id].sort(), 'progress survives reload');
    await chooseTopic('3'); const newer = page.url();
    await page.goBack(); await page.waitForFunction(id => window.CryptoLearningMap.getState().lab === id, third.id);
    equal(page.url(), deep, 'back restores selection URL');
    await page.goForward(); await page.waitForFunction(() => window.CryptoLearningMap.getState().topic === '3');
    equal(page.url(), newer, 'forward restores newer topic');
    await page.goto(entry); await loaded();
    check(await page.locator('#resume-card').isVisible(), 'unlinked visit offers saved-session resume');
    const resume = await page.locator('[data-resume]').getAttribute('data-resume'); await page.locator('[data-resume]').click();
    equal((await state()).lab, resume, 'resume opens advertised destination');
    check(await page.locator('#resume-card').isHidden(), 'resume banner clears after resuming');
    await open(`#topic=7&goal=understand&lab=${first.id}`);
    equal(await page.locator('#reflection').inputValue(), observation, 'notes survive reload and topic changes');
    check(await page.locator('#resume-card').isHidden(), 'explicit deep link overrides saved session');
    await page.locator('#lab-detail [data-progress]').click();
    check(!(await state()).explored.includes(first.id), 'exploration can be undone');
    const beforeExternal = (await state()).explored;
    const popupPromise = page.waitForEvent('popup'); await page.locator('#lab-detail .open-lab').click();
    const popup = await popupPromise; await popup.close();
    equal((await state()).explored, beforeExternal, 'opening external lab never automatically marks it explored');

    // Compare exact UI calculations against FactorLesson, with fixed 1-versus-128 regression values.
    await expandExperiment();
    check(await page.locator('[data-factor-action="run"]').isDisabled(), 'Fermat run requires prediction');
    equal(await page.locator('[data-factor-action="step"]:disabled').count(), FactorLesson.CASES.length, 'Fermat steps require prediction');
    await page.locator('[data-factor-prediction="same"]').click(); await page.locator('[data-factor-case="apart"][data-factor-action="step"]').click();
    equal(await page.locator('.factor-count strong').allTextContents(), ['0', '1'], 'one step computes one candidate for chosen modulus');
    equal(await page.locator('[data-factor-action="predict"]:disabled').count(), 3, 'prediction fixed after calculation starts');
    await page.locator('[data-factor-action="run"]').click();
    const actual = await page.evaluate(() => {
      const lesson = window.FactorLesson.mount(document.getElementById('factor-lesson')).getState();
      return {prediction: lesson.prediction, runs: Object.fromEntries(Object.entries(lesson.runs).map(([id, run]) => [id, {...run, factors: run.factors?.map(String)}]))};
    });
    equal(actual.prediction, 'same', 'Fermat keeps prediction');
    const computations = FactorLesson.CASES.map(item => FactorLesson.fermat(item.n));
    equal(computations.map(result => result.candidates), [1, 128], 'exact Fermat reference counts');
    FactorLesson.CASES.forEach((item, index) => equal(actual.runs[item.id], {count: computations[index].candidates, complete: true, factors: computations[index].factors.map(String)}, `Fermat ${item.id}: UI matches exact arithmetic`));
    equal(await page.locator('.factor-count strong').allTextContents(), ['1', '128'], 'calculated counts rendered');
    equal(await page.locator('.factor-reveal > strong').allTextContents(), computations.map(result => result.factors.map(String).join(' × ')), 'recovered factors rendered');
    equal((await state()).explored, beforeExternal, 'experiment completion does not mark any external lab');
    await page.locator('.factor-continue').click();
    equal((await state()).lab, byTitle.get('Factor Forge').id, 'experiment Continue selects Factor Forge');
    equal((await state()).explored, beforeExternal, 'experiment navigation does not certify lab completion');
    await page.locator('[data-factor-action="reset"]').click();
    equal(await page.locator('.factor-count strong').allTextContents(), ['0', '0'], 'reset clears calculations');
    check(await page.locator('[data-factor-action="run"]').isDisabled(), 'reset requires new prediction');
    await open('#topic=missing&goal=missing&path=missing&lab=missing');
    equal((await state()).topic, '7', 'invalid link safely falls back');
    await selectedMatches(expectedRoute('7', 'understand'), '7', 'invalid link');
    await open(`#view=concept&scope=7&lab=${first.id}`); equal((await state()).lab, first.id, 'legacy concept links work');
    const journey = data.paths[0]; await open(`#view=path&scope=${journey.id}`);
    equal((await state()).path, journey.id, 'legacy path links work');
    equal(await ids('#route [data-lab]'), journey.steps.map(title => byTitle.get(title).id), 'legacy path order retained');
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({width, height: 900}); await open('#topic=7');
      if (width <= 760) {
        await page.locator('#topic-toggle').click(); equal(await page.locator('#topic-toggle').getAttribute('aria-expanded'), 'true', `${width}px: menu opens accessibly`);
        await page.locator('#featured-topics [data-topic="3"]').click(); equal(await page.locator('#topic-toggle').getAttribute('aria-expanded'), 'false', `${width}px: topic choice closes menu`);
      }
      for (const hash of ['#topic=7', '#topic=21&goal=deeper', '#topic=35&goal=attack', '#path=' + journey.id]) {
        await open(hash);
        for (const view of ['labs', 'concepts']) {
          await page.locator(`[data-graph-view="${view}"]`).click();
          check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), `${width}px ${hash}/${view}: no overflow`);
        }
      }
      await open('#topic=7');
      await expandExperiment();
      await page.locator('[data-factor-action="reset"]').click();
      await page.locator('[data-factor-prediction="close"]').click();
      await page.locator('[data-factor-action="run"]').click();
      check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), `${width}px: expanded completed experiment has no overflow`);
    }
    equal(errors, [], 'no uncaught JavaScript navigation errors');
    for (const failure of [{status: 503, body: 'unavailable'}, {status: 200, body: 'not JSON'}]) {
      const failed = await context.newPage();
      await failed.route('**/catalog.json', route => route.fulfill({...failure, contentType: 'application/json'}));
      await failed.goto(entry); await failed.waitForSelector('#hero [role="alert"]');
      check((await failed.locator('#hero [role="alert"]').textContent()).includes('could not load'), `catalog ${failure.status}: visible failure`);
      check(await failed.locator('.workspace-grid').isHidden() && await failed.locator('#goal-switch').isHidden(), `catalog ${failure.status}: unavailable controls hidden`);
      await failed.close();
    }
    equal(errors, [], 'catalog errors handled without uncaught exceptions');
    console.log(`Knowledge map browser: PASS (${checks} assertions; ${data.exhibits.length} labs, all topics/goals/paths, paged graphs, keyboard, source prerequisites, persistence/history, exact Fermat, 320–1280px layout and load failures)`);
  } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
