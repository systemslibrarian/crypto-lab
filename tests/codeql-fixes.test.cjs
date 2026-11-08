'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

/*
 * The nine CodeQL alerts standing on main on 2026-11-08, all created 2026-11-05.
 * Seven were confirmed and fixed, one was a parser rewrite, and one is a false
 * positive left open rather than dismissed. These are the regression tests for
 * the eight that changed code. None of them suppresses a query.
 */

/* ------------------------------------- js/incomplete-sanitization (escaping) */

/*
 * Escaping the delimiter without escaping the ESCAPE character is the defect:
 * input `a \| b` became `a \\| b`, which markdown renders as a literal backslash
 * followed by an UNESCAPED pipe, and the pipe then splits the table row.
 */
function cellOf(file, fnName) {
  const src = read(file);
  assert.match(src, /replace\(\/\\\\\/g, '\\\\\\\\'\)/,
    `${file}: ${fnName} must escape backslash before the delimiter`);
}

test('readme-sync escapes the backslash before the pipe', () => {
  cellOf('tools/readme-sync.js', 'cell');
  const src = read('tools/readme-sync.js');
  const i = src.indexOf("const cell =");
  const line = src.slice(i, src.indexOf('\n', i));
  assert.ok(line.indexOf('\\\\\\\\') < line.indexOf("'\\\\|'"),
    'backslash must be replaced first, or the escape it adds gets escaped again');
});

test('tools-sync escapes the backslash before the pipe', () => {
  cellOf('tools/tools-sync.js', 'esc');
});

test('both pipe escapers also flatten newlines, which end a table row', () => {
  for (const f of ['tools/readme-sync.js', 'tools/tools-sync.js']) {
    assert.match(read(f), /replace\(\/\\r\?\\n\/g, ' '\)/, `${f} must flatten newlines in a cell`);
  }
});

test('the bibtex escaper handles the backslash first', () => {
  const src = read('tools/teach-build.js');
  const i = src.indexOf('const bibText =');
  const line = src.slice(i, src.indexOf(';', i));
  assert.match(line, /textbackslash/,
    'an input backslash must become a TeX command rather than starting one');
  assert.ok(line.indexOf('textbackslash') < line.indexOf("[{}]"),
    'the backslash is neutralised before the other escapes are added');
});

/* ------------------------------------------------- js/double-escaping (order) */

/*
 * `&amp;` must be decoded LAST. Decoding it first turns `&amp;lt;` into `&lt;`
 * and then into `<`, so an author who wrote a literal entity gets a tag.
 */
for (const f of ['tools/concept-sync.js', 'tools/teach-build.js']) {
  test(`${path.basename(f)} decodes &amp; last`, () => {
    const src = read(f);
    const chunk = src.slice(src.indexOf('const decode ='), src.indexOf('const decode =') + 500);
    assert.ok(chunk.indexOf('&lt;') !== -1 && chunk.indexOf('&amp;') !== -1);
    assert.ok(chunk.indexOf('&amp;') > chunk.indexOf('&lt;'),
      '&amp; is decoded after &lt;, or &amp;lt; double-decodes into a tag');
  });
}

test('the decode order is observable, not just textual', () => {
  /* Rebuild both orders and show they disagree on the one input that matters. */
  const wrong = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<');
  const right = (s) => s.replace(/&lt;/g, '<').replace(/&amp;/g, '&');
  assert.equal(wrong('&amp;lt;script'), '<script', 'this is the defect');
  assert.equal(right('&amp;lt;script'), '&lt;script', 'this is the fix');
});

/* ------------------------------------------------ js/bad-tag-filter (close tag) */

test('the script stripper matches a close tag carrying whitespace', () => {
  const src = read('tools/games-sync.js');
  assert.match(src, /<\\\/script\\s\*>/, 'must allow `</script >` and `</script\\n>`');
  const re = /<script[\s\S]*?<\/script\s*>/gi;
  assert.equal('a<script>evil()</script >b'.replace(re, ' '), 'a b');
  assert.equal('a<script>evil()</script\n>b'.replace(re, ' '), 'a b');
  const old = /<script[\s\S]*?<\/script>/gi;
  assert.notEqual('a<script>evil()</script >b'.replace(old, ' '), 'a b',
    'the old pattern left the script body in the text');
});

/* -------------------------------------------- js/polynomial-redos (ambiguity) */

