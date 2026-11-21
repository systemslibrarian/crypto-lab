/**
 * The served-to-served corpus check, one test per verdict, UNREAD included.
 *
 * Every verdict is driven through the REAL CLI against a local HTTP server, not
 * through the pure functions alone. A check whose network paths are untested is a
 * check whose UNREAD branch nobody has ever watched run, and UNREAD is the branch
 * that matters: "could not look" must never come back as "no drift", because an
 * absent answer about the live site is the state that precedes the failure this
 * check exists to find.
 *
 * The first version of this checker reported 244 SERVED-BEHIND out of 264 cards.
 * That was entirely its own parser — the corpus id is UNDERSCORED
 * (`demo_crypto_lab_iron_letter`) and a card's href slug is HYPHENATED, so
 * `[a-z0-9-]+` resolved only the single-word slugs. It was a clean, specific,
 * actionable-looking claim about the fleet that was a defect in the instrument, so
 * the separator is pinned here in both directions.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn, spawnSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const TOOL = path.join(ROOT, 'tools', 'corpus-served.js');
const {
  cardedSlugs, corpusSlugs, compare, bust, idToSlug, CATALOG_URL, CORPUS_URL,
  LIVE_CATALOG_URL, LIVE_CORPUS_URL,
} = require('../tools/corpus-served.js');

const card = (slug) => `<a class="project-card" data-category="X" href="https://systemslibrarian.github.io/crypto-lab-${slug}/" target="_blank">`;
const index = (slugs) => `<html><body><div class="project-grid">${slugs.map(card).join('\n')}</div></body></html>`;
const corpus = (slugs, extra = []) => JSON.stringify([
  ...slugs.map((s) => ({ id: `demo_crypto_lab_${s.replace(/-/g, '_')}`, text: 'x', reviewed: null })),
  ...extra,
]);

/** A local server standing in for the two origins, so every verdict is end to end. */
function serve(routes) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const r = routes[url.pathname];
    if (!r) { res.writeHead(404); res.end('no route'); return; }
    if (typeof r === 'function') { r(req, res); return; }
    res.writeHead(r.status || 200, { 'content-type': r.type || 'text/html' });
    res.end(r.body);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    resolve({ port, base: `http://127.0.0.1:${port}`, close: () => new Promise((d) => server.close(d)) });
  }));
}

/* spawn, NOT spawnSync. The stand-in server lives in THIS process, and
   spawnSync blocks this process's event loop -- so the parent can never answer
   the child's request and every end-to-end test times out against a server that
   is running and unable to reply. Measured: all five timed out at 5s with
   "TimeoutError", which reads exactly like an unreachable origin and is really
   the harness deadlocking against itself. */
function run(env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [TOOL, 'check'], {
      cwd: ROOT,
      env: { ...process.env, CORPUS_SERVED_TIMEOUT_MS: '5000', ...env },
    });
    let stdout = ''; let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (status) => resolve({ status, stdout, stderr }));
  });
}

/* THE IN-PROCESS UNREAD ASSERTIONS ARM THE EXIT RULE IN *THIS* PROCESS.
 *
 * Requiring corpus-served.js runs its module-level `failOnUnread()`, and three-way
 * keeps ONE ledger per process with a `process.on('exit')` hook that forces a
 * non-zero status whenever that ledger is non-empty -- deliberately, "enforced
 * even if that checker never calls unreadExitCode". So calling `corpusSlugs` with
 * a bad body here, which is exactly what the UNREAD tests must do, leaves entries
 * behind and the FILE exits 1 with all 20 tests passing. Measured: 20 pass, file
 * fail, no failing assertion anywhere.
 *
 * `clearUnread()` is the intended escape and exists for this. It is called once,
 * after every test, so the rule still holds for the real checker -- the
 * end-to-end UNREAD cases above assert it in a CHILD process, where the ledger is
 * the checker's own and the exit code is the thing being tested. */
test.after(() => { require('../tools/three-way.js').clearUnread(); });

/* ------------------------------------------------------------ the separator */

test('a corpus id is underscored and a card slug is hyphenated', () => {
  assert.equal(idToSlug('iron_letter'), 'iron-letter');
  assert.equal(idToSlug('what_is_pqc'), 'what-is-pqc');
  assert.equal(idToSlug('ascon'), 'ascon');
});

