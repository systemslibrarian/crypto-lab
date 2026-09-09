#!/usr/bin/env node
/*
 * fleet-sync.js — assert that every lab that EXISTS has a card here.
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
 *                                     or a card points at no live repo.
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

/* Every github.io slug a card links to. Cards are the only source of truth for
 * what the catalog knows about; the README/corpus/concept map all derive from
 * them, so asking the cards is asking all four at once. */
function cardedSlugs() {
  const html = fs.readFileSync(INDEX, 'utf8');
  const re = /https:\/\/systemslibrarian\.github\.io\/([A-Za-z0-9._-]+)\//g;
  const slugs = new Set();
  let m;
  while ((m = re.exec(html)) !== null) slugs.add(m[1]);
  return slugs;
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

  const carded = cardedSlugs();
  const pages = await Promise.all(repos.map((r) => hasPage(r.name)));

  const demos = repos.filter((_, i) => pages[i]);
  const notDemos = repos.filter((_, i) => !pages[i]);
  const uncarded = demos.filter((r) => !carded.has(r.name));
  const undescribed = demos.filter((r) => !r.description || !r.description.trim());

  /* The other direction: a card pointing at a repo that is gone, renamed or
   * private. Only crypto-lab-* slugs are checked — the catalog also cards a few
   * demos that live outside the prefix (snow2, crypto-compare), and the repo
   * listing above deliberately does not cover those. */
  const live = new Set(repos.map((r) => r.name));
  const dangling = [...carded].filter((s) => /^crypto-lab-/.test(s) && !live.has(s));

  console.log(`Public crypto-lab-* repos: ${repos.length} `
    + `(${demos.length} browser demos, ${notDemos.length} without an index.html)`);
  console.log(`Cards in index.html: ${carded.size} | carded demos: ${demos.length - uncarded.length}`);

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

  const failed = uncarded.length + dangling.length;
  if (!failed) console.log('\nEvery live lab has a card, and every card has a lab.');
  if (check && failed) process.exit(1);
}

main();
