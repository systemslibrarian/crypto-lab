#!/usr/bin/env node
/*
 * knowledge-map-sync.js — Generate and verify the learner-map catalog from cards, authored concepts, learning paths and course modules.
 *
 * Run: node tools/knowledge-map-sync.js check
 * Prevents: the learner map serving stale cards, missing authored neighbors or invented module requirements
 * Reads: index.html's cards and navigation literals, concept-coverage.md, teach/_src/modules/*.json,
 *        and knowledge-map/catalog.json for byte-for-byte freshness checks
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { parseConcepts } = require('./concept-sync.js');
const ROOT = path.join(__dirname, '..');
const decode = s => s.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(amp|apos|quot|lt|gt|rarr|pi);/g, (_, n) => ({amp:'&',apos:"'",quot:'"',lt:'<',gt:'>',rarr:'→',pi:'π'}[n]));
const list = s => s ? s.split(' | ').filter(Boolean) : [];
const roles = {intro:'Intro', 'break-it':'Break it', fix:'Fix', extension:'Extension'};

// Evaluate only the three checked-in data literals, never the page's runtime code.
function literal(html, name, open, close) {
  const prefix = 'var ' + name + ' = ';
  const start = html.indexOf(prefix + open);
  const end = html.indexOf(close + ';', start);
  if (start < 0 || end < 0) throw new Error('Missing navigation literal: ' + name);
  return JSON.parse(JSON.stringify(vm.runInNewContext('(' + html.slice(start + prefix.length, end + 1) + ')', {}, {timeout:1000})));
}

function build(root = ROOT) {
  const hashes = {};
  const read = file => {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    hashes[file] = crypto.createHash('sha256').update(text).digest('hex');
    return text;
  };
  const html = read('index.html');
  const sections = literal(html, 'SECTIONS', '[', ']');
  const sectionByTitle = literal(html, 'TITLE_TO_SECTION', '{', '}');
  const sectionsSet = new Set(sections.map(s => s.id));
  const exhibits = [];
  const anchors = [...html.matchAll(/<a\b[^>]*\bclass="[^"]*\bproject-card\b[^"]*"[^>]*>[\s\S]*?<\/a>/g)];
  const declared = [...html.matchAll(/<a\b[^>]*\bclass="[^"]*\bproject-card\b[^"]*"/g)].length;
  if (!declared || declared !== anchors.length) throw new Error('Unreadable or empty catalog card population');
  for (const [block] of anchors) {
    const attr = n => decode(new RegExp('\\s' + n + '="([^"]*)"').exec(block)?.[1] ?? '');
    const text = cls => decode(new RegExp('class="' + cls + '">([^<]+)<').exec(block)?.[1]?.trim().replace(/\s+/g, ' ') ?? '');
    const href = attr('href');
    const slug = /^https:\/\/systemslibrarian\.github\.io\/(crypto-lab-[a-z0-9-]+)\/$/.exec(href)?.[1];
    const title = text('project-title');
    const section = sectionByTitle[title];
    const level = attr('data-level');
    if (!slug || !title || !sectionsSet.has(section) || !['beginner','intermediate','advanced'].includes(level)) {
      throw new Error('Unreadable card metadata: ' + (title || href));
    }
    const terms = n => list(attr('data-' + n)).map(s => s.split('@')[0]);
    exhibits.push({id:slug.slice(11), title, kicker:text('card-kicker'), copy:text('project-copy'), href, level, section,
      wip:attr('class').split(/\s+/).includes('wip-card'), categories:attr('data-category').split('|').map(s=>s.trim()),
      chips:[...block.matchAll(/class="chip">([^<]+)</g)].map(m=>decode(m[1].trim())),
      implements:terms('implements'), attacks:terms('attacks'), standards:list(attr('data-standards')),
      unscanned:list(attr('data-unscanned'))});
  }
  for (const field of ['id', 'title']) {
    if (new Set(exhibits.map(e => e[field])).size !== exhibits.length) throw new Error('Duplicate exhibit ' + field);
  }
  const byTitle = new Map(exhibits.map(e => [e.title, e]));
  const bySlug = new Map(exhibits.map(e => ['crypto-lab-' + e.id, e]));
  const resolve = title => {
    if (!byTitle.has(title)) throw new Error('Dangling authored exhibit: ' + title);
    return title;
  };
  const paths = literal(html, 'LEARNING_PATHS', '[', ']').map(p => ({
    id:p.id, label:p.label, focus:p.focus, blurb:p.blurb,
    steps:p.steps.map(s => resolve(s.title)),
    sideTrip:p.sideTrip ? {...p.sideTrip, title:resolve(p.sideTrip.title)} : null,
  }));
  const md = read('concept-coverage.md');
  const concepts = parseConcepts(md).map(c => {
    const offset = md.indexOf('**' + c.num + '. ');
    const group = [...md.slice(0, offset).matchAll(/^## (.+)$/gm)].at(-1)?.[1] ?? '';
    return {id:c.num, number:c.num, title:c.title, status:c.status, group,
      exhibits:c.demos.filter(d => !d.uncatalogued).map(d => resolve(d.title))};
  });
  if (!concepts.length || !paths.length) throw new Error('No authored concepts or paths were read');
  const filed = new Set(concepts.flatMap(c => c.exhibits));
  for (const e of exhibits) if (!filed.has(e.title)) throw new Error('Unfiled exhibit: ' + e.title);
  const moduleDir = path.join(root, 'teach/_src/modules');
  const sources = fs.readdirSync(moduleDir).filter(f=>f.endsWith('.json')).sort().map(f=>JSON.parse(read('teach/_src/modules/' + f)));
  const modules = sources.sort((a,b)=>a.position-b.position).map(m => {
    if (!Array.isArray(m.prerequisites) || !m.prerequisites.length || m.prerequisites.some(p => typeof p !== 'string' || !p.trim())) throw new Error('Missing or invalid prerequisites: ' + m.id);
    return {id:m.id, label:m.title, prerequisites:m.prerequisites, href:'../teach/' + m.id + '/',
      exhibits:m.exhibits.map(e => {
        const card = bySlug.get('crypto-lab-' + e.name);
        if (!card || !roles[e.role] || !Number.isFinite(e.minutes)) throw new Error('Unreadable module exhibit: ' + m.id + '/' + e.name);
        return {title:card.title, role:roles[e.role], minutes:e.minutes + ' min'};
      })};
  });
  if (!modules.length) throw new Error('No course-module sources were read');
  for (const [label,items] of Object.entries({sections,paths,concepts,modules})) {
    if (items.some(item => typeof item.id !== 'string' || !/^[a-z0-9-]+$/.test(item.id)) || new Set(items.map(item => item.id)).size !== items.length) throw new Error('Invalid or duplicate identifiers: ' + label);
  }
  return {source:'Generated by tools/knowledge-map-sync.js from the authored catalog and course-module sources.',
    sourceHashes:hashes, sections, exhibits, concepts, paths, modules};
}

function main() {
  const mode = process.argv[2] || 'write';
  if (!['check','write'].includes(mode)) throw new Error('Usage: node tools/knowledge-map-sync.js [check|write]');
  const data = build();
  const output = JSON.stringify(data, null, 2) + '\n';
  const file = path.join(ROOT, 'knowledge-map/catalog.json');
  if (mode === 'check') {
    if (fs.readFileSync(file, 'utf8') !== output) throw new Error('Knowledge map is stale. Run node tools/knowledge-map-sync.js write and review the diff.');
  } else fs.writeFileSync(file, output);
  console.log(`Knowledge map ${mode}: PASS (${data.exhibits.length} exhibits, ${data.concepts.length} concepts, ${data.paths.length} paths, ${data.modules.length} modules)`);
}
if (require.main === module) {
  try { main(); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
module.exports = {build};
