/* theme-sync judged every `crypto-lab-*` directory it found on disk, so a
 * PRIVATE repo cloned beside the labs became a subject. crypto-lab-fleet did
 * that in 2026-11 and was answered by adding it to non-exhibit-repos.json;
 * crypto-lab-research-explorer then did the same and left main red on
 * `public/login.html has no data-theme` -- a true statement about a page that is
 * not an exhibit. A check that stays red on main teaches everyone to ignore red.
 *
 * Membership is now the CARD SET, which is fleet-sync's own rule derived without
 * the network: fleet-sync asks GitHub for public non-archived crypto-lab-* repos
 * that publish a page, and it enforces that the set agrees with the cards both
 * ways. Neither private repo has a card. Neither does a lane worktree.
 *
 * These controls drive the real checker against a fixture fleet, because the
 * thing to prove is about its DENOMINATOR, and a checker whose denominator
 * cannot be pointed somewhere else cannot be given a negative control.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

const page = (theme) => `<!doctype html>
<html${theme ? ` data-theme="${theme}"` : ''}><head><meta charset="utf-8">
<script>document.documentElement.setAttribute('data-theme','dark');</script>
<title>fixture</title></head><body><h1>fixture</h1></body></html>
`;

/* repositorySource() wants a readable origin naming systemslibrarian/<dir>, so
   the fixture labs are real repositories with that remote. A plain directory
   would be excluded as unreadable metadata and prove nothing. */
function makeLab(root, name, theme) {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(theme));
  const git = (...a) => execFileSync('git', a, { cwd: dir, stdio: 'pipe' });
  git('init', '-q', '-b', 'main');
  git('remote', 'add', 'origin', `https://github.com/systemslibrarian/${name}.git`);
  git('-c', 'user.email=t@t', '-c', 'user.name=t', 'add', '.');
  git('-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'fixture');
  return dir;
}

/* A card root carrying exactly the cards we want to be subjects. */
function makeCards(dir, slugs) {
  const cards = slugs.map((s) => `
          <a class="project-card" data-category="FOUNDATIONS" href="https://systemslibrarian.github.io/${s}/"
            target="_blank" rel="noopener" style="--accent: #35d6bb;">
            <div class="card-kicker">K</div>
            <div class="project-title">${s}</div>
            <div class="project-copy">c</div>
            <div class="project-meta"><div class="stack"><span class="chip">x</span></div><span class="arrow">&rarr;</span></div>
          </a>`).join('');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'),
    `<!doctype html><html data-theme="dark"><body><div class="project-grid">${cards}</div></body></html>\n`);
}

/* The fixture declares its own denominator, so the FLEET-UNREAD floor still
   runs -- clones compared against a pinned number -- and still refuses if the
   fixture fleet is short. Without this the floor fires on 2 clones against the
   real census's 263 and nothing below it is reported, which is the floor doing
   exactly its job. */
function census(dir, slugs) {
  const file = path.join(dir, 'census.json');
  fs.writeFileSync(file, JSON.stringify({
    generated: '2026-11-16',
    totals: { labs: slugs.length, autoMergeJobs: 0, dispatchSites: 0 },
    withDispatchSite: [], autoMergeButNoDispatch: [], noAutoMergeJob: slugs,
  }, null, 2) + '\n');
  return file;
}

function run(fleet, cardRoot, censusFile) {
  const r = spawnSync('node', [path.join(ROOT, 'tools', 'theme-sync.js'), 'check'], {
    cwd: ROOT, encoding: 'utf8',
    env: { ...process.env, CRYPTO_LAB_FLEET_ROOT: fleet, CRYPTO_LAB_CARD_ROOT: cardRoot,
      CRYPTO_LAB_CENSUS: censusFile },
  });
  const out = String(r.stdout || '') + String(r.stderr || '');
  assert.doesNotMatch(out, /FLEET-UNREAD/, 'the fixture must declare a denominator the floor accepts');
  return { code: r.status, out };
}

function fixture(t) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-fixture-'));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  return { base, fleet: path.join(base, 'fleet'), cards: path.join(base, 'cards') };
}

