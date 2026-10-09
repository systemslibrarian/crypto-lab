'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const playwright = require('../tools/node_modules/playwright');
const { checkNote, measureOverflow } = require('../tools/teach-issues');

test('browser launch failures remain unreadable and do not hide other engines', async () => {
  const originals = {};
  const visited = [];
  for (const engine of ['chromium', 'firefox', 'webkit']) {
    originals[engine] = playwright[engine].launch;
    playwright[engine].launch = async () => {
      visited.push(engine);
      if (engine === 'webkit') throw new Error('missing host libraries');
      return {
        newPage: async () => ({
          goto: async () => {}, waitForTimeout: async () => {},
          locator: () => ({ innerText: async () => 'the recorded needle' }),
          evaluate: async () => 288, close: async () => {},
        }),
        close: async () => {},
      };
    };
  }
  try {
    const seen = await checkNote({ url: 'https://fixture.invalid', issue: { needle: 'recorded needle' } });
    assert.deepEqual(seen, { chromium: true, firefox: true, webkit: 'error: missing host libraries' });
    assert.deepEqual(visited, ['chromium', 'firefox', 'webkit']);
    const bad = await measureOverflow({ engine: 'WebKit', viewport: '390x844' });
    assert.equal(bad.error, 'missing host libraries');
    const good = await measureOverflow({ engine: 'Chromium', viewport: '390x844' });
    assert.deepEqual(good, { overflow: 288, at: '390x844' });
  } finally {
    for (const engine of Object.keys(originals)) playwright[engine].launch = originals[engine];
  }
});


test('CLI drains a large JSON report through a pipe before exiting', async () => {
  const fs = require('node:fs');
  const os = require('node:os');
  const path = require('node:path');
  const { spawn } = require('node:child_process');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'teach-json-drain-'));
  try {
    fs.mkdirSync(path.join(root, 'tools/node_modules/playwright'), { recursive: true });
    fs.mkdirSync(path.join(root, 'teach/_src/modules'), { recursive: true });
    fs.copyFileSync(path.join(__dirname, '../tools/teach-issues.js'), path.join(root, 'tools/teach-issues.js'));
    fs.writeFileSync(path.join(root, 'tools/node_modules/playwright/index.js'), 'module.exports = {};');
    fs.writeFileSync(path.join(root, 'index.html'), '');
    const notes = Array.from({ length: 500 }, (_, i) => ({
      text: String(i) + 'x'.repeat(2000), rederived: new Date().toISOString().slice(0, 10),
      observable: { kind: 'manual', why: 'fixture', cadence_days: 120 },
    }));
    fs.writeFileSync(path.join(root, 'teach/_src/modules/fixture.json'), JSON.stringify({
      id: 'fixture', exhibits: [], instructor_notes: { expected_observations: notes },
    }));
    const child = spawn(process.execPath, [path.join(root, 'tools/teach-issues.js'), '--json']);
    let output = '', errors = '';
    child.stdout.pause();
    child.stdout.on('data', (data) => { output += data; });
    child.stderr.on('data', (data) => { errors += data; });
    setTimeout(() => child.stdout.resume(), 50);
    const exit = await new Promise((resolve, reject) => {
      child.on('error', reject); child.on('close', resolve);
    });
    assert.equal(exit, 0, errors);
    const rows = JSON.parse(output);
    assert.equal(rows.length, 500);
    assert.equal(rows[499].text, notes[499].text);
    assert.ok(rows.every((r) => r.state === 'UNCHECKED'));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
