(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const clean=s=>String(s??'').replace(/&mdash;/g,'—').replace(/&ndash;/g,'–').replace(/&nbsp;/g,' ');
 const esc=s=>clean(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 const goals={understand:{label:'Build intuition',number:'01'},attack:{label:'See it break',number:'02'},deeper:{label:'Go deeper',number:'03'}};
 const storageKey='crypto-lab-learning-map-progress-v2';
 const sessionKey='crypto-lab-learning-map-session-v3';
 let model,toastTimer,lastPaintedLab="",lastMapContext="";
 const state={topic:'7',lab:'',goal:'understand',level:'all',path:'',query:'',quiz:{},explored:new Set(),graphView:'labs',graphPage:0,notes:{},resumed:false};
 function loadProgress(){try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(saved))state.explored=new Set(saved.filter(id=>model.labs.has(id)));}catch{state.explored=new Set();}}
 function saveProgress(){try{localStorage.setItem(storageKey,JSON.stringify([...state.explored]));return true;}catch{return false;}}
 function saveSession(){try{localStorage.setItem(sessionKey,JSON.stringify({topic:state.topic,goal:state.goal,path:state.path,lab:state.lab,graphView:state.graphView,notes:state.notes}));return true;}catch{return false;}}
 function loadSession(){
  try{const saved=JSON.parse(localStorage.getItem(sessionKey)||'null');if(!saved||!model.topics.has(saved.topic))return false;
   state.topic=saved.topic;state.goal=goals[saved.goal]?saved.goal:'understand';state.path=model.catalog.paths.some(p=>p.id===saved.path)?saved.path:'';state.lab=model.labs.has(saved.lab)?saved.lab:'';state.graphView=saved.graphView==='concepts'?'concepts':'labs';
   if(saved.notes&&typeof saved.notes==='object'&&!Array.isArray(saved.notes))state.notes=Object.fromEntries(Object.entries(saved.notes).filter(([id,text])=>model.labs.has(id)&&typeof text==='string').map(([id,text])=>[id,text.slice(0,2000)]));return true;
  }catch{return false;}
 }
 function labCopy(e){return e.title==='Factor Forge'?'Compare seven factoring methods at toy sizes and see how factor size and structure affect their work. These examples do not estimate real RSA security.':e.copy;}
 function recommended(){return currentRoute().find(e=>!state.explored.has(e.id))||null;}
 function renderResume(){
  $('resume-card').hidden=!state.resumed;if(!state.resumed)return;
  const current=model.labs.get(state.lab),next=state.explored.has(state.lab)?model.nextStep(currentRoute(),state.lab,state.explored):current;
  $('resume-card').innerHTML=`<div><span class="eyebrow">PICK UP WHERE YOU LEFT OFF</span><strong>${esc(model.topicName(state.topic))} · ${esc(goals[state.goal].label)}</strong><p>${esc(current?.title||'Choose a lab')} ${state.explored.has(state.lab)?'is marked explored.':'was your last selected lab.'}</p></div><button type="button" data-resume="${esc(next?.id||current?.id||'')}">Continue ${esc(next?.title||current?.title||'learning')} →</button>`;
 }
 function renderPrimer(){
  const show=state.topic==='7'&&!state.path;$('topic-primer').hidden=!show;
  if(show&&window.FactorLesson)FactorLesson.mount($('factor-lesson'));
 }
 function toast(text){$('toast').textContent=text;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').textContent='',3000);}
 function currentRoute(){return model.route(state.topic,state.goal,state.path);}
 function currentTopic(){return model.topics.get(state.topic);}
 function link(){const p=new URLSearchParams({topic:state.topic,goal:state.goal});if(state.path)p.set('path',state.path);if(state.lab)p.set('lab',state.lab);return '#'+p.toString();}
 function readLink(){
  const p=new URLSearchParams(location.hash.slice(1));
  if(!['topic','goal','path','lab','view','scope'].some(key=>p.has(key)))return false;
  // Old preview links remain usable.
  const topic=p.get('topic')||(p.get('view')==='concept'?p.get('scope'):null);
  state.topic=model.topics.has(topic)?topic:'7';state.goal=goals[p.get('goal')]?p.get('goal'):'understand';
  state.path=model.catalog.paths.some(x=>x.id===(p.get('path')||(p.get('view')==='path'?p.get('scope'):null)))?(p.get('path')||p.get('scope')):'';
  state.lab=model.labs.has(p.get('lab'))?p.get('lab'):'';
  if(state.lab&&(!topic||state.path))state.topic=model.topicForLab(state.lab,state.topic)||'7';
  state.graphPage=0;return true;
 }
 function alignSelection(){
  const allowed=[...currentRoute(),...model.topicLabs(state.topic)];
  if(!allowed.some(e=>e.id===state.lab))state.lab=allowed.find(e=>!state.explored.has(e.id))?.id||allowed[0]?.id||'';
 }
 function levelTag(e){return `<span class="level-tag ${e.level}">${esc(e.level)}</span>`;}
 function renderNav(){
  const groups=[...new Set(model.catalog.concepts.map(t=>t.group))];
  document.querySelector('.all-topics > summary').textContent=`All ${model.catalog.concepts.length} topics`;
  $('featured-topics').innerHTML=`<span class="eyebrow">A FEW PLACES TO BEGIN</span>${['7','3','16','36','35'].map(id=>`<button class="featured-topic" type="button" data-topic="${id}" aria-current="${!state.path&&state.topic===id}">${esc(model.topicName(id))}<span aria-hidden="true">→</span></button>`).join('')}`;
  $('topics').innerHTML=groups.map(group=>`<details class="topic-group"${currentTopic().group===group?' open':''}><summary>${esc(group.replace(/^[IVX]+\.\s*/,'').replace(' (the trapdoor families)',''))}</summary>${model.catalog.concepts.filter(t=>t.group===group).map(t=>`<button type="button" data-topic="${esc(t.id)}" aria-current="${!state.path&&t.id===state.topic}"><span class="topic-index">${esc(t.number.padStart(2,'0'))}</span><span>${esc(model.topicName(t.id))}</span></button>`).join('')}</details>`).join('');
  $('paths').innerHTML=model.catalog.paths.map(p=>`<button class="path-nav" type="button" data-path="${esc(p.id)}" aria-current="${state.path===p.id}">${esc(p.label.replace(' Path',''))}</button>`).join('');
  $('progress-total').textContent=`${state.explored.size} ${state.explored.size===1?'lab':'labs'} explored`;
 }
 function renderHero(){
  const topic=currentTopic(),guide=model.guides[state.topic],path=model.catalog.paths.find(p=>p.id===state.path);
  $('breadcrumb').innerHTML=`<span>LEARNING MAP</span><span aria-hidden="true">/</span><span>${esc(path?'GUIDED JOURNEYS':topic.group.replace(/^[IVX]+\.\s*/,''))}</span>`;
  const title=path?path.label:model.topicName(state.topic),desc=path?path.blurb:guide?.summary||`Explore the labs filed under ${topic.title.toLowerCase()}. Begin with the lab that fits your background, then follow related concepts and the catalog's guided journeys.`;
  $('hero').innerHTML=`<section class="hero"><div class="hero-copy"><span class="eyebrow">${esc(path?'FOLLOW A GUIDED JOURNEY':guide?.question||'FOLLOW YOUR CURIOSITY')}</span><h1 tabindex="-1">${esc(title)}</h1><p>${esc(desc)}</p><div class="hero-meta"><span>${path?currentRoute().length:model.topicLabs(state.topic).length} labs to explore</span><span>${path?'Existing catalog path':'Choose your own pace'}</span><span>${model.catalog.exhibits.length} labs in the collection</span></div></div><div class="hero-stamp"><strong>${String(model.catalog.concepts.length).padStart(2,'0')}</strong>CONNECTED IDEAS</div></section>`;
  $('goal-switch').hidden=Boolean(path);
  $('goal-switch').innerHTML=Object.entries(goals).map(([key,g])=>`<button type="button" data-goal="${key}" aria-pressed="${state.goal===key}"><small>${g.number}</small>${g.label}</button>`).join('');
 }
 function revealSelectedGraph(){if(state.graphView!=='labs')return;const nodes=state.path?currentRoute():model.topicLabs(state.topic),index=nodes.findIndex(e=>e.id===state.lab);if(index>=0)state.graphPage=Math.floor(index/6);}
 function renderMap(){
  const concepts=model.connections(state.topic),labs=state.path?currentRoute():model.topicLabs(state.topic),isLabs=state.graphView==='labs';
  const journey=model.catalog.paths.find(p=>p.id===state.path),centerName=isLabs&&journey?journey.label:model.topicName(state.topic);
  const items=isLabs?labs:concepts,pageSize=6,pages=Math.max(1,Math.ceil(items.length/pageSize));
  state.graphPage=Math.min(Math.max(0,state.graphPage),pages-1);
  const shown=items.slice(state.graphPage*pageSize,(state.graphPage+1)*pageSize),next=recommended();
  const slots=[{x:3,y:24,side:'left',row:0},{x:68,y:24,side:'right',row:0},{x:3,y:160,side:'left',row:1},{x:68,y:160,side:'right',row:1},{x:3,y:296,side:'left',row:2},{x:68,y:296,side:'right',row:2}];
  const wires=shown.map((item,i)=>{const slot=slots[i],y=slot.y+56;return `<path class="${isLabs?'primary':''}" d="M${slot.side==='left'?380:620} 218 C${slot.side==='left'?'335 218 355':'665 218 645'} ${y} ${slot.side==='left'?315:685} ${y}"/>`;}).join('');
  const nodes=shown.map((item,i)=>{
   const slot=slots[i];
   if(isLabs){const current=item.id===state.lab,explored=state.explored.has(item.id),suggested=next?.id===item.id;return `<button type="button" class="node graph-node ${current?'selected':''}" style="left:${slot.x}%;top:${slot.y}px" data-lab="${esc(item.id)}" aria-current="${current}"><span class="eyebrow">${current?'SELECTED LAB':explored?'EXPLORED':suggested?'SUGGESTED NEXT':'CONNECTED LAB'}</span><strong>${esc(item.title)}</strong><span class="node-note">${esc(item.level)} · ${state.path?'on this journey':'filed under this concept'}</span><span class="node-arrow" aria-hidden="true">${explored?'✓':'↗'}</span></button>`;}
   return `<button type="button" class="node graph-node" style="left:${slot.x}%;top:${slot.y}px" data-topic="${esc(item.topic)}"><span class="eyebrow">${item.kind==='shared'?'SHARES A LAB':'RELATED IDEA'}</span><strong>${esc(model.topicName(item.topic))}</strong><span class="node-note">${esc(item.kind==='shared'?item.shared.length+' shared '+(item.shared.length===1?'lab':'labs'):'Authored connection')}</span><span class="node-arrow" aria-hidden="true">↗</span></button>`;
  }).join('');
  $('map-title').textContent=isLabs?'Choose a connected lab.':'Follow a connected idea.';
  $('concept-map').innerHTML=`<div class="graph-toolbar"><div role="group" aria-label="Choose map connections"><button type="button" data-graph-view="labs" aria-pressed="${isLabs}">Topic labs <span>${labs.length}</span></button><button type="button" data-graph-view="concepts" aria-pressed="${!isLabs}">Related ideas <span>${concepts.length}</span></button></div><p>${items.length?`${state.graphPage*pageSize+1}–${Math.min(items.length,(state.graphPage+1)*pageSize)} of ${items.length}`:'No shared or authored links'}</p></div><div class="concept-canvas network-canvas"><svg class="graph-wires" viewBox="0 0 1000 435" preserveAspectRatio="none" aria-hidden="true">${wires}</svg>${nodes}<div class="node node-center"><span class="eyebrow">${isLabs&&journey?'AUTHORED JOURNEY':state.path?'SELECTED LAB’S TOPIC':'YOU ARE EXPLORING'}</span><strong>${esc(centerName)}</strong><span class="node-note">${isLabs&&journey?'Selected lab explores '+esc(model.topicName(state.topic)):isLabs?'Select a lab to see its mission.':'Select an idea to expand its neighborhood.'}</span></div>${!items.length?'<p class="graph-empty">No explicit concept links are recorded here. Choose a lab or a guided journey to continue.</p>':''}</div>${pages>1?`<div class="graph-pager"><button type="button" data-graph-page="prev"${state.graphPage===0?' disabled':''}>← Previous connections</button><span>Page ${state.graphPage+1} / ${pages}</span><button type="button" data-graph-page="next"${state.graphPage===pages-1?' disabled':''}>More connections →</button></div>`:''}`;
  const detailLinks=isLabs?[]:shown;
  $('map-caption').innerHTML=`<div class="map-legend"><span><i class="legend-line ${isLabs?'':'dashed'}"></i>${isLabs?'Source: '+(state.path?'authored learning path':'catalog concept membership'):'Related ideas: shared labs or explained teaching guidance'}</span></div>${detailLinks.length?`<details class="connection-notes" open><summary>Why these ideas connect</summary><ul>${detailLinks.map(c=>`<li><button type="button" data-topic="${esc(c.topic)}">${esc(model.topicName(c.topic))} ↗</button><p>${esc(c.why)}</p></li>`).join('')}</ul></details>`:''}`;
 }
 function renderRoute(){
  const route=currentRoute(),done=route.filter(e=>state.explored.has(e.id)).length;
  const isGuide=Boolean(model.guides[state.topic]),next=recommended();
  $('route-title').textContent=state.path?'Follow the authored path.':goals[state.goal].label+'. One lab at a time.';
  $('route-progress').textContent=`${done} / ${route.length} explored`;
  const descriptions={understand:'Start with the idea, then make it concrete.',attack:'Explore the failure, then ask which assumption or defense matters.',deeper:'Continue into the mathematics and the construction details.'};
  $('route').innerHTML=`<p class="route-description">${esc(state.path?'The order comes from the existing Crypto Lab learning path.':descriptions[state.goal]+(isGuide?' This is a suggested route.':state.goal==='attack'?' Catalog suggestions prioritize labs filed under attacks.':state.goal==='deeper'?' Catalog suggestions prioritize advanced labs.':' Catalog suggestions are ordered by level.'))}</p><div class="route-list">${route.map((e,i)=>`<button type="button" class="route-step" data-lab="${esc(e.id)}" aria-current="${state.lab===e.id}"><span class="step-number ${state.explored.has(e.id)?'done':''}">${state.explored.has(e.id)?'✓':String(i+1).padStart(2,'0')}</span><div><h3>${esc(e.title)}${next?.id===e.id&&!state.explored.has(e.id)?'<span class="next-label">NEXT UNEXPLORED</span>':''}</h3><p>${esc(model.prompts[e.title]?.notice||e.kicker)}</p></div>${levelTag(e)}</button>`).join('')}</div>`;
 }
 function renderDetail(){
  const e=model.labs.get(state.lab);if(!e){$('lab-detail').innerHTML='<p>Select a lab to begin.</p>';return;}
  const prompt=model.prompts[e.title],courses=model.catalog.modules.filter(m=>m.exhibits.some(x=>x.title===e.title));
  const route=currentRoute(),index=route.findIndex(x=>x.id===e.id),next=model.nextStep(route,e.id,state.explored);
  const readiness=prompt?.prep||model.guides[state.topic]?.readiness||[];
  $('lab-detail').innerHTML=`<header><span class="eyebrow">${state.explored.has(e.id)?'EXPLORED · REVISIT ANYTIME':'YOUR NEXT SMALL STEP'}</span><h2 tabindex="-1">${esc(e.title)}</h2><div class="detail-tags">${levelTag(e)}${e.wip?'<span class="level-tag">Work in progress</span>':''}</div><p class="detail-copy">${esc(labCopy(e))}</p></header><section class="try-block"><h3>Try this</h3><p>${esc(prompt?.try||'Open the lab and follow its main interactive example. Change one input at a time and compare the result.')}</p></section><section class="try-block notice"><h3>What to notice</h3><p>${esc(prompt?.notice||'Explain the mechanism in your own words. Which assumptions does the example rely on, and what changes when its input changes?')}</p></section><div class="detail-actions"><a class="open-lab" href="${esc(e.href)}" target="_blank" rel="noopener noreferrer">Open ${e.wip?'WIP ':''}lab<span aria-hidden="true">↗</span></a>${!state.explored.has(e.id)&&next?`<button class="finish-step" type="button" data-finish="${esc(e.id)}">Explored this lab? Continue to ${esc(next.title)} →</button>`:''}<button class="mark-lab" type="button" data-progress="${esc(e.id)}" aria-pressed="${state.explored.has(e.id)}">${state.explored.has(e.id)?'✓ Explored · undo':'Mark as explored'}</button></div><details class="prep-notes" open><summary>What to know first</summary>${readiness.length?`<p>${prompt?.prep?'Preparation for this lab:':'Suggested preparation for the topic’s mathematical route:'}</p><ul>${readiness.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>No topic-specific preparation notes are authored for this topic yet.</p>'}${courses.map(m=>`<details class="module-prep"><summary>${esc(m.label)}: whole-module requirements</summary><ul>${m.prerequisites.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><a href="${esc(m.href)}">Open the course module ↗</a></details>`).join('')}</details>${next?`<div class="next-step"><span class="eyebrow">NEXT UNEXPLORED STEP</span><button type="button" data-lab="${esc(next.id)}">${esc(next.title)} <span aria-hidden="true">→</span></button></div>`:`<div class="next-step"><span class="eyebrow">${index<0?'OUTSIDE THIS ROUTE':'ROUTE CONTINUES AT YOUR PACE'}</span><p class="detail-copy">${index<0?'This lab is connected to the topic, but is not a step in this suggested route.':'No unexplored step follows this lab on the selected route.'} Try a related idea or choose another route.</p></div>`}<section class="reflection-block"><label for="reflection">Your observation</label><p>${esc(prompt?.reflect||'What changed when you changed one input? Which assumption made the result work?')}</p><textarea id="reflection" data-note="${esc(e.id)}" maxlength="2000" rows="3" placeholder="Write a thought to return to…">${esc(state.notes[e.id]||'')}</textarea><span id="note-status">Saved in this browser when storage is available.</span></section><details class="index-evidence"><summary>Catalog implementation notes</summary><p>Index terms describe recorded source evidence; they do not establish that every term is a full lesson or a cryptographic audit.</p><p><strong>Implementation index:</strong> ${esc(e.implements.length?e.implements.join(' · '):'UNKNOWN — no implementation terms recorded.')}</p>${e.implements.includes('N/A')?'<p>N/A means no named primitive in this index; it does not mean that the lab performs no computation.</p>':''}${e.implements.includes('NOT-SCANNED')?'<p>NOT-SCANNED means the relevant implementation source has not been read by the index scanner.</p>':''}${e.implements.includes('UNKNOWN')?'<p>UNKNOWN means the index has not established a named implementation.</p>':''}${e.unscanned?.length?`<p><strong>Source coverage is partial:</strong> ${esc(e.unscanned.join(' · '))}</p>`:''}</details><a class="share-selection" href="${esc(link())}" data-share>Copy a link to this selection ↗</a>`;
 }
 function renderLabs(){
  $('level-filter').innerHTML=['all','beginner','intermediate','advanced'].map(level=>`<button type="button" data-level="${level}" aria-pressed="${state.level===level}">${level==='all'?'All levels':level[0].toUpperCase()+level.slice(1)}</button>`).join('');
  const labs=(state.path?currentRoute():model.topicLabs(state.topic)).filter(e=>state.level==='all'||e.level===state.level);
  $('labs').innerHTML=`<div class="lab-grid">${labs.map(e=>`<button type="button" class="lab-card" data-lab="${esc(e.id)}" aria-current="${state.lab===e.id}"><span class="lab-kicker">${esc(e.kicker)}</span><h3>${esc(e.title)}</h3><p>${esc(labCopy(e))}</p><footer>${levelTag(e)}<span>${state.explored.has(e.id)?'Explored ✓':'Explore ↗'}</span></footer></button>`).join('')||'<p class="empty-state">No labs at this level in the current topic. Choose “All levels” to see the full selection.</p>'}</div>`;
 }
 function renderQuiz(){
  const quiz=model.guides[state.topic]?.quiz;$('checkpoint').hidden=!quiz||Boolean(state.path);if(!quiz)return;
  const answer=state.quiz[state.topic],answered=Number.isInteger(answer),correct=answer===quiz.correct;
  $('checkpoint').innerHTML=`<div><span class="eyebrow">PAUSE & CONNECT THE DOTS</span><h2>Did the idea click?</h2><p class="question">${esc(quiz.question)}</p></div><div><div class="checkpoint-options" role="group" aria-label="Answer the concept question">${quiz.answers.map((text,i)=>`<button type="button" data-answer="${i}" aria-pressed="${answer===i}" class="${answered&&i===quiz.correct?'correct':answer===i?'incorrect':''}"><span>${String.fromCharCode(65+i)}</span>${esc(text)}</button>`).join('')}</div>${answered?`<p class="quiz-feedback" role="status"><strong>${correct?'That’s the connection.':'Follow the distinction.'}</strong>${esc(quiz.explanation)}</p>`:''}</div>`;
 }
 function renderSearch(){
  const host=$('search-results'),q=state.query.trim();if(q.length<2){host.hidden=true;host.innerHTML='';$('search-status').textContent='';return;}
  const found=model.search(q);host.hidden=false;
  const topics=found.topics.map(t=>`<button type="button" data-topic="${esc(t.id)}"><span>${esc(model.topicName(t.id))}</span><small>TOPIC</small></button>`).join('');
  const labs=found.labs.map(e=>`<button type="button" data-search-lab="${esc(e.id)}"><span>${esc(e.title)}</span><small>${esc(e.level)}</small></button>`).join('');
  host.innerHTML=(topics?'<div class="result-heading">IDEAS TO EXPLORE</div>'+topics:'')+(labs?'<div class="result-heading">INTERACTIVE LABS</div>'+labs:'')||'<p class="search-empty">No matches yet. Try “RSA”, “hashing”, or “zero knowledge”.</p>';
  $('search-status').textContent=found.topics.length+found.labs.length?`${found.topics.length} topic and ${found.labs.length} lab results.`:'No matching topics or labs.';
 }
 function paint(mode='push'){
  const focused=document.activeElement,data=focused instanceof HTMLButtonElement?{...focused.dataset}:null;
  const region=focused?.closest('#concept-map,#route,#topics,#featured-topics,#paths,#lab-detail,#goal-switch,#labs,#level-filter,#checkpoint,#resume-card')?.id;
  alignSelection();if(state.path&&state.lab)state.topic=model.topicForLab(state.lab,state.topic)||state.topic;
  const context=state.topic+'|'+state.path;if(state.lab!==lastPaintedLab||context!==lastMapContext)revealSelectedGraph();lastPaintedLab=state.lab;lastMapContext=context;
  if(mode!=='none'&&location.hash!==link())history[mode==='replace'?'replaceState':'pushState'](null,'',link());
  saveSession();renderNav();renderHero();renderResume();renderPrimer();renderMap();renderRoute();renderDetail();renderLabs();renderQuiz();renderSearch();
  if(data){const area=region?$(region):document;const replacement=[...area.querySelectorAll('button')].find(b=>Object.keys(data).length&&Object.entries(data).every(([k,v])=>b.dataset[k]===v));(replacement||$('hero').querySelector('h1'))?.focus({preventScroll:true});}
 }
 function clearSearch(){state.query='';$('q').value='';renderSearch();}
 function closeTopicMenu(){$('topic-menu').classList.remove('mobile-open');$('topic-toggle').setAttribute('aria-expanded','false');if(window.matchMedia('(max-width: 760px)').matches)$('hero').querySelector('h1')?.focus({preventScroll:true});$('workspace').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
 function chooseTopic(id){if(!model.topics.has(id))return;state.resumed=false;state.topic=id;state.path='';state.lab='';state.level='all';state.graphPage=0;clearSearch();paint();closeTopicMenu();}
 function chooseLab(id,fromSearch=false){if(!model.labs.has(id))return;state.resumed=false;if(fromSearch){state.topic=model.topicForLab(id,state.topic)||state.topic;state.path='';state.level='all';}state.lab=id;if(state.path)state.topic=model.topicForLab(id,state.topic)||state.topic;clearSearch();paint();if(window.matchMedia('(max-width: 1050px)').matches)$('lab-detail').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
 function boot(data){
  model=CryptoMapModel.create(data,window.LearningGuides,window.LabPrompts);loadProgress();const resumed=loadSession(),explicit=readLink();state.resumed=resumed&&!explicit;paint('replace');
  $('source-stamp').textContent=`Crypto Lab catalog: ${model.catalog.exhibits.length} labs and ${model.catalog.concepts.length} topics. Labs open separately in their original Crypto Lab sites. No LLM is required.`;
  $('q').addEventListener('input',e=>{state.query=e.target.value;renderSearch();});
  $('q').addEventListener('focus',()=>{if(state.query.trim().length>1)renderSearch();});
  document.addEventListener('input',event=>{const el=event.target;if(el instanceof HTMLTextAreaElement&&el.dataset.note){state.notes[el.dataset.note]=el.value;const saved=saveSession();$('note-status').textContent=saved?'Saved in this browser.':'Available for this visit; browser storage was unavailable.';}});
  document.addEventListener('click',async event=>{
   const el=event.target instanceof Element?event.target:null,b=el?.closest('button');
   if(el?.closest('.skip')){event.preventDefault();$('workspace').focus();$('workspace').scrollIntoView({block:'start'});return;}
   if(el?.closest('[data-share]')){event.preventDefault();try{await navigator.clipboard.writeText(location.href);toast('Link copied.');}catch{toast('Copy the address from your browser to share this selection.');}return;}
   if(!b){if(!el?.closest('.global-search'))$('search-results').hidden=true;return;}
   if(b.dataset.resume){chooseLab(b.dataset.resume);return;}
   if(b.dataset.graphView){state.graphView=b.dataset.graphView;state.graphPage=0;revealSelectedGraph();saveSession();renderMap();$('concept-map').querySelector(`[data-graph-view="${state.graphView}"]`)?.focus({preventScroll:true});return;}
   if(b.dataset.graphPage){state.graphPage+=b.dataset.graphPage==='next'?1:-1;renderMap();$('concept-map').querySelector(`[data-graph-page="${b.dataset.graphPage}"]`)?.focus({preventScroll:true});return;}
   if(b.dataset.finish){state.resumed=false;const next=model.nextStep(currentRoute(),b.dataset.finish,state.explored);state.explored.add(b.dataset.finish);const saved=saveProgress();if(next)state.lab=next.id;paint();$('lab-detail').querySelector('h2')?.focus({preventScroll:true});if(window.matchMedia('(max-width: 1050px)').matches)$('lab-detail').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});toast(saved?'Your exploration is saved. Continue with the next lab.':'Progress updated for this visit; browser storage was unavailable.');return;}
   if(b.dataset.topic){chooseTopic(b.dataset.topic);return;}
   if(b.dataset.searchLab){chooseLab(b.dataset.searchLab,true);return;}
   if(b.dataset.lab){chooseLab(b.dataset.lab);return;}
   if(b.dataset.goal){state.resumed=false;state.goal=b.dataset.goal;state.lab='';state.level='all';state.graphPage=0;paint();return;}
   if(b.dataset.path){state.resumed=false;state.path=b.dataset.path;state.lab='';state.level='all';state.graphPage=0;clearSearch();const first=currentRoute()[0];state.topic=model.topicForLab(first?.id,state.topic)||state.topic;paint();closeTopicMenu();return;}
   if(b.dataset.level){state.level=b.dataset.level;renderLabs();$('level-filter').querySelector(`[data-level="${state.level}"]`)?.focus({preventScroll:true});return;}
   if(b.dataset.progress){const id=b.dataset.progress;state.explored.has(id)?state.explored.delete(id):state.explored.add(id);const saved=saveProgress();paint('none');toast(saved?(state.explored.has(id)?'Explored. Your next step is ready when you are.':'Removed from your explored labs.'):'Progress is available for this visit; this browser did not allow saving.');return;}
   if(b.dataset.answer!==undefined){state.quiz[state.topic]=Number(b.dataset.answer);renderQuiz();$('checkpoint').querySelector(`[data-answer="${b.dataset.answer}"]`)?.focus({preventScroll:true});return;}
   if(b.id==='topic-toggle'){const open=$('topic-menu').classList.toggle('mobile-open');b.setAttribute('aria-expanded',String(open));return;}
   if(b.id==='reset-progress'){state.explored.clear();const saved=saveProgress();paint('none');toast(saved?'Exploration progress reset.':'Progress reset for this visit only; browser storage was unavailable.');}
  });
  document.addEventListener('keydown',event=>{
   if(event.key==='Escape'){clearSearch();$('q').focus();}
   const editing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'');
   if(event.key==='/'&&!editing){event.preventDefault();$('q').focus();}
   if(event.key==='ArrowDown'&&document.activeElement===$('q')&&state.query.trim().length>1){renderSearch();event.preventDefault();$('search-results').querySelector('button')?.focus();}
  });
  window.addEventListener('popstate',()=>{if(readLink()){state.resumed=false;state.level='all';clearSearch();paint('none');}});
  window.addEventListener('hashchange',()=>{if(location.hash!==link()&&readLink()){state.resumed=false;state.level='all';clearSearch();paint('none');}});
  window.addEventListener('storage',e=>{if(e.key===storageKey){loadProgress();paint('none');}});
  window.CryptoLearningMap={getState:()=>({...state,explored:[...state.explored]}),model};
 }
 fetch('./catalog.json').then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json();}).then(boot).catch(()=>{
  $('hero').innerHTML='<section class="panel loading" role="alert"><h1>The learning map could not load.</h1><p>Reload this page to try again.</p></section>';
  $('goal-switch').hidden=true;document.querySelector('.workspace-grid').hidden=true;document.querySelector('.topic-labs').hidden=true;$('checkpoint').hidden=true;$('topic-primer').hidden=true;$('resume-card').hidden=true;
 });
})();
