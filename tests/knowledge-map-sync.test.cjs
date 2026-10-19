'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const {build} = require('../tools/knowledge-map-sync.js');
const ROOT = path.join(__dirname, '..');

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'knowledge-map-'));
  for (const file of ['index.html','concept-coverage.md']) fs.copyFileSync(path.join(ROOT,file),path.join(dir,file));
  fs.mkdirSync(path.join(dir,'teach/_src'),{recursive:true});
  fs.cpSync(path.join(ROOT,'teach/_src/modules'),path.join(dir,'teach/_src/modules'),{recursive:true});
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  return dir;
}
function edit(dir, file, from, to) {
  const source = fs.readFileSync(path.join(dir,file),'utf8');
  const changed = source.replace(from,to);
  assert(source !== changed,'the mutation must actually apply');
  fs.writeFileSync(path.join(dir,file),changed);
}
test('saved map matches every current source and retains the complete card population', () => {
  const data=build();
  assert.deepEqual(data,JSON.parse(fs.readFileSync(path.join(ROOT,'knowledge-map/catalog.json'),'utf8')));
  const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  const titles=[...html.matchAll(/class="project-title">([^<]+)</g)].map(m=>m[1].replace(/&amp;/g,'&'));
  assert.deepEqual(new Set(data.exhibits.map(e=>e.title)),new Set(titles));
  assert(data.paths.find(p=>p.id==='cryptanalyst').steps.includes('WEP Crack'));
  assert(data.concepts.find(c=>c.title==='Factoring').exhibits.includes('Factor Forge'));
});
test('source changes move the output; unchanged input is deterministic', t => {
  const dir=fixture(t),before=build(dir);
  edit(dir,'index.html','Seven classical factoring methods','Seven classical factorisation methods');
  assert.notDeepEqual(build(dir),before);
  assert.deepEqual(build(dir),build(dir));
});
test('module prerequisites come from the source instead of path order', t => {
  const dir=fixture(t);
  const file='teach/_src/modules/public-key.json';
  const m=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
  m.prerequisites=['Synthetic preparation control'];
  fs.writeFileSync(path.join(dir,file),JSON.stringify(m));
  assert.deepEqual(build(dir).modules.find(m=>m.id==='public-key').prerequisites,m.prerequisites);
});
test('a dangling path step fails rather than disappearing', t => {
  const dir=fixture(t);
  edit(dir,'index.html',"{ title: 'Babel Hash' }","{ title: 'Missing Lab' }");
  assert.throws(()=>build(dir),/Dangling authored exhibit: Missing Lab/);
});
test('a missing module lab fails rather than inventing a URL', t => {
  const dir=fixture(t);
  edit(dir,'teach/_src/modules/public-key.json','"rsa-forge"','"missing-lab"');
  assert.throws(()=>build(dir),/Unreadable module exhibit/);
});
test('duplicate card identifiers are refused', t => {
  const dir=fixture(t);
  edit(dir,'index.html','href="https://systemslibrarian.github.io/crypto-lab-phantom-vault/"','href="https://systemslibrarian.github.io/crypto-lab-drbg-arena/"');
  assert.throws(()=>build(dir),/Duplicate exhibit id/);
});
test('empty catalog and removed card markup cannot turn the population green', t => {
  const dir=fixture(t);
  edit(dir,'index.html',/class="project-card/g,'class="other-card');
  assert.throws(()=>build(dir),/Unreadable or empty catalog card population/);
});
test('freshness check catches an actual stale saved snapshot', t => {
  const dir=fixture(t);
  fs.mkdirSync(path.join(dir,'tools'));
  fs.mkdirSync(path.join(dir,'knowledge-map'));
  /* card-reader.js is the shared card matcher concept-sync.js imports (#125);
     a fixture that copies a fixed tool list has to copy its dependencies too. */
  for (const file of ['knowledge-map-sync.js','concept-sync.js','card-reader.js']) fs.copyFileSync(path.join(ROOT,'tools',file),path.join(dir,'tools',file));
  fs.writeFileSync(path.join(dir,'knowledge-map/catalog.json'),JSON.stringify(build(dir),null,2)+'\n');
  let p=spawnSync(process.execPath,[path.join(dir,'tools/knowledge-map-sync.js'),'check'],{encoding:'utf8'});
  assert.equal(p.status,0,p.stderr);
  edit(dir,'index.html','Seven classical factoring methods','Seven classical factorisation methods');
  p=spawnSync(process.execPath,[path.join(dir,'tools/knowledge-map-sync.js'),'check'],{encoding:'utf8'});
  assert.equal(p.status,1);
  assert.match(p.stderr,/Knowledge map is stale/);
});
