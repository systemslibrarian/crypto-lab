'use strict';

/*
 * The weekly job clones the labs `--depth 1`, so a commit it never fetches by
 * SHA is simply ABSENT from the clone. Every commit this job's own checks
 * resolve anchors at therefore has to appear in the clone step's list.
 *
 * Run 43127292889 is why this exists. The emitter listed each lab's pin
 * `commit` and its exhibit map's `commit`, and nothing else. Seven scope
 * assertions then threw
 *
 *   crypto-lab-ablation-wire: codetalker-core/src/aead.rs:5
 *   could not be read at both 81ddddc6b71c and 41b484d97cda
 *
 * where the first SHA is that lab's `reviewedCommit` -- the bytes a person
 * actually read, which is what those tests resolve anchors at. The blob was
 * not in the clone, the test reported it as a failure about the lab, and the
 * job stopped before opening its pull request. A could-not-look presented as
 * a finding, in a shallow clone: the same shape as the 27 false stale reviews
 * of 2026-10-01, fixed then in the clones a person runs against and recurring
 * here because nobody asked the same question of CI.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const WORKFLOW = path.join(ROOT, '.github', 'workflows', 'pin-advance.yml');
const SHA = /^[0-9a-f]{40}$/;

/** EVERY emitter in the workflow, run as the workflow runs it.
 *
 * This took `indexOf` -- the FIRST emitter -- and stopped. When the exhibit-map
 * half was split into its own job on 2026-11-17 that job got a COPY of the clone
 * step, and the copy was unchecked here: deleting its anchorsUnchangedAt line
 * left this test green while the second job cloned without the commits its own
 * anchors resolve at. One emitter checked out of two is how the shallow-clone
 * failure above comes back, so every occurrence is run now. */
function emitterBodies() {
  const yaml = fs.readFileSync(WORKFLOW, 'utf8');
  const marker = "node -e '\n            const pins = require";
  const bodies = [];
  for (let at = yaml.indexOf(marker); at !== -1; at = yaml.indexOf(marker, at + 1)) {
    const start = yaml.indexOf('\n', at) + 1;
    const end = yaml.indexOf("\n          ' > /tmp/pinned.txt", start);
    assert.notEqual(end, -1, 'the emitter must still write /tmp/pinned.txt');
    bodies.push(yaml.slice(start, end).replace(/^ {12}/gm, ''));
  }
  assert.ok(bodies.length > 0, 'a clone step must still build its list with an inline node -e');
  return bodies;
}

