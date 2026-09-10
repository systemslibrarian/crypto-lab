#!/usr/bin/env node
/*
 * dispatch-comment-sync.js — one wording, fleet-wide, for the paragraph that
 * says WHY the auto-merge step dispatches a deploy at all.
 *
 * ---------------------------------------------------------------------------
 * Why a checker for a comment
 *
 * dispatch-sync asserts the SHAPE of the auto-merge step and deliberately never
 * compares a literal: the eight-odd labs that shipped the flag idiom first each
 * wrote it slightly differently and all of them are correct. That is the right
 * call for executable lines. It leaves the prose unguarded, and the prose is the
 * only thing in that step that explains why the `gh workflow run` line may not
 * be deleted as redundant — which is exactly what someone will do to it, because
 * from inside the file it looks like belt-and-braces beside an `on: push`
 * deploy. It is not: a merge made with secrets.GITHUB_TOKEN raises no push
 * event, so that dispatch is the ONLY thing that ships the bump.
 *
 * The 2026-08-20 incident — nine labs serving a build older than their main with
 * every checker green — is what that deletion looks like from outside.
 *
 * When this was written the fleet carried 36 distinct wordings of that
 * paragraph. None of it was agent drift: the wordings pre-date the 2026-09-10
 * auto-merge rewrite (transform.mjs preserved each repo's existing comment
 * faithfully) and had accumulated over months of one-lab-at-a-time edits.
 * 36 wordings is 36 chances for one of them to be subtly wrong and for nobody
 * to notice, because nothing compared them.
 *
 * ---------------------------------------------------------------------------
 * What is normalised, and what is deliberately NOT
 *
 * NORMALISED — the rationale paragraph. Exactly one paragraph of the comment
 * block above the dispatch makes the GITHUB_TOKEN/no-push-event argument. That
 * paragraph, and only it, is replaced by CANONICAL below.
 *
 * PRESERVED VERBATIM — every other paragraph of that block. Two kinds exist and
 * both carry real per-repo information the fleet would lose:
 *
 *   - the per-repo dispatch-filename note ("It is pages.yml here, not
 *     deploy.yml as in most of the fleet"). The fleet dispatches deploy.yml,
 *     pages.yml, deploy-pages.yml and ci.yml; a copied filename 404s only on the
 *     auto-merge path and only after a merge has landed. That note is true of
 *     one repo and false of the next, so it cannot be canonicalised.
 *   - the flag-mechanism note that six labs carry above the rationale
 *     (ablation-wire, ckks-lab, dilithium-reject, elgamal-plain, hybrid-sign,
 *     shor). Those six were the last to be moved onto the flag idiom and their
 *     comment explains the flag as well as the dispatch. That paragraph says
 *     something the other 189 do not, so it stays and they keep their own
 *     block hash. Forcing them onto one hash would delete a true explanation to
 *     make a number smaller.
 *
 * NOT TOUCHED AT ALL — anything outside that comment block. Not the executable
 * lines, not the dispatched filename, not the `|| echo "::warning::"` suffix
 * (crypto-lab-sector-vault omits it on purpose: a dispatch that fails there
 * should fail the run), not the retry count, not the `env:` mapping.
 *
 * ---------------------------------------------------------------------------
 * TWO SHAPES ARE SCANNED, because the fleet has two. 194 labs put the dispatch
 * inside the merge step's own run script with the rationale directly above that
 * line. crypto-lab-attribute-gate uses the cross-step shape dispatch-sync also
 * accepts -- the merge step exports its flag to $GITHUB_ENV, a separate step
 * guards on `if: env.merged` with a one-line `run:` -- and its rationale sits
 * above that step's `- name:`, outside any block scalar. Reading only the first
 * shape covered 194 of 195 sites and said nothing about the 195th. See sites().

 * ---------------------------------------------------------------------------
 * The last sentence is a claim about every repo this is written into
 *
 * "The dispatched run is the same gate-then-deploy pipeline, so a bad merge
 * still ships nothing." Re-derived 2026-09-10 over all 195 dispatch sites: the
 * named target workflow exists in that repo in 195/195, and in every one of them
 * the publishing job is gated — 188 by a `needs:` on the job that runs
 * actions/deploy-pages or peaceiris/actions-gh-pages, and 7 by the publish step
 * sitting after the test/build/a11y steps in one fused job (bcrypt-forge,
 * dilithium-reject, elgamal-plain, iron-letter, isogeny-gate, scloud-vault,
 * world-ciphers). There is no site where the dispatch reaches a publisher that
 * no gate precedes, so the sentence is true everywhere it is written.
 *
 * If that re-derivation ever stops holding, this file is writing a false
 * statement into ~190 repos at once. tools/dispatch-proof.js re-runs it.
 *
 * ---------------------------------------------------------------------------
 * Ownership, against transform.mjs
 *
 *   tools/transform.mjs        owns the EXECUTABLE lines of the auto-merge step
 *                              and each repo's own specifics (dispatch filename,
 *                              `|| echo` suffix, retry count, env:).
 *   tools/dispatch-comment-sync.js  owns the RATIONALE PARAGRAPH text.
 *
 * transform.mjs used to preserve every comment line it re-homed, this paragraph
 * included, which would re-scatter what this file has just unified. It now calls
 * normaliseBlock() below for that block instead, so the two cannot disagree.
 *
 * ---------------------------------------------------------------------------
 * Usage (from the crypto-lab repo root):
 *   node tools/dispatch-comment-sync.js          rewrite every drifted block
 *   node tools/dispatch-comment-sync.js check    report; exit 1 if any would change
 *   node tools/dispatch-comment-sync.js --dry-run   report + diff, write nothing
 *
 * Purely local — no network, no `gh`.
 */
