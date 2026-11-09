#!/usr/bin/env node
/*
 * build-audit-corpus.js — generate corpus/ so an external auditor can read every
 * lab from one fetch instead of cloning 252 repositories.
 *
 * Run: node scripts/build-audit-corpus.js [--out <dir>] [--lab <slug>] [--limit N] [--check]
 * Prevents: an audit conducted against whatever a lab's page happened to show on
 *   the day, with no commit to cite and no way to tell a missing field from an
 *   absent one.
 * Reads: index.html (the registry, via tools/card-reader.js); each lab checkout
 *   under the fleet root, through tools/clone-source.js so a dirty clone is read
 *   from its committed HEAD; tools/lab-pages.js for page discovery.
 *
 * THREE DECISIONS WORTH KNOWING BEFORE READING THE CODE
 *
 * 1. The registry is index.html's cards, never a list here. CLAUDE.md makes
 *    index.html the single source of truth, and every count in this fleet that
 *    was DISCOVERED rather than DECLARED has eventually gone quiet and wrong. A
 *    card whose href this tool cannot resolve is a hard failure, not a skip.
 *
 * 2. commit_sha is the commit actually READ, not the default branch's tip.
 *    Those differ: on 2026-11-08 a fleet-wide fetch left 113 clones behind their
 *    remotes. Pinning origin/main while reading the working tree would cite a
 *    commit whose bytes were never opened -- the "answering from a copy" defect
 *    in CLAUDE.md's own table. So commit_sha is the read commit, and
 *    remote_head/commits_behind are recorded beside it so staleness is visible
 *    rather than hidden. An auditor citing commit_sha is citing bytes we read.
 *
 * 3. A field that could not be found is `missing`, never inferred, and every
 *    field that WAS found records the file it came from in `sources`. That is
 *    CLAUDE.md's first-step rule -- print the source you opened next to the
 *    claim you made about it -- applied per field, so a wrong value can be
 *    traced to the file that produced it instead of to this generator.
 *
 * It never writes to a lab. Every lab path is opened read-only; the only writes
 * are into the hub's own corpus/ directory.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HUB = path.resolve(__dirname, '..');
const FLEET_ROOT = path.resolve(HUB, '..');
const { readCards, hreflessLine } = require(path.join(HUB, 'tools/card-reader.js'));
const { sourceRoot, tornSnapshot } = require(path.join(HUB, 'tools/clone-source.js'));
const { htmlPages, sourceFiles, styleFiles } = require(path.join(HUB, 'tools/lab-pages.js'));

const MAX_README = 400_000;
const MAX_FILE = 200_000;
const SHARD_THRESHOLD = 4 * 1024 * 1024;

/* ---------------------------------------------------------------- utilities */

function git(dir, args) {
  try {
    return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

/*
 * Decode the HTML entities that appear in card and page text.
 *
 * `&amp;` is decoded LAST. It used to be first, which is the same
 * js/double-escaping defect this round fixed in concept-sync.js and
 * teach-build.js -- and I wrote this one, in the same pass, without noticing:
 * decoding `&amp;` first turns `&amp;lt;script` into `&lt;script` and then into
 * `<script`, so an author who wrote a literal entity gets a tag.
 *
 * Tags are stripped repeatedly rather than once. For this pattern the `/g` scan
 * is already exhaustive and no input is known where one pass and the loop
 * disagree, so the alert is pattern-shaped; the loop makes idempotence a property
 * of the code rather than an argument about a regex.
 */
function decode(s) {
  let out = String(s);
  for (let prev = null; out !== prev;) { prev = out; out = out.replace(/<[^>]*>/g, ''); }
  return out
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&rarr;/g, '\u2192').replace(/&mdash;/g, '\u2014').replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/*
 * Line endings are normalised at the read boundary. Some clones hold CRLF files
 * that git reports as clean, and 95 lines of one lab's README arrived in
 * corpus/labs-full-post-quantum.md with CR intact. That is not cosmetic: git
 * normalises CRLF to LF on commit, so the committed corpus would never equal the
 * generated one, and the refresh workflow would propose the same diff forever
 * while reporting the corpus as stale. Normalising here makes the output a
 * function of the content rather than of a lab's editor.
 */
/* --------------------------------------- local paths must not be published */

/*
 * corpus/ is served from main at crypto-lab.systemslibrarian.dev, so every byte a
 * lab contributes to a record is PUBLISHED. Lab content sometimes carries the
 * absolute path of the checkout it was produced in: crypto-lab-vector-gate
 * committed audits/mutation-observations.json holding a lane worktree path 14
 * times -- vitest printing its project root and Playwright printing absolute
 * stack frames -- and the first run of this generator put all 14 into
 * corpus/labs.jsonl.
 *
 * A working copy's location is not a fact about a lab. Where the path is inside
 * the checkout being read, the repo-relative remainder IS the fact and is kept:
 * `e2e/claims.spec.ts:25` is that line in every clone. Anything else
 * home-rooted -- another checkout, a browser cache, a path from a machine this
 * run knows nothing about -- has no repo-relative form, and becomes the literal
 * <local-path>, because inventing one would be worse than recording that a path
 * was removed.
 *
 * Done HERE and nowhere else. The corpus is generated, so a hand-edit would be
 * undone by the next run while looking like a fix.
 */

/*
 * Sources rather than RegExp objects: a /g regex carries lastIndex, so one
 * shared object makes .test() answer about where the previous call stopped.
 *
 * The lookbehind is the part that matters. `/home/[^/]+` with no left boundary
 * matches inside `https://example.com/home/index.html`, so the naive shape
 * corrupts ordinary lab prose and link text -- it would have rewritten a URL as
 * <local-path> and called that a privacy fix. Excluding a preceding word
 * character, dot, colon or hyphen keeps every such case out while still catching
 * `file:///Users/...`, where the preceding character is a slash.
 */
const LOCAL_PATH_SHAPES = [
  '(?<![\\w.:-])/Users/[^/\\s"\'`]+(?:/[^\\s"\'`]*)?',
  '(?<![\\w.:-])/home/[^/\\s"\'`]+(?:/[^\\s"\'`]*)?',
  '(?<![\\w.:-])[A-Za-z]:\\\\Users\\\\[^\\\\\\s"\'`]+(?:\\\\[^\\s"\'`]*)?',
];
const localPathRe = () => new RegExp(LOCAL_PATH_SHAPES.join('|'), 'g');

/** Every home-rooted absolute path in `text`. */
function localPathsIn(text) {
  return typeof text === 'string' ? text.match(localPathRe()) || [] : [];
}

/**
 * Rewrites every absolute local path in `text`.
 *
 * `bases` are the directories this record was read from -- the clone, and the
 * export a dirty clone is read through. A path under one of them keeps the part
 * that is true of every checkout; the base itself becomes `.`; everything else
 * home-rooted becomes <local-path>.
 */
function withoutLocalPaths(text, bases = []) {
  if (typeof text !== 'string') return text;
  let out = text;
  for (const base of bases.filter(Boolean).sort((a, b) => b.length - a.length)) {
    out = out.split(base + '/').join('');
    out = out.split(base + '\\').join('');
    out = out.split(base).join('.');
  }
  return out.replace(localPathRe(), '<local-path>');
}

/** `withoutLocalPaths` over every string in a record, at any depth. */
function scrubLocalPaths(value, bases) {
  if (typeof value === 'string') return withoutLocalPaths(value, bases);
  if (Array.isArray(value)) return value.map((v) => scrubLocalPaths(v, bases));
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) value[k] = scrubLocalPaths(value[k], bases);
    return value;
  }
  return value;
}

