'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { validateExhibitManifest, verifyLocalSources } = require('../tools/catalog-exhibits.js');

const slug = 'crypto-lab-sample';
const commit = 'a'.repeat(40);
const example = () => ({
  schemaVersion: 1,
  labs: {
    [slug]: {
      commit,
      reviewed: '2026-10-22',
      reviewScope: 'selected',
      exhibits: [{
        id: 'sign-message', title: 'Sign a message', section: 'Seal a Document',
        kind: 'interactive', execution: 'real-crypto',
        action: 'Enter a message and press Sign.', outcome: 'The signature verifies.',
        concepts: ['digital signatures'], evidence: ['src/main.ts:1'],
        limits: 'Teaching inputs are not production key storage.',
      }],
    },
  },
});

test('source-reviewed exhibit schema rejects claims that would look stronger than their evidence', () => {
  assert.deepEqual(validateExhibitManifest(example(), [slug]), []);
  const data = example();
  data.labs[slug].exhibits[0].evidence.push('src/main.ts:1');
  data.labs[slug].exhibits[0].execution = 'secure';
  data.labs[slug].exhibits.push({ ...data.labs[slug].exhibits[0] });
  data.labs['crypto-lab-cardless'] = { ...data.labs[slug], commit: 'short' };
  data.labs[slug].reviewScope = 'unknown';
  const errors = validateExhibitManifest(data, [slug]).join('\n');
  assert.match(errors, /duplicate source anchor/);
  assert.match(errors, /unknown execution status/);
  assert.match(errors, /duplicate exhibit id/);
  assert.match(errors, /has no matching card/);
  assert.match(errors, /full lowercase 40-character SHA/);
  assert.match(errors, /reviewScope must be selected or complete/);
});

test('source review pin and exact line are checked against committed local source', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-exhibits-'));
  const repo = path.join(temp, slug);
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim();
  try {
    fs.mkdirSync(path.join(repo, 'src'), { recursive: true });
    git('init', '-q');
    git('config', 'user.name', 'Catalog Test');
    git('config', 'user.email', 'catalog@example.invalid');
    fs.writeFileSync(path.join(repo, 'src/main.ts'), 'const realControl = true;\n');
    git('add', '.');
    git('commit', '-qm', 'pin source');
    const data = example();
    data.labs[slug].commit = git('rev-parse', 'HEAD');
    assert.deepEqual(verifyLocalSources(data, temp), { checked: 1, missing: [], errors: [] });
    data.labs[slug].exhibits[0].evidence = ['src/main.ts:2'];
    assert.match(verifyLocalSources(data, temp).errors.join('\n'), /absent\/blank/);
    data.labs[slug].exhibits[0].evidence = ['src/main.ts:1'];
    fs.writeFileSync(path.join(repo, 'src/main.ts'), 'const realControl = false;\n');
    git('commit', '-qam', 'new state');
    assert.match(verifyLocalSources(data, temp).errors.join('\n'), /older\/different than local HEAD/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('generated catalog makes unmapped labs explicit, with scoped reviewed entries', () => {
  const catalog = fs.readFileSync(path.join(__dirname, '..', 'CATALOG.md'), 'utf8');
  const manifest = require('../tools/catalog-exhibits.json');
  const markers = [...catalog.matchAll(/^- \*\*Exhibit map:\*\* /gm)];
  const labCount = Number(/^([0-9]+) labs\. Implementation findings/m.exec(catalog)[1]);
  assert.equal(markers.length, labCount);
  assert.equal((catalog.match(/^- \*\*Exhibit map:\*\* NOT REVIEWED/gm) || []).length,
    labCount - Object.keys(manifest.labs).length);
  assert.match(catalog, /\*\*Learner action:\*\*/);
  assert.match(catalog, /\*\*Observed result:\*\*/);
  assert.match(catalog, /\*\*Concepts taught:\*\*/);
  assert.match(catalog, /\*\*Limits:\*\*/);
  const partialCount = Object.values(manifest.labs).filter((review) => review.reviewScope === 'selected').length;
  if (partialCount) assert.match(catalog, /\*\*Exhibit map:\*\* PARTIALLY REVIEWED/);
  else assert.doesNotMatch(catalog, /\*\*Exhibit map:\*\* PARTIALLY REVIEWED/);
  assert.equal((catalog.match(/^- \*\*Exhibit map:\*\* COMPLETE SOURCE REVIEW/gm) || []).length,
    Object.keys(manifest.labs).length - partialCount);
  const guide = catalog.split('## Find a concept in an exhibit\n')[1].split('## Reverse index')[0];
  const mapped = Object.values(manifest.labs).reduce((n, review) => n + review.exhibits.length, 0);
  assert.ok(guide.includes(`**${mapped} sections in ${Object.keys(manifest.labs).length} of ${labCount} labs**`));
  assert.ok(guide.includes('Search this document for a concept'));
  for (const [lab, review] of Object.entries(manifest.labs)) {
    const details = catalog.split(`\n[\`${lab}\`](https://systemslibrarian.github.io/${lab}/)`)[1].split('\n### ')[0];
    const ids = [...details.matchAll(/^  - \*\*[^*]+\*\* \(\`([^`]+)\`; (?:interactive|comparison|explanation);/gm)].map((match) => match[1]);
    assert.deepEqual(ids, review.exhibits.map((exhibit) => exhibit.id).sort(), `${lab}: exhibit order`);
    for (const exhibit of review.exhibits) {
      assert.ok(details.includes(`**Evidence at pinned commit:** \`${exhibit.evidence[0]}\``), `${lab}/${exhibit.id}: compact source path`);
    }
  }
});
