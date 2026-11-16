'use strict';

/*
 * `write --lab <slug>` adds ONE row.
 *
 * `write` rewrites the census from what is on disk, which is right when the
 * fleet is the subject and wrong when one new lab is. Carding
 * crypto-lab-weak-curves needed one row and `write` produced seven: six other
 * uncarded labs were cloned here too, and three of them would have landed in
 * noAutoMergeJob -- an EXEMPTION, declaring a lab deliberately without an
 * auto-merge job. That is a judgement per lab, and a one-lab change must not
 * make it six times silently.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const { addLab, buildCensus } = require('../tools/dispatch-census.js');

const base = () => buildCensus([
  { repo: 'crypto-lab-alpha', jobs: 1, sites: 1, anomalies: [] },
  { repo: 'crypto-lab-beta', jobs: 1, sites: 0, anomalies: [] },
  { repo: 'crypto-lab-gamma', jobs: 0, sites: 0, anomalies: [] },
], '/nowhere');

test('one lab in, one row changed, every other row byte-identical', () => {
  const before = base();
  const row = { repo: 'crypto-lab-weak-curves', jobs: 1, sites: 1, anomalies: [] };
  const { census: after, target } = addLab(before, row);

  assert.equal(target, 'withDispatchSite', 'a lab with a dispatch site belongs there');

  const lists = ['withDispatchSite', 'autoMergeButNoDispatch', 'noAutoMergeJob'];
  const added = lists.flatMap((k) => after[k].filter((r) => !before[k].includes(r)));
  const removed = lists.flatMap((k) => before[k].filter((r) => !after[k].includes(r)));
  assert.deepEqual(added, ['crypto-lab-weak-curves'], 'exactly one row is added');
  assert.deepEqual(removed, [], 'no row is removed');

  /* The other two lists are untouched, not merely the same length. */
  assert.deepEqual(after.autoMergeButNoDispatch, before.autoMergeButNoDispatch);
  assert.deepEqual(after.noAutoMergeJob, before.noAutoMergeJob);

  /* Totals move by exactly this lab's contribution. */
  assert.equal(after.totals.labs, before.totals.labs + 1);
  assert.equal(after.totals.autoMergeJobs, before.totals.autoMergeJobs + 1);
  assert.equal(after.totals.dispatchSites, before.totals.dispatchSites + 1);

  /* And the input is not mutated -- the caller still holds the old census. */
  assert.equal(before.withDispatchSite.includes('crypto-lab-weak-curves'), false);
});

test('the list is chosen from what the lab HAS, not from what the caller wants', () => {
  /* The exemption list is the one that must never be reachable by accident.
     A lab with no job and no site lands there and nowhere else; a lab with a
     job but no dispatch is a different state and is kept distinct. */
  const jobless = addLab(base(), { repo: 'crypto-lab-jobless', jobs: 0, sites: 0, anomalies: [] });
  assert.ok(jobless.census.noAutoMergeJob.includes('crypto-lab-jobless'));
  assert.equal(jobless.target, 'noAutoMergeJob');
  assert.equal(jobless.census.totals.autoMergeJobs, base().totals.autoMergeJobs,
    'a lab with no job adds none to the total');

  const jobOnly = addLab(base(), { repo: 'crypto-lab-jobonly', jobs: 1, sites: 0, anomalies: [] });
  assert.equal(jobOnly.target, 'autoMergeButNoDispatch');
  assert.equal(jobOnly.census.noAutoMergeJob.includes('crypto-lab-jobonly'), false,
    'a lab that HAS a job must not be filed as having none');
});

test('MUTATION: re-pinning a lab that is already there is refused, not duplicated', () => {
  /* Without this the mode would be a quiet way to double a row and inflate the
     totals, which is the opposite of what a declared denominator is for. */
  const once = addLab(base(), { repo: 'crypto-lab-weak-curves', jobs: 1, sites: 1, anomalies: [] }).census;
  assert.throws(
    () => addLab(once, { repo: 'crypto-lab-weak-curves', jobs: 1, sites: 1, anomalies: [] }),
    /already pinned in withDispatchSite/,
  );
});

test('whole-fleet buildCensus is unchanged by the new mode', () => {
  /* The regression that matters most: --lab must not alter what `write` does.
     buildCensus is the whole-fleet path, and these are its three states. */
  const c = base();
  assert.deepEqual(c.withDispatchSite, ['crypto-lab-alpha']);
  assert.deepEqual(c.autoMergeButNoDispatch, ['crypto-lab-beta']);
  assert.deepEqual(c.noAutoMergeJob, ['crypto-lab-gamma']);
  assert.deepEqual(c.totals, { labs: 3, autoMergeJobs: 2, dispatchSites: 1 });
});
