'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { parseYaml } = require('../tools/gate-sync.js');

const workflow = parseYaml(fs.readFileSync(path.join(__dirname, '../.github/workflows/maintenance-verification.yml'), 'utf8'));
function runStep(t, jobName, step, { output = '{}\n', exit = 0, env = {}, unwritable = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'maintenance-workflow-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'tools'));
  for (const name of ['teach-issues', 'teach-observe']) {
    fs.writeFileSync(path.join(root, 'tools', `${name}.js`),
      `process.stdout.write(${JSON.stringify(output)}); process.exitCode = ${exit};\n`);
  }
  if (unwritable) {
    const destination = step.id === 'issues' ? 'teach-issues.json' : 'teach-observe.json';
    fs.mkdirSync(path.join(root, 'maintenance-evidence', destination), { recursive: true });
  }
  const script = path.join(root, 'step.sh');
  fs.writeFileSync(script, step.run);
  const job = workflow.jobs[jobName];
  const shell = step.shell || job.defaults?.run?.shell || workflow.defaults?.run?.shell;
  // Match GitHub's documented Linux commands, including the unspecified-shell
  // behavior. Running the actual scalar catches a missing pipefail declaration.
  assert.ok(shell === undefined || shell === 'bash', `unsupported shell: ${shell}`);
  return spawnSync('bash', [...(shell === 'bash' ? ['--noprofile', '--norc', '-eo', 'pipefail'] : ['-e']), script], {
    cwd: root, encoding: 'utf8', timeout: 10000,
    env: { ...process.env, ...env, PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH}` },
  });
}
for (const id of ['issues', 'observe']) {
  const step = workflow.jobs.teaching.steps.find(step => step.id === id);
  assert.ok(step, `missing ${id} step`);
  test(`${id}: readable successful JSON survives capture`, t => {
    const r = runStep(t, 'teaching', step);
    assert.equal(r.signal, null); assert.equal(r.status, 0, r.stderr);
    assert.equal(JSON.parse(r.stdout).constructor, Object);
  });
  for (const exit of [1, 2]) {
    test(`${id}: valid JSON cannot hide producer exit ${exit} behind tee`, t => {
      const r = runStep(t, 'teaching', step, { exit });
      assert.equal(r.signal, null); assert.equal(r.status, exit, r.stderr);
      assert.deepEqual(JSON.parse(r.stdout), {});
    });
  }
  for (const output of ['', '{"incomplete":', 'unreadable']) {
    test(`${id}: missing or malformed JSON remains a failed stage (${JSON.stringify(output)})`, t => {
      const r = runStep(t, 'teaching', step, { output });
      assert.equal(r.signal, null); assert.notEqual(r.status, 0, r.stdout);
    });
  }
  test(`${id}: failed evidence capture cannot establish success`, t => {
    const r = runStep(t, 'teaching', step, { unwritable: true });
    assert.equal(r.signal, null); assert.notEqual(r.status, 0, r.stdout);
  });
}
for (const [jobName, names] of Object.entries({
  teaching: ['DRIFT', 'ISSUES', 'OBSERVE'],
  exports: ['EXPORT', 'DEPTH', 'INVOCATION', 'PARTIALDEPTH', 'PARTIALINVOCATION', 'DIAGNOSTICS'],
})) {
  const gate = workflow.jobs[jobName].steps.find(step => step.name === 'Preserve failed or incomplete outcomes');
  assert.ok(gate); assert.equal(gate.if, 'always()');
  const successful = Object.fromEntries(names.map(name => [name, 'success']));
  test(`${jobName}: final gate accepts every successful stage`, t => {
    assert.equal(runStep(t, jobName, gate, { env: successful }).status, 0);
  });
  for (const name of names) {
    test(`${jobName}: final gate refuses missing, failed, skipped and cancelled ${name}`, t => {
      for (const outcome of ['', 'failure', 'skipped', 'cancelled']) {
        const r = runStep(t, jobName, gate, { env: { ...successful, [name]: outcome } });
        assert.equal(r.signal, null); assert.notEqual(r.status, 0, `${name}=${outcome}`);
      }
    });
  }
}
test('maintenance verification has read-only permissions and no publisher', () => {
  assert.deepEqual(workflow.permissions, { contents: 'read' });
  for (const job of Object.values(workflow.jobs)) {
    assert.equal(job.permissions, undefined); assert.equal(job.environment, undefined);
    for (const step of job.steps) {
      assert.doesNotMatch(step.uses || '', /deploy-pages|actions-gh-pages/);
      assert.doesNotMatch(step.run || '', /gh\s+(?:pr\s+merge|issue\s+(?:create|edit)|workflow\s+run)/);
    }
  }
});
