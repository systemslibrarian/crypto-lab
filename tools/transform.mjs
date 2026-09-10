#!/usr/bin/env node
/*
 * transform.mjs — rewrite a Dependabot auto-merge job's two steps into the
 * attestation-gate shape: the merge's own exit status sets a flag, and the
 * deploy dispatch reads that flag. Nothing re-queries the API.
 *
 * WHAT IS BEING REPLACED, AND WHY IT IS NOT A STYLE FIX
 *
 *   - name: Merge any bump whose gate went green
 *     run: |
 *       for attempt in 1 2 3; do
 *         if gh pr merge --squash --delete-branch "$PR_URL"; then
 *           exit 0                       # <-- the merge's exit status is thrown away
 *         fi
 *         ...
 *
 *   - name: Deploy the merged result
 *     if: success()
 *     run: |
 *       if gh pr view "$PR_URL" --json state --jq .state | grep -q MERGED; then
 *         gh workflow run <target>.yml --repo "$GITHUB_REPOSITORY" --ref main
 *       fi
 *
 * The merge already happened in the previous step. This step then asks the API
 * whether it worked. If that `gh pr view` fails for ANY reason — a rate limit, a
 * transient 5xx, a token that lost scope, the PR object not yet consistent — the
 * pipeline produces no output, `grep -q` matches nothing, the `if` takes the
 * else branch, and the step exits 0 having printed NOTHING. Not even the
 * `|| echo "::warning::"` runs, because the `gh workflow run` it guards was
 * never reached. The bump is on main, the deploy never fires, and the live site
 * serves the pre-bump build with nothing red anywhere.
 *
 * `shell: bash` does not fix it. Inside an `if` condition a failing pipeline
 * takes the else branch identically with or without pipefail, and `set -e` is
 * exempt in that position by POSIX. Measured: a no-op in 183 of 183 steps.
 *
 * The fix is to stop asking. The merge command's own exit status sets a shell
 * flag; the dispatch reads the flag. There is no second question, so there is
 * nothing left to fail silently.
 *
 * WHAT THIS SCRIPT PRESERVES, PER REPO
 *   - the dispatch target filename (the fleet uses deploy.yml, pages.yml AND
 *     deploy-pages.yml, and the dispatching file is not always the dispatched
 *     one — crypto-compare's ci.yml dispatches pages.yml). A copied filename
 *     404s only on the auto-merge path, and only after a merge has landed;
 *   - the `|| echo "::warning::..."` suffix on the dispatch if the repo has one,
 *     and its absence if it does not (crypto-lab-sector-vault omits it on
 *     purpose — a dispatch that fails there should fail the run);
 *   - the retry count and the sleep interval, read out of the file rather than
 *     assumed;
 *   - every comment EXCEPT the dispatch rationale paragraph — see the ownership
 *     note below. The comments above the deleted step are re-homed inside the
 *     run script, directly above the dispatch, which is where the reference labs
 *     keep them;
 *   - indentation, and the merge step's `env:` block verbatim.
 *
 * The deploy step's own `env:` is dropped with the step, and only after being
 * checked identical to the merge step's. `if: success()` is dropped with it too:
 * the dispatch now runs only when the merge in the same script succeeded, which
 * is strictly narrower than "no earlier step failed".
 *
 * IDEMPOTENT. A job already in the target shape is left byte-for-byte alone, so
 * a second run over the fleet is a no-op and the eight reference labs are
 * unchanged if handed to it.
 *
 * REFUSES rather than guesses. Any auto-merge job that does not match the old
 * construct exactly — a different loop, an extra command in the success branch,
 * a non-adjacent deploy step, a divergent env — is reported as UNRECOGNISED and
 * left untouched.
 *
 * WHO OWNS WHAT, AGAINST dispatch-comment-sync.js
 *
 *   this file                       the EXECUTABLE lines of the auto-merge step,
 *                                   and each repo's own specifics: the dispatch
 *                                   filename, the `|| echo` suffix, the retry
 *                                   count, the `env:` mapping, indentation.
 *   tools/dispatch-comment-sync.js  the RATIONALE PARAGRAPH text — the one that
 *                                   says why a dispatch is needed at all.
 *
 * That split is not tidiness, it is a conflict that had to be resolved. This
 * script originally re-homed EVERY comment line verbatim, the rationale
 * included. dispatch-comment-sync then rewrites that same paragraph to one
 * canonical wording across the fleet and fails CI when any copy drifts. Left as
 * it was, this script would re-scatter, on the next repo it touched, exactly
 * what the normaliser had just unified — and the drift would arrive looking like
 * a legitimate transform.
 *
 * So the re-homing call below hands the comment block to
 * dispatch-comment-sync's own normaliseBlock(). Both tools then emit the
 * paragraph from the same single definition, and neither can produce a wording
 * the other rejects. Per-repo comment paragraphs (the dispatch-filename note,
 * the flag-mechanism note) are still preserved verbatim — normaliseBlock
 * replaces one paragraph and keeps the rest.
 *
 * Usage:
 *   node transform.mjs <workflow.yml> [...]      rewrite in place
 *   node transform.mjs --dry-run <workflow.yml>  print the new text, write nothing
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';

/* The rationale paragraph's single definition. Imported, never copied: a second
 * copy here would be the next variant the normaliser has to fail on. */
