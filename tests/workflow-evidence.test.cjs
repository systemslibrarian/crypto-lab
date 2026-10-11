'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { verifyPublishJobs } = require('../tools/deploy-sync.js');
const { loadLab, analyse } = require('../tools/gate-sync.js');

const step = (name, conclusion = 'success') => ({ name, conclusion });
const job = (name, steps = [step('Verify')]) => ({ name, conclusion: 'success', steps });
const publish = { name: 'Publish', uses: 'actions/deploy-pages@v5' };
function matrixFixture() {
  return {
    wf: { jobs: {
      test: { strategy: { matrix: { node: [20, 22] } }, steps: [{ name: 'Verify', run: 'npm test' }] },
      deploy: { needs: 'test', steps: [publish] },
    } },
    jobs: [job('test (20)'), job('test (22)'), job('deploy', [step('Publish')])],
  };
}
test('all declared matrix cells establish the publishing prerequisite', () => {
  const f = matrixFixture();
  assert.equal(verifyPublishJobs(f.wf, f.jobs), true);
});
test('explicit matrix display names resolve against each configured value', () => {
  const f = matrixFixture();
  f.wf.jobs.test.name = 'Node ${{ matrix.node }}';
  f.jobs[0].name = 'Node 20'; f.jobs[1].name = 'Node 22';
  assert.equal(verifyPublishJobs(f.wf, f.jobs), true);
});
for (const mutation of ['missing', 'failed', 'cancelled', 'skipped', 'unreadable', 'omitted-step', 'failed-step', 'duplicate', 'wrong-cell']) {
  test(`matrix prerequisite refuses ${mutation}`, () => {
    const f = matrixFixture();
    if (mutation === 'missing') f.jobs.splice(1, 1);
    if (['failed', 'cancelled', 'skipped'].includes(mutation)) f.jobs[1].conclusion = mutation === 'failed' ? 'failure' : mutation;
    if (mutation === 'unreadable') f.jobs[1].steps = null;
    if (mutation === 'omitted-step') f.jobs[1].steps = [step('Set up job')];
    if (mutation === 'failed-step') f.jobs[1].steps[0].conclusion = 'failure';
    if (mutation === 'duplicate') f.jobs.push(structuredClone(f.jobs[1]));
    if (mutation === 'wrong-cell') f.jobs[1].name = 'test (24)';
    assert.equal(verifyPublishJobs(f.wf, f.jobs), false);
  });
}
test('finite include/exclude combinations are measured, not a prefix wildcard', () => {
  const f = matrixFixture();
  f.wf.jobs.test.strategy.matrix = { node: [20, 22], exclude: [{ node: 20 }], include: [{ node: 24 }] };
  f.jobs[0].name = 'test (24)';
  assert.equal(verifyPublishJobs(f.wf, f.jobs), true);
  f.jobs.pop();
  assert.equal(verifyPublishJobs(f.wf, f.jobs), false);
});
test('unresolved dynamic matrices and ambiguous names remain incomplete', () => {
  const f = matrixFixture();
  f.wf.jobs.test.strategy.matrix = '${{ fromJSON(needs.prepare.outputs.matrix) }}';
  assert.equal(verifyPublishJobs(f.wf, f.jobs), false);
  f.wf.jobs.test.strategy.matrix = { node: [20, 22] };
  f.wf.jobs.test.name = 'same';
  assert.equal(verifyPublishJobs(f.wf, f.jobs), false);
});
function reusableFixture() {
  const name = './.github/workflows/gate.yml';
  return {
    name,
    wf: { jobs: { test: { uses: name }, deploy: { needs: 'test', steps: [publish] } } },
    sources: { [name]: { jobs: { unit: { steps: [{ name: 'Verify', run: 'npm test' }] }, browser: { steps: [{ name: 'Verify', run: 'npm run browser' }] } } } },
    jobs: [job('test / unit'), job('test / browser'), job('deploy', [step('Publish')])],
  };
}
test('every configured called job must be readable and successful', () => {
  const f = reusableFixture();
  assert.equal(verifyPublishJobs(f.wf, f.jobs, f.sources), true);
  assert.equal(verifyPublishJobs(f.wf, f.jobs), false);
  f.jobs.splice(1, 1);
  assert.equal(verifyPublishJobs(f.wf, f.jobs, f.sources), false);
});
test('nested local calls retain their full identity and prerequisite chain', () => {
  const f = reusableFixture();
  f.sources[f.name].jobs.unit = { uses: './.github/workflows/inner.yml' };
  f.sources['./.github/workflows/inner.yml'] = { jobs: { math: { steps: [{ name: 'Verify', run: 'npm test' }] } } };
  f.jobs[0].name = 'test / unit / math';
  assert.equal(verifyPublishJobs(f.wf, f.jobs, f.sources), true);
  f.jobs[0].conclusion = 'skipped';
  assert.equal(verifyPublishJobs(f.wf, f.jobs, f.sources), false);
});
test('cycles, unavailable calls and remote calls cannot establish publication', () => {
  const f = reusableFixture();
  f.sources[f.name].jobs.unit = { uses: f.name };
  assert.equal(verifyPublishJobs(f.wf, f.jobs, f.sources), false);
  f.wf.jobs.test.uses = 'example/private/.github/workflows/gate.yml@main';
  assert.equal(verifyPublishJobs(f.wf, f.jobs, f.sources), false);
});
test('a successful job with a failed tolerated stage cannot produce global success', () => {
  const f = reusableFixture();
  f.jobs[0].steps[0].conclusion = 'failure';
  assert.equal(verifyPublishJobs(f.wf, f.jobs, f.sources), false);
});
test('malformed job and step records remain unreadable without throwing', () => {
  const f = matrixFixture();
  assert.equal(verifyPublishJobs(f.wf, [null]), false);
  f.jobs[0].steps = [null];
  assert.equal(verifyPublishJobs(f.wf, f.jobs), false);
  f.jobs[0].steps = {};
  assert.equal(verifyPublishJobs(f.wf, f.jobs), false);
});
test('omitted standalone verification jobs cannot disappear from global coverage', () => {
  const f = matrixFixture();
  f.wf.jobs.audit = { steps: [{ name: 'Verify', run: 'npm audit' }] };
  assert.equal(verifyPublishJobs(f.wf, f.jobs), false);
  f.jobs.push(job('audit'));
  assert.equal(verifyPublishJobs(f.wf, f.jobs), true);
  f.jobs.push(job('audit'));
  assert.equal(verifyPublishJobs(f.wf, f.jobs), false);
});
test('malformed configured steps cannot throw or establish coverage', () => {
  const f = matrixFixture();
  for (const steps of [null, {}, [null], [[]]]) {
    f.wf.jobs.test.steps = steps;
    assert.equal(verifyPublishJobs(f.wf, f.jobs), false);
  }
});
function gateFixture() {
  return loadLab(path.join(__dirname, '../tools/fixtures/gate/env-split'));
}
test('postpublication live checks are not unpublished-PR prerequisites', () => {
  const f = gateFixture();
  f.workflows.get('deploy.yml').jobs.deploy.steps.push({ name: 'Live contact', run: 'cmp public/security.txt live/security.txt' });
  const findings = analyse('fixture', f).findings || [];
  assert.equal(findings.some((x) => ['GATE-WEAKER', 'FUSED-GATE-OFF'].includes(x.code)), false);
});
test('the same check before publication still exposes both gate defects', () => {
  const f = gateFixture();
  f.workflows.get('deploy.yml').jobs.deploy.steps.unshift({ name: 'Built contact', run: 'cmp public/security.txt dist/security.txt' });
  const findings = analyse('fixture', f).findings || [];
  assert.equal(findings.some((x) => x.code === 'GATE-WEAKER'), true);
  assert.equal(findings.some((x) => x.code === 'FUSED-GATE-OFF'), true);
});
