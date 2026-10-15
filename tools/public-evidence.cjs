#!/usr/bin/env node
/*
 * public-evidence.cjs — project the private evidence snapshot into the public
 * evidence/ explorer, and hold that published data to the reviewed projection.
 *
 * Run: node tools/public-evidence.cjs check
 * Prevents: a private field reaching the published evidence explorer, and its CSV exports drifting from the reviewed projection they are generated from
 * Reads: evidence/data/evidence.json, evidence/field-classification.json and the evidence/ file list; `import` additionally reads one pinned private snapshot by absolute path from OUTSIDE this repository
 *
 *   node tools/public-evidence.cjs import /abs/snapshot.json   project a pinned private snapshot
 *   node tools/public-evidence.cjs check                       exit non-zero on any drift
 *   node tools/public-evidence.cjs write                       rewrite the CSV exports
 *
 * Every published byte is pinned twice over: the private input must hash to
 * PIN.sha256 before anything is written, and the projection must hash to
 * PUBLIC_SHA256 before it is accepted as the reviewed one. `check` also refuses
 * any file under evidence/ or evidence/data/ that is not on its approved list,
 * so a new file cannot be published by appearing.
 */
'use strict';
// Offline, explicit projection. The private input must remain outside this repository.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'evidence/data');
const DISCLAIMER = 'associations are vocabulary-based, derived from source-backed algorithm records, and do not establish conformance, certification, or full protocol support.';
const PIN = Object.freeze({sha256:'be878bc9739e66d3407773dfb679b2bcc7485678a9bc1ed0f6d325e67d5645e2', captured_at:'2026-10-11T06:20:47.129646+00:00', completed_at:'2026-10-11T23:42:09.392Z', catalog_commit:'2dbd5ea44ee1a0fbf0bfbd13d0dcc9eb8507d00f'});
const PUBLIC_SHA256='5c2d3ed72dfe1a5f01586fedcf8ed2451e5bc3de49423c54394047d3aa7ef179';
const compare = (a,b) => a < b ? -1 : a > b ? 1 : 0;
const sortBy = (a,key) => a.sort((x,y)=>compare(key(x),key(y)));
const strings = a => [...new Set(a)].sort(compare);
const sha = x => typeof x === 'string' && /^[a-f0-9]{40}$/.test(x);
const slug = x => typeof x === 'string' && /^crypto-lab-[a-z0-9-]+$/.test(x);
const serial = x => JSON.stringify(x,null,2)+'\n';
const digest = x => crypto.createHash('sha256').update(x).digest('hex');
const relationKey = r => [r.source,r.type || '',r.target_kind,r.target].join('|');
const PUBLIC_LEAVES = new Set([
  'meta.hubSha','meta.retrievedAt','meta.completedAt',
  ...['slug','title','description','kicker','categories[]','level','demoUrl','currentSha','state','implementation','unscanned[]','references[]'].map(k=>'labs[].'+k),
  ...['name','kind','family','claimStatus','shape','at','evidence.url','evidence.status'].map(k=>'labs[].implements[].'+k),
  ...['name','at','evidence.url','evidence.status'].map(k=>'labs[].attacks[].'+k),
  ...['label','body','document','primitive'].map(k=>'labs[].standards[].'+k),
  ...['leftSlug','rightSlug','shared[]','statedDifference','sourceUrl'].map(k=>'overlaps[].'+k)
]);
const PRIVATE_PREFIXES = ['operations','meta.ciCheckedAt','meta.verificationReport','meta.providerSubsetRefresh','meta.sourceProviderSubsetRefresh','meta.toolProviderSubsetRefresh','meta.sourceSubsetRefresh','meta.catalogSubsetRefresh','meta.rekeySecuritySubsetRefresh','meta.currentEvidenceRefresh','meta.sourceCapture','meta.currentCiScope',
  ...['ci','flags','resolvedFlags','review','reviewFreshness','workflowFiles','testSummary','sourceRead','sourceDrift','anchorResults','anchorSummary','teachingSourceIdentity','verificationLimitations','commitMessage'].map(k=>'labs[].'+k)];
