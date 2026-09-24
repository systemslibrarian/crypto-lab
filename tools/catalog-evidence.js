#!/usr/bin/env node
/*
 * catalog-evidence.js — derive each lab's algorithm facts from its own source,
 * with a file:line anchor behind every claim.
 *
 * Run: node tools/catalog-evidence.js verify
 * Prevents: the catalog asserting a lab implements an algorithm its source does not
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
const { ALGORITHMS, ATTACKS } = require('./catalog-vocab.js');
const PROTOCOL_TERMS = ALGORITHMS.filter((t) => t.structures);

const ROOT = path.join(__dirname, '..');
const REPOS = path.join(ROOT, '..');
const HTML = path.join(ROOT, 'index.html');

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

function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (SKIP.test(p)) continue;
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
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
  const push = (inStrings, inCode) => { strings += inStrings; code += inCode; };
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
      push(' ', ' '); i += 1; continue;
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
      push(c === '\n' ? '\n' : ' ', c === '\n' ? '\n' : ' '); i += 1; continue;
    }
    // inside a string literal
    if (c === '\\') { push(src.slice(i, i + 2), '  '); i += 2; continue; }
    if (quote === '`' && c === '$' && n === '{') { stack.push({ quote, depth: 0 }); state = 'code'; push('${', '${'); i += 2; continue; }
    if (c === quote) { state = 'code'; push(c, c); i += 1; continue; }
    if (c === '\n') { push('\n', '\n'); i += 1; continue; }
    push(c, ' '); i += 1;
  }
  return { strings, code };
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
      out.push({ structure: st, prefix: a.slice(0, at).join('-') });
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
function shapeOf(line, code, term) {
  /* import / require whose module path carries the term */
  const imports = [...line.matchAll(/(?:from\s*|require\(\s*|import\(\s*)['"]([^'"]+)['"]/g)].map((x) => x[1]);
  if (imports.some((p) => term.re.test(p) || term.re.test(camelSplit(p)))) return 'import';
  /* …or whose imported BINDINGS carry it. Reading only the path missed
     `import { x25519 } from '@noble/curves/ed25519'` — the module is named for
     one algorithm and exports another — and `import { sm3 as sm3Hash } from
     'sm-crypto'`, where the package name says nothing at all. Both are as direct
     an implementation as a call. */
  if (/\b(?:import|require)\b/.test(line)) {
    const braces = /\{([^}]*)\}/.exec(line);
    if (braces) {
      const names = braces[1].split(',').flatMap((b) => b.split(/\s+as\s+/)).map((b) => b.trim()).filter(Boolean);
      if (names.some((n) => term.re.test(n) || term.re.test(camelSplit(n)))) return 'import';
    }
  }
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
    if (term.re.test(id) || term.re.test(camelSplit(id))) return 'decl';
  }
  /* an identifier carrying the term being invoked */
  const calls = [...code.matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)].map((x) => x[1]);
  if (calls.some((id) => term.re.test(id) || term.re.test(camelSplit(id)))) return 'call';
  return null;
}

