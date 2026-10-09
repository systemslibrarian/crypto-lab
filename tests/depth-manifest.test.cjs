const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { readExports, readExportSnapshot } = require('../tools/depth-exports.js');
const sha = 'abcdef1000000000000000000000000000000000';
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-manifest-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'crypto-lab-live'));
  fs.mkdirSync(path.join(root, 'crypto-lab-stale'));
  fs.writeFileSync(path.join(root, '.to-export.tsv'), 'crypto-lab-live\tmain\n');
  fs.writeFileSync(path.join(root, '.exported.tsv'), `crypto-lab-live\tmain\t${sha}\n`);
  fs.writeFileSync(path.join(root, '.export-failed.tsv'), '');
  return root;
}
test('complete export reads only discovered sources, excluding stale folders', t => {
  const root = fixture(t);
  assert.deepEqual([...readExports(root)], [['crypto-lab-live', { branch: 'main', sha }]]);
});
test('empty, partial, failed and unpinned snapshots cannot produce assurance', async t => {
  for (const [name, file, value] of [
    ['empty discovery', '.to-export.tsv', ''],
    ['missing export', '.exported.tsv', ''],
    ['failed export', '.export-failed.tsv', 'crypto-lab-live\tmain\tnetwork unavailable\n'],
    ['short SHA', '.exported.tsv', 'crypto-lab-live\tmain\tabcdef1\n'],
    ['duplicate row', '.exported.tsv', `crypto-lab-live\tmain\t${sha}\ncrypto-lab-live\tmain\t${sha}\n`],
    ['different branch', '.exported.tsv', `crypto-lab-live\told\t${sha}\n`],
    ['unlisted source', '.exported.tsv', `crypto-lab-stale\tmain\t${sha}\n`],
  ]) await t.test(name, t => {
    const root = fixture(t);
    fs.writeFileSync(path.join(root, file), value);
    assert.throws(() => readExports(root), /UNREAD/);
  });
});

test('partial diagnostics preserve denominator and named unreadable sources', t => {
  const root = fixture(t);
  fs.appendFileSync(path.join(root, '.to-export.tsv'), 'crypto-lab-empty\tmain\n');
  fs.writeFileSync(path.join(root, '.export-failed.tsv'), 'crypto-lab-empty\tmain\tHTTP409 empty repository\n');
  const result = readExportSnapshot(root);
  assert.deepEqual([...result.exported.keys()], ['crypto-lab-live']);
  assert.equal(result.scope.complete, false);
  assert.equal(result.scope.discovered, 2);
  assert.equal(result.scope.exported, 1);
  assert.deepEqual(result.scope.unreadable, [{ lab: 'crypto-lab-empty', branch: 'main',
    sourceSha: null, state: 'UNREAD', reason: 'HTTP409 empty repository' }]);
  assert.throws(() => readExports(root), /partial export/);
  // Contradictory, invalid or duplicate failed records must not authorize partial scoring.
  fs.writeFileSync(path.join(root, '.export-failed.tsv'), 'crypto-lab-live\tmain\tfailed\n');
  assert.throws(() => readExportSnapshot(root), /UNREAD/);
  fs.writeFileSync(path.join(root, '.export-failed.tsv'), 'crypto-lab-unknown\tmain\tfailed\n');
  assert.throws(() => readExportSnapshot(root), /UNREAD/);
});

test('missing source and unrecorded exports remain named gaps', t => {
  const root = fixture(t);
  fs.rmSync(path.join(root, 'crypto-lab-live'), { recursive: true });
  let result = readExportSnapshot(root);
  assert.equal(result.scope.exported, 0);
  assert.equal(result.scope.unreadable[0].sourceSha, sha);
  fs.writeFileSync(path.join(root, '.exported.tsv'), '');
  result = readExportSnapshot(root);
  assert.equal(result.scope.complete, false);
  assert.match(result.scope.unreadable[0].reason, /no successful export/);
  assert.throws(() => readExports(root), /UNREAD/);
});
