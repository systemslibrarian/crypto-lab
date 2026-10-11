const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const { spawnSync } = require('node:child_process');
const { lex } = require('../tools/catalog-evidence.js');

test('suffix handling preserves the existing regex, division and comment decisions', () => {
  const filename = require.resolve('../tools/catalog-evidence.js');
  const current = fs.readFileSync(filename, 'utf8');
  const historical = current.replace('emitted.trimEnd()', "emitted.replace(/\\s+$/, '')");
  assert.notEqual(historical, current, 'the control must restore the previous suffix operation');
  const control = new Module(filename, module);
  control.filename = filename;
  control.paths = module.paths;
  control._compile(historical, filename);
  const examples = [
    `const text = 'https://example.org/path'; // a comment\nconst result = /"/.test(text);`,
    `const quotient = numerator /* gap */ / denominator;`,
    `const quotient = (numerator) / denominator;`,
    `const quotient = values[0]\u00a0\u2028 / denominator;`,
    `const match = /* spaces */ /["/]/g; // literal quote and slash\nmatch.test('a');`,
    'const label = `value ${(() => { return /x/.test(value); })()}`;',
    `const label = "/* literal */"; const matcher = /https?:\\/\\//;`,
    `/* nothing emitted yet */ /first/.test(value);`,
  ];
  for (const example of examples) assert.deepEqual(lex(example), control.exports.lex(example), example);
});

test('blanked comment prefixes cannot stall later regex or division reads', () => {
  const proc = spawnSync(process.execPath, ['-e', `
    const {lex}=require(${JSON.stringify(require.resolve('../tools/catalog-evidence.js'))});
    const padding='/*'+'x'.repeat(200000)+'*/';
    const source='const value=1; '+padding+' const matcher=/"/.test(text);\\n'
      +'const divided=value '+padding+' / denominator;\\n';
    const views=lex(source);
    console.log(JSON.stringify({sameLength:views.code.length===source.length,
      lines:views.code.split('\\n').length,
      matcher:views.strings.includes('/ /'), divided:views.code.includes('/ denominator'),
      comments:views.inert.includes('x'.repeat(100))}));
  `], { encoding: 'utf8', timeout: 4000 });
  assert.equal(proc.error, undefined, `source must remain readable within the budget: ${proc.error}`);
  assert.equal(proc.status, 0, proc.stderr);
  assert.deepEqual(JSON.parse(proc.stdout), {sameLength: true, lines: 3,
    matcher: true, divided: true, comments: true});
});