test('a multi-word slug resolves on BOTH sides, which is the bug that shipped first', () => {
  const cards = cardedSlugs(index(['iron-letter', 'what-is-pqc', 'ascon']));
  const demos = corpusSlugs(corpus(['iron-letter', 'what-is-pqc', 'ascon']), 'fixture');
  assert.deepEqual([...cards].sort(), ['ascon', 'iron-letter', 'what-is-pqc']);
  assert.deepEqual([...demos].sort(), ['ascon', 'iron-letter', 'what-is-pqc']);
  assert.deepEqual(compare(cards, demos), { behind: [], ahead: [] });
});

test('the card pattern reads the href, not an assembled slug', () => {
  /* The dev domain serves the catalog and per-demo subpaths 404, so the github.io
     href is the only authoritative place a slug appears. A card pointing anywhere
     else is not counted. */
  assert.equal(cardedSlugs('<a class="project-card" href="https://crypto-lab.systemslibrarian.dev/ascon/">').size, 0);
  assert.equal(cardedSlugs(card('ascon')).size, 1);
});

/* --------------------------------------------------------------- directions */

test('SERVED-BEHIND: carded on the index, missing from the corpus', () => {
  const r = compare(cardedSlugs(index(['a', 'b-two'])), corpusSlugs(corpus(['a']), 'f'));
  assert.deepEqual(r, { behind: ['b-two'], ahead: [] });
});

test('SERVED-AHEAD: in the corpus, with no card', () => {
  const r = compare(cardedSlugs(index(['a'])), corpusSlugs(corpus(['a', 'c-three']), 'f'));
  assert.deepEqual(r, { behind: [], ahead: ['c-three'] });
});

test('both directions at once, each listed separately', () => {
  const r = compare(cardedSlugs(index(['a', 'only-carded'])), corpusSlugs(corpus(['a', 'only-corpus']), 'f'));
  assert.deepEqual(r, { behind: ['only-carded'], ahead: ['only-corpus'] });
});

test('demo_snow2 is not a SERVED-AHEAD finding, by the prefix rather than a list', () => {
  /* The corpus deliberately carries one demo with no crypto-lab card. CLAUDE.md
     records its slug list as one longer than the card count for this reason. */
  const demos = corpusSlugs(corpus(['a'], [{ id: 'demo_snow2', text: 'x' }]), 'f');
  assert.deepEqual([...demos], ['a']);
  assert.deepEqual(compare(cardedSlugs(index(['a'])), demos), { behind: [], ahead: [] });
});

/* -------------------------------------------------------------- UNREAD paths */

test('UNREAD: a body that will not parse is not zero drift', () => {
  assert.equal(corpusSlugs('{ not json', 'f'), null);
});

test('UNREAD: JSON that parses but carries no record array', () => {
  assert.equal(corpusSlugs('{"hello":"world"}', 'f'), null);
});

test('UNREAD: records that parse but match no demo id — the wrong file, not a clean one', () => {
  /* Reading a DIFFERENT json file would otherwise produce "0 demos" and, against
     a reachable index, 264 false findings. It must refuse instead. */
  assert.equal(corpusSlugs(JSON.stringify([{ id: 'aes256gcm' }, { id: 'sm4' }]), 'f'), null);
});

/* ------------------------------------------------------- end to end, real CLI */

test('END TO END clean: identical served slugs exits 0', async () => {
  const s = await serve({
    '/': { body: index(['ascon', 'iron-letter']) },
    '/corpus.json': { body: corpus(['ascon', 'iron-letter']), type: 'application/json' },
  });
  try {
    const r = await run({ CORPUS_SERVED_CATALOG_URL: `${s.base}/`, CORPUS_SERVED_CORPUS_URL: `${s.base}/corpus.json` });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /SERVED-BEHIND \(0\)/);
    assert.match(r.stdout, /SERVED-AHEAD \(0\)/);
    assert.match(r.stdout, /name the same labs, in both directions/);
  } finally { await s.close(); }
});

test('END TO END behind: exits 1 and names the slug', async () => {
  const s = await serve({
    '/': { body: index(['ascon', 'iron-letter']) },
    '/corpus.json': { body: corpus(['ascon']), type: 'application/json' },
  });
  try {
    const r = await run({ CORPUS_SERVED_CATALOG_URL: `${s.base}/`, CORPUS_SERVED_CORPUS_URL: `${s.base}/corpus.json` });
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, /SERVED-BEHIND \(1\)/);
    assert.match(r.stdout, /crypto-lab-iron-letter/);
    assert.match(r.stderr, /fix the one that is behind rather than editing the other/);
  } finally { await s.close(); }
});

