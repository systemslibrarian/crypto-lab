#!/usr/bin/env node
/*
 * depth-audit.js — derive each lab's assurance dimensions from an export of its
 * remote default branch.
 *
 * Run: node tools/depth-audit.js check
 * Prevents: a depth ranking resting on dimensions nobody re-derived, and a coverage figure that ages into a claim
 * Reads: .scratch/<lab>/ exports of each remote default branch (not the local clones), .scratch/.exported.tsv, index.html, teach/_src/
 *
 * WHY A GENERATOR AND NOT A THIRD REPORT
 *
 * audits/DEPTH-AUDIT-2026-09-25.md and its follow-up read the fleet by hand and
 * are the reason this file can be narrow. Both say plainly what they could not
 * do: source-scan coverage is not dimension coverage, most labs carry `?` on the
 * dimensions that matter most, and neither will rank from partial scores. Doing
 * that by hand for the whole fleet is why it stayed undone.
 *
 * The other reason is this repository's own recurring defect: a claim nobody
 * re-checks. A hand-written ledger is a snapshot of a fleet that moves - the
 * pinned commits in the 2026-09-25 ledger were already behind when this ran, and
 * labs have been added since. Deriving the dimensions makes the ranking
 * reproducible and lets `check` fail when the report drifts from the exports.
 *
 * WHAT IT READS
 *
 * `.scratch/<lab>/` - an export of each remote default branch, written by
 * `node tools/depth-audit.js export`, with the sha recorded so every anchor
 * points at the commit that was actually read. Never the local clones: those
 * carry uncommitted work and stale branches, and this audit's whole value is
 * that it read what GitHub serves.
 *
 * THE RUBRIC IS NOT MINE. It is the one published in the 2026-09-25 audit,
 * reused deliberately so the two are comparable. Inventing a second scale would
 * produce two incomparable scores for one fleet, which is the drift this repo
 * keeps finding under other names.
 *
 *   T  4  ground truth        a named published fixed vector
 *   I  4  independent check   a second implementation or outside verifier
 *   C  2  displayed claim     a test asserting the page shows what was computed
 *   N  2  negative test       tamper, reject, wrong-key, replay, malformed
 *   G  2  deploy gate         what the deploy actually waits for
 *   H  1  limits and guidance README states scale and limits
 *
 * `+` credited, `0` inspected and not met, `?` not derivable. A `?` is excluded
 * from BOTH the earned and the assessed weight, so an unknown is never averaged
 * into a score. Scores with different assessed weights are not comparable as
 * fractions, and the report says so where it prints them.
 *
 * Z IS NOT SCORED HERE. The seventh dimension - does a test step run and report
 * zero tests - is credited in the rubric only on OBSERVED run output, and that
 * evidence is being gathered in PR #29 against pinned commits. This tool reads
 * files, not run logs, so it reports the structural hazard instead (a
 * `--passWithNoTests` escape, or `npm test --if-present` with no test script)
 * and leaves the observed dimension to the evidence that can establish it.
 * Deriving a weaker Z here would put two answers to one question in one repo.
 *
 * WHAT `+` ON GROUND TRUTH DOES NOT ESTABLISH. It says a named published source
 * is cited beside fixed material. It does NOT establish that the values were
 * copied from that publication rather than reproduced from a validated
 * implementation. crypto-lab-kem-trap is the case to know: its vectors file
 * cites FIPS 203 and ACVP beside pinned hex, and says in its own header that the
 * bytes come from @noble/post-quantum, "which passes the NIST ACVP ML-KEM test
 * suite". That is a strong provenance chain and it is not a published vector.
 * Which of the two a reader wants is a judgement this tool does not make.
 *
 * A LEXICAL HIT IS A LEAD, NOT PROOF. That sentence is from the 2026-09-25
 * audit and it governs T. A file naming FIPS 203 with no fixed bytes near it is
 * `?`, not `+`; fixed bytes with no named source are `0`, because self-generated
 * values are exactly what ground truth is distinguished from.
 *
 * Usage (from the repo root):
 *   node tools/depth-audit.js export   refresh .scratch/ from the remotes
 *   node tools/depth-audit.js          write the dated report under audits/
 *   node tools/depth-audit.js check    exit 1 if the report drifts from .scratch/
 *   node tools/depth-audit.js --json   machine-readable
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SCRATCH = path.join(ROOT, '.scratch');
const OWNER = 'systemslibrarian';

const WEIGHTS = { T: 4, I: 4, C: 2, N: 2, G: 2, H: 1 };

const SKIP_DIR = /(^|\/)(node_modules|dist|build|\.git|target|pkg|coverage|test-results|playwright-report|\.vite)(\/|$)/;
const VENDORED = /(^|\/)(vendor|vendored|third[-_]party)(\/|$)|\.min\.[tj]sx?$/;

/* A named published source. Generic phrases like "test vector" are deliberately
   absent: they are what a lead looks like, and T credits a NAMED source. */
