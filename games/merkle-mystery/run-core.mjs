import { buildTree, bookData, leafHash, nodeHash, verifyProof } from './core.mjs';

export const STORE = 'crypto-lab-merkle-run-v1';
export const RUNS = Object.freeze([
  { name:'First climb', size:4, target:1, kind:'genuine', item:'Moon boots',
    goal:'Get the moon boots through the gate with just two sibling fingerprints.' },
  { name:'Travel light', size:8, target:5, kind:'genuine', item:'Pixel dragon',
    goal:'Deliver one collectible from eight. Your proof has room for three fingerprints.' },
  { name:'Glitch check', size:16, target:9, kind:'text', item:'Comet board',
    goal:'Build the proof, then check whether this delivery belongs to the saved collection.' },
  { name:'Fake checkpoint', size:16, target:12, kind:'seal', item:'Star headphones',
    goal:'The courier brought a checkpoint too. Decide which comparison can justify a delivery.' }
]);
const TITLES=['Moon boots','Pixel dragon','Comet board','Star headphones','Neon fox','Cloud helmet','Orbit skates','Crystal beetle','Solar cape','Rocket glove','Laser kite','Bubble rover','Nova speaker','Meteor mask','Prism wings','Astro badge'];
export function range(level,index) {
  const size=2**level;
  return {first:index*size+1,last:(index+1)*size,label:size===1?`Item ${index+1}`:`Items ${index*size+1}–${(index+1)*size}`};
}
export function progress(value) {
  return {completed:RUNS.map((_,i)=>value?.completed?.[i]===true),sound:value?.sound===true};
}
export async function prepareRun(run=0) {
  if(!Number.isInteger(run)||!RUNS[run])throw new RangeError('Choose a known run.');
  const mission=RUNS[run];
  const books=TITLES.slice(0,mission.size).map((title,i)=>({title,text:`Edition 1; collectible ${i+1}; color violet.`}));
  books[mission.target]={title:mission.item,text:`Edition 1; collectible ${mission.target+1}; color violet.`};
  const original=books.map(bookData),record={...books[mission.target]};
  if(mission.kind!=='genuine')record.text=record.text.replace('violet','orange');
  const before=await buildTree(original);
  const source=mission.kind==='seal'?await buildTree(original.map((value,i)=>i===mission.target?bookData(record):value)):before;
  const current=await leafHash(bookData(record));
  return {run,mission,record,trustedRoot:before.root,offeredRoot:source.root,source,current,
    level:0,position:mission.target,steps:[],phase:'build',preview:null,verified:null,offeredMatch:null,decision:null,
    message:'Pick a fingerprint tile. Then put it to the left or right of your item.'};
}
export function candidates(state) {
  if(state.phase!=='build')return [];
  const row=state.source.levels[state.level],sibling=state.position^1;
  const indexes=[sibling,state.position];
  for(let i=0;i<row.length&&indexes.length<4;i++)if(!indexes.includes(i))indexes.push(i);
  // Public, deterministic presentation order; never used for cryptographic randomness.
  indexes.sort((a,b)=>a-b);
  const offset=(state.run+state.level+1)%indexes.length;
  return [...indexes.slice(offset),...indexes.slice(0,offset)].map(index=>({id:`${state.level}:${index}`,index,...range(state.level,index),hash:row[index]}));
}
export async function join(state,id,side) {
  if(state.phase!=='build')throw new RangeError('This route is already built.');
  if(!['left','right'].includes(side))throw new RangeError('Choose left or right.');
  const candidate=candidates(state).find(c=>c.id===id);
  if(!candidate)throw new RangeError('Pick a fingerprint from this level.');
  const left=side==='left'?candidate.hash:state.current,right=side==='left'?state.current:candidate.hash;
  const hash=await nodeHash(left,right),expectedSide=state.position%2?'left':'right';
  const preview={left,right,hash,id,side};
  if(candidate.index!==(state.position^1)) {
    return {...state,preview,message:`That is ${candidate.label.toLowerCase()}. Your block is ${range(state.level,state.position).label.toLowerCase()}; its sibling is ${range(state.level,state.position^1).label.toLowerCase()}. Hashing the wrong block still produces a fingerprint, but not the proof this route needs. Try again for free.`};
  }
  if(side!==expectedSide) {
    return {...state,preview,message:`Right block, wrong order. ${candidate.label} comes ${expectedSide==='left'?'before':'after'} your block. SHA-256 hashes left then right, so swapping them changes the result. Put this tile on the ${expectedSide}.`};
  }
  const step={level:state.level,position:state.position,input:state.current,sibling:candidate.hash,id,side,left,right,hash};
  const next={...state,current:hash,level:state.level+1,position:Math.floor(state.position/2),steps:[...state.steps,step],preview:null};
  if(next.level===Math.log2(state.mission.size)) {
    next.phase='judge';
    next.verified=await verifyProof(bookData(state.record),state.mission.target,state.mission.size,next.steps.map(s=>s.sibling),state.trustedRoot);
    next.offeredMatch=hash===state.offeredRoot;
    next.message='Route built. Compare the full computed root with the independently saved checkpoint. Should this item pass?';
  }else next.message=`Joined! Your block now covers ${range(next.level,next.position).label.toLowerCase()}. Find its sibling for the next jump.`;
  return next;
}
export function rewind(state) {
  if(!state.steps.length)return {...state,preview:null,message:'Nothing spent. Choose a tile and try a join.'};
  const steps=state.steps.slice(0,-1),last=state.steps.at(-1);
  return {...state,steps,level:last.level,position:last.position,current:last.input,phase:'build',preview:null,verified:null,offeredMatch:null,decision:null,message:'One jump rewound. Your fingerprint is restored; try another join.'};
}
export function decide(state,decision) {
  if(state.phase!=='judge'||!['accept','reject'].includes(decision))throw new RangeError('Build the route before deciding.');
  const correct=decision===(state.verified?'accept':'reject');
  if(!correct)return {...state,message:state.verified?'The computed root matches the saved checkpoint. This proof supports accepting this item at this position. Try that decision.':'The computed root does not match the saved checkpoint. Do not accept this delivery on this proof—even if it matches a root the courier supplied. Try rejecting it.'};
  return {...state,phase:'done',decision,message:state.verified?'Delivery verified. The gate opens.':'Glitch caught. The delivery stays outside.'};
}
export function takeaway(state) {
  if(state.phase!=='done')throw new RangeError('Finish the decision first.');
  const count=state.steps.length,size=state.mission.size;
  return state.mission.kind==='genuine'
    ? `You checked one item in a collection of ${size} with ${count} sibling hashes, not the other ${size-1} item records. Your computed root matched the independently saved root. Each sibling can stand for an entire neighboring block.`
    :state.mission.kind==='text'
      ? `The item was changed from violet to orange. Even with the correct sibling fingerprints, its hash led to a different root. You rejected the changed delivery using ${count} sibling hashes; you did not need the other ${size-1} records.`
      : 'The courier changed the item and rebuilt the tree. Your proof matched the courier’s new root, but not the root saved independently. A matching hash proves membership relative to a root; it does not make that root trustworthy.';
}
