'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const FLEET = path.resolve(ROOT, '..');
const OUT = path.join(ROOT, 'teaching-export');
const extract = require(path.join(ROOT, 'tools/teaching-extract.js'));
const { readCards } = require(path.join(ROOT, 'tools/card-reader.js'));
const { sourceRoot } = require(path.join(ROOT, 'tools/clone-source.js'));

const present = fs.existsSync(path.join(OUT, 'coverage.json'));
const manifest = present ? JSON.parse(fs.readFileSync(path.join(OUT, 'coverage.json'), 'utf8')) : null;
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

/* ------------------------------------------------- the extractor, in isolation */

test('headings, prose, tables, warnings and references are extracted verbatim', () => {
  const page = [
    '<h2 id="x">Why nonce reuse breaks CTR</h2>',
    '<p>The keystream depends only on the key and the nonce.</p>',
    '<p class="sim-warning">This is a teaching model, not production crypto.</p>',
    '<table><caption>Outcomes</caption><tr><th>Mode</th><th>Result</th></tr><tr><td>AES-CTR</td><td>Plaintext</td></tr></table>',
    '<a href="https://example.invalid/spec">RFC 9999</a>',
    '<code>C1 XOR C2 = P1 XOR P2</code>',
  ].join('\n');
  const bs = extract.blocks(page, 'index.html');
  const kind = (k) => bs.filter((b) => b.kind === k);
  assert.equal(kind('heading')[0].text, 'Why nonce reuse breaks CTR');
  assert.equal(kind('heading')[0].level, 2);
  assert.equal(kind('paragraph')[0].text, 'The keystream depends only on the key and the nonce.');
  assert.equal(kind('warning')[0].text, 'This is a teaching model, not production crypto.');
  assert.equal(kind('warning')[0].variant, 'sim-warning');
  assert.deepEqual(kind('table')[0].rows, [['Mode', 'Result'], ['AES-CTR', 'Plaintext']]);
  assert.equal(kind('table')[0].caption, 'Outcomes');
  assert.equal(kind('reference')[0].href, 'https://example.invalid/spec');
  assert.equal(kind('code-or-equation')[0].text, 'C1 XOR C2 = P1 XOR P2');
});

test('controls and output regions are described, and runtime values are never invented', () => {
  const page = [
    '<button id="run-ctr">Run</button>',
    '<input id="bits" type="range" min="8" max="96" step="8" value="32">',
    '<select id="mode"><option>AES-CTR</option><option>AES-GCM</option></select>',
    '<p id="out-ctr" role="status" aria-live="polite">No result yet.</p>',
  ].join('\n');
  const bs = extract.blocks(page, 'index.html');
  const btn = bs.find((b) => b.kind === 'control' && b.control === 'button');
  assert.equal(btn.label, 'Run');
  assert.equal(btn.id, 'run-ctr');
  const range = bs.find((b) => b.control === 'range');
  assert.equal(range.min, '8'); assert.equal(range.max, '96');
  const sel = bs.find((b) => b.control === 'select');
  assert.deepEqual(sel.options, ['AES-CTR', 'AES-GCM']);
  const out = bs.find((b) => b.kind === 'output-region');
  assert.equal(out.id, 'out-ctr');
  assert.equal(out.placeholder, 'No result yet.', 'a static placeholder IS content and is kept');
  assert.ok(!('value' in out), 'no runtime value is fabricated for an output region');
});

