#!/usr/bin/env node
/*
 * teach-build.js — generate the /teach/ pages from teach/_src/, plus the course-module
 * map in index.html that puts a "Course module" link under each module's cards.
 *
 * Sources (hand-edited):
 *   teach/_src/modules/<id>.json            one file per course module
 *   teach/_src/worksheets/<id>/<name>.md    worksheet sources: front matter + a small Markdown subset
 *   teach/_src/landing.html                 the /teach/ prose, with <!-- teach:slot --> markers
 *   teach/_src/site.json                    strings every page shares (the syllabus line, the hub URL)
 *   teach/_src/evidence.json                dated observations the privacy section is built from
 *   CITATION.cff                            author, version and date for every citation
 *   index.html                              the cards: the title and live URL of every exhibit
 *
 * Generated (never hand-edit; rerun this instead):
 *   teach/index.html, teach/<id>/index.html, teach/<id>/<name>/index.html,
 *   teach/<id>/anchors.json, the COURSE_MODULES block and the hero band's module
 *   links in index.html, and the three
 *   issue forms in .github/ISSUE_TEMPLATE/ (so their module dropdowns match the modules).
 *
 * Why the sources sit under an underscore folder: the hub is a legacy GitHub Pages
 * build, which runs Jekyll. Jekyll turns any .md with front matter into a themed
 * .html page and stops serving the .md, and it would do that to every worksheet.
 * It skips folders whose names start with "_", so the sources stay out of the site
 * and the raw-Markdown link on each worksheet page points at GitHub instead.
 *
 * Output is byte-identical wherever it runs: no clock, no locale-dependent sorting,
 * LF line endings. Every date on a page comes from a source file.
 *
 * Usage (from the repo root):
 *   node tools/teach-build.js         write every generated file
 *   node tools/teach-build.js check   exit 1 if a generated file differs from what its
 *                                     sources produce, a source fails validation, or
 *                                     the count lint fails
 *   node tools/teach-build.js lint    the count lint alone
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEACH = path.join(ROOT, 'teach');
const SRC = path.join(TEACH, '_src');
const INDEX = path.join(ROOT, 'index.html');
const CFF = path.join(ROOT, 'CITATION.cff');

const ROLES = ['intro', 'break-it', 'fix', 'extension'];
const ROLE_LABEL = { intro: 'Intro', 'break-it': 'Break it', fix: 'Fix', extension: 'Extension' };
const WORKSHEET_SECTIONS = ['Predict', 'Do', 'Record', 'Explain'];
const LAST_SECTION = ['Fix / Extend', 'Fix', 'Extend'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BEGIN = '/* teach-build:begin */';
const END = '/* teach-build:end */';
const LIST_BEGIN = '<!-- teach-build:modules:begin -->';
const LIST_END = '<!-- teach-build:modules:end -->';

/* The count lint (1.7): a number in front of a catalog noun goes stale the day the
 * catalog changes. Compute it at generation time or leave it out. */
const COUNT_RE = /\d\s*(?:exhibits?|labs?|demos?|categor(?:y|ies)|paths?|modules?)\b/i;

const errors = [];
const fail = (msg) => errors.push(msg);

/* ---------- small helpers ---------- */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&apos;/g, "'").replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"').replace(/&rarr;/g, '→').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/* Code-point order on a lowercased key: the same on every OS, unlike localeCompare. */
const byKey = (key) => (a, b) => {
  const x = key(a).toLowerCase(); const y = key(b).toLowerCase();
  return x < y ? -1 : x > y ? 1 : 0;
};

const read = (p) => fs.readFileSync(p, 'utf8');
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

/* ---------- sources ---------- */

function readCards() {
  const html = read(INDEX);
  const re = /<a class="((?:project|feature)-card[^"]*)" data-category="[^"]*" href="(https:\/\/systemslibrarian\.github\.io\/([^\/"]+)\/)"[\s\S]*?<\/a>/g;
  const cards = new Map();
  let m;
  while ((m = re.exec(html)) !== null) {
    const title = /(?:project|feature)-title">([^<]+)</.exec(m[0]);
    cards.set(m[3], { slug: m[3], url: m[2], title: title ? decode(title[1].trim()) : m[3], wip: m[1].includes('wip-card') });
  }
  if (!cards.size) fail('index.html: no cards found — has the card markup changed?');
  return cards;
}

function readCitation() {
  const text = read(CFF);
  const get = (key) => {
    const m = new RegExp('^' + key + ':\\s*"?([^"\\n]*)"?\\s*$', 'm').exec(text);
    return m ? m[1].trim() : '';
  };
  const family = /family-names:\s*"([^"]+)"/.exec(text);
  const given = /given-names:\s*"([^"]+)"/.exec(text);
  const c = {
    title: get('title'), version: get('version'), date: get('date-released'),
    url: get('url'), repo: get('repository-code'), license: get('license'),
    family: family ? family[1] : '', given: given ? given[1] : '',
  };
  for (const k of ['title', 'version', 'date', 'url', 'family', 'given', 'license']) {
    if (!c[k]) fail(`CITATION.cff: missing ${k}`);
  }
  if (c.date && !DATE_RE.test(c.date)) fail('CITATION.cff: date-released must be YYYY-MM-DD');
  /* One source for the reuse terms: the licence id in CITATION.cff, which teach/LICENSE
     carries in full. Every page's footer and the landing page's Reuse section are written
     from this, so the terms cannot drift between them. */
  const LICENSES = {
    'CC-BY-4.0': {
      name: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
      short: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
      freedoms: 'copy, adapt, print and redistribute these materials, including commercially, as long as you give credit',
    },
  };
  if (c.license && !LICENSES[c.license]) fail(`CITATION.cff: license ${c.license} is not one this generator knows how to describe`);
  c.licenseInfo = LICENSES[c.license] || null;
  c.year = c.date.slice(0, 4);
  c.initials = c.given.split(/\s+/).map((w) => w[0] + '.').join(' ');
  return c;
}

function readJson(p) {
  try { return JSON.parse(read(p)); } catch (e) { fail(`${rel(p)}: ${e.message}`); return null; }
}

function checkDated(obj, where, extra) {
  if (obj === null) return;
  if (typeof obj !== 'object' || Array.isArray(obj)) { fail(`${where}: must be null or an object`); return; }
  if (!DATE_RE.test(obj.checked || '')) fail(`${where}.checked: must be a YYYY-MM-DD date`);
  if (extra) extra(obj);
}

function isStrList(v, min, max) {
  return Array.isArray(v) && v.length >= min && v.length <= max &&
    v.every((s) => typeof s === 'string' && s.trim() && !s.includes('\n'));
}

