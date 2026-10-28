'use strict';
/*
 * The four declared mechanisms that let the chip rule clear a chip naming an algorithm
 * the scanner did not anchor, and the lexer fix that feeds the comment-only exemption.
 *
 * Every case is asserted BOTH WAYS. A relation that fired on everything would clear
 * every overclaim in the catalog and read as a smaller number rather than as a broken
 * rule, which is the failure these tables exist to avoid: the disposition in
 * audits/CHIP-DISPOSITION-2026-10-20.md was written because judging chips in isolation
 * accused five honest cards, and the remedy must not over-correct into accusing none.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  ENTAILS, entailedBy, QUALIFYING_SIBLINGS, qualifiedBySibling,
  EXECUTED_STACK, executedStack, lessSpecific, satisfiedByGranularity,
  evaluateChipRule,
} = require('../tools/catalog-sync.js');
const { lex, evidenceFor } = require('../tools/catalog-evidence.js');
const { forget } = require('../tools/clone-source.js');
const { ALGORITHMS } = require('../tools/catalog-vocab.js');

const term = (name) => ({ name });
const terms = (...names) => names.map((name) => {
  const found = ALGORITHMS.find((t) => t.name === name);
  assert.ok(found, `fixture needs a vocabulary term named ${name}`);
  return found;
});
const card = (overrides = {}) => ({
  slug: 'crypto-lab-fixture',
  title: 'Fixture',
  kicker: '',
  copy: '',
  chips: [],
  implements: [],
  notScanned: false,
  unscanned: [],
  commentOnly: [],
  protocolPartial: [],
  ...overrides,
});

test('every ENTAILS entry fires on its entailing algorithm and not without it', () => {
  assert.ok(ENTAILS.length > 0, 'the table must not be empty');
  for (const rule of ENTAILS) {
    for (const from of rule.from) {
      const hit = entailedBy(rule.chip, term(rule.chip), new Set([from]));
      assert.ok(hit, `${rule.chip} should be entailed by an implemented ${from}`);
      assert.equal(hit.from, from);
    }
    /* The control. A lab implementing something unrelated entails nothing, which is
       what keeps this from being a blanket exemption for the chip's name. */
    assert.equal(
      entailedBy(rule.chip, term(rule.chip), new Set(['SHA-256'])), null,
      `${rule.chip} must NOT be entailed by an unrelated implementation`,
    );
    assert.equal(
      entailedBy(rule.chip, term(rule.chip), new Set()), null,
      `${rule.chip} must NOT be entailed by a lab credited with nothing`,
    );
    assert.ok(rule.why && rule.why.length > 40, `${rule.chip} must record WHY`);
  }
});

