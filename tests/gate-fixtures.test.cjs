'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { withScriptFixture, loadLab, analyse } = require('../tools/gate-sync.js');
const fixtures = path.join(__dirname, '../tools/fixtures/gate');

for (const [name, defect] of [['env-on-pr', true], ['env-split', false]]) {
  test(`${name}: exact fixture bytes exercise the real workflow parser`, () => {
    const source = path.join(fixtures, name), bytes = fs.readFileSync(path.join(source, 'scripts.fixture.json'));
    assert.equal(fs.existsSync(path.join(source, 'package.json')), false);
    let scratch;
    withScriptFixture(source, dir => {
      scratch = dir;
      assert.deepEqual(fs.readFileSync(path.join(dir, 'package.json')), bytes);
      const lab = loadLab(dir);
      assert.deepEqual(lab.scripts, JSON.parse(bytes).scripts);
      const result = analyse(name, lab);
      assert.equal(result.skip, undefined);
      assert.equal(result.findings.some(f => f.code === 'ENV-ON-PR' && f.level === 'fail'), defect);
      assert.equal(fs.existsSync(path.join(dir, 'node_modules')), false);
    });
    assert.equal(fs.existsSync(scratch), false);
    assert.deepEqual(fs.readFileSync(path.join(source, 'scripts.fixture.json')), bytes);
  });
}

test('script and lifecycle payloads are read as data and never executed', () => {
  const source = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-no-execution-control-'));
  try {
    fs.cpSync(path.join(fixtures, 'env-split', '.github'), path.join(source, '.github'), { recursive: true });
    const marker = path.join(source, 'executed');
    const payload = `node -e ${JSON.stringify(`require('fs').writeFileSync(${JSON.stringify(marker)},'bad')`)}`;
    fs.writeFileSync(path.join(source, 'scripts.fixture.json'), JSON.stringify({ scripts: { test: payload, build: payload, postinstall: payload } }));
    withScriptFixture(source, dir => {
      const lab = loadLab(dir);
      assert.equal(lab.scripts.postinstall, payload);
      analyse('no-execution-control', lab);
      assert.equal(fs.existsSync(path.join(dir, 'node_modules')), false);
      assert.equal(fs.existsSync(marker), false);
    });
    assert.equal(fs.existsSync(marker), false);
  } finally { fs.rmSync(source, { recursive: true, force: true }); }
});

test('scratch is removed when a verification callback fails', () => {
  let scratch;
  assert.throws(() => withScriptFixture(path.join(fixtures, 'env-split'), dir => {
    scratch = dir;
    throw new Error('deliberate negative control');
  }), /deliberate negative control/);
  assert.equal(fs.existsSync(scratch), false);
});

test('dependency-bearing or malformed data cannot hide under the fixture role', () => {
  const source = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-fixture-schema-control-'));
  try {
    for (const value of ['{', JSON.stringify({ scripts: {}, dependencies: { vite: '1' } }),
      JSON.stringify({ scripts: [] }), JSON.stringify({ scripts: { test: null } })]) {
      fs.writeFileSync(path.join(source, 'scripts.fixture.json'), value);
      let invoked = false;
      assert.throws(() => withScriptFixture(source, () => { invoked = true; }));
      assert.equal(invoked, false);
    }
  } finally { fs.rmSync(source, { recursive: true, force: true }); }
});
