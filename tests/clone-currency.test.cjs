'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ce = require(path.join(ROOT, 'tools/catalog-evidence.js'));
const { cloneCurrency, cloneHolds, SUBSTANTIVE } = ce;

/* A throwaway origin and a clone of it, so currency is asserted against real git
   ancestry rather than a mock that would agree with any rule. */
function pair() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'currency-'));
  const origin = path.join(base, 'origin');
  const clone = path.join(base, 'clone');
  fs.mkdirSync(origin);
  const g = (dir) => (...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  const go = g(origin);
  go('init', '-q', '-b', 'main');
  go('config', 'user.email', 't@example.invalid');
  go('config', 'user.name', 't');
  fs.writeFileSync(path.join(origin, 'a.txt'), 'one\n');
  go('add', 'a.txt'); go('commit', '-qm', 'one');
  execFileSync('git', ['clone', '-q', origin, clone], { stdio: ['ignore', 'pipe', 'ignore'] });
  const gc = g(clone);
  gc('config', 'user.email', 't@example.invalid');
  gc('config', 'user.name', 't');
  return { origin, clone, go, gc };
}
const headOf = (d) => execFileSync('git', ['-C', d, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

test('a clone at the remote commit is current', () => {
  const { clone } = pair();
  const h = headOf(clone);
  assert.deepEqual(cloneCurrency(clone, h, h), { state: 'current', behind: 0 });
});

test('a clone behind a FETCHED remote commit is behind, with a count', () => {
  const { origin, clone, go, gc } = pair();
  fs.writeFileSync(path.join(origin, 'a.txt'), 'two\n');
  go('add', 'a.txt'); go('commit', '-qm', 'two');
  gc('fetch', '-q', 'origin');
  const remote = execFileSync('git', ['-C', clone, 'rev-parse', 'origin/main'], { encoding: 'utf8' }).trim();
  const out = cloneCurrency(clone, headOf(clone), remote);
  assert.equal(out.state, 'behind');
  assert.equal(out.behind, 1);
});

/*
 * THE DEFECT THIS WHOLE CHECK EXISTS FOR. The old test fired only when the
 * remote revision was unfetched, or the pin equalled the remote. After a plain
 * fetch neither holds, so a clone sitting behind a fetched remote was reported
 * neither behind nor stale -- 113 clones on 2026-11-08, 29 of them reviewed.
 * The test above is that case; this one asserts the unfetched case still works,
 * so closing one did not open the other.
 */
test('a clone that has never fetched the remote commit is behind', () => {
  const { origin, clone, go } = pair();
  fs.writeFileSync(path.join(origin, 'a.txt'), 'two\n');
  go('add', 'a.txt'); go('commit', '-qm', 'two');
  const remote = headOf(origin);
  const out = cloneCurrency(clone, headOf(clone), remote);
  assert.equal(out.state, 'behind');
  assert.equal(out.behind, null, 'the count is unknowable without the object, and is not guessed');
});

test('a clone with commits the remote lacks is ahead, not behind', () => {
  const { clone, gc } = pair();
  const remote = headOf(clone);
  fs.writeFileSync(path.join(clone, 'b.txt'), 'local\n');
  gc('add', 'b.txt'); gc('commit', '-qm', 'local only');
  const out = cloneCurrency(clone, headOf(clone), remote);
  assert.equal(out.state, 'ahead-or-diverged', 'push or reset is the remedy, never fetch');
});

test('an unanswerable remote is could-not-look, never a finding', () => {
  const { clone } = pair();
  assert.equal(cloneCurrency(clone, headOf(clone), null).state, 'could-not-look');
  assert.equal(cloneCurrency(clone, null, headOf(clone)).state, 'could-not-look');
});

/* ------------------------------------------------------- the structural guard */

/*
 * The behind test must not be nested inside `if (review)`. That nesting IS the
 * defect: an unpinned lab was never asked whether its checkout was current, and
 * 131 of the 252 carded labs carry no pin. Asserted on the source because the
 * behaviour needs 252 network calls to observe.
 */
test('currency is asked before the pin is consulted, not inside it', () => {
  const src = fs.readFileSync(path.join(ROOT, 'tools/catalog-evidence.js'), 'utf8');
  const fn = src.slice(src.indexOf('function verifyAnchors('));
  const loop = fn.indexOf('for (const c of all) {');
  const currency = fn.indexOf('cloneCurrency(dir, head, remote)', loop);
  const review = fn.indexOf('const review = REVIEWS[c.slug]', loop);
  assert.ok(currency > loop, 'currency is computed inside the per-card loop');
  assert.ok(review > currency,
    'the pin is read AFTER currency, so an unpinned lab is still asked whether it is current');
});

test('a behind clone fails the run rather than warning', () => {
  const src = fs.readFileSync(path.join(ROOT, 'tools/catalog-evidence.js'), 'utf8');
  assert.match(src, /if \(bad\.length \|\| unreadable\.length \|\| behind\.length \|\| diverged\.length/,
    'behind and diverged both reach the non-zero exit');
});

/* ------------------------------------------------------------ declared holds */

test('a declared hold carries a reason and evidence', () => {
  const holds = cloneHolds();
  assert.ok(holds.size >= 1);
  for (const [repo, h] of holds) {
    assert.match(repo, /^crypto-lab-/);
    assert.ok(h.reason && h.reason.length > 40, `${repo}: a hold without a reason is a silent exemption`);
    assert.ok(h.asked, `${repo}: a hold records when it was asked for`);
  }
});

test('an unreadable hold list is refused, never read as "no holds"', () => {
  /* Treating an unreadable list as empty would turn a declared hold into a
     failure; treating it as "everything is held" would hide every stale clone.
     Both are worse than refusing. */
  const src = fs.readFileSync(path.join(ROOT, 'tools/catalog-evidence.js'), 'utf8');
  const fn = src.slice(src.indexOf('function cloneHolds()'), src.indexOf('function cloneHolds()') + 1200);
  assert.match(fn, /throw new Error\('tools\/clone-holds\.json is unreadable/);
});

test('the held lab is reported, and reporting it is not a pass', () => {
  const src = fs.readFileSync(path.join(ROOT, 'tools/catalog-evidence.js'), 'utf8');
  assert.match(src, /CLONE-HELD \(\$\{held\.length\}\)/);
  assert.match(src, /HOLD NO LONGER NEEDED/, 'a hold that stopped being needed is named, so the file cannot rot');
});

/* ------------------------------------------------- the substantive path scope */

test('source under a demos/<slug>/ layout invalidates a review', () => {
  assert.ok(SUBSTANTIVE.test('demos/collision-vault/src/main.ts'),
    'eight labs keep their source here; the root-only test could not see it');
  assert.ok(SUBSTANTIVE.test('web-demo/src/app.ts'));
  assert.ok(SUBSTANTIVE.test('crates/qv-core/src/lib.rs'));
  assert.ok(SUBSTANTIVE.test('wasm/src/exports.c'));
  assert.ok(SUBSTANTIVE.test('src/main.ts'));
  assert.ok(SUBSTANTIVE.test('README.md'));
});

/*
 * index.html is deliberately OUT. Including it took STALE-REVIEW from 2 labs to
 * 41, and 39 of those had moved nothing but page markup -- a re-review queue
 * with nothing in it, which this repository has produced three times. Anchor rot
 * in index.html is caught by STALE-ANCHOR instead, which re-opens every anchor
 * on every run.
 */
test('page markup alone does not demand a human re-review', () => {
  assert.ok(!SUBSTANTIVE.test('index.html'));
  assert.ok(!SUBSTANTIVE.test('demos/shamir-gate/index.html'));
  assert.ok(!SUBSTANTIVE.test('AGENTS.md'));
  assert.ok(!SUBSTANTIVE.test('package-lock.json'));
  assert.ok(!SUBSTANTIVE.test('.github/workflows/deploy.yml'));
});
