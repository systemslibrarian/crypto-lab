import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {entries} from '../learn/understanding-cryptography/chapters.mjs';
import {renderReadingPath} from '../learn/understanding-cryptography/build.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'learn/understanding-cryptography');
const catalogText = fs.readFileSync(path.join(root, 'CATALOG.md'), 'utf8');
const html = () => fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('the published 14-chapter sequence has one separately identified SHA-3 focus', () => {
  assert.deepEqual(entries.filter(entry => entry.kind === 'chapter').map(entry => entry.chapter), Array.from({length:14}, (_, i) => i + 1));
  assert.equal(entries.length, 15);
  const focus = entries.filter(entry => entry.kind === 'focus');
  assert.equal(focus.length, 1);
  assert.equal(focus[0].id, 'sha3-focus');
  assert.equal(focus[0].chapter, 11);
  assert.match(focus[0].sections, /11\.5/);
  assert.deepEqual(entries.slice(10, 13).map(entry => entry.id), ['chapter-11', 'sha3-focus', 'chapter-12']);
  assert.match(entries.find(entry => entry.chapter === 12).bookTitle, /Post.Quantum/i);
  assert.match(entries.find(entry => entry.chapter === 13).bookTitle, /Message Authentication/i);
  assert.match(entries.find(entry => entry.chapter === 14).bookTitle, /Key Management/i);
  for (const entry of entries) {
    for (const field of ['bookTitle', 'title', 'sections', 'predict', 'try', 'reflect', 'limit']) assert.ok(entry[field]?.trim(), `${entry.id}: ${field}`);
    assert.ok(entry.labs.length, `${entry.id}: at least one scoped connection`);
    for (const lab of entry.labs) {
      assert.ok(catalogText.includes('[`' + lab.slug + '`]('), `${entry.id}: ${lab.slug} is catalogued`);
      assert.ok(lab.note?.trim(), `${entry.id}: connection explains its scope`);
      assert.ok(['direct', 'modern', 'intro'].includes(lab.coverage));
    }
  }
  assert.equal(html(), renderReadingPath(), 'generated page matches current activities and catalog');
});