function readModules(cards) {
  const dir = path.join(SRC, 'modules');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  const modules = [];
  const unresolved = [];
  for (const f of files) {
    const where = `teach/_src/modules/${f}`;
    const m = readJson(path.join(dir, f));
    if (!m) continue;
    if (m.id !== f.replace(/\.json$/, '') || !/^[a-z0-9-]+$/.test(m.id)) fail(`${where}: id must match the file name`);
    if (!Number.isInteger(m.position)) fail(`${where}: position must be an integer`);
    for (const k of ['title', 'audience', 'course_fit']) {
      if (typeof m[k] !== 'string' || !m[k].trim()) fail(`${where}: ${k} must be a non-empty string`);
    }
    if (!isStrList(m.prerequisites, 1, 20)) fail(`${where}: prerequisites must be a list of one-line strings`);
    if (!isStrList(m.outcomes, 3, 5)) fail(`${where}: outcomes must be 3 to 5 one-line strings`);
    else m.outcomes.forEach((o, i) => {
      if (!o.startsWith('Students will be able to ')) fail(`${where}: outcome ${i + 1} must start "Students will be able to "`);
    });
    if (!isStrList(m.discussion_questions, 3, 5)) fail(`${where}: discussion_questions must be 3 to 5 one-line strings`);
    const notes = m.instructor_notes || {};
    for (const k of ['expected_observations', 'misconceptions', 'conceptual_answers']) {
      if (!isStrList(notes[k], 1, 30)) fail(`${where}: instructor_notes.${k} must be a list of one-line strings`);
    }
    if (!Array.isArray(m.trimmed) || !m.trimmed.every((t) => t && typeof t.name === 'string' && typeof t.reason === 'string')) {
      fail(`${where}: trimmed must be a list of {name, reason}`);
    }
    if (!DATE_RE.test(m.last_checked || '')) fail(`${where}: last_checked must be YYYY-MM-DD`);
    if (!Array.isArray(m.exhibits) || !m.exhibits.length) { fail(`${where}: exhibits must be a non-empty list`); continue; }
    const seen = new Set();
    m.exhibits.forEach((x, i) => {
      const w = `${where} exhibits[${i}]`;
      if (typeof x.name !== 'string' || !x.name) { fail(`${w}: name is required`); return; }
      if (seen.has(x.name)) fail(`${w}: ${x.name} is listed twice`);
      seen.add(x.name);
      x.slug = 'crypto-lab-' + x.name;
      x.card = cards.get(x.slug);
      if (!x.card) unresolved.push(`${m.id}: ${x.name}`);
      if (!ROLES.includes(x.role)) fail(`${w}: role must be one of ${ROLES.join(', ')}`);
      if (!Number.isInteger(x.minutes) || x.minutes <= 0) fail(`${w}: minutes must be a positive integer`);
      if (typeof x.students_do !== 'string' || !x.students_do.trim() || x.students_do.includes('\n')) fail(`${w}: students_do must be one line`);
      if (!/^[0-9a-f]{7,40}$/.test(x.source_commit || '')) fail(`${w}: source_commit must be a commit sha`);
      if (x.worksheet !== null && x.worksheet !== x.name) fail(`${w}: worksheet must be null or "${x.name}"`);
      checkDated(x.privacy, `${w}.privacy`, (p) => {
        if (!Array.isArray(p.other_origins) || !Array.isArray(p.storage) || !Array.isArray(p.cookies)) {
          fail(`${w}.privacy: needs other_origins, storage and cookies lists`);
        }
      });
      checkDated(x.support, `${w}.support`, (s) => {
        if (!Array.isArray(s.results) || !s.results.every((r) => r.engine && r.viewport && r.result)) {
          fail(`${w}.support: results must be a list of {engine, viewport, result, notes}`);
        }
        /* The module page publishes a summary, not the log. Anything that is not a clean pass
           therefore needs one instructor-facing line saying what to do about it; the per-engine
           detail stays in this file, which the page links to. */
        if ((s.results || []).some((r) => r.result !== 'pass') && !s.headline) {
          fail(`${w}.support: a result that is not "pass" needs a one-line "headline" for the module page`);
        }
      });
      checkDated(x.run_specific_values, `${w}.run_specific_values`, (r) => {
        if (!['yes', 'partly', 'no'].includes(r.value)) fail(`${w}.run_specific_values.value must be yes, partly or no`);
        if (r.value !== 'no' && !r.source) fail(`${w}.run_specific_values.source must cite the line that makes values differ`);
      });
    });
    modules.push(m);
  }
  if (unresolved.length) fail('Exhibit names that match no card in index.html (not substituted):\n    ' + unresolved.join('\n    '));
  modules.sort((a, b) => (a.position - b.position) || (a.id < b.id ? -1 : 1));
  return modules;
}

/* Front matter: a strict YAML subset — `key: scalar`, `key: [a, b]`, or a key followed
 * by `  - item` lines. Anything else is an error rather than a guess. */
