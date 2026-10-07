const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {cadence} = require('../tools/tools-sync.js');

test('fixture-only invocations never advertise or propagate a fleet-check cadence', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tool-cadence-'));
  try {
    const workflows = path.join(root, 'workflows'), tools = path.join(root, 'tools');
    fs.mkdirSync(workflows); fs.mkdirSync(tools);
    fs.writeFileSync(path.join(tools, 'outer.js'), "execFileSync('node', ['tools/inner.js', 'check']);\n");
    fs.writeFileSync(path.join(tools, 'inner.js'), 'module.exports = {};\n');
    fs.writeFileSync(path.join(workflows, 'fixtures.yml'), `name: fixtures
on:
  pull_request:
  push:
permissions:
  contents: read
jobs:
  check:
    steps:
      - run: node tools/outer.js selftest
      # - run: node tools/phantom.js check
`);
    let result = cadence({workflows, tools});
    assert.deepEqual([...result.selftests.get('outer.js')], ['every PR and push']);
    assert.equal(result.has('outer.js'), false);
    assert.equal(result.has('inner.js'), false);
    assert.equal(result.has('phantom.js'), false);
    fs.writeFileSync(path.join(workflows, 'fleet.yml'), `name: fleet
on:
  schedule:
    - cron: '41 7 * * 1'
permissions:
  contents: read
jobs:
  fleet:
    steps:
      - run: node tools/outer.js check
`);
    result = cadence({workflows, tools});
    assert.deepEqual([...result.get('outer.js')], ['weekly']);
    assert.deepEqual([...result.get('inner.js')], ['weekly']);
    assert.deepEqual([...result.selftests.get('outer.js')], ['every PR and push']);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});