/**
 * Where a local path survives into a record, by slug and field path.
 *
 * The guard below fails on the assembled OUTPUT, because "reaches labs.jsonl" is
 * the thing being prevented. This locates the cause, so the failure names a lab
 * and a field instead of a byte offset in a 50,000-line document.
 */
/**
 * Which published documents carry a local path.
 *
 * Separate from main() so it can be handed a poisoned document in a test: a
 * refusal that only ever runs over clean input is a refusal nobody has seen
 * fire. `published` is [{ file, text }] -- the ASSEMBLED text, because "reaches
 * corpus/labs.jsonl" is the thing being prevented and the text is what reaches
 * it.
 */
function publishedLeaks(published) {
  return published
    .map((d) => ({ file: d.file, hits: localPathsIn(d.text) }))
    .filter((d) => d.hits.length);
}

function localPathFindings(records) {
  const out = [];
  for (const r of records) {
    (function walk(v, at) {
      if (typeof v === 'string') {
        for (const hit of localPathsIn(v)) out.push({ slug: r.slug, field: at, path: hit });
      } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${at}[${i}]`));
      else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], at ? `${at}.${k}` : k);
    })(r, '');
  }
  return out;
}

function readIf(file, cap = MAX_FILE) {
  try {
    const st = fs.statSync(file);
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
    return { text: text.length > cap ? text.slice(0, cap) : text, bytes: st.size, truncated: text.length > cap };
  } catch {
    return null;
  }
}


/*
 * Comments are stripped before any value is read out of a file. Measured need:
 * `crypto-lab-quantum-vault-kpqc` carries the sentence "This lab sets
 * --accent:#003478, the Taegukgi navy, on an ..." in a CSS comment, and a plain
 * match on `--accent:` captured the prose. The real declaration is 61 lines
 * lower. A generator that reads a comment as a value publishes an explanation as
 * a fact.
 */
function stripComments(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');
}

/* A CSS value, not a sentence. Anything else is reported MISSING rather than
   guessed at, which is the whole point of the `missing` list. */
const CSS_VALUE = /^(#[0-9a-fA-F]{3,8}|[a-zA-Z-]+\([^)]*\)|[a-zA-Z]+)$/;

/*
 * Three hero idioms exist in this fleet and a reader of any one of them is blind
 * to the other two: 213 labs write the class in markup, 29 build the element
 * programmatically as `el('h1', { class: 'cl-hero-title' }, ['Name'])`, and some
 * put the markup in a template literal inside src/. `crypto-lab-context-ward`
 * is the case to keep: its page has no `<h1>` anywhere, because `src/ui/app.ts`
 * constructs one. Searched with markup patterns alone it reported four missing
 * hero fields -- a finding about the lab that was a finding about the search.
 */

/*
 * FOUR hero idioms exist, and each of the first three readers was blind to the
 * next one found. Counted over the 252 carded labs: 213 write the class in
 * markup; 29 build the element with a children array,
 * `el('h1', { class: 'cl-hero-title' }, ['Name'])`; and 20 put the text in the
 * ATTRIBUTE object instead, `el('h1', { class: 'cl-hero-title', text: 'KEM Trap' })`.
 * A regex for the children form reported those 20 as having no name at all --
 * `crypto-lab-kem-trap`, whose own gate asserts `.cl-hero-title` reads
 * "KEM Trap", among them. So this parses the call rather than pattern-matching
 * one shape of it: find the balanced attribute object, confirm the class, then
 * take `text:` from that object or the first string of a following array.
 */

/*
 * A sixth shape, imperative rather than declarative: crypto-lab-mls-group writes
 *   const h1 = document.createElement('h1');
 *   h1.className = 'cl-hero-title';
 *   h1.textContent = 'MLS Group';
 * No call to parse and no markup to match. The backreference on the variable name
 * is what keeps this from pairing one element's class with another's text.
 */
function imperativeValue(text, cls) {
  const re = new RegExp(
    "([A-Za-z_$][\\w$]*)\\.className\\s*=\\s*['\"`][^'\"`]*" + cls + "[^'\"`]*['\"`]\\s*;",
    'g'
  );
  let m;
  while ((m = re.exec(text)) !== null) {
    const v = m[1];
    const after = text.slice(m.index, m.index + 1200);
    const t = new RegExp("\\b" + v + "\\.(?:textContent|innerText|innerHTML)\\s*=\\s*['\"`]([\\s\\S]*?)['\"`]").exec(after);
    if (t && t[1].trim()) return t[1];
  }
  return null;
}

function builderValue(text, cls) {
  /* The builder is not always called `el`: crypto-lab-sector-vault calls it `h`.
     Keying on the name made a sixth idiom out of a rename, so this matches ANY
     call whose first argument is a quoted tag name and second is an object; the
     class check below is what makes that safe. */
  const re = /\b[A-Za-z_$][\w$]*\(\s*['"`]\w+['"`]\s*,\s*\{/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const open = text.indexOf('{', m.index);
    let depth = 0, close = -1;
    for (let i = open; i < text.length && i < open + 4000; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') { depth--; if (depth === 0) { close = i; break; } }
    }
    if (close === -1) continue;
    const obj = text.slice(open, close + 1);
    const classRe = new RegExp("class(?:Name)?\\s*:\\s*['\"`][^'\"`]*" + cls + "[^'\"`]*['\"`]");
    if (!classRe.test(obj)) continue;
    const t = /\btext\s*:\s*['"`]([\s\S]*?)['"`]/.exec(obj);
    if (t && t[1].trim()) return t[1];
    const after = text.slice(close + 1, close + 600);
    /* Children arrive three ways: ['Name'], 'Name', or not at all (text: in the
       object, handled above). kdf-chain and bitcoin-script use the bare string. */
    const arr = /^\s*,\s*\[\s*['"`]([\s\S]*?)['"`]/.exec(after);
    if (arr && arr[1].trim()) return arr[1];
    const bare = /^\s*,\s*['"`]([\s\S]*?)['"`]/.exec(after);
    if (bare && bare[1].trim()) return bare[1];
  }
  return null;
}

function builderPattern(cls) {
  return new RegExp(
    "\\b[A-Za-z_$][\\w$]*\\(\\s*['\"`]\\w+['\"`]\\s*,\\s*\\{[^}]*class\\s*:\\s*['\"`][^'\"`]*" + cls +
    "[^'\"`]*['\"`][^}]*\\}\\s*,\\s*\\[\\s*['\"`]([\\s\\S]*?)['\"`]"
  );
}

/** Any file under `root` whose basename matches, nearest the root first. */
function findFiles(root, re, maxDepth = 5) {
  const out = [];
  (function walk(dir, depth) {
    if (depth > maxDepth) return;
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === 'target' || e.name.startsWith('.')) continue;
      const q = path.join(dir, e.name);
      if (e.isDirectory()) walk(q, depth + 1);
      else if (re.test(e.name)) out.push(path.relative(root, q).split(path.sep).join('/'));
    }
  })(root, 0);
  return out.sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
}

/* --------------------------------------------------------- field extractors */

/*
 * Each extractor returns { value, source } or null. `source` is the repo-relative
 * file the value was read from -- the thing that makes a wrong value traceable.
 * Page files are searched before source files because a lab that ships both has
 * the served copy in the page; labs that BUILD their hero in a template literal
 * are why source files are searched at all.
 */
function firstMatch(root, files, re, group = 1) {
  for (const rel of files) {
    const f = readIf(path.join(root, rel));
    if (!f) continue;
    const m = re.exec(stripComments(f.text));
    if (m && m[group] != null && decode(m[group])) return { value: decode(m[group]), source: rel };
  }
  return null;
}

const HERO_CLASS = {
  name: 'cl-hero-title',
  subtitle: 'cl-hero-sub',
  description: 'cl-hero-desc',
  why_it_matters: 'cl-hero-why-text',
};

const HERO = {
  name: [
    /class="[^"]*cl-hero-title[^"]*"[^>]*>([\s\S]*?)<\//,
    builderPattern('cl-hero-title'),
    /* No loose "anything after el('h1'" fallback here on purpose: it matched the
       CLASS NAME and the scripture footer before it matched a title. builderValue()
       below parses the call instead, which is what actually resolves these. */
    /<h1[^>]*>([\s\S]*?)<\/h1>/,
  ],
  subtitle: [/class="[^"]*cl-hero-sub[^"]*"[^>]*>([\s\S]*?)<\//, builderPattern('cl-hero-sub')],
  description: [/class="[^"]*cl-hero-desc[^"]*"[^>]*>([\s\S]*?)<\//, builderPattern('cl-hero-desc')],
  why_it_matters: [/class="[^"]*cl-hero-why-text[^"]*"[^>]*>([\s\S]*?)<\//, builderPattern('cl-hero-why-text')],
};

/*
 * One function, so the six idioms are tested as a unit rather than through the
 * fleet. tests/audit-corpus.test.cjs feeds it one sample of each.
 */
function heroFrom(text, cls, patterns) {
  const clean = stripComments(text);
  for (const re of patterns || []) {
    const m = re.exec(clean);
    if (m && m[1] != null && decode(m[1])) return decode(m[1]);
  }
  if (!cls) return null;
  const v = builderValue(clean, cls) || imperativeValue(clean, cls);
  return v && decode(v) ? decode(v) : null;
}

function heroField(root, searchFiles, patterns, cls) {
  for (const re of patterns) {
    const hit = firstMatch(root, searchFiles, re);
    if (hit) return hit;
  }
  if (cls) {
    for (const rel of searchFiles) {
      const f = readIf(path.join(root, rel));
      if (!f) continue;
      const clean = stripComments(f.text);
      const v = builderValue(clean, cls) || imperativeValue(clean, cls);
      if (v && decode(v)) return { value: decode(v), source: rel };
    }
  }
  return null;
}

/** `--accent` as written. Prefers a :root declaration, records what it used. */
function accentOf(root, files) {
  for (const rel of files) {
    const f = readIf(path.join(root, rel));
    if (!f) continue;
    const text = stripComments(f.text);
    const rootBlock = /:root[^{]*\{([\s\S]*?)\}/g;
    let m;
    while ((m = rootBlock.exec(text)) !== null) {
      const a = /--accent\s*:\s*([^;}\n]+)/.exec(m[1]);
      if (a && CSS_VALUE.test(a[1].trim())) return { value: a[1].trim(), source: rel, scope: ':root' };
    }
  }
  for (const rel of files) {
    const f = readIf(path.join(root, rel));
    if (!f) continue;
    const text = stripComments(f.text);
    const all = /--accent\s*:\s*([^;}\n"']+)/g;
    let a;
    while ((a = all.exec(text)) !== null) {
      const v = a[1].trim();
      if (CSS_VALUE.test(v)) return { value: v, source: rel, scope: 'declaration outside :root' };
    }
  }
  return null;
}

/*
 * Spec citations, EXACTLY as written. The point of "as written" is that an
 * auditor checking whether a lab cites FIPS 203 against the right section needs
 * the lab's own string, not a normalised one -- and normalising is how
 * "SP 800-227" and "SP 800-22" become the same citation.
 */
const CITE = new RegExp([
  'FIPS\\s*(?:PUB\\s*)?\\d{3}(?:-\\d+)?',
  'RFC\\s*\\d{3,5}',
  '(?:NIST\\s+)?SP\\s*800-\\d+[A-Za-z]?(?:\\s*Rev\\.?\\s*\\d+[a-z]?)?',
  'NIST\\s+IR\\s*\\d+',
  'ePrint\\s*\\d{4}/\\d{3,4}',
  'eprint\\.iacr\\.org/\\d{4}/\\d{3,4}',
  'arXiv:?\\s*\\d{4}\\.\\d{4,5}(?:v\\d+)?',
  'doi\\.org/10\\.\\d{4,9}/[^\\s"\'<>)\\]]+',
  '10\\.\\d{4,9}/[^\\s"\'<>)\\]]{4,}',
  'ISO/IEC\\s*\\d{4,5}(?:-\\d+)?',
  'draft-[a-z0-9-]+-\\d{2}',
  'CHES\\s*\\d{4}', 'Eurocrypt\\s*\\u2019?\\d{2,4}', 'Crypto\\s*\\u2019?\\d{2,4}', 'Asiacrypt\\s*\\d{4}',
].join('|'), 'gi');

function citationsIn(root, files, limitFiles = 40) {
  const seen = new Map();
  for (const rel of files.slice(0, limitFiles)) {
    const f = readIf(path.join(root, rel));
    if (!f) continue;
    const lines = f.text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      CITE.lastIndex = 0;
      let m;
      while ((m = CITE.exec(lines[i])) !== null) {
        const text = m[0].replace(/\s+/g, ' ').trim();
        const key = text.toLowerCase();
        if (!seen.has(key)) seen.set(key, { text, first_seen: { file: rel, line: i + 1 }, occurrences: 0 });
        seen.get(key).occurrences++;
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.text.localeCompare(b.text));
}

/*
 * Claims. Line-oriented on purpose: a brace-matching parse of a Playwright suite
 * is wrong on the first template literal containing a `}`, and a parser that is
 * confidently wrong about a claim is worse here than one that reports the line.
 * `expected_kind` is the distinction MASTER-TEMPLATE 4.1b turns on -- an expected
 * value that is an EXPRESSION was re-derived from the page, a LITERAL was typed
 * by the author -- and it is the first thing an auditor should sort by.
 */
const MATCHER = /\.(toContainText|toHaveText|toHaveValue|toHaveCount|toHaveAttribute|toBeCloseTo|toBe|toEqual|toStrictEqual|toHaveLength|toMatch|toBeVisible|toBeHidden|toBeEnabled|toBeDisabled|toBeChecked|toHaveClass|toHaveTitle|toHaveURL)\s*\(/;

function literalKind(arg) {
  const a = arg.trim();
  if (!a) return 'none';
  if (/^(['"`])(?:\\.|(?!\1)[^\\])*\1$/.test(a) && !/\$\{/.test(a)) return 'literal';
  if (/^-?\d+(\.\d+)?$/.test(a)) return 'literal';
  if (/^\/.*\/[gimsuy]*$/.test(a)) return 'regex';
  return 'expression';
}

function balancedArg(line, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < line.length; i++) {
    const c = line[i];
    if (c === '(') depth++;
    else if (c === ')') { depth--; if (depth === 0) return line.slice(openIdx + 1, i); }
  }
  return line.slice(openIdx + 1);
}

function claimsIn(root, rel) {
  const f = readIf(path.join(root, rel));
  if (!f) return null;
  const lines = f.text.split('\n');
  const tests = [];
  let current = null;
  const TEST = /(?:^|\s)(test|it)(?:\.\w+)*\s*\(\s*(['"`])([\s\S]*?)\2/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = TEST.exec(line);
    if (t) {
      current = { test_name: t[3].trim(), file: rel, line: i + 1, assertions: [] };
      tests.push(current);
      continue;
    }
    if (!/\bexpect\s*\(/.test(line)) continue;
    const mm = MATCHER.exec(line);
    /* No `source_line`. The record already carries file, line, matcher and the
       expected value as written, so the line itself was a fourth copy of
       information an auditor can read with one `sed -n`. It was 4.87 MB of an
       11.4 MB labs.jsonl -- the single largest field in the corpus, and the
       cheapest to drop without losing a fact. */
    const record = {
      line: i + 1,
      matcher: mm ? mm[1] : null,
      expected_as_written: null,
      expected_kind: 'none',
    };
    if (mm) {
      const open = line.indexOf('(', mm.index + mm[0].length - 1);
      const arg = balancedArg(line, open);
      record.expected_as_written = arg.trim().slice(0, 400) || null;
      record.expected_kind = literalKind(arg);
    }
    if (current) current.assertions.push(record);
    else tests.push({ test_name: null, file: rel, line: i + 1, assertions: [record], note: 'assertion outside any test block' });
  }
  return { file: rel, bytes: f.bytes, tests };
}

/* Mutation records, in whatever shape the lab keeps them. Never summarised into
   a count alone: a count is the thing a reader cannot check. */
function mutationSources(root) {
  const out = [];
  (function walk(dir, depth) {
    if (depth > 4) return;
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.')) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p, depth + 1); continue; }
      if (!/mutation/i.test(e.name)) continue;
      const rel = path.relative(root, p).split(path.sep).join('/');
      const f = readIf(p);
      if (!f) continue;
      const rec = { file: rel, bytes: f.bytes, truncated: f.truncated };
      if (/\.json$/i.test(e.name)) {
        /* `parsed` and `text` were the same bytes twice over. The raw text is kept
           only when the JSON does NOT parse, which is the case where it is the
           only evidence of what the file says. */
        try { rec.parsed = JSON.parse(f.text); } catch (err) { rec.parse_error = err.message.split('\n')[0]; rec.text = f.text; }
      } else {
        rec.text = f.text.length > 20_000 ? `${f.text.slice(0, 20_000)}\n/* truncated at 20 KB; the file is ${f.bytes} bytes */` : f.text;
      }
      out.push(rec);
    }
  })(root, 0);
  return out.sort((a, b) => a.file.localeCompare(b.file));
}

function verificationManifest(root) {
  const dir = path.join(root, 'verification');
  if (!fs.existsSync(dir)) return null;
  const files = [];
  (function walk(d, depth) {
    if (depth > 3) return;
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { walk(p, depth + 1); continue; }
      const rel = path.relative(root, p).split(path.sep).join('/');
      const f = readIf(p, 60_000);
      if (f) files.push({ file: rel, bytes: f.bytes, truncated: f.truncated, text: f.text });
    }
  })(dir, 0);
  return { dir: 'verification', files: files.sort((a, b) => a.file.localeCompare(b.file)) };
}

/*
 * Stated limitations. Two sources, kept apart because they are different claims:
 * the README's own "What Can Go Wrong" style sections, and the PAGE's honesty
 * panels. A lab can be honest in one and silent in the other, and collapsing
 * them would hide that.
 */
const HONESTY_CLASS = /class="[^"]*(production-warning|sim-warning|honesty|limitation|not-production|caveat|disclaimer|scope-note)[^"]*"[^>]*>([\s\S]*?)<\/(?:p|div|aside|section)>/gi;
const README_LIMIT_HEADING = /^#{2,4}\s*(What Can Go Wrong|Limitations?|Scope|Honest(?:y| Scoping)|What (?:This|It) Does ?N[O']?T? (?:Prove|Do)|Not Production.*)\s*$/i;

function limitationsOf(root, pages, readmeText) {
  const out = { page_panels: [], readme_sections: [] };
  for (const rel of pages.slice(0, 60)) {
    const f = readIf(path.join(root, rel));
    if (!f) continue;
    HONESTY_CLASS.lastIndex = 0;
    const text = stripComments(f.text);
    let m;
    while ((m = HONESTY_CLASS.exec(text)) !== null) {
      const text = decode(m[2]);
      if (text.length > 20) out.page_panels.push({ file: rel, kind: m[1], text: text.slice(0, 1500) });
    }
  }
  if (readmeText) {
    const lines = readmeText.split('\n');
    let heading = null, buf = [];
    const flush = () => {
      if (heading && buf.length) out.readme_sections.push({ heading, text: buf.join('\n').trim().slice(0, 4000) });
      heading = null; buf = [];
    };
    for (const line of lines) {
      if (/^#{1,6}\s/.test(line)) {
        flush();
        const h = README_LIMIT_HEADING.exec(line);
        if (h) heading = h[1].trim();
        continue;
      }
      if (heading) buf.push(line);
    }
    flush();
  }
  return out;
}

/* ------------------------------------------------------------ per-lab build */

function buildLab(card, generatedAt) {
  const slug = card.slug;
  const dir = path.join(FLEET_ROOT, slug);
  /* The directories this record may legitimately name. A path under one of them
     has a repo-relative form worth keeping; see withoutLocalPaths. */
  const bases = [dir];
  const rec = {
    slug,
    repo: `systemslibrarian/${slug}`,
    repo_url: `https://github.com/systemslibrarian/${slug}`,
    live_url: card.href,
    generated_at: generatedAt,
    commit_sha: null,
    commit_sha_is: 'the commit whose bytes this record was read from',
    remote_head: null,
    commits_behind_remote: null,
    read_from: null,
    missing: [],
    sources: {},
  };

  if (!fs.existsSync(path.join(dir, '.git'))) {
    rec.clone_present = false;
    rec.missing.push('clone');   // never inferred from the card alone
    return scrubLocalPaths(rec, bases);
  }
  rec.clone_present = true;

  const { root, from, dirty } = sourceRoot(dir);
  bases.push(root);
  rec.read_from = from === 'worktree' ? 'working tree (clean)' : `git archive HEAD (${dirty} dirty path(s))`;
  rec.commit_sha = git(dir, ['rev-parse', 'HEAD']);
  rec.remote_head = git(dir, ['rev-parse', 'origin/main']);
  if (rec.commit_sha && rec.remote_head) {
    const n = git(dir, ['rev-list', '--count', `${rec.commit_sha}..${rec.remote_head}`]);
    rec.commits_behind_remote = n === null ? null : Number(n);
  }
  if (!rec.commit_sha) rec.missing.push('commit_sha');

  /* ---- the hub's own registry fields (always present, by construction) */
  const attr = (n) => card.attr(n) || null;
  const pipe = (v) => (v ? v.split('|').map((x) => x.trim()).filter(Boolean) : []);
  const anchored = (v) => pipe(v).map((e) => {
    const at = e.lastIndexOf('@');
    return at === -1 ? { term: e, anchor: null } : { term: e.slice(0, at).trim(), anchor: e.slice(at + 1).trim() };
  });
  rec.card = {
    title: card.title || null,
    kicker: (/class="card-kicker">([^<]*)</.exec(card.block) || [, null])[1],
    copy: decode((/class="project-copy">([\s\S]*?)<\//.exec(card.block) || [, ''])[1]) || null,
    chips: [...card.block.matchAll(/class="chip">([^<]*)</g)].map((m) => decode(m[1])),
    /* Decoded: index.html writes BOTH `HASHING & KDFS` (21 cards) and
       `HASHING &amp; KDFS` (3 cards). A browser decodes the attribute so the
       filter chips treat them as one category, but a raw-text reader sees two --
       and the first run of this generator duly produced two shards,
       labs-full-hashing-and-kdfs.md and labs-full-hashing-andamp-kdfs.md, plus
       two rows in per_category. The catalog is not wrong; a text reader that
       does not decode is. */
    categories: card.categories.map(decode),
    level: attr('data-level'),
    wip: card.wip,
    format: attr('data-format'),
    added: attr('data-added'),
    updated: attr('data-updated'),
    review_commit: attr('data-review-commit'),
    review_note: attr('data-review-note'),
  };
  rec.category = card.categories.length ? card.categories.map(decode) : null;
  rec.level = attr('data-level');
  if (!rec.level) rec.missing.push('level');
  rec.algorithms = {
    implements: anchored(attr('data-implements')),
    comment_only: anchored(attr('data-comment-only')),
    attacks: anchored(attr('data-attacks')),
    references: pipe(attr('data-references')),
    standards: pipe(attr('data-standards')),
    implementation: attr('data-implementation'),
    unscanned: attr('data-unscanned'),
  };
  if (!rec.algorithms.implements.length && !rec.algorithms.comment_only.length) {
    rec.missing.push('algorithms.implements');
  }

  /* ---- fields that live in the lab */
  const pages = htmlPages(root);
  const srcs = sourceFiles(root);
  const styles = styleFiles(root);
  rec.pages_found = pages;
  if (!pages.length) rec.missing.push('page');

  const searchFiles = [...pages, ...srcs.slice(0, 120)];
  for (const [field, patterns] of Object.entries(HERO)) {
    const hit = heroField(root, searchFiles, patterns, HERO_CLASS[field]);
    if (hit) { rec[field] = hit.value; rec.sources[field] = hit.source; }
    else { rec[field] = null; rec.missing.push(field); }
  }

  const acc = accentOf(root, [...styles.slice(0, 40), ...pages, ...srcs.slice(0, 60)]);
  if (acc) { rec.accent = acc.value; rec.sources.accent = `${acc.source} (${acc.scope})`; }
  else { rec.accent = null; rec.missing.push('accent'); }

  const readme = readIf(path.join(root, 'README.md'), MAX_README);
  if (readme) {
    rec.readme = readme.text;
    rec.readme_bytes = readme.bytes;
    rec.readme_truncated = readme.truncated;
    rec.sources.readme = 'README.md';
  } else { rec.readme = null; rec.missing.push('readme'); }

  rec.spec_citations = citationsIn(root, ['README.md', ...pages, ...srcs.slice(0, 30)]);
  if (!rec.spec_citations.length) rec.missing.push('spec_citations');

  /* Recursive, because eight labs keep their suite at demos/<slug>/e2e/. A fixed
     root-relative list reported kyber-vault as having no claims suite while
     demos/kyber-vault/e2e/claims.spec.ts sat in the repo. */
  const claimsFile = findFiles(root, /^claims\.spec\.(ts|js|mjs)$/)[0] || null;
  if (claimsFile) { rec.claims = claimsIn(root, claimsFile); rec.sources.claims = claimsFile; }
  else { rec.claims = null; rec.missing.push('claims'); }

  rec.mutations = mutationSources(root);
  if (!rec.mutations.length) rec.missing.push('mutations');

  rec.verification = verificationManifest(root);
  if (!rec.verification) rec.missing.push('verification');

  rec.limitations = limitationsOf(root, [...pages, ...srcs.slice(0, 60)], rec.readme);
  if (!rec.limitations.page_panels.length && !rec.limitations.readme_sections.length) {
    rec.missing.push('limitations');
  }

  /* Last, over the whole record, rather than at each extractor: every field here
     is lab-sourced except the ones index.html supplies, and a normalisation
     applied in fourteen places is a normalisation that will be missed in the
     fifteenth. */
  return scrubLocalPaths(rec, bases);
}

/* ------------------------------------------------------------------ outputs */

function labMarkdown(r) {
  const L = [];
  const fence = (s) => String(s).replace(/```/g, '`​``');
  L.push(`## ${r.card && r.card.title ? r.card.title : r.slug}`);
  L.push('');
  L.push(`- **slug**: \`${r.slug}\``);
  L.push(`- **repo**: ${r.repo_url}`);
  L.push(`- **live**: ${r.live_url}`);
  L.push(`- **commit_sha**: \`${r.commit_sha || 'MISSING'}\` (the commit these bytes were read from)`);
  if (r.commits_behind_remote) L.push(`- **clone is ${r.commits_behind_remote} commit(s) behind** \`origin/main\` \`${r.remote_head}\``);
  L.push(`- **read_from**: ${r.read_from || 'MISSING'}`);
  L.push(`- **category**: ${(r.category || ['MISSING']).join(' | ')}  ·  **level**: ${r.level || 'MISSING'}  ·  **--accent**: ${r.accent || 'MISSING'}`);
  if (r.missing.length) L.push(`- **MISSING FIELDS**: ${r.missing.join(', ')}`);
  L.push('');
  for (const [label, key] of [['Name (H1)', 'name'], ['Subtitle', 'subtitle'], ['Description', 'description'], ['Why it matters', 'why_it_matters']]) {
    L.push(`**${label}**: ${r[key] ? r[key] : '_MISSING_'}${r.sources[key] ? `  — _read from ${r.sources[key]}_` : ''}`);
    L.push('');
  }
  if (r.card) {
    L.push(`**Card copy**: ${r.card.copy || '_MISSING_'}`);
    L.push('');
    if (r.card.chips && r.card.chips.length) { L.push(`**Chips**: ${r.card.chips.join(' · ')}`); L.push(''); }
  }
  if (r.algorithms) {
    const fmt = (a) => (a.length ? a.map((x) => (x.anchor ? `${x.term} \`${x.anchor}\`` : x.term)).join(', ') : '_none derived_');
    L.push(`**Implements**: ${fmt(r.algorithms.implements)}`);
    L.push('');
    L.push(`**Attacks shown**: ${fmt(r.algorithms.attacks)}`);
    L.push('');
    if (r.algorithms.comment_only.length) { L.push(`**Comment-only (named in code comments, not executed)**: ${fmt(r.algorithms.comment_only)}`); L.push(''); }
    if (r.algorithms.references.length) { L.push(`**References**: ${r.algorithms.references.join(', ')}`); L.push(''); }
    if (r.algorithms.standards) { L.push(`**Standards body**: ${(r.algorithms.standards || []).join(', ') || '_none_'}`); L.push(''); }
    if (r.algorithms.implementation) { L.push(`**Implementation**: ${r.algorithms.implementation}`); L.push(''); }
  }
  if (r.spec_citations && r.spec_citations.length) {
    L.push('**Spec citations, exactly as written**:');
    L.push('');
    for (const c of r.spec_citations) L.push(`- \`${c.text}\` — first seen ${c.first_seen.file}:${c.first_seen.line} (${c.occurrences}×)`);
    L.push('');
  }
  if (r.limitations) {
    if (r.limitations.page_panels.length) {
      L.push('**Stated limitations (page)**:');
      L.push('');
      for (const p of r.limitations.page_panels) L.push(`- _(${p.kind}, ${p.file})_ ${p.text}`);
      L.push('');
    }
    if (r.limitations.readme_sections.length) {
      for (const s of r.limitations.readme_sections) {
        L.push(`**README — ${s.heading}**:`);
        L.push('');
        L.push('```text');
        L.push(fence(s.text));
        L.push('```');
        L.push('');
      }
    }
  }
  if (r.claims && r.claims.tests.length) {
    L.push(`**Claims tested** (${r.claims.file}, ${r.claims.tests.length} test(s)):`);
    L.push('');
    for (const t of r.claims.tests) {
      L.push(`- \`${t.test_name || '(assertions outside a test block)'}\` — ${t.file}:${t.line}`);
      for (const a of t.assertions) {
        const exp = a.expected_as_written ? `\`${a.expected_as_written.replace(/`/g, "'")}\`` : '_no expected value_';
        L.push(`    - :${a.line} \`${a.matcher || 'expect'}\` expected ${exp} _(${a.expected_kind})_`);
      }
    }
    L.push('');
  } else {
    L.push('**Claims tested**: _MISSING — no claims suite found_');
    L.push('');
  }
  if (r.mutations && r.mutations.length) {
    L.push(`**Mutation records** (${r.mutations.length} file(s)):`);
    L.push('');
    for (const m of r.mutations) {
      L.push(`- \`${m.file}\` (${m.bytes} bytes${m.truncated ? ', truncated' : ''}${m.parse_error ? `, JSON parse error: ${m.parse_error}` : ''})`);
    }
    L.push('');
  } else {
    L.push('**Mutation records**: _MISSING — no file matching /mutation/i_');
    L.push('');
  }
  if (r.verification) {
    L.push(`**verification/ manifest** (${r.verification.files.length} file(s)):`);
    L.push('');
    for (const f of r.verification.files) L.push(`- \`${f.file}\` (${f.bytes} bytes)`);
    L.push('');
  }
  if (r.readme) {
    /* The FIRST SECTION and a link, not the whole README.
     *
     * Embedding every README put each one in the corpus TWICE -- once in
     * labs.jsonl and once here -- and took the shards to 6.1 MB of the 17.6 MB
     * total. The full text is still exported, in labs.jsonl, which is the file a
     * machine reads; a person reading the prose shards wants the opening and a
     * way to the rest. Measured: this takes the corpus from about 17.6 MB to
     * about 6 MB with nothing removed from the machine-readable half. */
    const body = r.readme.replace(/^#[^\n]*\n+/, '');
    const firstSection = body.split(/\n(?=##\s)/)[0].trim();
    const capped = firstSection.length > 4000 ? `${firstSection.slice(0, 4000)}\n\n[…truncated here; the full text is in labs.jsonl]` : firstSection;
    L.push(`**README, first section** (full text in \`labs.jsonl\`, field \`readme\`; ${r.readme_bytes} bytes):`);
    L.push('');
    L.push('```markdown');
    L.push(fence(capped));
    L.push('```');
    L.push('');
    L.push(`Full README: ${r.repo_url}/blob/${r.commit || 'HEAD'}/README.md`);
    L.push('');
  }
  L.push('---');
  L.push('');
  return L.join('\n');
}

function slugifyCategory(c) {
  return String(c).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'uncategorised';
}

function main() {
  const argv = process.argv.slice(2);
  const arg = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
  const outDir = path.resolve(HUB, arg('--out', 'corpus'));
  const onlyLab = arg('--lab', null);
  const limit = arg('--limit', null) ? Number(arg('--limit', null)) : null;
  const checkOnly = argv.includes('--check');

  const html = fs.readFileSync(path.join(HUB, 'index.html'), 'utf8');
  const { cards, hrefless } = readCards(html);

  /* A card the registry cannot resolve is a hard failure. An unresolvable card
     is a lab that would be silently absent from the corpus, which is the one
     thing this generator must not do quietly. */
  if (hrefless.length) {
    console.error(hreflessLine(hrefless));
    console.error(`REGISTRY-UNREADABLE (${hrefless.length}) — these cards name no resolvable lab, so the`);
    console.error('corpus denominator is unknown. Nothing was written.');
    return 2;
  }

  const registryCount = cards.length;
  let selected = onlyLab ? cards.filter((c) => c.slug === onlyLab || c.slug === `crypto-lab-${onlyLab}`) : cards;
  if (limit) selected = selected.slice(0, limit);
  if (!selected.length) {
    console.error(`No card matched --lab ${onlyLab}.`);
    return 2;
  }

  const generatedAt = new Date().toISOString();
  const records = [];
  for (const card of selected) records.push(buildLab(card, generatedAt));

  /* clone-source caches each clone's status, so a clone that went dirty DURING
     the run produces a mix of two states. Same rule as every other generator
     here: the ground moving is never the ground being still. */
  const torn = tornSnapshot();
  if (torn && torn.length) {
    console.error(`TORN SNAPSHOT (${torn.length}) — these clones changed while being read, so the corpus`);
    console.error('would mix two states. Nothing was written.');
    for (const t of torn) console.error(`  ${t.dir || t}`);
    return 2;
  }

  const missingClone = records.filter((r) => !r.clone_present).map((r) => r.slug);
  const withMissing = records.filter((r) => r.missing.length);

  if (checkOnly) {
    const whole = !onlyLab && !limit;
    console.log(`Registry: ${registryCount} cards. Corpus records: ${records.length}.`);
    console.log(`Labs with no clone on disk: ${missingClone.length}${missingClone.length ? ` — ${missingClone.join(', ')}` : ''}`);
    console.log(`Labs with at least one missing field: ${withMissing.length}`);

    /* The committed corpus, not the one this run would produce. `--check` is
       what CI runs against the tree, so it has to be able to fail on a document
       that is already published rather than only on one about to be written. */
    const committed = fs.existsSync(outDir)
      ? fs.readdirSync(outDir).filter((f) => f === 'labs.jsonl' || /^labs-full.*\.md$/.test(f)).sort()
      : [];
    const dirty = committed
      .map((f) => ({ file: f, hits: localPathsIn(fs.readFileSync(path.join(outDir, f), 'utf8')) }))
      .filter((d) => d.hits.length);
    console.log(`Published documents scanned for local paths: ${committed.length} — ${dirty.length ? 'FOUND' : 'none found'}`);
    if (dirty.length) {
      console.error('LOCAL-PATH — a published corpus document carries an absolute local path.');
      for (const d of dirty) {
        console.error(`  ${d.file}: ${d.hits.length} occurrence(s)`);
        for (const h of [...new Set(d.hits)].slice(0, 10)) console.error(`    ${h}`);
      }
      console.error('  Rebuild with `node scripts/build-audit-corpus.js`; never hand-edit the corpus.');
      return 1;
    }
    if (whole && records.length !== registryCount) {
      console.error(`CORPUS-INCOMPLETE — ${registryCount - records.length} lab(s) in the registry are absent from the corpus.`);
      return 1;
    }
    if (missingClone.length) {
      console.error('CLONE-ABSENT — a lab in the registry has no checkout, so nothing could be read about it.');
      return 1;
    }
    return 0;
  }

  fs.mkdirSync(outDir, { recursive: true });

  /* labs.jsonl */
  const jsonl = records.map((r) => JSON.stringify(r)).join('\n') + '\n';

  /* labs-full.md, sharded by category only if one document would be too large */
  const header = (title, n) => [
    `# ${title}`,
    '',
    `Generated ${generatedAt} from ${n} lab record(s).`,
    '',
    'Every finding must cite **commit_sha + lab slug + field**. A field printed as',
    '`MISSING` was not found by the generator; it is not a claim that the lab lacks it.',
    '',
    '---',
    '',
  ].join('\n');

  const bodies = records.map((r) => ({ r, md: labMarkdown(r) }));
  const totalSize = bodies.reduce((n, b) => n + Buffer.byteLength(b.md), 0);
  const shards = [];
  const docs = [];                 // every document that carries lab content
  let staleFull = null;            // a labs-full.md left over from a smaller corpus
  let indexMd = '';

  if (totalSize > SHARD_THRESHOLD) {
    const byCat = new Map();
    for (const b of bodies) {
      const cat = (b.r.category && b.r.category[0]) || 'uncategorised';
      const key = slugifyCategory(cat);
      if (!byCat.has(key)) byCat.set(key, { category: cat, items: [] });
      byCat.get(key).items.push(b);
    }
    for (const [key, { category, items }] of [...byCat].sort((a, b) => a[0].localeCompare(b[0]))) {
      const file = `labs-full-${key}.md`;
      const text = header(`Crypto Lab audit corpus — ${category}`, items.length) + items.map((i) => i.md).join('\n');
      docs.push({ file, text });
      shards.push({ file, category, labs: items.length, bytes: Buffer.byteLength(text) });
    }
    /* AN INDEX IS NAMED AS ONE. This used to be written to labs-full.md, so the
       file a reader opened expecting the corpus held a list of links to it. It is
       index.md now and says what it is on its first line, and labs-full.md is
       written ONLY when it really holds the content. */
    const assemble = `cat ${shards.map((x) => x.file).join(' ')} > labs-full.md`;
    indexMd = [
      '# Crypto Lab audit corpus — navigation index',
      '',
      '**This file is an INDEX, not the content.** The content is in the shards it links to,',
      `sharded by category because one document would be ${(totalSize / 1024 / 1024).toFixed(2)} MB, above the 4 MB limit.`,
      'Assemble a single document with:',
      '',
      '```sh',
      `cd ${path.relative(HUB, outDir) || '.'}`,
      assemble,
      '```',
      '',
      `Generated ${generatedAt} from ${records.length} lab record(s).`,
      '',
      'Every finding must cite **commit_sha + lab slug + field**. A field printed as',
      '`MISSING` was not found by the generator; it is not a claim that the lab lacks it.',
      '',
      '## Shards',
      '',
      ...shards.map((x) => `- [${x.category}](${x.file}) — ${x.labs} labs, ${(x.bytes / 1024).toFixed(0)} KB`),
      '',
    ].join('\n');
    /* Leave no stale labs-full.md behind from a run when the corpus was smaller:
       a file that used to be content and is now absent is better than one that
       silently became a list of links. */
    const stale = path.join(outDir, 'labs-full.md');
    if (fs.existsSync(stale)) staleFull = stale;
  } else {
    docs.push({
      file: 'labs-full.md',
      text: header('Crypto Lab audit corpus', records.length) + bodies.map((b) => b.md).join('\n'),
    });
    indexMd = ['# Crypto Lab audit corpus — navigation index', '',
      '**This file is an INDEX, not the content.** `labs-full.md` holds the complete document',
      `(${(totalSize / 1024 / 1024).toFixed(2)} MB, within the 4 MB single-file limit), and \`labs.jsonl\` is the machine-readable form.`,
      '', `Generated ${generatedAt} from ${records.length} lab record(s).`, ''].join('\n');
  }

  /* ---- NOTHING WITH A LOCAL PATH IN IT IS WRITTEN
     corpus/ is served from main, so this is the last point at which a published
     byte can still be refused. The check is on the ASSEMBLED TEXT rather than on
     the records, because "reaches corpus/labs.jsonl" is the thing being
     prevented and the text is what reaches it; the records are then walked only
     to say which lab and which field produced it. buildLab normalises every
     record, so a finding here means the normalisation has a hole -- which is
     exactly when a generator must stop instead of publishing. */
  const published = [{ file: 'labs.jsonl', text: jsonl }, ...docs];
  const leaked = publishedLeaks(published);
  if (leaked.length) {
    console.error('LOCAL-PATH — an absolute local path reached a published corpus document.');
    console.error('Nothing was written. corpus/ is served from main, so this would publish it.');
    for (const d of leaked) {
      console.error(`  ${d.file}: ${d.hits.length} occurrence(s)`);
      for (const h of [...new Set(d.hits)].slice(0, 10)) console.error(`    ${h}`);
    }
    const findings = localPathFindings(records);
    if (findings.length) {
      console.error(`  Traced to ${findings.length} field(s):`);
      for (const f of findings.slice(0, 20)) console.error(`    ${f.slug}  ${f.field}  ${f.path}`);
    } else {
      console.error('  No record field matched, so the path comes from this generator rather than a lab.');
    }
    return 2;
  }

  fs.writeFileSync(path.join(outDir, 'labs.jsonl'), jsonl);
  for (const d of docs) fs.writeFileSync(path.join(outDir, d.file), d.text);
  fs.writeFileSync(path.join(outDir, 'index.md'), indexMd);
  if (staleFull) fs.rmSync(staleFull);

  /* index.json */
  const tally = (pick) => {
    const m = {};
    for (const r of records) for (const v of [].concat(pick(r) || ['(none)'])) m[v] = (m[v] || 0) + 1;
    return Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
  };
  if (fs.existsSync(path.join(__dirname, 'corpus-readme.md'))) {
    fs.copyFileSync(path.join(__dirname, 'corpus-readme.md'), path.join(outDir, 'README.md'));
  }
  const files = fs.readdirSync(outDir).filter((f) => /\.(jsonl|md|json)$/.test(f)).sort();
  const index = {
    generated_at: generatedAt,
    registry: { source: 'index.html cards, via tools/card-reader.js', cards: registryCount },
    lab_count: records.length,
    complete: records.length === registryCount && !missingClone.length,
    commit_sha_means: 'the commit whose bytes each record was read from, not the remote tip',
    clones_behind_remote: records.filter((r) => r.commits_behind_remote > 0)
      .map((r) => ({ slug: r.slug, behind: r.commits_behind_remote })),
    per_category: tally((r) => r.category),
    per_level: tally((r) => r.level),
    labs_with_missing_fields: withMissing.map((r) => ({ slug: r.slug, missing: r.missing })),
    missing_field_totals: (() => {
      const m = {};
      for (const r of records) for (const f of r.missing) m[f] = (m[f] || 0) + 1;
      return Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1]));
    })(),
    shards,
    files: files.map((f) => ({ file: f, bytes: fs.statSync(path.join(outDir, f)).size })),
  };
  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2) + '\n');

  /* The schema doc ships WITH the corpus, from a tracked template. It was a
     hand-written file in corpus/ until a regeneration deleted it: a corpus whose
     reader instructions can go missing is a corpus that gets misread. */
  const readmeTemplate = path.join(__dirname, 'corpus-readme.md');
  if (fs.existsSync(readmeTemplate)) {
    fs.copyFileSync(readmeTemplate, path.join(outDir, 'README.md'));
  } else {
    console.error('WARNING: scripts/corpus-readme.md is absent, so corpus/README.md was not written.');
  }

  const bytes = index.files.reduce((n, f) => n + f.bytes, 0);
  console.log(`Registry: ${registryCount} cards. Corpus: ${records.length} records.`);
  console.log(`Wrote ${index.files.length} file(s), ${(bytes / 1024 / 1024).toFixed(2)} MB total, to ${path.relative(HUB, outDir)}/`);
  console.log(`Labs with at least one missing field: ${withMissing.length}`);
  for (const [f, n] of Object.entries(index.missing_field_totals)) console.log(`  ${String(n).padStart(4)}  ${f}`);
  if (missingClone.length) {
    console.error(`\nCLONE-ABSENT (${missingClone.length}) — in the registry, no checkout to read: ${missingClone.join(', ')}`);
    return 1;
  }
  return 0;
}

if (require.main === module) process.exit(main());
module.exports = { buildLab, claimsIn, citationsIn, accentOf, labMarkdown, limitationsOf, readIf,
  heroFrom, builderValue, imperativeValue, stripComments, findFiles, HERO, HERO_CLASS, literalKind,
  LOCAL_PATH_SHAPES, localPathRe, localPathsIn, withoutLocalPaths, scrubLocalPaths,
  localPathFindings, publishedLeaks };
