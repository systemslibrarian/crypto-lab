'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),dir=path.join(root,'knowledge-map');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(dir,'guides.js'),'utf8'),context);
const {create,normalize}=require(path.join(dir,'map-model.js'));
const catalog=JSON.parse(fs.readFileSync(path.join(dir,'catalog.json'),'utf8'));
const guides=context.window.LearningGuides,prompts=context.window.LabPrompts,model=create(catalog,guides,prompts);
let checks=0;function check(value,message){assert(value,message);checks++;}
check(model.search('factorization').topics.some(t=>t.id==='7'),'factorization search');
check(model.search('RSA').topics.some(t=>t.id==='7'),'RSA alias');
check(model.search('zero knowledge').topics.some(t=>t.id==='21'),'zero knowledge alias');
check(model.search('nonce reuse').topics.length>0||model.search('nonce reuse').labs.length>0,'term search');
check(model.search('zzzz impossible token').topics.length===0,'empty search');
for(const c of catalog.concepts){
 check(model.topicLabs(c.id).length===c.exhibits.length,'complete topic '+c.id);
 for(const goal of ['understand','attack','deeper']){
  const r=model.route(c.id,goal);check(r.length>0&&r.every(e=>model.labs.has(e.id)),'route resolves '+c.id+'/'+goal);
  check(new Set(r.map(e=>e.id)).size===r.length,'route has no duplicates '+c.id+'/'+goal);
 }
 for(const link of model.connections(c.id)){
  check(link.topic!==c.id&&model.topics.has(link.topic),'valid connection');
  if(link.kind==='shared')check(link.shared.every(t=>c.exhibits.includes(t)&&model.topics.get(link.topic).exhibits.includes(t)),'shared links retain source membership');
 }
}
for(const p of catalog.paths)check(model.route('7','understand',p.id).map(e=>e.title).join('|')===p.steps.join('|'),'authored path order');
for(const e of catalog.exhibits)check(Boolean(model.topicForLab(e.id)),'all labs discoverable');
check(model.route('7','understand')[0].title==='Locks and Keys','accessible factoring start');
check(model.route('7','attack').some(e=>e.title==='Factor Forge'),'factoring attack route');
check(model.route('7','deeper').some(e=>e.title==='Shor'),'factoring quantum extension');
for(const m of catalog.modules)check(fs.existsSync(path.join(root,'teach',m.id,'index.html')),'module page '+m.id);
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
for(const script of ['guides.js','map-model.js','map.js'])check(html.includes('src="./'+script+'"')&&fs.existsSync(path.join(dir,script)),'runtime script '+script);
const mutated=JSON.parse(JSON.stringify(guides));mutated['7'].routes.understand.push('A Lab That Does Not Exist');
assert.throws(()=>create(catalog,mutated,prompts),/Unresolved guide lab/);checks++;
console.log(`Learning-map source/model checks: PASS (${checks} assertions; ${catalog.exhibits.length} labs, ${catalog.concepts.length} topics, ${Object.keys(guides).length} authored topic guides)`);
