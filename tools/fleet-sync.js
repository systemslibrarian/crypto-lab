#!/usr/bin/env node
/*
 * fleet-sync.js — assert that every lab that EXISTS has a card here.
 *
 * Run: node tools/fleet-sync.js check
 * Prevents: a lab going live with no card, which every catalog checker then reads as consistent rather than missing
 * Reads: `gh repo list systemslibrarian` including defaultBranchRef, index.html's CARD anchors, each verified clone's fetched default-branch commit tree, else complete gh api git/trees/HEAD JSON, and tools/fixtures/fleet/ for selftest
 *
 * The other checkers all compare this repo to something derived from it:
 * readme-sync reads the cards, corpus-sync reads the cards, concept-sync reads
 * the cards. So a lab with no card is missing from all of them *consistently*,
 * and every one of them stays green. The catalog cannot notice a demo it was
 * never told about.
 *
 * That is not hypothetical. On 2026-09-09 four labs were built, deployed and
 * live with no card, no corpus entry and no line in the concept map:
 * lattice-builder (live since 2026-08-25), covert-channel-studio (2026-09-06),
 * ggh-trapdoor and factor-forge. Every checker was green the whole time, and
 * concept-coverage.md — the file whose whole job is answering "is anything
 * missing?" — was answering it wrongly.
 *
 * So this one compares the catalog to GitHub, which is the only place that
 * knows what actually exists.
 *
 * What counts as a lab it should find: a public, non-archived `crypto-lab-*`
 * repo whose default branch contains an index.html ANYWHERE in the tree. The
 * page is at the repo root in most labs but at demos/<slug>/index.html in the
 * older ones, so anchoring the rule at the root would have quietly excused
 * thirteen real demos — kyber-vault and babel-hash among them.
 *
 * That rule is also what keeps this honest without a hand-maintained exemption
 * list: it makes crypto-lab-blind-oracle-api (a headless Rust/axum backend, the
 * server half of blind-oracle, scored N/A in audits/SCORECARD-2026-08-02.md)
 * exempt automatically rather than by being named here, and a lab that later
 * grows a page stops being exempt on its own.
 *
 * Reported but never failing: a lab with no GitHub description. That is not a
 * catalog defect, but it drifts the same silent way and is cheap to see here.
 *
 * Requires the `gh` CLI (authenticated) and network, like deploy-sync. Not part
 * of the fast loop — run it after building a lab, and after any cross-repo pass.
 *
 * Usage (from the crypto-lab repo root):
 *   node tools/fleet-sync.js          Report; exit 2 if source coverage is unreadable.
 *   node tools/fleet-sync.js check    Same report; exit 1 if a lab has no card,
 *                                     a card points at no live repo, or a card
 *                                     anchor carries no resolvable href; exit 2
 *                                     if inventory or source coverage is unreadable.
 *   node tools/fleet-sync.js selftest Offline: assert that what counts as a card
 *                                     is a card. Fixtures only, no network.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const FLEET_ROOT = path.join(__dirname, '..', '..');
const INDEX = path.join(__dirname, '..', 'index.html');
const OWNER = 'systemslibrarian';

function sh(cmd, args, cwd) {
  return new Promise((resolve) => {
    execFile(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 16 << 20 },
      (err, stdout, stderr) => resolve({
        ok: !err, stdout: String(stdout || '').trim(),
        stderr: String(stderr || '').trim(),
      }));
  });
}

/* Every github.io slug a CARD links to. Cards are the only source of truth for
 * what the catalog knows about; the README/corpus/concept map all derive from
 * them, so asking the cards is asking all four at once.
 *
 * ASK THE CARDS, THEN. Until 2026-10-06 this read every
 * `https://systemslibrarian.github.io/<slug>/` URL ANYWHERE in the file, which
 * is a different question wearing the same answer's clothes: the page also
 * links github.io projects it does not card -- snow2 and crypto-compare, from
 * Related Projects -- so the set was a SUPERSET of the cards and the line above
 * it said "Cards in index.html". It printed 225 where readme-sync, catalog-sync
 * and concept-sync all said 224, and the number it printed was not a count of
 * cards at all.
 *
 * The mislabel is the small half. The set feeds `carded.has(r.name)`, so under
 * the loose rule a lab LINKED FROM PROSE WITH NO CARD counted as catalogued --
 * this checker's one job, defeated by a sentence mentioning the lab. That did
 * not bite, because the two extra slugs are outside the `crypto-lab-` prefix,
 * and "did not bite" is exactly how long a latent hole waits. It is the
 * answering-from-a-copy shape this file's own notes catalogue: read something
 * NEAR the question (a URL in the page) instead of the thing the question is
 * about (a card), and publish the difference. `tools/fixtures/fleet/` asserts
 * it in both directions, so the fix cannot quietly regress.
 *
 * Matched as an ANCHOR OPEN TAG with any attribute order, not as
 * `data-category="..." href="..."` adjacent the way lab-dates and level-sync
 * match for their own purposes: those two are rewriting a specific shape, while
 * this one is counting a denominator, and a card that merely reshuffled its
 * attributes must not be able to drop out of a denominator in silence.
 *
 * A card anchor with NO github.io href is returned separately and named by the
 * caller rather than skipped. That state is real -- an attribute rebuild on
 * 2026-10-04 collected only the data-* attributes and dropped the href from the
 * cards it converted, taking the catalog to 221 -- and a card this checker
 * cannot resolve is "could not look", never "nothing there". */
