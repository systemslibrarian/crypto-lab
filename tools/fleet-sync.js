#!/usr/bin/env node
/*
 * fleet-sync.js — assert that every lab that EXISTS has a card here.
 *
 * Run: node tools/fleet-sync.js check
 * Prevents: a lab going live with no card, which every catalog checker then reads as consistent rather than missing
 * Reads: `gh repo list systemslibrarian`, index.html's CARD anchors and their github.io hrefs, each clone's origin/HEAD tree after a fetch, else gh api git/trees/HEAD, and tools/fixtures/fleet/ for selftest
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
 *   node tools/fleet-sync.js          Report; exit 0 always.
 *   node tools/fleet-sync.js check    Same report; exit 1 if a lab has no card,
 *                                     a card points at no live repo, or a card
 *                                     anchor carries no resolvable href.
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
      (err, stdout) => resolve(err ? null : String(stdout).trim()));
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
const CARD_ANCHOR = /<a\s+class="(?:feature|project)-card(?:\s[^"]*)?"[^>]*>/g;
const CARD_HREF = /\shref="https:\/\/systemslibrarian\.github\.io\/([A-Za-z0-9._-]+)\/"/;

/* The pre-2026-10-06 rule, kept for ONE caller: the selftest, which asserts
 * that the prose-only fixture WOULD have been miscounted by it. Without that
 * negative control the fixture would pass against a rule that never fired, and
 * a fixture proving nothing is the failure mode the mutation sets exist to
 * avoid. Nothing else may use this. */
const LOOSE_SLUGS_SUPERSEDED = /https:\/\/systemslibrarian\.github\.io\/([A-Za-z0-9._-]+)\//g;

function cardedSlugs(html) {
  const text = html === undefined ? fs.readFileSync(INDEX, 'utf8') : html;
  const slugs = new Set();
  const hrefless = [];
  for (const m of text.matchAll(CARD_ANCHOR)) {
    const got = CARD_HREF.exec(m[0]);
    if (got) slugs.add(got[1]);
    else hrefless.push(m[0].replace(/\s+/g, ' ').slice(0, 120));
  }
  return { slugs, hrefless };
}

const INDEX_ANYWHERE = /(^|\/)index\.html$/m;

/* A repo is a browser demo if its default branch contains an index.html at any
 * depth. Read the tree from the local clone when there is one — `git ls-tree`
 * asks the REF, not the working tree, so a clone that has never been checked
 * out still answers correctly (which is exactly the state ggh-trapdoor and
 * factor-forge were in on the day this checker was written). Fall back to the
 * API for a lab that is not cloned here. */
async function hasPage(repo) {
  const dir = path.join(FLEET_ROOT, repo);
  if (fs.existsSync(path.join(dir, '.git'))) {
    await sh('git', ['fetch', '--quiet', 'origin'], dir);
    for (const ref of ['origin/HEAD', 'origin/main', 'origin/master']) {
      const tree = await sh('git', ['ls-tree', '-r', '--name-only', ref], dir);
      if (tree !== null) return INDEX_ANYWHERE.test(tree);
    }
  }
  const tree = await sh('gh', ['api', `repos/${OWNER}/${repo}/git/trees/HEAD?recursive=1`,
    '--jq', '.tree[].path']);
  return tree !== null && INDEX_ANYWHERE.test(tree);
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

async function main() {
  const check = process.argv[2] === 'check';

  const raw = await sh('gh', ['repo', 'list', OWNER, '--limit', '400', '--json',
    'name,description,isPrivate,isArchived']);
  if (raw === null) {
    console.error('fleet-sync: `gh repo list` failed. Is the gh CLI authenticated?');
    process.exit(2);
  }

  const repos = JSON.parse(raw).filter((r) =>
    !r.isPrivate && !r.isArchived && /^crypto-lab-/.test(r.name));

  const { slugs: carded, hrefless } = cardedSlugs();
  const pages = await Promise.all(repos.map((r) => hasPage(r.name)));

  const demos = repos.filter((_, i) => pages[i]);
  const notDemos = repos.filter((_, i) => !pages[i]);
  const uncarded = demos.filter((r) => !carded.has(r.name));
  const undescribed = demos.filter((r) => !r.description || !r.description.trim());

  /* The other direction: a card pointing at a repo that is gone, renamed or
   * private. Only crypto-lab-* slugs are checked — the page also links two
   * github.io projects outside the prefix from Related Projects (snow2,
   * crypto-compare), and the repo listing above deliberately does not cover
   * those. */
  const live = new Set(repos.map((r) => r.name));
  const dangling = [...carded].filter((s) => /^crypto-lab-/.test(s) && !live.has(s));

  console.log(`Public crypto-lab-* repos: ${repos.length} `
    + `(${demos.length} browser demos, ${notDemos.length} without an index.html)`);
  console.log(`Cards in index.html: ${carded.size} | carded demos: ${demos.length - uncarded.length}`);
  if (hrefless.length) {
    console.log(`\nCARD-HREFLESS (${hrefless.length}) — a card anchor with no github.io href, so this`);
    console.log('checker cannot tell which lab it is for. Not counted either way:');
    for (const a of hrefless) console.log(`  ${a}`);
  }

  if (notDemos.length) {
    console.log(`\nNot browser demos, so not expected to have a card (${notDemos.length}):`);
    for (const r of notDemos) console.log(`  ${r.name}`);
  }

  if (uncarded.length) {
    console.log(`\nLIVE BUT UNCATALOGUED (${uncarded.length}) — no card, so no README row,`);
    console.log('no corpus entry and no concept-coverage line either:');
    for (const r of uncarded) console.log(`  ${r.name}`);
    console.log('\nAdd each one with the "Adding a new demo" workflow in CLAUDE.md.');
  }

  if (dangling.length) {
    console.log(`\nCARDS POINTING AT NOTHING (${dangling.length}) — repo gone, renamed or private:`);
    for (const s of dangling) console.log(`  ${s}`);
  }

  if (undescribed.length) {
    console.log(`\nNo GitHub description (${undescribed.length}) — not a catalog defect, but it is`);
    console.log('what a visitor reads before they ever reach the demo:');
    for (const r of undescribed) console.log(`  ${r.name}`);
  }

  const failed = uncarded.length + dangling.length + hrefless.length;
  if (!failed) console.log('\nEvery live lab has a card, and every card has a lab.');
  if (check && failed) process.exit(1);
}

/* selftest is offline by design -- fixtures only, no gh and no clones -- so it
 * must not fall through into main(), which needs both. */
if (process.argv[2] === 'selftest') process.exit(selftest());

main();
