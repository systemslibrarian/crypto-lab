const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-complete-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const tools = path.join(__dirname, '../tools');
  fs.cpSync(tools, path.join(root, 'tools'), { recursive: true,
    filter: source => !source.includes(`${path.sep}node_modules`) });
  const scratch = path.join(root, '.scratch');
  fs.mkdirSync(path.join(scratch, 'crypto-lab-live'), { recursive: true });
  const sha = 'abcdef1000000000000000000000000000000000';
  fs.writeFileSync(path.join(scratch, '.to-export.tsv'), 'crypto-lab-live\tmain\n');
  fs.writeFileSync(path.join(scratch, '.exported.tsv'), `crypto-lab-live\tmain\t${sha}\n`);
  fs.writeFileSync(path.join(scratch, '.export-failed.tsv'), '');
  fs.copyFileSync(path.join(__dirname, '../index.html'), path.join(root, 'index.html'));
  fs.mkdirSync(path.join(root, 'audits'));
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const report = path.join(root, 'audits', `DEPTH-AUDIT-${today}.md`);
  return {root,sha,report,run: args => spawnSync(process.execPath,
    [path.join(root, 'tools/depth-audit.js'), ...args], { encoding:'utf8',timeout:15000 })};
}

test('complete bounded generation checks cleanly, preserves full SHA and rejects changed reports', t => {
  const f = fixture(t);
  const json = f.run(['--json']);
  assert.equal(json.status, 0, json.stderr);
  assert.equal(JSON.parse(json.stdout)[0].sourceSha, f.sha);
  const generated = f.run([]);
  assert.equal(generated.status, 0, generated.stderr);
  const text = fs.readFileSync(f.report, 'utf8');
  assert.match(text, new RegExp(f.sha));
  const clean = f.run(['check']);
  assert.equal(clean.status, 0, clean.stderr);
  assert.equal(fs.readFileSync(f.report,'utf8'), text);
  fs.writeFileSync(f.report, text.replace('## Coverage', '## Changed coverage'));
  const stale = f.run(['check']);
  assert.equal(stale.status, 1, stale.stderr);
  assert.match(stale.stderr, /OUT OF DATE/);
});

test('strict modes retain timeout, unreadable and malformed worker gaps without scores or report writes', async t => {
  for (const [label,worker,pattern] of [
    ['timeout','setInterval(() => {},1000);',/timed out/],
    ['unreadable','require("worker_threads").parentPort.postMessage({error:"unreadable fixture source"});',/unreadable fixture source/],
    ['malformed','require("worker_threads").parentPort.postMessage({row:{lab:"crypto-lab-live"}});',/malformed or mismatched/],
  ]) await t.test(label, t => {
    const f = fixture(t);
    const bounded = path.join(f.root,'tools/depth-bounded.js');
    // Shorten only the deliberately stuck fixture's budget. Immediate error
    // controls keep production's20seconds so a busy host cannot misclassify
    // their worker startup as the different timeout case.
    if (label === 'timeout') fs.writeFileSync(bounded,
      fs.readFileSync(bounded,'utf8').replace('timeoutMs = 20000','timeoutMs = 500'));
    fs.writeFileSync(path.join(f.root,'tools/depth-classify-worker.js'),worker);
    fs.writeFileSync(f.report,'existing report must survive unreadable evidence');
    for (const args of [[],['check'],['--json']]) {
      const result = f.run(args);
      assert.equal(result.status, 2, result.stderr);
      assert.equal(result.stdout, '');
      assert.match(result.stderr,/UNREAD/);
      assert.match(result.stderr,pattern);
      assert.match(result.stderr,new RegExp(f.sha));
      assert.equal(fs.readFileSync(f.report,'utf8'),'existing report must survive unreadable evidence');
    }
  });
});
