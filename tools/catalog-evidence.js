#!/usr/bin/env node
/*
 * catalog-evidence.js — derive each lab's algorithm facts from its own source,
 * with a file:line anchor behind every claim.
 *
 * Run: node tools/catalog-evidence.js verify
 * Prevents: the catalog asserting a lab implements an algorithm its source does not
 * Reads: ../crypto-lab-<slug>/ clones (code, READMEs) — from the WORKING TREE when clean and from
 *        `git archive HEAD` when dirty, see clone-source.js — plus local HEAD + `ls-remote origin HEAD`;
 *        index.html; catalog-vocab.js; catalog-reviewed.json
 *
 * It reads the sibling clones, so like deploy-sync and fleet-sync it is NOT in
 * the fast loop. `catalog-sync.js` needs none of this: the facts it generates
 * CATALOG.md from are stored on the cards, and this tool is how they get there
 * and how they are re-checked afterwards.
 *
 * A MENTION IS NOT AN IMPLEMENTATION
 *
 * The whole difficulty is that every one of these labs is ABOUT cryptography, so
 * every algorithm name appears in every lab that discusses it. Grepping for "AES"
 * and calling the result an implementation would produce a reverse index where
 * the answer to "which labs implement AES?" is "most of them", which is worse
 * than no index: it reads as a finding.
 *
 * So a term is only IMPLEMENTED when it appears in one of three shapes that mean
 * the code computes something:
 *
 *   call    the term is the algorithm argument of a WebCrypto call, or is an
 *           identifier being invoked            crypto.subtle.sign('HMAC', ...)
 *   path    the FILE is named for the algorithm and declares something
 *                                                        src/misty1/misty1.ts
 *   protocol  the lab builds or parses that PROTOCOL's own message structures
 *                                                        function buildClientHello(
 *   import  the term is in a module path being imported  from '@noble/hashes/sha256'
 *   decl    the term is in the name of a function, class or const being declared
 *                                                        function aesGcmEncrypt(
 *
 * Everything else is a MENTION, and a term found only in mentions is REFERENCED,
 * never implemented. crypto-lab-hqc-timing is the case that proves the
 * distinction earns its keep: it is entirely about HQC's decoder and implements
 * neither HQC nor a decoder — its README says so outright, "an abstract timing
 * model — not a real BCH decoder". Under a grep it is an HQC implementation.
 *
 * COMMENTS ARE BLANKED BEFORE ANY OF THIS. A line inside a block comment can
 * otherwise match `decl` perfectly, and these labs are heavily commented with
 * exactly the algorithm names being searched for. Blanking preserves the line
 * numbering, so anchors stay true.
 *
 * WHAT IT CANNOT ESTABLISH IT SAYS IT CANNOT
 *
 * A lab whose crypto matches no vocabulary term and no shape gets UNKNOWN, not an
 * empty list. Empty reads as "implements nothing"; UNKNOWN reads as "this tool
 * could not tell", and they are different facts. Unmatched chips are reported so
 * the vocabulary grows on purpose rather than by being wrong quietly.
 *
 * USAGE
 *   node tools/catalog-evidence.js                 report what it derives, write nothing
 *   node tools/catalog-evidence.js --lab <slug>    just one lab, with every anchor
 *   node tools/catalog-evidence.js write           write the derived fields onto the cards
 *   node tools/catalog-evidence.js verify          re-read every anchor already on a card
 *   node tools/catalog-evidence.js gaps            chips the vocabulary has never heard of
 *   node tools/catalog-evidence.js --json          machine-readable
 *
 * `verify` is the one that matters over time: an anchor is a line number, and
 * line numbers rot. It re-opens each anchored file and fails when the algorithm
 * is no longer at that line, which is the difference between evidence and
 * decoration.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ALGORITHMS, ATTACKS } = require('./catalog-vocab.js');
const { sourceRoot, summary: cloneSummary, tornSnapshot, trackedFiles, isTracked, forget: forgetTracked } = require('./clone-source.js');
const PROTOCOL_TERMS = ALGORITHMS.filter((t) => t.structures);

const ROOT = path.join(__dirname, '..');
const REPOS = path.join(ROOT, '..');
const HTML = path.join(ROOT, 'index.html');
// Human review covers source shapes the conservative JS/TS scanner cannot prove.
// Each review is pinned to a lab commit; a changed lab must be reviewed again.
const REVIEWS = require('./catalog-reviewed.json');

const CODE_EXT = /\.(ts|js|mjs|cjs|tsx|jsx)$/;
/* Languages this scanner does NOT read. Not a wish list — the labs that use them.
 * crypto-lab-silent-tally implements its field arithmetic in Rust and exposes it
 * through a WASM binding, so its src-ts/ is a wrapper and every algorithm is in
 * the .rs files. Reading the wrapper and reporting UNKNOWN says "nothing there"
 * about source that was never opened. That is protection-census's mistake exactly:
 * a 404 from the one endpoint you asked, published as absence. */
const UNREAD_LANGS = [
  { name: 'Rust', re: /\.rs$/ },
  { name: 'Go', re: /\.go$/ },
  { name: 'Python', re: /\.py$/ },
  { name: 'C/C++', re: /\.(c|cc|cpp|h|hpp)$/ },
  { name: 'Java', re: /\.java$/ },
  { name: 'C#', re: /\.cs$/ },
  { name: 'Swift', re: /\.swift$/ },
  { name: 'WebAssembly', re: /\.(wasm|wat)$/ },
];
const SKIP = /(^|\/)(node_modules|dist|build|\.git|test-results|playwright-report|coverage|\.vite|target|pkg)(\/|$)/;
/* Tests and e2e are the lab's checks on itself, not the lab. A spec that asserts
   an AES vector is evidence the suite knows about AES, not that the demo does. */
const NOT_THE_LAB = /(^|\/)(e2e|tests?|__tests__|scripts|contrast)(\/|$)|\.(spec|test)\.[tj]sx?$/;
/* Vendored bundles are somebody else's code, and minified code is one line: an
   anchor into it points at a line of 400KB and proves nothing about this lab.
   A .d.ts DECLARES an external library's shape and implements none of it —
   crypto-lab-sm2-forge's sm-crypto.d.ts is a type stub for a dependency. */
const NOT_THIS_LABS_CODE = /(^|\/)(vendor|vendored|third[-_]party|public\/lib)(\/|$)|\.min\.[tj]sx?$|\.d\.ts$/;

/* The files a FRESH CLONE would have, never what happens to be on this disk.
 *
 * This used to walk directories, and `git status --porcelain` does not report
 * IGNORED files, so a clone holding a gitignored file read as clean and the walk
 * opened it. On 2026-09-30 that credited labs with BB84, E91, OPAQUE and PQXDH
 * out of a gitignored CRYPTO-LAB-TEMPLATE.md, and emitted anchors into it that
 * resolve on this machine and nowhere else.
 *
 * `clone` is the real repository (git answers about it); `readRoot` is where the
 * bytes come from, which is the same directory for a clean clone and a HEAD
 * export for a dirty one. A tracked path exists under both. */
/* Has this lab moved in a way a SOURCE REVIEW would have to read again?
 *
 * Same scope as tools/corpus-freshness.js, deliberately: commits touching
 * README.md or src/. A pin records a person's reading of the lab's source, and
 * a commit that changes neither its source nor its README has not invalidated
 * that reading.
 *
 * Measured, not assumed. On 2026-09-30 a fleet-wide `chat.md` / `.gitignore`
 * batch moved every clone's HEAD by one commit and turned 23 pins stale at once.
 * Twenty-two of those 23 had changed ZERO README or src files - the median diff
 * was +1/-0 - and the only lab with real movement was crypto-lab-sm9-forge, at
 * 14 files and +3148/-698. A rule that calls all 23 stale buries the one that
 * matters, and it does worse than that here: writeCards leaves a stale lab's
 * card byte-identical, so an unrelated one-line commit FREEZES a card holding
 * claims that need correcting.
 *
 * `null` from git is treated as moved: could not look is never "nothing changed". */
function movedSubstantively(dir, from, to) {
  try {
    const out = execFileSync('git', ['-C', dir, 'diff', '--name-only', `${from}..${to}`], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024,
    });
    return out.split('\n').filter(Boolean).some((f) => f === 'README.md' || f.startsWith('src/'));
  } catch {
    return true;
  }
}

