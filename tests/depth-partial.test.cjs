const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

test('both diagnostic CLIs retain unreadable scope and never write assurance reports', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-partial-cli-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const tools = path.join(__dirname, '../tools');
  fs.cpSync(tools, path.join(root, 'tools'), { recursive: true,
    filter: source => !source.includes(`${path.sep}node_modules`) });
  fs.symlinkSync(path.join(tools, 'node_modules'), path.join(root, 'tools/node_modules'), 'dir');
  const scratch = path.join(root, '.scratch');
  fs.mkdirSync(path.join(scratch, 'crypto-lab-live'), { recursive: true });
  const sha = 'abcdef1000000000000000000000000000000000';
  fs.writeFileSync(path.join(scratch, '.to-export.tsv'), 'crypto-lab-live\tmain\ncrypto-lab-empty\tmain\n');
  fs.writeFileSync(path.join(scratch, '.exported.tsv'), `crypto-lab-live\tmain\t${sha}\n`);
  fs.writeFileSync(path.join(scratch, '.export-failed.tsv'), 'crypto-lab-empty\tmain\tHTTP409 empty repository\n');
  for (const tool of ['depth-audit.js', 'test-invocation.js']) {
    const run = flag => spawnSync(process.execPath, [path.join(root, 'tools', tool), flag],
      { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    const partial = run('--partial-json');
    assert.equal(partial.status, 2, partial.stderr);
    const report = JSON.parse(partial.stdout);
    assert.equal(report.scope.complete, false);
    assert.equal(report.scope.discovered, 2);
    assert.equal(report.scope.exported, 1);
    assert.equal(report.scope.unreadable[0].lab, 'crypto-lab-empty');
    assert.equal(report.scope.unreadable[0].state, 'UNREAD');
    if (tool === 'depth-audit.js') {
      assert.equal(report.assurance, 'not-established');
      assert.equal(report.rows.length, 1);
      assert.equal(report.rows[0].sourceSha, sha);
    } else {
      assert.equal(report.checked, 1);
      assert.equal(report.sources['crypto-lab-live'], sha);
    }
    const strict = run('--json');
    assert.equal(strict.status, 2, strict.stderr);
    assert.equal(strict.stdout, '');
    assert.match(strict.stderr, /UNREAD/);
  }
  assert.equal(fs.existsSync(path.join(root, 'audits')), false);
});
