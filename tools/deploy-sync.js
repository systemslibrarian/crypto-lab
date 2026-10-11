#!/usr/bin/env node
/*
 * deploy-sync.js — verify deployment runs and Pages configuration at fetched main.
 *
 * Run: node tools/deploy-sync.js check
 * Prevents: a lab serving a build older than its own main, with nothing anywhere going red
 * Reads: sibling clones' .github/workflows/*.yml, origin/main after a git fetch in each clone, and gh run list --repo systemslibrarian/<lab>
 *
 * This checker compares main to observed publication records. Live HTML and
 * asset bytes require a separate check. Deployment records can drift
 * silently: on 2026-08-20 nine labs were serving a build older than their main
 * and nothing anywhere was red.
 *
 * The failures it exists to catch were each invisible in their own way:
 *
 *   - the dependabot auto-merge job merges with secrets.GITHUB_TOKEN, and GitHub
 *     raises no workflow events for pushes made with that token (the guard that
 *     stops workflows retriggering themselves). deploy.yml fires `on: push`, so
 *     it simply never ran after an auto-merge;
 *   - the fix for that dispatches the deploy explicitly, but the job lacked
 *     `actions: write`, so `gh workflow run` returned HTTP 403 — and because the
 *     call ends in `|| echo "::warning::"`, the job still went green;
 *   - the deploy job was gated `if: github.event_name == 'push'`, which also
 *     skips workflow_dispatch, so a dispatched run built, passed the whole gate,
 *     and skipped the deploy;
 *   - in labs where build and deploy are ONE job, gating that job off for pull
 *     requests disabled the gate itself — the PR ran nothing and reported nothing.
 *
 * None of those turn a run red. Four of the five were found only by asking this
 * question directly, which is why it is now a check rather than a habit.
 *
 * What it asserts, per lab: the fetched origin/main sha has a completed run,
 * readable successful publisher jobs/steps and compatible Pages configuration.
 * A run that was cancelled, or that
 * succeeded while skipping its deploy job, does not count — those are exactly
 * the shapes that hid the bugs above.
 *
 * Commits touching only .github/ are exempt: they cannot change the built site,
 * which is why they are pushed with [skip ci] in the first place. So an older
 * green deploy still counts, provided nothing outside .github/ changed since.
 *
 * Requires the `gh` CLI (authenticated) and network. It is the only checker here
 * that is not purely local, so it is not part of the fast pre-commit loop — run
 * it after any cross-repo pass, and after anything that changes a workflow.
 *
 * Usage (from the crypto-lab repo root):
 *   node tools/deploy-sync.js          Report; exit 1 for unavailable or pending verification.
 *   node tools/deploy-sync.js check    Same report; exit 1 on stale, pending or unreadable evidence.
 *   node tools/deploy-sync.js selftest Offline: the stale-cause classifier against fixtures.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const FLEET_ROOT = path.join(__dirname, '..', '..');
const { siblingLabs: siblingLabsForFloor, fleetUnreadLine } = require('./sibling-labs.js');

// Async on purpose: execFileSync would block the event loop and the pool below
// would run serially, which for ~180 labs is the difference between seconds and
// minutes — and a slow checker is one nobody runs.
function sh(cmd, args, cwd) {
  return new Promise((resolve) => {
    execFile(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 8 << 20 },
      (err, stdout) => resolve(err ? null : String(stdout).trim()));
  });
}

/* Repos that deploy a page via Actions. A Rust service or the catalog itself has
 * no Pages workflow and is not a lab this check applies to.
 *
 * IT USED TO MATCH THE LITERAL `deploy-pages` AND NOTHING ELSE, which is the same
 * defect gate-sync had until 2026-09-10 and fixed with PAGES_PUBLISHERS. The two
 * labs then publishing with `peaceiris/actions-gh-pages` -- dilithium-reject and
 * elgamal-plain, both of which have since migrated to an uploaded artifact, so no
 * repo in the fleet uses that publisher now -- were therefore not in this
 * checker's denominator at all: not judged current, not judged stale, absent. On
 * 2026-10-01 both were found serving a build from 2026-07-11 -- nearly three
 * months -- with every check in the fleet green, and crypto-lab-dilithium-reject's
 * live CSS was missing an a11y fix its own main had carried the whole time. The
 * sweep that found it measured the page at 204px of horizontal scroll.
 *
 * The publisher set is now imported from gate-sync rather than copied, so the two
 * checkers cannot disagree about what a publisher is.
 *
 * And the skipped repos are NAMED. A count of what a checker recognised, with no
 * list of what it did not, is how both of these hid for three months. */
