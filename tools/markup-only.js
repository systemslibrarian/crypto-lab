/*
 * markup-only.js — is a lab's movement EXECUTABLE, or only the words it renders?
 *
 * Not runnable. Required by tools/catalog-evidence.js.
 *
 * WHY THIS EXISTS
 *
 * `movedSubstantively` answers "did this lab's source move" with a PATH test:
 * anything under src/ counts. That is right for the question it was built for
 * and wrong for the one that actually reaches a person. Measured on
 * crypto-lab-hybrid-sign, twice in one day: two commits changed only standards
 * prose -- RFC 10073, then RFC 10082 for CMS -- inside the markup of
 * `renderApp()`, and both produced STALE-REVIEW. Each time all three anchored
 * blobs were byte-identical (src/composite.ts bbc248c506b3, src/primitives.ts
 * 345577ff4669, src/breaks.ts 8c26e9a6a344), each time the deriver re-run wrote
 * 0 cards, and each time a person had to read a sentence about an RFC to
 * conclude that nothing a claim rests on had moved. That is the re-review queue
 * with nothing in it, which this repository has now produced in five distinct
 * ways; this is the sixth, and the first where the lab genuinely did change.
 *
 * WHAT IT ASKS INSTEAD
 *
 * Not "which file", but "is the changed LINE executable". It reuses
 * catalog-evidence's own lexer rather than growing a second one, for the reason
 * stated beside that lexer: two answers to "what is code here" in one
 * repository is how the second reader misses what the first one learned. The
 * `code` view blanks string CONTENT and comment bodies and keeps everything
 * that runs. So:
 *
 *   static markup inside a template literal   code view blank    not executable
 *   a line carrying `${expr}`                 code view `${expr}` EXECUTABLE
 *   a comment, a doc block, prose             code view blank    not executable
 *   any statement, import, call, assignment   code view non-blank EXECUTABLE
 *
 * THE EDGE CASE THIS TURNS ON, and the reason the rule is per-LINE rather than
 * per-literal: the template literal in crypto-lab-hybrid-sign's `renderApp()`
 * spans lines 175 to 597 and carries thirteen interpolations. It is evaluated.
 * A per-literal rule would call every line in it executable and change nothing;
 * a rule that ignored interpolation would wave through an edit to
 * `${ED25519.privateKeyBytes}`, which is a real behaviour change wearing markup's
 * clothes. The line is the unit that separates them, and
 * tests/markup-only.test.cjs pins both halves.
 *
 * REFUSALS ARE NOT CLEARANCES. Anything this cannot establish -- a file it
 * cannot read at either end, a diff that will not run, a binary file -- returns
 * 'unreadable', and the caller treats that as movement. Could-not-look is never
 * nothing-there.
 */

const { execFileSync } = require('child_process');

/* The added and removed LINE NUMBERS for one path, from a zero-context diff.
   -U0 so the hunk headers bound exactly the changed lines and no neighbours. */
function changedLines(dir, from, to, file) {
  const out = execFileSync('git', ['-C', dir, 'diff', '-U0', `${from}..${to}`, '--', file], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024,
  });
  const added = [];
  const removed = [];
  let oldLine = 0;
  let newLine = 0;
  for (const line of out.split('\n')) {
    const h = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (h) { oldLine = Number(h[1]); newLine = Number(h[3]); continue; }
    if (line.startsWith('+++') || line.startsWith('---')) continue;
    if (line.startsWith('+')) { added.push(newLine); newLine += 1; continue; }
    if (line.startsWith('-')) { removed.push(oldLine); oldLine += 1; continue; }
  }
  return { added, removed };
}

function blobAt(dir, commit, file) {
  try {
    return execFileSync('git', ['-C', dir, 'show', `${commit}:${file}`], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024,
    });
  } catch { return null; }
}

/* paths: the substantive paths movedSubstantively already found. lex: the
   catalog-evidence lexer, passed in so this module never imports its caller. */
function markupOnly(dir, from, to, paths, lex) {
  if (!paths || !paths.length) return { verdict: 'markup', why: 'no substantive paths' };
  try {
    for (const file of paths) {
      const { added, removed } = changedLines(dir, from, to, file);
      for (const [commit, lines] of [[to, added], [from, removed]]) {
        if (!lines.length) continue;
        const src = blobAt(dir, commit, file);
        /* A deleted or added FILE is movement: one end has no bytes to judge. */
        if (src === null) {
          return { verdict: 'unreadable', why: `${file} is absent at ${String(commit).slice(0, 12)}` };
        }
        if (src.includes('\0')) return { verdict: 'unreadable', why: `${file} is binary` };
        const code = lex(src).code.split('\n');
        for (const n of lines) {
          const view = code[n - 1];
          if (view === undefined) {
            return { verdict: 'unreadable', why: `${file}:${n} is past the end at ${String(commit).slice(0, 12)}` };
          }
          if (view.trim() !== '') {
            return { verdict: 'executable', why: `${file}:${n} changes code: ${view.trim().slice(0, 60)}` };
          }
        }
      }
    }
    return { verdict: 'markup', why: `${paths.length} path(s) changed, every changed line is markup, prose or comment` };
  } catch (e) {
    return { verdict: 'unreadable', why: `diff did not run: ${e.message.split('\n')[0].slice(0, 80)}` };
  }
}

module.exports = { markupOnly, changedLines };