'use strict';
const fs = require('fs');
const path = require('path');

/* The canonical rationale, WITHOUT the leading `# ` and without indentation —
 * both are supplied per site so each repo keeps its own. This array is the
 * single source of truth; dispatch-sync.js and transform.mjs import it from
 * here rather than carrying a copy. */
const CANONICAL = [
  'A merge made with GITHUB_TOKEN raises no push event -- GitHub suppresses',
  'them so workflows cannot retrigger themselves -- so deploy would never run',
  'and the site would keep serving the previous build. Ask for it explicitly;',
  'a workflow_dispatch through the API is not suppressed. The dispatched run',
  'is the same gate-then-deploy pipeline, so a bad merge still ships nothing.',
];

/* A paragraph is the rationale if it makes the no-push-event argument. Three
 * openings exist in the fleet and all three are matched:
 *   "... raises no push event ..."                        (most)
 *   "GitHub suppresses push events for merges ..."        (rekey-relay)
 *   "See the workflow_dispatch note at the top ..."       (sector-vault)
 * A block in which zero or two paragraphs match is REFUSED, not guessed at. */
const RATIONALE_RE = /raises no push event|raises NO push event|suppresses push events|workflow_dispatch note/i;

/* The rationale's closing claim. Four labs (bulletproofs, kerberos, lms-xmss,
 * nonce-lattice) append their filename note to this same paragraph instead of
 * starting a new one; splitting here keeps that note. */
const TERMINAL_RE = /\bships nothing\.$/;

const FLEET_ROOT = path.join(__dirname, '..', '..');

/* Same directory filter as dispatch-sync/gate-sync/deploy-sync. */
const LAB_DIR_RE = /^crypto-(lab|compare|counsel)/;

const indentOf = (l) => l.length - l.trimStart().length;

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
 * Not a YAML load, for the same reason dispatch-sync is not one: the thing being
 * edited is comment text inside a block scalar, and a parsed tree hands back one
 * opaque string per step with the comments already discarded. */

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

function isAutoMergeJob(name, body) {
  return /gh pr merge/.test(body) && (/dependabot/i.test(body) || /dependabot/i.test(name));
}

/* Every `run: |` block scalar in a range, as [start,end) line indices. */
function runBlocks(lines, from, to) {
  const out = [];
  for (let i = from; i < to; i++) {
    const m = /^(\s*)run:\s*[|>][-+]?\s*$/.exec(lines[i]);
    if (!m) continue;
    const keyInd = m[1].length;
    let j = i + 1;
    const start = j;
    for (; j < to; j++) {
      if (lines[j].trim() === '') continue;
      if (indentOf(lines[j]) <= keyInd) break;
    }
    out.push({ start, end: j });
  }
  return out;
}

