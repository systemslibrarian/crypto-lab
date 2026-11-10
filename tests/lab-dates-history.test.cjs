'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { EXCLUDE_PATHSPEC } = require('../tools/lab-dates.js');

// Exercise Git itself: the old hand-written matcher passed while the actual
// history reader incorrectly counted root documentation as demo content.
function history(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lab-date-history-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
  const git = (...args) => execFileSync('git', args, { cwd: dir, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '--initial-branch=main');
  let sequence = 0;
  function commit(files) {
    sequence++;
    for (const file of files) {
      const target = path.join(dir, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, `fixture revision ${sequence}\n`);
    }
    git('add', '--', ...files);
    git('commit', '-m', `Fixture ${sequence}`);
    return git('rev-parse', 'HEAD');
  }
  const initial = commit(['index.html', 'native/wrapper.c']);
  const content = () => git('log', '-1', '--format=%H', 'main', '--', '.', ...EXCLUDE_PATHSPEC);
  return { git, commit, initial, content };
}

test('actual Git excludes root Markdown, including concurrent owner instructions', t => {
  const h = history(t);
  const docs = h.commit(['AGENTS.md', 'README.md', 'CLAUDE.md']);
  assert.equal(h.content(), h.initial);
  assert.equal(h.git('log', '-1', '--format=%H', 'main', '--', '.', ':(exclude)**/*.md'), docs,
    'negative control reproduces the former Git pathspec mismatch');
});

test('actual Git excludes nested Markdown documentation too', t => {
  const h = history(t);
  h.commit(['docs/threat-model.md', 'demos/web/README.md', 'src/explanation.md']);
  assert.equal(h.content(), h.initial);
});

test('actual Git excludes maintenance-only manifests, locks, workflows and tests', t => {
  const h = history(t);
  h.commit(['package.json', 'package-lock.json', '.github/workflows/check.yml',
    'test/unit.js', 'tests/unit.js', 'e2e/view.js', 'root.test.ts', 'src/crypto.spec.ts']);
  assert.equal(h.content(), h.initial);
});

test('actual root HTML edits still advance the demo revision', t => {
  const h = history(t);
  h.commit(['README.md']);
  const source = h.commit(['index.html']);
  assert.equal(h.content(), source);
});

test('nested demos and Rust, C, data and WASM paths remain content', t => {
  const h = history(t);
  for (const file of ['demos/web/index.html', 'web-demo/src/main.ts', 'crates/core/src/lib.rs',
    'native/wrapper.c', 'data/parameters.json', 'public/solver.wasm']) {
    const source = h.commit([file]);
    assert.equal(h.content(), source, file);
  }
});

test('a mixed documentation and content commit still advances the demo revision', t => {
  const h = history(t);
  const source = h.commit(['AGENTS.md', 'native/wrapper.c']);
  assert.equal(h.content(), source);
});

/* The nested half of the exclusion list. Every pattern but `**\/*.md` was
   root-anchored until crypto-lab-hybrid-wire's Dependabot bump -- which touched
   only demos/hybrid-wire/package-lock.json and demos/hybrid-wire/package.json --
   was read as a demo change and stamped November on a card nobody had touched.
   Each test below carries the OLD pathspec as a negative control, because a
   nested-lockfile test that passes under both forms proves nothing about the
   fix. */
const ROOT_ANCHORED = ['package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  '.github/**', 'e2e/**', 'test/**', 'tests/**', '**/*.test.*', '**/*.spec.*',
  '.gitignore', 'LICENSE', 'playwright.config.ts', '**/*.md']
  .map((p) => `:(glob,exclude)${p}`);

test('a nested-lockfile-only commit is not a demo change', t => {
  const h = history(t);
  const bump = h.commit(['demos/hybrid-wire/package-lock.json']);
  assert.equal(h.content(), h.initial, 'a nested lockfile bump must not move the date');
  assert.equal(h.git('log', '-1', '--format=%H', 'main', '--', '.', ...ROOT_ANCHORED), bump,
    'negative control: the root-anchored pathspec counted this bump as content');
});

test('the real hybrid-wire bump shape -- nested lockfile and manifest together -- is not a demo change', t => {
  const h = history(t);
  const bump = h.commit(['demos/hybrid-wire/package-lock.json', 'demos/hybrid-wire/package.json']);
  assert.equal(h.content(), h.initial);
  assert.equal(h.git('log', '-1', '--format=%H', 'main', '--', '.', ...ROOT_ANCHORED), bump,
    'negative control: this is the commit that put November on the card');
  /* Widening only the lockfile would have left this red, because the same commit
     carries the nested manifest. Asserted so the narrow fix cannot come back. */
  const lockOnly = ROOT_ANCHORED.map((p) => (p === ':(glob,exclude)package-lock.json'
    ? ':(glob,exclude)**/package-lock.json' : p));
  assert.equal(h.git('log', '-1', '--format=%H', 'main', '--', '.', ...lockOnly), bump,
    'control: widening the lockfile alone does not fix this commit');
});

test('nested tests, test config and dotfiles are not demo changes either', t => {
  const h = history(t);
  for (const file of ['demos/web/e2e/a11y.spec.ts', 'demos/web/tests/unit.js',
    'demos/web/playwright.config.ts', 'web-demo/.gitignore', 'demos/web/.github/workflows/ci.yml',
    'demos/web/LICENSE']) {
    h.commit([file]);
    assert.equal(h.content(), h.initial, file);
  }
});

test('widening to **/ does not turn a basename rule into a substring one', t => {
  const h = history(t);
  /* The failure mode of the fix itself: if `**\/package-lock.json` matched any
     path CONTAINING the name, a lab's own source would stop counting. */
  for (const file of ['src/package-lock-viewer.ts', 'src/e2e-recorder.ts', 'demos/web/src/testbed.ts']) {
    const source = h.commit([file]);
    assert.equal(h.content(), source, file);
  }
});

test('a nested lockfile bump beside nested source still counts as a demo change', t => {
  const h = history(t);
  const mixed = h.commit(['demos/hybrid-wire/package-lock.json', 'demos/hybrid-wire/src/wire.ts']);
  assert.equal(h.content(), mixed, 'the source in the same commit must still move the date');
});