/* The matcher itself now lives in tools/card-reader.js, imported rather than
 * copied. This file's rule was the most permissive of the eight in the fleet --
 * any attribute order, both card classes -- which is why the shared one was
 * generalised from it; see #125 for the census of what the other seven missed. */
const { readCards, hreflessLine } = require('./card-reader.js');

/* The pre-2026-10-06 rule, kept for ONE caller: the selftest, which asserts
 * that the prose-only fixture WOULD have been miscounted by it. Without that
 * negative control the fixture would pass against a rule that never fired, and
 * a fixture proving nothing is the failure mode the mutation sets exist to
 * avoid. Nothing else may use this. */
const LOOSE_SLUGS_SUPERSEDED = /https:\/\/systemslibrarian\.github\.io\/([A-Za-z0-9._-]+)\//g;

function cardedSlugs(html) {
  const text = html === undefined ? fs.readFileSync(INDEX, 'utf8') : html;
  const read = readCards(text);
  return {
    slugs: new Set(read.cards.map((c) => c.slug)),
    /* Shape preserved for this file's callers and selftest: a short string per
       unresolved anchor. The shared reader carries structured detail too. */
    hrefless: read.hrefless.map((h) => `${h.title ? `"${h.title}" ` : ''}${h.why}`),
  };
}

const isIndexPath = file => file === 'index.html' || file.endsWith('/index.html');

/* Presence, absence and unreadable source are separate answers. A failed fetch
 * cannot make an old tracking ref current; a failed API read cannot make a lab
 * a headless backend. Read committed trees only, preserving local edits. */
async function hasPage(repo, { run = sh, exists = fs.existsSync } = {}) {
  const unread = why => ({ state: 'unread', why });
  const name = repo.name;
  if (!/^crypto-lab-[A-Za-z0-9._-]+$/.test(name)) return unread('Invalid repository identity');
  const dir = path.join(FLEET_ROOT, name);
  const branch = repo.defaultBranchRef?.name;
  if (exists(path.join(dir, '.git'))) {
    const origin = await run('git', ['remote', 'get-url', 'origin'], dir);
    const expected = `(?:https://github\\.com/|git@github\\.com:|ssh://git@github\\.com/)${OWNER}/${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\.git)?`;
    if (!origin.ok || !new RegExp(`^${expected}$`).test(origin.stdout)) return unread('Clone origin does not verify the intended repository');
    if (typeof branch === 'string' && branch && !branch.startsWith('-')) {
      const ref = `refs/remotes/origin/${branch}`;
      const fetched = await run('git', ['fetch', '--quiet', 'origin', `${branch}:${ref}`], dir);
      if (!fetched.ok) return unread('Default-branch fetch failed; old clone evidence is stale');
      const commit = await run('git', ['rev-parse', `${ref}^{commit}`], dir);
      if (!commit.ok || !/^[a-f0-9]{40}$/.test(commit.stdout)) return unread('Fetched default-branch commit is unavailable');
      const tree = await run('git', ['ls-tree', '-r', '--name-only', '-z', commit.stdout], dir);
      if (!tree.ok) return unread('Fetched commit tree is unreadable');
      return { state: tree.stdout.split('\0').some(isIndexPath) ? 'page' : 'no-page', sourceSha: commit.stdout };
    }
    // A missing default branch may be an empty repository. Ask GitHub rather
    // than guessing main/master or reading an unrelated old origin/HEAD.
  }
  const response = await run('gh', ['api', `repos/${OWNER}/${name}/git/trees/HEAD?recursive=1`]);
  let tree;
  try { tree = JSON.parse(response.stdout); } catch { return unread('Repository tree response is unreadable or malformed'); }
  if (!response.ok) {
    if (/HTTP 409\b/.test(response.stderr) && tree?.message === 'Git Repository is empty.') return { state: 'no-page', waitingForCode: true };
    return unread('Repository tree request failed; absence of a page is unverified');
  }
  if (!tree || tree.truncated !== false || !/^[a-f0-9]{40}$/.test(tree.sha || '') || !Array.isArray(tree.tree)
      || tree.tree.some(entry => !entry || typeof entry.path !== 'string' || !['blob', 'tree', 'commit'].includes(entry.type))) {
    return unread('Repository tree is incomplete, truncated or malformed');
  }
  return { state: tree.tree.some(entry => entry.type === 'blob' && isIndexPath(entry.path)) ? 'page' : 'no-page', sourceTreeSha: tree.sha };
}