function parseFrontMatter(text, where) {
  const out = {};
  const lines = text.split('\n');
  let listKey = null;
  const scalar = (v) => {
    v = v.trim();
    if (/^"(?:[^"\\]|\\.)*"$/.test(v)) return JSON.parse(v);
    if (/^-?\d+$/.test(v)) return Number(v);
    if (/^[^"'\[\]{}#,]+$/.test(v)) return v;
    fail(`${where}: cannot read front-matter value ${v}`);
    return v;
  };
  for (const line of lines) {
    if (!line.trim()) continue;
    let m;
    if ((m = /^  - (.*)$/.exec(line)) && listKey) { out[listKey].push(scalar(m[1])); continue; }
    if ((m = /^([a-z_]+):\s*$/.exec(line))) { listKey = m[1]; out[listKey] = []; continue; }
    if ((m = /^([a-z_]+):\s*\[(.*)\]\s*$/.exec(line))) {
      listKey = null;
      out[m[1]] = m[2].trim() ? m[2].split(',').map(scalar) : [];
      continue;
    }
    if ((m = /^([a-z_]+):\s*(.+)$/.exec(line))) { listKey = null; out[m[1]] = scalar(m[2]); continue; }
    fail(`${where}: cannot read front-matter line: ${line}`);
  }
  return out;
}

function parseAnchor(a, where) {
  if (typeof a !== 'string') { fail(`${where}: anchor must be a string`); return null; }
  if (/^#[A-Za-z][\w:.-]*$/.test(a)) return { kind: 'id', value: a.slice(1) };
  const m = /^label:(.+)$/.exec(a);
  if (m && m[1].trim() === m[1]) return { kind: 'label', value: m[1] };
  fail(`${where}: anchor "${a}" must be "#element-id" or "label:Exact accessible name"`);
  return null;
}

function readWorksheets(modules) {
  const base = path.join(SRC, 'worksheets');
  const byModule = new Map(modules.map((m) => [m.id, m]));
  const worksheets = [];
  if (!fs.existsSync(base)) return worksheets;
  for (const modId of fs.readdirSync(base).sort()) {
    const dir = path.join(base, modId);
    if (!fs.statSync(dir).isDirectory()) continue;
    const mod = byModule.get(modId);
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
      const where = `teach/_src/worksheets/${modId}/${f}`;
      const text = read(path.join(dir, f));
      const fm = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
      if (!fm) { fail(`${where}: must start with front matter between --- lines`); continue; }
      const meta = parseFrontMatter(fm[1], where);
      const name = f.replace(/\.md$/, '');
      if (!mod) { fail(`${where}: no module ${modId}`); continue; }
      const ex = mod.exhibits.find((x) => x.name === name);
      if (meta.exhibit !== name) fail(`${where}: exhibit must be ${name}`);
      if (meta.module !== modId) fail(`${where}: module must be ${modId}`);
      if (!ex) { fail(`${where}: ${name} is not an exhibit of module ${modId}`); continue; }
      if (ex.worksheet !== name) fail(`teach/_src/modules/${modId}.json: exhibit ${name} has a worksheet; set "worksheet": "${name}"`);
      if (!Number.isInteger(meta.minutes) || meta.minutes <= 0) fail(`${where}: minutes must be a positive integer`);
      /* An empty list is allowed and means what it says: this worksheet's class sequence
         serves none of the module's outcomes. The module data then has to say what it does
         instead, so the gap is recorded rather than implied. */
      if (!Array.isArray(meta.outcomes) ||
          !meta.outcomes.every((n) => Number.isInteger(n) && n >= 1 && n <= mod.outcomes.length)) {
        fail(`${where}: outcomes must list module outcome numbers (1 to ${mod.outcomes.length}), or be empty`);
      }
      if (Array.isArray(meta.outcomes) && !meta.outcomes.length && !(ex && ex.outcome_note)) {
        fail(`teach/_src/modules/${modId}.json: ${name} serves no outcome, so its exhibit entry needs an "outcome_note" saying what it does in class`);
      }
      if (!/^[0-9a-f]{7,40}$/.test(String(meta.source_commit || ''))) fail(`${where}: source_commit must be the lab commit the worksheet was checked against`);
      if (!DATE_RE.test(String(meta.checked || ''))) fail(`${where}: checked must be YYYY-MM-DD`);
      if (!Array.isArray(meta.anchors) || !meta.anchors.length) fail(`${where}: anchors must list every control a step names`);
      const anchors = (meta.anchors || []).map((a) => parseAnchor(a, where)).filter(Boolean);
      const body = renderWorksheetBody(fm[2], where);
      worksheets.push({ module: mod, exhibit: ex, name, meta, anchors, body, source: `teach/_src/worksheets/${modId}/${f}` });
    }
  }
  for (const m of modules) {
    for (const x of m.exhibits) {
      if (x.worksheet && !worksheets.find((w) => w.module === m && w.name === x.name)) {
        fail(`teach/_src/modules/${m.id}.json: ${x.name} names a worksheet but teach/_src/worksheets/${m.id}/${x.name}.md does not exist`);
      }
    }
  }
  return worksheets;
}

/* ---------- the Markdown subset worksheets are written in ----------
 * ## and ### headings, paragraphs, "- " and "1. " lists (one level), pipe tables,
 * "> " notes, and inline `code`, **bold**, *italic* and [links](https://...).
 * Anything else — raw HTML, images, code fences — is refused, so a worksheet
 * cannot quietly render differently from how its raw .md reads. */
function inline(s, where) {
  if (/<|!\[/.test(s)) fail(`${where}: raw HTML and images are not supported: ${s}`);
  const codes = [];
  let t = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  t = esc(t);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    if (!/^https:\/\//.test(url)) fail(`${where}: links must be https:// URLs: ${url}`);
    return `<a href="${url}">${label}</a>`;
  });
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[Number(i)])}</code>`);
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function renderWorksheetBody(md, where) {
  const lines = md.split('\n');
  const out = [];
  const found = [];
  let section = null;
  let i = 0;
  let tableNo = 0;
  const answerable = () => section && section !== 'record' && section !== 'do';
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = /^(#{2,3}) (.+)$/.exec(line))) {
      const level = m[1].length;
      const text = m[2].trim();
      if (level === 2) {
        if (section) out.push('</section>');
        found.push(text);
        section = slugify(text) === 'fix-extend' || text === 'Fix' || text === 'Extend' ? 'fix' : slugify(text);
        out.push(`<section class="ws-sec ws-sec--${section}" aria-labelledby="ws-${section}">`);
        out.push(`<h2 id="ws-${section}">${inline(text, where)}</h2>`);
      } else {
        out.push(`<h3>${inline(text, where)}</h3>`);
      }
      i++;
      continue;
    }
    if (/^(#|####|```|<|!\[)/.test(line)) { fail(`${where}: unsupported Markdown: ${line}`); i++; continue; }
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      if (rows.length < 2 || !/^\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(rows[1])) {
        fail(`${where}: a table needs a header row and a |---| separator row`);
        continue;
      }
      const cells = (r) => r.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]);
      tableNo++;
      out.push(`<div class="ws-table" role="region" tabindex="0" aria-label="${esc(`Record table ${tableNo}: ${head.join(', ')}`)}">`);
      out.push('<table>');
      out.push('<thead><tr>' + head.map((h) => `<th scope="col">${inline(h, where)}</th>`).join('') + '</tr></thead>');
      out.push('<tbody>');
      for (const r of rows.slice(2)) {
        const c = cells(r);
        if (c.length !== head.length) fail(`${where}: table row has ${c.length} cells, header has ${head.length}: ${r}`);
        out.push('<tr>' + c.map((v, k) => (k === 0 && v
          ? `<th scope="row">${inline(v, where)}</th>`
          : v ? `<td>${inline(v, where)}</td>` : '<td class="ws-blank"><span class="visually-hidden">blank for your answer</span></td>')).join('') + '</tr>');
      }
      out.push('</tbody></table></div>');
      continue;
    }
    if (/^(- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items = [];
      while (i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : lines[i].startsWith('- '))) {
        let item = lines[i].replace(ordered ? /^\d+\. / : /^- /, '');
        i++;
        while (i < lines.length && /^ {2,}\S/.test(lines[i])) item += ' ' + lines[i++].trim();
        items.push(item);
      }
      const tag = ordered ? 'ol' : 'ul';
      const cls = answerable() ? ' class="ws-answer"' : '';
      out.push(`<${tag}${cls}>` + items.map((it) => `<li>${inline(it, where)}</li>`).join('') + `</${tag}>`);
      continue;
    }
    if (line.startsWith('> ')) {
      const para = [];
      while (i < lines.length && lines[i].startsWith('> ')) para.push(lines[i++].slice(2));
      out.push(`<aside class="ws-note"><p>${inline(para.join(' '), where)}</p></aside>`);
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,}|\||- |\d+\. |> |```|<|!\[)/.test(lines[i])) para.push(lines[i++].trim());
    out.push(`<p>${inline(para.join(' '), where)}</p>`);
  }
  if (section) out.push('</section>');
  const want = WORKSHEET_SECTIONS.join(' → ') + ' → Fix / Extend';
  const okOrder = found.length === 5 &&
    WORKSHEET_SECTIONS.every((s, k) => found[k] === s) && LAST_SECTION.includes(found[4]);
  if (!okOrder) fail(`${where}: sections must be exactly ${want} (found: ${found.join(' → ') || 'none'})`);
  return out.join('\n');
}

/* Minutes are class time. Predict is answered before the exhibit is opened, so it is
   reading rather than lab time, and every page says so in the same words. */
const PREDICT_NOTE = 'Predict is pre-class reading';

function classTime(minutes) {
  return `About ${minutes} minutes of class time; ${PREDICT_NOTE}`;
}

/* The line a faculty member keeps on an adapted worksheet. */
function attributionLine(cff, site) {
  return `${cff.title} teaching materials by ${cff.given} ${cff.family}, ${cff.licenseInfo.short} — ${site.hub_url}teach/`;
}

function licenceFoot(cff, site) {
  if (!cff.licenseInfo) return '';
  return `<p class="t-foot-licence">Teaching materials: <a href="${cff.licenseInfo.url}">${esc(cff.licenseInfo.short)}</a>. `
    + `You may ${esc(cff.licenseInfo.freedoms)}. When you adapt one, keep this line on it: `
    + `<span class="t-attrib">${esc(attributionLine(cff, site))}</span></p>`;
}

/* ---------- page chrome ---------- */

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23162b2a'/%3E%3Ctext x='16' y='22' font-family='monospace' font-size='14' font-weight='700' text-anchor='middle' fill='%234dcfb0'%3ECL%3C/text%3E%3C/svg%3E";

function page({ depth, title, description, canonical, date, author, crumbs, main, jsonld, licence }) {
  const up = depth ? '../'.repeat(depth) : './';
  const hub = '../'.repeat(depth + 1);
  const slash = date.replace(/-/g, '/');
  const meta = [
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${esc(canonical)}">`,
    `<link rel="icon" type="image/svg+xml" href="${FAVICON}">`,
    `<link rel="stylesheet" href="${up}teach.css">`,
    '<link rel="schema.DC" href="http://purl.org/dc/elements/1.1/">',
    `<meta name="DC.title" content="${esc(title)}">`,
    `<meta name="DC.creator" content="${esc(author)}">`,
    `<meta name="DC.date" content="${date}">`,
    `<meta name="DC.identifier" content="${esc(canonical)}">`,
    '<meta name="DC.publisher" content="Crypto Lab">',
    '<meta name="DC.type" content="InteractiveResource">',
    '<meta name="DC.language" content="en">',
    `<meta name="citation_title" content="${esc(title)}">`,
    `<meta name="citation_author" content="${esc(author)}">`,
    `<meta name="citation_publication_date" content="${slash}">`,
    `<meta name="citation_public_url" content="${esc(canonical)}">`,
  ];
  if (jsonld) meta.push(`<script type="application/ld+json">\n${JSON.stringify(jsonld, null, 2).replace(/</g, '\\u003c')}\n</script>`);
  const trail = crumbs.map((c, k) => (k === crumbs.length - 1
    ? `<li><span aria-current="page">${esc(c.label)}</span></li>`
    : `<li><a href="${c.href}">${esc(c.label)}</a></li>`)).join('');
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — Crypto Lab</title>
${meta.join('\n')}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="t-top">
  <a class="t-brand" href="${hub}"><span class="t-badge" aria-hidden="true">CL</span><span class="t-brand-text">Crypto Lab</span></a>
  <nav class="t-crumbs" aria-label="Breadcrumb"><ol>${trail}</ol></nav>
