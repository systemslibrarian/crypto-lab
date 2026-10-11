'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { hasPage, main } = require('../tools/fleet-sync.js');
const SHA = 'a'.repeat(40);
const repo = (name = 'crypto-lab-fixture') => ({ name, description: 'Fixture', isPrivate: false, isArchived: false, defaultBranchRef: { name: 'release/current' } });
const ok = value => ({ ok: true, stdout: typeof value === 'string' ? value : JSON.stringify(value), stderr: '' });
const failed = (value = '', stderr = 'HTTP 403 fixture') => ({ ...ok(value), ok: false, stderr });
const tree = paths => ({ sha: SHA, truncated: false, tree: paths.map(path => ({ path, type: 'blob' })) });
const card = name => `<a class="project-card" href="https://systemslibrarian.github.io/${name}/">Fixture</a>`;

test('complete remote trees distinguish root/nested demos from README-only backends', async () => {
  for (const [paths, state] of [[['index.html'], 'page'], [['demos/web/index.html'], 'page'], [['README.md', 'src/main.rs'], 'no-page']]) {
    const result = await hasPage(repo(), { exists: () => false, run: async () => ok(tree(paths)) });
    assert.equal(result.state, state);
    assert.equal(result.sourceTreeSha, SHA);
  }
  assert.equal((await hasPage(repo(), { exists: () => false, run: async () => ok({ ...tree([]), tree: [{ path: 'index.html', type: 'tree' }] }) })).state, 'no-page');
});

test('failed, malformed, omitted-completeness and truncated API evidence is unreadable', async () => {
  const cases = [failed({ message: 'Forbidden' }), ok('{bad'), ok({ ...tree(['index.html']), truncated: true }), ok({ sha: SHA, tree: [] }), ok({ ...tree([]), tree: [{}] }), ok({ ...tree([]), sha: '' })];
  for (const response of cases) assert.equal((await hasPage(repo(), { exists: () => false, run: async () => response })).state, 'unread');
});

test('only an explicit empty-repository response means waiting for code', async () => {
  const response = failed({ message: 'Git Repository is empty.' }, 'gh: Git Repository is empty. (HTTP 409)');
  const result = await hasPage({ ...repo(), defaultBranchRef: null }, { exists: () => false, run: async () => response });
  assert.deepEqual(result, { state: 'no-page', waitingForCode: true });
  assert.equal((await hasPage(repo(), { exists: () => false, run: async () => failed({ message: 'Conflict' }, 'HTTP 409') })).state, 'unread');
});

test('verified clone reads an immutable fetched actual default branch, preserving worktree files', async () => {
  const calls = [];
  const result = await hasPage(repo(), { exists: () => true, run: async (cmd, args) => {
    calls.push({ cmd, args });
    if (args[0] === 'remote') return ok('git@github.com:systemslibrarian/crypto-lab-fixture.git');
    if (args[0] === 'fetch') return ok('');
    if (args[0] === 'rev-parse') return ok(SHA);
    if (args[0] === 'ls-tree') return ok('README.md\0demos/web/index.html\0');
    throw Error('Unexpected command');
  } });
  assert.deepEqual(result, { state: 'page', sourceSha: SHA });
  assert.deepEqual(calls.map(c => c.args), [
    ['remote', 'get-url', 'origin'],
    ['fetch', '--quiet', 'origin', 'release/current:refs/remotes/origin/release/current'],
    ['rev-parse', 'refs/remotes/origin/release/current^{commit}'],
    ['ls-tree', '-r', '--name-only', '-z', SHA],
  ]);
});

test('wrong clone identity stops before fetching or reading unrelated source', async () => {
  const calls = [];
  const result = await hasPage(repo(), { exists: () => true, run: async (cmd, args) => { calls.push(args); return ok('https://github.com/another/crypto-lab-fixture.git'); } });
  assert.equal(result.state, 'unread'); assert.equal(calls.length, 1);
});

test('failed fetch cannot use a stale page-bearing ref or silently fall back', async () => {
  const calls = [];
  const result = await hasPage(repo(), { exists: () => true, run: async (cmd, args) => {
    calls.push({ cmd, args });
    if (args[0] === 'remote') return ok('https://github.com/systemslibrarian/crypto-lab-fixture.git');
    if (args[0] === 'fetch') return failed('', 'network unavailable');
    throw Error('Stale source must not be read');
  } });
  assert.equal(result.state, 'unread'); assert.equal(calls.length, 2);
});

test('missing or malformed fetched commit and failed tree read stay unreadable', async () => {
  for (const stage of ['commit-error', 'commit-malformed', 'tree-error']) {
    const result = await hasPage(repo(), { exists: () => true, run: async (cmd, args) => {
      if (args[0] === 'remote') return ok('ssh://git@github.com/systemslibrarian/crypto-lab-fixture.git');
      if (args[0] === 'fetch') return ok('');
      if (args[0] === 'rev-parse') return stage === 'commit-error' ? failed() : ok(stage === 'commit-malformed' ? 'not-a-commit' : SHA);
      return failed();
    } });
    assert.equal(result.state, 'unread');
  }
});

