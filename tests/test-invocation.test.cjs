'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function fixture(t, files = {}, wanted = ['crypto-lab-example']) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-invocation-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(path.join(__dirname, '../tools'), path.join(root, 'tools'), {
    recursive: true, filter: source => !source.includes(`${path.sep}node_modules`),
  });
  const scratch = path.join(root, '.scratch'), lab = path.join(scratch, 'crypto-lab-example');
  fs.mkdirSync(lab, { recursive: true });
  const put = (file, content) => {
    const target = path.join(lab, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };
  for (const [file, content] of Object.entries({ 'tests/example.test.ts': 'test("control", () => {});', ...files })) put(file, content);
  fs.writeFileSync(path.join(scratch, '.to-export.tsv'), wanted.map(l => `${l}\tmain\n`).join(''));
  fs.writeFileSync(path.join(scratch, '.exported.tsv'), `crypto-lab-example\tmain\t${'a'.repeat(40)}\n`);
  fs.writeFileSync(path.join(scratch, '.export-failed.tsv'), '');
  return { root, scratch, lab, put, run(flag = '--json') {
    const r = spawnSync(process.execPath, [path.join(root, 'tools/test-invocation.js'), flag], {
      encoding: 'utf8', timeout: 10000, maxBuffer: 1024 * 1024,
    });
    assert.equal(r.signal, null, r.stderr);
    return { ...r, report: r.stdout ? JSON.parse(r.stdout) : null };
  } };
}
const workflow = run => `on: [push]\njobs:\n  check:\n    runs-on: ubuntu-latest\n    steps:\n      - run: ${run}\n`;
const expectUnitGap = report => {
  assert.equal(report.findings.length, 1);
  assert.deepEqual(report.findings[0].uninvoked, ['unit']);
  assert.equal(report.undetermined.length, 0);
};