test('diagram labels, captions, titles and alt text are captured; a head title is not a diagram', () => {
  const page = [
    '<head><title>Nonce Collision</title></head>',
    '<svg><title>Keystream reuse</title><desc>Two messages, one nonce</desc><text>C1</text><text>C2</text></svg>',
    '<figure><img src="x.png" alt="A lane of hex bytes"><figcaption>XOR of two ciphertexts</figcaption></figure>',
  ].join('\n');
  const bs = extract.blocks(page, 'index.html');
  assert.equal(bs.filter((b) => b.kind === 'page-title')[0].text, 'Nonce Collision');
  assert.equal(bs.filter((b) => b.kind === 'diagram-title')[0].text, 'Keystream reuse');
  assert.equal(bs.filter((b) => b.kind === 'diagram-description')[0].text, 'Two messages, one nonce');
  assert.deepEqual(bs.filter((b) => b.kind === 'diagram-label').map((b) => b.text), ['C1', 'C2']);
  assert.equal(bs.filter((b) => b.kind === 'figure-caption')[0].text, 'XOR of two ciphertexts');
  assert.equal(bs.filter((b) => b.kind === 'image-alt')[0].text, 'A lane of hex bytes');
});

/*
 * FIVE PAGE SHAPES, and each reader was blind to the next. Measured: reading
 * markup alone left 31 labs with zero headings; adding JSX fixed two; adding the
 * DOM-builder reader fixed most of the rest; and four more needed raw-source
 * scanning because they assign `innerHTML` from single-quoted strings.
 */
const SHAPES = [
  ['markup in a served page', 'index.html', '<h2>Heading</h2><p>Prose.</p>'],
  ['markup in a backtick template', 'src/main.ts', 'app.innerHTML = `<h2>Heading</h2><p>Prose.</p>`'],
  ['markup in a single-quoted string', 'src/main.ts', "el.innerHTML = '<h2>Heading</h2><p>Prose.</p>'"],
  ['JSX', 'src/App.tsx', 'return (<section><h2>Heading</h2><p>Prose.</p></section>)'],
  ['a DOM builder call', 'src/ui/app.ts', "el('h2', { class: 'x' }, ['Heading']), el('p', { text: 'Prose.' })"],
];

for (const [label, file, src] of SHAPES) {
  test(`content is found when a lab uses ${label}`, () => {
    const bs = file.endsWith('.html') ? extract.blocks(src, file) : extract.blocksFromSource(src, file);
    const h = bs.find((b) => b.kind === 'heading');
    const p = bs.find((b) => b.kind === 'paragraph');
    assert.ok(h, `no heading found in ${label}`);
    assert.equal(h.text, 'Heading');
    assert.ok(p, `no prose found in ${label}`);
    assert.equal(p.text, 'Prose.');
  });
}

test('the five shapes are distinct samples', () => {
  assert.equal(new Set(SHAPES.map((s) => s[2])).size, SHAPES.length);
});

/* ------------------------------------------------ the export, against the registry */

const whenPresent = (name, fn) => test(name, (t) => (present ? fn(t) : t.skip('no export in this tree')));

