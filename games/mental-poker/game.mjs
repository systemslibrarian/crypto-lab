import { randomHex, hash, seal, verify, shuffle, el, say, button, secureIndex } from '../shared/crypto.mjs';
const ranks = ['3','4','5','6','7','8','9','10','J','Q','K','A'];
const deckSource = ranks.map((rank, i) => ({ rank, power:i+3, suit: ['♣','♥','♠','♦'][i%4] }));
let state, busy = false;
const guard = async fn => { if(busy) return; busy=true; try{await fn();}catch(e){feedback(`Game paused: ${e.message}. Reload to retry.`, 'bad');}finally{busy=false;} };
function feedback(msg,tone=''){const n=el('feedback');n.textContent=msg;n.className=`feed ${tone}`;}
function drawCard(c, onPlay) {
  const b=button(el('hand'), `${c.rank} ${c.suit}`, onPlay, `playing-card ${['♥','♦'].includes(c.suit)?'red':''}`);
  const glyph=document.createElement('small');glyph.textContent=c.suit;b.append(glyph);
  b.setAttribute('aria-label', `Play ${c.rank} of ${{'♥':'hearts','♦':'diamonds','♣':'clubs','♠':'spades'}[c.suit]}`);
  b.disabled=state.stage!=='playing';
}
function render(){
  say('chips',state.chips);say('round',`${Math.min(state.round+1,5)} / 5`);
  const playing=state.stage==='playing';
  el('seal').hidden=state.stage!=='ready';el('wager-control').hidden=!playing;el('audit-panel').hidden=state.stage!=='audit';el('replay').hidden=state.stage!=='finished';
  el('wagers').replaceChildren();
  if(playing){for(const wager of [1,2,3]){
    const b=button(el('wagers'),`${wager} chip${wager===1?'':'s'}`,()=>{state.wager=wager;render();},'choice');
    b.setAttribute('aria-pressed',String(state.wager===wager));b.disabled=wager>state.chips;
  }}
  el('hand').replaceChildren();el('rival-cards').replaceChildren();
  if(playing){state.userHand.forEach(c=>drawCard(c,()=>guard(()=>playCard(c))));}
  for(let j=0;j<(playing?state.botHand.length:state.stage==='ready'?5:0);j++){
    const n=document.createElement('div');n.className='playing-card back';n.textContent='✦';n.setAttribute('aria-hidden','true');el('rival-cards').append(n);
  }
  say('rival-count',playing?`${state.botHand.length} cards hidden`:state.stage==='ready'?'5 cards hidden':'Hand complete');
  if(state.stage==='ready'){say('phase','THE DEAL IS YOURS');say('mission','Seal your seed, then draw.');say('lead','The rival has already committed to a secret seed. Lock yours independently before the shuffle.');}
  if(playing){say('phase',`DUEL ${state.round+1} OF 5`);say('mission','Choose a card. Choose your risk.');say('lead','Your rival has a hidden hand and a fixed play order. Can you finish with more chips?');}
  if(state.stage==='audit'){say('phase','FINAL BOSS / INVESTIGATION');say('mission','Trust, but SHA-256 verify.');say('lead','A mischievous rival might forge their seed disclosure. A real audit spots changed openings.');}
  if(state.stage==='finished'){say('phase','MATCH COMPLETE');say('mission',state.auditRight?'Shuffle detective!':'The next deal awaits.');say('lead',`You finished with ${state.chips} chips. ${state.auditRight?'You correctly judged the opening.':'The audit decision was incorrect—try a new run.'}`);}
}
async function prepare(){
  const botSeed=randomHex(24),botNonce=randomHex(16);
  state={stage:'ready',botSeed,botNonce,botSeal:await seal('mental-poker-bot',botSeed,botNonce),chips:10,round:0,wager:1,botHand:[],userHand:[],auditRight:false};
  say('bot-commit',state.botSeal);el('seal').disabled=false;el('seal').textContent='Lock my seed & deal →';feedback('The rival’s fingerprint is public. Their seed stays hidden. Your turn to seal.');render();
}
async function start(){
  state.userSeed=randomHex(24);state.userNonce=randomHex(16);
  state.userSeal=await seal('mental-poker-player',state.userSeed,state.userNonce);
  say('user-commit',state.userSeal);
  const combined=await hash('mental-poker-deck-v1',state.userSeed,state.botSeed);
  state.fullDeck=await shuffle(deckSource,combined);
  state.userHand=state.fullDeck.slice(0,5);state.botHand=state.fullDeck.slice(5,10);
  state.stage='playing';say('my-play','?');say('rival-play','?');
  feedback('Deal complete. Your rival’s card is hidden. Outplay them over five duels!');render();
}
async function playCard(card){
  if(state.stage!=='playing' || !state.userHand.includes(card))return;
  const bot=state.botHand.shift();state.userHand=state.userHand.filter(x=>x!==card);
  const win=card.power>bot.power;state.chips=Math.max(1,state.chips+(win?state.wager:-state.wager));
  say('my-play',`${card.rank}${card.suit}`);say('rival-play',`${bot.rank}${bot.suit}`);
  feedback(`${win?'You win!':'Rival wins!'} ${card.rank} vs ${bot.rank}. ${win?'+':'−'}${state.wager} chip${state.wager===1?'':'s'}.`,win?'good':'bad');
  state.round++;
  if(state.round===5){
    state.stage='audit';state.cheat=secureIndex(2)===1;
    state.openedSeed=state.cheat?`${state.botSeed.slice(0,-1)}${state.botSeed.at(-1)==='0'?'1':'0'}`:state.botSeed;
    state.openedNonce=state.botNonce;
    say('original-hash',state.botSeal);
    say('reopened-hash','Not computed yet');say('deck-check','A claimed seed and nonce are ready for verification.');
    el('verify').disabled=false;el('authentic').disabled=true;el('forged').disabled=true;
    feedback('The hand is over! Earn a 5-chip audit bonus by verifying whether the rival altered their opening.');
  } else {state.wager=Math.min(state.wager,Math.max(1,state.chips));}
  render();
}
async function audit(){
  if(state.stage!=='audit')return;
  const shown=await seal('mental-poker-bot',state.openedSeed,state.openedNonce);
  const openingValid=await verify('mental-poker-bot',state.openedSeed,state.openedNonce,state.botSeal);
  const openedCombined=await hash('mental-poker-deck-v1',state.userSeed,state.openedSeed);
  const recreated=await shuffle(deckSource,openedCombined);
  const sameDeck=JSON.stringify(recreated)===JSON.stringify(state.fullDeck);
  state.auditPass=openingValid&&sameDeck;
  say('reopened-hash',shown);
  say('deck-check',`Seal ${openingValid?'matches':'FAILS'} · Reconstructed deck ${sameDeck?'matches':'DIFFERS'}.`);
  feedback('Audit computed with real SHA-256. Now decide: is this opening authentic or forged?');
  el('verify').disabled=true;el('authentic').disabled=false;el('forged').disabled=false;
}
function verdict(accepted){
  if(state.stage!=='audit'||el('authentic').disabled)return;
  state.auditRight=(accepted===state.auditPass);state.chips+=state.auditRight?5:0;state.stage='finished';
  say('bonus',state.auditRight?'+5':'+0');
  say('lesson',state.auditPass?'Both seeds matched their earlier commitments and the deck reconstructed identically. A valid opening certifies this simulator’s published shuffle record, not a private remote deal.':'A different opening changed the hash and the deterministic deck. A commitment lets you detect post-commit changes, not prevent someone from refusing to reveal.');
  feedback(state.auditRight?`Great catch! ${state.auditPass?'Honest opening verified.':'Forged opening rejected.'} +5 detective chips.`:`That verdict did not match the hash audit. The rival ${state.auditPass?'opened correctly':'changed the committed seed'}. Try another match.`,state.auditRight?'good':'bad');
  render();
}
el('seal').addEventListener('click',()=>guard(start));el('verify').addEventListener('click',()=>guard(audit));
el('authentic').addEventListener('click',()=>verdict(true));el('forged').addEventListener('click',()=>verdict(false));
el('replay').addEventListener('click',()=>guard(prepare));
guard(prepare);