</header>
<main id="main" class="t-main">
${main}
</main>
<footer class="t-foot">
  <p class="t-foot-links"><a href="${hub}">Crypto Lab catalog</a> · <a href="${up}">Teach with Crypto Lab</a> · <a href="https://github.com/systemslibrarian/crypto-lab">Source on GitHub</a></p>
  ${licence || ''}
  <blockquote class="t-quote"><p>So whether you eat or drink or whatever you do, do it all for the glory of God.</p><cite>1 Corinthians 10:31</cite></blockquote>
</footer>
<script src="${up}teach.js"></script>
</body>
</html>
`;
}

/* ---------- citations ---------- */

function authorName(cff) { return `${cff.family}, ${cff.given}`; }

function apaCollection(cff) {
  return `${cff.family}, ${cff.initials} (${cff.year}). <em>${esc(cff.title)}</em> (Version ${esc(cff.version)}) [Computer software]. ${esc(cff.url)}`;
}

/* BibTeX goes inside a <pre>: escape it as HTML, then put the accessed-date span back. */
const ACCESSED = '\u0001ACCESSED\u0001';
const bibHtml = (text) => esc(text).split(ACCESSED).join('<span data-accessed="iso">[date accessed]</span>');
const bibText = (s) => s.replace(/[{}]/g, '').replace(/([&%#_$])/g, '\\$1');

function bibCollection(cff) {
  return bibHtml([
    `@misc{${cff.family.toLowerCase()}_crypto_lab_${cff.year},`,
    `  author       = {${bibText(cff.family)}, ${bibText(cff.given)}},`,
    `  title        = {${bibText(cff.title)}},`,
    `  year         = {${cff.year}},`,
    `  version      = {${bibText(cff.version)}},`,
    `  howpublished = {\\url{${cff.url}}},`,
    `  note         = {Accessed ${ACCESSED}}`,
    '}',
  ].join('\n'));
}

function apaExhibit(cff, card) {
  return `${cff.family}, ${cff.initials} (n.d.). <em>${esc(card.title)}</em> [Interactive teaching demonstration]. ${esc(cff.title)}. `
    + `Retrieved <span data-accessed="apa">[date accessed]</span>, from ${esc(card.url)}`;
}

function bibExhibit(cff, card) {
  const key = `${cff.family.toLowerCase()}_${card.slug.replace(/^crypto-lab-/, '').replace(/[^a-z0-9]+/g, '_')}`;
  return bibHtml([
    `@misc{${key},`,
    `  author       = {${bibText(cff.family)}, ${bibText(cff.given)}},`,
    `  title        = {${bibText(card.title)}},`,
    `  howpublished = {\\url{${card.url}}},`,
    `  note         = {${bibText(cff.title)}. Accessed ${ACCESSED}}`,
    '}',
  ].join('\n'));
}

/* ---------- /teach/<module>/ ---------- */

const minutesOf = (m, core) => m.exhibits.filter((x) => (x.role === 'extension') !== core).reduce((s, x) => s + x.minutes, 0);

function list(items, cls) {
  return `<ul${cls ? ` class="${cls}"` : ''}>` + items.map((s) => `<li>${esc(s)}</li>`).join('') + '</ul>';
}

function notChecked() {
  return '<span class="t-pending">Not yet checked. This is filled in when the module’s worksheets are written.</span>';
}

/* What an instructor acts on: which engines were checked, whether it holds at phone
   width, the date, and anything that is not a clean pass — one short line each. The
   per-engine detail, the transfer sizes and the source lines behind every verdict stay
   in the module's data file, which this block links to. */
function checksBlock(m, site) {
  const checked = m.exhibits.filter((x) => x.support);
  const dates = [...new Set(checked.map((x) => x.support.checked))].sort();
  const engines = [...new Set(checked.flatMap((x) => x.support.results.map((r) => r.engine.split(' ')[0])))];
  const supportExceptions = checked.filter((x) => x.support.results.some((r) => r.result !== 'pass'));
  const privacyChecked = m.exhibits.filter((x) => x.privacy);
  const privacyExceptions = privacyChecked.filter((x) => x.privacy.other_origins.length || x.privacy.cookies.length || x.privacy.headline);
  const dataUrl = `https://github.com/${site.repo}/blob/${site.branch}/teach/_src/modules/${m.id}.json`;
  const list2 = (items) => `<ul>${items.map((s) => `<li>${s}</li>`).join('')}</ul>`;

  if (!checked.length && !privacyChecked.length) {
    return `<p>${notChecked()}</p>\n<p>The worksheet drift check reads this module’s <a href="anchors.json">anchors manifest</a>.</p>`;
  }
  const support = checked.length
    ? `<p><strong>Browser support.</strong> Every exhibit in this module, and every step of its worksheet, was run in `
      + `${listSentence(engines)} at a desktop width and at a phone width (1280 by 720 and 390 by 720), `
      + `checked ${dates.join(' and ')}.`
      + (supportExceptions.length ? ` ${supportExceptions.length === 1 ? 'One exhibit needs a word of warning' : 'Some exhibits need a word of warning'}:` : ' No exhibit had a problem at either width.')
      + `</p>`
      + (supportExceptions.length ? list2(supportExceptions.map((x) => `<strong>${esc(x.card.title)}</strong> — ${esc(x.support.headline)}`)) : '')
    : '';
  const privacy = privacyChecked.length
    ? `<p><strong>Privacy.</strong> Opening these exhibits sends nothing to anyone but the site they are served from: `
      + `no exhibit sets a cookie, and none stores anything beyond the setting that pins its dark theme.`
      + (privacyExceptions.length ? ` The exception${privacyExceptions.length === 1 ? '' : 's'}:` : '')
      + `</p>`
      + (privacyExceptions.length ? list2(privacyExceptions.map((x) => `<strong>${esc(x.card.title)}</strong> — ${esc(x.privacy.headline || ('loads a web font from ' + x.privacy.other_origins.join(' and ')))}`)) : '')
    : '';
  return `${support}\n${privacy}\n<p><a href="${dataUrl}">Detailed check results</a> — engine versions, every step run, transfer sizes, and the source line behind each run-specific verdict. The worksheet drift check reads this module’s <a href="anchors.json">anchors manifest</a>.</p>`;
}

/* "a, b and c" */
function listSentence(items) {
  if (items.length < 2) return esc(items[0] || '');
  return esc(items.slice(0, -1).join(', ')) + ' and ' + esc(items[items.length - 1]);
}

function modulePage(m, cff, site, worksheets) {
  const canonical = `${site.hub_url}teach/${m.id}/`;
  const core = minutesOf(m, true);
  const ext = minutesOf(m, false);
  const rows = m.exhibits.map((x) => {
    const ws = worksheets.find((w) => w.module === m && w.name === x.name);
    /* What students do is a sentence, not a field: it gets its own full-width row rather
       than a column that squeezes it to a few words a line. */
    return `<tr><th scope="row" rowspan="2"><a href="${esc(x.card.url)}">${esc(x.card.title)}</a></th>`
      + `<td>${ROLE_LABEL[x.role]}</td><td>${x.minutes} min</td>`
      + `<td>${ws ? `<a href="${x.name}/">Worksheet<span class="visually-hidden"> for ${esc(x.card.title)}</span></a>` : '<span class="t-pending">Not yet written</span>'}</td></tr>`
      + `\n<tr class="t-row-note"><td colspan="3">${esc(x.students_do)}</td></tr>`;
  }).join('\n');
  const differ = m.exhibits.filter((x) => x.run_specific_values && x.run_specific_values.value === 'yes');
  const cites = m.exhibits.map((x) => `<li><p class="t-cite">${apaExhibit(cff, x.card)}</p></li>`).join('\n');
  const bibs = m.exhibits.map((x) => bibExhibit(cff, x.card)).join('\n\n');
  const trimmed = m.trimmed.length
    ? `<section aria-labelledby="trimmed"><h2 id="trimmed">Left out of this sequence</h2>${list(m.trimmed.map((t) => `${t.name}: ${t.reason}`))}</section>`
    : '';
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: m.title,
    description: m.course_fit,
    url: canonical,
    inLanguage: 'en',
    learningResourceType: 'Course module',
    educationalUse: 'Classroom instruction',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: m.audience },
    competencyRequired: m.prerequisites,
    teaches: m.outcomes,
    timeRequired: `PT${core}M`,
    isAccessibleForFree: true,
    author: { '@type': 'Person', name: `${cff.given} ${cff.family}` },
    dateModified: m.last_checked,
    isPartOf: { '@type': 'WebSite', name: cff.title, url: site.hub_url },
    hasPart: m.exhibits.map((x) => ({ '@type': 'LearningResource', name: x.card.title, url: x.card.url, learningResourceType: 'Interactive demonstration' })),
  };
  const main = `
<header class="t-hero">
  <p class="t-eyebrow">Course module</p>
  <h1>${esc(m.title)}</h1>
  <p class="t-lede">${esc(m.course_fit)}</p>
</header>

<dl class="t-facts">
  <div${m.audience.length > 80 ? ' class="t-fact-wide"' : ''}><dt>Audience</dt><dd>${esc(m.audience)}</dd></div>
  <div><dt>Class time</dt><dd>About ${core} minutes of class time for the core sequence${ext ? `, plus about ${ext} minutes of extension` : ''}. ${esc(PREDICT_NOTE.charAt(0).toUpperCase() + PREDICT_NOTE.slice(1))}.${m.time_note ? ` ${esc(m.time_note)}` : ''}</dd></div>
  <div><dt>Last checked</dt><dd>${esc(m.last_checked)}</dd></div>
</dl>

<section aria-labelledby="prereq"><h2 id="prereq">Prerequisites</h2>${list(m.prerequisites)}</section>

<section aria-labelledby="outcomes"><h2 id="outcomes">Learning outcomes</h2>
<ol>${m.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ol></section>

<section aria-labelledby="sequence"><h2 id="sequence">Sequence</h2>
${m.exhibits.filter((x) => x.outcome_note).map((x) => `<p class="t-outcome-note"><strong>${esc(x.card.title)}:</strong> ${esc(x.outcome_note)}</p>`).join('\n')}
<p>Each exhibit opens in its own site. Roles: <strong>Intro</strong> builds the idea, <strong>Break it</strong> has students cause the failure, <strong>Fix</strong> shows the construction that holds, and <strong>Extension</strong> is optional depth.</p>
<div class="t-table" role="region" tabindex="0" aria-label="Module sequence">
<table>
<thead><tr><th scope="col">Exhibit</th><th scope="col">Role</th><th scope="col">Time</th><th scope="col">Worksheet</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
</div>
${differ.length ? `<p class="t-callout">In ${differ.map((x) => esc(x.card.title)).join(', ')}, keys or inputs are generated fresh for each run, so your values will differ from your classmates’.</p>` : ''}
</section>
${trimmed}
<section aria-labelledby="discuss"><h2 id="discuss">Discussion questions</h2>
<ol>${m.discussion_questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ol></section>

<section aria-labelledby="notes"><h2 id="notes">Instructor notes</h2>
<p>These notes are public, and they are conceptual on purpose: they describe what students should notice and why, never the specific values a run produces.</p>
<h3>Expected observations</h3>${list(m.instructor_notes.expected_observations)}
<h3>Common misconceptions</h3>${list(m.instructor_notes.misconceptions)}
<h3>Conceptual answers</h3>${list(m.instructor_notes.conceptual_answers)}
</section>

<section aria-labelledby="readiness"><h2 id="readiness">Checks</h2>
${checksBlock(m, site)}
</section>

<section aria-labelledby="syllabus"><h2 id="syllabus">For your syllabus</h2>
${syllabusBlock(site, 'module-syllabus')}
</section>

<section aria-labelledby="cite"><h2 id="cite">How to cite this module’s exhibits</h2>
<ol class="t-cites">${cites}</ol>
<details><summary>BibTeX</summary><pre class="t-pre">${bibs}</pre></details>
<p>To cite the whole collection, see <a href="../#cite">How to cite</a>.</p>
</section>
`;
  return page({
    depth: 1, title: m.title, description: m.course_fit, canonical, date: m.last_checked,
    author: authorName(cff), jsonld,
    crumbs: [{ label: 'Crypto Lab', href: '../../' }, { label: 'Teach', href: '../' }, { label: m.title }],
    main,
    licence: licenceFoot(cff, site),
  });
}