const { PAGES_PUBLISHERS, parseYaml } = require('./gate-sync.js');

const USES_RE = /^\s*-?\s*uses:\s*([A-Za-z0-9._-]+\/[A-Za-z0-9._-]+)/gm;

/** Every action a workflow file uses, lowercased, as gate-sync normalises them. */
function usesIn(text) {
  const out = new Set();
  for (const m of text.matchAll(USES_RE)) out.add(m[1].toLowerCase());
  return out;
}

async function deployingLabs() {
  const repos = fs.readdirSync(FLEET_ROOT).sort().filter((repo) => {
    if (!/^crypto-(lab|compare|counsel)/.test(repo)) return false;
    try { return fs.statSync(path.join(FLEET_ROOT, repo, '.git')).isDirectory(); }
    catch { return false; }
  });
  const rows = await pooled(repos, async (repo) => {
    const dir = path.join(FLEET_ROOT, repo);
    if (await sh('git', ['fetch', '-q', 'origin'], dir) === null) return { repo, verdict: 'API-ERROR', detail: 'git fetch failed; tracking ref is not current evidence' };
    const head = await sh('git', ['rev-parse', 'origin/main'], dir);
    if (!head) return { repo, verdict: 'NO-MAIN' };
    const tree = await sh('git', ['ls-tree', '-r', '--name-only', head, '.github/workflows'], dir);
    if (tree === null) return { repo, verdict: 'API-ERROR', detail: 'workflow tree unreadable' };
    for (const file of tree.split('\n').filter((f) => /\.ya?ml$/.test(f))) {
      const text = await sh('git', ['show', `${head}:${file}`], dir);
      if (text === null) return { repo, verdict: 'API-ERROR', detail: 'committed workflow unreadable' };
      const publishers = [...usesIn(text)].filter((u) => PAGES_PUBLISHERS.has(u));
      if (!publishers.length) continue;
      let wf;
      try {
        wf = parseYaml(text);
        if (!wf || typeof wf !== 'object' || Array.isArray(wf)) throw new Error('Workflow object required');
      } catch { return { repo, verdict: 'API-ERROR', detail: 'workflow cannot be parsed' }; }
      // Local reusable workflows are resolved from this same fetched commit,
      // never a dirty working file or an unrelated workflow version.
      const workflowSources = {};
      async function readCalls(value) {
        for (const job of Object.values(value.jobs || {})) {
          if (!job || typeof job !== 'object') continue;
          if (typeof job.uses !== 'string' || !/^\.\/\.github\/workflows\/[A-Za-z0-9._-]+\.ya?ml$/.test(job.uses)) continue;
          if (Object.hasOwn(workflowSources, job.uses)) continue;
          const source = await sh('git', ['show', `${head}:${job.uses.slice(2)}`], dir);
          try { workflowSources[job.uses] = source === null ? null : parseYaml(source); }
          catch { workflowSources[job.uses] = null; }
          if (workflowSources[job.uses]) await readCalls(workflowSources[job.uses]);
        }
      }
      await readCalls(wf);
      return { repo, workflow: file, head, wf, publishers, workflowSources };
    }
    return { repo, skipped: true };
  }, 8);
  const out = rows.filter((r) => !r.skipped);
  out.skipped = rows.filter((r) => r.skipped).map((r) => r.repo);
  return out;
}