function classify(input) {
  const leaves = new Set();
  function visit(value,prefix) {
    if (Array.isArray(value)) { if(!value.length) leaves.add(prefix+'[]'); else value.forEach(v=>visit(v,prefix+'[]')); }
    else if(value && typeof value==='object') { if(!Object.keys(value).length) leaves.add(prefix); else for(const [k,v] of Object.entries(value)) visit(v,prefix ? prefix+'.'+k : k); }
    else leaves.add(prefix);
  }
  visit(input,'');
  return [...leaves].sort(compare).map(field=>({field,classification:PUBLIC_LEAVES.has(field)?'PUBLIC':PRIVATE_PREFIXES.some(p=>field===p||field.startsWith(p+'.')||field.startsWith(p+'[')||field.startsWith(p+'History'))?'PRIVATE':'UNSURE',action:PUBLIC_LEAVES.has(field)?'export':'exclude'}));
}
function project(raw) {
  assert.equal(raw.meta.schema,'crypto-lab-fleet-v1');
  const labs = sortBy(raw.labs.map(l=>({
    id:l.slug,title:l.title,summary:l.description,kicker:l.kicker,categories:strings(l.categories),level:l.level,
    demo_url:l.demoUrl,repository_url:'https://github.com/systemslibrarian/'+l.slug,source_commit:l.currentSha,
    evidence_state:l.state,implementation:l.implementation,partial_source_coverage:strings(l.unscanned),
    algorithms:sortBy(l.implements.map(a=>({name:a.name,kind:a.kind,family:a.family,claim_status:a.claimStatus,source_shape:a.shape,source_location:a.at,source_url:a.evidence.url,anchor_status:a.evidence.status})),a=>a.name+'|'+a.source_location),
    references:strings(l.references),
    attacks:sortBy(l.attacks.map(a=>({name:a.name,source_location:a.at,source_url:a.evidence.url,anchor_status:a.evidence.status})),a=>a.name+'|'+a.source_location),
    standards:sortBy(l.standards.map(s=>({label:s.label,body:s.body,document:s.document,algorithm:s.primitive})),s=>s.label+'|'+s.algorithm)
  })),l=>l.id);
  const algorithms = strings(labs.flatMap(l=>l.algorithms.map(a=>a.name))).map(name=>({name,labs:labs.filter(l=>l.algorithms.some(a=>a.name===name)).map(l=>l.id)}));
  const standards = strings(labs.flatMap(l=>l.standards.map(s=>s.label))).map(label=>{
    const matches=labs.flatMap(l=>l.standards.filter(s=>s.label===label));
    assert(matches.every(s=>s.body===matches[0].body && s.document===matches[0].document),'Inconsistent standard label');
    return {label,body:matches[0].body,document:matches[0].document,algorithms:strings(matches.map(s=>s.algorithm)),labs:labs.filter(l=>l.standards.some(s=>s.label===label)).map(l=>l.id)};
  });
  const relationships=[];
  for(const l of labs) {
    for(const a of l.algorithms) relationships.push({source:l.id,target:a.name,target_kind:'algorithm',type:'implemented',shared_algorithms:[],description:'Named implementation evidence; not a conformance result.',source_url:a.source_url});
    // Match the existing console: references already named as implementations are not repeated.
    for(const name of l.references.filter(n=>!l.algorithms.some(a=>a.name===n))) relationships.push({source:l.id,target:name,target_kind:'algorithm',type:'referenced',shared_algorithms:[],description:'Source reference; does not establish an implementation.',source_url:null});
    for(const a of l.attacks) relationships.push({source:l.id,target:a.name,target_kind:'attack',type:'attacks',shared_algorithms:[],description:'Indexed attack association; does not establish a working attack.',source_url:a.source_url});
  }
  // These catalog pairs do not have a semantic type. Keep it null, not "related".
  for(const o of raw.overlaps) relationships.push({source:o.leftSlug,target:o.rightSlug,target_kind:'lab',type:null,shared_algorithms:strings(o.shared),description:o.statedDifference,source_url:o.sourceUrl});
  sortBy(relationships,relationKey);
  const output={schema_version:'1.0.0',snapshot:{captured_at:raw.meta.retrievedAt,completed_at:raw.meta.completedAt,catalog_commit:raw.meta.hubSha,raw_sha256:PIN.sha256},disclaimer:DISCLAIMER,
    totals:{labs:labs.length,algorithms:algorithms.length,standards:standards.length,standard_associations:labs.reduce((n,l)=>n+l.standards.length,0),named_implementation_labs:labs.filter(l=>l.evidence_state==='known').length,na_reviewed_labs:labs.filter(l=>l.evidence_state==='na').length,partial_source_labs:labs.filter(l=>l.partial_source_coverage.length).length,algorithm_records:labs.reduce((n,l)=>n+l.algorithms.length,0),relationships:relationships.length,catalog_pairs:raw.overlaps.length},labs,algorithms,standards,relationships};
  validate(output);
  return output;
}
function exact(obj,keys,label) { assert(obj && typeof obj==='object' && !Array.isArray(obj),label+' must be an object'); assert.deepEqual(Object.keys(obj).sort(),keys.split(' ').sort(),label+' has missing or unapproved fields'); }
function text(value,label) { assert.equal(typeof value,'string',label); assert(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value),'Control character in '+label); assert(!/crypto-lab-fleet|chatgpt\.com|chatgpt\.site|Bearer\s+[A-Za-z0-9._~+/-]{24,}|gh[pousr]_[A-Za-z0-9]{20}|\/workspace\/|\/home\/|\/Users\//i.test(value),'Private marker in '+label); }
function stringArray(value,label) { assert(Array.isArray(value),label); value.forEach(v=>text(v,label)); assert.deepEqual(value,strings(value),label+' must be sorted and unique'); }
function sourceUrl(url,lab) {
  text(url,'source URL');
  const m=/^https:\/\/github\.com\/systemslibrarian\/(crypto-lab(?:-[a-z0-9-]+)?)\/blob\/([a-f0-9]{40})\/([^?#]+)#L([1-9][0-9]*)$/.exec(url);
  assert(m && (!lab || m[1]===lab),'Unapproved source URL: '+url);
  assert(!m[3].split('/').some(p=>p==='..'),'Traversal in source path');
}
function validate(d) {
  exact(d,'schema_version snapshot disclaimer totals labs algorithms standards relationships','dataset');
  assert.equal(d.schema_version,'1.0.0');assert.equal(d.disclaimer,DISCLAIMER);
  exact(d.snapshot,'captured_at completed_at catalog_commit raw_sha256','snapshot');
  for(const k of ['captured_at','completed_at','catalog_commit']) assert.equal(d.snapshot[k],PIN[k],'Snapshot pin '+k);
  assert.equal(d.snapshot.raw_sha256,PIN.sha256);
  const ids=new Set();
  for(const l of d.labs) {
    exact(l,'id title summary kicker categories level demo_url repository_url source_commit evidence_state implementation partial_source_coverage algorithms references attacks standards','lab');
    assert(slug(l.id) && !ids.has(l.id),'Duplicate/invalid lab');ids.add(l.id);
    for(const k of ['title','summary','kicker','level','implementation']) text(l[k],k);
    assert(['beginner','intermediate','advanced'].includes(l.level));assert(sha(l.source_commit));
    assert.equal(l.demo_url,'https://systemslibrarian.github.io/'+l.id+'/');assert.equal(l.repository_url,'https://github.com/systemslibrarian/'+l.id);
    assert(['known','na'].includes(l.evidence_state),'Unsupported evidence state in this pinned baseline');
    assert.equal(l.evidence_state==='known',l.algorithms.length>0);
    for(const k of ['categories','partial_source_coverage','references'])stringArray(l[k],k);
    for(const a of l.algorithms) {
      exact(a,'name kind family claim_status source_shape source_location source_url anchor_status','algorithm evidence');
      for(const k of ['name','kind','family','source_shape','source_location'])text(a[k],k);
      assert(['source-shape','reviewed-source'].includes(a.claim_status));assert.equal(a.anchor_status,'passed');sourceUrl(a.source_url,l.id);
    }
    for(const a of l.attacks) {exact(a,'name source_location source_url anchor_status','attack');text(a.name,'attack name');text(a.source_location,'attack location');assert.equal(a.anchor_status,'passed');sourceUrl(a.source_url,l.id);}
    for(const s of l.standards) {exact(s,'label body document algorithm','standard association');Object.values(s).forEach(v=>text(v,'standard'));assert.equal(s.label,s.body+':'+s.document);assert(l.algorithms.some(a=>a.name===s.algorithm),'Standard not backed by named algorithm');}
  }
  assert.deepEqual(d.labs.map(l=>l.id),strings(d.labs.map(l=>l.id)),'Lab ordering');
  const expectedAlgorithms=strings(d.labs.flatMap(l=>l.algorithms.map(a=>a.name))).map(name=>({name,labs:d.labs.filter(l=>l.algorithms.some(a=>a.name===name)).map(l=>l.id)}));
  assert.deepEqual(d.algorithms,expectedAlgorithms,'Algorithm index mismatch');
  const expectedStandards=strings(d.labs.flatMap(l=>l.standards.map(s=>s.label))).map(label=>{const items=d.labs.flatMap(l=>l.standards.filter(s=>s.label===label));return {label,body:items[0].body,document:items[0].document,algorithms:strings(items.map(s=>s.algorithm)),labs:d.labs.filter(l=>l.standards.some(s=>s.label===label)).map(l=>l.id)};});
  assert.deepEqual(d.standards,expectedStandards,'Standard index mismatch');
  const seen=new Set();
  for(const r of d.relationships) {
    exact(r,'source target target_kind type shared_algorithms description source_url','relationship');
    const key=relationKey(r);assert(!seen.has(key),'Duplicate relationship');seen.add(key);
    assert(ids.has(r.source),'Dangling relationship source');text(r.target,'relationship target');text(r.description,'relationship description');stringArray(r.shared_algorithms,'shared algorithms');
    const l=d.labs.find(l=>l.id===r.source);
    if(r.target_kind==='lab') {assert(ids.has(r.target),'Dangling catalog pair');assert.equal(r.type,null,'Invented catalog pair type');sourceUrl(r.source_url,'crypto-lab');}
    else {
      assert(['implemented','referenced','attacks'].includes(r.type),'Invented relationship type');
      assert.equal(r.target_kind,r.type==='attacks'?'attack':'algorithm');assert.deepEqual(r.shared_algorithms,[]);
      if(r.type==='implemented') assert(l.algorithms.some(a=>a.name===r.target && a.source_url===r.source_url));
      if(r.type==='referenced') {assert(l.references.includes(r.target) && !l.algorithms.some(a=>a.name===r.target));assert.equal(r.source_url,null);}
      if(r.type==='attacks') assert(l.attacks.some(a=>a.name===r.target && a.source_url===r.source_url));
      if(r.source_url)sourceUrl(r.source_url,r.source);
    }
  }
  assert.deepEqual(d.relationships.map(relationKey),[...seen].sort(compare),'Relationship ordering');
  const edgeCount=d.labs.reduce((n,l)=>n+l.algorithms.length+l.attacks.length+l.references.filter(x=>!l.algorithms.some(a=>a.name===x)).length,0);
  const totals={labs:d.labs.length,algorithms:d.algorithms.length,standards:d.standards.length,standard_associations:d.labs.reduce((n,l)=>n+l.standards.length,0),named_implementation_labs:d.labs.filter(l=>l.evidence_state==='known').length,na_reviewed_labs:d.labs.filter(l=>l.evidence_state==='na').length,partial_source_labs:d.labs.filter(l=>l.partial_source_coverage.length).length,algorithm_records:d.labs.reduce((n,l)=>n+l.algorithms.length,0),relationships:d.relationships.length,catalog_pairs:d.relationships.filter(r=>r.target_kind==='lab').length};
  assert.equal(d.relationships.length,edgeCount+totals.catalog_pairs,'Missing relationship edges');assert.deepEqual(d.totals,totals);
  assert.deepEqual([totals.labs,totals.algorithms,totals.standards,totals.named_implementation_labs,totals.na_reviewed_labs,totals.partial_source_labs],[228,175,80,221,7,7],'Baseline totals');
  return totals;
}
function cell(value) {
  let s=Array.isArray(value)?JSON.stringify(value):String(value ?? '');
  // Quote cells AND neutralize spreadsheet formulas; quotes alone are insufficient.
  if(/^[\s]*[=+\-@]/.test(s))s="'"+s;
  return '"'+s.replaceAll('"','""')+'"';
}
function csv(headers,rows) {return [headers,...rows].map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';}
function exportsFor(d) {
  validate(d);
  const metadata=['schema_version','snapshot_date','catalog_commit','total_labs','total_algorithms','total_standards'];
  const prefix=['1.0.0',d.snapshot.captured_at,d.snapshot.catalog_commit,d.totals.labs,d.totals.algorithms,d.totals.standards];
  const out={};
  out['labs.csv']=csv([...metadata,'lab_id','title','summary','categories','level','demo_url','repository_url','source_commit','evidence_state','implementation','partial_source_coverage','algorithms','standards'],d.labs.map(l=>[...prefix,l.id,l.title,l.summary,l.categories,l.level,l.demo_url,l.repository_url,l.source_commit,l.evidence_state,l.implementation,l.partial_source_coverage,l.algorithms.map(a=>a.name),strings(l.standards.map(s=>s.label))]));
  out['algorithms.csv']=csv([...metadata,'lab_id','algorithm','kind','family','claim_status','source_shape','source_location','source_url','anchor_status'],d.labs.flatMap(l=>l.algorithms.map(a=>[...prefix,l.id,a.name,a.kind,a.family,a.claim_status,a.source_shape,a.source_location,a.source_url,a.anchor_status])));
  out['standards.csv']=csv([...metadata,'lab_id','standard_label','body','document','algorithm'],d.labs.flatMap(l=>l.standards.map(s=>[...prefix,l.id,s.label,s.body,s.document,s.algorithm])));
  out['relationships.csv']=csv([...metadata,'source','target','target_kind','type','shared_algorithms','description','source_url'],d.relationships.map(r=>[...prefix,r.source,r.target,r.target_kind,r.type,r.shared_algorithms,r.description,r.source_url]));
  return out;
}
function main(argv) {
  const [mode,input] = argv;
  if(mode==='import') {
    assert(input,'Provide an absolute private snapshot path outside the repository');
    const full=fs.realpathSync(input);assert(path.isAbsolute(input) && !full.startsWith(ROOT+path.sep),'Private input must be outside the repository');
    const rawBytes=fs.readFileSync(full);assert.equal(digest(rawBytes),PIN.sha256,'Wrong snapshot bytes; no output written');
    const raw=JSON.parse(rawBytes),d=project(raw),fields=classify(raw);
    assert.equal(digest(serial(d)),PUBLIC_SHA256,'Projection differs from reviewed public baseline');
    const classification={schema_version:'1.0.0',counts:Object.fromEntries(['PUBLIC','PRIVATE','UNSURE'].map(c=>[c,fields.filter(f=>f.classification===c).length])),fields};
    fs.mkdirSync(DATA,{recursive:true});fs.writeFileSync(path.join(DATA,'evidence.json'),serial(d));
    fs.writeFileSync(path.join(ROOT,'evidence/field-classification.json'),serial(classification));
    for(const [name,value] of Object.entries(exportsFor(d)))fs.writeFileSync(path.join(DATA,name),value);
    console.log(JSON.stringify({totals:d.totals,field_classification:classification.counts}));
  } else if(mode==='check'||mode==='write') {
    const bytes=fs.readFileSync(path.join(DATA,'evidence.json'),'utf8'),d=JSON.parse(bytes);validate(d);assert.equal(bytes,serial(d),'Noncanonical JSON');
    assert.equal(digest(bytes),PUBLIC_SHA256,'Public data differs from the reviewed projection');
    for(const [name,value] of Object.entries(exportsFor(d))) {const p=path.join(DATA,name);if(mode==='write')fs.writeFileSync(p,value);else assert.equal(fs.readFileSync(p,'utf8'),value,'Stale '+name);}
    const approved=new Set(['evidence.json','labs.csv','algorithms.csv','standards.csv','relationships.csv','LICENSE']);
    for(const name of fs.readdirSync(DATA))assert(approved.has(name),'Unapproved public data file: '+name);
    const publicFiles=new Set(['data','index.html','app.js','style.css','README.md','REVIEW.md','field-classification.json']);
    for(const name of fs.readdirSync(path.join(ROOT,'evidence')))assert(publicFiles.has(name),'Unreviewed evidence file: '+name);
    const inventory=JSON.parse(fs.readFileSync(path.join(ROOT,'evidence/field-classification.json'),'utf8'));
    exact(inventory,'schema_version counts fields','classification inventory');assert.equal(inventory.schema_version,'1.0.0');
    assert.deepEqual(inventory.counts,{PUBLIC:36,PRIVATE:721,UNSURE:87});
    for(const f of inventory.fields){exact(f,'field classification action','classified field');text(f.field,'field path');assert(['PUBLIC','PRIVATE','UNSURE'].includes(f.classification));assert.equal(f.action,f.classification==='PUBLIC'?'export':'exclude');}
    assert.deepEqual(inventory.fields.map(f=>f.field),strings(inventory.fields.map(f=>f.field)));
    for(const key of ['PUBLIC','PRIVATE','UNSURE'])assert.equal(inventory.fields.filter(f=>f.classification===key).length,inventory.counts[key]);
    console.log(JSON.stringify({status:'passed',totals:d.totals,private_fields:0}));
  } else throw Error('Usage: node tools/public-evidence.cjs import /private/snapshot.json | check | write');
}
if(require.main===module)main(process.argv.slice(2));
module.exports={project,classify,validate,exportsFor,csv,cell,DISCLAIMER,PIN,serial,relationKey};