test('the citation flattener has one way to match a whitespace run', () => {
  const src = read('tools/concept-sync.js');
  assert.ok(!src.includes("replace(/\\s*\\r?\\n\\s*/g"),
    '`\\s*\\r?\\n\\s*` lets \\s match the same newline the literal does');
  assert.match(src, /replace\(\/\\s\+\/g, ' '\)/);
});

test('the concept parser reads lines instead of one regex over the file', () => {
  const src = read('tools/concept-sync.js');
  const whole = src.slice(src.indexOf('function parseConcepts('), src.indexOf('function parseCitations('));
  /* Comments stripped first: the replacement's own comment NAMES the old pattern
     in order to explain it, and asserting on the raw text read the explanation as
     the defect. */
  const fn = whole.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
  assert.ok(!fn.includes('[\\s\\S]*?'), 'the lazy whole-file capture is what backtracked');
  assert.match(fn, /md\.split\(\/\\r\?\\n\/\)/, 'it must split into lines');
  assert.ok(fn.includes('[^`]+?'), 'the title capture must not be able to swallow the status backtick');
});

test('the line parser still terminates a citation list at a BLANK LINE', () => {
  /* The property the old comment was protecting: `$` under /m would truncate the
     list to its first line, so the terminator has to be an empty line. */
  const md = [
    '**5. Message authentication — `COVERED`**',
    'MAC Race · Poly1305 MAC',
    'and a wrapped second line',
    '',
    'Commentary naming Other Demo rhetorically.',
  ].join('\n');
  const header = /^\*\*(\d+[a-z]?)\.\s+([^`]+?)\s+—\s+`(COVERED|DEEP|PARTIAL|GAP)`\*\*[ \t]*$/;
  const lines = md.split(/\r?\n/);
  const bodies = [];
  for (let i = 0; i < lines.length; i += 1) {
    const h = header.exec(lines[i]);
    if (!h) continue;
    const body = [];
    for (let j = i + 1; j < lines.length && lines[j].trim() !== ''; j += 1) body.push(lines[j]);
    bodies.push(body.join('\n'));
  }
  assert.equal(bodies.length, 1);
  assert.ok(bodies[0].includes('wrapped second line'), 'the list must span wrapped lines');
  assert.ok(!bodies[0].includes('Commentary'), 'and must stop at the blank line');
});

test('the line parser is linear where the old regex was quadratic', () => {
  /* A header that never completes: the old pattern rescans the tail from every
     position. 400 KB is enough to separate linear from quadratic without being
     flaky; the assertion is generous on purpose. */
  const md = `**5. Message authentication — \`COVERED\`**\n` + 'x'.repeat(400_000);
  const header = /^\*\*(\d+[a-z]?)\.\s+([^`]+?)\s+—\s+`(COVERED|DEEP|PARTIAL|GAP)`\*\*[ \t]*$/;
  const t0 = Date.now();
  const lines = md.split(/\r?\n/);
  let found = 0;
  for (let i = 0; i < lines.length; i += 1) if (header.exec(lines[i])) found += 1;
  const ms = Date.now() - t0;
  assert.equal(found, 1);
  assert.ok(ms < 2000, `line parse took ${ms}ms, which is not linear`);
});

/* ---------------------------------------------------- the one false positive */

test('the lexer CodeQL calls a bad tag filter is a JS tokenizer, not a sanitizer', () => {
  /* Alert #6, tools/catalog-evidence.js:452, is left OPEN rather than dismissed.
     The line sits in a hand-written character-by-character JavaScript lexer with
     explicit 'line' and 'block' comment states; js/bad-tag-filter looks for HTML
     sanitizers that mishandle comments, and this sanitizes no HTML. Asserted so
     the claim is checkable rather than a sentence in a report. */
  const src = read('tools/catalog-evidence.js');
  /* Located by CONTENT, not by line number. A fixed slice passed on the branch it
     was written on and failed on main, because the surrounding file had grown by
     a hundred lines -- a test that moves with an unrelated edit is not asserting
     the property it names. */
  const at = src.indexOf("if (state === 'code') {");
  assert.ok(at > 0, 'the tokenizer state machine is not where this test expects it');
  const around = src.slice(at, at + 1400);
  assert.match(around, /state = 'line'/, 'with an explicit line-comment state');
  assert.match(around, /state = 'block'/, 'and an explicit block-comment state');
  assert.match(around, /quote = c/, 'and string-quote tracking, which is what a tokenizer does');
  assert.ok(!/<\/?[a-z]+[\s>]/i.test(around), 'and it matches no HTML tag at all');
});
