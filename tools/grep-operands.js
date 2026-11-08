/*
 * grep-operands.js — refuse a `grep -q` over more than one file operand unless
 * its operands were checked for readability first.
 *
 * Run: node tools/grep-operands.js check
 * Prevents: a multi-operand `grep -q` reading found-or-not-found out of an exit code that ugrep and BSD grep answer differently
 * Reads: git ls-files, then every tracked .sh, .js, .cjs and .mjs outside
 *   node_modules, archive/ and tools/fixtures/
 *
 * WHY THIS EXISTS
 *
 * Measured 2026-11-07. Given a match in one operand and an unreadable second
 * operand, `grep -q` answers differently depending on which binary is on PATH,
 * and POSIX permits both:
 *
 *   grep           -> ugrep 7.8.4             exits 2, the error wins
 *   /usr/bin/grep  -> BSD grep 2.6.0-FreeBSD  exits 0, the match wins
 *
 * So over several operands the exit code is not a channel you can read. A
 * caller that branches on it gets "found" on one machine and "could not look"
 * on another, from the same inputs. One operand is unambiguous; several
 * operands need the readability question asked separately, which is what
 * `require_readable` in tools/three-way.sh and the `operands` option in
 * tools/three-way.js exist for.
 *
 * The check is deliberately narrow. It does not object to `grep -q` on stdin
 * (no file operand to be unreadable), nor to a single operand, nor to a
 * multi-operand call whose block already asks the readability question. It
 * prints the number of call sites it examined, because a count of findings with
 * no denominator beside it is the shape this repository keeps having to fix.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SKIP = /(^|\/)(node_modules|archive|tools\/fixtures)(\/|$)/;
const PRECHECK = /require_readable|operandsReadable|operands:|test -[fer]\s|\[ -[fer] /;

/** Tracked text files worth scanning. An untracked file is not fleet machinery. */
function trackedFiles() {
  const out = execFileSync('git', ['-C', ROOT, 'ls-files'], { encoding: 'utf8', maxBuffer: 1 << 26 });
  return out.split('\n').filter(Boolean)
    .filter((f) => /\.(sh|js|cjs|mjs)$/.test(f))
    .filter((f) => !SKIP.test(f));
}

/* How many FILE operands does this grep call have? Everything after the pattern
   that is not an option. A call reading stdin has none, and a call whose
   operands are shell variables still counts them: `"$a" "$b"` is two. */
function operandCount(rest) {
  const toks = rest.match(/'[^']*'|"[^"]*"|\S+/g) || [];
  let seenPattern = false;
  let operands = 0;
  for (const t of toks) {
    if (t === '|' || t === '&&' || t === '||' || t === ';' || t.startsWith('#')) break;
    if (t.startsWith('-') && !seenPattern) continue;      // an option
    if (!seenPattern) { seenPattern = true; continue; }    // the pattern itself
    if (t === ')' || t === '}' || t.startsWith(')')) break;
    operands += 1;
  }
  return operands;
}

/* Two scans, because the two languages invoke grep two different ways and a
   single regex over both produced nonsense: it matched `grep -q` inside JS
   string literals and even inside a test TITLE, and counted the prose that
   followed as fifteen operands. A checker that reads a sentence as a call is
   the shape this repository keeps fixing, so the shapes are kept apart.

   Shell: a real command line. JS: never a shell string in this repo — it is
   always an argv array through execFile/spawnSync, so that is what is read.
   Shell embedded in a JS string belongs to a test exercising the helper, and
   the helper is the thing under test, so it is not a call site to police. */
function scanShell(rel, lines, sites) {
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^\s*#/.test(line)) continue;
    const m = /\bgrep\s+(-[A-Za-z]*q[A-Za-z]*)\s+(.*)$/.exec(line);
    if (!m) continue;
    if (/\|\s*grep\s/.test(line)) continue;             // stdin: no file operand
    const n = operandCount(m[2]);
    const block = lines.slice(Math.max(0, i - 6), i + 2).join('\n');
    sites.push({ file: rel, line: i + 1, operands: n, lang: 'sh',
      prechecked: PRECHECK.test(block), text: line.trim().slice(0, 110) });
  }
}