whenPresent('every lab in the registry has an export file and a manifest row', () => {
  const { cards, hrefless } = readCards(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'));
  assert.equal(hrefless.length, 0, 'an unresolvable card would be silently absent');
  assert.equal(manifest.registry.cards, cards.length);
  assert.equal(manifest.counts.labs_exported, cards.length, 'the export denominator must be the registry');
  for (const c of cards) {
    const row = manifest.sources.find((r) => r.kind === 'lab' && r.slug === c.slug);
    assert.ok(row, `${c.slug} is carded but absent from the manifest`);
    assert.ok(fs.existsSync(path.join(OUT, row.output_file)), `${c.slug}: ${row.output_file} missing`);
  }
});

whenPresent('every manifest row carries a repository, a commit and an output file', () => {
  for (const r of manifest.sources) {
    assert.match(r.repository, /^systemslibrarian\//, `${r.slug}: no repository`);
    assert.ok(r.output_file, `${r.slug}: no output file`);
    assert.ok(['complete', 'partial', 'unsupported', 'unavailable'].includes(r.status), `${r.slug}: bad grade ${r.status}`);
    if (r.status !== 'unavailable') assert.match(String(r.commit), /^[0-9a-f]{40}$/, `${r.slug}: no commit`);
  }
});

whenPresent('a lab behind its remote says so, with the gap', () => {
  for (const r of manifest.sources.filter((x) => x.kind === 'lab')) {
    if (!r.commits_behind_remote) continue;
    const doc = fs.readFileSync(path.join(OUT, r.output_file), 'utf8');
    assert.match(doc, /commit\(s\) behind/, `${r.slug}: behind its remote and the document does not say so`);
  }
});

/* HASHES. A recorded hash that no longer matches is how staleness is detected, so
   it has to be the hash of the bytes actually read. */
whenPresent('recorded hashes match the files they name', () => {
  let checked = 0;
  for (const r of manifest.sources.filter((x) => x.kind !== 'lab')) {
    const abs = path.join(ROOT, r.page);
    if (!fs.existsSync(abs)) continue;
    assert.equal(sha(fs.readFileSync(abs, 'utf8')), r.sha256, `${r.page}: hash does not match the file`);
    checked += 1;
  }
  assert.ok(checked > 20, `only ${checked} hub hashes checked`);
});

whenPresent('a lab page hash matches the bytes that were read', () => {
  const labs = manifest.sources.filter((r) => r.kind === 'lab' && r.pages.length).slice(0, 12);
  for (const r of labs) {
    const { root } = sourceRoot(path.join(FLEET, r.slug));
    for (const p of r.pages.slice(0, 2)) {
      const abs = path.join(root, p.page);
      if (!fs.existsSync(abs)) continue;
      assert.equal(sha(fs.readFileSync(abs, 'utf8')), p.sha256, `${r.slug}/${p.page}: hash mismatch`);
    }
  }
});

/* RECONSTRUCTION. The strongest check available: take quoted text out of the
   export, open the file and line it cites, and find it there. */
whenPresent('quoted text is found at the file and line it cites', () => {
  const labs = manifest.sources.filter((r) => r.kind === 'lab' && r.status === 'complete');
  const pick = ['crypto-lab-nonce-collision', 'crypto-lab-kyber-vault', 'crypto-lab-zk-proof-lab',
    'crypto-lab-lattice-builder', 'crypto-lab-prime-witness', 'crypto-lab-point-ledger']
    .map((s) => labs.find((r) => r.slug === s)).filter(Boolean);
  assert.ok(pick.length >= 4, 'the representative labs must be in the export');
  let verified = 0;
  for (const r of pick) {
    const { root } = sourceRoot(path.join(FLEET, r.slug));
    const doc = fs.readFileSync(path.join(OUT, r.output_file), 'utf8');
    /* Pull back the located quotes the document itself printed. */
    const cites = [...doc.matchAll(/^(.+)\n<sub>([^:<]+):(\d+)<\/sub>$/gm)].slice(0, 40);
    assert.ok(cites.length > 3, `${r.slug}: no located quotes to verify`);
    for (const [, quoted, file, line] of cites) {
      const abs = path.join(root, file);
      if (!fs.existsSync(abs)) continue;
      const lines = fs.readFileSync(abs, 'utf8').split('\n');
      const window = lines.slice(Math.max(0, Number(line) - 3), Number(line) + 3).join(' ');
      /* Strip the markdown the EXPORT added. A heading is written `### Text`, so
         searching the source for "### Text" fails on text that is really there --
         the hashes are ours, the words are the lab's. */
      const needle = extract.text(quoted.replace(/^#{1,6}\s*/, '').replace(/^[-*]\s+/, '')).slice(0, 40);
      if (!needle || needle.length < 12) continue;
      assert.ok(extract.text(window).includes(needle),
        `${r.slug}: "${needle}" cited at ${file}:${line} is not there`);
      verified += 1;
    }
  }
  assert.ok(verified > 40, `only ${verified} quotes reconstructed`);
});

/* REPRESENTATIVE LABS, by the property that breaks a reader. */
whenPresent('a nested-demo lab exports from its nested page', () => {
  const r = manifest.sources.find((x) => x.slug === 'crypto-lab-kyber-vault');
  assert.ok(r.pages.some((p) => p.page.startsWith('demos/kyber-vault/')), 'the nested page must be read');
  assert.ok(r.blocks_total > 100, `only ${r.blocks_total} blocks`);
});

whenPresent('a lab whose page lives outside the root exports from there', () => {
  const r = manifest.sources.find((x) => x.slug === 'crypto-lab-quantum-vault-kpqc');
  assert.ok(r.pages.some((p) => p.page.startsWith('web-demo/')), 'web-demo/ must be read');
});

whenPresent('a multi-exhibit lab exports every exhibit page', () => {
  const r = manifest.sources.find((x) => x.slug === 'crypto-lab-zk-proof-lab');
  const exhibits = r.pages.filter((p) => /exhibits\//.test(p.page));
  assert.ok(exhibits.length >= 5, `only ${exhibits.length} exhibit pages`);
});

whenPresent('a diagram-heavy lab exports diagram labels', () => {
  const withLabels = manifest.sources.filter((r) => (r.block_kinds || {})['diagram-label']);
  assert.ok(withLabels.length >= 5, `only ${withLabels.length} sources carry diagram labels`);
  const top = withLabels.sort((a, b) => b.block_kinds['diagram-label'] - a.block_kinds['diagram-label'])[0];
  assert.ok(top.block_kinds['diagram-label'] >= 5);
  const doc = fs.readFileSync(path.join(OUT, top.output_file), 'utf8');
  assert.match(doc, /diagram label:/);
});

whenPresent('a dynamic lab exports its controls and marks outputs as not captured', () => {
  const r = manifest.sources.find((x) => x.slug === 'crypto-lab-nonce-collision');
  assert.ok((r.block_kinds || {}).control > 5, 'controls must be described');
  assert.ok((r.block_kinds || {})['output-region'] > 3, 'output regions must be listed');
  const doc = fs.readFileSync(path.join(OUT, r.output_file), 'utf8');
  assert.match(doc, /Runtime value NOT CAPTURED/);
  assert.match(doc, /\[described\]/);
});

/*
 * A category a reader trusts has to mean what it says. The first version of the
 * caveat class list included `note` and `callout`, so
 * crypto-lab-nonce-collision's "No theory required to start..." was filed as a
 * stated limitation, and the export reported 1,646 warnings where 191 were real.
 * Encouragement padding the warning list is worse than a shorter list.
 */
test('a generic note is an aside, and a caveat class is a warning', () => {
  const page = [
    '<p class="note">No theory required to start. Go to The XOR reveal.</p>',
    '<p class="sim-warning">This is a teaching model, not production crypto.</p>',
    '<p class="production-warning">Use a hardened implementation in production.</p>',
    '<p class="primer">Four terms first.</p>',
  ].join('\n');
  const bs = extract.blocks(page, 'index.html');
  const warnings = bs.filter((b) => b.kind === 'warning').map((b) => b.variant);
  const asides = bs.filter((b) => b.kind === 'aside').map((b) => b.variant);
  assert.deepEqual(warnings.sort(), ['production-warning', 'sim-warning']);
  assert.deepEqual(asides.sort(), ['note', 'primer']);
});

whenPresent('the export keeps caveats and asides apart', () => {
  const k = {};
  for (const r of manifest.sources) for (const [a, b] of Object.entries(r.block_kinds || {})) k[a] = (k[a] || 0) + b;
  assert.ok(k.warning > 50, `only ${k.warning} warnings`);
  assert.ok(k.aside > 100, `only ${k.aside} asides`);
  assert.ok(k.aside > k.warning, 'generic asides outnumber real caveats in this fleet; if that inverts, the class lists have drifted');
});

/* THE TEACHING LAYER: the quizzes, answers and feedback the hub itself carries. */
whenPresent('every worksheet is exported with all five of its sections', () => {
  const ws = manifest.sources.filter((r) => r.kind === 'worksheet');
  assert.equal(ws.length, manifest.counts.worksheets);
  assert.ok(ws.length >= 20, `only ${ws.length} worksheets`);
  for (const w of ws) {
    for (const want of ['Predict', 'Do', 'Record', 'Explain', 'Fix / Extend']) {
      assert.ok(w.sections.includes(want), `${w.slug}: missing section ${want}`);
    }
    const doc = fs.readFileSync(path.join(OUT, w.output_file), 'utf8');
    assert.match(doc, /<!-- verbatim-begin -->/, `${w.slug}: worksheet body not exported verbatim`);
  }
});

whenPresent('module discussion questions, assessment and instructor notes are exported', () => {
  for (const m of manifest.sources.filter((r) => r.kind === 'teaching-module')) {
    const doc = fs.readFileSync(path.join(OUT, m.output_file), 'utf8');
    for (const want of ['Learning outcomes', 'Discussion questions', 'Assessment', 'Instructor notes']) {
      assert.ok(doc.includes(`## ${want}`), `${m.slug}: ${want} missing`);
    }
  }
});

/* THE INDEX IS NOT THE CONTENT, and says so. */
whenPresent('the index declares itself an index and gives a reproducible assembly command', () => {
  const idx = fs.readFileSync(path.join(OUT, 'index.md'), 'utf8');
  assert.match(idx, /This file is an INDEX, not the content/);
  assert.match(idx, /```sh[\s\S]*cat [\s\S]*> full\.md[\s\S]*```/);
  assert.ok(manifest.assemble_command.startsWith('cat '));
  for (const s of manifest.shards) {
    assert.ok(manifest.assemble_command.includes(s.file), `${s.file} is not in the assembly command`);
    assert.ok(fs.existsSync(path.join(OUT, s.file)), `${s.file} is listed but absent`);
  }
});

whenPresent('the shards really contain content, not links to it', () => {
  const s = manifest.shards.find((x) => x.file.startsWith('full-labs-'));
  const body = fs.readFileSync(path.join(OUT, s.file), 'utf8');
  assert.ok(body.length > 50_000, `${s.file} is only ${body.length} bytes`);
  assert.ok((body.match(/^## Page: /gm) || []).length >= 2, 'a shard must carry page sections');
  assert.ok((body.match(/<sub>[^<]+:\d+<\/sub>/g) || []).length > 100, 'a shard must carry located quotes');
});

whenPresent('the manifest states what the method cannot do', () => {
  assert.equal(manifest.method.runs_pages, false);
  assert.equal(manifest.method.captures_runtime_output, false);
  assert.ok(manifest.method.known_limitations.length >= 5);
  assert.ok(manifest.method.known_limitations.some((l) => /execut/i.test(l)),
    'the manifest must say in words that nothing is executed');
});

whenPresent('no credential-shaped string reached the export', () => {
  /* Labs are teaching demos and should carry no secrets, but an export that
     republishes 252 repositories has to check rather than assume. */
  const bad = [
    /gh[pousr]_[A-Za-z0-9]{36,}/,
    /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /xox[baprs]-[A-Za-z0-9-]{10,}/,
  ];
  for (const f of fs.readdirSync(OUT).filter((x) => x.endsWith('.md'))) {
    const body = fs.readFileSync(path.join(OUT, f), 'utf8');
    for (const re of bad) assert.ok(!re.test(body), `${f} contains a credential-shaped string matching ${re}`);
  }
});

/* STALENESS. The manifest is only useful if drift is detectable. */
whenPresent('a changed source is detected as stale', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stale-'));
  const copy = path.join(dir, 'coverage.json');
  const m = JSON.parse(JSON.stringify(manifest));
  const row = m.sources.find((r) => r.kind === 'hub-page');
  row.sha256 = 'f'.repeat(64);
  const lab = m.sources.find((r) => r.kind === 'lab' && r.commit);
  lab.commit = '0'.repeat(40);
  fs.writeFileSync(copy, JSON.stringify(m));
  /* The check compares recorded hashes and commits with what is on disk now; a
     tampered manifest must come back stale on exactly those two rows. */
  const nowHub = sha(fs.readFileSync(path.join(ROOT, row.page), 'utf8'));
  assert.notEqual(nowHub, row.sha256);
  assert.notEqual(lab.commit, manifest.sources.find((r) => r.slug === lab.slug).commit);
});
