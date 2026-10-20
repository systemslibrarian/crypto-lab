'use strict';
/*
 * The WRITE half of #125.
 *
 * `level-sync` and `lab-dates` read cards through `card-reader.js` and, until
 * 2026-10-20, each kept its own `CARD_HEAD` regex for WHERE to write. That regex
 * bounded the opening tag with `([^>]*)`, which stops at the first `>` — including a
 * `>` inside a quoted attribute value. A review note reading `a > b` therefore ended
 * the tag early: the writer stripped `data-level` only from the truncated part, then
 * re-inserted it, and the card came out carrying TWO.
 *
 * Both writers now rewrite the tag the shared reader bounded. These are the tests that
 * tell the fix from the bug, because the real catalog cannot: its 232 cards contain no
 * `>` in an attribute value, so the output is byte-identical either way.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

/** One card whose opening tag carries a `>` inside a quoted attribute value. */
function page(extra = '') {
  return [
    '<div class="project-grid">',
    '          <a class="project-card" data-category="HASHING & KDFS"'
      + ' href="https://systemslibrarian.github.io/crypto-lab-sample/"'
      + ` data-review-note="prefers a > b for the digest"${extra}`
      + ' target="_blank" rel="noopener">',
    '            <div class="project-title">Sample</div>',
    '          </a>',
    '</div>',
  ].join('\n');
}

/** Call a tool's stamp() against an in-memory page, without touching index.html. */
function stamp(tool, html, labs) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'card-stamp-'));
  const script = path.join(dir, 'run.cjs');
  fs.writeFileSync(script, `
    const fs = require('node:fs');
    const mod = require(${JSON.stringify(path.join(ROOT, 'tools', tool))});
    process.stdout.write(mod.stamp(JSON.parse(fs.readFileSync(${JSON.stringify(path.join(dir, 'in.json'))}, 'utf8')).html,
      JSON.parse(fs.readFileSync(${JSON.stringify(path.join(dir, 'in.json'))}, 'utf8')).labs));
  `);
  fs.writeFileSync(path.join(dir, 'in.json'), JSON.stringify({ html, labs }));
  try {
    return execFileSync('node', [script], { encoding: 'utf8', cwd: ROOT });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('level-sync writes exactly one data-level when an attribute value contains ">"', () => {
  const out = stamp('level-sync.js', page(), { 'crypto-lab-sample': { level: 'advanced' } });
  const count = (out.match(/data-level="/g) || []).length;
  assert.equal(count, 1, `expected one data-level, got ${count}:\n${out}`);
  assert.match(out, /href="[^"]*crypto-lab-sample\/" data-level="advanced"/,
    'the attribute must sit immediately after the href');
  assert.match(out, /data-review-note="prefers a > b for the digest"/,
    'the review note must survive untouched');
});

test('level-sync replaces rather than duplicates an existing data-level past the ">"', () => {
  /* The failing shape exactly: a data-level already present AFTER the `>` in the note,
     which the old writer could not see and therefore left in place. */
  const before = page(' data-level="beginner"');
  const out = stamp('level-sync.js', before, { 'crypto-lab-sample': { level: 'advanced' } });
  assert.equal((out.match(/data-level="/g) || []).length, 1);
  assert.match(out, /data-level="advanced"/);
  assert.doesNotMatch(out, /data-level="beginner"/);
});

test('level-sync is idempotent on a tag containing ">"', () => {
  const labs = { 'crypto-lab-sample': { level: 'advanced' } };
  const once = stamp('level-sync.js', page(), labs);
  const twice = stamp('level-sync.js', once, labs);
  assert.equal(twice, once);
});

test('lab-dates writes one data-added and one data-updated past a ">"', () => {
  const out = stamp('lab-dates.js', page(),
    { 'crypto-lab-sample': { added: '2026-03', updated: '2026-10' } });
  assert.equal((out.match(/data-added="/g) || []).length, 1);
  assert.equal((out.match(/data-updated="/g) || []).length, 1);
  assert.match(out, /href="[^"]*crypto-lab-sample\/" data-added="2026-03" data-updated="2026-10"/);
  assert.match(out, /data-review-note="prefers a > b for the digest"/);
});

test('a null date REMOVES an attribute a previous run left, even past a ">"', () => {
  const before = page(' data-added="2026-03" data-updated="2026-10"');
  const out = stamp('lab-dates.js', before, { 'crypto-lab-sample': { added: '2026-03' } });
  assert.match(out, /data-added="2026-03"/);
  assert.doesNotMatch(out, /data-updated=/,
    'a date that can no longer be derived must not outlive the fact it came from');
});

test('a card with no href is left byte-identical rather than guessed at', () => {
  /* card-reader reports these as CARD-HREFLESS and the callers exit non-zero. The
     writer must not invent a position for them. */
  const html = '<a class="project-card" data-category="X" data-review-note="a > b">'
    + '<div class="project-title">No href</div></a>';
  assert.equal(stamp('level-sync.js', html, {}), html);
});