test('END TO END ahead: exits 1 and names the slug', async () => {
  const s = await serve({
    '/': { body: index(['ascon']) },
    '/corpus.json': { body: corpus(['ascon', 'ghost-commit']), type: 'application/json' },
  });
  try {
    const r = await run({ CORPUS_SERVED_CATALOG_URL: `${s.base}/`, CORPUS_SERVED_CORPUS_URL: `${s.base}/corpus.json` });
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, /SERVED-AHEAD \(1\)/);
    assert.match(r.stdout, /crypto-lab-ghost-commit/);
  } finally { await s.close(); }
});

test('END TO END UNREAD: a non-200 fails, and never reports zero drift', async () => {
  const s = await serve({
    '/': { body: index(['ascon']) },
    '/corpus.json': { status: 503, body: 'upstream down', type: 'text/plain' },
  });
  try {
    const r = await run({ CORPUS_SERVED_CATALOG_URL: `${s.base}/`, CORPUS_SERVED_CORPUS_URL: `${s.base}/corpus.json` });
    assert.notEqual(r.status, 0, r.stdout);
    assert.match(r.stderr, /COULD NOT LOOK/);
    assert.match(r.stderr, /HTTP 503/);
    assert.doesNotMatch(r.stdout, /SERVED-BEHIND \(0\)/,
      'an unread side must not produce a comparison at all');
  } finally { await s.close(); }
});

test('END TO END UNREAD: a connection refused fails', async () => {
  /* Port 1 on loopback refuses. A network error and a non-200 are the same
     state: the instrument could not look. */
  const r = await run({ CORPUS_SERVED_CATALOG_URL: 'http://127.0.0.1:1/', CORPUS_SERVED_CORPUS_URL: 'http://127.0.0.1:1/corpus.json' });
  assert.notEqual(r.status, 0, r.stdout);
  assert.match(r.stderr, /COULD NOT LOOK/);
});

test('END TO END UNREAD: an index that serves no cards is unread, not an empty catalog', async () => {
  const s = await serve({
    '/': { body: '<html><body>maintenance</body></html>' },
    '/corpus.json': { body: corpus(['ascon']), type: 'application/json' },
  });
  try {
    const r = await run({ CORPUS_SERVED_CATALOG_URL: `${s.base}/`, CORPUS_SERVED_CORPUS_URL: `${s.base}/corpus.json` });
    assert.notEqual(r.status, 0, r.stdout);
    assert.match(r.stderr, /COULD NOT LOOK/);
    assert.match(r.stderr, /no project-card hrefs/);
  } finally { await s.close(); }
});

/* ------------------------------------------------------------ wiring and URLs */

test('the fetch is cache-busted, so the answer is about what is served now', () => {
  const a = bust('https://example.invalid/x.json');
  assert.match(a, /[?&]cb=/);
  assert.notEqual(a, bust('https://example.invalid/x.json'), 'each call must differ');
});

test('the DEFAULT targets are the live origins, not the test overrides', () => {
  /* Without this, an override could quietly become the production target. */
  assert.equal(LIVE_CATALOG_URL, 'https://crypto-lab.systemslibrarian.dev/');
  assert.equal(LIVE_CORPUS_URL, 'https://crypto-counsel.systemslibrarian.dev/corpus.json');
  if (!process.env.CORPUS_SERVED_CATALOG_URL) assert.equal(CATALOG_URL, LIVE_CATALOG_URL);
  if (!process.env.CORPUS_SERVED_CORPUS_URL) assert.equal(CORPUS_URL, LIVE_CORPUS_URL);
});

test('it does NOT read the sibling working tree, which is the defect it closes', () => {
  const src = fs.readFileSync(TOOL, 'utf8');
  assert.ok(!/crypto-counsel[^.]*\/corpus\.json'/.test(src.replace(/\/\*[\s\S]*?\*\//g, '')),
    'no path into the sibling checkout may appear in executable code');
  assert.ok(!/CRYPTO_COUNSEL_CORPUS/.test(src), "corpus-sync's local-path env must not be honoured here");
});

test('it is in the daily CHECKERS and outside the fast loop', () => {
  const fleet = fs.readFileSync(path.join(ROOT, 'tools', 'fleet-check.js'), 'utf8');
  assert.match(fleet, /corpus-served/, 'the daily runner must name it');
  const readme = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'readme-sync.yml'), 'utf8');
  assert.ok(!/corpus-served\.js (check|$)/m.test(readme),
    'it needs the network, so it must not join the per-PR fast loop');
});
