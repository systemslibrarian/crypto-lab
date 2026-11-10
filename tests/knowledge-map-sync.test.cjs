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
test('the two Cryptanalyst paths are an exact 12+9 partition of the original journey', () => {
  const data=build();
  const structure=data.paths.find(p=>p.id==='cryptanalyst');
  const implementation=data.paths.find(p=>p.id==='cryptanalyst-implementation');
  const structureSteps=[
    'Dead Sea Cipher', 'LFSR Forge', 'DVD Scramble', 'WEP Crack', 'AES Anatomy',
    'Biham Lens', 'Matsui Line', 'RSA Small Roots', 'Next Number', 'Nonce Lattice',
    'Entropy Collapse', 'Nonce Collision',
  ];
  const implementationSteps=[
    'Padding Oracle', 'Timing Oracle', 'Twist Trap', 'Power Trace', 'Masked Core',
    'Salamander', 'Frozen Heart', 'KyberSlash', 'Lattice Fault',
  ];
  assert.deepEqual(structure.steps,structureSteps);
  assert.deepEqual(implementation.steps,implementationSteps);
  const combined=[...structure.steps,...implementation.steps];
  assert.equal(combined.length,21);
  assert.equal(new Set(combined).size,21,'every former Cryptanalyst step must appear exactly once');
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
  for (const file of ['knowledge-map-sync.js','concept-sync.js','card-reader.js','path-level.js']) fs.copyFileSync(path.join(ROOT,'tools',file),path.join(dir,'tools',file));
  fs.writeFileSync(path.join(dir,'knowledge-map/catalog.json'),JSON.stringify(build(dir),null,2)+'\n');
  let p=spawnSync(process.execPath,[path.join(dir,'tools/knowledge-map-sync.js'),'check'],{encoding:'utf8'});
  assert.equal(p.status,0,p.stderr);
  edit(dir,'index.html','Seven classical factoring methods','Seven classical factorisation methods');
  p=spawnSync(process.execPath,[path.join(dir,'tools/knowledge-map-sync.js'),'check'],{encoding:'utf8'});
  assert.equal(p.status,1);
  assert.match(p.stderr,/Knowledge map is stale/);
});

/* The generator race, which is a different failure from a stale source. In the
   cases above a SOURCE moved and the saved map lagged. These are the shape a
   rebase produces: every source is current and the saved map itself is wrong,
   because a conflict in a generated file was resolved by hand, a hunk was
   dropped, or a copy was taken from the wrong branch. It is caught by the same
   byte comparison, and nothing pinned that until now -- so a future change that
   compared only sourceHashes would pass this suite while reopening exactly the
   failure the hashes cannot see. */
function stalable(t) {
  const dir = fixture(t);
  fs.mkdirSync(path.join(dir, 'tools'));
  fs.mkdirSync(path.join(dir, 'knowledge-map'));
  for (const file of ['knowledge-map-sync.js', 'concept-sync.js', 'card-reader.js', 'path-level.js']) {
    fs.copyFileSync(path.join(ROOT, 'tools', file), path.join(dir, 'tools', file));
  }
  const saved = path.join(dir, 'knowledge-map/catalog.json');
  fs.writeFileSync(saved, JSON.stringify(build(dir), null, 2) + '\n');
  const check = () => spawnSync(process.execPath, [path.join(dir, 'tools/knowledge-map-sync.js'), 'check'], { encoding: 'utf8' });
  const write = () => spawnSync(process.execPath, [path.join(dir, 'tools/knowledge-map-sync.js'), 'write'], { encoding: 'utf8' });
  /* The positive control, asserted FIRST: a freshly generated map passes. A
     suite whose gate rejected everything would satisfy every case below. */
  assert.equal(check().status, 0, 'a regenerated catalog must pass');
  return { dir, saved, check, write };
}

test('a hand-merged catalog fails even when every source hash is still valid', t => {
  const h = stalable(t);
  const d = JSON.parse(fs.readFileSync(h.saved, 'utf8'));
  const before = JSON.stringify(d.sourceHashes);
  d.concepts[0].title = 'Resolved by hand';
  fs.writeFileSync(h.saved, JSON.stringify(d, null, 2) + '\n');
  assert.equal(JSON.stringify(JSON.parse(fs.readFileSync(h.saved, 'utf8')).sourceHashes), before,
    'the control: sourceHashes are untouched, so hashes alone could not catch this');
  const p = h.check();
  assert.equal(p.status, 1);
  assert.match(p.stderr, /Knowledge map is stale/);
  assert.match(p.stderr, /do NOT hand-merge it/i, 'the remedy must name the rebase case');
  h.write();
  assert.equal(h.check().status, 0, 'regenerating must clear it');
});

test('a dropped hunk -- a concept missing from the saved map -- fails', t => {
  const h = stalable(t);
  const d = JSON.parse(fs.readFileSync(h.saved, 'utf8'));
  assert.ok(d.concepts.length > 1, 'the fixture must have something to drop');
  d.concepts.pop();
  fs.writeFileSync(h.saved, JSON.stringify(d, null, 2) + '\n');
  assert.equal(h.check().status, 1);
  h.write();
  assert.equal(h.check().status, 0);
});

test('conflict markers left in the saved map fail readably rather than crashing', t => {
  const h = stalable(t);
  const lines = fs.readFileSync(h.saved, 'utf8').split('\n');
  lines.splice(5, 0, '<<<<<<< HEAD', '  "wrong": true,', '=======', '  "other": true,', '>>>>>>> theirs');
  fs.writeFileSync(h.saved, lines.join('\n'));
  const p = h.check();
  assert.equal(p.status, 1);
  assert.match(p.stderr, /Knowledge map is stale/, 'the message names the file, not a JSON parse error');
  h.write();
  assert.equal(h.check().status, 0);
});
