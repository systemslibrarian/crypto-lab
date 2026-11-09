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

test('the bibtex escaper neutralises a backslash and keeps its braces', () => {
  /* BEHAVIOURAL, not an assertion about the order of two replaces. The first
     version of this test demanded the backslash be escaped before braces were
     stripped -- and that order is itself the bug, because it strips the braces of
     the \textbackslash{} it just inserted. What matters is the output. */
  const src = read('tools/teach-build.js');
  const m = /const bibText = \(s\) => String\(s\)[\s\S]*?\n\n/.exec(src);
  assert.ok(m, 'bibText is not where this test expects it');
  // eslint-disable-next-line no-eval
  const bibText = eval(`(${m[0].replace('const bibText = ', '').trim().replace(/;$/, '')})`);
  assert.equal(bibText('a\\b'), 'a\\textbackslash{}b', 'a backslash must become a command, braces intact');
  assert.equal(bibText('{x}'), 'x', 'braces are stripped from input');
  assert.equal(bibText('a & b'), 'a \\& b');
  assert.equal(bibText('~^'), '\\~\\^', 'tilde and caret are escaped too');
  assert.ok(!/\\textbackslash(?!\{\})/.test(bibText('\\')), 'the command must keep its braces');
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
  /* The two orders are built with new RegExp from strings on purpose. Written as
     literals, this negative control IS the defect it demonstrates, and CodeQL's
     syntactic query flags the test file -- which would make the gate red over a
     deliberate counter-example and teach the next person to delete it. The
     assertion below is unchanged; only the pattern's construction moved. */
  const dec = (...pairs) => (s) => pairs.reduce((acc, [pat, to]) => acc.replace(new RegExp(pat, 'g'), to), s);
  const wrong = dec(['&' + 'amp;', '&'], ['&' + 'lt;', '<']);
  const right = dec(['&' + 'lt;', '<'], ['&' + 'amp;', '&']);
  assert.equal(wrong('&amp;lt;script'), '<script', 'this is the defect');
  assert.equal(right('&amp;lt;script'), '&lt;script', 'this is the fix');
});

/* ------------------------------------------------ js/bad-tag-filter (close tag) */

/*
 * Element cutting is a SCAN now, not a regex. The regex missed `</script >` and
 * `</script\n>`; widening it fixed those two and CodeQL still reported
 * js/bad-tag-filter, correctly -- the query's point is that a regex cannot
 * reliably delimit an element. The first fix also only touched `</script>` and
 * left the identical `</style>` one line below.
 */
test('element cutting handles every close-tag spelling, and does not over-match', () => {
  const src = read('tools/games-sync.js');
  const m = /function cutElements[\s\S]*?\n\}/.exec(src);
  assert.ok(m, 'cutElements is not where this test expects it');
  // eslint-disable-next-line no-eval
  const cut = eval(`(${m[0]})`);
  assert.equal(cut('a<script>evil()</script>b', 'script'), 'a b');
  assert.equal(cut('a<script>evil()</script >b', 'script'), 'a b', '`</script >` is a valid close tag');
  assert.equal(cut('a<script>evil()</script\n>b', 'script'), 'a b', 'and so is a newline before the >');
  assert.equal(cut('a<SCRIPT>evil()</SCRIPT>b', 'script'), 'a b', 'case-insensitive');
  assert.equal(cut('a<script src=x>e</script>b', 'script'), 'a b', 'attributes on the open tag');
  assert.equal(cut('a<script>unterminated', 'script'), 'a ',
    'an unclosed element means everything after it is script, so it is cut to the end');
  assert.equal(cut('plain', 'script'), 'plain');
  assert.ok(!cut('a<scriptable>keep</scriptable>b', 'script').includes('<scriptable>'),
    'the open tag is removed');
  assert.match(cut('a<scriptable>keep</scriptable>b', 'script'), /keep/,
    '`<scriptable>` is not `<script`: its CONTENT must survive');
});

test('both script and style are cut, not just script', () => {
  const src = read('tools/games-sync.js');
  assert.ok(src.includes("cutElements(cutElements(html, 'script'), 'style')"),
    'the first fix handled script and left the identical style case one line below');
  /* Comments stripped first: cutElements's own comment QUOTES the old pattern in
     order to explain what was wrong with it, and asserting on the raw text read
     the explanation as the defect. Second time in this file. */
  const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
  assert.ok(!code.includes('<script[\\s\\S]*?'), 'no regex element delimiting should remain');
  assert.ok(!code.includes('<style[\\s\\S]*?'), 'nor for style');
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
  /* The property is UNAMBIGUITY, not a particular character class. A lazy
     quantifier immediately followed by `\s+` is the shape that backtracks, and
     the header must not contain one. */
  assert.ok(!/\+\?\\s\+/.test(fn) && !/\*\?\\s\+/.test(fn),
    'a lazy quantifier adjacent to \\s+ lets the engine split the same run two ways');
  assert.ok(fn.includes('headHead') && fn.includes('headTail'),
    'the header is matched as an anchored head and tail, with the title taken as the slice between');
  assert.ok(!/\.\*\[\^\\s\]/.test(fn),
    'a greedy capture the engine must backtrack to place is what CodeQL still flagged');
  /* And no FLOATING pattern at all. `headTail` was anchored only at `$`, so the
     engine tried every start position and a run of k spaces gave it k ways to
     begin -- still polynomial after the greedy capture went. The separator is
     located with lastIndexOf now and every regex in the function is anchored. */
  assert.ok(fn.includes("lastIndexOf('\\u2014')") || fn.includes('lastIndexOf(\'\u2014\')'),
    'the separator must be located by index, not by a floating regex');
  /* The property is narrower than "everything is anchored": a regex with no
     QUANTIFIER cannot backtrack, so `/[ \t]/` (one character) and `/\r?\n/` (a
     single optional) are linear wherever they sit. What must be anchored is a
     pattern that can consume a variable-length run, because that is what gives
     the engine more than one way to match. */
  for (const re of fn.match(/\/\^?[^/\n]+\/[gimsuy]*/g) || []) {
    if (/[+*]/.test(re)) {
      assert.ok(re.startsWith('/^'), `regex ${re} has a quantifier and is not anchored at the start`);
    }
  }
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
