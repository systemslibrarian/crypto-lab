/* lab-dates printed DATES-UNREADABLE and then left it OUT of the exit
 * condition, so the daily fleet job reported
 *
 *     PASS  lab-dates  0s  node tools/lab-dates.js check
 *
 * while checking nothing. That job cloned --depth 1, so every clone was
 * shallow, every lab landed in `unreadable`, `stale` was empty because nothing
 * had been examined, and the run returned 0 under the words "Every card's dates
 * match the repository they describe (263 could not be re-derived)". The
 * sentence was honest and the exit code was not.
 *
 * The drift it exists to catch sat behind that PASS: crypto-lab-bitcoin-script
 * pinned 2026-10 against a lab that moved in 2026-11, plus
 * crypto-lab-commit-gate, neither reported for days.
 *
 * This control uses a SHALLOW clone made from a local clone, so it needs no
 * network, and it asserts the specific reason rather than just a non-zero exit:
 * "not cloned" and "shallow clone" are different states and the message has to
 * tell them apart, or a fleet with no clones at all would satisfy this test.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const FLEET = path.resolve(ROOT, '..');

function run(fleetRoot) {
  const r = spawnSync('node', [path.join(ROOT, 'tools', 'lab-dates.js'), 'check'], {
    cwd: ROOT, encoding: 'utf8',
    env: { ...process.env, CRYPTO_LAB_FLEET_ROOT: fleetRoot },
  });
  return { code: r.status, out: String(r.stdout || '') + String(r.stderr || '') };
}

/* Self-contained: a synthetic repository under a CARDED slug, then a shallow
 * clone of it. lab-dates only looks at slugs the catalog cards, so the fixture
 * has to borrow a real slug -- but nothing about the lab's own content matters
 * here, only that its history is or is not reachable. Built from scratch rather
 * than from a donor clone on disk, so this runs in readme-sync.yml, which
 * clones no siblings at all; a control that silently skips in CI is not a
 * control. */
function cardedSlug() {
  const pins = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'lab-dates.json'), 'utf8')).labs;
  const slug = Object.keys(pins)[0];
  assert.ok(slug, 'tools/lab-dates.json must pin at least one lab');
  return slug;
}

/** A real repository with two commits touching src/, at `dir`. */
function seedRepo(dir) {
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  const git = (...a) => execFileSync('git', ['-C', dir, ...a], { stdio: 'pipe' });
  git('init', '-q', '-b', 'main');
  for (const n of [1, 2]) {
    fs.writeFileSync(path.join(dir, 'src', 'main.ts'), `export const v = ${n};\n`);
    git('-c', 'user.email=t@t', '-c', 'user.name=t', 'add', '.');
    git('-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', `commit ${n}`);
  }
  return dir;
}

/** `slug` in `fleetRoot`, shallow: full history exists, but not here. */
function shallowLab(fleetRoot, slug) {
  const origin = seedRepo(fs.mkdtempSync(path.join(os.tmpdir(), 'lab-dates-origin-')));
  execFileSync('git', ['clone', '--depth', '1', '--quiet',
    `file://${origin}`, path.join(fleetRoot, slug)], { stdio: 'pipe' });
  assert.equal(execFileSync('git', ['-C', path.join(fleetRoot, slug), 'rev-parse',
    '--is-shallow-repository'], { encoding: 'utf8' }).trim(), 'true',
    'the fixture must actually be shallow for this to mean anything');
  return origin;
}

test('a shallow clone makes the check fail, and is named as shallow', (t) => {
  const slug = cardedSlug();
  const fleetRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lab-dates-fleet-'));
  const origin = shallowLab(fleetRoot, slug);
  t.after(() => {
    fs.rmSync(fleetRoot, { recursive: true, force: true });
    fs.rmSync(origin, { recursive: true, force: true });
  });

  const r = run(fleetRoot);
  assert.equal(r.code, 1, 'a date it could not re-derive must not be reported as current');
  assert.match(r.out, /DATES-UNREADABLE/);
  assert.match(r.out, new RegExp(`${slug} — shallow clone, history not present`),
    'it must name the lab AND say shallow, not merely that something was unreadable');
  assert.match(r.out, /NOT a claim about the fleet/,
    'and say plainly that the run is not a statement about the fleet');
  assert.doesNotMatch(r.out, /Every card's dates match/,
    'the clean sentence must not appear beside a refusal');
});

/* THE MUTATION: the exact behaviour before the fix. Without `unreadable` in the
   exit condition, the same fixture passes. */
test('MUTATION: without unreadable in the exit condition, the shallow fleet passes', (t) => {
  const slug = cardedSlug();
  const fleetRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lab-dates-mutant-'));
  const origin = shallowLab(fleetRoot, slug);
  t.after(() => {
    fs.rmSync(fleetRoot, { recursive: true, force: true });
    fs.rmSync(origin, { recursive: true, force: true });
  });

  const src = fs.readFileSync(path.join(ROOT, 'tools', 'lab-dates.js'), 'utf8');
  const stripped = src.replace(
    'if (problems.length || stale.length || unreadable.length) {',
    'if (problems.length || stale.length) {');
  assert.notEqual(stripped, src, 'the mutation must apply');

  /* The mutant runs from outside tools/ -- writing it into the real tools/ is
     the shared-state defect fixed in #486 -- so both its relative requires AND
     its __dirname-derived ROOT are pointed back at this repository. Without the
     second one it fails on a missing tools/lab-dates.json and the control would
     read as "the mutation was caught" when nothing had been exercised. */
  const mutant = path.join(fleetRoot, 'zz-lab-dates-mutant.js');
  fs.writeFileSync(mutant, stripped
    .replace(/require\('\.\/([^']+)'\)/g,
      (_, f) => `require(${JSON.stringify(path.join(ROOT, 'tools', f))})`)
    .replace(/__dirname/g, JSON.stringify(path.join(ROOT, 'tools'))));
  const m = spawnSync('node', [mutant, 'check'], {
    cwd: ROOT, encoding: 'utf8',
    env: { ...process.env, CRYPTO_LAB_FLEET_ROOT: fleetRoot },
  });
  assert.equal(m.status, 0, 'this is the defect, reproduced: it passes over a fleet it never read');
  assert.match(String(m.stdout || ''), /DATES-UNREADABLE/,
    'while printing the very list it is ignoring');
  assert.equal(run(fleetRoot).code, 1, 'and the fixed version refuses');
});
