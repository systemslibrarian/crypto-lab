#!/usr/bin/env node
/*
 * protection-census.js — what actually protects each lab's default branch.
 *
 * Run: node tools/protection-census.js
 * Prevents: reading a 404 from the classic protection endpoint as unprotected when a ruleset is protecting the branch
 *
 * READ-ONLY. It issues GET requests through `gh api` and nothing else. It has no
 * write path, no `--fix`, and no flag that changes anything on GitHub. Branch
 * protection is access control; a census that could edit it would be a worse
 * problem than the one it reports.
 *
 * WHY THIS EXISTS
 *
 * `/repos/{owner}/{repo}/branches/{branch}/protection` is blind to repository
 * RULESETS. It answers 404 for a branch protected by one, with the same body it
 * uses for a branch that is genuinely unprotected:
 *
 *     {"message":"Branch not protected","status":"404"}
 *
 * On 2026-09-21 `crypto-lab-privacy-pass` was recorded as unprotected on the
 * strength of that 404, through three drafts of a lane brief and two corrections
 * to its protection table. It is in fact protected by an active ruleset requiring
 * `build` and `verdict-coverage`, with no bypass actors, which makes it the
 * STRICTEST branch in the set — it binds admins, which `enforce_admins: false`
 * labs do not. The lane spent a day believing the opposite.
 *
 * So: a 404 from one endpoint NEVER produces `none`. Only both endpoints
 * answering cleanly, both saying no, produces `none`.
 *
 * This is the same defect this fleet keeps re-finding under other names — a
 * checker that could not see, reporting clean. `fleet-sync` exists because the
 * catalog could not notice a demo it was never told about. `gate-sync` was blind
 * to `peaceiris` publishers and counted two broken labs in a placid "3 with no
 * Pages deploy" line. `dispatch-census` exists because a lab can leave in
 * silence. The shape is always a denominator taken from whichever source was
 * convenient rather than from the question being asked.
 *
 * STATES
 *
 *   classic          classic branch protection, no ruleset
 *   ruleset          one or more active rulesets, no classic protection
 *   classic+ruleset  both — reported distinctly, never folded into either
 *   none             BOTH endpoints answered cleanly and BOTH said no
 *   UNREAD           anything else: an error, a rate limit, a missing repo, a
 *                    body that would not parse, an unexpected status
 *
 * UNREAD is not a gap in the data, it is the finding. Any UNREAD fails the run
 * (exit 1), because "we could not look" must never be allowed to read as "there
 * is nothing there" — which is precisely the mistake that produced this file.
 *
 * `classic+ruleset` is the fifth state the brief's four did not anticipate. It is
 * reported separately rather than collapsed, for the same reason: a lab carrying
 * both, reported as one, is a protection this census hid.
 *
 * DENOMINATOR
 *
 * Declared, not discovered: the labs pinned in `tools/dispatch-census.json`. A
 * lab that stops being listed there is a named failure of that checker, which is
 * the point of pinning it. Narrow with `--labs a,b,c` when you want one group.
 *
 * Each lab costs three GETs: the repo (for its real default branch — asking
 * about `main` in a repo whose default is something else would produce a 404 that
 * means neither protected nor unprotected), then both protection endpoints on
 * that branch.
 *
 * USAGE
 *   node tools/protection-census.js                 every pinned lab
 *   node tools/protection-census.js --labs a,b,c    just these (bare slugs)
 *   node tools/protection-census.js --json          machine-readable
 *   node tools/protection-census.js --all           print `none` rows too
 */
'use strict';

const { execFile } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const OWNER = 'systemslibrarian';
const CENSUS = path.join(__dirname, 'dispatch-census.json');
const CONCURRENCY = 8;

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const showAll = argv.includes('--all');
const labsFlag = argv.find((a) => a.startsWith('--labs'));

function pinnedLabs() {
  const census = JSON.parse(fs.readFileSync(CENSUS, 'utf8'));
  const names = new Set();
  for (const key of ['withDispatchSite', 'autoMergeButNoDispatch', 'labs']) {
    for (const n of census[key] || []) names.add(n);
  }
  if (names.size === 0) {
    throw new Error(`no labs pinned in ${CENSUS} — its shape has changed`);
  }
  return [...names].sort();
}

/** One `gh api` GET. Resolves {ok, status, body} — it never throws for HTTP errors. */
function ghGet(route) {
  return new Promise((resolve) => {
    execFile(
      'gh',
      ['api', route, '--include'],
      { maxBuffer: 16 * 1024 * 1024 },
      (err, stdout, stderr) => {
        const raw = String(stdout || '');
        const head = raw.slice(0, raw.indexOf('\r\n\r\n') >= 0 ? raw.indexOf('\r\n\r\n') : 0);
        const statusLine = /^HTTP\/[\d.]+ (\d{3})/m.exec(head || raw);
        const status = statusLine ? Number(statusLine[1]) : null;
        const bodyText = raw.includes('\r\n\r\n') ? raw.slice(raw.indexOf('\r\n\r\n') + 4) : raw;

        // A rate limit is an UNREAD, never a "no". Surface it by name.
        const remaining = /^x-ratelimit-remaining:\s*(\d+)/im.exec(head || '');
        const rateLimited =
          status === 403 && remaining && Number(remaining[1]) === 0;

        let body = null;
        let parsed = false;
        if (bodyText.trim()) {
          try {
            body = JSON.parse(bodyText);
            parsed = true;
          } catch {
            parsed = false;
          }
        }
        resolve({
          status,
          body,
          parsed,
          rateLimited,
          err: err ? String(stderr || err.message).trim().split('\n')[0] : null,
        });
      }
    );
  });
}

