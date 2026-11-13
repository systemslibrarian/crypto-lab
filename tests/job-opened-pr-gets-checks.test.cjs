'use strict';

/*
 * A pull request this repository's own jobs open must get the checks that
 * guard the catalog, not only the security scanners -- and must keep getting
 * them when the job pushes again.
 *
 * GitHub raises no `pull_request` event for a PR created with
 * `secrets.GITHUB_TOKEN`. Measured on #467: four check runs reported, CodeQL
 * and its three Analyze jobs, and the twelve that read the catalog never ran,
 * while `gh pr checks` called that green. The PUSH side has the same property:
 * a refresh pushed to an already-open PR branch as GITHUB_TOKEN raises no
 * `synchronize`, so the PR goes on showing checks for the previous commit.
 *
 * Same platform rule the repository already defends one layer up: a
 * GITHUB_TOKEN merge raises no push event, which is why every lab carries an
 * explicit deploy dispatch and why dispatch-sync exists.
 *
 * So both halves are asserted, because fixing only the create leaves a PR that
 * is checked once and then silently stale.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
/* The repository's ONE workflow parser, the same one pr-check-set.js uses.
   A second parser here could disagree with the tool it is guarding. */
const { parseYaml } = require('../tools/gate-sync.js');

const DIR = path.join(__dirname, '..', '.github', 'workflows');
const APP_TOKEN = /steps\.app-token\.outputs\.token/;
const GITHUB_TOKEN = /secrets\.GITHUB_TOKEN/;

/** Workflows with a job that runs `gh pr create`, parsed rather than grepped. */
function prOpeningJobs() {
  const out = [];
  for (const name of fs.readdirSync(DIR).filter((f) => f.endsWith('.yml'))) {
    const text = fs.readFileSync(path.join(DIR, name), 'utf8');
    if (!text.includes('gh pr create')) continue;
    const doc = parseYaml(text);
    for (const [jobName, job] of Object.entries(doc.jobs || {})) {
      const steps = job.steps || [];
      if (!steps.some((s) => String(s.run || '').includes('gh pr create'))) continue;
      out.push({ name, jobName, steps });
    }
  }
  return out;
}

test('a job that opens a PR creates it with a credential that raises the event', () => {
  const jobs = prOpeningJobs();
  assert.ok(jobs.length > 0, 'no workflow opens a pull request; this test has lost its subject');

  const offenders = [];
  for (const { name, jobName, steps } of jobs) {
    const creating = steps.filter((s) => String(s.run || '').includes('gh pr create'));
    for (const step of creating) {
      const token = String(step.env?.GH_TOKEN ?? '');
      if (!APP_TOKEN.test(token)) {
        offenders.push(`${name} (${jobName}): opens a PR with GH_TOKEN=${token || '(unset)'}`);
      }
    }
  }
  assert.deepEqual(offenders, [],
    'a PR created without the App installation token receives the scanners only');
});

test('the same job PUSHES with that credential too, so a second commit is re-checked', () => {
  /* The half that fixing `gh pr create` alone leaves open. actions/checkout
     persists whatever `token` it is given, and that is the credential a later
     `git push` uses, so the assertion is on the checkout step. A job that
     pushes with the default GITHUB_TOKEN gets one checked commit and then a
     PR that silently stops updating. */
  const offenders = [];
  for (const { name, jobName, steps } of prOpeningJobs()) {
    const pushes = steps.some((s) => /git push/.test(String(s.run || '')));
    if (!pushes) continue;
    const checkout = steps.find((s) => String(s.uses || '').startsWith('actions/checkout'));
    assert.ok(checkout, `${name} (${jobName}): pushes without a checkout step`);
    const token = String(checkout.with?.token ?? '');
    if (!APP_TOKEN.test(token)) {
      offenders.push(`${name} (${jobName}): pushes with checkout token=${token || '(default GITHUB_TOKEN)'}`);
    }
    if (checkout.with && checkout.with['persist-credentials'] === false) {
      offenders.push(`${name} (${jobName}): persist-credentials is false, so the push has no app credential`);
    }
  }
  assert.deepEqual(offenders, [],
    'a push made as GITHUB_TOKEN raises no synchronize, so the PR keeps the previous commit’s checks');
});

test('no step in those jobs still carries secrets.GITHUB_TOKEN', () => {
  /* Belt and braces on the two above: one GITHUB_TOKEN left on any step of a
     PR-opening job is enough to put the job back where it started, and it
     would not be caught by either assertion if it sat on a third step. */
  const offenders = [];
  for (const { name, jobName, steps } of prOpeningJobs()) {
    for (const [i, step] of steps.entries()) {
      for (const [key, value] of Object.entries(step.env || {})) {
        if (GITHUB_TOKEN.test(String(value))) {
          offenders.push(`${name} (${jobName}) step ${i} [${step.name || step.uses}]: ${key} is GITHUB_TOKEN`);
        }
      }
    }
  }
  assert.deepEqual(offenders, [], 'these steps are inside a job whose PR must raise real events');
});

test('the app-token step is pinned to a commit, and names the client id', () => {
  for (const { name, jobName, steps } of prOpeningJobs()) {
    const step = steps.find((s) => String(s.uses || '').startsWith('actions/create-github-app-token'));
    assert.ok(step, `${name} (${jobName}): no create-github-app-token step`);
    assert.match(String(step.uses), /@[0-9a-f]{40}$/,
      `${name}: pin the action to a commit, not a tag`);
    assert.match(String(step.with?.['client-id'] ?? ''), /vars\.FLEET_PR_APP_CLIENT_ID/,
      `${name}: use the client id, not an app id`);
    assert.match(String(step.with?.['private-key'] ?? ''), /secrets\.FLEET_PR_APP_PRIVATE_KEY/,
      `${name}: the private key comes from the secret`);
  }
});