test('the static page contains all activities and usable links before JavaScript runs', () => {
  const output = html();
  assert.equal([...output.matchAll(/<article class="panel chapter"/g)].length, 15);
  for (const entry of entries) {
    assert.ok(output.includes(`id="${entry.id}"`));
    for (const field of ['predict', 'try', 'reflect', 'limit']) assert.ok(output.includes(esc(entry[field])), `${entry.id}: ${field} is in static HTML`);
    assert.match(output, new RegExp(`href="#${entry.id}"`), `${entry.id}: contents link`);
    assert.match(output, new RegExp(`data-entry="${entry.id}" disabled`), 'optional progress starts disabled without JavaScript');
  }
  assert.match(output, /id="reader-controls" hidden/);
  assert.match(output, /<noscript>[\s\S]*All 14 chapter entries, the SHA-3 focus/);
  assert.match(output, /No author or publisher endorsement is implied/);
  assert.match(output, /No book text, figures, exercises or solutions are reproduced or rehosted/);
  assert.match(output, /blob\/main\/audits\/UNDERSTANDING-CRYPTOGRAPHY-GAP-CHECK-2026-10-21\.md/);
  assert.match(output, /blob\/main\/CATALOG\.md/);
  assert.match(output, /tree\/main\/learn\/understanding-cryptography/);
  assert.doesNotMatch(output, /draft\/understanding-cryptography-2e|Draft independent companion|This draft’s|Draft source/);
  const ids = [...output.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'no duplicate anchor or label IDs');
  for (const [, id] of output.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `anchor ${id} resolves`);
  const checkedStyles = new Set();
  function checkStylesheet(file) {
    if (checkedStyles.has(file)) return;
    checkedStyles.add(file);
    for (const [, imported] of fs.readFileSync(file, 'utf8').matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?/g)) {
      if (/^(https?:|\/\/|data:)/.test(imported)) continue;
      const dependency = path.resolve(path.dirname(file), imported.split(/[?#]/)[0]);
      assert.ok(fs.existsSync(dependency), `imported stylesheet ${imported} exists`);
      checkStylesheet(dependency);
    }
  }
  for (const [, url] of output.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|#)/.test(url)) continue;
    const file = path.resolve(dir, url.split('#')[0]);
    assert.ok(fs.existsSync(file), `local resource ${url} exists`);
    if (path.extname(file) === '.css') checkStylesheet(file);
  }
});

test('generation uses per-lab catalog titles and URLs, and refuses uncatalogued connections', () => {
  const first = entries[0].labs[0].slug;
  const pattern = new RegExp('(^### )([^\\n]+)(\\r?\\n\\r?\\n\\[\\x60' + first + '\\x60\\]\\()(https:\\/\\/[^)]+)(\\))', 'm');
  assert.ok(pattern.test(catalogText), 'fixture identifies the lab block, not the reverse index');
  const changed = catalogText.replace(pattern, '$1Catalog-only test title$3https://example.test/catalog-sourced/$5');
  const generated = renderReadingPath(entries, changed);
  assert.ok(generated.includes('<a href="https://example.test/catalog-sourced/">Catalog-only test title</a>'));
  const uncatalogued = structuredClone(entries);
  uncatalogued[0].labs[0].slug = 'crypto-lab-not-in-the-catalog';
  assert.throws(() => renderReadingPath(uncatalogued, catalogText), /Missing catalog lab: crypto-lab-not-in-the-catalog/);
});

// A small DOM boundary exercises the shipped script's user events without adding
// a browser dependency to this static site's Node test suite.
function reader({saved = '[]', storageFails = false, hash = ''} = {}) {
  function element(data = {}) {
    const listeners = new Map();
    return {
      value:'', hidden:false, disabled:true, checked:false, textContent:'', dataset:{}, ...data,
      addEventListener(type, callback) { listeners.set(type, [...(listeners.get(type) || []), callback]); },
      fire(type) { for (const callback of listeners.get(type) || []) callback(); }
    };
  }
  const nodes = new Map(['search', 'part', 'coverage', 'clear', 'clear-progress', 'reader-controls', 'results', 'empty', 'progress', 'storage-note'].map(id => [id, element()]));
  nodes.get('part').value = nodes.get('coverage').value = 'all';
  const cards = entries.map(entry => element({
    id:entry.id,
    dataset:{chapter:String(entry.chapter), sections:entry.sections, part:entry.part, coverage:entry.coverage},
    textContent:[entry.bookTitle, entry.title, entry.sections, entry.predict, entry.try, entry.reflect, entry.limit, ...entry.labs.map(lab => lab.note)].join(' '),
    classList:{contains:name => name === 'chapter'},
    scrollIntoView() { this.scrolled = true; }
  }));
  for (const card of cards) nodes.set(card.id, card);
  const boxes = entries.map(entry => element({dataset:{entry:entry.id}}));
  const links = entries.map(entry => element({getAttribute:() => `#${entry.id}`}));
  const window = element();
  const writes = [];
  const context = {
    document:{
      getElementById:id => nodes.get(id) || null,
      querySelectorAll:selector => ({'.chapter':cards, 'input[data-entry]':boxes, 'a[href^="#"]':links}[selector] || [])
    },
    window,
    location:{hash},
    localStorage:{
      getItem() { if (storageFails) throw new Error('Storage denied'); return saved; },
      setItem(key, value) { if (storageFails) throw new Error('Storage denied'); writes.push({key, value}); }
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(dir, 'app.mjs'), 'utf8'), context);
  return {nodes, cards, boxes, links, window, writes, context, visible:() => cards.filter(card => !card.hidden).map(card => card.id)};
}

test('chapter and section searches distinguish the SHA-3 focus and compose with filters', () => {
  const ui = reader();
  ui.nodes.get('search').value = 'chapter 11';
  ui.nodes.get('search').fire('input');
  assert.deepEqual(ui.visible(), ['chapter-11', 'sha3-focus']);
  for (const query of ['section11.5', 'section 11.5', '§11.5', 'chapter 11 section 11.5']) {
    ui.nodes.get('search').value = query;
    ui.nodes.get('search').fire('input');
    assert.ok(ui.visible().includes('sha3-focus'), `${query} finds SHA-3`);
    assert.ok(ui.visible().every(id => id === 'sha3-focus' || id === 'chapter-11'), `${query} does not match unrelated chapters`);
  }
  ui.nodes.get('part').value = 'Key management';
  ui.nodes.get('part').fire('input');
  assert.deepEqual(ui.visible(), []);
  assert.equal(ui.nodes.get('empty').hidden, false);
  ui.nodes.get('clear').fire('click');
  assert.equal(ui.visible().length, 15);
  assert.equal(ui.nodes.get('empty').hidden, true);
});

test('chapter 11 and its focus keep separate progress; invalid saved IDs are ignored', () => {
  const ui = reader({saved:JSON.stringify(['chapter-11', 'sha3-focus', 'unknown', 11, null, 'chapter-11'])});
  assert.equal(ui.nodes.get('progress').textContent, '2 of 15 explored');
  const chapter = ui.boxes.find(box => box.dataset.entry === 'chapter-11');
  const focus = ui.boxes.find(box => box.dataset.entry === 'sha3-focus');
  chapter.checked = false;
  chapter.fire('change');
  assert.equal(focus.checked, true);
  assert.equal(ui.nodes.get('progress').textContent, '1 of 15 explored');
  assert.equal(ui.writes.at(-1).key, 'crypto-lab-understanding-cryptography-2e-progress-v1');
  assert.deepEqual(JSON.parse(ui.writes.at(-1).value), ['sha3-focus']);
  ui.nodes.get('clear-progress').fire('click');
  assert.equal(ui.nodes.get('progress').textContent, '0 of 15 explored');
  assert.equal(ui.boxes.every(box => !box.checked), true);
});

test('blocked storage and filtered deep links never block reading', () => {
  const ui = reader({storageFails:true});
  assert.equal(ui.nodes.get('reader-controls').hidden, false);
  assert.equal(ui.boxes.every(box => !box.disabled), true);
  ui.boxes[0].checked = true;
  ui.boxes[0].fire('change');
  assert.equal(ui.nodes.get('progress').textContent, '1 of 15 explored');
  assert.match(ui.nodes.get('storage-note').textContent, /this visit only/);
  ui.nodes.get('search').value = 'no-such-cryptographic-topic';
  ui.nodes.get('search').fire('input');
  assert.equal(ui.visible().length, 0);
  ui.context.location.hash = '#sha3-focus';
  ui.window.fire('hashchange');
  assert.equal(ui.nodes.get('sha3-focus').hidden, false);
  assert.equal(ui.nodes.get('sha3-focus').scrolled, true);
  ui.context.location.hash = '#%broken';
  assert.doesNotThrow(() => ui.window.fire('hashchange'));
});