test('every ENTAILS entry reaches the production classifier in both directions', () => {
  for (const rule of ENTAILS) {
    const algorithm = terms(rule.chip);
    const fixture = card({
      slug: `crypto-lab-${rule.chip.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      chips: [rule.chip],
      implements: [{ name: rule.from[0] }],
    });
    const positive = evaluateChipRule([fixture], algorithm);
    assert.deepEqual(positive.clearedByRelation.map((x) => x.kind), ['entailed'],
      `${rule.chip} must reach the production entailment branch`);
    const negative = evaluateChipRule([{ ...fixture, implements: [] }], algorithm);
    assert.deepEqual(negative.violations.map((x) => x.algorithm), [rule.chip],
      `${rule.chip} must fail when its entailing implementation is removed`);
  }
});

test('entailment is keyed on an implementation, so discussing is not implementing', () => {
  /* The implement/discuss boundary, which is the whole point of keying on
     data-implements: a lab that merely mentions CKKS is credited with nothing and
     therefore entails nothing. */
  assert.ok(entailedBy('RLWE', term('Ring-LWE'), new Set(['CKKS'])));
  assert.equal(entailedBy('RLWE', term('Ring-LWE'), new Set(['Paillier'])), null);
});

test('an algorithm with no ENTAILS entry is never entailed', () => {
  assert.equal(entailedBy('AES', term('AES'), new Set(['AES-GCM', 'CKKS', 'HQC'])), null);
});

test('a sibling chip qualifies only the declared pair', () => {
  assert.ok(QUALIFYING_SIBLINGS.length > 0);
  for (const rule of QUALIFYING_SIBLINGS) {
    const chips = ['CSIDH', 'Castryck-Decru', 'SQIsign'];
    assert.ok(qualifiedBySibling(term(rule.chip), chips), `${rule.chip} should be qualified`);
    /* Controls: the wrong neighbour does not qualify, and -- the maintainer's decision
       of 2026-10-21 -- `Comparison` is explicitly NOT a blanket exemption. */
    assert.equal(qualifiedBySibling(term(rule.chip), ['CSIDH', 'SQIsign']), null);
    assert.equal(qualifiedBySibling(term(rule.chip), ['Comparison']), null,
      '"Comparison" must not qualify anything');
    assert.ok(rule.why && rule.why.length > 40);
  }
  assert.equal(qualifiedBySibling(term('STARK'), ['Comparison', 'zk-SNARK']), null,
    'zk-arena is marked on its own chip, not by its Comparison sibling');
});

test('the executed stack needs a declared call site, not a dependency listing', () => {
  for (const e of EXECUTED_STACK) {
    assert.ok(executedStack(e.slug, term(e.chip)), `${e.slug}/${e.chip} should resolve`);
    assert.match(e.at, /^src\/.+:\d+$/, 'the call site must be a file:line in the lab');
    assert.ok(e.pkg, 'the package must be named');
    assert.ok(e.why && e.why.length > 40);
    /* Controls: it is scoped to one lab and one chip, so it cannot leak. */
    assert.equal(executedStack('crypto-lab-somewhere-else', term(e.chip)), null);
    assert.equal(executedStack(e.slug, term('Kuznyechik')), null);
  }
});

test('granularity only ever makes a chip LESS specific', () => {
  /* The real case: ablation-wire chips AES-256-GCM and is credited with AES-GCM. */
  const hit = satisfiedByGranularity('AES-256-GCM', new Set(['AES-GCM']));
  assert.ok(hit);
  assert.equal(hit.from, 'AES-GCM');
  /* Controls. A key size is the only thing removed, so AES-GCM can never be reduced to
     AES -- otherwise every AEAD chip would be satisfied by a bare block cipher. */
  assert.equal(lessSpecific('AES-GCM'), 'AES-GCM');
  assert.equal(satisfiedByGranularity('AES-GCM', new Set(['AES'])), null);
  assert.equal(satisfiedByGranularity('AES-256-GCM', new Set(['ChaCha20'])), null);
  assert.equal(satisfiedByGranularity('ML-KEM-768', new Set()), null);
});

test('the production classifier reaches all four declared mechanisms', () => {
  const fixtures = [
    card({
      slug: 'crypto-lab-entailment-fixture',
      chips: ['RLWE'],
      implements: [{ name: 'CKKS' }],
      /* Positive evidence wins over this weaker cannot-judge evidence. */
      commentOnly: [{ name: 'Ring-LWE', at: 'src/main.ts:1' }],
    }),
    card({
      slug: 'crypto-lab-sibling-fixture',
      chips: ['SIDH', 'Castryck-Decru'],
      implements: [{ name: 'CSIDH' }],
    }),
    card({
      slug: 'crypto-lab-bcrypt-forge',
      chips: ['Blowfish'],
    }),
    card({
      slug: 'crypto-lab-granularity-fixture',
      chips: ['AES-256-GCM'],
      implements: [{ name: 'AES-GCM' }],
    }),
  ];
  const algorithms = terms('Ring-LWE', 'SIKE', 'Blowfish', 'AES');
  const result = evaluateChipRule(fixtures, algorithms);
  assert.deepEqual(result.clearedByRelation.map((x) => x.kind),
    ['entailed', 'sibling', 'executed', 'granularity']);
  assert.equal(result.cannotJudge.length, 0,
    'the entailment must run before the weaker comment-only exemption');
  assert.equal(result.violations.length, 0);

  const mutations = [
    { index: 0, change: { implements: [{ name: 'Paillier' }], commentOnly: [] }, expected: 'Ring-LWE' },
    { index: 1, change: { chips: ['SIDH', 'Comparison'] }, expected: 'SIKE' },
    { index: 2, change: { slug: 'crypto-lab-dependency-only' }, expected: 'Blowfish' },
    { index: 3, change: { implements: [{ name: 'ChaCha20' }] }, expected: 'AES' },
  ];
  for (const mutation of mutations) {
    const changed = fixtures.map((x, i) => i === mutation.index ? { ...x, ...mutation.change } : x);
    const out = evaluateChipRule(changed, algorithms);
    assert.ok(out.violations.some((x) => x.algorithm === mutation.expected),
      `removing the declared ${result.clearedByRelation[mutation.index].kind} evidence must expose a violation`);
  }
});

test('the production classifier keeps qualifier, prose and uncertainty boundaries separate', () => {
  const algorithms = terms('AES');
  const qualifiers = ['estimates', 'compared', 'surveyed', 'explained', 'context'];
  const result = evaluateChipRule([
    card({ slug: 'crypto-lab-bare', chips: ['AES', 'Comparison'] }),
    ...qualifiers.map((word) => card({ slug: `crypto-lab-marked-${word}`, chips: [`AES ${word}`] })),
    card({ slug: 'crypto-lab-prose', copy: 'Compare this design against AES.' }),
    card({ slug: 'crypto-lab-unread', chips: ['AES'], unscanned: ['Rust:1'] }),
    card({ slug: 'crypto-lab-comment', chips: ['AES'], commentOnly: [{ name: 'AES', at: 'src/main.ts:1' }] }),
    card({ slug: 'crypto-lab-partial', chips: ['AES'], protocolPartial: [{ name: 'AES', at: 'src/main.ts:2' }] }),
    card({ slug: 'crypto-lab-not-scanned', chips: ['AES'], notScanned: true }),
  ], algorithms);

  assert.deepEqual(result.violations.map((x) => x.slug), ['crypto-lab-bare'],
    'a marker in a sibling chip must not qualify a bare algorithm chip');
  assert.deepEqual(result.clearedByProse.map((x) => x.slug),
    [...qualifiers.map((word) => `crypto-lab-marked-${word}`), 'crypto-lab-prose']);
  assert.deepEqual(result.cannotJudge.map((x) => x.slug),
    ['crypto-lab-unread', 'crypto-lab-comment', 'crypto-lab-partial']);
  assert.ok(!Object.values(result).flat().some((x) => x.slug === 'crypto-lab-not-scanned'),
    'a source the scanner never read must not become either a pass or an accusation');
});

test('lex puts a standalone BLOCK comment in the inert view (the contract the fix rests on)', () => {
  /* The lexer contract is still worth pinning separately from the full scanner:
     a standalone comment must survive in inert while disappearing from strings. */
  const src = [
    '/**',
    " * The RSA accumulator itself — Benaloh-de Mare (1993).",
    ' */',
    'export function add(x) { return x; }',
  ].join('\n');
  const out = lex(src);
  assert.match(out.inert, /RSA accumulator/, 'a block comment body must be in the inert view');
  const inertLines = out.inert.split('\n');
  assert.ok(inertLines[1].trim(), 'the comment line must be non-blank in the inert view');
  assert.equal(out.strings.split('\n')[1].trim(), '',
    'and blank in the strings view — which is exactly why the former early-exit skipped it');
});

test('the complete scanner records a standalone comment without treating a UI string as one', (t) => {
  /* This is the end-to-end control the original fix lacked. The explicit fixture
     directory keeps it out of sibling-repository discovery, so running the test
     cannot change any fleet denominator. */
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-comment-fixture-'));
  t.after(() => {
    forget(dir);
    fs.rmSync(dir, { recursive: true, force: true });
  });
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src', 'main.ts'), [
    '/**',
    ' * P-256 group arithmetic lives here.',
    ' */',
    'export function addPoints(a: bigint, b: bigint) { return a + b; }',
    'export const label = "RSA explained";',
  ].join('\n'));
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['add', 'src/main.ts'], { cwd: dir });
  execFileSync('git', [
    '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
    'commit', '-qm', 'fixture',
  ], { cwd: dir });

  // main's signature is evidenceFor(slug, atCommit, dirOverride): the third
  // argument is the fixture checkout this control needs, and the second stays
  // null so the derivation reads the fixture's working tree.
  const out = evidenceFor('crypto-lab-comment-fixture', null, dir);
  assert.deepEqual(out.commentOnly.filter((x) => x.name === 'P-256'),
    [{ name: 'P-256', at: 'src/main.ts:2' }],
    'the production per-line loop must see a name on a standalone block-comment line');
  assert.ok(!out.commentOnly.some((x) => x.name === 'RSA'),
    'a UI string must not cross the comment-only boundary');
  assert.ok(out.references.includes('RSA'),
    'the control string must still be observed as prose/reference evidence');

  const classify = (slug, chip) => card({
    slug,
    chips: [chip],
    implements: out.implements,
    notScanned: out.notScanned,
    unscanned: out.unscanned,
    commentOnly: out.commentOnly,
    protocolPartial: out.protocolPartial,
  });
  const result = evaluateChipRule([
    classify('crypto-lab-comment-chip', 'P-256'),
    classify('crypto-lab-string-chip', 'RSA'),
  ], terms('P-256', 'RSA'));
  assert.deepEqual(result.cannotJudge.map((x) => x.slug), ['crypto-lab-comment-chip'],
    'a standalone source comment must reach the production cannot-judge branch');
  assert.deepEqual(result.violations.map((x) => x.slug), ['crypto-lab-string-chip'],
    'a UI string must remain discussion evidence and cannot exempt a bare chip');
});

test('a UI STRING still does NOT reach the comment-only view', () => {
  /* The load-bearing boundary. Including string contents was measured once and took the
     chip rule from 28 violations to 1, because these labs build their interfaces out of
     template literals full of algorithm names. A name in a string is a lab TALKING
     about an algorithm; a name in a comment is code ANNOTATED with it. */
  const src = 'const label = "RSA accumulator explained"; const t = `uses Streebog here`;';
  const out = lex(src);
  assert.doesNotMatch(out.inert, /RSA/, 'a double-quoted string must not exempt');
  assert.doesNotMatch(out.inert, /Streebog/, 'a template literal must not exempt');
  assert.match(out.strings, /RSA accumulator explained/, 'but it is still visible as a string');
});

test('a trailing // comment keeps working, which is the case that always did', () => {
  const out = lex('classical: Uint8Array; // X25519-style shared secret');
  assert.match(out.inert, /X25519/);
});
