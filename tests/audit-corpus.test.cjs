'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const gen = require(path.join(ROOT, 'scripts/build-audit-corpus.js'));
const { heroFrom, HERO, HERO_CLASS, stripComments, accentOf, claimsIn, literalKind, findFiles, readIf } = gen;

const TITLE = HERO_CLASS.name;
const resolve = (text) => heroFrom(text, TITLE, HERO.name);

/*
 * Six hero idioms, one sample each, taken from the lab that uses it. Each was a
 * real miss: a reader of any one of these was blind to the next, and each
 * blindness published "this lab has no name" about a lab whose own gate asserts
 * its name. They are asserted together so closing one cannot reopen another.
 */
const IDIOMS = [
  ['markup class (213 labs)', '<h1 class="cl-hero-title">Ascon</h1>', 'Ascon'],
  ['builder, children array (crypto-lab-context-ward)',
    "el('h1', { class: 'cl-hero-title' }, ['Context Ward']),", 'Context Ward'],
  ['builder, text property (crypto-lab-kem-trap)',
    "el('h1', { class: 'cl-hero-title', text: 'KEM Trap' }),", 'KEM Trap'],
  ['builder named h, not el (crypto-lab-sector-vault)',
    "h('h1', { class: 'cl-hero-title', text: 'Sector Vault' }),", 'Sector Vault'],
  ['builder, className and a bare string child (crypto-lab-kdf-chain)',
    "const title = el('h1', { className: 'cl-hero-title' }, 'KDF Chain');", 'KDF Chain'],
  ['imperative assignment (crypto-lab-mls-group)',
    "const h1 = document.createElement('h1');\nh1.className = 'cl-hero-title';\nh1.textContent = 'MLS Group';", 'MLS Group'],
];

for (const [name, source, expected] of IDIOMS) {
  test(`hero idiom resolves: ${name}`, () => {
    assert.equal(resolve(source), expected);
  });
}

test('every hero idiom is covered by a distinct sample', () => {
  assert.equal(new Set(IDIOMS.map((i) => i[1])).size, IDIOMS.length);
  assert.equal(new Set(IDIOMS.map((i) => i[2])).size, IDIOMS.length);
});

/*
 * The imperative rule must pair an element's class with its OWN text. Without
 * the backreference on the variable name it reads the next element's text, which
 * is how a subtitle becomes a title.
 */
test('imperative hero does not borrow a sibling element text', () => {
  const src = [
    "const h1 = document.createElement('h1');",
    "h1.className = 'cl-hero-title';",
    "const sub = document.createElement('p');",
    "sub.className = 'cl-hero-sub';",
    "sub.textContent = 'TreeKEM';",
  ].join('\n');
  assert.equal(resolve(src), null, 'an element with no text of its own has no name to report');
});

/*
 * crypto-lab-quantum-vault-kpqc carries the sentence "This lab sets
 * --accent:#003478, the Taegukgi navy, on an ..." in a CSS comment, 61 lines
 * above the real declaration. Reading the comment published an explanation as a
 * value.
 */
test('a comment describing --accent is not read as its value', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-accent-'));
  fs.writeFileSync(path.join(dir, 'page.html'), [
    '<style>',
    '/* This lab sets --accent:#003478, the Taegukgi navy, on an off-white ground. */',
    ':root{ --accent: #4de6b2; }',
    '</style>',
  ].join('\n'));
  const hit = accentOf(dir, ['page.html']);
  assert.equal(hit.value, '#4de6b2');
});

test('a prose --accent with no real declaration is MISSING, not prose', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-accent2-'));
  fs.writeFileSync(path.join(dir, 'page.html'),
    '/* the lab sets --accent:#003478, the Taegukgi navy, on an off-white ground */');
  assert.equal(accentOf(dir, ['page.html']), null);
});

test('var(--accent, fallback) is a use, never a declaration', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-accent3-'));
  fs.writeFileSync(path.join(dir, 'a.css'),
    '.cl-topbar{border-bottom:1px solid color-mix(in srgb, var(--accent, #35d6bb) 22%, transparent);}');
  assert.equal(accentOf(dir, ['a.css']), null,
    'a lab that only reads --accent declares none; 49 labs are in that state');
});

/*
 * This one discriminates comment-stripping and nothing else. The earlier two
 * accent tests passed with stripComments() REMOVED, because CSS_VALUE rejected
 * the prose anyway -- two guards for one defect, and the mutation check is what
 * exposed that neither test was watching the one I had just written. Here the
 * commented-out declaration is syntactically PERFECT, so CSS_VALUE accepts it
 * and only stripping it first gives the right answer.
 */
