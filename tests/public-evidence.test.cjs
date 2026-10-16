'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const os=require('node:os');
const {project,classify,validate,exportsFor,cell,DISCLAIMER}=require('../tools/public-evidence.cjs');
const {filterLabs,parseRoute,link,paginate,filterRelationships}=require('../evidence/app.js');
const root=path.join(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'evidence/data/evidence.json'),'utf8'));
const clone=()=>structuredClone(data);
function rawFixture(){return {meta:{schema:'crypto-lab-fleet-v1',hubSha:data.snapshot.catalog_commit,retrievedAt:data.snapshot.captured_at,completedAt:data.snapshot.completed_at},labs:data.labs.map(l=>({slug:l.id,title:l.title,description:l.summary,kicker:l.kicker,categories:l.categories,level:l.level,demoUrl:l.demo_url,currentSha:l.source_commit,state:l.evidence_state,implementation:l.implementation,unscanned:l.partial_source_coverage,references:l.references,implements:l.algorithms.map(a=>({name:a.name,kind:a.kind,family:a.family,claimStatus:a.claim_status,shape:a.source_shape,at:a.source_location,evidence:{url:a.source_url,status:a.anchor_status}})),attacks:l.attacks.map(a=>({name:a.name,at:a.source_location,evidence:{url:a.source_url,status:a.anchor_status}})),standards:l.standards.map(s=>({label:s.label,body:s.body,document:s.document,primitive:s.algorithm}))})),overlaps:data.relationships.filter(r=>r.target_kind==='lab').map(r=>({leftSlug:r.source,rightSlug:r.target,shared:r.shared_algorithms,statedDifference:r.description,sourceUrl:r.source_url}))};}
test('pinned public baseline, exact disclaimer and deterministic CSV freshness',()=>{
  assert.equal(validate(data).labs,228);assert.equal(data.disclaimer,DISCLAIMER);
  const result=cp.spawnSync(process.execPath,['tools/public-evidence.cjs','check'],{cwd:root,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  for(const [name,value]of Object.entries(exportsFor(data)))assert.equal(fs.readFileSync(path.join(root,'evidence/data',name),'utf8'),value);
});
test('wrong or in-checkout private inputs are rejected before any output write',()=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'public-evidence-test-'));
  const before=fs.readFileSync(path.join(root,'evidence/data/evidence.json'),'utf8');
  try {
    const file=path.join(tmp,'wrong.json');fs.writeFileSync(file,'{"operations":{"note":"DO_NOT_EXPORT"}}');
    for(const input of [file,path.join(root,'evidence/data/evidence.json')]){
      const r=cp.spawnSync(process.execPath,['tools/public-evidence.cjs','import',input],{cwd:root,encoding:'utf8'});
      assert.notEqual(r.status,0);assert.equal(fs.readFileSync(path.join(root,'evidence/data/evidence.json'),'utf8'),before);
    }
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
});
test('explicit projection drops private and unknown fields at every input depth',()=>{
  const raw=rawFixture();const secret='DO_NOT_EXPORT_PRIVATE_SENTINEL';
  raw.operations={work:[{request:secret}],notes:secret};raw.futureRoot={secret};raw.meta.refreshHistory={token:secret};
  for(const l of raw.labs){l.notes=secret;l.ci={logs:secret};l.futureLab={secret};for(const a of l.implements){a.privateKey=secret;a.evidence.snippet=[{text:secret}];a.evidence.future=secret;}for(const s of l.standards)s.note=secret;}
  for(const r of raw.overlaps)r.workId=secret;
  assert.deepEqual(project(raw),data);assert(!JSON.stringify(project(raw)).includes(secret));
  const fields=classify(raw);assert.equal(fields.find(f=>f.field==='operations.notes').classification,'PRIVATE');assert.equal(fields.find(f=>f.field==='futureRoot.secret').classification,'UNSURE');assert(fields.filter(f=>f.classification!=='PUBLIC').every(f=>f.action==='exclude'));
});
test('shuffled input gives byte-identical public output',()=>{
  const raw=structuredClone(rawFixture());raw.labs.reverse();raw.overlaps.reverse();for(const l of raw.labs){l.implements.reverse();l.attacks.reverse();l.references.reverse();l.standards.reverse();l.categories.reverse();l.unscanned.reverse();}
  assert.deepEqual(project(raw),data);
});
test('output validator fails closed for private keys, private URLs and tokens',()=>{
  for(const inject of [d=>d.operations={},d=>d.labs[0].note='private',d=>d.labs[0].algorithms[0].evidence={raw:'private'},d=>d.labs[0].summary='https://crypto-lab-fleet.systemslibrarian.chatgpt.site/#work',d=>d.labs[0].summary='Bearer '+ 'x'.repeat(40),d=>d.labs[0].algorithms[0].source_url='javascript:alert(1)']){const d=clone();inject(d);assert.throws(()=>validate(d));}
});
test('missing edges, dangling IDs, invented types, false totals and unsupported standards fail',()=>{
  for(const mutate of [d=>d.relationships.pop(),d=>d.relationships[0].source='crypto-lab-missing',d=>d.relationships.find(r=>r.target_kind==='lab').type='background',d=>d.totals.standards=81,d=>d.labs[0].standards[0].algorithm='NOT IMPLEMENTED',d=>d.algorithms[0].labs.pop(),d=>d.snapshot.catalog_commit='0'.repeat(40)]){const d=clone();mutate(d);assert.throws(()=>validate(d));}
});
test('CSV quoting prevents formulas including leading whitespace',()=>{
  for(const value of ['=SUM(A1:A2)',' +cmd','-1+1','@SUM(A1)','\t=1'])assert(cell(value).startsWith('"\''));
  assert.equal(cell('a,"b"\nc'),'"a,""b""\nc"');
  assert.equal(cell(['one','two']),'"[""one"",""two""]"');
});
test('evidence, coverage, category, algorithm and standards filters compose',()=>{
  assert.equal(filterLabs(data,{state:'known'}).length,221);assert.equal(filterLabs(data,{state:'na'}).length,7);assert.equal(filterLabs(data,{coverage:'partial'}).length,7);
  const selected=filterLabs(data,{algorithm:'AES',standard:'NIST:FIPS 197'});assert(selected.length>0);assert(selected.every(l=>l.algorithms.some(a=>a.name==='AES')&&l.standards.some(s=>s.label==='NIST:FIPS 197')));
  assert.equal(filterLabs(data,{q:'a query that no lab contains'}).length,0);assert.equal(filterLabs(data,{}).length,228);
  assert(filterLabs(data,{category:'POST-QUANTUM'}).every(l=>l.categories.includes('POST-QUANTUM')));
});
test('hash routes round-trip punctuation, preserve lab details, and bound pagination',()=>{
  const p={q:'SHA-256 & AES',standard:'NIST:SP 800-38D'};assert.deepEqual(parseRoute(link('labs',p)).p,p);
  assert.equal(parseRoute('#lab/crypto-lab-aes-modes').id,'crypto-lab-aes-modes');assert.equal(parseRoute('#lab/%ZZ').id,null);assert.equal(parseRoute('#bad').view,'overview');
  assert.equal(paginate(data.labs,-1).page,1);assert.equal(paginate(data.labs,1e99).page,8);assert.equal(paginate([],3).page,1);
  const all=Array.from({length:8},(_,i)=>paginate(data.labs,i+1).items).flat();assert.deepEqual(all,data.labs);
});
test('relationship filters preserve real types and untyped catalog pairs',()=>{
  assert.equal(filterRelationships(data,{type:'untyped'}).length,72);assert.equal(filterRelationships(data,{type:'implemented'}).length,942);assert.equal(filterRelationships(data,{type:'referenced'}).length,1721);assert.equal(filterRelationships(data,{type:'attacks'}).length,511);
  assert(filterRelationships(data,{q:'AES'}).length>0);
});
test('public page has no remote requests or operator affordances',()=>{
  const js=fs.readFileSync(path.join(root,'evidence/app.js'),'utf8'),html=fs.readFileSync(path.join(root,'evidence/index.html'),'utf8');
  assert.deepEqual([...js.matchAll(/fetch\(([^)]*)\)/g)].map(m=>m[1]),["'data/evidence.json'"]);
  assert(!/localStorage|sessionStorage|XMLHttpRequest|sendBeacon|WebSocket|innerHTML|document\.write|\/api\//.test(js));
  assert(html.includes('Content-Security-Policy'));assert(html.includes('data/labs.csv'));assert(!/<(?:script|link)[^>]+(?:src|href)="https?:/i.test(html));
});
test('overview comparisons explain a distinction without changing snapshot records',()=>{
  const {featuredPairs,hasDistinction}=require('../evidence/app.js');
  const before=JSON.stringify(data),featured=featuredPairs(data);
  assert.equal(featured.length,4);assert(featured.every(hasDistinction));
  const explained=filterRelationships(data,{type:'untyped',detail:'explained'});
  const missing=filterRelationships(data,{type:'untyped',detail:'missing'});
  assert(explained.length>0);assert(missing.length>0);
  assert.equal(explained.length+missing.length,72);
  assert(missing.every(r=>!hasDistinction(r)));assert.equal(JSON.stringify(data),before);
  assert.equal(filterRelationships(data,{type:'implemented',detail:'explained'}).length,0);
});