function syllabusBlock(site, id) {
  return `<div class="t-syllabus">
<p id="${id}" class="t-syllabus-line">${esc(site.syllabus_line)}</p>
<button type="button" class="t-btn" data-copy="${id}">Copy syllabus line</button>
<span class="t-copy-status" role="status" aria-live="polite"></span>
</div>`;
}

/* ---------- /teach/<module>/<exhibit>/ ---------- */

function worksheetPage(w, cff, site) {
  const m = w.module;
  const x = w.exhibit;
  const canonical = `${site.hub_url}teach/${m.id}/${w.name}/`;
  const raw = `https://raw.githubusercontent.com/${site.repo}/${site.branch}/${w.source}`;
  const blob = `https://github.com/${site.repo}/blob/${site.branch}/${w.source}`;
  const served = w.meta.outcomes.map((n) => `<li>${esc(m.outcomes[n - 1])}</li>`).join('');
  const differ = x.run_specific_values && x.run_specific_values.value === 'yes'
    ? '<p class="t-callout">Keys or inputs in this exhibit are generated fresh for each run, so your values will differ from your classmates’.</p>' : '';
  const title = `Worksheet: ${x.card.title}`;
  const main = `
<header class="t-hero">
  <p class="t-eyebrow">Worksheet · <a href="../">${esc(m.title)}</a></p>
  <h1>${esc(title)}</h1>
</header>

<dl class="t-facts">
  <div><dt>Exhibit</dt><dd><a href="${esc(x.card.url)}">${esc(x.card.title)}</a></dd></div>
  <div><dt>Time</dt><dd>${esc(classTime(w.meta.minutes))}</dd></div>
  <div><dt>Checked against</dt><dd>Lab commit <code>${esc(w.meta.source_commit)}</code> on ${esc(w.meta.checked)}</dd></div>
</dl>

<section aria-labelledby="serves"><h2 id="serves">Outcomes this worksheet serves</h2>${served
    ? `<ul>${served}</ul>`
    : `<p>None of this module's outcomes are served by this worksheet's class sequence.${x.outcome_note ? ` ${esc(x.outcome_note)}` : ''}</p>`}</section>

<div class="t-actions no-print">
  <button type="button" class="t-btn" data-print>Print this worksheet</button>
  <a class="t-btn t-btn--ghost" href="${raw}">Raw Markdown to edit</a>
  <a class="t-btn t-btn--ghost" href="${blob}">View source on GitHub</a>
</div>

<div class="ws-student print-only" aria-hidden="true"><span>Name</span><span>Date</span></div>
${differ}
<div class="ws-body">
${w.body}
</div>

<p class="t-disclaimer">${esc(site.syllabus_line)}</p>
`;
  return page({
    depth: 2, title, description: `A Predict, Do, Record, Explain worksheet for the ${x.card.title} exhibit.`,
    canonical, date: w.meta.checked, author: authorName(cff),
    crumbs: [{ label: 'Crypto Lab', href: '../../../' }, { label: 'Teach', href: '../../' }, { label: m.title, href: '../' }, { label: x.card.title }],
    main,
    licence: licenceFoot(cff, site),
  });
}