// A run summary is not proof that its publish action executed. Match the
// committed job and action-step names to the job API, and fail closed on
// missing, ambiguous, skipped or inconsistent evidence.
// GitHub reports each matrix cell and each called job separately. Derive their
// exact names from finite committed configuration; unresolved expressions,
// duplicate names and unreadable/cyclic calls are coverage gaps, not successes.
function configuredJobInstances(wf, sources = {}, prefix = '', stack = []) {
  if (!wf?.jobs || typeof wf.jobs !== 'object' || Array.isArray(wf.jobs)) return null;
  const groups = new Map(), records = [];
  const scalar = (v) => ['string', 'number', 'boolean'].includes(typeof v) && !String(v).includes('${{');
  for (const [id, job] of Object.entries(wf.jobs)) {
    if (!job || typeof job !== 'object' || Array.isArray(job)) return null;
    if (typeof job.uses !== 'string' && (!Array.isArray(job.steps) || job.steps.some((step) => !step || typeof step !== 'object' || Array.isArray(step)))) return null;
    const matrix = job.strategy?.matrix;
    let combinations = [{}];
    if (matrix !== undefined) {
      if (!matrix || typeof matrix !== 'object' || Array.isArray(matrix)) return null;
      const axes = Object.keys(matrix).filter((k) => k !== 'include' && k !== 'exclude');
      for (const axis of axes) {
        if (!Array.isArray(matrix[axis]) || !matrix[axis].length || combinations.length * matrix[axis].length > 256 || !matrix[axis].every(scalar)) return null;
        combinations = combinations.flatMap((row) => matrix[axis].map((v) => ({ ...row, [axis]: v })));
        if (combinations.length > 256) return null;
      }
      const entries = (key) => matrix[key] === undefined ? [] : matrix[key];
      for (const key of ['include', 'exclude']) {
        if (!Array.isArray(entries(key)) || entries(key).some((v) => !v || typeof v !== 'object' || Array.isArray(v) || !Object.values(v).every(scalar))) return null;
      }
      const originals = axes.length ? combinations.filter((row) => !entries('exclude').some((ex) => Object.entries(ex).every(([k, v]) => row[k] === v))) : [];
      combinations = originals.map((row) => ({ ...row }));
      for (const include of entries('include')) {
        let applied = false;
        originals.forEach((original, i) => {
          if (axes.every((key) => !Object.hasOwn(include, key) || include[key] === original[key])) {
            Object.assign(combinations[i], include); applied = true;
          }
        });
        if (!applied) combinations.push({ ...include });
      }
      if (!combinations.length || combinations.length > 256) return null;
    }
    const own = [];
    for (const combination of combinations) {
      let name = job.name ?? id;
      if (typeof name !== 'string') return null;
      name = name.replace(/\$\{\{\s*matrix\.([A-Za-z0-9_-]+)\s*\}\}/g, (whole, key) => Object.hasOwn(combination, key) ? String(combination[key]) : whole);
      if (name.includes('${{')) return null;
      if (matrix !== undefined && job.name === undefined) name += ` (${Object.values(combination).join(', ')})`;
      if (typeof job.uses === 'string') {
        const source = sources[job.uses];
        if (!source || stack.includes(job.uses) || stack.length >= 10) return null;
        const children = configuredJobInstances(source, sources, `${prefix}${name} / `, [...stack, job.uses]);
        if (!children?.length) return null;
        own.push(...children);
      } else own.push({ name: prefix + name, job, matrix: combination, required: [] });
    }
    groups.set(id, own);
    records.push(...own);
  }
  for (const [id, own] of groups) {
    const needs = wf.jobs[id].needs;
    if (needs !== undefined && typeof needs !== 'string' && !Array.isArray(needs)) return null;
    for (const dependency of typeof needs === 'string' ? [needs] : needs || []) {
      if (typeof dependency !== 'string' || !groups.has(dependency) || dependency === id) return null;
      for (const instance of own) instance.required.push(...groups.get(dependency).map((x) => x.name));
    }
  }
  if (new Set(records.map((r) => r.name)).size !== records.length) return null;
  return records;
}