/** The pairs one emitter body produces. */
function pairsOf(body) {

  const lines = [];
  const log = (s) => lines.push(String(s));
  // eslint-disable-next-line no-new-func
  new Function('require', 'console', body)(
    (id) => require(path.join(ROOT, id.replace(/^\.\//, ''))),
    { log },
  );
  return lines.map((l) => l.split(' '));
}

/** Every emitter's pairs, so an assertion covers each copy. */
function emittedPairsPerJob() {
  return emitterBodies().map(pairsOf);
}

/** The first emitter's pairs, for assertions about content rather than coverage. */
function emittedPairs() {
  return emittedPairsPerJob()[0];
}

test('every commit the job resolves anchors at is fetched into the shallow clone', () => {
  const pairs = emittedPairs();
  assert.ok(pairs.length > 300, `the emitter produced only ${pairs.length} pairs`);
  const emitted = new Map();
  for (const [slug, sha] of pairs) {
    assert.ok(SHA.test(sha), `emitted a non-SHA for ${slug}: ${sha}`);
    if (!emitted.has(slug)) emitted.set(slug, new Set());
    emitted.get(slug).add(sha);
  }

  const pins = require(path.join(ROOT, 'tools', 'catalog-reviewed.json'));
  const maps = require(path.join(ROOT, 'tools', 'catalog-exhibits.json')).labs || {};

  /* reviewedCommit is the one the failure named, so it is asserted by name
     rather than folded into a loop over every field. */
  const missingReviewed = [];
  for (const [slug, e] of Object.entries(pins.labs || pins)) {
    if (!e || typeof e !== 'object' || !SHA.test(e.reviewedCommit || '')) continue;
    if (!emitted.get(slug)?.has(e.reviewedCommit)) missingReviewed.push(`${slug}@${e.reviewedCommit.slice(0, 12)}`);
  }
  assert.deepEqual(missingReviewed, [],
    'reviewedCommit is where the scope tests read anchors; an unfetched one reads as a lab defect');

  /* And the rest of what the job compares against. */
  const missing = [];
  for (const [slug, e] of Object.entries(pins.labs || pins)) {
    if (!e || typeof e !== 'object') continue;
    for (const sha of [e.commit, ...String(e.range || '').split('..')]) {
      if (SHA.test(sha) && !emitted.get(slug)?.has(sha)) missing.push(`${slug} pin ${sha.slice(0, 12)}`);
    }
  }
  for (const [slug, m] of Object.entries(maps)) {
    for (const sha of [m.commit, m.anchorsUnchangedAt?.commit]) {
      if (SHA.test(sha || '') && !emitted.get(slug)?.has(sha)) missing.push(`${slug} map ${sha.slice(0, 12)}`);
    }
  }
  assert.deepEqual(missing, [], 'these commits would be absent from the depth-1 clone');
});

test('the emitter covers strictly more than the pin commits alone', () => {
  /* MUTATION CONTROL. The pre-fix emitter listed pin and map commits only; if
     a future edit narrows it back to that, the count collapses and the test
     above starts naming labs. Pinning the inequality here says WHY the extra
     fetches exist, so the next reader does not trim them as noise. */
  const pins = require(path.join(ROOT, 'tools', 'catalog-reviewed.json'));
  const maps = require(path.join(ROOT, 'tools', 'catalog-exhibits.json')).labs || {};
  let narrow = 0;
  const seen = new Map();
  const add = (slug, sha) => {
    if (!SHA.test(sha || '')) return;
    if (!seen.has(slug)) seen.set(slug, new Set());
    if (!seen.get(slug).has(sha)) { seen.get(slug).add(sha); narrow += 1; }
  };
  for (const [slug, e] of Object.entries(pins.labs || pins)) if (e && typeof e === 'object') add(slug, e.commit);
  for (const [slug, m] of Object.entries(maps)) add(slug, m.commit);

  /* Asked of EVERY job's emitter. The exhibit-map job carries its own copy of
     the clone step, and a copy that quietly narrowed back to pin+map commits
     would clone without the commits its own anchors resolve at -- while this
     test, reading only the first, stayed green. */
  const perJob = emittedPairsPerJob();
  assert.ok(perJob.length >= 1, 'at least one emitter must exist');
  perJob.forEach((pairs, i) => {
    assert.ok(pairs.length > narrow,
      `emitter ${i + 1} of ${perJob.length} must fetch more than pin+map commits `
      + `(${pairs.length} vs ${narrow}); reviewedCommit is the one that mattered`);
  });

  /* And they must agree with each other: two jobs resolving anchors in the same
     clones need the same commits present, so a difference is a copy that drifted
     rather than a deliberate narrowing. */
  const sets = perJob.map((pairs) => new Set(pairs.map((x) => x.join(' '))));
  sets.forEach((s, i) => {
    assert.deepEqual([...s].sort(), [...sets[0]].sort(),
      `emitter ${i + 1} emits a different commit set from the first; the copies have drifted`);
  });
});

test('no inline node -e body contains a single quote, which would end the shell string', () => {
  /* This is the test the first version did not have, and the gap it left cost
     a run. emittedPairs() lifts the JS out and runs it through new Function,
     which knows nothing about how the shell got it there. The body is passed
     as `node -e '...'` -- a single-quoted shell string -- so ONE apostrophe
     anywhere inside it closes the quote early. Run 43139025052 died with
     "Unterminated block comment" because a comment said "ablation-wire's
     reviewedCommit": the JS was valid, the shell delivered half of it. */
  const yaml = fs.readFileSync(WORKFLOW, 'utf8');
  const bodies = [...yaml.matchAll(/node -e '\n([\s\S]*?)\n\s*'/g)].map((m) => m[1]);
  assert.ok(bodies.length >= 3, `expected the inline node scripts, found ${bodies.length}`);
  const offenders = [];
  for (const [i, body] of bodies.entries()) {
    for (const line of body.split('\n')) {
      if (line.includes("'")) offenders.push(`block ${i}: ${line.trim().slice(0, 70)}`);
    }
  }
  assert.deepEqual(offenders, [],
    "a single quote inside node -e '...' truncates the script at that character");
});