test('a syntactically valid --accent inside a comment is still not the value', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-accent4-'));
  fs.writeFileSync(path.join(dir, 'page.html'), [
    '<style>',
    '/* was: --accent: #003478; before the rebrand */',
    ':root{ --accent: #4de6b2; }',
    '</style>',
  ].join('\n'));
  assert.equal(accentOf(dir, ['page.html']).value, '#4de6b2');
});

test('a commented-out declaration is not a declaration at all', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-accent5-'));
  fs.writeFileSync(path.join(dir, 'page.html'), '/* --accent: #003478; */');
  assert.equal(accentOf(dir, ['page.html']), null);
});

/*
 * And this one discriminates the :root path specifically. The two tests above
 * only reach the fallback path, so removing stripComments() from the :root loop
 * left all 20 green -- the second time in this file that a guard turned out not
 * to be watching the line it was written for. Here the dead declaration sits
 * INSIDE the block and BEFORE the live one, so an unstripped read returns the
 * retired colour.
 */
test('a commented-out declaration inside :root does not win over the live one', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-accent6-'));
  fs.writeFileSync(path.join(dir, 'a.css'),
    ':root{ /* --accent: #003478; */ --accent: #4de6b2; }');
  assert.equal(accentOf(dir, ['a.css']).value, '#4de6b2');
});

test('stripComments removes HTML and CSS comments only', () => {
  assert.equal(stripComments('a<!--x-->b').trim(), 'a b'.replace('  ', ' ').trim() || 'a b');
  assert.ok(!stripComments('/* gone */ kept').includes('gone'));
  assert.ok(stripComments('/* gone */ kept').includes('kept'));
});

/*
 * MASTER-TEMPLATE 4.1b turns on one distinction: an expected value that is an
 * EXPRESSION was re-derived from the page, a LITERAL was typed by the author. An
 * auditor sorts by it, so getting it wrong is worse than not recording it.
 */
test('expected values are classified literal, expression or regex', () => {
  assert.equal(literalKind("'0 hex digits differ'"), 'literal');
  assert.equal(literalKind('20'), 'literal');
  assert.equal(literalKind('digestBefore'), 'expression');
  assert.equal(literalKind('`${bytes * 2}`'), 'expression');
  assert.equal(literalKind('(2 * wins) / trials - 1'), 'expression');
  assert.equal(literalKind('/RSA Forge.*eNFS section/'), 'regex');
});

test('claims parsing records the test name, line, matcher and expected value', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-claims-'));
  fs.mkdirSync(path.join(dir, 'e2e'));
  fs.writeFileSync(path.join(dir, 'e2e/claims.spec.ts'), [
    "test('headline recomputes from the page', async ({ page }) => {",
    "  await expect(page.locator('#sk')).toHaveText(expected)",
    "  await expect(page.locator('#n')).toContainText('290')",
    '})',
  ].join('\n'));
  const out = claimsIn(dir, 'e2e/claims.spec.ts');
  assert.equal(out.tests.length, 1);
  assert.equal(out.tests[0].test_name, 'headline recomputes from the page');
  assert.equal(out.tests[0].assertions.length, 2);
  assert.equal(out.tests[0].assertions[0].matcher, 'toHaveText');
  assert.equal(out.tests[0].assertions[0].expected_kind, 'expression');
  assert.equal(out.tests[0].assertions[1].expected_kind, 'literal');
  assert.equal(out.tests[0].assertions[1].expected_as_written, "'290'");
});

/*
 * Eight labs keep their suite under demos/<slug>/e2e/. A fixed root-relative
 * path list reported kyber-vault as having no claims suite while its suite sat
 * in the repo.
 */
test('claims suites are found below the repo root too', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-find-'));
  fs.mkdirSync(path.join(dir, 'demos/kyber-vault/e2e'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'demos/kyber-vault/e2e/claims.spec.ts'), 'test("x", () => {})');
  assert.deepEqual(findFiles(dir, /^claims\.spec\.(ts|js|mjs)$/), ['demos/kyber-vault/e2e/claims.spec.ts']);
});

test('node_modules is never searched for a lab fact', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-nm-'));
  fs.mkdirSync(path.join(dir, 'node_modules/evil/e2e'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'node_modules/evil/e2e/claims.spec.ts'), 'test("not ours", () => {})');
  assert.deepEqual(findFiles(dir, /^claims\.spec\.(ts|js|mjs)$/), []);
});