function anchorsManifest(m, worksheets, site) {
  const mine = worksheets.filter((w) => w.module === m);
  return JSON.stringify({
    module: m.id,
    title: m.title,
    about: 'The controls each worksheet names, by exhibit. Generated by tools/teach-build.js from the worksheet front matter; a lab whose build removes one of these breaks that worksheet.',
    worksheets: mine.map((w) => ({
      exhibit: w.name,
      repo: `systemslibrarian/${w.exhibit.slug}`,
      url: w.exhibit.card.url,
      worksheet: `${site.hub_url}teach/${m.id}/${w.name}/`,
      source_commit: String(w.meta.source_commit),
      checked: w.meta.checked,
      anchors: w.anchors,
    })),
  }, null, 2) + '\n';
}

/* ---------- /teach/ ---------- */

function landingPage(modules, worksheets, cards, cff, site, evidence) {
  let src = read(path.join(SRC, 'landing.html'));
  const slots = {
    modules: () => modules.map((m) => {
      const core = minutesOf(m, true);
      const names = m.exhibits.map((x) => esc(x.card.title) + (x.role === 'extension' ? ' <span class="t-tag">extension</span>' : '')).join(' · ');
      const written = worksheets.filter((w) => w.module === m).map((w) => esc(w.exhibit.card.title));
      return `<li class="t-module">
<h3><a href="${m.id}/">${esc(m.title)}</a></h3>
<p>${esc(m.course_fit)}</p>
<p class="t-meta"><strong>Audience:</strong> ${esc(m.audience)}<br><strong>Exhibits:</strong> ${names}<br><strong>Class time:</strong> about ${core} minutes for the core sequence<br><strong>Worksheets:</strong> ${written.length ? written.join(' · ') : 'in preparation'}</p>
</li>`;
    }).join('\n'),
    syllabus: () => syllabusBlock(site, 'syllabus-line'),
    'hub-observed': () => observedList(evidence.hub),
    'teach-observed': () => observedList(evidence.teach),
    exception: () => {
      const e = evidence.exception;
      const card = cards.get(e.exhibit);
      if (!card) { fail(`teach/_src/evidence.json: exception exhibit ${e.exhibit} has no card`); return ''; }
      return `<p><a href="${esc(card.url)}">${esc(card.title)}</a> is the exception the catalog itself names: its card says it has a live backend. `
        + `When its page loads it contacts <code>${esc(e.server_origin)}</code> (${esc(e.on_load)}), and the numbers you encrypt are sent there as ciphertext, with a public evaluation key, for the server to add. `
        + `<span class="t-dated">Observed ${esc(e.observed)} in ${esc(e.engine)}; server address read from ${esc(e.source)}.</span></p>`;
    },
    'cite-collection': () => `<p class="t-cite">${apaCollection(cff)}</p>
<pre class="t-pre">${bibCollection(cff)}</pre>`,
    'cite-exhibits': () => {
      const all = [...cards.values()].sort(byKey((c) => c.title));
      return `<ul class="t-cites t-cites--all">${all.map((c) => `<li><p class="t-cite">${apaExhibit(cff, c)}</p></li>`).join('\n')}</ul>`;
    },
    'licence-terms': () => {
      if (!cff.licenseInfo) { fail('CITATION.cff: no license, so the reuse terms cannot be stated'); return ''; }
      return `<p>The module pages, worksheets and instructor notes here are published under the `
        + `<a href="${cff.licenseInfo.url}">${esc(cff.licenseInfo.name)}</a>. You may ${esc(cff.licenseInfo.freedoms)}: `
        + `print a worksheet for a class, rewrite it for your own students, translate it, or build it into a course pack.</p>`
        + `<p>To give credit, keep a line like this one on anything you adapt:</p>`
        + `<p class="t-attrib-block"><span class="t-attrib">${esc(attributionLine(cff, site))}</span></p>`
        + `<p>This covers the teaching materials only. Each demonstration keeps the licence in its own repository, and the `
        + `<a href="https://github.com/${site.repo}/blob/${site.branch}/teach/LICENSE">full licence text</a> sits beside these pages.</p>`;
    },
    'citation-file': () => `<a href="https://github.com/${site.repo}/blob/${site.branch}/CITATION.cff">CITATION.cff</a>`,
  };
  const used = new Set();
  src = src.replace(/<!-- teach:([a-z-]+) -->/g, (all, name) => {
    if (!slots[name]) { fail(`teach/_src/landing.html: unknown slot ${name}`); return all; }
    used.add(name);
    return slots[name]();
  });
  for (const k of Object.keys(slots)) if (!used.has(k)) fail(`teach/_src/landing.html: slot <!-- teach:${k} --> is missing`);
  return page({
    depth: 0, title: 'Teach with Crypto Lab',
    description: 'Course modules, worksheets, citation and privacy notes for instructors using Crypto Lab exhibits in class.',
    canonical: `${site.hub_url}teach/`, date: cff.date, author: authorName(cff),
    crumbs: [{ label: 'Crypto Lab', href: '../' }, { label: 'Teach' }],
    main: src.trimEnd(),
    licence: licenceFoot(cff, site),
  });
}

