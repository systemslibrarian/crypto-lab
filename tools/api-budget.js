#!/usr/bin/env node
/*
 * api-budget.js — refuse an API-paging sweep that the remaining quota cannot finish.
 *
 * Run: node tools/api-budget.js selftest
 * Prevents: a fleet checker spending the last of the core quota and reporting hundreds of labs as API-ERROR, which is a finding about the instrument wearing a finding about the labs
 * Reads: gh api rate_limit (the core resource), or $CRYPTO_LAB_FAKE_RATE_LIMIT when set for a test
 *
 * On 2026-11-17 a deploy-sync run came back with about 240 labs as API-ERROR.
 * The checker was right to refuse rather than call them clean -- "could not
 * look" is never "nothing there" -- but it should not have STARTED. It had
 * already been run twice in the hour, alongside per-run `gh run view` queries,
 * and the core quota was gone before the sweep began. Nothing asked.
 *
 * So the question is asked first, and the arithmetic uses each checker's own
 * declared per-lab cost rather than a number invented here:
 *
 *     deploy-sync         6 REST calls per lab  (measured 2026-11-11, in that file)
 *     protection-census   3 GETs per lab        (its own Reads: header)
 *     fleet-sync          1 tree read per unverified lab, plus one repo listing
 *
 * `gh api rate_limit` is itself exempt from the core limit, which is what makes
 * this preflight possible at all: it answers 200 with remaining 0. Verified on
 * 2026-11-17 by reading it while the quota was exhausted.
 *
 * An UNREADABLE budget does not refuse the run. That is deliberate and is the
 * opposite of this repository's usual rule, for a reason: refusing on a
 * transient gh failure would block every sweep on a network hiccup, and the
 * sweep's own per-lab reads already report their own failures honestly. It
 * prints NOT CHECKED, which is the third state, and proceeds.
 */
'use strict';
const { execFile } = require('child_process');

/** The core resource, or null when it could not be read. */
function readCoreBudget() {
  const fake = process.env.CRYPTO_LAB_FAKE_RATE_LIMIT;
  if (fake) {
    try {
      const o = JSON.parse(fake);
      if (typeof o.remaining !== 'number') return null;
      return { remaining: o.remaining, limit: o.limit ?? 5000, reset: o.reset ?? 0 };
    } catch {
      return null;
    }
  }
  return new Promise((resolve) => {
    execFile('gh', ['api', 'rate_limit'], { encoding: 'utf8', timeout: 20000 }, (err, out) => {
      if (err) return resolve(null);
      try {
        const core = JSON.parse(out).resources.core;
        if (typeof core.remaining !== 'number') return resolve(null);
        resolve({ remaining: core.remaining, limit: core.limit, reset: core.reset });
      } catch {
        resolve(null);
      }
    });
  });
}

/** `4987/5000, resets 03:09 UTC` — or the NOT CHECKED third state. */
function budgetLine(budget) {
  if (!budget) return 'core quota NOT CHECKED — `gh api rate_limit` could not be read';
  const at = budget.reset
    ? new Date(budget.reset * 1000).toISOString().slice(11, 16) + ' UTC'
    : 'unknown';
  return `core quota ${budget.remaining}/${budget.limit}, resets ${at}`;
}

/**
 * The message to print and exit on, or null to proceed.
 *
 * `needed` is the sweep's own estimate. The margin is a RATIO rather than a
 * constant so it scales with the sweep: a 1,500-call sweep wants more headroom
 * than a 30-call one, and the spare covers the retries a lab read may take.
 */
function budgetRefusal({ label, needed, budget, margin = 1.2 }) {
  if (!budget) return null; // could not look: report, do not refuse
  const want = Math.ceil(needed * margin);
  if (budget.remaining >= want) return null;
  const at = budget.reset
    ? new Date(budget.reset * 1000).toISOString().slice(11, 16) + ' UTC'
    : 'an unknown time';
  return (
    `${label}: REFUSED before asking about a single lab.\n` +
    `  needs about ${needed} REST calls (${want} with margin) and ${budget.remaining} of ` +
    `${budget.limit} remain, resetting at ${at}.\n` +
    `  Running anyway would report labs as API-ERROR, which looks like a finding ` +
    `about the fleet and is a finding about the quota. Wait for the reset, or ` +
    `narrow the run.`
  );
}

function selftest() {
  const fail = [];
  let pass = 0;
  const ok = (c, w) => { if (c) { pass++; console.log('  ok  ' + w); } else fail.push(w); };
  const plenty = { remaining: 4987, limit: 5000, reset: 1763000000 };
  const scarce = { remaining: 100, limit: 5000, reset: 1763000000 };

  ok(budgetRefusal({ label: 'deploy-sync', needed: 1524, budget: plenty }) === null,
    'a sweep that fits in the remaining quota proceeds');

  /* THE MUTATION THIS EXISTS FOR: the quota that produced ~240 API-ERROR rows. */
  const r = budgetRefusal({ label: 'deploy-sync', needed: 1524, budget: scarce });
  ok(r !== null, 'MUTATION: a sweep larger than the remaining quota is refused');
  ok(r !== null && r.includes('100 of 5000'), 'and the refusal names remaining/limit');
  ok(r !== null && /resetting at \d\d:\d\d UTC/.test(r), 'and the reset time');
  ok(r !== null && r.includes('1524'), 'and what the sweep would have cost');

  ok(budgetRefusal({ label: 'x', needed: 100, budget: { remaining: 119, limit: 5000, reset: 0 } }) !== null,
    'the margin bites: 119 remaining for a 100-call sweep is refused at the default 1.2');
  ok(budgetRefusal({ label: 'x', needed: 100, budget: { remaining: 120, limit: 5000, reset: 0 } }) === null,
    'and 120 is exactly enough, so the boundary is not off by one');

  /* The third state. A guard that refused here would block every sweep on a
     transient gh failure, which is worse than the defect it guards. */
  ok(budgetRefusal({ label: 'x', needed: 9999, budget: null }) === null,
    'an unreadable budget does NOT refuse the run');
  ok(budgetLine(null).includes('NOT CHECKED'),
    'and it prints as NOT CHECKED rather than as a number');
  ok(budgetLine(plenty).includes('4987/5000'), 'a readable budget prints remaining/limit');

  for (const f of fail) console.error('  FAIL ' + f);
  console.log(`${pass} passed, ${fail.length} failed`);
  return fail.length ? 1 : 0;
}

module.exports = { readCoreBudget, budgetLine, budgetRefusal };

if (require.main === module) {
  if (process.argv[2] === 'selftest') process.exit(selftest());
  console.error('Usage: node tools/api-budget.js selftest');
  process.exit(2);
}