function labFilePaths(clone, readRoot) {
  const tracked = trackedFiles(clone);
  if (tracked === null) return null;          // could not look — never "no files"
  const out = [];
  for (const rel of tracked) {
    const p = path.join(readRoot, rel);
    if (SKIP.test(p)) continue;
    if (!fs.existsSync(p)) continue;          // tracked but absent from a HEAD export
    out.push(p);
  }
  return out;
}

/** One pass over a file, tracking comments and strings TOGETHER.
 *
 * Two passes cannot work, and the way they fail is quiet. Blanking comments
 * first sees the `//` inside `"https://en.wikipedia.org/..."` as the start of a
 * line comment and blanks the rest of that line — including the quote that
 * closes the string. Every quote after it is then parsed with the wrong parity,
 * the template literal holding a lab's HTML is no longer recognised as a string,
 * and its PROSE is offered to the code tests as bare code. That is exactly how
 * crypto-lab-hybrid-sign came to claim it implements P-256: the claim's anchor
 * was a line of documentation inside a <pre> block listing TLS codepoints.
 *
 * Returns both views, from the same walk, so they cannot disagree:
 *   strings  comments blanked, string literals INTACT  (imports, WebCrypto names)
 *   code     comments AND string contents blanked      (declarations, calls)
 *
 * Newlines are preserved in both, so a line number is a line number.
 */
/** Is a `/` here the start of a regex literal, or a division sign?
 *
 * The classic JavaScript lexing problem, and not academic here: line 57 of
 * crypto-lab-hybrid-sign is `.replace(/"/g, '&quot;')`. Without this, the `"`
 * inside that regex opens a string that never closes where it should, every
 * quote in the file after it is parsed with the wrong parity, and 400 lines of
 * HTML in a template literal are offered to the code tests as bare code.
 *
 * The standard heuristic: after a value — an identifier, a number, a closing
 * bracket or paren — a slash is division. Anywhere else it opens a regex.
 */
function regexCanStartHere(emitted) {
  const prev = emitted.replace(/\s+$/, '').slice(-1);
  if (!prev) return true;
  return !/[\w$)\]]/.test(prev);
}

function lex(src) {
  let strings = '';
  let code = '';
  /* The third view: COMMENT BODIES ONLY. Not string contents - that was tried
     and it swallowed the rule whole, taking violations from 28 to 1, because
     these labs build their UI out of template literals full of prose naming
     algorithms. A name in a UI string is a lab TALKING about an algorithm; a
     name in a comment is code ANNOTATED with it, sitting beside the arithmetic
     it describes. Only the second is evidence that the scanner cannot tell. */
  let inert = '';
  const push = (inStrings, inCode, inInert) => { strings += inStrings; code += inCode; inert += (inInert === undefined ? (inCode === '\n' ? '\n' : ' '.repeat(inCode.length)) : inInert); };
  let i = 0;
  let state = 'code';
  let quote = '';
  let inClass = false;
  /* Template-literal nesting through ${ }, WITH the brace depth inside each
     interpolation. Without the depth, the first `}` of an arrow function or
     object literal inside `${...}` reads as the end of the interpolation, the
     lexer falls back into the template as if it were code, and the rest of the
     file is parsed one state out of step. */
  const stack = [];
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (state === 'code') {
      if (c === '/' && n === '/') { state = 'line'; push('  ', '  '); i += 2; continue; }
      if (c === '/' && n === '*') { state = 'block'; push('  ', '  '); i += 2; continue; }
      if (c === '/' && regexCanStartHere(code)) { state = 'regex'; inClass = false; push(c, c); i += 1; continue; }
      if (c === "'" || c === '"' || c === '`') { state = 'string'; quote = c; push(c, c); i += 1; continue; }
      if (c === '{' && stack.length) { stack[stack.length - 1].depth += 1; push(c, c); i += 1; continue; }
      if (c === '}' && stack.length) {
        const top = stack[stack.length - 1];
        if (top.depth === 0) { stack.pop(); state = 'string'; quote = top.quote; push(c, c); i += 1; continue; }
        top.depth -= 1; push(c, c); i += 1; continue;
      }
      push(c, c); i += 1; continue;
    }
    if (state === 'line') {
      if (c === '\n') { state = 'code'; push('\n', '\n'); i += 1; continue; }
      push(' ', ' ', c); i += 1; continue;
    }
    if (state === 'regex') {
      if (c === '\\') { push('  ', '  '); i += 2; continue; }
      if (c === '[') inClass = true;
      else if (c === ']') inClass = false;
      else if (c === '/' && !inClass) { state = 'code'; push(c, c); i += 1; continue; }
      else if (c === '\n') { state = 'code'; push('\n', '\n'); i += 1; continue; }
      push(' ', ' '); i += 1; continue;
    }
    if (state === 'block') {
      if (c === '*' && n === '/') { state = 'code'; push('  ', '  '); i += 2; continue; }
      push(c === '\n' ? '\n' : ' ', c === '\n' ? '\n' : ' ', c); i += 1; continue;
    }
    // inside a string literal
    if (c === '\\') { push(src.slice(i, i + 2), '  '); i += 2; continue; }
    if (quote === '`' && c === '$' && n === '{') { stack.push({ quote, depth: 0 }); state = 'code'; push('${', '${'); i += 2; continue; }
    if (c === quote) { state = 'code'; push(c, c); i += 1; continue; }
    if (c === '\n') { push('\n', '\n'); i += 1; continue; }
    push(c, ' ', ' '); i += 1;
  }
  return { strings, code, inert };
}

/** Inline <script> bodies are code; the rest of an HTML file is prose. */
function splitHtml(src) {
  let code = '';
  let prose = '';
  const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let last = 0;
  let m;
  while ((m = re.exec(src)) !== null) {
    const before = src.slice(last, m.index);
    prose += before;
    code += before.replace(/[^\n]/g, ' ');
    const head = m[0].slice(0, m[0].indexOf('>') + 1);
    prose += head.replace(/[^\n]/g, ' ') + m[1].replace(/[^\n]/g, ' ');
    code += head.replace(/[^\n]/g, ' ') + m[1];
    last = m.index + m[0].length - '</script>'.length;
    prose += '';
  }
  prose += src.slice(last);
  code += src.slice(last).replace(/[^\n]/g, ' ');
  return { code, prose };
}

/** Identifiers that present rather than compute. */
const PRESENTS = /^(?:render|draw|paint|format|describe|explain|label|display|chart|plot|tooltip|caption|legend|summar|narrat|annotate)/i;

/* A declaration whose VALUE is a projection does not compute the algorithm it is
   named after. PRESENTS catches the function that draws a thing; this catches the
   constant that models one.

   crypto-lab-export-grade was credited with implementing AES on the strength of

       const aes128 = extrapolate(128, rate.candidatesPerSecond, multiplier);

   which holds an extrapolation of the learner's own measured brute-force rate out
   to a 128-bit keyspace. The lab implements no AES - Exhibit 6 plots published
   results from a citation table. `aes128` camel-splits to "aes 128", `\baes\b`
   matches, and the declaration shape does the rest. This is mentions-as-
   implementations arriving through a VARIABLE NAME, the one route the string-
   blanking lexer cannot see, because the name is executable code.

   It keys on the INITIALISER, not on the identifier. The obvious rule - "an
   identifier that is the algorithm name plus a key size is a table row" - was
   written first and measured: it moved 21 anchors across 18 labs and removed no
   false claim anywhere, because `hmacSha256`, `shake128`, `mlKem768` and
   `keccakF1600` all end in digits that are part of the STANDARD INSTANCE NAME.
   The vocabulary's canonical term is the family; real code names the parameter
   set. Suppressing on digits demotes those labs to a worse anchor - frodo-vault's
   ML-KEM moved from src/frodo-kem.ts to src/main.ts - to fix nothing. That
   variant is recorded here so it is not rediscovered and retried. */
const MODELS = /^(?:extrapolat|estimat|project|predict|forecast|budget|scale|assume)/i;

