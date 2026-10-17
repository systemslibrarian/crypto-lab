import { deal, reconstruct, possibleSecrets } from '../secret-council/core.mjs';
export const STORE = 'crypto-lab-key-rush-v1';
export const COLS = 11, ROWS = 7, EXIT = { x: 10, y: 3 };
export const NAMES = ['Zip', 'Pip', 'Bop', 'Dot', 'Hex'];
export const LEVELS = [
  { name:'First run', bots:3, threshold:2, tip:'Cyan scanners COPY a share. The bot can still deliver it. Get two bots home before two distinct shares are copied.',
    walls:[[5,1],[5,5]], scanners:[{x:4,offset:0,period:2000,gap:3}], jammers:[] },
  { name:'Double trouble', bots:5, threshold:3, tip:'Pink traps knock a bot OFFLINE without copying its share. Dodge them, watch the scanners, and get enough bots home.',
    walls:[[6,0],[6,1],[6,5],[6,6]], scanners:[{x:3,offset:0,period:1900,gap:1},{x:7,offset:850,period:1900,gap:5}],
    jammers:[{x:5,y:3,offset:0},{x:8,y:5,offset:800}] },
  { name:'Overload', bots:5, threshold:3, tip:'Choose your balance. A low threshold needs fewer deliveries but fewer stolen copies expose the secret. A high threshold needs more survivors.',
    walls:[[4,0],[4,6],[7,1],[7,5]], scanners:[{x:3,offset:0,period:1700,gap:1},{x:6,offset:650,period:1700,gap:3},{x:8,offset:1100,period:1700,gap:5}],
    jammers:[{x:5,y:2,offset:0},{x:5,y:4,offset:700},{x:9,y:3,offset:1000}] },
];
export function cleanProgress(value) {
  return { completed:LEVELS.map((_,i)=>value?.completed?.[i]===true), sound:value?.sound===true, slow:value?.slow===true };
}
export function create(level=0,threshold=LEVELS[level]?.threshold) {
  if(!Number.isInteger(level)||!LEVELS[level]||!Number.isInteger(threshold)||threshold<2||threshold>LEVELS[level].bots)throw new RangeError('Choose a level and a valid threshold.');
  return { level,threshold,phase:'ready',elapsed:0,active:0,x:0,y:3,dx:1,dy:0,delivered:[],copied:[],offline:[],dealt:null,exposed:null,recovered:null,boostAt:0,event:0,message:'Ready when you are.',reason:null };
}
export function start(state,random) {
  if(state.phase!=='ready')throw new RangeError('Start a fresh round first.');
  return {...state,phase:'playing',dealt:deal(Array.from({length:LEVELS[state.level].bots},(_,i)=>i),state.threshold,random),message:'Get your bots to the exit. Cyan copies; pink knocks a bot offline.'};
}
export function wall(level,x,y) {return x<0||x>=COLS||y<0||y>=ROWS||LEVELS[level].walls.some(p=>p[0]===x&&p[1]===y);}
export function scannerAt(scanner,time) {
  const t=time+scanner.offset,cycle=Math.floor(t/scanner.period),phase=t%scanner.period;
  return {...scanner,active:phase<scanner.period*.55,gap:[scanner.gap,(scanner.gap+2)%ROWS,(scanner.gap+4)%ROWS][cycle%3]};
}
export function jammerAt(jammer,time) {return {...jammer,active:(time+jammer.offset)%1800<950};}
export function hazards(state) {
  const level=LEVELS[state.level];
  return {scanners:level.scanners.map(s=>scannerAt(s,state.elapsed)),jammers:level.jammers.map(j=>jammerAt(j,state.elapsed))};
}
function end(state,reason,message) {return {...state,phase:'result',reason,message,event:state.event+1};}
function nextBot(state) {
  const next=Array.from({length:LEVELS[state.level].bots},(_,i)=>i).find(i=>!state.delivered.includes(i)&&!state.offline.includes(i));
  return {...state,active:next??null,x:0,y:3,dx:1,dy:0,boostAt:state.elapsed};
}
function collision(state) {
  if(state.phase!=='playing')return state;
  const h=hazards(state),name=NAMES[state.active];
  if(h.scanners.some(s=>s.active&&s.x===state.x&&s.gap!==state.y)&&!state.copied.includes(state.active)) {
    state={...state,copied:[...state.copied,state.active],event:state.event+1,message:`${name} was scanned. ${state.copied.length+1} distinct copies stolen; ${state.threshold} expose the secret. This bot can still deliver.`};
    if(state.copied.length>=state.threshold) {
      const exposed=reconstruct(state.dealt.shares.filter(p=>state.copied.includes(p.id)),state.threshold);
      return end({...state,exposed},'breach',`The scanners collected ${state.copied.length} distinct shares and reconstructed secret ${exposed}.`);
    }
  }
  if(h.jammers.some(j=>j.active&&j.x===state.x&&j.y===state.y)) {
    state={...state,offline:[...state.offline,state.active],event:state.event+1,message:`${name} is offline. Its share was not copied by this trap. ${LEVELS[state.level].bots-state.offline.length-1} bots remain available in total.`};
    if(LEVELS[state.level].bots-state.offline.length<state.threshold)return end(state,'lost',`Not enough bots remain: ${LEVELS[state.level].bots-state.offline.length} available, ${state.threshold} required.`);
    return nextBot(state);
  }
  if(state.x===EXIT.x&&state.y===EXIT.y) {
    state={...state,delivered:[...state.delivered,state.active],event:state.event+1,message:`${name} delivered! ${state.delivered.length+1} / ${state.threshold} shares home.`};
    if(state.delivered.length>=state.threshold) {
      const recovered=reconstruct(state.dealt.shares.filter(p=>state.delivered.includes(p.id)),state.threshold);
      if(recovered!==state.dealt.secret)throw new Error('Reconstruction mismatch.');
      return end({...state,recovered},'win',`Enough shares home. Secret ${recovered} reconstructed; the scanners still have too few shares.`);
    }
    return nextBot(state);
  }
  return state;
}
export function move(state,dx,dy,boost=false) {
  if(state.phase!=='playing'||(boost&&state.elapsed<state.boostAt))return state;
  if(!Number.isInteger(dx)||!Number.isInteger(dy)||Math.abs(dx)+Math.abs(dy)!==1)throw new RangeError('Move one direction at a time.');
  const steps=boost&&state.elapsed>=state.boostAt?3:1,active=state.active;
  let next={...state,dx,dy,boostAt:steps===3?state.elapsed+1400:state.boostAt};
  for(let i=0;i<steps;i++) {
    if(wall(next.level,next.x+dx,next.y+dy))break;
    next=collision({...next,x:next.x+dx,y:next.y+dy});
    // A boost never moves the next bot or skips checks on intermediate cells.
    if(next.phase!=='playing'||next.active!==active)break;
  }
  return next;
}
export function tick(state,ms) {
  if(!Number.isFinite(ms)||ms<0||ms>1000)throw new RangeError('Invalid frame interval.');
  while(ms>0&&state.phase==='playing') {const step=Math.min(ms,25);state=collision({...state,elapsed:state.elapsed+step});ms-=step;}
  return state;
}
export function pause(state) {return state.phase==='playing'?{...state,phase:'paused'}:state.phase==='paused'?{...state,phase:'playing'}:state;}
export function explanation(state) {
  if(state.phase!=='result')throw new RangeError('Finish the round first.');
  const count=LEVELS[state.level].bots-state.offline.length;
  const possibilities=possibleSecrets(state.dealt.shares.filter(p=>state.copied.includes(p.id)),state.threshold).length;
  return {possibilities,title:state.reason==='win'?'Key delivered. Secret protected.':state.reason==='breach'?'Too many copies got out.':'Too few bots made it.',
    lesson:state.reason==='breach'?`Your threshold was ${state.threshold}. The scanners copied ${state.copied.length} different shares and actually reconstructed the secret. A higher threshold would require more stolen shares, but also more deliveries.`
    :state.reason==='lost'?`You needed ${state.threshold} shares, but only ${count} bots remained available. A lower threshold can tolerate more missing shares, but fewer stolen shares would expose the secret.`
    :`${state.delivered.length} delivered shares reconstructed the secret. The scanners had ${state.copied.length}, below your threshold of ${state.threshold}; all ${possibilities} possible secret values still fit those stolen shares.`,
    connection:'This is Shamir secret sharing: a backup key can be split so some shares may be missing or stolen without losing recovery or revealing the key. Scanners copy a share; traps make it unavailable. Those are different problems.'};
}