/* ------------------------------------------------------------- the rewrite */

const paragraphs = (block) => {
  const out = [[]];
  for (const l of block) {
    if (l.trim() === '#') out.push([]);
    else out[out.length - 1].push(l);
  }
  return out.filter((p) => p.length);
};

/*
 * Rewrite a comment block so its rationale paragraph is CANONICAL.
 *
 *   block  the whole-line `#` comments sitting directly above the dispatch,
 *          verbatim and still indented. May be empty.
 *   pad    the indentation to emit at, taken from the dispatch line itself.
 *
 * Returns { status, lines, why }. `lines` is the replacement block, indented,
 * `#`-prefixed and ready to splice; on a refusal it is the input unchanged.
 *
 *   CANONICAL     `lines` came out byte-equal to `block`
 *   DRIFTED       rewritten
 *   ABSENT        block was empty; CANONICAL inserted (see restoreAbsent below)
 *   UNRECOGNISED  refused — zero or several rationale paragraphs, or the closing
 *                 claim buried mid-line with prose after it
 */
function normaliseBlock(block, pad) {
  const emit = (paras) => paras
    .map((p) => p.map((l) => (l.trim() === '#' ? `${pad}#` : `${pad}${l.trim()}`)))
    .reduce((acc, p) => (acc.length ? [...acc, `${pad}#`, ...p] : p), []);

  const canon = CANONICAL.map((s) => `${pad}# ${s}`);

  if (!block.length) return { status: 'ABSENT', lines: canon };

  const paras = paragraphs(block);
  const hits = paras.filter((p) => RATIONALE_RE.test(p.map((l) => l.trim()).join(' ')));
  if (hits.length !== 1) {
    return { status: 'UNRECOGNISED', lines: block,
      why: hits.length === 0
        ? 'no paragraph in the comment block makes the no-push-event argument'
        : `${hits.length} paragraphs make the no-push-event argument; which one is the rationale is a guess` };
  }

  const rationale = hits[0];
  const at = paras.indexOf(rationale);

  /* Split a same-paragraph filename note off the end of the rationale.
   *
   * The split is line-granular, which is safe only while the closing claim ends
   * its line. If some copy has wrapped it mid-line with prose after it, the
   * whole rest of the paragraph would be swallowed into the replacement and
   * silently lost — so that shape is refused instead. Nothing in the fleet is
   * shaped that way today; this is here so it cannot arrive unnoticed. */
  const text = (l) => l.trim().replace(/^#\s?/, '');
  const buried = rationale.findIndex((l) => /\bships nothing\./.test(text(l)) && !TERMINAL_RE.test(text(l)));
  if (buried >= 0) {
    return { status: 'UNRECOGNISED', lines: block,
      why: 'the closing claim is buried mid-line with prose after it; splitting the paragraph '
        + 'there would silently drop that prose' };
  }
  let tail = [];
  const termIdx = rationale.findIndex((l) => TERMINAL_RE.test(text(l)));
  if (termIdx >= 0 && termIdx < rationale.length - 1) tail = rationale.slice(termIdx + 1);

  const before = paras.slice(0, at);
  const after = paras.slice(at + 1);
  const kept = [...before, CANONICAL.map((s) => `# ${s}`), ...(tail.length ? [tail] : []), ...after];
  const out = emit(kept);

  const same = out.length === block.length && out.every((l, i) => l === block[i]);
  return { status: same ? 'CANONICAL' : 'DRIFTED', lines: out };
}

/* ------------------------------------------------------------------- sites */

/* Every place in the fleet where this paragraph belongs: the comment run above
 * the `gh workflow run` in a Dependabot auto-merge job.
 *
 * TWO SHAPES, because the fleet has two. In 194 labs the dispatch is a line
 * inside the merge step's own run script and the rationale sits directly above
 * that line. crypto-lab-attribute-gate uses the cross-step shape dispatch-sync
 * also accepts — the merge step exports its flag to $GITHUB_ENV and a separate
 * step guards on `if: env.merged == '1'` with a one-line `run:` — and there the
 * rationale sits above the step's `- name:`, outside any block scalar.
 *
 * Scanning only the first shape found 194 of 195 sites and said nothing about
 * the 195th, which is how a checker quietly stops covering a lab. Both shapes
 * are read, and each site keeps its own indentation. */
function sites(repo) {
  const out = [];
  const STEP_KEY = /^\s*(-\s+)?(name|id|if|uses|run|shell|env|with|timeout-minutes|continue-on-error|working-directory):/;
  for (const file of workflowFiles(path.join(FLEET_ROOT, repo))) {
    let lines;
    try { lines = fs.readFileSync(file, 'utf8').split('\n'); } catch { continue; }
    for (const job of jobBlocks(lines)) {
      const body = lines.slice(job.start, job.end).join('\n');
      if (!isAutoMergeJob(job.name, body)) continue;

      /* First dispatch line in the job, whatever it is nested in.
       *
       * A COMMENT MENTIONING THE COMMAND IS NOT THE COMMAND. 178 files in this
       * fleet carry `actions: write   # ... without it gh workflow run 403s`,
       * and a loose match finds that line first, in the permissions block, far
       * above the real dispatch. Match only where the command actually starts a
       * command: at the start of the line, after a `run:` key, or after a shell
       * separator — and never on a whole-line comment. */
      let disp = -1;
      for (let i = job.start; i < job.end; i++) {
        const l = lines[i];
        if (/^\s*#/.test(l)) continue;
        const code = l.replace(/\s#.*$/, '');
        if (/(^\s*|run:\s*|[;&|]\s*|\bthen\s+)gh workflow run\s/.test(code)) { disp = i; break; }
      }
      if (disp < 0) continue;

      /* Shape 1: comments sit immediately above the dispatch line. */
      if (disp - 1 >= job.start && /^\s*#/.test(lines[disp - 1])) {
        let k = disp - 1;
        while (k > job.start && /^\s*#/.test(lines[k - 1])) k--;
        out.push({ repo, file, job: job.name, disp, shape: 'in-run-script',
          blockStart: k, block: lines.slice(k, disp), pad: ' '.repeat(indentOf(lines[k])) });
        continue;
      }

      /* Shape 2: walk up over the enclosing step's own keys to the comment run
       * above its `- ` marker. Bounded, and only over keys a step may carry, so
       * this cannot wander into an unrelated comment. */
      let i = disp;
      let steps = 0;
      while (i > job.start && steps < 12 && (lines[i].trim() === '' || STEP_KEY.test(lines[i]))) {
        const isMarker = /^\s*-\s+\S/.test(lines[i]);
        i--; steps++;
        if (isMarker) break;
      }
      if (i > job.start && /^\s*#/.test(lines[i])) {
        let k = i;
        while (k > job.start && /^\s*#/.test(lines[k - 1])) k--;
        out.push({ repo, file, job: job.name, disp, shape: 'above-step',
          blockStart: k, block: lines.slice(k, i + 1), pad: ' '.repeat(indentOf(lines[k])) });
        continue;
      }

      /* No comment run in either place: restore one directly above the
       * dispatch, at the dispatch's own indentation. */
      out.push({ repo, file, job: job.name, disp, shape: 'in-run-script',
        blockStart: disp, block: [], pad: ' '.repeat(indentOf(lines[disp])) });
    }
  }
  return out;
}

/*
 * `restoreAbsent` — what to do when a repo has no comment block at all.
 *
 * DECISION: restore it, and fail `check` until it is restored. Not "pass,
 * because there is nothing to compare".
 *
 * The deletion of this paragraph and the deletion of the dispatch line it
 * defends are the same edit six months apart. A maintainer who removes the
 * comment removes the only thing in the file that answers "why dispatch when
 * there is already an `on: push` deploy above?", and the next reader answers it
 * wrong. Treating an absent block as clean would make the checker silent about
 * precisely the state that precedes the failure — the shape of every bug in the
 * 2026-08-20 incident.
 *
 * It also keeps the generator honest in the readme-sync sense: "check" means
 * "running the generator produces no change", and a generator that declines to
 * produce a missing block is not a generator.
 *
 * One lab was in this state when the rule was written: crypto-lab-attestation-
 * gate, the reference lab, whose merge step dispatches deploy.yml with no
 * rationale above it at all.
 */
const restoreAbsent = true;

function evaluate(site) {
  const r = normaliseBlock(site.block, site.pad);
  if (r.status === 'ABSENT' && !restoreAbsent) return { ...site, status: 'CANONICAL', lines: site.block };
  return { ...site, ...r };
}

function scan() {
  return siblingLabs().flatMap((repo) => sites(repo)).map(evaluate);
}

/* Apply every pending rewrite, grouped by file and spliced high-index-first so
 * a length change at one site cannot invalidate the offsets of another in the
 * same file. No lab has two today; a checker that only works while that stays
 * true is a checker that breaks silently on the day it stops. */
function applyAll(rows) {
  const byFile = new Map();
  for (const r of rows) {
    if (!byFile.has(r.file)) byFile.set(r.file, []);
    byFile.get(r.file).push(r);
  }
  for (const [file, group] of byFile) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    for (const r of [...group].sort((a, b) => b.blockStart - a.blockStart)) {
      lines.splice(r.blockStart, r.block.length, ...r.lines);
    }
    fs.writeFileSync(file, lines.join('\n'));
  }
}

/* ------------------------------------------------------------------- report */

const DIRTY = new Set(['DRIFTED', 'ABSENT', 'UNRECOGNISED']);

function report(rows, { write }) {
  const repos = new Set(rows.map((r) => r.repo));
  const by = (s) => rows.filter((r) => r.status === s);
  console.log(`Dispatch rationale blocks: ${rows.length} across ${repos.size} labs under ${FLEET_ROOT}`);
  console.log(`  ${by('CANONICAL').length} canonical, ${by('DRIFTED').length} drifted, `
    + `${by('ABSENT').length} absent, ${by('UNRECOGNISED').length} unrecognised`);

  for (const s of ['DRIFTED', 'ABSENT', 'UNRECOGNISED']) {
    const g = by(s);
    if (!g.length) continue;
    const head = { DRIFTED: 'wording differs from the canonical paragraph',
      ABSENT: 'no rationale above the dispatch at all — it would be restored',
      UNRECOGNISED: 'refused rather than guessed at; fix by hand, then re-run' }[s];
    console.log(`\n${s} (${g.length}) — ${head}:`);
    for (const r of g) {
      console.log(`  ${r.repo}  ${path.basename(r.file)} [${r.job}]`
        + (r.why ? `  — ${r.why}` : ''));
    }
  }

  if (write) {
    const changed = rows.filter((r) => r.status === 'DRIFTED' || r.status === 'ABSENT');
    applyAll(changed);
    console.log(`\nRewrote ${changed.length} block(s).`);
    if (by('UNRECOGNISED').length) console.log('Left the unrecognised ones untouched.');
  }
  return rows.filter((r) => DIRTY.has(r.status)).length;
}

function main() {
  const arg = process.argv[2];
  const check = arg === 'check';
  const dry = arg === '--dry-run';
  const rows = scan();
  const dirty = report(rows, { write: !check && !dry });
  if (dry) {
    for (const r of rows.filter((x) => x.status === 'DRIFTED' || x.status === 'ABSENT')) {
      console.log(`\n--- ${r.repo}/${path.basename(r.file)}`);
      for (const l of r.block) console.log(`- ${l}`);
      for (const l of r.lines) console.log(`+ ${l}`);
    }
  }
  if (!dirty) console.log('\nEvery dispatch rationale is the canonical paragraph.');
  return check && dirty ? 1 : 0;
}

module.exports = { CANONICAL, RATIONALE_RE, normaliseBlock, scan, sites, siblingLabs, DIRTY, FLEET_ROOT };

if (require.main === module) process.exit(main());