const PUBLISHED = [
  { re: /\bFIPS[- ]?\d{3}\b/i, name: 'FIPS' },
  { re: /\bSP[- ]?800-\d+[A-Za-z]*\b/i, name: 'NIST SP 800' },
  { re: /\bRFC[- ]?\d{3,5}\b/i, name: 'RFC' },
  { re: /\bACVP\b/i, name: 'ACVP' },
  { re: /\bCAVP\b/i, name: 'CAVP' },
  { re: /\bwycheproof\b/i, name: 'Wycheproof' },
  { re: /\bNESSIE\b/i, name: 'NESSIE' },
  { re: /\bePrint\b|eprint\.iacr\.org/i, name: 'IACR ePrint' },
  { re: /\bGOST[- ]?R?[- ]?\d/i, name: 'GOST R' },
  { re: /\bISO\/IEC[- ]?\d+/i, name: 'ISO/IEC' },
  { re: /\bGB\/T[- ]?\d+/i, name: 'GB/T' },
  { re: /\bdraft-[a-z]+-[a-z0-9-]+\b/i, name: 'IETF draft' },
];

/* Fixed literal material: a long hex run, or a byte array with many entries. */
const FIXED_HEX = /['"`][0-9a-fA-F]{32,}['"`]|0x[0-9a-fA-F]{16,}/;
const FIXED_BYTES = /\[\s*(?:0x[0-9a-fA-F]{2}\s*,\s*){7,}/;
/* Not every published vector is hex. crypto-lab-lattice-gentle pins Examples 4.3
   and 3.2 of an ePrint paper as integer matrices mod q, and reading only hex
   reported real ground truth as not derivable. */
const FIXED_INTS = /\[\s*(?:-?\d{1,6}\s*,\s*){7,}-?\d{1,6}\s*\]|\[\s*\[\s*-?\d+(?:\s*,\s*-?\d+){3,}/;

/* Outside crypto sources. A test importing one of these while the lab carries its
   own implementation is cross-checking rather than testing itself. */
/* Module SPECIFIERS, matched only inside an import or require. The first version
   tested bare words against whole-file text, so `describe('elliptic curves over
   GF(431^2)')` credited crypto-lab-isogeny-atlas with an independent check worth
   four points, in a lab whose package.json has no crypto dependency at all. A
   word in a heading is not an implementation. */
/* Anchoring `^...$` around a prefix that ends in `/` means only the literal
   "@noble/" matches, so `@noble/curves` matched NOTHING. That single character
   class withheld the heaviest dimension from 43 labs - the over-correction for
   the prose-matching bug in the other direction. Scoped packages are matched by
   prefix; bare packages by whole name. */
const OUTSIDE_SCOPED = /^(?:@noble|@peculiar|@stablelib|@scure)\//i;
const OUTSIDE_BARE = /^(?:sm-crypto|jsrsasign|elliptic|sodium|libsodium(?:-wrappers)?|tweetnacl|hash-wasm|jose|pqclean|liboqs|node:crypto|crypto|bn\.js|secp256k1)$/i;
const OUTSIDE_MODULE = (spec) => OUTSIDE_SCOPED.test(spec) || OUTSIDE_BARE.test(spec.split('/')[0]) || OUTSIDE_BARE.test(spec);
const OUTSIDE_RUST = /\b(?:ed25519_dalek|curve25519_dalek|sha2|p256|k256|ring|openssl|rand_core)::/;
/* node:crypto is genuinely a second implementation in some labs and a jsdom
   polyfill in others. crypto-lab-mpcith-sign's four points rested entirely on
   `vi.stubGlobal('crypto', webcrypto)` - a shim so the environment has SubtleCrypto
   at all, cross-checking nothing. Where the import is only stubbed in, it is not
   evidence. */
const STUBBED = /stubGlobal|globalThis\.crypto\s*=|defineProperty\(\s*globalThis/;

/* `fail` and `detect` are deliberately ABSENT. With them, three labs were
   credited for a negative test on the word "fail" appearing in a COMMENT -
   "this passes or fails for the...", "the two failure classes this fleet's
   gates could not see". Comments are blanked before any of this now, and the
   word list is narrowed to words that describe a forced failure rather than
   discuss one. */
/* Inflections included. `\breplay\b` does not match "replays an earlier round
   byte-for-byte", which is how crypto-lab-drbg-arena was marked as having no
   negative test - and that wrong `0` was then published as this tool correctly
   tightening a hand reader's `?`. */
const NEGATIVE_NAME = /\b(tamper\w*|reject\w*|invalid\w*|wrong[- ]?key|malformed|forge[dsr]?\w*|replay\w*|mismatch\w*|corrupt\w*|refuse[sd]?|throws?)\b/i;
/* A test TITLE, matched on one line. The previous pattern let `[^'"`]*` run across
   newlines from the `test'` inside `from '@playwright/test'` on line 1 to the next
   quote anywhere in the file, so the word list was decorative: crypto-lab-isogeny
   -atlas earned a negative test from a `throw` inside a colour-parsing helper. */
const TEST_TITLE = /(?:^|[\s;{(])(?:it|test|describe|bench)\s*(?:\.\w+)?\s*\(\s*(['"`])((?:(?!\1).)*)\1/;
const NEGATIVE_ASSERT = /\.toThrow|\.rejects\b|assert!\(\s*\w+\.is_err|should_panic|expect\(\s*\)\s*\.\s*to_?err|assertThrows/;
/* Limit statements, in the shapes this fleet actually writes them. `educational`
   was still here and was crediting labs that only market themselves that way;
   meanwhile four labs stating limits plainly - "Do NOT treat this as a wallet",
   "not a hardened or audited library", "This is not the full CBOR/COSE wire
   format" - were scored as stating none. */
const LIMITS = /\bnot\s+(?:for\s+)?production\b|\bnot\s+production[- ]ready\b|\bdo\s*n[o']?t\s+(?:use|treat|rely)\b|\bnot\s+(?:a\s+)?(?:hardened|audited|consensus|complete|full)\b|\bun-?hardened\b|\bdemonstration only\b|\bdemo app\b|\bnot hardened\b|\bdoes not provide\b|\bthis (?:project|demo|page|lab) (?:does )?\*?\*?not\b|\bnot intended for\b|\bnot suitable for\b|\bno security guarantee|\bnot a security\b|\breduced parameter|\bfor teaching only\b|\bnot safe\b|\btoy\b/i;
/* Copy that a wrong reader takes as advice. */
const DEPLOY_GUIDANCE = [
  { re: /\buse this in production\b/i, why: 'tells the reader to use demo code in production' },
  { re: /\bproduction[- ]ready\b(?!\s*[:\-—]?\s*no)/i, why: 'describes demo code as production-ready' },
  { re: /\bsafe to (?:use|deploy)\b/i, why: 'asserts safety of demo code' },
  { re: /\bdeploy this (?:to|in) production\b/i, why: 'instructs deployment of demo code' },
  { re: /\bin a real deployment\b/i, why: 'reads as deployment guidance beside demo behaviour' },
  { re: /\bready for production\b/i, why: 'describes demo code as ready for production' },
];

const ENGINES = ['chromium', 'firefox', 'webkit'];

function walk(dir, out = [], base = dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    const rel = path.relative(base, p);
    if (SKIP_DIR.test(rel)) continue;
    if (e.isDirectory()) walk(p, out, base);
    else out.push(rel);
  }
  return out;
}

const read = (lab, rel) => {
  try { return fs.readFileSync(path.join(SCRATCH, lab, rel), 'utf8'); } catch { return null; }
};

/* Executable text only, comments blanked, line numbers preserved. Uses the
   lexer in catalog-evidence.js rather than a second copy. */
const { blankComments } = require('./catalog-evidence.js');
const readCode = (lab, rel) => {
  const t = read(lab, rel);
  if (t === null) return null;
  if (!/\.(ts|tsx|js|jsx|mjs|cjs|rs)$/.test(rel)) return t;
  try { return blankComments(t); } catch { return t; }
};

/** First line matching a pattern, 1-indexed. */
function lineOf(text, re) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) if (re.test(lines[i])) return i + 1;
  return null;
}

const IS_TEST = (rel) => /(^|\/)(tests?|__tests__|e2e|spec)(\/|$)/.test(rel)
  || /\.(test|spec)\.[a-z]+$/.test(rel)
  || /(^|\/)tests?\/.*\.rs$/.test(rel)
  /* A suite that is not in a test directory is still a suite.
     crypto-lab-j-uniward's entire `npm test` is scripts/test.ts, and it was
     invisible to three dimensions at once while nothing reported the gap. */
  || /(^|\/)scripts\/test\.[a-z]+$/.test(rel);


/* ---- C: a rendered value compared with a COMPUTED one --------------------
 *
 * The first version credited C on the PRESENCE of a `claims.spec.` file, and an
 * adversarial pass measured what that was worth: 145 labs had such a file and
 * all 145 scored `+`; 66 did not and none did. A column everything passes
 * inflates every rank it appears in and discriminates nothing.
 *
 * The dimension asks whether a test asserts that what the page DISPLAYS matches
 * what the code COMPUTED. So the expected side has to be an expression - a
 * variable, a call, an arithmetic result - and not a literal. Asserting that a
 * panel reads "0 hex digits differ" checks the page against a sentence someone
 * typed; asserting it equals `digestBefore` checks it against the computation.
 *
 * Getting the literal test right took three passes, each failure a false credit:
 * an array of strings `['KAT MATCH','KAT MATCH']` is not computed; a trailing
 * `{ timeout: 60_000 }` is an option and not an expected value; a regex is a
 * pattern; and `[^)]*` argument capture stops at the first `)`, which in
 * `toContainText('... reproduce asconEncrypt() exactly')` sits INSIDE the string
 * and leaves an unterminated literal that reads as an expression.
 */
const C_READS = /textContent|innerText|innerHTML|allTextContents|inputValue|toHaveText|toContainText|getByTestId|getByRole/;

/** Arguments of the call starting at or after `from`, with balanced parens, quotes respected. */
function argsFrom(line, from) {
  const open = line.indexOf('(', from);
  if (open < 0) return null;
  let depth = 0;
  let quote = null;
  for (let i = open; i < line.length; i += 1) {
    const c = line[i];
    if (quote) { if (c === '\\') i += 1; else if (c === quote) quote = null; continue; }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (c === '(') depth += 1;
    else if (c === ')') { depth -= 1; if (depth === 0) return line.slice(open + 1, i); }
  }
  return line.slice(open + 1);
}

/** The first argument only; a trailing options object is not an expected value. */
function firstArg(args) {
  let depth = 0;
  let quote = null;
  for (let i = 0; i < args.length; i += 1) {
    const c = args[i];
    if (quote) { if (c === '\\') i += 1; else if (c === quote) quote = null; continue; }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if ('([{'.includes(c)) depth += 1;
    else if (')]}'.includes(c)) depth -= 1;
    else if (c === ',' && depth === 0) return args.slice(0, i);
  }
  return args;
}

/** Literal if nothing but literal material survives stripping. */
function isLiteralExpr(expr) {
  return expr
    .replace(/\/(?:[^/\\\n]|\\.)+\/[gimsuy]*/g, ' ')
    .replace(/`(?:[^`\\$]|\\.|\$(?!\{))*`/g, ' ')
    .replace(/'(?:[^'\\]|\\.)*'/g, ' ')
    .replace(/"(?:[^"\\]|\\.)*"/g, ' ')
    .replace(/\b(?:true|false|null|undefined|NaN)\b/g, ' ')
    .replace(/-?\d[\d_.eE]*/g, ' ')
    .replace(/[[\]{},:\s]/g, '') === '';
}

function classify(lab, files) {
  const src = files.filter((f) => !VENDORED.test(f));
  const tests = src.filter((f) => IS_TEST(f) && /\.(ts|tsx|js|jsx|mjs|cjs|rs|py)$/.test(f));
  const rustInline = src.filter((f) => /\.rs$/.test(f) && !IS_TEST(f));
  const workflows = src.filter((f) => /^\.github\/workflows\/.+\.ya?ml$/.test(f));
  const evidence = {};
  const note = {};

  /* ---- T: a named published source and fixed material in the same file ---- */
  let T = '0';
  /* Harness specs are excluded as ground-truth CANDIDATES. A citation in an axe
     spec header or a stale copy-pasted comment is not a pinned vector, and those
     leads were the whole source of the `?` mark - which silently removed four
     points from the denominator and published labs at full marks on the strength
     of a sentence describing a different lab. */
  /* e2e specs are excluded entirely, not just the harness ones. A published
     vector lives in a unit test or a fixture module; a standard named in a
     browser spec is prose. crypto-lab-protocol-checker carried a stale
     copy-pasted comment about "the conformance table of NIST CAVP vectors" -
     describing a different lab - and that sentence alone moved four points out
     of its denominator and published it at full marks. */
  const HARNESS = /(a11y|accessib|contrast|layout|theme|nontext|visual|screenshot)/i;
  /* Only a real e2e DIRECTORY. Excluding every `*.spec.*` filename also excluded
     crypto-lab-point-ledger/tests/hashes.spec.ts, a vitest unit test pinning a
     NIST CAVP SHAKE256 digest - as clean a ground-truth pin as any in the
     reference list, dropped on the strength of its filename. */
  const IS_E2E = /(^|\/)e2e(\/|$)/;
  const tCandidates = [...tests.filter((f) => !HARNESS.test(f) && !IS_E2E.test(f)), ...rustInline,
    ...src.filter((f) => /(^|\/)(fixtures?|vectors?|kats?|test-?vectors?)(\.|\/|$)/i.test(f))];
  let leadOnly = null;
  for (const f of tCandidates) {
    const text = read(lab, f);
    if (!text) continue;
    const hit = PUBLISHED.find((p) => p.re.test(text));
    if (!hit) continue;
    const at = lineOf(text, hit.re);
    /* Within a window of the citation, not merely somewhere in the same file. A
       standard named in a header comment and an unrelated hex blob four hundred
       lines later are two facts, not one vector. */
    const lines = text.split('\n');
    const near = lines.slice(Math.max(0, at - 30), at + 60).join('\n');
    let hasFixed = FIXED_HEX.test(near) || FIXED_BYTES.test(near) || FIXED_INTS.test(near);
    /* A citing test often imports the vectors rather than inlining them:
       crypto-lab-kem-trap's live in ../kem/vectors.ts, crypto-lab-lattice-gentle's
       in ../fq/lwe.ts as integer matrices. Follow the file's own relative imports
       one hop before concluding the citation stands alone. */
    if (!hasFixed) {
      for (const m of text.matchAll(/from\s*['"](\.[^'"]+)['"]/g)) {
        const base = path.join(path.dirname(f), m[1].replace(/\.(ts|js|mjs)$/, ''));
        for (const ext of ['.ts', '.js', '.mjs', '.json', '/index.ts']) {
          const t2 = read(lab, base + ext);
          if (!t2) continue;
          if (FIXED_HEX.test(t2) || FIXED_BYTES.test(t2) || FIXED_INTS.test(t2)) {
            hasFixed = true;
            note.T = `cited here; fixed material in ${base + ext}`;
          }
          break;
        }
        if (hasFixed) break;
      }
    }
    if (hasFixed) {
      T = '+';
      evidence.T = `${f}:${at}`;
      /* Do not clobber the one-hop note: it is the only thing that says the
         material is in an imported module rather than beside the citation. */
      if (!note.T) note.T = `${hit.name} cited beside fixed material`;
      break;
    }
    if (!leadOnly) leadOnly = { f, at, name: hit.name };
  }
  if (T === '0' && leadOnly) {
    T = '?';
    evidence.T = `${leadOnly.f}:${leadOnly.at}`;
    note.T = `${leadOnly.name} named without fixed material in the same file — a lead, not a pinned vector`;
  }
  if (T === '0' && !tests.length && !rustInline.length) { T = '?'; note.T = 'no readable test files'; }
  if (T === '0' && !note.T) note.T = 'no named published source cited beside fixed material';

  /* ---- I: an outside implementation, or a verification script ---- */
  let I = '0';
  const verifyScript = src.find((f) => /(^|\/)(verification|verify|contrast)(\/|$)/i.test(f) && /\.(ts|js|mjs|sh|py|rs)$/.test(f));
  for (const f of tests.concat(rustInline)) {
    const text = readCode(lab, f);
    if (!text) continue;
    if (/\.rs$/.test(f)) {
      const m = OUTSIDE_RUST.exec(text);
      if (!m) continue;
      I = '+'; evidence.I = `${f}:${lineOf(text, OUTSIDE_RUST)}`; note.I = 'test calls into an outside crate';
      break;
    }
    const lines = text.split('\n');
    let found = null;
    for (let i = 0; i < lines.length && !found; i += 1) {
      for (const m of lines[i].matchAll(/(?:from\s*|require\(\s*|import\(\s*)['"]([^'"]+)['"]/g)) {
        if (m[1].startsWith('.')) continue;
        if (!OUTSIDE_MODULE(m[1])) continue;
        if (/^(?:node:)?crypto$/i.test(m[1]) && STUBBED.test(text)) continue;
        found = { line: i + 1, spec: m[1] };
        break;
      }
    }
    if (!found) continue;
    I = '+'; evidence.I = `${f}:${found.line}`; note.I = `test imports ${found.spec}`;
    break;
  }
  /* A script called `verify` that imports only the lab's own src verifies the lab
     against itself, which is the thing this dimension is defined against. */
  if (I === '0' && verifyScript) {
    const vt = readCode(lab, verifyScript) || '';
    const outsideImport = [...vt.matchAll(/(?:from\s*|require\(\s*)['"]([^'"]+)['"]/g)]
      .some((m) => !m[1].startsWith('.') && OUTSIDE_MODULE(m[1]));
    if (outsideImport) { I = '+'; evidence.I = `${verifyScript}:1`; note.I = 'verification script reads an outside implementation'; }
    else note.I = 'a verify script is present but imports only this lab\'s own source';
  }
  if (I === '0' && !tests.length && !rustInline.length) { I = '?'; note.I = 'no readable test files'; }

  /* ---- C: a rendered value compared with a computed one ---- */
  let C = '0';
  {
    const candidates = tests.filter((f) => !/(a11y|accessib|contrast|layout|theme|nontext|visual|screenshot)/i.test(f)
      && !/(^|\/)gate\.[tj]s$/.test(f));
    if (!candidates.length) { C = '?'; note.C = 'no readable non-harness test files'; }
    let literalOnly = null;
    for (const f of candidates) {
      if (C === '+') break;
      const text = readCode(lab, f);
      if (!text) continue;
      /* Locals holding something read off the page. */
      const rendered = new Set();
      for (const m of text.matchAll(/(?:const|let|var)\s+\{?\s*([\w,\s]+?)\s*\}?\s*=\s*[^;\n]*(?:textContent|innerText|innerHTML|allTextContents|inputValue)/g)) {
        for (const n of m[1].split(',')) rendered.add(n.trim());
      }
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        const tx = /\.(?:toHaveText|toContainText)\(/.exec(line);
        if (tx) {
          const a = argsFrom(line, tx.index);
          if (a && a.trim() && !isLiteralExpr(firstArg(a))) {
            C = '+'; evidence.C = `${f}:${i + 1}`;
            note.C = `rendered text compared with ${firstArg(a).trim().slice(0, 48)}`;
            break;
          }
        }
        const ex = /expect\(\s*([\w.[\]'"]+)/.exec(line);
        const cmp = /\.\s*(?:toBe|toEqual|toStrictEqual)\(/.exec(line);
        if (ex && cmp) {
          const a = argsFrom(line, cmp.index);
          const actual = ex[1].split(/[.[]/)[0];
          if (a && a.trim() && (rendered.has(actual) || C_READS.test(line)) && !isLiteralExpr(firstArg(a))) {
            C = '+'; evidence.C = `${f}:${i + 1}`;
            note.C = `page value compared with ${firstArg(a).trim().slice(0, 48)}`;
            break;
          }
        }
        if (!literalOnly && C_READS.test(line) && /expect\(|assert/.test(line)) literalOnly = `${f}:${i + 1}`;
      }
    }
    if (C === '0') {
      evidence.C = literalOnly;
      note.C = literalOnly
        ? 'asserts rendered text, but only against literals'
        : 'no assertion comparing a rendered value with a computed one';
    }
  }

  /* ---- N: something fails when it should ---- */
  let N = '0';
  for (const f of tests.concat(rustInline)) {
    const text = readCode(lab, f);
    if (!text) continue;
    /* Accessibility and contrast specs are where a `throw` in a helper lives; a
       negative test is about the lab's own reject path, not the harness's. */
    if (/(a11y|accessib|contrast|border-contrast|nontext)/i.test(f)) continue;
    const lines = text.split('\n');
    let hit = null;
    for (let i = 0; i < lines.length && !hit; i += 1) {
      if (NEGATIVE_ASSERT.test(lines[i])) hit = { line: i + 1, why: 'asserts a throw or rejection' };
      else {
        const t = TEST_TITLE.exec(lines[i]);
        if (t && NEGATIVE_NAME.test(t[2])) hit = { line: i + 1, why: `a case named "${t[2].slice(0, 60)}"` };
      }
    }
    if (!hit) continue;
    N = '+'; evidence.N = `${f}:${hit.line}`; note.N = hit.why;
    break;
  }
  if (N === '0' && !tests.length && !rustInline.length) { N = '?'; note.N = 'no readable test files'; }

  /* ---- G: what the deploy waits for, engines named not inferred ---- */
  let G = '?';
  const gate = { engines: [], steps: [], workflow: null, job: null };
  /* Job-scoped, not file-scoped. G is defined as what the DEPLOY waits for, and
     scanning the whole workflow file credited crypto-lab-bitcoin-script with unit
     tests its publisher job never runs - they belong to the Dependabot auto-merge
     job further down the same file. The publisher job and its `needs` chain are
     the gate; everything else in the file is another job's business. */
  const jobsOf = (text) => {
    const at = text.indexOf('\njobs:');
    if (at < 0) return new Map();
    const body = text.slice(at);
    const starts = [...body.matchAll(/^ {2}([\w-]+):\s*$/gm)];
    const map = new Map();
    for (let i = 0; i < starts.length; i += 1) {
      const from = starts[i].index;
      const to = i + 1 < starts.length ? starts[i + 1].index : body.length;
      map.set(starts[i][1], body.slice(from, to));
    }
    return map;
  };
  for (const wf of workflows) {
    const text = read(lab, wf);
    if (!text) continue;
    if (!/actions\/deploy-pages|peaceiris\/actions-gh-pages/.test(text)) continue;
    gate.workflow = wf;
    const jobs = jobsOf(text);
    let publisher = null;
    for (const [name, body] of jobs) {
      if (/actions\/deploy-pages|peaceiris\/actions-gh-pages/.test(body)) { publisher = name; break; }
    }
    /* Walk needs transitively; a gate reached through two hops is still the gate. */
    const seen = new Set();
    const queue = publisher ? [publisher] : [...jobs.keys()];
    while (queue.length) {
      const n = queue.shift();
      if (!n || seen.has(n) || !jobs.has(n)) continue;
      seen.add(n);
      const needs = /^\s*needs:\s*(.+)$/m.exec(jobs.get(n));
      if (needs) {
        for (const dep of needs[1].replace(/[[\]'"]/g, '').split(',')) queue.push(dep.trim());
      }
    }
    gate.job = publisher;
    /* Comments do not run. tools-sync.js already carries this lesson for the
       cadence table; here a comment above the auto-merge job reading
       "TypeScript 7, vitest 4" credited crypto-lab-bitcoin-script's deploy with
       unit tests it does not run. */
    const scoped = [...seen].map((n) => jobs.get(n)).join('\n')
      .split('\n').filter((l) => !/^\s*#/.test(l)).join('\n');

    if (/\bnpm (?:run )?test\b(?!:)|\bvitest\b|\bjest\b|\bcargo test\b/.test(scoped)) gate.steps.push('unit tests');
    if (/playwright test\b|\bnpm run test:e2e\b|\bnpm run e2e\b/.test(scoped)) gate.steps.push('browser tests');
    if (/axe|a11y|accessibility/i.test(scoped)) gate.steps.push('accessibility scan');
    if (/coverage/i.test(scoped)) gate.steps.push('coverage');
    if (/bundle|size-limit|budget/i.test(scoped)) gate.steps.push('bundle budget');

    /* An engine counts only if the deploying chain INSTALLS it and the config
       enables it without an env switch that chain never sets.
       crypto-lab-traitor-trace was published as gating three engines: its
       workflow installs chromium alone, and firefox and webkit sit behind
       `...(allBrowsers ? [...] : [])` keyed on ALL_BROWSERS, which nothing sets.
       The brief says name the engines and do not infer them, and inferring them
       from a config the job does not honour is the same error as trusting a README. */
    const explicit = [...scoped.matchAll(/--project[= ]([a-zA-Z-]+)/g)]
      .map((m) => m[1].toLowerCase()).filter((e) => ENGINES.includes(e));
    const installLines = [...scoped.matchAll(/playwright install[^\n]*/g)].map((m) => m[0]);
    const installsAll = installLines.some((l) => !ENGINES.some((e) => l.includes(e)));
    const installed = installsAll ? ENGINES.slice()
      : ENGINES.filter((e) => installLines.some((l) => l.includes(e)));
    const envGated = new Set();
    const configured = [];
    const cfg = src.find((f) => /^playwright\.config\.[tj]s$/.test(f));
    if (cfg) {
      const c = read(lab, cfg) || '';
      for (const e of ENGINES) {
        const m = new RegExp(`name:\\s*['"\`]${e}`, 'i').exec(c);
        if (!m) continue;
        configured.push(e);
        const before = c.slice(Math.max(0, m.index - 500), m.index);
        const g = /\.\.\.\(\s*([\w.]+)\s*\?|\b([\w.]+)\s*\?\s*\[/.exec(before);
        if (!g) continue;
        const envName = /process\.env\.([A-Z_]+)/.exec(before);
        const setsEnv = envName ? new RegExp(`\\b${envName[1]}\\b`).test(scoped) : false;
        if (!setsEnv) envGated.add(e);
      }
    }
    gate.engines = (explicit.length ? explicit : configured)
      .filter((e) => !envGated.has(e))
      /* A chain that installs no browser establishes no engine. The previous
         fallthrough turned an empty install list into "do not filter", so
         crypto-compare carried G=0 and an engine name at the same time - the
         traitor-trace error wearing different clothes. */
      .filter((e) => (explicit.length ? true : installed.includes(e)));
    gate.engineNote = [];
    if (envGated.size) gate.engineNote.push(`${[...envGated].join(', ')} behind an env switch the deploying chain does not set`);
    if (installed.length && configured.length && installed.length < configured.length) {
      gate.engineNote.push(`the chain installs ${installed.join(', ')}`);
    }

    G = gate.steps.length ? '+' : '0';
    evidence.G = `${wf}:${lineOf(text, /actions\/deploy-pages|peaceiris\/actions-gh-pages/)}`;
    note.G = gate.steps.length
      ? `deploy waits for ${gate.steps.join(', ')}${gate.engines.length ? ` in ${gate.engines.join(', ')}` : ''}`
        + (gate.engineNote.length ? ` (${gate.engineNote.join('; ')})` : '')
      : 'a publisher job whose chain runs no test step';
    break;
  }
  if (!gate.workflow) note.G = 'no publisher action found in any workflow';

  /* ---- H: limits stated, and copy that reads as advice ---- */
  let H = '0';
  const readme = read(lab, 'README.md');
  const guidance = [];
  if (readme === null) { H = '?'; note.H = 'no README.md in the export'; }
  else {
    const at = lineOf(readme, LIMITS);
    if (at) { H = '+'; evidence.H = `README.md:${at}`; note.H = 'README states scale or limits'; }
    else note.H = 'no scale or limits language found in README.md';
    for (const g of DEPLOY_GUIDANCE) {
      const l = lineOf(readme, g.re);
      if (l) guidance.push({ file: 'README.md', line: l, why: g.why });
    }
  }
  /* Page copy counts too: the reader sees it without opening the README. */
  for (const f of src.filter((x) => /^(src|demos|web|exhibits)\/.*\.(ts|tsx|js|jsx|html)$/.test(x)).slice(0, 400)) {
    const text = read(lab, f);
    if (!text) continue;
    for (const g of DEPLOY_GUIDANCE) {
      const l = lineOf(text, g.re);
      if (l) { guidance.push({ file: f, line: l, why: g.why }); break; }
    }
    if (guidance.length > 6) break;
  }

  /* ---- Z, structural only: an escape that lets a step report nothing ---- */
  const pkgText = read(lab, 'package.json');
  let pkg = null;
  try { pkg = pkgText ? JSON.parse(pkgText) : null; } catch { pkg = null; }
  const testScript = pkg && pkg.scripts && pkg.scripts.test;
  const zHazard = [];
  if (pkg && !testScript) zHazard.push('package.json declares no test script');
  if (testScript && /--passWithNoTests/.test(testScript)) zHazard.push('test script passes with no tests');
  for (const wf of workflows) {
    const text = read(lab, wf) || '';
    if (/npm test --if-present/.test(text) && !testScript) zHazard.push(`${wf} runs npm test --if-present with no test script`);
  }

  /* ---- unreadable languages, reported not scored ---- */
  const unread = new Map();
  for (const f of files) {
    const m = /\.(rs|go|py|c|cc|cpp|java|cs|swift|wasm)$/.exec(f);
    if (m) unread.set(m[1], (unread.get(m[1]) || 0) + 1);
  }
  const vendoredPaths = files.filter((f) => VENDORED.test(f)).length;

  const dims = { T, I, C, N, G, H };
  let earned = 0;
  let assessed = 0;
  for (const [k, v] of Object.entries(dims)) {
    if (v === '?') continue;
    assessed += WEIGHTS[k];
    if (v === '+') earned += WEIGHTS[k];
  }
  return { lab, dims, evidence, note, earned, assessed, gate, guidance, zHazard, unread: [...unread].map(([k, n]) => `${k}:${n}`), vendoredPaths, testCount: tests.length };
}

function labs() {
  try {
    return [...require('./depth-exports.js').readExports(SCRATCH).keys()].sort();
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }
}

function shas() {
  return require('./depth-exports.js').readExports(SCRATCH);
}

module.exports = { classify, walk, labs, shas, WEIGHTS };

if (require.main === module) require('./depth-audit-report.js').main();
