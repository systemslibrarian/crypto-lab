#!/usr/bin/env node
/*
 * build-teaching-export.js — export what a learner can READ and DO across Crypto
 * Lab as Markdown, with every passage traceable to a repository, commit, file and
 * line.
 *
 * Run: node scripts/build-teaching-export.js [--out <dir>] [--check] [--lab <slug>]
 * Prevents: an audit of the teaching material conducted against whatever a page
 *   happened to show on the day, with no commit to cite, no way to tell a gap
 *   from an omission, and no way to notice the source has moved since.
 * Reads: index.html (the registry, via tools/card-reader.js); teach/_src and the
 *   hub's own learner-facing pages; every lab checkout under the fleet root,
 *   through tools/clone-source.js so a dirty clone is read from committed HEAD.
 *
 * FOUR THINGS IT WILL NOT DO
 *
 * 1. It will not INVENT OUTPUT. Nothing here runs a page. A control is exported
 *    as a control and an output region as a region, with any static placeholder
 *    the markup ships; what a lab prints when you press the button is recorded as
 *    not captured. An export that filled those in with plausible values would be
 *    more useful and less true.
 * 2. It will not claim to cover every interaction. Each page records what was
 *    extracted, and coverage.json grades every source complete / partial /
 *    unsupported / unavailable.
 * 3. It will not mix VERBATIM with DESCRIPTION. Quoted material is located;
 *    anything this tool wrote about the material is marked [described].
 * 4. It will not call an index full content. index.md is navigation. The full
 *    document is full.md when it fits, and category shards plus a printed
 *    assembly command when it does not, with the size reported either way.
 *
 * UNMERGED WORK IS KEPT OUT. Labs are read from committed HEAD, and coverage.json
 * records the hub commit and how many paths were uncommitted, so an export taken
 * mid-edit is identifiable rather than passing as published source.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const HUB = path.resolve(__dirname, '..');
const FLEET = path.resolve(HUB, '..');
const { readCards, hreflessLine } = require(path.join(HUB, 'tools/card-reader.js'));
const { sourceRoot, tornSnapshot } = require(path.join(HUB, 'tools/clone-source.js'));
const { htmlPages, sourceFiles } = require(path.join(HUB, 'tools/lab-pages.js'));
const extract = require(path.join(HUB, 'tools/teaching-extract.js'));

const SHARD_LIMIT = 4 * 1024 * 1024;
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const git = (dir, args) => {
  try {
    return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch { return null; }
};
const slug = (s) => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';

const VERBATIM_NOTE = '_Quoted text is verbatim from the file and line named beneath it. Lines marked `[described]` are this tool writing about the page, not the page speaking._';

function renderBlocks(bs, opts = {}) {
  const L = [];
  const where = (b) => `${b.file}:${b.loc}`;
  const fence = (s) => String(s).replace(/```/g, '`​``');
  let lastKind = null;
  for (const b of bs) {
    if (b.kind !== lastKind) L.push('');
    lastKind = b.kind;
    switch (b.kind) {
      case 'heading':
        L.push(`${'#'.repeat(Math.min(6, (opts.base || 3) + b.level - 1))} ${b.text}`);
        L.push(`<sub>${where(b)}${b.fromTemplate ? ' (built in source)' : ''}</sub>`);
        break;
      case 'paragraph':
        L.push(b.text);
        L.push(`<sub>${where(b)}</sub>`);
        break;
      case 'warning':
        L.push(`> **Stated limitation or warning** (\`${b.variant}\`) — ${where(b)}`);
        L.push('>');
        L.push(`> ${b.text}`);
        break;
      case 'list':
        L.push(`<sub>${where(b)}</sub>`);
        b.items.forEach((it, i) => L.push(`${b.ordered ? `${i + 1}.` : '-'} ${it}`));
        break;
      case 'table': {
        if (b.caption) L.push(`**Table caption:** ${b.caption}`);
        if (b.label) L.push(`**Table label:** ${b.label}`);
        L.push(`<sub>${where(b)} — cells verbatim; the markdown pipes are reconstructed by this tool</sub>`);
        L.push('');
        const cell = (c) => String(c).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
        const width = Math.max(...b.rows.map((r) => r.length));
        const pad = (r) => [...r, ...Array(width - r.length).fill('')];
        L.push(`| ${pad(b.rows[0]).map(cell).join(' | ')} |`);
        L.push(`|${' --- |'.repeat(width)}`);
        for (const r of b.rows.slice(1)) L.push(`| ${pad(r).map(cell).join(' | ')} |`);
        break;
      }
      case 'term': L.push(`- **${b.text}** <sub>${where(b)}</sub>`); break;
      case 'definition': L.push(`  - ${b.text} <sub>${where(b)}</sub>`); break;
      case 'code-or-equation':
      case 'equation':
        L.push(`- \`${b.text}\`${b.notation ? ` _(${b.notation})_` : ''} <sub>${where(b)}</sub>`);
        break;
      case 'preformatted':
        L.push(`<sub>${where(b)}</sub>`);
        L.push('```text'); L.push(fence(b.text)); L.push('```');
        break;
      case 'figure-caption': L.push(`**Figure caption:** ${b.text} <sub>${where(b)}</sub>`); break;
      case 'diagram-title': L.push(`**Diagram title:** ${b.text} <sub>${where(b)}</sub>`); break;
      case 'diagram-description': L.push(`**Diagram description:** ${b.text} <sub>${where(b)}</sub>`); break;
      case 'diagram-label': L.push(`- diagram label: \`${b.text}\` <sub>${where(b)}</sub>`); break;
      case 'image-alt': L.push(`**Image alt text:** ${b.text} <sub>${where(b)}</sub>`); break;
      case 'disclosure-summary': L.push(`**Expandable section titled:** ${b.text} <sub>${where(b)}</sub>`); break;
      case 'reference': L.push(`- [${b.text}](${b.href}) <sub>${where(b)}</sub>`); break;
      case 'control-label':
        L.push(`- control label: ${b.text}${b.forId ? ` (for \`#${b.forId}\`)` : ''} <sub>${where(b)}</sub>`);
        break;
      case 'control': {
        const bits = [`\`${b.control}\``];
        if (b.id) bits.push(`id \`#${b.id}\``);
        if (b.label) bits.push(`labelled "${b.label}"`);
        if (b.options && b.options.length) bits.push(`options: ${b.options.map((o) => `"${o}"`).join(', ')}`);
        if (b.min !== null && b.min !== undefined) bits.push(`range ${b.min} to ${b.max} step ${b.step || '1'}`);
        if (b.value) bits.push(`default "${b.value}"`);
        if (b.disabled) bits.push('initially disabled');
        L.push(`- **Control** [described]: ${bits.join(', ')} <sub>${where(b)}</sub>`);
        break;
      }
      case 'output-region':
        L.push(`- **Output region** [described]: ${b.id ? `id \`#${b.id}\`` : 'unnamed'}`
          + `${b.role ? `, role \`${b.role}\`` : ''}${b.live ? `, \`aria-live="${b.live}"\`` : ''}. `
          + `${b.placeholder ? `Static placeholder, verbatim: "${b.placeholder}". ` : ''}`
          + `Runtime value NOT CAPTURED: this export does not run the page. <sub>${where(b)}</sub>`);
        break;
      default:
        L.push(`- ${b.kind}: ${b.text || ''} <sub>${where(b)}</sub>`);
    }
  }
  return L.join('\n');
}

function readModules() {
  const dir = path.join(HUB, 'teach/_src/modules');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const rel = `teach/_src/modules/${f}`;
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    return { rel, raw, hash: sha(raw), data: JSON.parse(raw) };
  });
}

function readWorksheets() {
  const root = path.join(HUB, 'teach/_src/worksheets');
  const out = [];
  if (!fs.existsSync(root)) return out;
  for (const mod of fs.readdirSync(root).sort()) {
    const d = path.join(root, mod);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.md')).sort()) {
      const rel = `teach/_src/worksheets/${mod}/${f}`;
      const raw = fs.readFileSync(path.join(d, f), 'utf8');
      const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(raw);
      out.push({
        rel, raw, hash: sha(raw), module: mod, exhibit: f.replace(/\.md$/, ''),
        frontMatter: fm ? fm[1] : null,
        body: fm ? raw.slice(fm[0].length) : raw,
        sections: [...raw.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()),
      });
    }
  }
  return out;
}

function moduleMarkdown(mod, worksheets) {
  const d = mod.data;
  const name = path.basename(mod.rel, '.json');
  const L = [`# Teaching module: ${d.title || name}`, '', VERBATIM_NOTE, '',
    `Source: \`${mod.rel}\` · sha256 \`${mod.hash.slice(0, 16)}\``, ''];
  const field = (label, key) => {
    const v = d[key];
    if (v === undefined || v === null) return;
    L.push(`## ${label}`, `<sub>${mod.rel} · field \`${key}\`</sub>`, '');
    if (Array.isArray(v)) {
      for (const item of v) {
        if (item && typeof item === 'object') {
          L.push(`- ${Object.entries(item).map(([k, x]) => `**${k}:** ${Array.isArray(x) ? x.join('; ') : x}`).join(' · ')}`);
        } else L.push(`- ${item}`);
      }
    } else if (typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) L.push(`- **${k}:** ${Array.isArray(x) ? x.join('; ') : x}`);
    } else L.push(String(v));
    L.push('');
  };
  field('Audience', 'audience');
  field('Course fit', 'course_fit');
  field('Prerequisites', 'prerequisites');
  field('Learning outcomes', 'outcomes');
  field('Exhibits in this module', 'exhibits');
  field('Discussion questions', 'discussion_questions');
  field('Assessment', 'assessment');
  field('Instructor notes', 'instructor_notes');
  field('Deliberately trimmed', 'trimmed');
  field('Last checked', 'last_checked');

  const mine = worksheets.filter((w) => w.module === name || w.module === d.id);
  L.push(`## Worksheets in this module (${mine.length})`, '');
  for (const w of mine) {
    L.push(`### Worksheet: ${w.exhibit}`, '',
      `Source: \`${w.rel}\` · sha256 \`${w.hash.slice(0, 16)}\` · sections: ${w.sections.join(' · ') || 'none'}`, '');
    if (w.frontMatter) L.push('Front matter, verbatim:', '', '```yaml', w.frontMatter, '```', '');
    L.push('Worksheet body, verbatim:', '', '<!-- verbatim-begin -->', w.body.trim(), '<!-- verbatim-end -->', '');
  }
  return L.join('\n');
}

function hubPages() {
  const out = [];
  for (const rel of ['index.html', 'README.md', 'CATALOG.md', 'concept-coverage.md']) {
    if (fs.existsSync(path.join(HUB, rel))) out.push(rel);
  }
  const walk = (dir, depth) => {
    if (depth > 3) return;
    const abs = path.join(HUB, dir);
    if (!fs.existsSync(abs)) return;
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(rel, depth + 1);
      else if (/\.(html|md)$/.test(e.name) && !e.name.startsWith('_')) out.push(rel);
    }
  };
  for (const d of ['teach', 'learn', 'games', 'knowledge-map', 'evidence']) walk(d, 0);
  return [...new Set(out)].sort();
}

function main() {
  const argv = process.argv.slice(2);
  const arg = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
  const outDir = path.resolve(HUB, arg('--out', 'teaching-export'));
  const checkOnly = argv.includes('--check');
  const onlyLab = arg('--lab', null);

  const html = fs.readFileSync(path.join(HUB, 'index.html'), 'utf8');
  const { cards, hrefless } = readCards(html);
  if (hrefless.length) {
    console.error(hreflessLine(hrefless));
    console.error('REGISTRY-UNREADABLE — the denominator is unknown; nothing was written.');
    return 2;
  }

  const hubCommit = git(HUB, ['rev-parse', 'HEAD']);
  const hubDirty = (git(HUB, ['status', '--porcelain']) || '').split('\n').filter(Boolean).length;
  const generatedAt = new Date().toISOString();

  const sources = [];
  const labDocs = new Map();
  const selected = onlyLab ? cards.filter((c) => c.slug === onlyLab || c.slug === `crypto-lab-${onlyLab}`) : cards;

  for (const c of selected) {
    const dir = path.join(FLEET, c.slug);
    const row = {
      kind: 'lab', repository: `systemslibrarian/${c.slug}`, slug: c.slug,
      live_url: c.href, title: c.title,
      category: c.categories.map(extract.text), level: c.attr('data-level') || null,
      commit: null, remote_head: null, commits_behind_remote: null,
      read_from: null, status: 'unavailable', pages: [], limitations: [],
      blocks_total: 0, output_file: `labs/${c.slug}.md`,
    };
    if (!fs.existsSync(path.join(dir, '.git'))) {
      row.limitations.push('no checkout on this machine, so nothing could be read');
      sources.push(row);
      continue;
    }
    const { root, from, dirty } = sourceRoot(dir);
    row.commit = git(dir, ['rev-parse', 'HEAD']);
    row.remote_head = git(dir, ['rev-parse', 'origin/main']);
    if (row.commit && row.remote_head) {
      const n = git(dir, ['rev-list', '--count', `${row.commit}..${row.remote_head}`]);
      row.commits_behind_remote = n === null ? null : Number(n);
    }
    row.read_from = from === 'worktree' ? 'working tree (clean)' : `git archive HEAD (${dirty} dirty path(s))`;

    const pages = htmlPages(root);
    const all = [];
    for (const rel of pages) {
      const raw = fs.readFileSync(path.join(root, rel), 'utf8');
      const bs = extract.blocks(raw, rel);
      all.push(...bs);
      row.pages.push({ page: rel, origin: 'served page', blocks: bs.length, sha256: sha(raw), bytes: raw.length });
    }
    let fromSrc = 0;
    for (const rel of sourceFiles(root).slice(0, 80)) {
      const raw = fs.readFileSync(path.join(root, rel), 'utf8');
      /* The gate has to admit BOTH shapes. It used to require markup, so a file
         that builds its page with `el('h2', ...)` and writes no tags was skipped
         before the builder reader ever saw it -- which is why 31 labs came back
         with zero headings while `src/ui/app.ts` was calling el('h1') on line 125. */
      const hasMarkup = /<\/?(h[1-6]|p|section|table|button|dl|ul|ol|figcaption)\b/i.test(raw);
      const hasBuilder = /\b[A-Za-z_$][\w$]*\(\s*['"`](?:h[1-6]|p|li|dt|dd|button|summary|figcaption|caption|code|th|td|label|pre)['"`]\s*[,)]/.test(raw);
      if (!hasMarkup && !hasBuilder) continue;
      const bs = extract.blocksFromSource(raw, rel);
      if (!bs.length) continue;
      all.push(...bs);
      fromSrc += bs.length;
      row.pages.push({ page: rel, origin: 'built in source template', blocks: bs.length, sha256: sha(raw), bytes: raw.length });
    }
    /* GRADING. `blocks > 0` is not completeness: a Vite shell yields its page
       title and nothing else, and two React labs were graded complete on exactly
       that until the JSX reader was added. Teaching content means PROSE -- at
       least one heading and one body block -- and anything less is partial with
       the reason, because a confident grade on an empty extraction is the defect
       this manifest exists to prevent. */
    const prose = all.filter((b) => ['paragraph', 'list', 'table', 'warning', 'definition', 'preformatted'].includes(b.kind)).length;
    const headings = all.filter((b) => b.kind === 'heading').length;
    if (!pages.length && !fromSrc) {
      row.status = 'unsupported';
      row.limitations.push('no HTML page and no page-building markup found; this repository may not be a browser demo');
    } else if (headings > 0 && prose > 0) {
      row.status = 'complete';
    } else {
      row.status = 'partial';
      row.limitations.push(`only ${all.length} block(s) extracted, with ${headings} heading(s) and ${prose} body block(s): the page is probably built by a framework this scanner cannot read`);
    }
    row.headings = headings;
    row.prose_blocks = prose;
    row.blocks_total = all.length;
    row.block_kinds = all.reduce((m, b) => { m[b.kind] = (m[b.kind] || 0) + 1; return m; }, {});
    row.limitations.push('interactive outputs are not captured: nothing here runs the page');
    if (fromSrc) row.limitations.push('some content was read from source template literals rather than a served page');

    const L = [`# ${c.title || c.slug}`, '',
      `- **Repository:** https://github.com/systemslibrarian/${c.slug}`,
      `- **Live:** ${c.href}`,
      `- **Commit exported:** \`${row.commit || 'UNAVAILABLE'}\` (the commit these bytes were read from)`,
      ...(row.commits_behind_remote ? [`- **This checkout is ${row.commits_behind_remote} commit(s) behind** \`origin/main\` \`${row.remote_head}\``] : []),
      `- **Read from:** ${row.read_from}`,
      `- **Category:** ${row.category.join(' | ') || 'none'} · **Level:** ${row.level || 'none recorded'}`,
      `- **Sources read:** ${row.pages.map((p) => `\`${p.page}\``).join(', ') || 'none'}`,
      '', VERBATIM_NOTE, '',
      '> **Not captured:** what any control prints when pressed. This export reads source; it does not run pages.',
      ''];
    const byPage = new Map();
    for (const b of all) { if (!byPage.has(b.file)) byPage.set(b.file, []); byPage.get(b.file).push(b); }
    for (const [file, bs] of byPage) {
      L.push(`## Page: \`${file}\``, '');
      L.push(renderBlocks(bs, { base: 3 }));
      L.push('');
    }
    labDocs.set(c.slug, L.join('\n'));
    sources.push(row);
  }

  const modules = readModules();
  const worksheets = readWorksheets();
  const moduleDocs = new Map();
  for (const m of modules) {
    const name = path.basename(m.rel, '.json');
    moduleDocs.set(name, moduleMarkdown(m, worksheets));
    const mine = worksheets.filter((w) => w.module === name);
    sources.push({
      kind: 'teaching-module', repository: 'systemslibrarian/crypto-lab', slug: name,
      commit: hubCommit, page: m.rel, sha256: m.hash, status: 'complete',
      sections: Object.keys(m.data), worksheets: mine.map((w) => w.rel),
      output_file: `modules/${name}.md`,
      limitations: ['module metadata and worksheet text are exported verbatim; a learner’s own answers are not part of the source'],
    });
    for (const w of mine) {
      sources.push({
        kind: 'worksheet', repository: 'systemslibrarian/crypto-lab', slug: `${name}/${w.exhibit}`,
        commit: hubCommit, page: w.rel, sha256: w.hash, status: 'complete',
        sections: w.sections, output_file: `modules/${name}.md`,
        limitations: ['Record tables are intentionally blank in the source: a learner fills them in'],
      });
    }
  }

  const hubDocs = new Map();
  for (const rel of hubPages()) {
    const raw = fs.readFileSync(path.join(HUB, rel), 'utf8');
    const row = {
      kind: 'hub-page', repository: 'systemslibrarian/crypto-lab', slug: rel,
      commit: hubCommit, page: rel, sha256: sha(raw), bytes: raw.length,
      status: 'complete', limitations: [], output_file: `hub/${slug(rel)}.md`,
    };
    let body;
    if (/\.(md|txt)$/.test(rel)) {
      row.extraction = 'verbatim file';
      body = [`# Hub page: \`${rel}\``, '', `Source: \`${rel}\` · sha256 \`${row.sha256.slice(0, 16)}\``, '',
        'Exported verbatim.', '', '<!-- verbatim-begin -->', raw.trim(), '<!-- verbatim-end -->'].join('\n');
    } else {
      const bs = extract.blocks(raw, rel);
      row.extraction = 'scanned HTML';
      row.blocks_total = bs.length;
      row.block_kinds = bs.reduce((m, b) => { m[b.kind] = (m[b.kind] || 0) + 1; return m; }, {});
      row.limitations.push('interactive outputs are not captured: nothing here runs the page');
      if (!bs.length) { row.status = 'partial'; row.limitations.push('no learner-facing blocks found by the scanner'); }
      body = [`# Hub page: \`${rel}\``, '', `Source: \`${rel}\` · sha256 \`${row.sha256.slice(0, 16)}\``, '',
        VERBATIM_NOTE, '', renderBlocks(bs, { base: 2 })].join('\n');
    }
    hubDocs.set(slug(rel), body);
    sources.push(row);
  }

  const torn = tornSnapshot();
  if (torn && torn.length) {
    console.error(`TORN SNAPSHOT (${torn.length}) — clones changed while being read; nothing was written.`);
    for (const t of torn) console.error(`  ${t.dir || t}`);
    return 2;
  }

  if (checkOnly) {
    const manifestPath = path.join(outDir, 'coverage.json');
    if (!fs.existsSync(manifestPath)) {
      console.error(`No manifest at ${path.relative(HUB, manifestPath)}; run without --check first.`);
      return 2;
    }
    const old = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const nowBy = new Map(sources.map((r) => [`${r.kind}:${r.slug}`, r]));
    const stale = [];
    for (const r of old.sources) {
      const cur = nowBy.get(`${r.kind}:${r.slug}`);
      if (!cur) { stale.push({ what: `${r.kind}:${r.slug}`, why: 'in the export, absent now' }); continue; }
      if (r.kind === 'lab') {
        if (cur.commit !== r.commit) stale.push({ what: r.slug, why: `commit moved ${String(r.commit).slice(0, 12)} to ${String(cur.commit).slice(0, 12)}` });
      } else if (cur.sha256 !== r.sha256) {
        stale.push({ what: r.slug, why: 'file content changed since the export' });
      }
    }
    for (const k of nowBy.keys()) {
      if (!old.sources.some((r) => `${r.kind}:${r.slug}` === k)) stale.push({ what: k, why: 'new source, not in the export' });
    }
    console.log(`Manifest generated ${old.generated_at}; ${old.sources.length} source(s) recorded.`);
    if (!stale.length) { console.log('EXPORT CURRENT — every recorded source is unchanged.'); return 0; }
    console.error(`EXPORT STALE (${stale.length}) — regenerate with: node scripts/build-teaching-export.js`);
    for (const s of stale.slice(0, 40)) console.error(`  ${s.what}: ${s.why}`);
    if (stale.length > 40) console.error(`  …and ${stale.length - 40} more`);
    return 1;
  }

  for (const d of ['labs', 'modules', 'hub']) fs.mkdirSync(path.join(outDir, d), { recursive: true });
  for (const [k, v] of labDocs) fs.writeFileSync(path.join(outDir, 'labs', `${k}.md`), `${v}\n`);
  for (const [k, v] of moduleDocs) fs.writeFileSync(path.join(outDir, 'modules', `${k}.md`), `${v}\n`);
  for (const [k, v] of hubDocs) fs.writeFileSync(path.join(outDir, 'hub', `${k}.md`), `${v}\n`);

  const byCat = new Map();
  for (const r of sources.filter((x) => x.kind === 'lab' && labDocs.has(x.slug))) {
    const cat = (r.category && r.category[0]) || 'uncategorised';
    const key = slug(cat);
    if (!byCat.has(key)) byCat.set(key, { cat, slugs: [] });
    byCat.get(key).slugs.push(r.slug);
  }
  const shards = [];
  const teachingFull = [`# Crypto Lab teaching content — hub teaching layer`, '',
    `Generated ${generatedAt} from hub commit \`${hubCommit}\`.`, '', VERBATIM_NOTE, '', '---', '']
    .concat([...moduleDocs.values()].map((v) => `${v}\n\n---\n`)).join('\n');
  fs.writeFileSync(path.join(outDir, 'full-teaching-layer.md'), teachingFull);
  shards.push({ file: 'full-teaching-layer.md', category: 'hub teaching layer (modules and worksheets)', items: moduleDocs.size, bytes: fs.statSync(path.join(outDir, 'full-teaching-layer.md')).size });

  for (const [key, { cat, slugs }] of [...byCat].sort((a, b) => a[0].localeCompare(b[0]))) {
    const file = `full-labs-${key}.md`;
    const body = [`# Crypto Lab teaching content — ${cat}`, '',
      `Generated ${generatedAt} from hub commit \`${hubCommit}\`. ${slugs.length} lab(s).`, '',
      VERBATIM_NOTE, '', '---', ''].concat(slugs.map((s) => `${labDocs.get(s)}\n\n---\n`)).join('\n');
    fs.writeFileSync(path.join(outDir, file), body);
    shards.push({ file, category: cat, items: slugs.length, bytes: fs.statSync(path.join(outDir, file)).size });
  }

  const hubFull = [`# Crypto Lab teaching content — hub learner-facing pages`, '',
    `Generated ${generatedAt} from hub commit \`${hubCommit}\`.`, '', VERBATIM_NOTE, '', '---', '']
    .concat([...hubDocs.values()].map((v) => `${v}\n\n---\n`)).join('\n');
  fs.writeFileSync(path.join(outDir, 'full-hub-pages.md'), hubFull);
  shards.push({ file: 'full-hub-pages.md', category: 'hub learner-facing pages', items: hubDocs.size, bytes: fs.statSync(path.join(outDir, 'full-hub-pages.md')).size });

  const combinedBytes = shards.reduce((n, s) => n + s.bytes, 0);
  const fits = combinedBytes <= SHARD_LIMIT;
  const assemble = `cat ${shards.map((s) => s.file).join(' ')} > full.md`;
  if (fits) {
    fs.writeFileSync(path.join(outDir, 'full.md'), shards.map((s) => fs.readFileSync(path.join(outDir, s.file), 'utf8')).join('\n'));
  }

  const idx = [`# Crypto Lab teaching export — navigation index`, '',
    '**This file is an INDEX, not the content.** The content is in the files it links to.',
    fits ? '`full.md` holds the complete document.'
      : `No single \`full.md\` is written: the combined content is ${(combinedBytes / 1024 / 1024).toFixed(2)} MB, above the 4 MB single-file limit. Assemble it with:`,
    '', '```sh', `cd ${path.relative(HUB, outDir) || '.'}`, assemble, '```', '',
    `Generated ${generatedAt} from hub commit \`${hubCommit}\``
      + `${hubDirty ? ` with ${hubDirty} uncommitted path(s) in the hub working tree` : ' with a clean hub working tree'}.`,
    '', '## Full documents', '',
    ...shards.map((s) => `- [${s.category}](${s.file}) — ${s.items} item(s), ${(s.bytes / 1024).toFixed(0)} KB`),
    '', '## Hub teaching layer, per module', '',
    ...[...moduleDocs.keys()].map((k) => `- [${k}](modules/${k}.md)`),
    '', '## Hub learner-facing pages', '',
    ...[...hubDocs.keys()].map((k) => `- [${k}](hub/${k}.md)`),
    '', `## Labs (${labDocs.size})`, '',
    ...[...labDocs.keys()].sort().map((s) => {
      const r = sources.find((x) => x.kind === 'lab' && x.slug === s);
      return `- [${s}](labs/${s}.md) — ${r.blocks_total} block(s), commit \`${String(r.commit).slice(0, 12)}\``
        + `${r.commits_behind_remote ? `, **${r.commits_behind_remote} behind remote**` : ''}`;
    }),
    '', '## Coverage', '',
    'See `coverage.json`: repository, commit, page, section, source location, output file, hashes and extraction limitations, with every source graded complete / partial / unsupported / unavailable.',
    '', 'Detect staleness with:', '', '```sh', 'node scripts/build-teaching-export.js --check', '```', ''].join('\n');
  fs.writeFileSync(path.join(outDir, 'index.md'), idx);

  const grade = (s) => sources.filter((r) => r.status === s).length;
  const manifest = {
    generated_at: generatedAt,
    hub: { repository: 'systemslibrarian/crypto-lab', commit: hubCommit, working_tree_dirty_paths: hubDirty },
    registry: { source: 'index.html cards, via tools/card-reader.js', cards: cards.length },
    counts: {
      labs_in_registry: cards.length, labs_exported: labDocs.size,
      teaching_modules: moduleDocs.size, worksheets: worksheets.length,
      hub_pages: hubDocs.size, sources_total: sources.length,
      content_blocks: sources.reduce((n, r) => n + (r.blocks_total || 0), 0),
    },
    grades: { complete: grade('complete'), partial: grade('partial'), unsupported: grade('unsupported'), unavailable: grade('unavailable') },
    combined_bytes: combinedBytes,
    single_full_document: fits ? 'full.md' : null,
    assemble_command: assemble,
    shards,
    method: {
      runs_pages: false,
      captures_runtime_output: false,
      verbatim: 'all quoted text is verbatim from the named file and line; table cells are verbatim and the markdown pipes are reconstructed',
      described: 'controls and output regions are described by this tool and marked [described]',
      known_limitations: [
        'nothing is executed, so no interactive output and no post-interaction state is captured',
        'the extractor is a tag-tracking scanner, not a browser; a page it cannot segment is graded partial',
        'about half the fleet builds its page in source template literals, which are read and labelled as such',
        'images and rendered diagrams are represented by their labels, captions, titles, descriptions and alt text only',
        'a lab checkout behind its remote exports the commit named in its row, not the lab head',
        'source files per lab are capped at 80 for runtime; a lab exceeding that is graded complete on what was read',
      ],
    },
    sources,
  };
  fs.writeFileSync(path.join(outDir, 'coverage.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  const dirBytes = (d) => fs.readdirSync(path.join(outDir, d)).reduce((n, f) => n + fs.statSync(path.join(outDir, d, f)).size, 0);
  const total = fs.readdirSync(outDir).filter((f) => /\.(md|json)$/.test(f))
    .reduce((n, f) => n + fs.statSync(path.join(outDir, f)).size, 0)
    + ['labs', 'modules', 'hub'].reduce((n, d) => n + dirBytes(d), 0);

  console.log(`Registry: ${cards.length} cards. Labs exported: ${labDocs.size}. Modules: ${moduleDocs.size}. Worksheets: ${worksheets.length}. Hub pages: ${hubDocs.size}.`);
  console.log(`Content blocks: ${manifest.counts.content_blocks}.`);
  console.log(`Grades — complete ${grade('complete')}, partial ${grade('partial')}, unsupported ${grade('unsupported')}, unavailable ${grade('unavailable')}.`);
  console.log(`Combined content ${(combinedBytes / 1024 / 1024).toFixed(2)} MB; single full.md ${fits ? 'written' : 'NOT written (assemble with the printed command)'}.`);
  console.log(`Wrote ${(total / 1024 / 1024).toFixed(2)} MB to ${path.relative(HUB, outDir)}/`);
  const behind = sources.filter((r) => r.commits_behind_remote > 0);
  if (behind.length) console.log(`NOTE: ${behind.length} lab checkout(s) behind their remote; each row records by how much.`);
  return grade('unavailable') ? 1 : 0;
}

if (require.main === module) process.exit(main());
module.exports = { renderBlocks, readModules, readWorksheets, hubPages, moduleMarkdown };
