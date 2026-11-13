'use strict';

/*
 * A second run on the same date must not fail.
 *
 * The branch name carries the date -- `pins/advance-<YYYY-MM-DD>` -- and the
 * job builds it fresh from main each time, so a second run that day pushes to
 * a branch that already exists. With a plain `git push` that is rejected:
 *
 *   ! [rejected]  pins/advance-2026-11-13 -> pins/advance-2026-11-13 (fetch first)
 *
 * Run 43342034724 died exactly there, with #475 already open on the branch.
 * A failed run reads like a broken advance to whoever opens it; it was only a
 * second one. And because the job never reached a second push, the credential
 * that makes a push raise `synchronize` (#473) had no way to be exercised.
 *
 * So: handle the existing branch, and never open a second pull request for one
 * date.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { parseYaml } = require('../tools/gate-sync.js');

const WORKFLOW = path.join(__dirname, '..', '.github', 'workflows', 'pin-advance.yml');

/** The `run:` script of the step that pushes the branch and opens the PR. */
function prStep() {
  const doc = parseYaml(fs.readFileSync(WORKFLOW, 'utf8'));
  const steps = doc.jobs.advance.steps || [];
  const step = steps.find((s) => String(s.run || '').includes('gh pr create'));
  assert.ok(step, 'pin-advance must still have a step that opens the pull request');
  return String(step.run);
}

test('a same-day re-run handles the branch that is already there', () => {
  const run = prStep();

  assert.match(run, /git ls-remote --exit-code --heads origin "\$branch"/,
    'the step must ask whether the branch already exists before pushing to it');

  /* The two outcomes, both of which must be reachable. */
  assert.match(run, /git diff --quiet/,
    'nothing-new must be detected by comparing against the remote branch');
  assert.match(run, /--force-with-lease="\$branch:\$remote_sha"/,
    'something-new must move the existing branch under a lease');

  /* A bare --force would move a branch somebody else had moved. */
  assert.doesNotMatch(run, /git push\s+(-[^-\s]+\s+)*--force(?![-=])/,
    'never a bare --force; the lease is the whole point');
});

test('a same-day re-run never opens a second pull request for the same date', () => {
  const run = prStep();
  const create = run.indexOf('gh pr create');
  assert.notEqual(create, -1);

  /* Both re-run outcomes must leave the step before it can create a PR. The
     exits are what guarantee one PR per date; without them the existing-branch
     path would fall through into `gh pr create` and open a duplicate. */
  const before = run.slice(0, create);
  const exits = (before.match(/^\s*exit 0$/gm) || []).length;
  assert.ok(exits >= 2,
    `both re-run outcomes must exit before gh pr create; found ${exits}`);

  /* And the nothing-new branch must say so rather than exiting silently. */
  assert.match(before, /GITHUB_STEP_SUMMARY/,
    'a re-run that does nothing must still write down that it ran');
});

test('MUTATION: a plain push to an existing branch is what this rejects', () => {
  /* The pre-fix shape, which is what run 43342034724 executed. If a future
     edit collapses the existing-branch handling back to one unconditional
     push, the assertions above stop holding -- this proves they are what
     catches it rather than something else in the file. */
  const run = prStep();
  const collapsed = run
    .replace(/if git ls-remote[\s\S]*?else\n/, '')
    .replace(/\n\s*fi\n/, '\n');
  assert.notEqual(collapsed, run, 'the mutation must apply');
  assert.doesNotMatch(collapsed, /--force-with-lease="\$branch:\$remote_sha"/,
    'the collapsed form has no lease push, which the first test requires');
  assert.doesNotMatch(collapsed, /git ls-remote --exit-code --heads origin "\$branch"/,
    'and no existence check, which the first test also requires');
});