function observedList(o) {
  if (!o) return '<p class="t-pending">Not yet observed.</p>';
  const origins = o.other_origins.length
    ? '<ul>' + o.other_origins.map((x) => `<li><code>${esc(x.origin)}</code> — ${esc(x.what)}</li>`).join('') + '</ul>'
    : '<p>No requests to any other origin.</p>';
  return `<p><strong>${esc(o.label)}</strong> <span class="t-dated">Observed ${esc(o.observed)} in ${esc(o.engine)}. ${esc(o.method)}</span></p>
${origins}
<ul>
<li>Cookies: ${o.cookies.length ? o.cookies.map(esc).join(', ') : 'none set'}</li>
<li>Browser storage: ${o.storage.length ? o.storage.map(esc).join(', ') : 'none used'}</li>
<li>Scripts from other origins: ${o.external_scripts.length ? o.external_scripts.map(esc).join(', ') : 'none'}</li>
</ul>`;
}

/* ---------- .github/ISSUE_TEMPLATE: the three forms /teach/ links to ----------
 * Generated so the module dropdowns list exactly the modules that exist. */

const LEVELS = ['Secondary school', 'Community or technical college', 'Undergraduate, lower division',
  'Undergraduate, upper division', 'Graduate', 'Professional or continuing education', 'Other'];
const ISSUE_HEADER = '# GENERATED by tools/teach-build.js. Edit the form there, then rerun it.\n';
const y = (s) => JSON.stringify(s);
const opts = (list, pad) => list.map((o) => `${pad}- ${y(o)}`).join('\n');

function issueForms(modules) {
  const titles = modules.map((m) => m.title);
  const courseUse = `${ISSUE_HEADER}name: Using Crypto Lab in a course
description: Tell us where and how you use Crypto Lab in teaching. Nothing is listed publicly unless you tick the box.
title: "[Course use] "
body:
  - type: markdown
    attributes:
      value: |
        Thank you for telling us. Please leave out student names and any other personal information about students.
  - type: input
    id: institution
    attributes:
      label: Institution
    validations:
      required: true
  - type: input
    id: course
    attributes:
      label: Course
      description: Course name or number, if you would like to share it.
  - type: dropdown
    id: level
    attributes:
      label: Course level
      options:
${opts(LEVELS, '        ')}
    validations:
      required: true
  - type: dropdown
    id: module
    attributes:
      label: Module
      multiple: true
      options:
${opts([...titles, 'Individual exhibits, not a module'], '        ')}
    validations:
      required: true
  - type: input
    id: term
    attributes:
      label: Term
      placeholder: "Spring 2027"
    validations:
      required: true
  - type: textarea
    id: how
    attributes:
      label: How you use it
      description: Optional. Which exhibits, and whether in class, as homework or as a demonstration.
  - type: checkboxes
    id: listing
    attributes:
      label: Public listing
      options:
        - label: It is OK to list this institution and course publicly as using Crypto Lab.
          required: false
`;
  const problem = `${ISSUE_HEADER}name: Teaching material problem
description: A worksheet step that no longer matches its exhibit, an error in a module page, or an accessibility barrier.
title: "[Teaching material] "
labels: ["bug"]
body:
  - type: dropdown
    id: kind
    attributes:
      label: What kind of problem
      options:
        - "A worksheet step no longer matches its exhibit"
        - "An error in a module page or worksheet"
        - "Accessibility barrier"
        - "Privacy concern"
        - "Something else"
    validations:
      required: true
  - type: input
    id: page
    attributes:
      label: Page or exhibit
      description: The address of the teaching page or exhibit.
    validations:
      required: true
  - type: dropdown
    id: module
    attributes:
      label: Module
      options:
${opts([...titles, 'Not about a module'], '        ')}
  - type: input
    id: environment
    attributes:
      label: Browser, device and assistive technology
      description: For example the browser and its version, and a screen reader or magnifier if you use one.
  - type: textarea
    id: what
    attributes:
      label: What happened
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: What you expected
`;
  const request = `${ISSUE_HEADER}name: Request a module
description: Ask for a course module on a topic you teach.
title: "[Module request] "
labels: ["enhancement"]
body:
  - type: input
    id: course
    attributes:
      label: Course
      description: The course the module would serve.
    validations:
      required: true
  - type: dropdown
    id: level
    attributes:
      label: Course level
      options:
${opts(LEVELS, '        ')}
    validations:
      required: true
  - type: textarea
    id: topics
    attributes:
      label: Topics
      description: What students should come away able to do, and any exhibits you already have in mind.
    validations:
      required: true
  - type: input
    id: term
    attributes:
      label: Term
      placeholder: "Spring 2027"
  - type: textarea
    id: notes
    attributes:
      label: Anything else
`;
  const dir = path.join(ROOT, '.github', 'ISSUE_TEMPLATE');
  return [
    [path.join(dir, 'course-use.yml'), courseUse],
    [path.join(dir, 'teaching-material-problem.yml'), problem],
    [path.join(dir, 'request-a-module.yml'), request],
  ];
}