/*
 * index.html writes both `HASHING & KDFS` and `HASHING &amp; KDFS`. A browser
 * decodes the attribute, so the catalog's own filter chips see one category; a
 * raw-text reader sees two, and the first corpus run produced two shards and two
 * per_category rows from one category. Entities are decoded, so this cannot
 * split again.
 */
test('a category written as an HTML entity is one category, not two', () => {
  const jsonl = path.join(ROOT, 'corpus/labs.jsonl');
  if (!fs.existsSync(jsonl)) return;
  const cats = new Set();
  for (const line of fs.readFileSync(jsonl, 'utf8').trim().split('\n').filter(Boolean)) {
    for (const c of JSON.parse(line).category || []) cats.add(c);
  }
  for (const c of cats) {
    assert.ok(!/&(amp|lt|gt|quot|#39);/.test(c), `category "${c}" still carries an HTML entity`);
  }
  assert.ok(!(cats.has('HASHING & KDFS') && [...cats].some((c) => c.includes('amp'))));
});

/*
 * A lab whose README is CRLF put 95 lines with CR into a corpus shard. git
 * normalises those on commit, so the committed corpus could never equal a freshly
 * generated one and the refresh workflow would propose an identical diff on every
 * run. The fix belongs at the read boundary, not in a .gitattributes.
 */
/* The unit the CRLF fix lives in. The two tests below assert the OUTPUT is clean,
   which a freshly generated corpus already is -- so only this one reddens when
   the normalisation is removed. */
test('readIf normalises CRLF and lone CR to LF', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-readif-'));
  const f = path.join(dir, 'README.md');
  fs.writeFileSync(f, 'one\r\ntwo\rthree\nfour');
  const out = readIf(f);
  assert.equal(out.text, 'one\ntwo\nthree\nfour');
  assert.ok(!out.text.includes('\r'));
});

test('a CRLF source file does not put carriage returns in the corpus', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-crlf-'));
  fs.writeFileSync(path.join(dir, 'a.css'), ':root{\r\n  --accent: #4de6b2;\r\n}\r\n');
  assert.equal(accentOf(dir, ['a.css']).value, '#4de6b2',
    'a CR must not end up inside the captured value');
});

test('no committed corpus file carries a carriage return', () => {
  const dir = path.join(ROOT, 'corpus');
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir).filter((n) => /\.(md|jsonl|json)$/.test(n))) {
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    assert.ok(!text.includes('\r'), `${f} carries a CR, so git will rewrite it on commit`);
  }
});

/*
 * AN INDEX IS NOT CONTENT, and this file used to be the proof of that going
 * wrong: when the prose exceeded 4 MB, `labs-full.md` was written as a LIST OF
 * LINKS to the shards, so the file a reader opened expecting the corpus held
 * navigation. It is `index.md` now, which says what it is on its first line, and
 * `labs-full.md` exists only when it really carries the content.
 */
test('the index names itself an index and carries an assembly command when sharded', () => {
  const dir = path.join(ROOT, 'corpus');
  if (!fs.existsSync(path.join(dir, 'index.json'))) return;
  const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  const idx = fs.readFileSync(path.join(dir, 'index.md'), 'utf8');
  assert.match(idx.split('\n').slice(0, 4).join(' '), /INDEX, not the content/,
    'the first lines must say it is an index');
  const sharded = (index.shards || []).length > 0;
  if (sharded) {
    assert.match(idx, /```sh[\s\S]*cat [\s\S]*> labs-full\.md[\s\S]*```/, 'a sharded corpus must print how to assemble one file');
    assert.ok(!fs.existsSync(path.join(dir, 'labs-full.md')),
      'labs-full.md must not exist as a list of links; the shards carry the content');
    for (const s of index.shards) assert.ok(fs.existsSync(path.join(dir, s.file)), `${s.file} listed but absent`);
  } else {
    assert.ok(fs.existsSync(path.join(dir, 'labs-full.md')), 'an unsharded corpus must write labs-full.md');
  }
});