async function mapLimited(items, fn) {
  const results = new Array(items.length); let next = 0;
  await Promise.all(Array.from({ length: Math.min(8, items.length) }, async () => {
    while (next < items.length) { const i = next++; results[i] = await fn(items[i]); }
  }));
  return results;
}

/* Offline. Four fixtures in tools/fixtures/fleet/, each asserting what the
 * denominator is allowed to contain, plus the negative control that stops the
 * prose-only fixture passing against a rule that never fires. No network, no
 * clones, no gh -- so it runs anywhere and cannot report clean because it could
 * not look. */
const FLEET_FIXTURES = {
  carded: {
    slugs: ['crypto-lab-fixture-carded'],
    hrefless: 0,
    why: 'a card with the stamped attributes after its href is counted',
  },
  'prose-only': {
    slugs: ['crypto-lab-fixture-carded'],
    hrefless: 0,
    looselyAlsoCounts: 'crypto-lab-fixture-prose',
    why: 'a lab linked only from prose, with no card, is NOT counted as carded',
  },
  hrefless: {
    slugs: [],
    hrefless: 1,
    why: 'a card anchor with no github.io href is named, not silently dropped',
  },
  'attr-order': {
    slugs: ['crypto-lab-fixture-reordered'],
    hrefless: 0,
    why: 'href before data-category still counts, so a reshuffle cannot shrink the denominator',
  },
};

function selftest() {
  const dir = path.join(__dirname, 'fixtures', 'fleet');
  const fail = [];
  let pass = 0;

  for (const [name, expect] of Object.entries(FLEET_FIXTURES)) {
    const file = path.join(dir, `${name}.html`);
    if (!fs.existsSync(file)) { fail.push(`${name}: fixture file missing`); continue; }
    const html = fs.readFileSync(file, 'utf8');
    const got = cardedSlugs(html);
    const slugs = [...got.slugs].sort();
    const want = [...expect.slugs].sort();
    if (slugs.join(',') !== want.join(',')) {
      fail.push(`${name}: expected cards [${want}], got [${slugs}]`);
      continue;
    }
    if (got.hrefless.length !== expect.hrefless) {
      fail.push(`${name}: expected ${expect.hrefless} hrefless anchor(s), got ${got.hrefless.length}`);
      continue;
    }
    /* The negative control. If the superseded rule ALSO declines to count the
     * prose link, this fixture demonstrates nothing about the fix -- so say so
     * rather than counting a pass. */
    if (expect.looselyAlsoCounts) {
      LOOSE_SLUGS_SUPERSEDED.lastIndex = 0;
      const loose = new Set([...html.matchAll(LOOSE_SLUGS_SUPERSEDED)].map((m) => m[1]));
      if (!loose.has(expect.looselyAlsoCounts)) {
        fail.push(`${name}: the superseded rule did not count ${expect.looselyAlsoCounts} either, `
          + 'so this fixture proves nothing about the change');
        continue;
      }
      console.log(`  ok  ${name}-control — the superseded any-URL rule DID count `
        + `${expect.looselyAlsoCounts}, so the fixture discriminates`);
      pass++;
    }
    pass++;
    console.log(`  ok  ${name} — ${expect.why}`);
  }

  /* A fixture set with no positive case would pass against a rule that counts
   * nothing at all, which is the empty-denominator failure one layer down. */
  if (!Object.values(FLEET_FIXTURES).some((f) => f.slugs.length)) {
    fail.push('fixtures: no fixture expects a card, so a rule counting nothing would pass');
  }

  /* And the live file, because the printed count is the thing that was wrong.
   * Asserted against a SECOND reading rather than against itself: every card
   * title in index.html must have a slug, so the two must agree. */
  {
    const html = fs.readFileSync(INDEX, 'utf8');
    const { slugs, hrefless } = cardedSlugs(html);
    const titles = (html.match(/class="(?:feature|project)-title">/g) || []).length;
    if (hrefless.length) {
      fail.push(`index.html: ${hrefless.length} card anchor(s) carry no resolvable href`);
    } else if (slugs.size !== titles) {
      fail.push(`index.html: ${slugs.size} card slugs against ${titles} card titles`);
    } else {
      pass++;
      console.log(`  ok  index.html — ${slugs.size} card slugs, ${titles} card titles, they agree`);
    }
  }

  console.log(`\n${pass} passed, ${fail.length} failed.`);
  for (const x of fail) console.log(`  FAIL ${x}`);
  return fail.length ? 1 : 0;
}

