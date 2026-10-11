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
