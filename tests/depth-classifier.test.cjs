const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { renderedLocals } = require('../tools/depth-audit.js');

test('rendered locals preserve simple and destructured assignments without crediting ordinary values', () => {
  assert.deepEqual([...renderedLocals(`
    const label = await page.locator('#out').textContent();
    let {first, second} = await panel.allTextContents();
    var $value = await input.inputValue();
    const ordinary = compute();
    const other = 'a constant';
  `)], ['label', 'first', 'second', '$value']);
  assert.deepEqual([...renderedLocals('const missing;\npage.textContent();')], []);
  assert.deepEqual([...renderedLocals('const {aliased: local} = page.textContent();')], []);
});

test('displayed-claim classification handles blanked comments and preserves computed versus literal controls', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-classifier-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const tools = path.join(__dirname, '../tools');
  fs.cpSync(tools, path.join(root, 'tools'), { recursive: true,
    filter: source => !source.includes(`${path.sep}node_modules`) });
  const source = path.join(root, '.scratch/crypto-lab-fixture/tests');
  fs.mkdirSync(source, { recursive: true });
  const spec = path.join(source, 'claims.test.js');
  const run = text => {
    fs.writeFileSync(spec, text);
    const proc = spawnSync(process.execPath, ['-e', `
      const {classify,walk}=require('./tools/depth-audit.js');
      console.log(JSON.stringify(classify('crypto-lab-fixture',walk('.scratch/crypto-lab-fixture'))));
    `], { cwd: root, encoding: 'utf8', timeout: 20000 });
    assert.equal(proc.error, undefined, `classifier must finish, not omit source: ${proc.error}`);
    assert.equal(proc.status, 0, proc.stderr);
    return JSON.parse(proc.stdout);
  };
  // This resembles the real failure: the lexer blanks a long block comment
  // between const and a non-page assignment. The old regexp exceeds the budget.
  const padding = 'const /*' + 'x'.repeat(200000) + '*/ setup = 1;\n';
  const positive = run(padding + `const observed = page.textContent();\nexpect(observed).toEqual(expectedDigest);`);
  assert.equal(positive.dims.C, '+');
  assert.equal(positive.evidence.C, 'tests/claims.test.js:3');
  const ordinary = run(padding + `const observed = compute();\nexpect(observed).toEqual(expectedDigest);`);
  assert.equal(ordinary.dims.C, '0');
  const literal = run(padding + `const observed = page.textContent();\nexpect(observed).toEqual('fixed wording');`);
  assert.equal(literal.dims.C, '0');
  const destructured = run(`const {observed, count} = page.allTextContents();\nexpect(observed).toEqual(expectedDigest);`);
  assert.equal(destructured.dims.C, '+');
});