async function main({ run = sh, exists = fs.existsSync, html, log = console.log, error = console.error, check = process.argv[2] === 'check' } = {}) {

  const raw = await run('gh', ['repo', 'list', OWNER, '--limit', '400', '--json',
    'name,description,isPrivate,isArchived,defaultBranchRef']);
  if (!raw.ok) {
    error('fleet-sync: `gh repo list` failed. Is the gh CLI authenticated?');
    return 2;
  }
  let listed;
  try { listed = JSON.parse(raw.stdout); } catch { error('fleet-sync: repository inventory is malformed'); return 2; }
  if (!Array.isArray(listed) || listed.length >= 400 || listed.some(r => !r || typeof r.name !== 'string' || typeof r.isPrivate !== 'boolean' || typeof r.isArchived !== 'boolean')
      || new Set(listed.map(r => r.name)).size !== listed.length) {
    error('fleet-sync: repository inventory is incomplete, malformed or reached its 400-repository limit'); return 2;
  }
  const repos = listed.filter((r) =>
    !r.isPrivate && !r.isArchived && /^crypto-lab-/.test(r.name));

  const { slugs: carded, hrefless } = cardedSlugs(html);
  const pages = await mapLimited(repos, repo => hasPage(repo, { run, exists }));

  const demos = repos.filter((_, i) => pages[i].state === 'page');
  const notDemos = repos.filter((_, i) => pages[i].state === 'no-page');
  const unread = repos.filter((_, i) => pages[i].state === 'unread');
  const uncarded = demos.filter((r) => !carded.has(r.name));
  const undescribed = demos.filter((r) => !r.description || !r.description.trim());

  /* The other direction: a card pointing at a repo that is gone, renamed or
   * private. Only crypto-lab-* slugs are checked — the page also links two
   * github.io projects outside the prefix from Related Projects (snow2,
   * crypto-compare), and the repo listing above deliberately does not cover
   * those. */
  const live = new Set(repos.map((r) => r.name));
  const dangling = [...carded].filter((s) => /^crypto-lab-/.test(s) && !live.has(s));

  log(`Public crypto-lab-* repos: ${repos.length} `
    + `(${demos.length} browser demos, ${notDemos.length} without an index.html, ${unread.length} unreadable)`);
  log(`Cards in index.html: ${carded.size} | carded demos: ${demos.length - uncarded.length}`);
  if (hrefless.length) {
    log(`\nCARD-HREFLESS (${hrefless.length}) — a card anchor with no github.io href, so this`);
    log('checker cannot tell which lab it is for. Not counted either way:');
    for (const a of hrefless) log(`  ${a}`);
  }
  if (unread.length) {
    log(`\nUNREAD (${unread.length}) — source coverage is incomplete, not evidence of absent pages:`);
    for (const r of unread) log(`  ${r.name}: ${pages[repos.indexOf(r)].why}`);
  }

  if (notDemos.length) {
    log(`\nNot browser demos, so not expected to have a card (${notDemos.length}):`);
    for (const r of notDemos) log(`  ${r.name}${pages[repos.indexOf(r)].waitingForCode ? ' (empty repository; waiting for code)' : ''}`);
  }

  if (uncarded.length) {
    log(`\nLIVE BUT UNCATALOGUED (${uncarded.length}) — no card, so no README row,`);
    log('no corpus entry and no concept-coverage line either:');
    for (const r of uncarded) log(`  ${r.name}`);
    log('\nAdd each one with the "Adding a new demo" workflow in CLAUDE.md.');
  }

  if (dangling.length) {
    log(`\nCARDS POINTING AT NOTHING (${dangling.length}) — repo gone, renamed or private:`);
    for (const s of dangling) log(`  ${s}`);
  }

  if (undescribed.length) {
    log(`\nNo GitHub description (${undescribed.length}) — not a catalog defect, but it is`);
    log('what a visitor reads before they ever reach the demo:');
    for (const r of undescribed) log(`  ${r.name}`);
  }

  const failed = uncarded.length + dangling.length + hrefless.length;
  if (!failed && !unread.length) log('\nEvery live lab has a card, and every card has a lab.');
  return unread.length ? 2 : check && failed ? 1 : 0;
}

/* selftest is offline by design -- fixtures only, no gh and no clones -- so it
 * must not fall through into main(), which needs both. */
if (require.main === module) {
  if (process.argv[2] === 'selftest') process.exitCode = selftest();
  else main().then(code => { process.exitCode = code; }).catch(err => {
    console.error(`fleet-sync: collection failed: ${err.message}`); process.exitCode = 2;
  });
}
module.exports = { cardedSlugs, hasPage, main };