function verifyPublishJobs(wf, jobs, workflowSources = {}) {
  if (!Array.isArray(jobs) || !jobs.length) return false;
  if (jobs.some((j) => !j || typeof j !== 'object' || (j.conclusion === 'success' && (!Array.isArray(j.steps) || j.steps.some((s) => !s || typeof s !== 'object'))))) return false;
  if (jobs.some((j) => !['success', 'skipped'].includes(j.conclusion))) return false;
  const configured = configuredJobInstances(wf, workflowSources);
  if (!configured) return false;
  // Missing standalone verification jobs are incomplete too, even when the
  // publisher did not declare them in needs. Pagination/partial API responses
  // must not silently remove a configured stage from global verification.
  if (configured.some((entry) => jobs.filter((job) => job.name === entry.name).length !== 1)) return false;
  const diagnosticSkip = (observedJob, observedStep) => {
    const matches = configured.filter((entry) => entry.name === observedJob.name);
    if (matches.length !== 1) return false;
    // Failure/cancellation-only artifact uploads are diagnostics. A skipped
    // test, required download or Pages artifact upload is incomplete evidence.
    return (matches[0].job.steps || []).some((step) =>
      String(step.uses || '').split('@')[0].toLowerCase() === 'actions/upload-artifact'
      && /^(?:\$\{\{\s*)?(?:failure\(\)|cancelled\(\))(?:\s*\}\})?$/.test(String(step.if || '').trim())
      && observedStep.name === (step.name || `Run ${step.uses}`));
  };
  if (jobs.some((j) => j.conclusion === 'success' && (!Array.isArray(j.steps) || !j.steps.length || j.steps.some((st) =>
    st.conclusion !== 'success' && !(st.conclusion === 'skipped' && diagnosticSkip(j, st)))))) return false;
  for (const observed of jobs.filter((j) => j.conclusion === 'success')) {
    const entry = configured.find((x) => x.name === observed.name);
    if (!entry || !Array.isArray(entry.job.steps) || !entry.job.steps.length) return false;
    const expectedNames = new Map();
    for (const step of entry.job.steps) {
      if (!step || typeof step !== 'object') return false;
      let name = step.name || (step.uses ? `Run ${step.uses}` : typeof step.run === 'string' ? `Run ${step.run.trim().split('\n')[0]}` : null);
      if (typeof name !== 'string') return false;
      name = name.replace(/\$\{\{\s*matrix\.([A-Za-z0-9_-]+)\s*\}\}/g, (whole, key) => Object.hasOwn(entry.matrix, key) ? String(entry.matrix[key]) : whole);
      if (name.includes('${{')) return false;
      expectedNames.set(name, (expectedNames.get(name) || 0) + 1);
    }
    for (const [name, count] of expectedNames) {
      if (observed.steps.filter((s) => s.name === name).length !== count) return false;
    }
  }
  let publishers = 0;
  // Check the complete prerequisite chain, including matrix cells and the
  // configured jobs inside local reusable workflows. A prefix match alone
  // cannot establish that every required cell/job was present.
  function prerequisites(entry, seen = new Set()) {
    if (seen.has(entry.name)) return false;
    const next = new Set([...seen, entry.name]);
    for (const name of entry.required) {
      const expected = configured.find((x) => x.name === name);
      const observed = jobs.filter((j) => j.name === name);
      if (!expected || observed.length !== 1 || observed[0].conclusion !== 'success' || !prerequisites(expected, next)) return false;
    }
    return true;
  }
  for (const entry of configured) {
    const job = entry.job;
    const expected = (job.steps || []).filter((st) => st.uses && PAGES_PUBLISHERS.has(String(st.uses).split('@')[0].toLowerCase()));
    if (!expected.length) continue;
    publishers++;
    const name = entry.name;
    const matched = jobs.filter((j) => j.name === name);
    if (matched.length !== 1 || matched[0].conclusion !== 'success') return false;
    const steps = matched[0].steps;
    // A skipped artifact download or verification stage in the publishing job
    // is incomplete publication evidence, even if its action reports success.
    if (!Array.isArray(steps) || !steps.length || steps.some((st) => st.conclusion !== 'success')) return false;
    if (!prerequisites(entry)) return false;
    for (const st of expected) {
      const name = st.name || `Run ${st.uses}`;
      const found = steps.filter((x) => x.name === name);
      if (found.length !== 1 || found[0].conclusion !== 'success') return false;
    }
  }
  return publishers > 0;
}

/* Does this lab's publish actually reach the site?
 *
 * `build_type: workflow` means GitHub Pages serves ONLY what an
 * actions/deploy-pages step uploads. A lab that publishes by PUSHING A BRANCH --
 * peaceiris and friends -- then updates that branch on every run while nothing
 * serves it, and every other signal in this checker says the deploy succeeded,
 * because it did. The run is not the question; what Pages is configured to serve
 * is. Both labs that hit this had a correct gate, a successful run, a freshly
 * updated gh-pages branch carrying the right bytes, and a live site frozen in
 * July.
 *
 * So: a lab whose Pages source is `workflow` and whose workflows contain no
 * artifact-uploading publisher is PUBLISH-UNSERVED.
 *
 * ONE DIRECTION ONLY, and the symmetric version was written first and measured
 * wrong. It also failed `build_type: legacy` with an artifact publisher, reasoning
 * that an artifact uploaded into a branch-building Pages serves nothing. That
 * accused crypto-counsel, whose Pages source is `legacy` on `main/` and whose
 * latest Pages build is the merge commit from the same hour -- its site updates
 * perfectly, because Pages builds the branch whether or not an artifact was
 * uploaded. The two directions are not symmetric: `workflow` serves ONLY
 * artifacts, so a branch push reaches nothing, while `legacy` serves the branch
 * regardless, so a stray artifact upload is dead configuration rather than a
 * broken site. Caught by checking what the checker had read about the one lab it
 * newly accused, before believing the accusation.
 *
 * The dead-configuration case is reported as a note, never a failure.
 *
 * Pure, so selftest can drive every branch with no network. */
const ARTIFACT_PUBLISHERS = new Set(['actions/deploy-pages']);