/** Split camelCase and PascalCase so `\b` anchored terms can reach inside an
 * identifier. `toyCkks`, `lweSample` and `encryptMisty1CoreRounds` are all
 * implementations whose algorithm name has no word boundary in front of it, and
 * every one of them read as UNKNOWN until this existed — a lab implementing
 * MISTY1 in a file called misty1.ts, reported as implementing nothing. */
function camelSplit(text) {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d)/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

/** Does this line build or parse one of the protocol's own message structures?
 *
 * Checked OUTSIDE the term-regex gate, which is the whole point and was the bug
 * the first time: `buildClientHello` contains no substring "TLS 1.3", so a gate
 * that first requires the term's own pattern to match the line can never reach
 * this. Protocol identity exists precisely where the protocol's NAME is absent.
 *
 * Narrow on purpose: a lab that IMPLEMENTS a protocol declares its message
 * types, while a lab that MODELS an attack on one declares runAttack and llr.
 * Keying on the repo slug instead would manufacture the exact false claim just
 * removed from four cards - crypto-lab-hqc-timing has "hqc" in its name and
 * implements none of it. */
const flatten = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '');

/* Verbs that act on a structure without renaming it. */
const VERBS = new Set(['build', 'make', 'create', 'new', 'encode', 'decode', 'parse',
  'read', 'write', 'serialize', 'serialise', 'deserialize', 'deserialise', 'format',
  'to', 'from', 'get', 'set', 'is', 'as', 'the', 'a', 'an', 'raw', 'inner', 'outer']);

function structuresNamed(code, term) {
  if (!term.structures) return [];
  const ids = [
    ...[...code.matchAll(/(?:^|[\s;{(,])(?:async\s+)?(?:function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g)].map((x) => x[1]),
    ...[...code.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)].map((x) => x[1]),
    ...[...code.matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)].map((x) => x[1]),
  ];
  /* Whole camel TOKENS in contiguous order, never a substring. Substring
     matching put `Envelope` (an OPAQUE message) on an ECIES lab, `LeafNode` (an
     MLS one) on an LMS hash tree, and `OpenBase` on a variable called
     openBaseline - 38 findings, almost all nonsense. `buildClientHello` splits
     to [build, client, hello] and contains [client, hello] in order; that is a
     match and `openBaseline` is not. */
  const toks = (t) => camelSplit(t).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const out = [];
  for (const st of term.structures) {
    const r = toks(st);
    for (const id of ids) {
      const a = toks(id);
      const at = a.findIndex((_, k) => r.every((w, m) => a[k + m] === w));
      if (at < 0) continue;
      /* The tokens BEFORE the match, so a caller can see whether every hit in a
         lab shares one foreign prefix. crypto-lab-pake-gate names SRP-6a's two
         messages `srpClientHello` and `srpServerHello`: two distinct TLS
         structures by name, neither of them TLS. `build` in `buildClientHello`
         is a verb and varies; `srp` is another protocol and does not. */
      /* Leading VERBS are stripped before the prefix is recorded. `encode` in
         `encodeClientHello` is an action performed on the protocol's own
         message; `srp` in `srpClientHello` is a different protocol wearing its
         name. Counting both as prefixes cost crypto-lab-downgrade-wire a true
         finding, because every one of its mentions is an encode or a decode. */
      const pre = a.slice(0, at).filter((t) => !VERBS.has(t)).join('-');
      out.push({ structure: st, prefix: pre });
      break;
    }
  }
  return out;
}

/* The three shapes, tested against ONE line of comment-blanked code.
 *
 * The decl and invoked-identifier tests read the line with string CONTENTS
 * blanked, because `scheme: 'HQC (Hamming Quasi-Cyclic)'` otherwise parses as the
 * identifier HQC being invoked, and that one line had crypto-lab-hqc-timing —
 * a lab whose README says it implements no decoder at all — claiming to
 * implement HQC. The import and WebCrypto tests deliberately DO read string
 * contents: a module path and an algorithm name are strings by nature. */
/* The BINDINGS of an import/require line, which is the only place a term's bare
   token is allowed to count. A module PATH is a vendor's product line and never
   evidence on its own: `sm-crypto` ships SM2, SM3 and SM4, and crediting the
   path put SM2 on crypto-lab-world-hashes, which imports only `sm3` from it.
   `symbolRe` is therefore tested against the imported NAME and never against the
   path, and terms without one are unaffected. */
function importedSymbols(line) {
  if (!/\b(?:import|require)\b/.test(line)) return [];
  const braces = /\{([^}]*)\}/.exec(line);
  if (!braces) return [];
  return braces[1].split(',').flatMap((b) => b.split(/\s+as\s+/)).map((b) => b.trim()).filter(Boolean);
}

/* Does this line name the term at all? The gate in front of shapeOf. A term with
   a `symbolRe` can also be named by an imported binding the line pattern cannot
   see: `import { sm3 } from '@li0ard/sm3'` survives neither `re` nor camelSplit,
   which turns `sm3` into `sm 3`. */
function namesTerm(line, camel, term) {
  if (term.re.test(line) || term.re.test(camel)) return true;
  return Boolean(term.symbolRe) && importedSymbols(line).some((n) => term.symbolRe.test(n));
}

