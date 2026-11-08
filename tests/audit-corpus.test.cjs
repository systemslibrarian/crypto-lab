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
