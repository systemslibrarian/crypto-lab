#!/usr/bin/env node
/*
 * dispatch-sync.js — assert that the post-auto-merge deploy dispatch CANNOT be
 * skipped in silence.
 *
 * deploy-sync asks whether the live site matches main. gate-sync asks whether
 * the gate a bump merges against is the gate the deploy depends on. This one
 * asks a narrower question that neither of them can see: once a bump HAS merged
 * itself, is the `gh workflow run` that ships it reachable by a path that cannot
 * fail without saying so?
 *
 * ---------------------------------------------------------------------------
 * The construct this exists to end
 *
 *   - name: Merge any bump whose gate went green
 *     run: |
 *       for attempt in 1 2 3; do
 *         if gh pr merge --squash --delete-branch "$PR_URL"; then
 *           exit 0                    <-- the merge's exit status, discarded
 *         fi
 *         ...
 *
 *   - name: Deploy the merged result
 *     if: success()
 *     run: |
 *       if gh pr view "$PR_URL" --json state --jq .state | grep -q MERGED; then
 *         gh workflow run deploy.yml --repo "$GITHUB_REPOSITORY" --ref main \
 *           || echo "::warning::deploy dispatch failed; run deploy.yml by hand"
 *       fi
 *
 * The merge already happened, in the previous step, and its exit status was
 * thrown away. So this step asks the API whether it worked — and that question
 * can fail. A rate limit, a transient 5xx, a token that lost scope, the PR
 * object not yet consistent: any of them and the pipeline produces no output,
 * `grep -q` matches nothing, the `if` takes the else branch, and the step exits
 * 0 having printed NOTHING. Not even the `|| echo "::warning::"` fires, because
 * the `gh workflow run` it guards was never reached. The bump is on main, the
 * deploy never runs, and the site serves the pre-bump build. Nothing is red.
 *
 * `shell: bash` is not the fix, and adding it is worse than doing nothing
 * because it looks like one. Inside an `if` condition a failing pipeline takes
 * the else branch identically with or without `pipefail`, and `set -e` is
 * exempt in that position by POSIX. Measured across the fleet: a no-op in 183 of
 * 183 steps.
 *
 * The fix is to stop asking a second time. The merge command's own exit status
 * sets a shell flag; the dispatch reads the flag. Under the same injected fault
 * (`gh pr view` failing) the old construct fires no dispatch and prints nothing,
 * while the new one dispatches — because it never consults `gh pr view` at all.
 *
 * ---------------------------------------------------------------------------
 * What is asserted — the SHAPE, never a literal
 *
 * Eight labs shipped this fix first and they are the same idiom in six distinct
 * normalised forms: some declare `merged=""` before the loop and some do not;
 * some write `if gh pr merge ...; then / merged=1 / break` and some write
 * `gh pr merge ... && merged=1 && break`; the guard is `if [ -z "$merged" ];
 * then ... exit 0; fi` in some and `[ -n "$merged" ] || { ...; exit 0; }` in
 * others; the comment above the dispatch is worded differently in every one.
 * A literal comparison would pass one of them and fail seven. So the three
 * assertions here are structural:
 *
 *   1. FLAG-FROM-EXIT-STATUS — some variable is assigned in the branch the
 *      `gh pr merge` command's own exit status selects (the `then` arm of an
 *      `if`, or the right-hand side of its `&&`). Not from a later query.
 *   2. FLAG-READ-BEFORE-DISPATCH — that variable is tested, and the test comes
 *      before the `gh workflow run` line, in the same run script. Same script
 *      matters: a shell variable does not survive into the next step, so a flag
 *      set in one step and read in another is not a flag, it is a typo that
 *      happens to be falsy. (A flag deliberately exported through
 *      "$GITHUB_ENV" / "$GITHUB_OUTPUT" and read by the dispatch step's own
 *      `if:` is accepted as an equivalent shape — see crossStepFlag below.)
 *   3. NO-REQUERY — no `gh pr view` anywhere in the auto-merge job. It is the
 *      only thing in that job that asks a question whose failure is silent.
 *
 * The one literal it does assert, and by delegation only
 *
 * The three assertions above are structural on purpose, and that leaves the
 * PROSE above the dispatch unguarded — the paragraph that explains why the
 * `gh workflow run` line is not redundant beside an `on: push` deploy. Deleting
 * that paragraph, and later deleting the line it defends, are the same edit six
 * months apart, and the fleet had drifted to 35 wordings of it with nothing
 * comparing them.
 *
 * So this file also fails when that paragraph is not the canonical one — by
 * calling tools/dispatch-comment-sync.js in check mode. The canonical text is
 * NOT copied here: dispatch-comment-sync.js is its single source of truth, this
 * file only reports its verdict. A second copy would be a 29th variant waiting
 * to happen, which is the thing being fixed.
 *
 * A job with a merge and no `gh workflow run` at all fails too, as NO-DISPATCH:
 * a merge made with secrets.GITHUB_TOKEN raises no push event, so nothing else
 * will ship it. gate-sync reaches the same labs from the workflow-topology side;
 * this one names them from inside the step.
 *
 * Purely local — no network, no `gh`. Safe in the fast loop.
 *
 * Usage (from the crypto-lab repo root):
 *   node tools/dispatch-sync.js          Report; exit 0 always.
 *   node tools/dispatch-sync.js check    Same report; exit 1 if any lab's
 *                                        dispatch can be skipped in silence.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const comments = require('./dispatch-comment-sync.js');

const FLEET_ROOT = path.join(__dirname, '..', '..');

/* The same directory-name filter gate-sync and deploy-sync use: a lab is
 * examined only if someone has cloned it here. crypto-compare and crypto-counsel
 * are deliberately inside it — both carry this job and neither is under the
 * crypto-lab- prefix, so a glob on crypto-lab-* would miss them in silence. */