function scanJs(rel, src, sites) {
  const lines = src.split('\n');
  const re = /(?:execFile|execFileSync|spawn|spawnSync)\s*\(\s*['"]grep['"]\s*,\s*\[([^\]]*)\]/g;
  for (const m of src.matchAll(re)) {
    /* A `spawnSync('grep', [...])` written INSIDE a quoted literal is text, not
       a call -- a fixture handed to this very scanner by its own test. Second
       false positive of the same family: the first read a test TITLE as a call,
       this one read a test FIXTURE as a call. The tell is the quote character
       immediately before the match. Narrowing to non-test files instead would
       be worse: a test is exactly where a careless multi-operand call would be
       written, so tests stay in scope. */
    const prev = src.slice(0, m.index).replace(/\s+$/, '').slice(-1);
    if (prev === '"' || prev === "'" || prev === '`') continue;
    /* Split on commas, so a BARE identifier counts. The first version matched
       only quoted literals, so `spawnSync('grep', ['-q', 'needle', a, b])` came
       back with zero operands -- a checker blind to exactly the call it exists
       to catch, because the operands in real code are variables. */
    const args = m[1].split(',').map((a) => a.trim()).filter(Boolean)
      .map((a) => (/^['"`]/.test(a) ? a.slice(1, -1) : a));
    if (!args.some((a) => /^-[A-Za-z]*q/.test(a))) continue;
    let seenPattern = false, operands = 0;
    for (const a of args) {
      if (a.startsWith('-') && !seenPattern) continue;
      if (!seenPattern) { seenPattern = true; continue; }
      operands += 1;
    }
    const line = src.slice(0, m.index).split('\n').length;
    const block = lines.slice(Math.max(0, line - 7), line + 1).join('\n');
    sites.push({ file: rel, line, operands, lang: 'js',
      prechecked: PRECHECK.test(block), text: lines[line - 1].trim().slice(0, 110) });
  }
}

function scan() {
  const sites = [];
  for (const rel of trackedFiles()) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    if (rel.endsWith('.sh')) scanShell(rel, src.split('\n'), sites);
    else scanJs(rel, src, sites);
  }
  return sites;
}

/* The VERDICT, separate from the scan, because a mutation that emptied it went
   uncaught on 2026-11-07: the test asserted scan() found nothing to flag, which
   stayed true while main() stopped flagging. Both callers read this one. */
function offenders(sites) {
  return sites.filter((s) => s.operands > 1 && !s.prechecked);
}

function main() {
  const sites = scan();
  const multi = sites.filter((s) => s.operands > 1);
  const bad = offenders(sites);
  console.log(`grep -q call sites examined: ${sites.length} (${multi.length} with more than one file operand)`);
  for (const s of sites) {
    console.log(`  ${s.lang}  ${s.operands} operand(s)${s.prechecked ? ', pre-checked' : ''}  ${s.file}:${s.line}  ${s.text}`);
  }
  if (!bad.length) {
    console.log('\nNo multi-operand `grep -q` decides anything from an exit code two greps answer differently.');
    return 0;
  }
  console.log(`\nMULTI-OPERAND GREP -Q WITHOUT A READABILITY CHECK (${bad.length}) — on this machine ugrep`);
  console.log('answers 2 and BSD grep answers 0 for a match plus an unreadable operand, so this call');
  console.log('cannot tell found from could-not-look. Use one operand, or check the operands first');
  console.log('with require_readable (tools/three-way.sh) or the `operands` option (tools/three-way.js).');
  for (const s of bad) console.log(`  ${s.file}:${s.line}  ${s.text}`);
  return 1;
}

if (require.main === module) process.exit(main());
module.exports = { scan, scanShell, scanJs, operandCount, offenders };
