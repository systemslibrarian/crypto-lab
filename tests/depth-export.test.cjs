const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const source = path.join(__dirname, '..', 'tools', 'depth-audit-export.sh');
function fixture(t, ghBody) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-export-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const bin = path.join(root, 'bin');
  const tools = path.join(root, 'tools');
  const dest = path.join(root, '.scratch');
  fs.mkdirSync(bin); fs.mkdirSync(tools); fs.mkdirSync(dest);
  fs.copyFileSync(source, path.join(tools, 'depth-audit-export.sh'));
  // Restrict PATH even on CI hosts that have a real gh installed. No network.
  for (const name of ['dirname', 'mktemp', 'rm', 'mkdir', 'mv', 'wc', 'tr', 'head', 'tar', 'gzip', 'cut', 'cp']) {
    const exe = process.env.PATH.split(path.delimiter).map(d => path.join(d, name)).find(p => fs.existsSync(p));
    assert.ok(exe, `fixture needs ${name}`);
    fs.symlinkSync(exe, path.join(bin, name));
  }
  fs.symlinkSync(process.execPath, path.join(bin, 'node'));
  if (ghBody !== undefined) fs.writeFileSync(path.join(bin, 'gh'), `#!/bin/bash\n${ghBody}\n`, { mode: 0o755 });
  const saved = {
    '.exported.tsv': 'prior-lab\tmain\tprior-sha\n',
    '.export-failed.tsv': 'prior-unread\tmain\tprior reason\n',
    '.to-export.tsv': 'prior-lab\tmain\n',
  };
  for (const [name, text] of Object.entries(saved)) fs.writeFileSync(path.join(dest, name), text);
  return { root, dest, saved, run: () => spawnSync('/bin/bash', [path.join(tools, 'depth-audit-export.sh')], {
    env: { ...process.env, PATH: bin }, encoding: 'utf8', timeout: 10000,
  }) };
}

test('unreadable discovery fails and preserves prior export manifests', async t => {
  const cases = [
    ['missing CLI', undefined],
    ['failed API with valid JSON', 'printf "[]"; exit 1'],
    ['malformed JSON', 'printf "bad-json"'],
    ['wrong response shape', 'printf "{}"'],
    ['missing repository name', 'printf "[{}]"'],
  ];
  for (const [name, body] of cases) await t.test(name, t => {
    const f = fixture(t, body); const r = f.run();
    assert.equal(r.status, 1, r.stderr);
    assert.match(r.stderr, /UNREAD/);
    assert.doesNotMatch(r.stdout, /exported 0, unreadable 0/);
    for (const [file, text] of Object.entries(f.saved)) assert.equal(fs.readFileSync(path.join(f.dest, file), 'utf8'), text);
  });
});

test('a discovered repository with unreadable tarball is named and fails', t => {
  const f = fixture(t, `if [ "$1" = repo ]; then
    printf '%s' '[{"name":"crypto-lab-example","defaultBranchRef":{"name":"main"}}]'
  else
    echo 'fixture API unavailable' >&2; exit 1
  fi`);
  const r = f.run();
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stdout, /exported 0, unreadable 1/);
  assert.match(fs.readFileSync(path.join(f.dest, '.export-failed.tsv'), 'utf8'), /crypto-lab-example\tmain\tfixture API unavailable/);
});

test('a valid archive exports normal and hidden files with its commit', t => {
  const f = fixture(t, `if [ "$1" = repo ]; then
    printf '%s' '[{"name":"crypto-lab-example","defaultBranchRef":{"name":"main"}}]'
  else
    exec tar czf - -C "${'${FIXTURE_ARCHIVE}'}" systemslibrarian-example-abcdef1
  fi`);
  const archive = path.join(f.root, 'archive');
  const top = path.join(archive, 'systemslibrarian-example-abcdef1');
  fs.mkdirSync(top, { recursive: true });
  fs.writeFileSync(path.join(top, 'README.md'), 'fixture source');
  fs.mkdirSync(path.join(top, '.github'));
  fs.writeFileSync(path.join(top, '.github', 'fixture.yml'), 'fixture workflow');
  const prior = process.env.FIXTURE_ARCHIVE;
  process.env.FIXTURE_ARCHIVE = archive;
  t.after(() => { if (prior === undefined) delete process.env.FIXTURE_ARCHIVE; else process.env.FIXTURE_ARCHIVE = prior; });
  const r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /exported 1, unreadable 0/);
  assert.equal(fs.readFileSync(path.join(f.dest, '.exported.tsv'), 'utf8'), 'crypto-lab-example\tmain\tabcdef1\n');
  assert.equal(fs.readFileSync(path.join(f.dest, 'crypto-lab-example', 'README.md'), 'utf8'), 'fixture source');
  assert.equal(fs.readFileSync(path.join(f.dest, 'crypto-lab-example', '.github', 'fixture.yml'), 'utf8'), 'fixture workflow');
});