const { normaliseBlock } = createRequire(import.meta.url)('./dispatch-comment-sync.js');

/* ------------------------------------------------------------------ parsing */

/* Top-level job blocks. Jobs sit at indent 2 under a column-0 `jobs:` key. */
export function jobBlocks(lines) {
  let inJobs = false;
  const out = [];
  let cur = null;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^jobs:\s*(#.*)?$/.test(l)) { inJobs = true; continue; }
    if (!inJobs) continue;
    if (/^\S/.test(l)) {
      if (cur) { cur.end = i; out.push(cur); cur = null; }
      inJobs = false;
      continue;
    }
    const m = /^  ([A-Za-z0-9_.-]+):\s*(#.*)?$/.exec(l);
    if (m) {
      if (cur) { cur.end = i; out.push(cur); }
      cur = { name: m[1], start: i, end: lines.length };
    }
  }
  if (cur) out.push(cur);
  return out;
}

export function isAutoMergeJob(name, body) {
  return /gh pr merge/.test(body) && (/dependabot/i.test(body) || /dependabot/i.test(name));
}

export const RE_REQUERY = /gh pr view[\s\S]*?\|\s*grep/;

const indentOf = (l) => l.length - l.trimStart().length;

/* Steps of a job, as [start,end) index pairs into `lines`. A step owns every
 * line after it up to the next step marker, WHICH INCLUDES the comment block
 * introducing the following step — that is deliberate: those comments are what
 * the rewrite re-homes. */
function stepRanges(lines, from, to) {
  const marks = [];
  for (let i = from; i < to; i++) {
    if (/^\s*- (name|id|uses|run):/.test(lines[i])) marks.push({ i, ind: indentOf(lines[i]) });
  }
  if (!marks.length) return [];
  const stepInd = Math.min(...marks.map((m) => m.ind));
  const starts = marks.filter((m) => m.ind === stepInd).map((m) => m.i);
  return starts.map((s, k) => ({ start: s, end: k + 1 < starts.length ? starts[k + 1] : to, indent: stepInd }));
}

/* The `run: |` block scalar of a step: the key line index, and the body lines. */
function runBlock(lines, step) {
  for (let i = step.start; i < step.end; i++) {
    const m = /^(\s*)run:\s*\|\s*$/.exec(lines[i]);
    if (!m) continue;
    const keyInd = m[1].length;
    const body = [];
    let j = i + 1;
    for (; j < step.end; j++) {
      const l = lines[j];
      if (l.trim() === '') { body.push(l); continue; }
      if (indentOf(l) <= keyInd) break;
      body.push(l);
    }
    while (body.length && body[body.length - 1].trim() === '') body.pop();
    return { keyIdx: i, bodyStart: i + 1, bodyEnd: i + 1 + body.length, body };
  }
  return null;
}

/* The env: mapping of a step, as a normalised string for comparison. */
function envOf(lines, step) {
  for (let i = step.start; i < step.end; i++) {
    if (!/^\s*env:\s*$/.test(lines[i])) continue;
    const ind = indentOf(lines[i]);
    const out = [];
    for (let j = i + 1; j < step.end; j++) {
      const l = lines[j];
      if (l.trim() === '' || l.trim().startsWith('#')) break;
      if (indentOf(l) <= ind) break;
      out.push(l.trim());
    }
    return { idx: i, keys: out.join('\n') };
  }
  return null;
}

class Unrecognised extends Error {}
const refuse = (why) => { throw new Unrecognised(why); };

/* ------------------------------------------------------- the target shape */

/* Does this job already read the merge's own exit status? Structural, not
 * literal: it must set some flag inside a successful-merge branch, test that
 * flag, and dispatch — with no re-query left anywhere. */
export function alreadyFixed(body) {
  if (RE_REQUERY.test(body)) return false;
  const flag = flagName(body);
  if (!flag) return false;
  const test = new RegExp(`\\[\\s*-[zn]\\s*"?\\$\\{?${flag}\\}?"?\\s*\\]`);
  if (!test.test(body)) return false;
  return /gh workflow run\s+\S+/.test(body);
}

/* The flag a successful `gh pr merge` sets, in either dialect:
 *     if gh pr merge ...; then     |     gh pr merge ... && merged=1 && break
 *       merged=1                   |
 */
function flagName(body) {
  let m = /gh pr merge[^\n]*&&\s*([A-Za-z_][A-Za-z0-9_]*)=/.exec(body);
  if (m) return m[1];
  m = /if\s+gh pr merge[^\n]*;\s*then\s*\n\s*([A-Za-z_][A-Za-z0-9_]*)=1\b/.exec(body);
  return m ? m[1] : null;
}

/* ------------------------------------------------------------- the rewrite */

/* Parse the OLD merge run body into its parts. Everything here is verbatim
 * source except the success branch, which is the only thing being replaced. */
function parseOldMerge(body) {
  const at = (re) => body.findIndex((l) => re.test(l));
  const loop = at(/^\s*for\s+\w+\s+in\s+.+;\s*do\s*$/);
  if (loop !== 0) refuse('merge step does not open with a `for ... ; do` retry loop');

  const ifMerge = at(/^\s*if\s+gh pr merge\b.*;\s*then\s*$/);
  if (ifMerge !== 1) refuse('no `if gh pr merge ...; then` on the line after the loop header');

  const fi = body.findIndex((l, i) => i > ifMerge && /^\s*fi\s*$/.test(l));
  if (fi < 0) refuse('unterminated `if gh pr merge` branch');

  /* The success branch may only throw the exit status away. Anything else in
   * there is a local behaviour this script must not silently drop. */
  const success = body.slice(ifMerge + 1, fi).map((l) => l.trim()).filter(Boolean);
  const allowed = /^(exit 0|echo "merged=1" >> "\$GITHUB_ENV")$/;
  if (!success.length || !success.every((l) => allowed.test(l))) {
    refuse(`unexpected commands in the merge success branch: ${JSON.stringify(success)}`);
  }
  if (!success.includes('exit 0')) refuse('merge success branch does not `exit 0`');

  /* crypto-lab-sector-vault writes `merged=1` into "$GITHUB_ENV" here and then
   * re-queries anyway, so the export is dead code and the rewrite drops it. It
   * may only be dropped if nothing reads it. */
  const exported = success
    .map((l) => /^echo "([A-Za-z_][A-Za-z0-9_]*)=[^"]*" >> "\$GITHUB_ENV"$/.exec(l))
    .filter(Boolean).map((m) => m[1]);

  const done = body.findIndex((l, i) => i > fi && /^\s*done\s*$/.test(l));
  if (done < 0) refuse('retry loop has no `done`');

  const loopTail = body.slice(fi + 1, done);
  if (!loopTail.some((l) => /^\s*sleep\s+\S+\s*$/.test(l))) refuse('retry loop has no `sleep`');

  const warn = body.slice(done + 1);
  if (!warn.length || !warn.every((l) => !l.trim() || /^\s*echo\s+"::warning::/.test(l))) {
    refuse(`unexpected trailing commands after the retry loop: ${JSON.stringify(warn.map((l) => l.trim()))}`);
  }
  return { loop: body[loop], ifMerge: body[ifMerge], fi: body[fi], loopTail, done: body[done], warn, exported };
}

/* Parse the OLD deploy run body: the re-query wrapper, and the dispatch it
 * guards. The dispatch lines come back verbatim, dedented by one level. */
function parseOldDeploy(body) {
  const head = body.findIndex((l) => RE_REQUERY.test(l));
  if (head < 0) refuse('deploy step has no `gh pr view ... | grep` re-query to remove');
  if (!/;\s*then\s*$/.test(body[head])) refuse('the re-query is not an `if ...; then` header');
  if (body.slice(0, head).some((l) => l.trim() && !l.trim().startsWith('#'))) {
    refuse('commands before the re-query in the deploy step');
  }
  const fi = body.findIndex((l, i) => i > head && /^\s*fi\s*$/.test(l));
  if (fi < 0) refuse('unterminated re-query `if`');
  if (body.slice(fi + 1).some((l) => l.trim())) refuse('commands after the re-query block');

  const inner = body.slice(head + 1, fi);
  if (!inner.some((l) => /gh workflow run\s+\S+/.test(l))) refuse('no `gh workflow run` inside the re-query');
  const forbidden = inner.filter((l) => l.trim() && !l.trim().startsWith('#')
    && !/gh workflow run/.test(l) && !/^\s*\|\|\s*echo\s+"::warning::/.test(l));
  if (forbidden.length) refuse(`unexpected commands guarded by the re-query: ${JSON.stringify(forbidden.map((l) => l.trim()))}`);

  /* Dedent by exactly the extra level the `if` wrapper introduced. */
  const drop = Math.min(...inner.filter((l) => l.trim()).map(indentOf)) - indentOf(body[head]);
  return inner.filter((l) => l.trim()).map((l) => l.slice(drop));
}

/* The blank-and-comment tail of the merge step: everything after its last real
 * line (the end of its `env:` mapping) up to the deploy step. That is where the
 * per-repo dispatch rationale lives today, and it is what the rewrite re-homes
 * into the run script. Returns the whole span, and the comment lines within it.
 *
 * The span goes away entirely — with one step where there were two, the blank
 * line that separated them has nothing left to separate. */
function trailingTail(lines, step) {
  let start = step.end;
  while (start > step.start) {
    const t = lines[start - 1].trim();
    if (t === '' || t.startsWith('#')) start--; else break;
  }
  const comments = [];
  for (let i = start; i < step.end; i++) if (lines[i].trim().startsWith('#')) comments.push(i);
  return { start, comments };
}

export function transform(text, label = 'workflow') {
  const lines = text.split('\n');
  const results = [];
  let edits = [];

  for (const job of jobBlocks(lines)) {
    const body = lines.slice(job.start, job.end).join('\n');
    if (!isAutoMergeJob(job.name, body)) continue;
    if (alreadyFixed(body)) { results.push({ job: job.name, status: 'ALREADY' }); continue; }
    if (!RE_REQUERY.test(body)) {
      results.push({ job: job.name, status: 'UNRECOGNISED',
        why: 'no `gh pr view ... | grep` re-query, and not in the fixed shape either' });
      continue;
    }

    try {
      const steps = stepRanges(lines, job.start, job.end);
      const mi = steps.findIndex((s) => /gh pr merge/.test(lines.slice(s.start, s.end).join('\n')));
      const di = steps.findIndex((s) => RE_REQUERY.test(lines.slice(s.start, s.end).join('\n')));
      if (mi < 0 || di < 0) refuse('could not find both the merge step and the dispatch step');
      if (di !== mi + 1) refuse(`the dispatch step is not immediately after the merge step (merge #${mi}, dispatch #${di})`);

      const mergeStep = steps[mi];
      const deployStep = steps[di];
      if (deployStep.end !== job.end) {
        const tail = lines.slice(deployStep.end, job.end).filter((l) => l.trim());
        if (tail.length) refuse('the dispatch step is not the last step in the job');
      }

      const mergeRun = runBlock(lines, mergeStep);
      const deployRun = runBlock(lines, deployStep);
      if (!mergeRun || !deployRun) refuse('a step has no `run: |` block scalar');

      const mergeEnv = envOf(lines, mergeStep);
      const deployEnv = envOf(lines, deployStep);
      if (!mergeEnv) refuse('the merge step has no `env:` mapping');
      if (deployEnv && deployEnv.keys !== mergeEnv.keys) {
        refuse('the dispatch step\'s env: differs from the merge step\'s, so folding them would change it');
      }

      const old = parseOldMerge(mergeRun.body);
      for (const name of old.exported) {
        const readers = lines.slice(job.start, job.end)
          .filter((l, i) => i !== mergeRun.bodyStart - job.start
            && new RegExp(`(env\\.${name}\\b|\\$\\{?${name}\\}?\\b)`).test(l));
        if (readers.length) refuse(`the merge step exports \`${name}\` to $GITHUB_ENV and something reads it`);
      }
      const dispatch = parseOldDeploy(deployRun.body);
      const tail = trailingTail(lines, mergeStep);
      const comments = tail.comments;

      const i0 = indentOf(mergeRun.body[0]);          // run-script base indent
      const i1 = ' '.repeat(i0 + 2);
      const inner = ' '.repeat(indentOf(old.ifMerge) + 2); // where `exit 0` sat
      const pad = ' '.repeat(i0);

      /* The re-homed comment block, with its rationale paragraph normalised.
       * normaliseBlock owns that paragraph's wording; everything else in the
       * block (the per-repo dispatch-filename note, the flag-mechanism note)
       * comes back verbatim. A block it refuses to classify is re-homed
       * unchanged and left for dispatch-comment-sync to name — this script must
       * not start guessing at prose it does not own. */
      const rehomed = normaliseBlock(comments.map((i) => pad + lines[i].trim()), pad);
      const commentLines = rehomed.status === 'UNRECOGNISED'
        ? comments.map((i) => pad + lines[i].trim())
        : rehomed.lines;

      const flag = 'merged';
      const newRun = [
        `${pad}${flag}=""`,
        old.loop,
        old.ifMerge,
        `${inner}${flag}=1`,
        `${inner}break`,
        old.fi,
        ...old.loopTail,
        old.done,
        `${pad}if [ -z "$${flag}" ]; then`,
        ...old.warn.map((l) => (l.trim() ? '  ' + l : l)),
        `${i1}exit 0`,
        `${pad}fi`,
        ...commentLines,
        ...dispatch,
      ];

      /* Delete the deploy step's own lines, but leave any blank line that
       * trailed it: that blank separates this job from whatever follows, and
       * when the job is the last in the file it IS the file's final newline.
       * Eating it silently reflowed the end of every workflow. */
      let deployEnd = deployStep.end;
      while (deployEnd > deployStep.start && lines[deployEnd - 1].trim() === '') deployEnd--;

      /* Splice, high index first so earlier offsets stay valid. */
      edits.push({ from: deployStep.start, to: deployEnd, insert: [] });
      edits.push({ from: tail.start, to: deployStep.start, insert: [] });
      edits.push({ from: mergeRun.bodyStart, to: mergeRun.bodyEnd, insert: newRun });
      results.push({ job: job.name, status: 'REWRITTEN',
        dispatch: (/gh workflow run\s+(\S+)/.exec(dispatch.join('\n')) || [])[1],
        warned: dispatch.some((l) => /\|\|\s*echo/.test(l)),
        comments: commentLines.length, rationale: rehomed.status });
    } catch (e) {
      if (!(e instanceof Unrecognised)) throw e;
      results.push({ job: job.name, status: 'UNRECOGNISED', why: e.message });
      edits = edits.filter((x) => x.job !== job.name);
    }
  }

  if (!results.length) return { text, results: [{ job: '(none)', status: 'UNRECOGNISED', why: `${label}: no Dependabot auto-merge job` }] };
  if (results.every((r) => r.status !== 'REWRITTEN')) return { text, results };

  edits.sort((a, b) => b.from - a.from);
  const out = lines.slice();
  for (const e of edits) out.splice(e.from, e.to - e.from, ...e.insert);
  return { text: out.join('\n'), results };
}

/* ------------------------------------------------------------------- cli */

function main(argv) {
  const dry = argv.includes('--dry-run');
  const files = argv.filter((a) => a !== '--dry-run');
  if (!files.length) {
    console.error('usage: node transform.mjs [--dry-run] <workflow.yml> [...]');
    return 2;
  }
  let bad = 0;
  for (const file of files) {
    const before = fs.readFileSync(file, 'utf8');
    const { text, results } = transform(before, file);
    for (const r of results) {
      if (r.status === 'UNRECOGNISED') {
        bad = 1;
        console.error(`REFUSED  ${file}  [job ${r.job}]  ${r.why}`);
      } else if (r.status === 'ALREADY') {
        console.log(`no-op    ${file}  [job ${r.job}] already reads the merge's own exit status`);
      } else {
        console.log(`rewrote  ${file}  [job ${r.job}] dispatch ${r.dispatch}`
          + `${r.warned ? ' (|| echo warning kept)' : ' (no || echo, kept absent)'}`
          + `${r.comments ? `, ${r.comments} comment line(s) re-homed` : ''}`
          + `, rationale ${r.rationale.toLowerCase()}`);
      }
    }
    if (text === before) continue;
    if (dry) process.stdout.write(text);
    else fs.writeFileSync(file, text);
  }
  return bad;
}

if (import.meta.url === `file://${process.argv[1]}`) process.exit(main(process.argv.slice(2)));