function judgePublishPath(buildType, publishers) {
  if (!buildType) return null;                       // could not read: never a verdict
  const artifact = publishers.some((p) => ARTIFACT_PUBLISHERS.has(p));
  const branch = publishers.some((p) => !ARTIFACT_PUBLISHERS.has(p));
  if (buildType === 'workflow' && !artifact && branch) {
    return { cause: 'PUBLISH-UNSERVED',
      detail: 'Pages serves an uploaded artifact (build_type: workflow) and this lab publishes by pushing a branch, so nothing serves what it builds' };
  }
  if (buildType === 'legacy' && artifact && !branch) {
    return { cause: 'ARTIFACT-UNUSED', note: true,
      detail: 'Pages builds from a branch (build_type: legacy), so the uploaded artifact is never served — dead configuration, not a stale site' };
  }
  return null;
}

// Why a stale lab is stale. The report used to guess, in one sentence, for every
// lab at once: "usually an auto-merge landed a bump and no deploy followed it".
// On 2026-09-29 that sentence was wrong for all five stale labs — every one had
// a deploy run that FIRED and FAILED, four of them in a gate step, and one of
// those was a stale test fixture rather than a real defect. The guess sent a
// reader to `gh workflow run`, which re-runs the same failing workflow and
// changes nothing. So the cause is now derived per lab from that lab's own runs.
//
// Pure on purpose: it takes the already-filtered run list and returns a verdict,
// so `selftest` can exercise every branch from fixtures with no network.
function classifyStaleCause(real, head) {
  const atHead = real.filter((r) => r.headSha === head);
  if (!atHead.length) {
    return { cause: 'NO-RUN', detail: 'no run of this workflow exists for this sha' };
  }
  // Newest first is how `gh run list` returns them; the newest attempt is the
  // one that decides the current state.
  const r = atHead[0];
  if (r.status !== 'completed') {
    return { cause: 'PENDING', runId: r.databaseId, detail: `run is still ${r.status}` };
  }
  if (r.conclusion === 'cancelled') {
    return { cause: 'CANCELLED', runId: r.databaseId,
      detail: 'run was cancelled — a superseding push or a concurrency group, and nothing shipped' };
  }
  if (r.conclusion === 'failure' || r.conclusion === 'timed_out') {
    return { cause: 'FAILED', runId: r.databaseId, detail: `run concluded ${r.conclusion}` };
  }
  // Success at head would have been CURRENT before we got here, so a success
  // reaching this point means the deploy JOB inside it did not run.
  return { cause: 'NO-DEPLOY-JOB', runId: r.databaseId,
    detail: `run concluded ${r.conclusion} but shipped nothing — its deploy job was skipped` };
}

// The failing job and step out of `gh run view --json jobs`. Named rather than
// summarised: "Accessibility gate" and "Check formatting" are different problems
// and a reader should not have to open the run to tell which they have.
function failingStep(jobs) {
  if (!Array.isArray(jobs)) return null;
  for (const j of jobs) {
    if (j.conclusion !== 'failure') continue;
    const step = (j.steps || []).find((st) => st.conclusion === 'failure');
    return { job: j.name, step: step ? step.name : null };
  }
  return null;
}

