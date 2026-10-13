(function (root, factory) { if(typeof module==='object'&&module.exports) module.exports=factory();else root.CryptoMapModel=factory(); })(typeof window==='undefined'?globalThis:window, function () {
 'use strict';
 const names={"1":"Perfect secrecy","2":"Randomness & entropy","3":"Hash functions","4":"Cipher structure","5":"Message authentication","6":"Key derivation","7":"Factorization","8":"Discrete logarithms","9":"Pairings","10":"Lattices","11":"Code-based cryptography","12":"Multivariate cryptography","13":"Isogenies","14":"Hash-based signatures","15":"Time & delay","16":"Key exchange","17":"Password-based key exchange","18":"Commitments","19":"Secret sharing","20":"Secure computation","21":"Zero knowledge","22":"Homomorphic encryption","23":"Access-pattern privacy","23b":"Deniability","24":"Anonymity","25":"Trust & transparency","26":"Identity & authentication","27":"Side channels","28":"Nonce misuse","29":"Composition failures","30":"Cryptanalysis","31":"Formal security","32":"Limits of cryptography","33":"Quantum attacks","34":"Quantum protocols","35":"Post-quantum migration","36":"Classical ciphers","37":"Steganography","38":"Blockchains & wallets","39":"Key management"};
 const normalize=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 const levels={beginner:0,intermediate:1,advanced:2};
 function create(catalog,guides={},prompts={}) {
  for(const field of ['exhibits','concepts','paths','modules']) if(!Array.isArray(catalog[field])||!catalog[field].length)throw Error('Missing catalog '+field);
  const labs=new Map(catalog.exhibits.map(e=>[e.id,e])),byTitle=new Map(catalog.exhibits.map(e=>[e.title,e])),topics=new Map(catalog.concepts.map(c=>[c.id,c]));
  if(labs.size!==catalog.exhibits.length||topics.size!==catalog.concepts.length)throw Error('Duplicate catalog identifiers');
  for(const t of topics.values())for(const title of t.exhibits)if(!byTitle.has(title))throw Error('Unresolved topic member '+title);
  for(const [id,g]of Object.entries(guides)){
   if(!topics.has(id))throw Error('Unresolved guide topic '+id);
   for(const route of Object.values(g.routes))for(const title of route)if(!byTitle.has(title))throw Error('Unresolved guide lab '+title);
   for(const c of g.connections)if(!topics.has(c.topic)||c.topic===id)throw Error('Unresolved concept connection '+c.topic);
   if(g.quiz&&(!Number.isInteger(g.quiz.correct)||g.quiz.correct<0||g.quiz.correct>=g.quiz.answers.length))throw Error('Invalid quiz answer '+id);
  }
  for(const p of catalog.paths)for(const title of p.steps)if(!byTitle.has(title))throw Error('Unresolved path lab '+title);
  const topicName=id=>guides[id]?.name||names[id]||topics.get(id)?.title||'';
  const topicLabs=id=>(topics.get(id)?.exhibits||[]).map(t=>byTitle.get(t)).sort((a,b)=>levels[a.level]-levels[b.level]);
  const route=(id,goal='understand',pathId='')=>{
   if(pathId){const p=catalog.paths.find(p=>p.id===pathId);if(p)return p.steps.map(t=>byTitle.get(t));}
   if(guides[id]?.routes[goal])return guides[id].routes[goal].map(t=>byTitle.get(t));
   const items=topicLabs(id);
   if(goal==='deeper')return [...items.filter(e=>e.level==='advanced'),...items.filter(e=>e.level!=='advanced')];
   if(goal==='attack'){const attack=e=>e.section==='cryptanalysis'||e.categories.includes('ATTACKS');return [...items.filter(attack),...items.filter(e=>!attack(e))];}
   return items;
  };
  function connections(id){
   const current=topics.get(id),used=new Set([id]),out=[];
   for(const c of guides[id]?.connections||[]){out.push({...c,kind:'suggested'});used.add(c.topic);}
   const shared=catalog.concepts.filter(t=>!used.has(t.id)).map(t=>({topic:t.id,shared:t.exhibits.filter(title=>current.exhibits.includes(title))})).filter(x=>x.shared.length).sort((a,b)=>b.shared.length-a.shared.length);
   for(const c of shared)out.push({...c,kind:'shared',why:`${c.shared.length} ${c.shared.length===1?'lab is':'labs are'} filed under both topics: ${c.shared.join(', ')}.`});
   return out;
  }
  function search(query){
   const q=normalize(query);if(q.length<2)return {topics:[],labs:[]};
   const words=q.split(' '),matches=s=>words.every(w=>normalize(s).includes(w));
   const foundTopics=catalog.concepts.filter(t=>matches([topicName(t.id),t.title,...(guides[t.id]?.aliases||[])].join(' '))).sort((a,b)=>Number(normalize(topicName(b.id))===q)-Number(normalize(topicName(a.id))===q));
   const foundLabs=catalog.exhibits.filter(e=>matches([e.title,e.kicker,...e.chips,...e.implements].join(' '))).sort((a,b)=>Number(normalize(b.title)===q)-Number(normalize(a.title)===q));
   return {topics:foundTopics.slice(0,5),labs:foundLabs.slice(0,7)};
  }
  const topicForLab=(id,preferred)=>topics.get(preferred)?.exhibits.includes(labs.get(id)?.title)?preferred:catalog.concepts.find(t=>t.exhibits.includes(labs.get(id)?.title))?.id;
  const nextStep=(items,currentId,explored=new Set())=>{
   const id=item=>typeof item==='string'?item:item.id;
   const index=items.findIndex(item=>id(item)===currentId);
   return index<0?null:items.slice(index+1).find(item=>!explored.has(id(item)))||null;
  };
  return {catalog,guides,prompts,labs,topics,byTitle,topicName,topicLabs,route,connections,search,topicForLab,nextStep};
 }
 return {create,normalize,names};
});