/** Never throws. Returns a row whose `state` is one of the five, plus `why` when UNREAD. */
async function censusOne(lab) {
  const repo = `${OWNER}/${lab}`;
  const unread = (why) => ({ lab, state: 'UNREAD', branch: null, detail: '', why });

  const meta = await ghGet(`repos/${repo}`);
  if (meta.rateLimited) return unread('rate limited on repos/');
  if (meta.status !== 200 || !meta.parsed) {
    return unread(`repos/ returned ${meta.status ?? 'no status'}${meta.err ? ` (${meta.err})` : ''}`);
  }
  const branch = meta.body.default_branch;
  if (!branch) return unread('repo has no default_branch');

  const enc = encodeURIComponent(branch);
  const [classic, rules] = await Promise.all([
    ghGet(`repos/${repo}/branches/${enc}/protection`),
    ghGet(`repos/${repo}/rules/branches/${enc}`),
  ]);

  // --- classic: exactly two readable answers, anything else is UNREAD ---
  let hasClassic;
  let classicDetail = '';
  if (classic.rateLimited) return unread('rate limited on branch protection');
  if (classic.status === 200 && classic.parsed) {
    hasClassic = true;
    const checks = classic.body.required_status_checks?.contexts ?? [];
    const admins = classic.body.enforce_admins?.enabled;
    classicDetail = `checks=[${checks.join(',')}] enforce_admins=${admins}`;
  } else if (
    classic.status === 404 &&
    classic.parsed &&
    /not protected/i.test(String(classic.body.message || ''))
  ) {
    // "Branch not protected" means NO CLASSIC PROTECTION. It does not mean
    // unprotected, and on its own it can never produce `none`.
    hasClassic = false;
  } else {
    return unread(
      `branch protection returned ${classic.status ?? 'no status'}${
        classic.parsed ? '' : ' (unparseable body)'
      }${classic.err ? ` (${classic.err})` : ''}`
    );
  }

  // --- rulesets: only a parsed array is an answer ---
  if (rules.rateLimited) return unread('rate limited on rulesets');
  if (rules.status !== 200 || !rules.parsed || !Array.isArray(rules.body)) {
    return unread(
      `rulesets returned ${rules.status ?? 'no status'}${
        rules.parsed ? '' : ' (unparseable body)'
      }${rules.err ? ` (${rules.err})` : ''}`
    );
  }
  const hasRuleset = rules.body.length > 0;
  const rulesetDetail = hasRuleset
    ? `rules=[${[...new Set(rules.body.map((r) => r.type))].join(',')}]`
    : '';

  const state = hasClassic
    ? hasRuleset
      ? 'classic+ruleset'
      : 'classic'
    : hasRuleset
      ? 'ruleset'
      : 'none';

  return {
    lab,
    state,
    branch,
    detail: [classicDetail, rulesetDetail].filter(Boolean).join('  '),
    why: null,
  };
}

async function mapLimited(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

(async () => {
  let labs;
  if (labsFlag) {
    const value = labsFlag.includes('=')
      ? labsFlag.split('=')[1]
      : argv[argv.indexOf(labsFlag) + 1];
    labs = String(value || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (labs.length === 0) {
      console.error('--labs needs a comma-separated list of repo slugs');
      process.exit(2);
    }
  } else {
    labs = pinnedLabs();
  }

  const rows = await mapLimited(labs, CONCURRENCY, censusOne);
  const by = (s) => rows.filter((r) => r.state === s);
  const unread = by('UNREAD');

  if (asJson) {
    console.log(JSON.stringify({ owner: OWNER, checked: rows.length, rows }, null, 2));
    process.exit(unread.length ? 1 : 0);
  }

  const order = ['classic+ruleset', 'ruleset', 'classic', 'UNREAD', 'none'];
  const shown = rows
    .filter((r) => showAll || r.state !== 'none')
    .sort((a, b) => order.indexOf(a.state) - order.indexOf(b.state) || a.lab.localeCompare(b.lab));

  const width = Math.max(4, ...shown.map((r) => r.lab.length));
  console.log(`Protection census: ${rows.length} labs, both endpoints asked of each.\n`);
  if (shown.length) {
    for (const r of shown) {
      const note = r.state === 'UNREAD' ? r.why : r.detail;
      console.log(
        `  ${r.lab.padEnd(width)}  ${r.state.padEnd(15)}  ${r.branch ? r.branch.padEnd(8) : '-'.padEnd(8)}  ${note}`
      );
    }
    console.log('');
  }
  for (const s of order) {
    const n = by(s).length;
    if (n) console.log(`  ${String(n).padStart(4)}  ${s}`);
  }

  if (unread.length) {
    console.log(
      `\nUNREAD (${unread.length}) — the run FAILS. "Could not look" is not "nothing there";` +
        `\nreading a 404 as unprotected is the exact mistake this census was written for.`
    );
    process.exit(1);
  }
  console.log('\nEvery lab answered on both endpoints.');
})().catch((e) => {
  console.error(`protection-census: ${e.message}`);
  process.exit(2);
});
