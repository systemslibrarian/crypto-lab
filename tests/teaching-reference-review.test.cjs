'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// The optional root is for an isolated review lane before the generator is
// locally copied into it. Normal repository execution needs no environment.
const moduleRoot = process.env.TEACHING_REFERENCE_REVIEW_ROOT || path.resolve(__dirname, '..');

function controlledChild({ moduleRoot, fixtureRoot, mode }) {
  const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
  const cp = require('node:child_process'), realExec = cp.execFileSync;
  const hub = path.join(fixtureRoot, 'hub'), lab = path.join(fixtureRoot, 'lab');
  const slug = 'crypto-lab-ref-race-control';
  fs.mkdirSync(path.join(hub, 'tools'), { recursive: true }); fs.mkdirSync(lab);
  const git = args => realExec('git', ['-C', lab, '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args],
    { encoding: 'utf8', env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' } }).trim();
  git(['init', '-q']); git(['config', 'user.name', 'selftest']); git(['config', 'user.email', 'selftest@example.invalid']);
  git(['remote', 'add', 'origin', 'https://github.com/systemslibrarian/' + slug + '.git']);
  const originalText = '<p>Original exact learner wording.</p>\n', changedText = '<p>Different current learner wording.</p>\n';
  fs.writeFileSync(path.join(lab, 'index.html'), originalText);
  git(['add', 'index.html']); git(['commit', '-qm', 'fixture original']);
  const fromSha = git(['rev-parse', 'HEAD']);
  git(['update-ref', 'refs/remotes/origin/main', fromSha]);
  git(['symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/main']);
  fs.writeFileSync(path.join(hub, 'tools', 'catalog-reviewed.json'), JSON.stringify({
    [slug]: { commit: fromSha, note: 'Fixture review has a limited original scope.', add: [] },
  }));
  fs.writeFileSync(path.join(hub, 'index.html'), '<a class="project-card" data-category="education" href="https://systemslibrarian.github.io/' + slug +
    '/" data-implements="N/A" data-implementation="Educational control"><span class="project-title">Race control</span>' +
    '<p class="project-copy">Restricted educational demo.</p></a>');

  let armed = false, moves = 0, toSha = null;
  cp.execFileSync = function(command, args, options) {
    const output = realExec.apply(this, arguments);
    // Preserve the real captured response, then model a concurrent fetch's
    // actual ref move exactly after immutable blob bytes were read.
    if (armed && command === 'git' && Array.isArray(args) && args.includes('cat-file') && args.includes('--batch') &&
      args[args.indexOf('-C') + 1] === lab) {
      armed = false; git(['update-ref', 'refs/remotes/origin/main', toSha]); moves++;
    }
    return output;
  };
  try {
    // Import after instrumentation: clone-source destructures execFileSync.
    const reference = require(path.join(moduleRoot, 'tools', 'teaching-reference.js'));
    const before = reference.build(hub, [fixtureRoot], 'origin/HEAD'), previous = before.records[0];
    assert.equal(previous.source.state, 'readable'); assert.equal(previous.source.indexedSha, fromSha);
    assert.equal(previous.review.lastReviewedSha, fromSha);
    const exactBefore = reference.json(previous);
    if (mode === 'sources') reference.saveGenerated(hub, before);
    fs.writeFileSync(path.join(lab, 'index.html'), changedText);
    git(['add', 'index.html']); git(['commit', '-qm', 'fixture changed source']); toSha = git(['rev-parse', 'HEAD']);
    assert.notEqual(fromSha, toSha);
    assert.equal(git(['rev-parse', 'origin/HEAD']), fromSha, 'Capture begins at original ref');
    assert.equal(git(['show', toSha + ':index.html']), changedText.trim());
    armed = true;
    let sourceState, checkError;
    if (mode === 'capture') {
      const review = reference.reviewInputs(hub, [fixtureRoot], reference.catalog(hub)).get(slug);
      const context = { generatorHash: previous.generatorHash, ref: 'origin/HEAD', reused: 0, extracted: 0 };
      const captured = reference.capture(previous.catalog, [{ directory: lab, remote: 'https://github.com/systemslibrarian/' + slug + '.git' }],
        review, previous, context);
      sourceState = captured.source.state;
      assert.equal(sourceState, 'stale');
      assert.equal(captured.source.indexedSha, fromSha, 'Historical bytes retain original immutable pin');
      assert.equal(captured.review.lastReviewedSha, fromSha, 'Extraction never advances the original review');
      assert.equal(context.reused, 0); assert.equal(context.extracted, 1);
      assert.notEqual(captured.changeReport.state, 'unchanged');
      assert.equal(captured.changeReport.unchangedWordingInvalidated, true);
      const gap = captured.gaps.find(g => g.kind === 'ref-changed-during-reuse');
      assert(gap && gap.reason.includes(fromSha) && gap.reason.includes(toSha));
      assert.deepEqual(captured.files, previous.files); assert.deepEqual(captured.sections, previous.sections);
      assert.equal(captured.files[0].sha256, reference.sha256(originalText));
      assert.equal(reference.json(previous), exactBefore, 'The saved evidence object is not mutated');
    } else {
      const dir = path.join(hub, 'teaching-reference');
      const files = [path.join(dir, 'manifest.json'), path.join(dir, 'records', slug + '.json'), path.join(hub, 'TEACHING-REFERENCE.md')];
      const savedBytes = files.map(file => fs.readFileSync(file));
      try { reference.main(['check', '--sources', '--root', hub, '--repositories', fixtureRoot]); }
      catch (error) { checkError = error.message; }
      assert.match(checkError || '', /Current source check is incomplete/);
      files.forEach((file, index) => assert.deepEqual(fs.readFileSync(file), savedBytes[index], 'Read-only check must not rewrite saved evidence'));
      assert.equal(reference.loadRecords(dir).records[0].source.indexedSha, fromSha);
    }
    assert.equal(moves, 1, 'Actual Git ref move occurs at the controlled capture boundary');
    assert.equal(git(['rev-parse', 'origin/HEAD']), toSha, 'Current ref really changed');
    process.stdout.write(JSON.stringify({ mode, fromSha, toSha, moves, sourceState: sourceState || null, checkError: checkError || null }));
  } finally { cp.execFileSync = realExec; }
}

function runControl(t, mode) {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'teaching-reference-ref-race-'));
  t.after(() => fs.rmSync(fixtureRoot, { recursive: true, force: true }));
  const code = '(' + controlledChild.toString() + ')(' + JSON.stringify({ moduleRoot, fixtureRoot, mode }) + ');';
  const result = spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', maxBuffer: 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const receipt = JSON.parse(result.stdout); assert.equal(receipt.moves, 1); assert.notEqual(receipt.fromSha, receipt.toSha);
  return receipt;
}

test('actual concurrent Git ref move during cached blob capture retains stale original evidence', t => {
  assert.equal(runControl(t, 'capture').sourceState, 'stale');
});

test('current-source check fails on an actual cached-capture ref race without changing saved records', t => {
  assert.match(runControl(t, 'sources').checkError, /Current source check is incomplete/);
});