test('a canonical carded lab with a theme violation still FAILS', (t) => {
  const { base, fleet, cards } = fixture(t);
  makeLab(fleet, 'crypto-lab-fixture-good', 'dark');
  makeLab(fleet, 'crypto-lab-fixture-bad', null);          // no data-theme at all
  makeCards(cards, ['crypto-lab-fixture-good', 'crypto-lab-fixture-bad']);
  const c = census(base, ['crypto-lab-fixture-good', 'crypto-lab-fixture-bad']);

  const r = run(fleet, cards, c);
  assert.equal(r.code, 1, 'a carded lab with no data-theme must fail, or the checker guards nothing');
  assert.match(r.out, /crypto-lab-fixture-bad/, 'and it must name the lab');
  assert.match(r.out, /no data-theme/, 'and say what is wrong');
  assert.doesNotMatch(r.out, /crypto-lab-fixture-good.*no data-theme/,
    'the compliant lab must not be accused');
});

test('a stray worktree copy of that same lab is IGNORED', (t) => {
  const { base, fleet, cards } = fixture(t);
  makeLab(fleet, 'crypto-lab-fixture-good', 'dark');
  /* The same violating page, in a directory that carries no card of its own --
     a lane copy. Its origin names the copy's own directory, so it is not the
     canonical source for anything. */
  makeLab(fleet, 'crypto-lab-lane-fixture-copy', null);
  makeCards(cards, ['crypto-lab-fixture-good']);
  const c = census(base, ['crypto-lab-fixture-good', 'crypto-lab-lane-fixture-copy']);

  const r = run(fleet, cards, c);
  assert.equal(r.code, 0, 'a stray copy must not redden a check that CI cannot reproduce');
  assert.doesNotMatch(r.out, /Violations/, 'and must produce no violation at all');
  assert.match(r.out, /crypto-lab-lane-fixture-copy/,
    'but it must be NAMED as excluded: a silent skip is the defect one layer down');
});

test('an uncarded lab is excluded and named, not judged', (t) => {
  const { base, fleet, cards } = fixture(t);
  makeLab(fleet, 'crypto-lab-fixture-good', 'dark');
  makeLab(fleet, 'crypto-lab-private-console', null);       // stands in for a private repo
  makeCards(cards, ['crypto-lab-fixture-good']);
  const c = census(base, ['crypto-lab-fixture-good', 'crypto-lab-private-console']);

  const r = run(fleet, cards, c);
  assert.equal(r.code, 0, 'a private, uncarded repo cloned beside the labs is not an exhibit');
  assert.match(r.out, /carrying no card/, 'the exclusion class must be reported');
  assert.match(r.out, /crypto-lab-private-console/, 'by name');
  assert.match(r.out, /fleet-sync/, 'and point at the checker whose job that question is');
});

test('MUTATION: without the card-set membership, the uncarded repo is judged again', (t) => {
  const { base, fleet, cards } = fixture(t);
  makeLab(fleet, 'crypto-lab-fixture-good', 'dark');
  makeLab(fleet, 'crypto-lab-private-console', null);
  makeCards(cards, ['crypto-lab-fixture-good']);
  const c = census(base, ['crypto-lab-fixture-good', 'crypto-lab-private-console']);

  const src = fs.readFileSync(path.join(ROOT, 'tools', 'theme-sync.js'), 'utf8');
  const stripped = src.replace(
    "    if (!subjects.has(repo)) { uncardedSkipped.push(repo); continue; }\n", '');
  assert.notEqual(stripped, src, 'the mutation must apply');
  const mutant = path.join(ROOT, 'tools', 'zz-theme-sync-mutant.js');
  fs.writeFileSync(mutant, stripped);
  t.after(() => fs.rmSync(mutant, { force: true }));

  const m = spawnSync('node', [mutant, 'check'], {
    cwd: ROOT, encoding: 'utf8',
    env: { ...process.env, CRYPTO_LAB_FLEET_ROOT: fleet, CRYPTO_LAB_CARD_ROOT: cards,
      CRYPTO_LAB_CENSUS: c },
  });
  assert.equal(m.status, 1, 'the unguarded version accuses the non-exhibit, which is the bug');
  assert.match(String(m.stdout || ''), /crypto-lab-private-console/);
  assert.equal(run(fleet, cards, c).code, 0, 'and the guarded version does not');
});