test('the prose file holds real lab content, not links to it', () => {
  const dir = path.join(ROOT, 'corpus');
  if (!fs.existsSync(path.join(dir, 'index.json'))) return;
  const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  const prose = (index.shards || []).length
    ? index.shards.map((s) => path.join(dir, s.file))
    : [path.join(dir, 'labs-full.md')];
  for (const f of prose) {
    const body = fs.readFileSync(f, 'utf8');
    assert.ok(body.length > 50_000, `${path.basename(f)} is only ${body.length} bytes`);
    assert.ok((body.match(/^- \*\*repo\*\*:/gm) || []).length >= 2,
      `${path.basename(f)} must carry lab records, not a list of links`);
    assert.ok((body.match(/^- \*\*commit_sha\*\*:/gm) || []).length >= 2,
      `${path.basename(f)} must pin a commit per lab`);
    assert.ok(/\*\*Implements\*\*|\*\*Attacks shown\*\*/.test(body), `${path.basename(f)} must carry derived claims`);
    assert.ok(/README, first section/.test(body), `${path.basename(f)} must carry README prose`);
  }
});

/* The full README text must survive the trim, in the machine-readable half. */
test('full README text lives in labs.jsonl and nowhere else', () => {
  const jsonl = path.join(ROOT, 'corpus/labs.jsonl');
  if (!fs.existsSync(jsonl)) return;
  const rows = fs.readFileSync(jsonl, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const withReadme = rows.filter((r) => r.readme && r.readme.length > 500);
  assert.ok(withReadme.length > 200, `only ${withReadme.length} labs carry full README text`);
  /* And the prose side must NOT: that duplication was 3.2 MB. */
  const dir = path.join(ROOT, 'corpus');
  const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  const proseFile = (index.shards || []).length ? index.shards[0].file : 'labs-full.md';
  const body = fs.readFileSync(path.join(dir, proseFile), 'utf8');
  const sample = withReadme.find((r) => body.includes(r.slug));
  if (sample) {
    const tail = sample.readme.slice(-400).trim();
    if (tail.length > 100) {
      assert.ok(!body.includes(tail), `${proseFile} embeds the END of ${sample.slug}'s README; only the first section belongs there`);
    }
  }
});

test('a claims assertion records where to look rather than a copy of the line', () => {
  const jsonl = path.join(ROOT, 'corpus/labs.jsonl');
  if (!fs.existsSync(jsonl)) return;
  const rows = fs.readFileSync(jsonl, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  let seen = 0;
  for (const r of rows) {
    if (!r.claims) continue;
    for (const t of r.claims.tests) {
      for (const a of t.assertions) {
        assert.ok(!('source_line' in a), `${r.slug}: an assertion still carries source_line, the largest field in the corpus`);
        assert.ok(typeof a.line === 'number', `${r.slug}: an assertion must record its line`);
        seen += 1;
      }
    }
  }
  assert.ok(seen > 1000, `only ${seen} assertions checked`);
});

/*
 * The decoder in this generator had `&amp;` FIRST -- the same js/double-escaping
 * defect the same round fixed in concept-sync.js and teach-build.js, written here
 * in that very pass and not noticed until CodeQL flagged the pull request.
 * `&amp;lt;script` became `&lt;script` and then `<script`: an author who wrote a
 * literal entity got a tag.
 */
test('the corpus decoder decodes &amp; last', () => {
  const src = fs.readFileSync(path.join(ROOT, 'scripts/build-audit-corpus.js'), 'utf8');
  const m = /function decode\(s\) \{[\s\S]*?\n\}/.exec(src);
  assert.ok(m, 'decode() is not where this test expects it');
  // eslint-disable-next-line no-eval
  const decode = eval(`(${m[0]})`);
  assert.equal(decode('a &amp;lt;script'), 'a &lt;script', 'a literal entity must survive as one');
  assert.equal(decode('<p>x &amp; y</p>'), 'x & y', 'ordinary decoding still works');
  assert.equal(decode('HASHING &amp; KDFS'), 'HASHING & KDFS');
  const buggy = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<');
  assert.notEqual(decode('a &amp;lt;script'), buggy('a &amp;lt;script'),
    'the fix must differ from the defect on exactly that input');
});

/* The corpus is only meaningful if its denominator is the registry's. */
test('if a corpus is present, it holds one record per registry card', () => {
  const jsonl = path.join(ROOT, 'corpus/labs.jsonl');
  const indexFile = path.join(ROOT, 'corpus/index.json');
  if (!fs.existsSync(jsonl) || !fs.existsSync(indexFile)) return; // not generated in this tree
  const { readCards } = require(path.join(ROOT, 'tools/card-reader.js'));
  const { cards, hrefless } = readCards(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'));
  assert.equal(hrefless.length, 0, 'a card the registry cannot resolve would be silently absent');
  const lines = fs.readFileSync(jsonl, 'utf8').trim().split('\n').filter(Boolean);
  assert.equal(lines.length, cards.length);
  const slugs = new Set(lines.map((l) => JSON.parse(l).slug));
  for (const c of cards) assert.ok(slugs.has(c.slug), `${c.slug} is carded but absent from the corpus`);
  const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  assert.equal(index.lab_count, cards.length);
  assert.equal(index.registry.cards, cards.length);
});

test('every record pins the commit it was read from', () => {
  const jsonl = path.join(ROOT, 'corpus/labs.jsonl');
  if (!fs.existsSync(jsonl)) return;
  for (const line of fs.readFileSync(jsonl, 'utf8').trim().split('\n').filter(Boolean)) {
    const r = JSON.parse(line);
    if (!r.clone_present) continue;
    assert.match(r.commit_sha, /^[0-9a-f]{40}$/, `${r.slug} has no readable commit_sha`);
  }
});

/* ------------------------------------------- local paths must not be published

   corpus/ is served from main, so a lab's committed absolute path becomes a
   published one. crypto-lab-vector-gate is the case these exist for: its
   audits/mutation-observations.json held a lane worktree path 14 times, because
   vitest prints its project root and Playwright prints absolute stack frames,
   and the first run of this generator put all 14 into corpus/labs.jsonl. */

const { LOCAL_PATH_SHAPES, localPathsIn, withoutLocalPaths, scrubLocalPaths,
  localPathFindings } = gen;

test('a path inside the checkout keeps the part that is true of every clone', () => {
  const base = '/Users/someone/repos/crypto-lab-vector-gate';
  assert.equal(withoutLocalPaths(`        at ${base}/e2e/claims.spec.ts:25:61`, [base]),
    '        at e2e/claims.spec.ts:25:61');
  assert.equal(withoutLocalPaths(`        at scan (${base}/e2e/gate.ts:28:133)`, [base]),
    '        at scan (e2e/gate.ts:28:133)');
  // the checkout root itself has a repo-relative form, and it is "."
  assert.equal(withoutLocalPaths(` RUN  v4.1.11 ${base}`, [base]), ' RUN  v4.1.11 .');
  // a Windows checkout, where the separator is also the escape character
  assert.equal(withoutLocalPaths('C:\\Users\\dev\\checkout\\src\\a.ts', ['C:\\Users\\dev\\checkout']),
    'src\\a.ts');
});

test('a home path outside the checkout is removed rather than guessed at', () => {
  const base = '/Users/someone/repos/crypto-lab-vector-gate';
  /* A different working copy of the same lab. The remainder LOOKS repo-relative
     and the generator cannot establish that it is, so it does not pretend to. */
  assert.equal(withoutLocalPaths(`        at /Users/someone/repos/crypto-lab-lane-vg/e2e/claims.spec.ts:25:61`, [base]),
    '        at <local-path>');
  assert.equal(withoutLocalPaths('cd /home/runner/work/crypto-lab/crypto-lab && npm ci', [base]),
    'cd <local-path> && npm ci');
  assert.equal(withoutLocalPaths('file:///Users/someone/Downloads/x.pdf', [base]),
    'file://<local-path>');
});

test('a URL that contains /home/ is lab content, not a local path', () => {
  /* The control that decides the shape. `/home/[^/]+` with no left boundary
     matches inside `https://example.com/home/index.html`, so the obvious pattern
     rewrites ordinary prose and link text and calls it a privacy fix. */
  const text = 'see https://example.com/home/index.html and ./home/page and /opt/home/x';
  assert.deepEqual(localPathsIn(text), []);
  assert.equal(withoutLocalPaths(text, []), text);
  // and a bare word is not a path either
  assert.deepEqual(localPathsIn('somewhere under /home or /Users'), []);
});

test('a fresh pattern is built per call, so .test() cannot answer about the last one', () => {
  /* The first version of this test asserted that the shapes are stored as
     strings and then called localPathsIn twice. It could not fail: localPathsIn
     uses String.prototype.match with a /g regex, which resets lastIndex, so
     turning the shapes back into one shared RegExp passed all 39 tests. A test
     that cannot discriminate does not stay in the suite -- so this asserts the
     property that actually protects a future caller, which is that every call
     gets its own object with lastIndex at 0. `.test()` and `.exec()` on a shared
     /g regex answer about where the previous call stopped. */
  const { localPathRe } = gen;
  assert.notStrictEqual(localPathRe(), localPathRe(), 'one shared regex would carry lastIndex');
  const re = localPathRe();
  assert.equal(re.test('/Users/a/b'), true);
  assert.equal(re.lastIndex > 0, true, 'a /g regex advances after .test()');
  assert.equal(localPathRe().lastIndex, 0, 'the next caller must start from the beginning');
  // and the shapes stay sources, which is what makes that possible
  for (const shape of gen.LOCAL_PATH_SHAPES) assert.equal(typeof shape, 'string');
});

test('scrubbing reaches a string at any depth in a record', () => {
  const base = '/Users/someone/repos/crypto-lab-x';
  const rec = scrubLocalPaths({
    slug: 'crypto-lab-x',
    mutations: [{ file: 'tools/m.mjs', output: `at ${base}/e2e/a.spec.ts:3:1` }],
    limitations: { readme_sections: [{ text: 'built in /Users/someone/scratch' }] },
    claims: null,
    count: 7,
  }, [base]);
  assert.equal(rec.mutations[0].output, 'at e2e/a.spec.ts:3:1');
  assert.equal(rec.limitations.readme_sections[0].text, 'built in <local-path>');
  assert.equal(rec.claims, null);
  assert.equal(rec.count, 7);
});

test('a surviving local path is traced to its lab and field', () => {
  const found = localPathFindings([
    { slug: 'crypto-lab-a', mutations: [{ output: 'clean' }] },
    { slug: 'crypto-lab-b', limitations: { page_panels: ['/Users/n/p/q'] } },
  ]);
  assert.deepEqual(found, [
    { slug: 'crypto-lab-b', field: 'limitations.page_panels[0]', path: '/Users/n/p/q' },
  ]);
});

test('no published corpus document carries a local path', () => {
  /* The committed corpus, not one built here. This is the test that reddens if a
     bad corpus is committed, whatever the generator does; the generator refuses
     to write one, which is the other half. */
  const dir = path.join(ROOT, 'corpus');
  if (!fs.existsSync(dir)) return;
  const published = fs.readdirSync(dir)
    .filter((f) => f === 'labs.jsonl' || /^labs-full.*\.md$/.test(f));
  assert.ok(published.length, 'corpus/ holds no published document to check');
  for (const f of published) {
    const hits = localPathsIn(fs.readFileSync(path.join(dir, f), 'utf8'));
    assert.deepEqual([...new Set(hits)], [], `${f} publishes a local path`);
  }
});

test('the refusal fires on a poisoned document, and names the file', () => {
  /* A refusal that has only ever run over clean input is a refusal nobody has
     seen fire. The input here is the real shape main() assembles. */
  const { publishedLeaks } = gen;
  const leaked = publishedLeaks([
    { file: 'labs.jsonl', text: '{"slug":"a","output":"at /Users/n/repos/x/e2e/a.spec.ts:1:1"}\n' },
    { file: 'labs-full.md', text: '# clean\n\nsee https://example.com/home/i.html\n' },
  ]);
  assert.deepEqual(leaked.map((d) => d.file), ['labs.jsonl']);
  assert.deepEqual(leaked[0].hits, ['/Users/n/repos/x/e2e/a.spec.ts:1:1']);
  assert.deepEqual(publishedLeaks([{ file: 'labs.jsonl', text: 'nothing here\n' }]), []);
});

test('buildLab returns its record through the scrub', () => {
  /* A source assertion, and the property is stated as "no return hands back an
     unscrubbed record" rather than as a pattern over every return line -- the
     first draft matched the inner `anchored` helper's own return and failed on
     code that was correct. buildLab reads a checkout resolved from the fleet
     root and cannot be pointed at a fixture, so this is the available way to
     bind the normalisation to the one place it has to run. Without it, deleting
     the call leaves every test above passing. */
  const src = fs.readFileSync(path.join(ROOT, 'scripts/build-audit-corpus.js'), 'utf8');
  const body = src.slice(src.indexOf('function buildLab('), src.indexOf('\nfunction labMarkdown('));
  assert.equal(body.split('return scrubLocalPaths(rec, bases);').length - 1, 2,
    'buildLab must scrub on both its early return and its final one');
  assert.ok(!/\breturn rec;/.test(body), 'a buildLab return hands back an unscrubbed record');
});
