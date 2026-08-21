#!/usr/bin/env node
/*
 * deploy-sync.js — assert that what is on each lab's main is what the live site serves.
 *
 * Every other checker here compares files to files. This one compares main to
 * reality, because that is where this fleet actually drifts, and it drifts
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
 * What it asserts, per lab: the current origin/main sha has a COMPLETED,
 * SUCCESSFUL run of a deploying workflow. A run that was cancelled, or that
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
 *   node tools/deploy-sync.js          Report; exit 0 always.
 *   node tools/deploy-sync.js check    Same report; exit 1 on any lab that is stale.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const FLEET_ROOT = path.join(__dirname, '..', '..');

// Async on purpose: execFileSync would block the event loop and the pool below
// would run serially, which for ~180 labs is the difference between seconds and
// minutes — and a slow checker is one nobody runs.
function sh(cmd, args, cwd) {
  return new Promise((resolve) => {
    execFile(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 8 << 20 },
      (err, stdout) => resolve(err ? null : String(stdout).trim()));
  });
}

// Repos that deploy a page via Actions. A Rust service or the catalog itself has
// no Pages workflow and is not a lab this check applies to.
function deployingLabs() {
  const out = [];
  for (const repo of fs.readdirSync(FLEET_ROOT).sort()) {
    if (!/^crypto-(lab|compare|counsel)/.test(repo)) continue;
    const wfDir = path.join(FLEET_ROOT, repo, '.github', 'workflows');
    let files;
    try { files = fs.readdirSync(wfDir); } catch { continue; }
    const wf = files.find((f) => /\.ya?ml$/.test(f)
      && fs.readFileSync(path.join(wfDir, f), 'utf8').includes('deploy-pages'));
    if (wf) out.push({ repo, workflow: wf });
  }
  return out;
}

async function inspect({ repo, workflow }) {
  const dir = path.join(FLEET_ROOT, repo);
  // `name:` at the top of the deploying workflow is what shows up as run.name.
  let deployName = null;
  try {
    const wf = fs.readFileSync(path.join(dir, '.github', 'workflows', workflow), 'utf8');
    const m = /^name:\s*(.+)$/m.exec(wf);
    deployName = m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
  } catch { /* fall through */ }
  if (!deployName) return { repo, verdict: 'NO-WORKFLOW-NAME' };
  await sh('git', ['fetch', '-q', 'origin'], dir);
  const head = await sh('git', ['rev-parse', 'origin/main'], dir);
  if (!head) return { repo, verdict: 'NO-MAIN' };

  const raw = await sh('gh', ['run', 'list', '--repo', `systemslibrarian/${repo}`, '--limit', '60',
    '--json', 'databaseId,headSha,event,status,conclusion,name'], dir);
  if (!raw) return { repo, verdict: 'API-ERROR' };

  let runs;
  try { runs = JSON.parse(raw); } catch { return { repo, verdict: 'API-ERROR' }; }
  // `dynamic` runs are Dependabot's own bookkeeping; they always succeed and
  // carry main's sha, so they look convincing and mean nothing here.
  // Match on the workflow NAME the deploying file declares, not on a guess like
  // /deploy|pages/. ablation-wire deploys from a workflow called "ci", so the
  // guess reported it as never-deployed while its runs were green all along.
  const real = runs.filter((r) => r.event !== 'dynamic' && r.name === deployName);
  const shipped = real.filter((r) => r.status === 'completed' && r.conclusion === 'success');

  if (shipped.some((r) => r.headSha === head)) return { repo, verdict: 'CURRENT', head };

  const atHead = real.filter((r) => r.headSha === head);
  if (atHead.some((r) => r.status !== 'completed')) return { repo, verdict: 'PENDING', head };

  if (!shipped.length) {
    return { repo, verdict: 'NEVER-DEPLOYED', head,
      detail: atHead.length ? `newest run at head concluded ${atHead[0].conclusion}` : 'no successful deploy on record' };
  }

  // An older green deploy still counts if nothing outside .github/ changed since.
  const last = shipped[0].headSha;
  const changed = (await sh('git', ['diff', '--name-only', last, head], dir) || '')
    .split('\n').filter((f) => f && !f.startsWith('.github/'));
  if (!changed.length) return { repo, verdict: 'CURRENT', head, detail: 'only .github/ changed since the last deploy' };

  return { repo, verdict: 'STALE', head,
    detail: `live site built at ${last.slice(0, 7)}; since then ${changed.slice(0, 3).join(', ')}${changed.length > 3 ? ` (+${changed.length - 3} more)` : ''}` };
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

async function main() {
  const check = process.argv[2] === 'check';
  const labs = deployingLabs();
  const rows = await pooled(labs, inspect, 12);

  const by = (v) => rows.filter((r) => r.verdict === v);
  const stale = [...by('STALE'), ...by('NEVER-DEPLOYED')];
  const pending = by('PENDING');
  const broken = [...by('API-ERROR'), ...by('NO-MAIN')];

  console.log(`Deploying labs checked: ${rows.length} ` +
    `(${by('CURRENT').length} current, ${stale.length} stale, ${pending.length} pending)`);

  if (pending.length) {
    console.log(`\nStill running (${pending.length}):`);
    for (const r of pending) console.log(`  ${r.repo}  @${r.head.slice(0, 7)}`);
  }
  if (broken.length) {
    console.log(`\nCould not determine (${broken.length}):`);
    for (const r of broken) console.log(`  ${r.repo}  ${r.verdict}`);
  }
  if (!stale.length) {
    console.log('\nEvery lab\'s live site is built from the sha on its main.');
    return 0;
  }

  console.log(`\nStale (${stale.length}) — main has shipped nothing to these:`);
  for (const r of stale) console.log(`  ${r.repo}\n      ${r.detail}`);
  console.log('\nUsually: an auto-merge landed a bump and no deploy followed it.');
  console.log('Re-run one by hand with:  gh workflow run <deploy workflow> --repo systemslibrarian/<repo> --ref main');
  console.log('See audits/_MASTER-TEMPLATE.md §6.2 for why that does not happen on its own.');
  return check ? 1 : 0;
}

main().then((code) => process.exit(code));