test('missing default branch uses fresh GitHub evidence rather than guessing stale local refs', async () => {
  const calls = [];
  const result = await hasPage({ ...repo(), defaultBranchRef: null }, { exists: () => true, run: async (cmd, args) => {
    calls.push({ cmd, args });
    return cmd === 'git' ? ok('https://github.com/systemslibrarian/crypto-lab-fixture.git') : ok(tree(['index.html']));
  } });
  assert.equal(result.state, 'page'); assert.deepEqual(calls.map(c => c.cmd), ['git', 'gh']);
});

test('one unreadable tree makes actual aggregate incomplete without mislabelling it headless', async () => {
  const output = []; const repos = [repo(), repo('crypto-lab-unknown'), repo('crypto-lab-backend')];
  const code = await main({ exists: () => false, html: card(repos[0].name) + card(repos[1].name), log: value => output.push(value), error: value => output.push(value), run: async (cmd, args) => {
    if (args[0] === 'repo') return ok(repos);
    if (args[1].includes('crypto-lab-unknown/')) return failed({ message: 'Forbidden' });
    return ok(tree(args[1].includes('backend/') ? ['README.md', 'src/main.rs'] : ['index.html']));
  } });
  assert.equal(code, 2);
  assert(output.some(s => s.includes('UNREAD (1)')));
  assert(output.some(s => s.includes('1 without an index.html, 1 unreadable')));
  assert(!output.some(s => s.includes('Every live lab has a card')));
});

test('readable aggregate preserves cards and headless/empty repository roles', async () => {
  const output = []; const repos = [repo(), repo('crypto-lab-backend'), repo('crypto-lab-empty')];
  const code = await main({ exists: () => false, html: card(repos[0].name), log: value => output.push(value), error: value => output.push(value), run: async (cmd, args) => {
    if (args[0] === 'repo') return ok(repos);
    if (args[1].includes('empty/')) return failed({ message: 'Git Repository is empty.' }, 'HTTP 409');
    return ok(tree(args[1].includes('backend/') ? ['README.md', 'src/main.rs'] : ['demos/web/index.html']));
  } });
  assert.equal(code, 0); assert(output.some(s => s.includes('Every live lab has a card')));
  assert(output.some(s => s.includes('empty repository; waiting for code')));
});

test('failed or incomplete owner inventory cannot claim global success', async () => {
  const inventories = [failed(), ok('{}'), ok([{ name: 'crypto-lab-fixture' }]), ok(Array.from({ length: 400 }, (_, i) => repo(`crypto-lab-limit-${i}`))), ok([repo(), repo()])];
  for (const response of inventories) {
    const output = []; let calls = 0;
    const code = await main({ html: '', log: v => output.push(v), error: v => output.push(v), run: async () => { calls++; return response; } });
    assert.equal(code, 2); assert.equal(calls, 1); assert(!output.some(s => s.includes('Every live lab has a card')));
  }
});

test('source reads are bounded while accounting for every listed repository', async () => {
  const repos = Array.from({ length: 20 }, (_, i) => repo(`crypto-lab-bound-${i}`));
  let active = 0, maximum = 0, read = 0;
  const code = await main({ html: repos.map(r => card(r.name)).join(''), exists: () => false, log: () => {}, error: () => {}, run: async (cmd, args) => {
    if (args[0] === 'repo') return ok(repos);
    active++; maximum = Math.max(maximum, active); await new Promise(resolve => setImmediate(resolve)); active--; read++;
    return ok(tree(['index.html']));
  } });
  assert.equal(code, 0); assert.equal(read, 20); assert(maximum <= 8 && maximum > 1);
});

test('check mode still fails a verified browser lab missing its catalog card', async () => {
  const output = [];
  const code = await main({ check: true, html: '', exists: () => false, log: v => output.push(v), error: v => output.push(v), run: async (cmd, args) => args[0] === 'repo' ? ok([repo()]) : ok(tree(['index.html'])) });
  assert.equal(code, 1); assert(output.some(s => s.includes('LIVE BUT UNCATALOGUED (1)')));
  assert(!output.some(s => s.includes('Every live lab has a card')));
});

test('newlines in one tracked filename cannot masquerade as separate HTML paths', async () => {
  for (const file of ['notes\nindex.html\nunrelated.txt', 'index.html\n', 'demos/index.html\r']) {
    const result = await hasPage(repo(), { exists: () => false, run: async () => ok(tree([file])) });
    assert.equal(result.state, 'no-page', JSON.stringify(file));
  }
});