const LAB_DIR_RE = /^crypto-(lab|compare|counsel)/;

function siblingLabs() {
  return fs.readdirSync(FLEET_ROOT).sort()
    .filter((d) => LAB_DIR_RE.test(d))
    .filter((d) => fs.existsSync(path.join(FLEET_ROOT, d, '.github', 'workflows')));
}

function workflowFiles(repoDir) {
  const dir = path.join(repoDir, '.github', 'workflows');
  try {
    return fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).sort()
      .map((f) => path.join(dir, f));
  } catch { return []; }
}

/* ------------------------------------------------------------------ parsing
 *
 * Deliberately not a YAML load. What is being judged is the text of a shell
 * script inside a block scalar, and its line order is the whole assertion; a
 * parsed tree would hand back one opaque string per step and lose which line
 * came first. Indentation is enough to find the pieces, and every workflow in
 * this fleet is two-space indented. */

const indentOf = (l) => l.length - l.trimStart().length;

/* Top-level jobs: indent-2 keys under a column-0 `jobs:`. */
function jobBlocks(lines) {
  const out = [];
  let inJobs = false;
  let cur = null;
  for (let i = 0; i < lines.length; i++) {
    if (/^jobs:\s*(#.*)?$/.test(lines[i])) { inJobs = true; continue; }
    if (!inJobs) continue;
    if (/^\S/.test(lines[i])) {
      if (cur) { cur.end = i; out.push(cur); cur = null; }
      inJobs = false;
      continue;
    }
    const m = /^  ([A-Za-z0-9_.-]+):\s*(#.*)?$/.exec(lines[i]);
    if (m) {
      if (cur) { cur.end = i; out.push(cur); }
      cur = { name: m[1], start: i, end: lines.length };
    }
  }
  if (cur) out.push(cur);
  return out;
}

/* A Dependabot auto-merge job is one that merges a pull request on Dependabot's
 * behalf. Matched on what it DOES (`gh pr merge`) plus who it is for, not on the
 * job being called `dependabot-auto-merge`: silent-tally's is called `merge` and
 * lives in its own workflow file, and naming it here would have exempted the one
 * lab whose shape is deliberately different. */
function isAutoMergeJob(name, body) {
  return /gh pr merge/.test(body) && (/dependabot/i.test(body) || /dependabot/i.test(name));
}

/* Steps of a job, each with its `run:` block scalar (as lines) if it has one. */
function steps(lines, from, to) {
  const marks = [];
  for (let i = from; i < to; i++) {
    if (/^\s*- (name|id|uses|run|if):/.test(lines[i])) marks.push({ i, ind: indentOf(lines[i]) });
  }
  if (!marks.length) return [];
  const stepInd = Math.min(...marks.map((m) => m.ind));
  const starts = marks.filter((m) => m.ind === stepInd).map((m) => m.i);
  return starts.map((s, k) => {
    const end = k + 1 < starts.length ? starts[k + 1] : to;
    return { start: s, end, head: lines.slice(s, end), run: runScript(lines, s, end) };
  });
}

function runScript(lines, from, to) {
  for (let i = from; i < to; i++) {
    const m = /^(\s*)run:\s*[|>][-+]?\s*$/.exec(lines[i]);
    if (!m) continue;
    const keyInd = m[1].length;
    const body = [];
    for (let j = i + 1; j < to; j++) {
      if (lines[j].trim() === '') { body.push(''); continue; }
      if (indentOf(lines[j]) <= keyInd) break;
      body.push(lines[j]);
    }
    return body;
  }
  /* A one-line `run: gh pr merge ...` is still a script. */
  for (let i = from; i < to; i++) {
    const m = /^\s*run:\s*(\S.*)$/.exec(lines[i]);
    if (m) return [m[1]];
  }
  return null;
}

/* Shell comments are prose here — three of the six reference dialects put the
 * dispatch rationale in one — so nothing is judged on a commented-out line. */
const code = (script) => script.map((l) => l.replace(/(^|\s)#.*$/, '$1')).map((l) => l.trimEnd());

/* ------------------------------------------------------------- assertion 1
 *
 * The flag has to be assigned in the branch the merge's own exit status picks.
 * Both reference dialects, and nothing looser:
 *
 *   if gh pr merge ...; then      gh pr merge ... && merged=1 && break
 *     merged=1
 *
 * `merged=1` on a line of its own AFTER the `if` has closed would not be this,
 * and is not matched. */
function flagFromExitStatus(script) {
  const src = code(script);
  for (let i = 0; i < src.length; i++) {
    if (!/gh pr merge\b/.test(src[i])) continue;

    const chained = /gh pr merge\b[^\n]*?&&\s*([A-Za-z_][A-Za-z0-9_]*)=/.exec(src[i]);
    if (chained) return { flag: chained[1], line: i };

    if (/;\s*then\s*$/.test(src[i]) && /^\s*if\s+gh pr merge\b/.test(src[i])) {
      /* Scan the `then` arm only, stopping at its `fi`/`else`. */
      for (let j = i + 1; j < src.length; j++) {
        if (/^\s*(fi|else|elif)\b/.test(src[j])) break;
        const assign = /^\s*([A-Za-z_][A-Za-z0-9_]*)=\S/.exec(src[j]);
        if (assign) return { flag: assign[1], line: j };
        const exported = /^\s*echo\s+"?([A-Za-z_][A-Za-z0-9_]*)=[^"]*"?\s*>>\s*"?\$\{?(GITHUB_ENV|GITHUB_OUTPUT)\}?"?/.exec(src[j]);
        if (exported) return { flag: exported[1], line: j, exported: true };
      }
    }
  }
  return null;
}

/* ------------------------------------------------------------- assertion 2 */
function flagReadLine(script, flag, from) {
  const src = code(script);
  const re = new RegExp(
    `(\\[\\[?\\s*-[zn]\\s*"?\\$\\{?${flag}\\}?"?|`
    + `\\[\\[?\\s*"?\\$\\{?${flag}\\}?"?\\s*(=|!=|==)|`
    + `if\\s+"?\\$\\{?${flag}\\}?"?)`);
  for (let i = from + 1; i < src.length; i++) if (re.test(src[i])) return i;
  return -1;
}

function dispatchLine(script) {
  const src = code(script);
  for (let i = 0; i < src.length; i++) if (/gh workflow run\s+\S+/.test(src[i])) return i;
  return -1;
}

/* A flag exported to "$GITHUB_ENV" is a legitimate cross-step shape: the next
 * step guards on `if: env.<flag>` (or reads $<flag> from its own environment).
 * Accepted so this file judges the invariant rather than one house style. */
function crossStepFlag(step, flag) {
  const head = step.head.join('\n');
  if (new RegExp(`if:\\s*[^\\n]*\\b(env|steps\\.[A-Za-z0-9_-]+\\.outputs)\\.${flag}\\b`).test(head)) return true;
  return step.run ? flagReadLine(step.run, flag, -1) >= 0 : false;
}

/* ------------------------------------------------------------------ verdict */
function inspectJob(lines, job) {
  const body = lines.slice(job.start, job.end).join('\n');
  const st = steps(lines, job.start, job.end);

  if (/gh pr view/.test(body)) {
    return { verdict: 'RE-QUERY',
      detail: 'the dispatch is guarded by a second `gh pr view` of the PR it just merged; '
        + 'if that call fails the step prints nothing, exits 0, and never dispatches' };
  }

  const withMerge = st.filter((s) => s.run && s.run.some((l) => /gh pr merge\b/.test(l)));
  if (!withMerge.length) return { verdict: 'NO-MERGE-SCRIPT', detail: '`gh pr merge` is not inside a run script' };

  for (const step of withMerge) {
    const found = flagFromExitStatus(step.run);
    if (!found) continue;

    /* Same-script shape: flag set, flag tested, dispatch — in that order. */
    const disp = dispatchLine(step.run);
    const read = flagReadLine(step.run, found.flag, found.line);
    if (disp >= 0 && read >= 0 && read < disp) {
      return { verdict: 'OK', detail: `\`${found.flag}\` set by the merge's own exit status, tested before the dispatch` };
    }
    if (disp >= 0 && (read < 0 || read > disp)) {
      return { verdict: 'UNGUARDED-DISPATCH',
        detail: `\`${found.flag}\` is set from the merge's exit status but the dispatch does not read it first, `
          + 'so a failed merge still dispatches' };
    }

    /* Cross-step shape: exported flag, dispatch step guards on it. */
    const idx = st.indexOf(step);
    const later = st.slice(idx + 1);
    const dispStep = later.find((s) => s.run && dispatchLine(s.run) >= 0);
    if (dispStep) {
      if (found.exported && crossStepFlag(dispStep, found.flag)) {
        return { verdict: 'OK', detail: `\`${found.flag}\` exported from the merge's own exit status and read by the dispatch step` };
      }
      return { verdict: 'FLAG-NOT-READ',
        detail: `\`${found.flag}\` is set in the merge step but the dispatch step does not read it`
          + (found.exported ? '' : ' — and a shell variable does not survive into the next step') };
    }
    return { verdict: 'NO-DISPATCH',
      detail: 'the merge lands and nothing dispatches the deploy; a GITHUB_TOKEN merge raises no push event, '
        + 'so the site keeps serving the previous build' };
  }

  if (!st.some((s) => s.run && dispatchLine(s.run) >= 0)) {
    return { verdict: 'NO-DISPATCH',
      detail: 'the merge lands and nothing dispatches the deploy; a GITHUB_TOKEN merge raises no push event, '
        + 'so the site keeps serving the previous build' };
  }
  return { verdict: 'NO-FLAG',
    detail: "the merge's exit status is discarded (the success branch just `exit 0`s), so nothing downstream "
      + 'can know whether it landed' };
}

/* The publishers this fleet actually uses. Both of them, not just the first:
 * dilithium-reject and elgamal-plain publish with peaceiris/actions-gh-pages,
 * and a check that only knew actions/deploy-pages skipped them in silence —
 * which is the exact failure mode this file is written against. */
const PAGES_PUBLISHERS = [/actions\/deploy-pages/, /peaceiris\/actions-gh-pages/];

/* A repo with nothing to publish has nothing to dispatch. crypto-lab-blind-
 * oracle-api is the headless Rust/axum backend half of blind-oracle: it runs a
 * Dependabot auto-merge job and correctly dispatches no deploy, because there is
 * no Pages site. Exempted by what it contains, not by name, so a lab that later
 * grows a page stops being exempt on its own. */
function publishesPages(repo) {
  return workflowFiles(path.join(FLEET_ROOT, repo)).some((f) => {
    let text;
    try { text = fs.readFileSync(f, 'utf8'); } catch { return false; }
    return PAGES_PUBLISHERS.some((re) => re.test(text));
  });
}

function inspectLab(repo) {
  const rows = [];
  const pages = publishesPages(repo);
  for (const file of workflowFiles(path.join(FLEET_ROOT, repo))) {
    let lines;
    try { lines = fs.readFileSync(file, 'utf8').split('\n'); } catch { continue; }
    for (const job of jobBlocks(lines)) {
      const body = lines.slice(job.start, job.end).join('\n');
      if (!isAutoMergeJob(job.name, body)) continue;
      const row = { repo, workflow: path.basename(file), job: job.name, ...inspectJob(lines, job) };
      if (row.verdict === 'NO-DISPATCH' && !pages) {
        row.verdict = 'NO-PAGES';
        row.detail = 'no Pages publisher anywhere in this repo, so there is no deploy to dispatch';
      }
      rows.push(row);
    }
  }
  return rows;
}

function main() {
  const check = process.argv[2] === 'check';
  const labs = siblingLabs();
  const rows = labs.flatMap(inspectLab);
  const withJob = new Set(rows.map((r) => r.repo));
  const ok = rows.filter((r) => r.verdict === 'OK');
  const exempt = rows.filter((r) => r.verdict === 'NO-PAGES');
  const broken = rows.filter((r) => r.verdict !== 'OK' && r.verdict !== 'NO-PAGES');

  console.log(`Labs cloned here: ${labs.length} | with a Dependabot auto-merge job: ${withJob.size}`);
  console.log(`Auto-merge jobs checked: ${rows.length} (${ok.length} sound, ${broken.length} can skip the dispatch in silence)`);

  const noJob = labs.filter((l) => !withJob.has(l));
  if (noJob.length) {
    console.log(`\nNo auto-merge job, so nothing to assert (${noJob.length}):`);
    console.log(`  ${noJob.join(', ')}`);
  }
  if (exempt.length) {
    console.log(`\nAuto-merges but publishes no page, so no dispatch is owed (${exempt.length}):`);
    for (const r of exempt) console.log(`  ${r.repo}  ${r.workflow} [${r.job}]`);
  }

  const order = ['RE-QUERY', 'NO-FLAG', 'FLAG-NOT-READ', 'UNGUARDED-DISPATCH', 'NO-DISPATCH', 'NO-MERGE-SCRIPT'];
  for (const verdict of order) {
    const group = broken.filter((r) => r.verdict === verdict);
    if (!group.length) continue;
    console.log(`\n${verdict} (${group.length}) — ${group[0].detail}:`);
    for (const r of group) console.log(`  ${r.repo}  ${r.workflow} [${r.job}]`);
  }

  /* The literal half, delegated. dispatch-comment-sync owns the text; this file
   * owns nothing about it but the verdict, so the two cannot drift apart. */
  const blocks = comments.scan();
  const drift = blocks.filter((r) => comments.DIRTY.has(r.status));
  console.log(`\nDispatch rationale paragraphs: ${blocks.length} checked, `
    + `${blocks.length - drift.length} canonical, ${drift.length} not `
    + '(tools/dispatch-comment-sync.js owns the text)');
  if (drift.length) {
    for (const s of ['DRIFTED', 'ABSENT', 'UNRECOGNISED']) {
      const g = drift.filter((r) => r.status === s);
      if (!g.length) continue;
      console.log(`  ${s} (${g.length}):`);
      for (const r of g) {
        console.log(`    ${r.repo}  ${path.basename(r.file)} [${r.job}]${r.why ? `  — ${r.why}` : ''}`);
      }
    }
    console.log('  Fix with: node tools/dispatch-comment-sync.js');
  }

  if (!broken.length && !drift.length) {
    console.log('\nEvery auto-merge job sets its flag from the merge\'s own exit status and reads it before dispatching,');
    console.log('above the one canonical paragraph saying why the dispatch is there.');
    return 0;
  }
  if (!broken.length) return check ? 1 : 0;

  console.log('\nThe fix, in the merge step\'s own run script — no second question, so nothing left to fail quietly:');
  console.log('    merged=""');
  console.log('    for attempt in 1 2 3; do');
  console.log('      if gh pr merge --squash --delete-branch "$PR_URL"; then merged=1; break; fi');
  console.log('      sleep 15');
  console.log('    done');
  console.log('    [ -n "$merged" ] || { echo "::warning::gate passed, merge did not land"; exit 0; }');
  console.log('    gh workflow run <this repo\'s deploy workflow> --repo "$GITHUB_REPOSITORY" --ref main');
  console.log('\nThe dispatched filename must be the one THAT repo has — the fleet uses deploy.yml,');
  console.log('pages.yml and deploy-pages.yml. A copied name 404s only on the auto-merge path, and');
  console.log('only after a merge has already landed. Reference: crypto-lab-attestation-gate.');
  console.log('Do NOT "fix" this by adding `shell: bash` — measured a no-op in 183 of 183 steps.');
  return check ? 1 : 0;
}

/* Exported so tools/dispatch-proof.js can put the SAME verdict function over
 * fixture files instead of cloned repos. A proof that reimplements the checker
 * proves something about the reimplementation. */
function inspectText(text) {
  const lines = text.split('\n');
  const out = [];
  for (const job of jobBlocks(lines)) {
    const body = lines.slice(job.start, job.end).join('\n');
    if (!isAutoMergeJob(job.name, body)) continue;
    out.push({ job: job.name, ...inspectJob(lines, job) });
  }
  return out;
}

module.exports = { inspectText, inspectJob, jobBlocks, isAutoMergeJob };

if (require.main === module) process.exit(main());