async function inspect({ repo, workflow, publishers = [], head, wf, workflowSources = {}, verdict, detail }) {
  if (verdict) return { repo, verdict, detail };
  const dir = path.join(FLEET_ROOT, repo);
  const deployName = wf.name;
  if (!deployName || typeof deployName !== 'string') return { repo, verdict: 'NO-WORKFLOW-NAME' };
  /* Asked of Pages itself, because every other signal here is about the RUN and
     the run can succeed into nothing. A null answer is UNREAD, never a verdict. */
  const pagesRaw = await sh('gh', ['api', `repos/systemslibrarian/${repo}/pages`,
    '--jq', '.build_type'], dir);
  const buildType = pagesRaw ? pagesRaw.trim() : null;
  if (!['workflow', 'legacy'].includes(buildType)) return { repo, verdict: 'API-ERROR' };
  const unserved = judgePublishPath(buildType, publishers);
  if (unserved && !unserved.note) {
    return { repo, verdict: 'UNSERVED', head, buildType, publishers,
      cause: unserved.cause, detail: unserved.detail };
  }

  const raw = await sh('gh', ['run', 'list', '--repo', `systemslibrarian/${repo}`, '--limit', '60',
    '--json', 'databaseId,headSha,event,status,conclusion,name,updatedAt'], dir);
  if (!raw) return { repo, verdict: 'API-ERROR' };

  let runs;
  try { runs = JSON.parse(raw); } catch { return { repo, verdict: 'API-ERROR' }; }
  // `dynamic` runs are Dependabot's own bookkeeping; they always succeed and
  // carry main's sha, so they look convincing and mean nothing here.
  // Match on the workflow NAME the deploying file declares, not on a guess like
  // /deploy|pages/. ablation-wire deploys from a workflow called "ci", so the
  // guess reported it as never-deployed while its runs were green all along.
  if (!Array.isArray(runs)) return { repo, verdict: 'API-ERROR' };
  const real = runs.filter((r) => r.event !== 'dynamic' && r.name === deployName && r.event !== 'pull_request');
  if (real.every((r) => r.updatedAt)) real.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const shipped = real.filter((r) => r.status === 'completed' && r.conclusion === 'success');

  const atHead = real.filter((r) => r.headSha === head);
  const latest = atHead[0];
  if (latest && latest.status !== 'completed') return { repo, verdict: 'PENDING', head };
  if (latest && ['failure', 'timed_out', 'action_required'].includes(latest.conclusion)) return { repo, verdict: 'CHECK-FAILED', head, detail: `newest run ${latest.databaseId} concluded ${latest.conclusion}` };

  let failedVerification = null;
  async function published(run) {
    const raw = await sh('gh', ['run', 'view', String(run.databaseId), '--repo', `systemslibrarian/${repo}`, '--json', 'jobs'], dir);
    let jobs;
    try { jobs = JSON.parse(raw).jobs; } catch { return false; }
    if (!verifyPublishJobs(wf, jobs, workflowSources)) {
      if (Array.isArray(jobs)) {
        const failed = jobs.find((job) => job && (job.conclusion === 'failure' || (Array.isArray(job.steps) && job.steps.some((step) => step?.conclusion === 'failure'))));
        if (failed) {
          const step = Array.isArray(failed.steps) ? failed.steps.find((value) => value?.conclusion === 'failure') : null;
          failedVerification = `run ${run.databaseId}: observed verification ${failed.name}${step ? ' / ' + step.name : ''} failed; publisher success is not global verification success`;
        }
      }
      return false;
    }
    if (buildType === 'legacy') {
      const built = await sh('gh', ['api', `repos/systemslibrarian/${repo}/pages/builds/latest`], dir);
      let value;
      try { value = JSON.parse(built); } catch { return false; }
      if (value.status !== 'built' || value.commit !== run.headSha) return false;
    }
    return true;
  }
  const current = shipped.find((r) => r.headSha === head);
  if (current) {
    const ok = await published(current);
    return { repo, verdict: ok ? 'CURRENT' : failedVerification ? 'CHECK-FAILED' : 'API-ERROR', head,
      detail: failedVerification || 'Publish-job evidence is separate from a live-byte verification' };
  }
  if (!shipped.length) return { repo, verdict: 'NEVER-DEPLOYED', head, ...classifyStaleCause(real, head) };

  const previous = shipped[0];
  const diff = await sh('git', ['diff', '--name-only', previous.headSha, head], dir);
  if (diff === null) return { repo, verdict: 'API-ERROR', head };
  const changed = diff.split('\n').filter((f) => f && !f.startsWith('.github/'));
  if (!changed.length) {
    // Empty tree diff across unrelated commits is not source ancestry.
    if (await sh('git', ['merge-base', '--is-ancestor', previous.headSha, head], dir) === null) return { repo, verdict: 'API-ERROR', head };
    const ok = await published(previous);
    return { repo, verdict: ok ? 'CURRENT' : failedVerification ? 'CHECK-FAILED' : 'API-ERROR', head,
      detail: failedVerification || 'Only .github/ changed after an ancestor with a verified publish job; live bytes not checked' };
  }
  const last = previous.headSha;

  return { repo, verdict: 'STALE', head, ...classifyStaleCause(real, head),
    detail: `last successful run at ${last.slice(0, 7)}; since then ${changed.slice(0, 3).join(', ')}${changed.length > 3 ? ` (+${changed.length - 3} more)` : ''}; live bytes not checked` };
}

// ~180 labs, each needing a fetch and an API call. Serial takes minutes, which
// would make this a check nobody runs. Fan out with a bounded pool instead.
function pooled(items, fn, width) {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(width, items.length) }, async () => {
    for (let i = next++; i < items.length; i = next++) out[i] = await fn(items[i]);
  });
  return Promise.all(workers).then(() => out);
}