/* ---------- index.html: the card-to-module map ---------- */

function courseModulesBlock(modules) {
  const lines = modules.map((m) => `      { id: ${JSON.stringify(m.id)}, title: ${JSON.stringify(m.title)}, slugs: [${m.exhibits.map((x) => JSON.stringify(x.slug)).join(', ')}] }`);
  return `${BEGIN}\n    var COURSE_MODULES = [\n${lines.join(',\n')}\n    ];\n    ${END}`;
}

/* The "Teaching with Crypto Lab" band under the hero: one link per module. */
function bandModulesBlock(modules) {
  const items = modules.map((m) => `            <li><a href="teach/${m.id}/">${esc(m.title)}</a></li>`);
  return `${LIST_BEGIN}\n          <ul class="teach-band-modules" aria-label="Course modules">\n${items.join('\n')}\n          </ul>\n          ${LIST_END}`;
}

function withBandModules(html, modules) {
  const a = html.indexOf(LIST_BEGIN);
  const b = html.indexOf(LIST_END);
  if (a === -1 || b === -1 || b < a) {
    fail('index.html: the teach-build:modules markers are missing — the band\'s module links cannot be generated.');
    return html;
  }
  return html.slice(0, a) + bandModulesBlock(modules) + html.slice(b + LIST_END.length);
}

function withCourseModules(html, modules) {
  const a = html.indexOf(BEGIN);
  const b = html.indexOf(END);
  if (a === -1 || b === -1 || b < a) {
    fail('index.html: the teach-build:begin / teach-build:end markers are missing — the card chips cannot be generated.');
    return html;
  }
  return html.slice(0, a) + courseModulesBlock(modules) + html.slice(b + END.length);
}

/* ---------- lint ---------- */

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((x, y) => (x.name < y.name ? -1 : 1))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

function lint() {
  const problems = [];
  if (!fs.existsSync(TEACH)) return problems;
  for (const f of walk(TEACH)) {
    if (!/\.(html|md|json|css|js|txt)$|LICENSE$/.test(f)) continue;
    read(f).split('\n').forEach((line, k) => {
      const m = COUNT_RE.exec(line);
      if (m) problems.push(`${rel(f)}:${k + 1}: "${m[0]}" — a hardcoded catalog count; compute it or leave it out`);
    });
  }
  return problems;
}

/* ---------- main ---------- */

function build() {
  const cards = readCards();
  const cff = readCitation();
  const site = readJson(path.join(SRC, 'site.json')) || {};
  const evidence = readJson(path.join(SRC, 'evidence.json')) || {};
  const modules = readModules(cards);
  const worksheets = readWorksheets(modules);
  const files = new Map();
  if (errors.length) return { files, modules };
  files.set(path.join(TEACH, 'index.html'), landingPage(modules, worksheets, cards, cff, site, evidence));
  for (const m of modules) {
    files.set(path.join(TEACH, m.id, 'index.html'), modulePage(m, cff, site, worksheets));
    files.set(path.join(TEACH, m.id, 'anchors.json'), anchorsManifest(m, worksheets, site));
  }
  for (const w of worksheets) files.set(path.join(TEACH, w.module.id, w.name, 'index.html'), worksheetPage(w, cff, site));
  for (const [p, body] of issueForms(modules)) files.set(p, body);
  files.set(INDEX, withBandModules(withCourseModules(read(INDEX), modules), modules));
  return { files, modules };
}

/* Generated files that no source produces any more: index.html / anchors.json under
 * teach/, outside _src/. Hand-written assets (teach.css, teach.js, LICENSE) are not touched. */
function strays(files) {
  return walk(TEACH).filter((f) => !f.startsWith(SRC + path.sep) && f !== path.join(TEACH, 'index.html') &&
    /(^|[\\/])(index\.html|anchors\.json)$/.test(f) && !files.has(f));
}

function main() {
  const mode = process.argv[2] || 'write';
  if (mode === 'lint') {
    const p = lint();
    p.forEach((x) => console.error(x));
    console.log(p.length ? `Count lint: ${p.length} problem(s).` : 'Count lint: clean.');
    process.exit(p.length ? 1 : 0);
  }
  const { files, modules } = build();
  if (errors.length) {
    errors.forEach((e) => console.error('ERROR ' + e));
    process.exit(1);
  }
  const stale = strays(files);
  if (mode === 'check') {
    const differ = [...files].filter(([p, body]) => !fs.existsSync(p) || read(p) !== body).map(([p]) => rel(p));
    const problems = lint();
    differ.forEach((p) => console.error(`OUT OF DATE ${p}`));
    stale.forEach((p) => console.error(`STALE ${rel(p)} — no source generates it any more`));
    problems.forEach((p) => console.error(`COUNT ${p}`));
    if (differ.length || stale.length || problems.length) {
      console.error('Run: node tools/teach-build.js   (then commit the result; never hand-edit generated files)');
      process.exit(1);
    }
    console.log(`Teach pages in sync: ${modules.length} module(s), ${files.size} generated file(s); count lint clean.`);
    return;
  }
  if (mode !== 'write') { console.error(`Unknown mode ${mode}. Use: check | lint`); process.exit(2); }
  let wrote = 0;
  for (const [p, body] of files) {
    if (fs.existsSync(p) && read(p) === body) continue;
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
    wrote++;
    console.log(`wrote ${rel(p)}`);
  }
  for (const p of stale) { fs.unlinkSync(p); console.log(`removed ${rel(p)} (no source generates it)`); }
  const problems = lint();
  problems.forEach((p) => console.error(`COUNT ${p}`));
  console.log(`${wrote} file(s) written, ${files.size - wrote} unchanged.` + (problems.length ? ' Count lint FAILED.' : ''));
  if (problems.length) process.exit(1);
}

main();