/* A line that declares something executable, used with a path match. */
const DECLARES = /(?:^|[\s;{(,])(?:export\s+)?(?:async\s+)?function\s+[A-Za-z_$]|(?:^|[\s;{(,])class\s+[A-Za-z_$]/;

function labFiles(dir) {
  const files = walk(dir);
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
    return { slug, cloned: false, implements: [], references: [], attacks: [], standards: [], implementation: 'UNKNOWN', unscanned: [], notScanned: false };
  }
  const { code, prose, unread } = labFiles(dir);
  const hits = new Map();   // term name -> {shape, at}
  const mentions = new Map();
  const attackHits = new Map();
  const structureHits = new Map();
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
    try { raw = fs.readFileSync(path.join(dir, rel), 'utf8'); } catch { continue; }
    const text = /\.html?$/.test(rel) ? splitHtml(raw).code : raw;
    const lexed = lex(text);
    const src = lexed.strings;
    if (/crypto\.subtle\./.test(src)) libs.add('WebCrypto');
    if (/@noble\//.test(src)) libs.add('@noble');
    if (/\.wasm\b|WebAssembly\./.test(src)) libs.add('WASM');
    const lines = src.split('\n');
    const codeLines = lexed.code.split('\n');
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
        if (!term.re.test(line) && !term.re.test(camel)) continue;
        const shape = shapeOf(line, codeLines[i], term);
        if (shape) keepBest(hits, term.name, `${rel}:${i + 1}`, shape);
        else if (!hits.has(term.name)) record(mentions, term.name, `${rel}:${i + 1}`, 'mention');
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
    try { raw = fs.readFileSync(path.join(dir, rel), 'utf8'); } catch { continue; }
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
  for (const [name, v] of structureHits) {
    if (v.seen.size < 2) continue;
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
    if (topPrefix !== '' && topCount * 2 >= v.prefixes.length) continue;
    keepBest(hits, name, v.at, 'protocol');
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

  /* NOT-SCANNED is a THIRD state, and the distinction is the whole point.
     UNKNOWN means every file this tool can read was read and no algorithm was
     derivable — a real finding about a lab that models rather than computes.
     NOT-SCANNED means the lab's implementation is in a language this tool does
     not open, so it has no finding to report. Folding the second into the first
     publishes "implements nothing" about source nobody looked at. */
  const unreadable = [...unread.entries()].sort((a, b) => b[1] - a[1])
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
    : (ev.notScanned ? 'NOT-SCANNED' : 'UNKNOWN');
  return {
    implements: ev.cloned ? implemented : 'UNKNOWN',
    unscanned: (ev.unscanned || []).join(' | '),
    references: ev.references.length ? ev.references.join(' | ') : '',
    attacks: ev.attacks.length ? encode(ev.attacks) : '',
    standards: ev.standards.length ? ev.standards.join(' | ') : '',
    implementation: ev.implementation,
  };
}

/* ---- modes ---------------------------------------------------------------- */

function writeCards(all) {
  let html = fs.readFileSync(HTML, 'utf8');
  let changed = 0;
  for (const c of all) {
    const f = fieldsFor(c.ev);
    /* data-overlaps is NOT touched: it is the one judged field, and a difference
       between two labs is not derivable from either lab's source. */
    const parts = [
      `data-implements="${f.implements}"`,
      f.unscanned ? `data-unscanned="${f.unscanned}"` : null,
      f.references ? `data-references="${f.references}"` : null,
      f.attacks ? `data-attacks="${f.attacks}"` : null,
      f.standards ? `data-standards="${f.standards}"` : null,
      `data-implementation="${f.implementation}"`,
    ].filter(Boolean);
    const anchorHref = `href="https://systemslibrarian.github.io/${c.slug}/"`;
    const stripped = c.block.replace(/\sdata-(?:implements|unscanned|references|attacks|standards|implementation)="[^"]*"/g, '');
    const next = stripped.replace(anchorHref, `${anchorHref}\n            ${parts.join('\n            ')}`);
    if (next !== c.block) { html = html.replace(c.block, next); changed += 1; }
  }
  fs.writeFileSync(HTML, html);
  console.log(`index.html: derived fields written to ${changed} cards.`);
}

function verifyAnchors(all) {
  const bad = [];
  let checked = 0;
  const byName = new Map(ALGORITHMS.map((a) => [a.name, a]));
  for (const c of all) {
    const stored = attr(c.block, 'implements');
    if (!stored || stored === 'UNKNOWN' || stored === 'NOT-SCANNED') continue;
    for (const item of stored.split(' | ')) {
      const at = item.indexOf('@');
      if (at < 0) { bad.push({ slug: c.slug, item, why: 'no anchor' }); continue; }
      const name = item.slice(0, at);
      const [file, lineNo] = item.slice(at + 1).split(':');
      const full = path.join(REPOS, c.slug, file);
      checked += 1;
      if (!fs.existsSync(full)) { bad.push({ slug: c.slug, item, why: 'file is gone' }); continue; }
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      const line = lines[Number(lineNo) - 1];
      if (line === undefined) { bad.push({ slug: c.slug, item, why: `file has only ${lines.length} lines` }); continue; }
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
      const named = term.re.test(line) || term.re.test(camelSplit(line))
        || pathRx.test(file) || pathRx.test(camelSplit(file))
        || structuresNamed(line, term).length > 0;
      if (!named) bad.push({ slug: c.slug, item, why: `neither line ${lineNo} nor the path names it` });
    }
  }
  console.log(`Anchors checked: ${checked}. Stale: ${bad.length}.`);
  for (const b of bad) console.log(`  ${b.slug.padEnd(34)} ${b.item}  — ${b.why}`);
  if (bad.length) {
    console.log('\nAn anchor is a line number and line numbers rot. Re-derive with:'
      + '\n  node tools/catalog-evidence.js write');
    process.exit(1);
  }
  console.log('Every anchor still resolves: the line it points to, or the file it names, still carries its algorithm.');
}

function main() {
  const argv = process.argv.slice(2);
  const mode = argv.find((a) => !a.startsWith('-')) || 'report';
  const one = argv.includes('--lab') ? argv[argv.indexOf('--lab') + 1] : null;
  const all = cards()
    .filter((c) => !one || c.slug === one)
    .map((c) => ({ ...c, ev: evidenceFor(c.slug) }));

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
        if (ALGORITHMS.some((t) => t.re.test(chip)) || ATTACKS.some((t) => t.re.test(chip))) continue;
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

  if (mode === 'verify') return verifyAnchors(all);
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

main();