test('transitive package scripts establish a real workflow caller', t => {
  const f = fixture(t, { '.github/workflows/test.yml': workflow('npm run ci'),
    'package.json': JSON.stringify({ scripts: { ci: 'npm run checks', checks: 'echo "vitest" && vitest run' } }) });
  const r = f.run(); assert.equal(r.status, 0, r.stderr);
  assert.equal(r.report.checked, 1); assert.deepEqual(r.report.findings, []); assert.deepEqual(r.report.undetermined, []);
});
for (const [name, source] of [
  ['workflow display name', 'name: vitest\n' + workflow('echo build')],
  ['step display name', workflow('echo build').replace('- run:', '- name: vitest\n        run:')],
  ['environment value', workflow('echo build').replace('    steps:', '    env:\n      RUNNER: vitest\n    steps:')],
  ['whole-line comment', '# vitest run\n' + workflow('echo build')],
  ['inline comment', workflow('echo build # vitest run')],
  ['quoted diagnostic', workflow('echo "vitest run"')],
  ['unquoted diagnostic', workflow('printf vitest')],
  ['quoted node program', workflow('node -e "console.log(\'vitest run\')"')],
]) {
  test(`${name} cannot establish a test invocation`, t => {
    const r = fixture(t, { '.github/workflows/test.yml': source }).run();
    assert.equal(r.status, 0, r.stderr);
    if (name === 'quoted node program') {
      assert.equal(r.report.findings.length, 0); assert.equal(r.report.undetermined.length, 1);
    } else expectUnitGap(r.report);
  });
}
test('quoted shell programs remain undetermined rather than a runner claim', t => {
  const r = fixture(t, { '.github/workflows/test.yml': workflow('bash -c "vitest run"') }).run();
  assert.equal(r.status, 0); assert.deepEqual(r.report.findings, []); assert.equal(r.report.undetermined.length, 1);
});
test('an executable runner after a diagnostic is preserved', t => {
  const r = fixture(t, { '.github/workflows/test.yml': workflow('echo "diagnostic; vitest" && node --import tsx --test tests/*.test.ts') }).run();
  assert.equal(r.status, 0); assert.deepEqual(r.report.findings, []); assert.deepEqual(r.report.undetermined, []);
});
test('malformed workflow remains unreadable even beside a valid caller', t => {
  const r = fixture(t, { '.github/workflows/test.yml': workflow('vitest run'), '.github/workflows/bad.yml': 'jobs: [ # vitest\n' }).run();
  assert.equal(r.status, 0); assert.deepEqual(r.report.findings, []); assert.equal(r.report.undetermined.length, 1);
  assert.match(r.report.undetermined[0].reasons[0], /bad.yml cannot be parsed/);
});
test('malformed package metadata remains undetermined', t => {
  const r = fixture(t, { '.github/workflows/test.yml': workflow('vitest run'), 'package.json': 'bad-json' }).run();
  assert.equal(r.status, 0); assert.equal(r.report.undetermined.length, 1);
  assert.match(r.report.undetermined[0].reasons[0], /package JSON/);
});
test('local reusable workflow with a real caller stays supported', t => {
  const r = fixture(t, { '.github/workflows/test.yml': 'on: push\njobs:\n  tests:\n    uses: ./.github/workflows/gate.yml\n',
    '.github/workflows/gate.yml': workflow('vitest run') }).run();
  assert.equal(r.status, 0); assert.deepEqual(r.report.findings, []); assert.deepEqual(r.report.undetermined, []);
});
test('an unreadable external reusable workflow remains undetermined', t => {
  const r = fixture(t, { '.github/workflows/test.yml': 'on: push\njobs:\n  tests:\n    uses: example/other/.github/workflows/gate.yml@main\n' }).run();
  assert.equal(r.status, 0); assert.deepEqual(r.report.findings, []); assert.equal(r.report.undetermined.length, 1);
  assert.match(r.report.undetermined[0].reasons[0], /workflow this tool cannot read/);
});
test('module and CommonJS test files are included in caller coverage', t => {
  const f = fixture(t, { '.github/workflows/test.yml': workflow('echo build'), 'tests/module.test.mjs': 'export {};', 'tests/common.test.cjs': 'module.exports = {};' });
  let r = f.run(); expectUnitGap(r.report); assert.equal(r.report.findings[0].present.unit, 3);
  f.put('.github/workflows/test.yml', workflow('node --test tests/*.test.*'));
  r = f.run(); assert.deepEqual(r.report.findings, []); assert.deepEqual(r.report.undetermined, []);
});
test('Python interpreter flags do not hide the real unittest invocation', t => {
  const r = fixture(t, { '.github/workflows/test.yml': workflow('node --import tsx --test tests/example.test.ts && python3 -B -m unittest discover -s verification'),
    'verification/test_real.py': 'import unittest\nclass TestControl(unittest.TestCase): pass\n' }).run();
  assert.equal(r.status, 0); assert.deepEqual(r.report.findings, []); assert.deepEqual(r.report.undetermined, []);
});
test('a real node:test harness works while a harness comment is no caller', t => {
  const f = fixture(t, { '.github/workflows/test.yml': workflow('node scripts/test.mjs'),
    'scripts/test.mjs': 'import { run } from "node:test";\nrun();\n' });
  let r = f.run(); assert.equal(r.status, 0); assert.deepEqual(r.report.findings, []); assert.deepEqual(r.report.undetermined, []);
  f.put('scripts/test.mjs', '// node:test vitest run\nconsole.log("done");\n');
  r = f.run(); assert.equal(r.status, 0); assert.deepEqual(r.report.findings, []); assert.equal(r.report.undetermined.length, 1);
});
test('missing exports cannot become complete coverage in either mode', t => {
  const f = fixture(t, { '.github/workflows/test.yml': workflow('vitest run') }, ['crypto-lab-example', 'crypto-lab-missing']);
  let r = f.run(); assert.equal(r.status, 2); assert.equal(r.stdout, ''); assert.match(r.stderr, /UNREAD.*partial export/);
  r = f.run('--partial-json'); assert.equal(r.status, 2); assert.equal(r.report.checked, 1);
  assert.equal(r.report.scope.complete, false); assert.equal(r.report.scope.discovered, 2);
  assert.equal(r.report.scope.unreadable[0].lab, 'crypto-lab-missing');
});
test('missing discovered source cannot silently classify as a clean lab', t => {
  const f = fixture(t, { '.github/workflows/test.yml': workflow('vitest run'), 'src/lib.rs': '#[test] fn control() {}' });
  fs.unlinkSync(path.join(f.lab, 'src/lib.rs')); fs.symlinkSync('missing.rs', path.join(f.lab, 'src/lib.rs'));
  let r = f.run(); assert.equal(r.status, 2); assert.match(r.stderr, /UNREAD.*src\/lib.rs/);
  r = f.run('--partial-json'); assert.equal(r.status, 2); assert.equal(r.report.scan.complete, false);
  assert.equal(r.report.scan.unreadable[0].lab, 'crypto-lab-example');
});
