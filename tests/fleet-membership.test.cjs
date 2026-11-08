'use strict';
/*
 * Fleet membership has to come from ONE definition.
 *
 * On 2026-11-07 the owner cloned systemslibrarian/crypto-lab-fleet, a private
 * Fleet Console with a dashboard and a login page. It is not an exhibit: no
 * card, no census entry, nothing about it is a subject of any checker here.
 * Within minutes `theme-sync check` failed it twice for having no data-theme
 * and `dispatch-sync check` failed it for having no census pin — three findings
 * about a repository that is not a subject, produced because local enumeration
 * is a `crypto-lab-*` glob over whatever happens to be on disk.
 *
 * CI did not report it, and the tempting conclusion was that CI's enumeration
 * is the better definition. It is not. Measured 2026-11-08: CI's own filter is
 * `gh repo list systemslibrarian --jq 'select(.name | startswith("crypto-lab-"))'`,
 * and that DOES return crypto-lab-fleet when run with a credential that can see
 * it. CI excluded the console only because `secrets.GITHUB_TOKEN` is scoped to
 * this repository and cannot list the owner's private repos. Adopting CI as the
 * source of truth would have made fleet membership depend on which token ran
 * the job — and `protection-census` already runs with a PAT covering every
 * crypto-lab-* repo, so that token exists in this workflow file today.
 *
 * So membership is DECLARED: tools/non-exhibit-repos.json, read by
 * tools/sibling-labs.js and by the clone step in .github/workflows/fleet.yml.
 * These tests hold both halves of the invariant.
 */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const FLEET_ROOT = path.resolve(ROOT, '..');
const {
  siblingLabs, nonExhibitRepos, nonExhibitLine, declaredExclusionLine,
} = require('../tools/sibling-labs.js');

/** Every slug a card links to. The cards are the catalog's own membership. */
function cardedSlugs() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  return new Set([...html.matchAll(/systemslibrarian\.github\.io\/(crypto-lab-[a-z0-9-]+)\//g)]
    .map((m) => m[1]));
}

/** Every name the dispatch census pins, across all three of its lists. */
function censusPinned() {
  const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'dispatch-census.json'), 'utf8'));
  const out = new Set();
  for (const v of Object.values(c)) {
    if (!Array.isArray(v)) continue;
    for (const n of v) out.add(typeof n === 'string' ? n : n && n.repo);
  }
  out.delete(undefined);
  return out;
}

test('nothing is counted as a lab unless the catalog or the census says so', () => {
  const carded = cardedSlugs();
  const pinned = censusPinned();
  assert.ok(carded.size > 200, `only ${carded.size} carded slugs — the card regex probably broke`);
  assert.ok(pinned.size > 200, `only ${pinned.size} pinned names — the census read probably broke`);

  const { labs } = siblingLabs(FLEET_ROOT);
  const orphans = labs.filter((l) => !carded.has(l) && !pinned.has(l));
  assert.deepEqual(orphans, [],
    'a crypto-lab-* clone is being counted as a lab while being in neither the catalog nor '
    + 'the census. Either it is a real new lab, in which case run '
    + '`node tools/dispatch-census.js write` and card it, or it is not an exhibit, in which '
    + 'case declare it in tools/non-exhibit-repos.json with a reason.');
});

test('a declared non-subject is never enumerated, and is reported with its reason', () => {
  const declared = nonExhibitRepos();
  assert.ok(declared.size >= 1, 'the declared list should not be empty while the console exists');
  assert.ok(declared.has('crypto-lab-fleet'), 'the private Fleet Console must stay declared');

  const { labs, nonExhibit } = siblingLabs(FLEET_ROOT);
  for (const name of declared.keys()) {
    assert.ok(!labs.includes(name), `${name} is declared a non-subject but was enumerated as a lab`);
  }
  // Excluded is not the same as invisible. Every exclusion carries a reason and
  // prints, because an absence nobody mentions is the defect one layer down.
  for (const e of nonExhibit) {
    assert.ok(e.reason && e.reason.length > 20, `${e.repo} is excluded with no usable reason`);
  }
  if (fs.existsSync(path.join(FLEET_ROOT, 'crypto-lab-fleet'))) {
    const line = declaredExclusionLine(FLEET_ROOT);
    assert.match(line, /Declared non-subjects/);
    assert.match(line, /crypto-lab-fleet/);
    assert.match(line, /private Fleet Console/);
  }
  assert.equal(nonExhibitLine([]), '', 'nothing declared present means nothing printed');
});

test('local and CI read the SAME declared file, so neither can widen alone', () => {
  const declaredPath = path.join(ROOT, 'tools', 'non-exhibit-repos.json');
  assert.ok(fs.existsSync(declaredPath));

  // The enumerator every checker shares.
  const sib = fs.readFileSync(path.join(ROOT, 'tools', 'sibling-labs.js'), 'utf8');
  assert.match(sib, /require\('\.\/non-exhibit-repos\.json'\)/,
    'sibling-labs.js must read the declared list');

  // And the clone step in CI.
  const wf = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'fleet.yml'), 'utf8');
  assert.match(wf, /non-exhibit-repos\.json/,
    'the CI clone step must drop declared non-subjects from the SAME file');
  assert.match(wf, /grep -vxF -f/, 'the drop must be an exact-line filter, not a substring match');

  // An unreadable declared list is a broken checkout, not an empty exclusion set.
  assert.match(sib, /fleet membership is undefined/,
    'failing to read the list must refuse loudly rather than quietly widen the fleet');
});

test('the console is in no catalog, census or pin file', () => {
  for (const rel of ['index.html', 'README.md', 'CATALOG.md', 'concept-coverage.md',
    'tools/dispatch-census.json', 'tools/catalog-reviewed.json', 'tools/catalog-exhibits.json',
    'tools/lab-dates.json', 'tools/playwright-ports.json']) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, 'utf8');
    assert.ok(!src.includes('crypto-lab-fleet'),
      `${rel} names crypto-lab-fleet; the private console must not be listed anywhere`);
  }
});