// Offline test of the two pure functions above, over tools/fixtures/deploy/.
// They are the whole of the new behaviour and they are the part that decides
// what a maintainer is told to do next, so they are tested rather than trusted.
// Every fixture carries a `why`, because a fixture whose reason is not written
// down is one the next person deletes when it becomes inconvenient.
function selftest() {
  const dir = path.join(__dirname, 'fixtures', 'deploy');
  let pass = 0;
  const fail = [];
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.json')) continue;
    const fx = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const got = fx.pages ? (judgePublishPath(fx.pages.buildType, fx.pages.publishers) || { cause: null })
      : fx.jobs ? failingStep(fx.jobs)
        : classifyStaleCause(fx.runs, fx.head);
    const bad = Object.entries(fx.expect).filter(([k, v]) => (got || {})[k] !== v);
    if (bad.length) {
      fail.push(`${f}: expected ${JSON.stringify(fx.expect)}, got ${JSON.stringify(got)}`);
    } else {
      pass++;
      console.log(`  ok  ${f.replace(/\.json$/, '')} \u2014 ${fx.why.split('.')[0]}`);
    }
  }
  // Every cause the reporter can print must be reachable from a fixture, or a
  // branch gets added with no test and the suite still says green.
  const covered = new Set(fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).expect.cause)
    .filter(Boolean));
  for (const cause of Object.keys(CAUSE_TEXT)) {
    if (!covered.has(cause)) fail.push(`no fixture covers cause ${cause}`);
  }
  /* PUBLISH-UNSERVED is reported in its own section rather than through
     CAUSE_TEXT, so the loop above cannot reach it. Required explicitly, because a
     cause with no fixture is a branch nobody tested. */
  if (!covered.has('PUBLISH-UNSERVED')) fail.push('no fixture covers cause PUBLISH-UNSERVED');
  console.log(fail.length ? `\n${pass} passed, ${fail.length} FAILED` : `\n${pass} passed, 0 failed`);
  for (const m of fail) console.log(`  FAIL  ${m}`);
  return fail.length ? 1 : 0;
}

const CAUSE_TEXT = {
  'NO-RUN': 'never fired for this sha',
  FAILED: 'fired and FAILED',
  CANCELLED: 'fired and was CANCELLED',
  PENDING: 'still running',
  'NO-DEPLOY-JOB': 'succeeded but skipped its deploy job',
};