function shapeOf(line, code, term) {
  /* import / require whose module path carries the term */
  const imports = [...line.matchAll(/(?:from\s*|require\(\s*|import\(\s*)['"]([^'"]+)['"]/g)].map((x) => x[1]);
  if (imports.some((p) => term.re.test(p) || term.re.test(camelSplit(p)))) return 'import';
  /* …or whose imported BINDINGS carry it. Reading only the path missed
     `import { x25519 } from '@noble/curves/ed25519'` — the module is named for
     one algorithm and exports another — and `import { sm3 as sm3Hash } from
     'sm-crypto'`, where the package name says nothing at all. Both are as direct
     an implementation as a call. */
  const names = importedSymbols(line);
  if (names.some((n) => term.re.test(n) || term.re.test(camelSplit(n))
    || (term.symbolRe && term.symbolRe.test(n)))) return 'import';
  /* WebCrypto: the term is a quoted algorithm name anywhere on a subtle line, or
     on the `name:` of an algorithm object. */
  const quoted = [...line.matchAll(/['"]([^'"]{2,40})['"]/g)].map((x) => x[1]);
  /* A WebCrypto algorithm object, not any object with a `name`. The bare
     `name:` test read `{ name: "HQC-128", bytes: 2249 }` — a row in a key-size
     TABLE — as crypto-lab-mceliece-gate implementing HQC. A real algorithm
     object carries one of WebCrypto's own parameter keys alongside the name. */
  const isSubtle = /crypto\.subtle\.\w+/.test(line)
    || (/\bname\s*:\s*['"]/.test(line)
      && /\b(?:hash|namedCurve|iv|length|salt|info|modulusLength|publicExponent|tagLength|counter|saltLength|iterations)\s*:/.test(line));
  if (isSubtle && quoted.some((q) => term.re.test(q))) return 'call';
  /* a declaration whose NAME carries the term */
  /* The `(?::[^=]+)?` is TypeScript's type annotation, and leaving it out was a
     silent systematic miss: `export const SECP256K1: FpPreset = {` declares
     secp256k1 and matched nothing, because the pattern wanted the `=` to follow
     the identifier directly. Every annotated const in the fleet was invisible. */
  const decl = /(?:^|[\s;{(,])(?:async\s+)?(?:function|class)\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]{1,80})?=/g;
  let d;
  while ((d = decl.exec(code)) !== null) {
    const id = d[1] || d[2];
    if (!id) continue;
    /* A function that DRAWS an algorithm does not compute it. `renderModuleLWE`
       paints a diagram of Module-LWE; reading it as an implementation is the
       same error as reading a mention, one layer in. */
    if (PRESENTS.test(id)) continue;
    /* `const aes128 = extrapolate(...)` - the name says AES, the value is a
       projection. Only the initialiser of THIS declaration is read. */
    const init = /=\s*([A-Za-z_$][\w$]*)\s*\(/.exec(code.slice(d.index + d[0].length - 1));
    if (init && MODELS.test(init[1])) continue;
    if (term.re.test(id) || term.re.test(camelSplit(id))) return 'decl';
  }
  /* an identifier carrying the term being invoked */
  const calls = [...code.matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)].map((x) => x[1]);
  if (calls.some((id) => term.re.test(id) || term.re.test(camelSplit(id)))) return 'call';
  return null;
}

/* A line that declares something executable, used with a path match. */
const DECLARES = /(?:^|[\s;{(,])(?:export\s+)?(?:async\s+)?function\s+[A-Za-z_$]|(?:^|[\s;{(,])class\s+[A-Za-z_$]/;

function labFiles(dir, clone = dir) {
  const files = labFilePaths(clone, dir);
  if (files === null) return { code: [], prose: [], unread: new Map(), unreadable: true };
  const code = [];
  const prose = [];
  const unread = new Map();
  for (const f of files) {
    const rel = path.relative(dir, f);
    if (NOT_THE_LAB.test(rel) || NOT_THIS_LABS_CODE.test(rel)) continue;
    for (const lang of UNREAD_LANGS) {
      if (lang.re.test(rel)) unread.set(lang.name, (unread.get(lang.name) || 0) + 1);
    }
    if (CODE_EXT.test(f)) code.push(rel);
    else if (/\.html?$/.test(f)) { code.push(rel); prose.push(rel); }
    else if (/\.md$/i.test(f)) prose.push(rel);
  }
  return { code, prose, unread };
}

/** Everything derivable about one lab. Never throws; a missing clone is a state. */
function evidenceFor(slug) {
  const dir = path.join(REPOS, slug);
  if (!fs.existsSync(path.join(dir, '.git'))) {
    /* A lab with no clone here is NOT-SCANNED, not UNKNOWN. UNKNOWN means every
       file this tool reads was read and nothing was derivable; this is the tool
       never having opened anything. Reporting the second as the first is the
       conflation the NOT-SCANNED state exists to end, and a newly carded lab -
       carded before it is cloned - is exactly where it shows up. */
    return {
      slug, cloned: false, implements: [], references: [], attacks: [], standards: [],
      implementation: 'UNKNOWN', unscanned: ['not cloned here'], notScanned: true,
      commentOnly: [], protocolPartial: [], staleReview: null,
    };
  }
  /* Read this lab's FILES from its committed state, never from another lane's
     half-finished edit. `dir` stays the clone for git commands below; `src` is
     where bytes come from. See tools/clone-source.js for the incident. */
  const src = sourceRoot(dir);
  if (src.from === 'refused') {
    return {
      slug, cloned: true, implements: [], references: [], attacks: [], standards: [],
      implementation: 'UNKNOWN', unscanned: [`dirty clone, HEAD unreadable (${src.dirty} paths)`], notScanned: true,
      commentOnly: [], protocolPartial: [], staleReview: null,
    };
  }
  const read = src.root;
  const { code, prose, unread, unreadable: cannotList } = labFiles(read, dir);
  if (cannotList) {
    return {
      slug, cloned: true, implements: [], references: [], attacks: [], standards: [],
      implementation: 'UNKNOWN', unscanned: ['git could not list tracked files'], notScanned: true,
      commentOnly: [], protocolPartial: [], staleReview: null,
    };
  }
  const hits = new Map();   // term name -> {shape, at}
  const mentions = new Map();
  const attackHits = new Map();
  const structureHits = new Map();
  const commentOnly = new Map();
  const libs = new Set();

  const record = (map, name, at, shape) => {
    if (!map.has(name)) map.set(name, { at, shape });
  };
  /* The anchor should point at the strongest evidence in the lab, not the first
     file the walk happened to open. A declaration says more than an import:
     `from './hqc'` proves a module is used, `function hqcDecode(` shows the work
     being done, and the anchor is there to be read by a person. */
  const RANK = { decl: 5, call: 4, protocol: 3, import: 2, path: 1 };
  const keepBest = (map, name, at, shape) => {
    const have = map.get(name);
    if (!have || RANK[shape] > RANK[have.shape]) map.set(name, { at, shape });
  };

  for (const rel of code) {
    let raw;
    try { raw = fs.readFileSync(path.join(read, rel), 'utf8'); } catch { continue; }
    const text = /\.html?$/.test(rel) ? splitHtml(raw).code : raw;
    const lexed = lex(text);
    const src = lexed.strings;
    if (/crypto\.subtle\./.test(src)) libs.add('WebCrypto');
    if (/@noble\//.test(src)) libs.add('@noble');
    if (/\.wasm\b|WebAssembly\./.test(src)) libs.add('WASM');
    const lines = src.split('\n');
    const codeLines = lexed.code.split('\n');
    const inertLines = lexed.inert.split('\n');
    /* A file's PATH is evidence about every declaration in it. src/misty1/fo.ts
       declares `misty1Fo`, but src/ciphers/aria.ts declares `expandKey` — the
       algorithm is named by the directory, not by the identifier, and reading
       only identifiers put a whole implemented cipher in the references list. */
    const pathTerms = ALGORITHMS.filter((t) => {
      const rx = t.pathRe || t.re;
      return rx.test(rel) || rx.test(camelSplit(rel));
    });
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.trim()) continue;
      const camel = camelSplit(line);
      for (const term of ALGORITHMS) {
        if (!namesTerm(line, camel, term)) continue;
        const shape = shapeOf(line, codeLines[i], term);
        if (shape) keepBest(hits, term.name, `${rel}:${i + 1}`, shape);
        else if (!hits.has(term.name)) record(mentions, term.name, `${rel}:${i + 1}`, 'mention');
      }
      const inertLine = inertLines[i] || '';
      if (inertLine.trim()) {
        for (const term of ALGORITHMS) {
          if (commentOnly.has(term.name)) continue;
          if (term.re.test(inertLine) || term.re.test(camelSplit(inertLine))) {
            commentOnly.set(term.name, `${rel}:${i + 1}`);
          }
        }
      }
      for (const term of PROTOCOL_TERMS) {
        for (const hit of structuresNamed(codeLines[i], term)) {
          if (!structureHits.has(term.name)) structureHits.set(term.name, { seen: new Set(), prefixes: [], at: `${rel}:${i + 1}` });
          const h = structureHits.get(term.name);
          h.seen.add(hit.structure);
          h.prefixes.push(hit.prefix);
        }
      }
      if (pathTerms.length && DECLARES.test(codeLines[i])) {
        for (const term of pathTerms) keepBest(hits, term.name, `${rel}:${i + 1}`, 'path');
      }
      for (const atk of ATTACKS) {
        if (attackHits.has(atk.name)) continue;
        if (atk.re.test(line)) record(attackHits, atk.name, `${rel}:${i + 1}`, 'code');
      }
    }
  }

  for (const rel of prose) {
    let raw;
    try { raw = fs.readFileSync(path.join(read, rel), 'utf8'); } catch { continue; }
    const text = /\.html?$/.test(rel) ? splitHtml(raw).prose : raw;
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.trim()) continue;
      for (const term of ALGORITHMS) {
        if (hits.has(term.name) || mentions.has(term.name)) continue;
        if (term.re.test(line)) record(mentions, term.name, `${rel}:${i + 1}`, 'prose');
      }
      for (const atk of ATTACKS) {
        if (attackHits.has(atk.name)) continue;
        if (atk.re.test(line)) record(attackHits, atk.name, `${rel}:${i + 1}`, 'prose');
      }
    }
  }

  /* TWO distinct message types of the same protocol, not one. A single borrowed
     identifier proves nothing: crypto-lab-ssh-handshake declares `ServerHello`
     for SSH's own exchange and crypto-lab-pake-gate calls SRP-6a's first message
     `srpClientHello`. Neither implements TLS, and both matched on one name.
     Two of a protocol's own messages co-occurring is the evidence. */
  /* Where the protocol shape DECLINES to claim, it records that it declined.
     Both residues below are real evidence the scanner cannot resolve, and a
     scanner that will not claim must also not accuse - the same bargain as
     NOT-SCANNED and comment-only. Without this they were silent, and silence
     from a checker reads as a negative finding. */
  const protocolPartial = [];
  for (const [name, v] of structureHits) {
    if (v.seen.size < 2) {
      protocolPartial.push({ name, at: v.at, why: `names only ${[...v.seen][0]}` });
      continue;
    }
    /* A foreign prefix DOMINATING the occurrences means the lab renamed another
       protocol's messages after this one. crypto-lab-pake-gate calls SRP-6a's
       two messages `srpClientHello` and `srpServerHello` and then holds one in a
       bare `clientHello` local — four occurrences prefixed `srp` and one not, so
       "all of them share a prefix" was not enough and "most of them do" is.
       Dominance rather than unanimity, because the local variable is downstream
       of the naming, not independent evidence of it. */
    const tally = new Map();
    for (const pre of v.prefixes) tally.set(pre, (tally.get(pre) || 0) + 1);
    const [topPrefix, topCount] = [...tally].sort((a, b) => b[1] - a[1])[0];
    if (topPrefix !== '' && topCount * 2 >= v.prefixes.length) {
      protocolPartial.push({ name, at: v.at, why: `every mention prefixed "${topPrefix}"` });
      continue;
    }
    keepBest(hits, name, v.at, 'protocol');
  }

  /* A name is comment-only when it appears in this lab's own CODE FILES and
     never in anything that executes. It is the scanner saying "the code here is
     about this algorithm and I cannot tell whether it computes it" - which is a
     different fact from UNKNOWN and from a README mention, and is the state the
     chip rule must not accuse. */
  const inertOnly = [...commentOnly.entries()].filter(([n]) => !hits.has(n))
    .map(([name, at]) => ({ name, at })).sort((a, b) => a.name.localeCompare(b.name));

  const review = REVIEWS[slug];
  let staleReview = null;
  if (review) {
    const head = execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    if (head !== review.commit && movedSubstantively(dir, review.commit, head)) {
      /* A stale pin is RECORDED here and acted on by each caller; nothing throws.
         What must not happen is a person's recorded add and remove lists being
         applied to source that has since changed - that is their judgement being
         inherited rather than made - so those edits are skipped just below.
         Everything else about the lab is derived as usual.
         This used to throw, which aborted the whole pass on the first stale lab
         in card order. See the note on the filter in writeCards. */
      staleReview = { pinned: review.commit, current: head };
    }
    if (!staleReview) {
    for (const name of review.remove || []) hits.delete(name);
    for (const item of review.add || []) {
      const at = item.lastIndexOf('@');
      const name = item.slice(0, at);
      const anchor = item.slice(at + 1);
      if (at < 0 || !ALGORITHMS.some((term) => term.name === name) || !/^.+:\d+$/.test(anchor)) {
        throw new Error(`${slug}: invalid reviewed implementation ${item}`);
      }
      hits.set(name, { at: anchor, shape: 'reviewed' });
    }
    if (review.state === 'N/A' && hits.size) {
      throw new Error(`${slug}: N/A review conflicts with ${[...hits.keys()].join(', ')}`);
    }
    }
  }
  const impl = [...hits.entries()].map(([name, v]) => ({ name, at: v.at, shape: v.shape }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const refs = [...mentions.keys()].filter((n) => !hits.has(n)).sort();
  const atks = [...attackHits.entries()].map(([name, v]) => ({ name, at: v.at }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const byName = new Map(ALGORITHMS.map((a) => [a.name, a]));
  const bodies = [...new Set(impl.map((i) => byName.get(i.name))
    .filter((t) => t && t.std).map((t) => t.std.split(':')[0]))].sort();

  /* An implementation style is only claimed when there is something to style.
     A lab with no algorithm evidence is UNKNOWN, not "hand-rolled": hand-rolled
     is a claim about code this tool did not find. */
  let implementation = 'UNKNOWN';
  if (libs.has('WebCrypto')) implementation = 'WebCrypto';
  else if (libs.has('@noble')) implementation = '@noble';
  else if (libs.has('WASM')) implementation = 'WASM';
  else if (impl.length) implementation = 'hand-rolled';
  if (review?.implementation) implementation = review.implementation;
  else if (review?.state === 'N/A') implementation = 'N/A (model or attack)';
  else if (impl.length && implementation === 'UNKNOWN') implementation = 'reviewed source';

  /* NOT-SCANNED is a THIRD state, and the distinction is the whole point.
     UNKNOWN means every file this tool can read was read and no algorithm was
     derivable — a real finding about a lab that models rather than computes.
     NOT-SCANNED means the lab's implementation is in a language this tool does
     not open, so it has no finding to report. Folding the second into the first
     publishes "implements nothing" about source nobody looked at. */
  const unreadable = [...unread.entries()].filter(([name]) => !review?.covered?.includes(name)).sort((a, b) => b[1] - a[1])
    .map(([name, n]) => `${name}:${n}`);
  return {
    slug,
    cloned: true,
    implements: impl,
    references: refs,
    attacks: atks,
    standards: bodies,
    implementation,
    unscanned: unreadable,
    notScanned: impl.length === 0 && unreadable.length > 0,
    reviewed: review ? { commit: review.commit, note: review.note, state: review.state || 'covered' } : null,
    commentOnly: inertOnly,
    staleReview,
    protocolPartial: protocolPartial.filter((x) => !hits.has(x.name)).sort((a, b) => a.name.localeCompare(b.name)),
  };
}

/* ---- cards ---------------------------------------------------------------- */

const CARD_RE = /<a class="((?:project|feature)-card[^"]*)" data-category="[^"]*" href="https:\/\/systemslibrarian\.github\.io\/([^/"]+)\/"([\s\S]*?)<\/a>/g;

function cards() {
  const html = fs.readFileSync(HTML, 'utf8');
  const out = [];
  let m;
  while ((m = CARD_RE.exec(html)) !== null) {
    const title = /(?:project|feature)-title">([^<]+)</.exec(m[0]);
    out.push({ slug: m[2], title: title ? title[1].trim() : '', block: m[0], rest: m[3] });
  }
  return out;
}

const attr = (block, name) => {
  const m = new RegExp(`\\sdata-${name}="([^"]*)"`).exec(block);
  return m ? m[1] : null;
};

const encode = (items) => items.map((i) => (i.at ? `${i.name}@${i.at}` : i.name)).join(' | ');

function fieldsFor(ev) {
  const implemented = ev.implements.length ? encode(ev.implements)
    : (ev.notScanned ? 'NOT-SCANNED' : (ev.reviewed?.state === 'N/A' ? 'N/A' : 'UNKNOWN'));
  return {
    implements: implemented,
    unscanned: (ev.unscanned || []).join(' | '),
    commentOnly: encode(ev.commentOnly || []),
    protocolPartial: encode(ev.protocolPartial || []),
    references: ev.references.length ? ev.references.join(' | ') : '',
    attacks: ev.attacks.length ? encode(ev.attacks) : '',
    standards: ev.standards.length ? ev.standards.join(' | ') : '',
    implementation: ev.implementation,
    reviewCommit: ev.reviewed?.commit || '',
    reviewNote: ev.reviewed?.note || '',
  };
}

/* ---- modes ---------------------------------------------------------------- */

/* Which labs were read from committed HEAD rather than from their working tree,
   printed on every run. A generator that quietly substituted its source would be
   the same silence it exists to prevent. */
function printCloneSource() {
  const torn = tornSnapshot();
  if (torn.length) {
    console.error(`TORN SNAPSHOT (${torn.length}) — these clones were CLEAN when this run read them and are`);
    console.error('dirty now, so the bytes above are a mix of two states. Re-run once the other lane settles;');
    console.error('do not commit generated output from this run.');
    for (const t of torn) console.error(`  ${t.slug.padEnd(34)} ${t.dirty} path(s) changed mid-run`);
  }
  const cs = cloneSummary();
  if (cs.fromHead.length) {
    console.log(`Read from committed HEAD, working tree dirty (${cs.fromHead.length}): `
      + cs.fromHead.map((x) => `${x.slug.replace('crypto-lab-', '')} (${x.dirty})`).join(', '));
  }
  if (cs.refused.length) {
    console.log(`REFUSED, dirty and HEAD unreadable (${cs.refused.length}): `
      + cs.refused.map((x) => x.slug.replace('crypto-lab-', '')).join(', '));
  }
}

function writeCards(all) {
  let html = fs.readFileSync(HTML, 'utf8');
  let changed = 0;
  /* SKIP THE LABS WHOSE PINS ARE STALE; WRITE EVERY OTHER LAB.
   *
   * The guard exists to stop a person's recorded add and remove lists being
   * applied to source that has since changed. Skipping does exactly that: a
   * stale-pinned lab's card is not rewritten, so it stays byte-identical and
   * keeps the state that person last reviewed.
   *
   * What it no longer does is refuse to update labs the guard has no view on.
   * That was never a policy - it was a throw inside evidenceFor, so the first
   * stale lab in CARD ORDER aborted the whole pass and nothing was written at
   * all. The cost was not theoretical: five cards credited Shamir secret sharing
   * on the strength of Fiat-Shamir, the vocabulary had already been narrowed to
   * exclude that, none of those five labs carried a pin, and the correction sat
   * blocked behind unrelated labs awaiting a person's re-review.
   *
   * The run still exits non-zero, so the pass completes AND stays red: skipped
   * work is reported rather than quietly dropped. */
  const stale = all.filter((c) => c.ev.staleReview);
  const writable = all.filter((c) => !c.ev.staleReview);
  for (const c of writable) {
    const f = fieldsFor(c.ev);
    /* data-overlaps is NOT touched: it is the one judged field, and a difference
       between two labs is not derivable from either lab's source. */
    const parts = [
      `data-implements="${f.implements}"`,
      f.unscanned ? `data-unscanned="${f.unscanned}"` : null,
      f.commentOnly ? `data-comment-only="${f.commentOnly}"` : null,
      f.protocolPartial ? `data-protocol-partial="${f.protocolPartial}"` : null,
      f.references ? `data-references="${f.references}"` : null,
      f.attacks ? `data-attacks="${f.attacks}"` : null,
      f.standards ? `data-standards="${f.standards}"` : null,
      `data-implementation="${f.implementation}"`,
      f.reviewCommit ? `data-review-commit="${f.reviewCommit}"` : null,
      f.reviewNote ? `data-review-note="${f.reviewNote}"` : null,
    ].filter(Boolean);
    const anchorHref = `href="https://systemslibrarian.github.io/${c.slug}/"`;
    const stripped = c.block.replace(/^[ \t]*data-(?:implements|unscanned|comment-only|protocol-partial|references|attacks|standards|implementation|review-commit|review-note)="[^"]*"\r?\n/gm, '');
    const next = stripped.replace(anchorHref, `${anchorHref}\n            ${parts.join('\n            ')}`);
    if (next !== c.block) { html = html.replace(c.block, next); changed += 1; }
  }
  fs.writeFileSync(HTML, html);
  printCloneSource();
  console.log(`index.html: derived fields written to ${changed} cards.`);
  if (tornSnapshot().length) process.exitCode = 1;
  if (stale.length) {
    const today = new Date();
    const aged = stale.map((c) => {
      const d = REVIEWS[c.slug] && REVIEWS[c.slug].reviewed;
      return { c, days: d ? Math.floor((today - Date.parse(`${d}T00:00:00Z`)) / 86400000) : null, on: d };
    }).sort((a, b) => (b.days ?? -1) - (a.days ?? -1));
    console.log(`\nSTALE-REVIEW (${stale.length}) — left untouched, byte-identical, holding the state each was last reviewed in. Oldest first:`);
    for (const a of aged) {
      console.log(`  ${a.days === null ? '  undated' : `${String(a.days).padStart(4)}d`}  ${a.c.slug.padEnd(32)} reviewed ${a.on || '(no date)'}`);
    }
    console.log('Re-read those labs and update their pins in tools/catalog-reviewed.json.');
    console.log('Exiting non-zero: the rest of the catalog is written, and this stays red until they are cleared.');
    process.exitCode = 1;
  }
}

/** The lab's ACTUAL head, read from the remote without fetching.
 *
 * The staleness check used to compare a pin against `git rev-parse HEAD` in the
 * local clone, and a clone nobody fetched is not the lab. Every one of the
 * eighteen pins it reported stale turned out to match its lab's real main
 * exactly; what had moved was the working copy. That is this repository's
 * recurring defect wearing yet another coat - a checker reading whatever was
 * convenient rather than the thing the question is about - and it had produced a
 * re-review queue with nothing in it.
 *
 * Returns null when the remote cannot be read, which is reported as unreadable
 * rather than as a stale pin.
 */
function remoteHeadOf(dir) {
  try {
    const out = execFileSync('git', ['-C', dir, 'ls-remote', 'origin', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const sha = out.trim().split(/\s+/)[0];
    return /^[0-9a-f]{40}$/.test(sha) ? sha : null;
  } catch { return null; }
}

function verifyAnchors(all) {
  const bad = [];
  const unreadable = [];
  const behind = [];
  let checked = 0;
  const byName = new Map(ALGORITHMS.map((a) => [a.name, a]));
  for (const c of all) {
    const review = REVIEWS[c.slug];
    if (review) {
      const dir = path.join(REPOS, c.slug);
      if (!review.reviewed) {
        bad.push({ slug: c.slug, item: 'source review', why: 'no "reviewed" date recorded, so this pin cannot be aged' });
      }
      if (!fs.existsSync(path.join(dir, '.git'))) {
        /* Not a stale review and not a finding about the lab: a pin this pass
           could not read. It is listed apart from the stale ones so a reader is
           not told to re-review something nobody looked at. */
        if (!unreadable.includes(c.slug)) unreadable.push(c.slug);
      } else {
        const head = execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
        const remote = remoteHeadOf(dir);
        if (remote === null) {
          if (!unreadable.includes(c.slug)) unreadable.push(c.slug);
        } else if (remote === review.commit && head !== review.commit) {
          /* The pin is CURRENT; this working copy is behind. Not a re-review, and
             not the lab's problem - but it does mean every anchor derived here
             came from source the lab has moved past, so it is a finding about
             this checkout and it says which command clears it. */
          behind.push({ slug: c.slug, clone: head, actual: remote });
        } else if (remote !== review.commit && movedSubstantively(dir, review.commit, remote)) {
          /* Same substantive scope as the derivation above and as
             corpus-freshness: only README.md or src/ invalidates a source review. */
          bad.push({
            slug: c.slug,
            item: 'source review',
            why: `reviewed ${review.commit.slice(0, 12)}, lab is now ${remote.slice(0, 12)}; re-review and update the pin`,
          });
        }
      }
    }
    /* No clone here means this pass could not look, and every anchor it would
       have checked is unreadable for one reason rather than missing for many.
       Reporting "file is gone" per anchor claims something about files nobody
       opened - the UNKNOWN-versus-NOT-SCANNED conflation one layer up, in the
       verifier this time. Say it once, and move on. */
    if (!fs.existsSync(path.join(REPOS, c.slug, '.git'))) {
      if (attr(c.block, 'implements') && !['UNKNOWN', 'NOT-SCANNED', 'N/A'].includes(attr(c.block, 'implements'))) {
        unreadable.push(c.slug);
      }
      continue;
    }
    /* Both anchored fields, not just one. `data-attacks` carries `Name@file:line`
       exactly as `data-implements` does, and nothing checked it: the 19
       CRYPTO-LAB-TEMPLATE.md anchors that prompted this work were all in
       data-attacks, invisible to a verifier that only ever read implements. */
    const stored = ['implements', 'attacks']
      .map((f) => attr(c.block, f))
      .filter((v) => v && !['UNKNOWN', 'NOT-SCANNED', 'N/A'].includes(v))
      .join(' | ');
    if (!stored) continue;
    for (const item of stored.split(' | ')) {
      const at = item.indexOf('@');
      if (at < 0) { bad.push({ slug: c.slug, item, why: 'no anchor' }); continue; }
      const name = item.slice(0, at);
      const [file, lineNo] = item.slice(at + 1).split(':');
      const vsrc = sourceRoot(path.join(REPOS, c.slug));
      const full = path.join(vsrc.root || path.join(REPOS, c.slug), file);
      checked += 1;
      /* An anchor into a file the repository does not track is not an anchor.
         It resolves on a machine where someone left that file lying about and
         fails on a fresh clone, which is the opposite of what an anchor is for.
         Checked before existence, because the gitignored case EXISTS on disk. */
      const tracked = isTracked(path.join(REPOS, c.slug), file);
      if (tracked === false) { bad.push({ slug: c.slug, item, why: 'anchored into a file git does not track' }); continue; }
      if (!fs.existsSync(full)) { bad.push({ slug: c.slug, item, why: 'file is gone' }); continue; }
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      const line = lines[Number(lineNo) - 1];
      if (line === undefined) { bad.push({ slug: c.slug, item, why: `file has only ${lines.length} lines` }); continue; }
      // A reviewed anchor may name the implementing operation generically
      // (generate_shares, for example). Its source commit was checked above;
      // keep the exact line alive without pretending a name grep proved it.
      if (REVIEWS[c.slug]?.add?.includes(item)) {
        if (!line.trim()) bad.push({ slug: c.slug, item, why: 'reviewed line is blank' });
        continue;
      }
      const term = byName.get(name);
      if (!term) { bad.push({ slug: c.slug, item, why: 'not a vocabulary term' }); continue; }
      /* The evidence is the line OR the path, because that is how it was
         derived: src/gost/aes.ts names AES on every line of it, and the anchor
         points at the first declaration in the file rather than at a line
         repeating the word. Checking only the line called 242 freshly written
         anchors stale — a verifier stricter than the deriver, which reports
         rot that is not there and teaches people to ignore it. */
      const pathRx = term.pathRe || term.re;
      /* The line, the path, OR one of the protocol's own message structures -
         the three ways the deriver can establish a term. A protocol anchor
         points at `export interface ClientHello`, which does not contain the
         string "TLS 1.3" and never will. This is the second time a verifier has
         been written stricter than the deriver that fed it; both times the
         symptom was freshly written anchors reported as rot. */
      const named = namesTerm(line, camelSplit(line), term)
        || pathRx.test(file) || pathRx.test(camelSplit(file))
        || structuresNamed(line, term).length > 0;
      if (!named) bad.push({ slug: c.slug, item, why: `neither line ${lineNo} nor the path names it` });
    }
  }
  /* Reported under NAMED MARKERS, one per class, because the weekly runner reads
     markers to tell a decided-on state from a surprise. Folded into one count,
     twenty pins awaiting a person's re-review would sit in the same list as an
     anchor that silently rotted, and the second would be read as routine. */
  /* Stale pins are AGED and sorted oldest first. A red exit seen every week says
     the same thing every week; a number that grows says how long it has been
     ignored, which is the part a weekly issue can carry and an exit code cannot.
     The age comes from the `reviewed` date recorded beside each pin, so this
     needs no network and cannot drift from the pin it describes. */
  const today = new Date();
  const ageOf = (slug) => {
    const d = REVIEWS[slug] && REVIEWS[slug].reviewed;
    if (!d) return null;
    return Math.floor((today - Date.parse(`${d}T00:00:00Z`)) / 86400000);
  };
  const staleReviews = bad.filter((b) => b.item === 'source review')
    .map((b) => ({ ...b, days: ageOf(b.slug) }))
    .sort((a, b) => (b.days ?? -1) - (a.days ?? -1));
  const staleAnchors = bad.filter((b) => b.item !== 'source review');
  printCloneSource();
  console.log(`Anchors checked: ${checked}.\n`);
  if (staleReviews.length) {
    const oldest = staleReviews[0].days;
    console.log(`STALE-REVIEW (${staleReviews.length}) — oldest ${oldest === null ? 'undated' : `${oldest} days`}; `
      + 'the lab moved since a person reviewed it, so the pin needs a person again. Oldest first.');
    for (const b of staleReviews) {
      const age = b.days === null ? '  undated' : `${String(b.days).padStart(4)}d`;
      const on = REVIEWS[b.slug] && REVIEWS[b.slug].reviewed;
      console.log(`  ${age}  ${b.slug.padEnd(32)} reviewed ${on || '(no date recorded)'} — ${b.why}`);
    }
    console.log('');
  }
  if (staleAnchors.length) {
    console.log(`STALE-ANCHOR (${staleAnchors.length}) — a line number that no longer resolves.`);
    for (const b of staleAnchors) console.log(`  ${b.slug.padEnd(34)} ${b.item}  — ${b.why}`);
    console.log('');
  }
  if (behind.length) {
    console.log(`CLONE-BEHIND (${behind.length}) — the pin matches the lab, but this checkout does not.`);
    console.log('Not a re-review and not the lab\'s problem: every anchor derived here came from source');
    console.log('the lab has moved past. Fetch these and re-derive.');
    for (const b of behind) console.log(`  ${b.slug.padEnd(34)} clone ${b.clone.slice(0, 12)}, lab ${b.actual.slice(0, 12)}`);
    console.log('');
  }
  if (unreadable.length) {
    console.log(`UNREADABLE (${unreadable.length}) — no clone here, or its remote could not be read, so this pass could not look. Not a finding about the lab.`);
    for (const slug of unreadable) console.log(`  ${slug.padEnd(34)} clone it to check its anchors and its pinned review`);
    console.log('');
  }
  if (bad.length || unreadable.length || behind.length) {
    if (staleAnchors.length) {
      console.log('For a stale anchor: re-derive with `node tools/catalog-evidence.js write`.');
      if (staleReviews.length) {
        console.log('  — but note the writer REFUSES while any pinned review is stale, so the reviews above'
          + '\n    have to be cleared first. That ordering is deliberate, not an oversight: re-deriving'
          + '\n    would otherwise apply a person\'s judgement to source that has since changed.');
      }
    }
    if (staleReviews.length) {
      console.log('For a stale review: inspect the current lab source and update the pin in tools/catalog-reviewed.json.');
    }
    if (behind.length) {
      console.log('For a clone behind its lab: `git -C ../<lab> pull --ff-only`, then re-derive.');
    }
    if (unreadable.length) console.log('For an unreadable lab: clone it next to this repository.');
    process.exit(1);
  }
  console.log('Every anchor still resolves and every pinned source review matches its lab clone.');
}

/* Proof that a gitignored file cannot reach the derivation.
 *
 * Builds a throwaway repository twice: once clean, once with an IGNORED file
 * full of algorithm names. The derived file list must be identical. A boolean
 * assertion about `trackedFiles` would not catch the original defect, because
 * the defect was that a caller walked directories instead of asking git at all.
 *
 * The ignored file is named the way the real one was, and carries names no
 * other file in the fixture mentions, so if it leaks the difference is obvious.
 */
function selftest() {
  const os = require('os');
  const { execFileSync } = require('child_process');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ce-tracked-'));
  const git = (...a) => execFileSync('git', ['-C', tmp, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const fail = [];
  let pass = 0;
  try {
    git('init', '-q', '-b', 'main');
    git('config', 'user.email', 'selftest@example.invalid');
    git('config', 'user.name', 'selftest');
    fs.mkdirSync(path.join(tmp, 'src'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'src', 'main.ts'), 'export function sha256() { return 1 }\n');
    fs.writeFileSync(path.join(tmp, '.gitignore'), 'CRYPTO-LAB-TEMPLATE*.md\nchat.md\n');
    git('add', '.'); git('commit', '-qm', 'base');

    const before = labFilePaths(tmp, tmp).map((f) => path.relative(tmp, f)).sort();

    // The file that caused this: ignored, on disk, stuffed with algorithm names.
    fs.writeFileSync(path.join(tmp, 'CRYPTO-LAB-TEMPLATE.md'),
      '# template\nBB84 and E91 and OPAQUE and PQXDH and Bulletproofs and AES-XTS\n');
    fs.writeFileSync(path.join(tmp, 'chat.md'), 'we discussed ML-KEM and Kyber at length\n');

    const after = labFilePaths(tmp, tmp).map((f) => path.relative(tmp, f)).sort();

    if (JSON.stringify(before) !== JSON.stringify(after)) {
      fail.push(`an ignored file changed the derived file list:\n    before ${JSON.stringify(before)}\n    after  ${JSON.stringify(after)}`);
    } else { pass++; console.log('  ok  an ignored file on disk does not change the file list'); }

    if (after.some((f) => /CRYPTO-LAB-TEMPLATE|chat\.md/.test(f))) {
      fail.push('an ignored file appears in the derived file list');
    } else { pass++; console.log('  ok  neither ignored file appears in the list'); }

    // git status calls this clean, which is exactly why the dirty test missed it.
    const status = git('status', '--porcelain').trim();
    if (status !== '') fail.push(`fixture should read clean, got: ${status}`);
    else { pass++; console.log('  ok  git status reports the clone CLEAN with both ignored files present'); }

    // An UNTRACKED-but-not-ignored file must also stay out.
    fs.writeFileSync(path.join(tmp, 'scratch.ts'), 'export const falcon = 1\n');
    forgetTracked(tmp);
    const withUntracked = labFilePaths(tmp, tmp).map((f) => path.relative(tmp, f)).sort();
    if (withUntracked.includes('scratch.ts')) fail.push('an untracked file reached the derived file list');
    else { pass++; console.log('  ok  an untracked file does not reach the list either'); }

    // And a TRACKED file must still be read, or the rule proves nothing.
    if (!after.includes(path.join('src', 'main.ts'))) fail.push('a tracked file went missing from the list');
    else { pass++; console.log('  ok  a tracked file is still read'); }

    /* The substantive-change rule, BOTH ways. A rule that only ever answered
       "not stale" would pass a one-sided fixture and bury every real one. */
    const base = git('rev-parse', 'HEAD').trim();
    fs.writeFileSync(path.join(tmp, '.gitignore'), 'CRYPTO-LAB-TEMPLATE*.md\nchat.md\nnotes.txt\n');
    git('add', '.gitignore'); git('commit', '-qm', 'ignore notes');
    const afterIgnoreOnly = git('rev-parse', 'HEAD').trim();
    if (movedSubstantively(tmp, base, afterIgnoreOnly)) fail.push('a .gitignore-only commit was called substantive');
    else { pass++; console.log('  ok  a .gitignore-only commit does NOT invalidate a pin'); }

    fs.writeFileSync(path.join(tmp, 'src', 'main.ts'), 'export function sha512() { return 2 }\n');
    git('add', 'src/main.ts'); git('commit', '-qm', 'change src');
    const afterSrc = git('rev-parse', 'HEAD').trim();
    if (!movedSubstantively(tmp, afterIgnoreOnly, afterSrc)) fail.push('a src/ change was not called substantive');
    else { pass++; console.log('  ok  a src/ change DOES invalidate a pin'); }

    fs.writeFileSync(path.join(tmp, 'README.md'), '# lab\n');
    git('add', 'README.md'); git('commit', '-qm', 'add readme');
    if (!movedSubstantively(tmp, afterSrc, git('rev-parse', 'HEAD').trim())) fail.push('a README.md change was not called substantive');
    else { pass++; console.log('  ok  a README.md change DOES invalidate a pin'); }

    if (movedSubstantively(tmp, 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 'HEAD') !== true) {
      fail.push('an unreadable range was not treated as moved');
    } else { pass++; console.log('  ok  a range git cannot read counts as moved, never as unchanged'); }
  } catch (e) {
    fail.push(`fixture could not be built: ${e.message}`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log(fail.length ? `\n${pass} passed, ${fail.length} FAILED` : `\n${pass} passed, 0 failed`);
  for (const m of fail) console.log(`  FAIL  ${m}`);
  return fail.length ? 1 : 0;
}

function main() {
  const argv = process.argv.slice(2);
  if (argv[0] === 'selftest') process.exit(selftest());
  const mode = argv.find((a) => !a.startsWith('-')) || 'report';
  const one = argv.includes('--lab') ? argv[argv.indexOf('--lab') + 1] : null;
  const selected = cards().filter((c) => !one || c.slug === one);
  // Verification reads the stored claims and clone HEADs. Re-derivation would
  // reject the first stale pin before this pass could report all stale reviews.
  if (mode === 'verify') return verifyAnchors(selected);
  const all = selected.map((c) => ({ ...c, ev: evidenceFor(c.slug) }));

  /* Every read-only mode names the stale pins it worked around, so a number that
     came out of a partly-inherited review is never mistaken for a clean one. */
  const stale = all.filter((c) => c.ev.staleReview);
  if (stale.length && mode !== 'write') {
    console.error(`STALE-REVIEW (${stale.length}) — pinned source reviews whose lab has moved. Their recorded`);
    console.error('add/remove edits were NOT applied here; everything else in this run is derived as usual.');
    for (const c of stale) {
      console.error(`  ${c.slug.padEnd(34)} reviewed ${c.ev.staleReview.pinned.slice(0, 12)}, clone ${c.ev.staleReview.current.slice(0, 12)}`);
    }
    console.error('Update the pins in tools/catalog-reviewed.json after re-reading those labs.\n');
  }

  if (mode === 'gaps') {
    /* Chips naming something the vocabulary has never heard of. The header
       promises the vocabulary grows on purpose rather than by being wrong
       quietly, and this is the thing that makes that true: a declared
       vocabulary's blind spot is invisible from inside it. `scalarMul` was
       missed because the term demanded `scalarMult` with a t, and the only
       symptom was one lab reading UNKNOWN. */
    const seen = new Map();
    for (const c of all) {
      const chips = [...c.block.matchAll(/class="chip">([^<]+)</g)].map((x) => x[1].trim());
      for (const chip of chips) {
        if (ALGORITHMS.some((t) => (t.chipRe || t.re).test(chip)) || ATTACKS.some((t) => t.re.test(chip))) continue;
        if (!seen.has(chip)) seen.set(chip, []);
        seen.get(chip).push(c.slug.replace('crypto-lab-', ''));
      }
    }
    const rows = [...seen].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
    console.log(`Chips matching no vocabulary term: ${rows.length} distinct, on ${new Set(rows.flatMap((r) => r[1])).size} labs.`);
    console.log('Most are concepts rather than algorithms and belong nowhere near the index.');
    console.log('The ones worth reading are algorithm NAMES — those are vocabulary gaps.\n');
    for (const [chip, labs] of rows.slice(0, 40)) {
      console.log(`  ${String(labs.length).padStart(3)}  ${chip.padEnd(30)} ${labs.slice(0, 4).join(', ')}${labs.length > 4 ? ', …' : ''}`);
    }
    return;
  }

  if (mode === 'write') return writeCards(all);

  if (argv.includes('--json')) {
    console.log(JSON.stringify(all.map(({ slug, title, ev }) => ({ slug, title, ...ev })), null, 2));
    return;
  }

  const uncloned = all.filter((c) => !c.ev.cloned);
  const unknown = all.filter((c) => c.ev.cloned && !c.ev.implements.length);
  console.log(`${all.length} cards; ${all.length - uncloned.length} clones read.\n`);
  if (one) {
    for (const c of all) {
      console.log(`${c.slug}  (${c.ev.implementation})`);
      for (const i of c.ev.implements) console.log(`  implements  ${i.name.padEnd(22)} ${i.shape.padEnd(7)} ${i.at}`);
      for (const r of c.ev.references) console.log(`  references  ${r}`);
      for (const a of c.ev.attacks) console.log(`  attack      ${a.name.padEnd(22)}         ${a.at}`);
    }
    return;
  }
  const counts = new Map();
  for (const c of all) for (const i of c.ev.implements) counts.set(i.name, (counts.get(i.name) || 0) + 1);
  console.log(`Algorithms with at least one implementation: ${counts.size} of ${ALGORITHMS.length} vocabulary terms.`);
  console.log(`Labs with no derivable implementation (UNKNOWN): ${unknown.length}`);
  for (const c of unknown) console.log(`  ${c.slug}`);
  if (uncloned.length) {
    console.log(`\nNot cloned here, so not readable (${uncloned.length}):`);
    for (const c of uncloned) console.log(`  ${c.slug}`);
  }
}

/* Exported so tools/depth-audit.js can blank comments with the SAME lexer rather
   than growing a second one. Two comment-blankers in one repository would drift,
   and the subtle cases here - a regex literal holding a quote, a template literal
   spanning four hundred lines - are exactly where they would drift. */
module.exports = {
  lex,
  camelSplit,
  /* Comments blanked, STRING CONTENTS KEPT. The other view (`lex().code`) blanks
     both, which is right for finding declarations and wrong for anything that
     lives in a string: an import path, a test name, a hex vector. Using it by
     mistake made tools/depth-audit.js unable to see `from '@noble/...'` or
     `it('rejects ...')` at all, and quietly demoted the fleet's reference labs. */
  blankComments: (src) => lex(src).strings,
};

if (require.main === module) main();