async function main() {
  const check = process.argv[2] === 'check';
  /* selftest is offline by design -- fixtures only, no clones -- so it runs
   * before the fleet floor below. */
  if (process.argv[2] === 'selftest') return selftest();
  /* A checker that cannot see the clones must not report them clean. Four of
   * these reported a clean pass over zero labs until 2026-10-02 -- see the
   * measurements in tools/sibling-labs.js. The floor is the census, so it moves
   * when a lab is added or removed and nowhere else. */
  {
    const unread = fleetUnreadLine(siblingLabsForFloor(FLEET_ROOT));
    if (unread) { console.log(unread); return 1; }
  }
  const labs = await deployingLabs();
  const rows = await pooled(labs, inspect, 12);

  const by = (v) => rows.filter((r) => r.verdict === v);
  const unservedAll = by('UNSERVED');
  const unserved = unservedAll.filter((r) => r.cause === 'PUBLISH-UNSERVED');
  const notes = unservedAll.filter((r) => r.cause === 'ARTIFACT-UNUSED');
  const stale = [...by('STALE'), ...by('NEVER-DEPLOYED')];
  const pending = by('PENDING');
  const broken = [...by('API-ERROR'), ...by('NO-MAIN'), ...by('NO-WORKFLOW-NAME'), ...by('CHECK-FAILED')];

  console.log(`Deploying labs checked: ${rows.length} ` +
    `(${by('CURRENT').length} current, ${stale.length} stale, ${pending.length} pending`
    + `${unserved.length ? `, ${unserved.length} UNSERVED` : ''})`);
  /* Named, not counted. A bare "N skipped" is how two labs served a July build
     for three months while every number here looked healthy. */
  if (labs.skipped && labs.skipped.length) {
    console.log(`No Pages publisher in any workflow, so not judged (${labs.skipped.length}): `
      + labs.skipped.join(', '));
  }

  if (notes.length) {
    console.log(`\nARTIFACT-UNUSED (${notes.length}) — a note, not a failure. Pages builds from a branch here,`);
    console.log('so the artifact these upload is never served. The site is current; the upload is dead');
    console.log('configuration. Removing it is tidying, and leaving it costs a reader a wrong guess.');
    for (const r of notes) console.log(`  ${r.repo}  build_type: ${r.buildType}; uploads ${r.publishers.join(', ')}`);
  }

  if (unserved.length) {
    console.log(`\nPUBLISH-UNSERVED (${unserved.length}) — the deploy runs and succeeds, and nothing`);
    console.log('serves what it builds. Pages is configured for a different publish path than the one');
    console.log('this lab uses, so the run is green, the branch or artifact is fresh, and the live site');
    console.log('does not move. This is the one failure every other line in this report cannot see.');
    for (const r of unserved) {
      console.log(`  ${r.repo}`);
      console.log(`      build_type: ${r.buildType}; publishes with ${r.publishers.join(', ') || '(none found)'}`);
      console.log(`      ${r.detail}`);
    }
    console.log('');
    console.log('Fix by making the lab publish the way its Pages source expects: an');
    console.log('actions/upload-pages-artifact step plus an actions/deploy-pages job for');
    console.log('build_type workflow, which is the shape audits/_MASTER-TEMPLATE.md §6.1-6.2');
    console.log('specifies and 193 labs in this fleet already use.');
  }

  if (pending.length) {
    console.log(`\nStill running (${pending.length}):`);
    for (const r of pending) console.log(`  ${r.repo}  @${r.head.slice(0, 7)}`);
  }
  if (broken.length) {
    console.log(`\nCould not determine (${broken.length}):`);
    for (const r of broken) {
      console.log(`  ${r.repo}  ${r.verdict}`);
      if (r.detail) console.log(`      ${r.detail}`);
    }
  }
  if (!stale.length) {
    if (!rows.length || unserved.length || broken.length || pending.length) return 1;
    console.log('\nAll inspected deployment runs have verified publish jobs and Pages configuration. Live bytes require separate verification.');
    return 0;
  }

  // One extra API call per STALE lab (not per lab), to name the failing job and
  // step. Stale labs are a handful; this keeps the whole run inside its budget.
  await pooled(stale.filter((r) => r.cause === 'FAILED'), async (r) => {
    const raw = await sh('gh', ['run', 'view', String(r.runId),
      '--repo', `systemslibrarian/${r.repo}`, '--json', 'jobs'], FLEET_ROOT);
    if (!raw) return;
    try { r.failing = failingStep(JSON.parse(raw).jobs); } catch { /* leave unnamed */ }
  }, 8);

  console.log(`\nStale (${stale.length}) — main has shipped nothing to these:`);
  for (const r of stale) {
    console.log(`  ${r.repo}`);
    console.log(`      ${r.detail}`);
    console.log(`      deploy run: ${CAUSE_TEXT[r.cause] || r.cause}${r.runId ? ` (run ${r.runId})` : ''}`);
    if (r.failing) {
      console.log(`      failing job: ${r.failing.job}${r.failing.step ? ` \u2192 step "${r.failing.step}"` : ''}`);
    }
  }

  // The remedy depends on the cause, so it is printed per cause rather than as
  // one sentence over all of them. Telling someone to re-dispatch a workflow
  // that just failed wastes a run and teaches them the report is noise.
  const seen = new Set(stale.map((r) => r.cause));
  console.log('');
  if (seen.has('NO-RUN')) {
    console.log('NO-RUN: nothing fired for this sha — the auto-merge landed a bump with no deploy after it.');
    console.log('        gh workflow run <deploy workflow> --repo systemslibrarian/<repo> --ref main');
    console.log('        See audits/_MASTER-TEMPLATE.md §6.2 for why that does not happen on its own.');
  }
  if (seen.has('FAILED')) {
    console.log('FAILED: the deploy DID fire and failed. Re-dispatching runs the same failure again —');
    console.log('        read the named step first. A gate step can fail for a non-product reason');
    console.log('        (a stale fixture, a config that moved), which does not look different here.');
  }
  if (seen.has('CANCELLED')) {
    console.log('CANCELLED: superseded or cancelled, so nothing shipped. Check whether a newer sha');
    console.log('        deployed instead before re-running this one.');
  }
  if (seen.has('PENDING')) {
    console.log('PENDING: still running. Re-check before treating it as stale.');
  }
  if (seen.has('NO-DEPLOY-JOB')) {
    console.log('NO-DEPLOY-JOB: the run went green while its deploy job was skipped — an `if:` gate');
    console.log('        that excludes the event that triggered it. _MASTER-TEMPLATE.md §6.2.');
  }
  return 1;
}

module.exports = { verifyPublishJobs };
if (require.main === module) main().then((code) => process.exit(code)).catch((e) => { console.error('Deployment verification incomplete:', e.message); process.exitCode = 1; });
