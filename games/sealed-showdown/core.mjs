// Educational hash commitments. No networking, signatures or remote attestation.
export const MOVES = ['rock','paper','scissors'];
export const STORE = 'crypto-lab-sealed-showdown-v1';
export const DOMAIN = 'crypto-lab/sealed-showdown/v1';
export const WEAK_DOMAIN = 'crypto-lab/sealed-showdown/weak-v1';
const hex = bytes => [...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');
function moveOK(move) { if(!MOVES.includes(move))throw new TypeError('Unknown move.'); }
function contextOK({round,player}) {
  if(typeof round!=='string'||!/^[a-zA-Z0-9:_-]{1,100}$/.test(round)||!['you','switch'].includes(player))throw new TypeError('Invalid round or player.');
}
export function requireCrypto() {
  if(typeof globalThis.crypto?.subtle?.digest!=='function'||typeof globalThis.crypto?.getRandomValues!=='function')throw new Error('This game needs Web Crypto and browser random numbers. Open it over HTTPS in a supported browser.');
}
export function randomHex(bytes=16) {
  requireCrypto();
  if(!Number.isInteger(bytes)||bytes<1||bytes>64)throw new RangeError('Invalid random value size.');
  return hex(crypto.getRandomValues(new Uint8Array(bytes)));
}
export function randomMove(draw=()=>crypto.getRandomValues(new Uint8Array(1))[0]) {
  // Rejection sampling avoids the 256 mod 3 bias; each move has 84 outcomes.
  for(let tries=0;tries<1024;tries++) {
    const value=draw();
    if(!Number.isInteger(value)||value<0||value>255)throw new TypeError('Expected a random byte.');
    if(value<252)return MOVES[value%3];
  }
  throw new Error('The random source did not produce a usable value.');
}
export function encode(opening,weak=false) {
  contextOK(opening);moveOK(opening.move);
  if(!weak&&(typeof opening.nonce!=='string'||!/^[0-9a-f]{32}$/.test(opening.nonce)))throw new TypeError('Expected a fresh 16-byte secret nonce.');
  return JSON.stringify(weak?[WEAK_DOMAIN,opening.round,opening.player,opening.move]:[DOMAIN,opening.round,opening.player,opening.move,opening.nonce]);
}
export async function commit(opening,weak=false) {
  requireCrypto();
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(encode(opening,weak)))));
}
export async function verify(seal,opening,expected,weak=false) {
  // The verifier supplies the context independently; a packet cannot choose it.
  try {
    contextOK(expected);
    if(typeof seal!=='string'||!/^[0-9a-f]{64}$/.test(seal))return {valid:false,computed:null,contextOK:false};
    const computed=await commit({...opening,...expected},weak);
    const sameContext=opening.round===expected.round&&opening.player===expected.player;
    return {valid:sameContext&&seal===computed,computed,contextOK:sameContext};
  } catch(error) {
    if(error instanceof TypeError || error instanceof RangeError)return {valid:false,computed:null,contextOK:false};
    throw error;
  }
}
export function counter(move) {moveOK(move);return MOVES[(MOVES.indexOf(move)+1)%3];}
export function outcome(you,opponent) {moveOK(you);moveOK(opponent);return you===opponent?'tie':counter(opponent)===you?'win':'loss';}
export function validDate(date) {return typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date;}
export function dailyPlan(date) {
  if(!validDate(date))throw new RangeError('Expected a UTC date.');
  let seed=2166136261;
  for(const c of date)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
  const chapters=[1,2,3,4,5];
  for(let i=chapters.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[chapters[i],chapters[j]]=[chapters[j],chapters[i]];}
  // Public seed chooses lessons only. Moves and all nonces use fresh browser RNG.
  return {date,chapters:chapters.slice(0,3)};
}
export function readProgress(raw) {
  const result={best:[0,0,0,0,0,0],daily:null,arenaBest:null};
  try {
    const d=JSON.parse(raw);if(!d||typeof d!=='object')return result;
    if(Array.isArray(d.best)&&d.best.length===6)result.best=d.best.map(n=>Number.isInteger(n)&&n>=0&&n<=3?n:0);
    if(d.daily&&validDate(d.daily.date)&&Number.isInteger(d.daily.score)&&d.daily.score>=1&&d.daily.score<=3)result.daily={date:d.daily.date,score:d.daily.score};
    if(Number.isInteger(d.arenaBest)&&d.arenaBest>=0&&d.arenaBest<=5)result.arenaBest=d.arenaBest;
  } catch { /* Optional browser progress. */ }
  return result;
}
export const LESSONS=[
  {kind:'open',title:'After you, human',concept:'The timing problem',question:'How do you stop someone choosing after they see your answer?',brief:'Pick any move and show it. Switch is allowed to answer afterward. Watch why every move loses: nothing has fixed Switch’s choice yet.',hint:'Any move works for this experiment. Watch when Switch chooses its answer.',lesson:'The problem was timing. Cryptography can help fix a choice while keeping it hidden. That is a commitment: publish a fingerprint now, then reveal the choice later. In the next round, you will build one.',application:'If someone sees your bid before choosing theirs, they can simply bid more. Both bidders need to commit before either bid is revealed.',bubble:'No, really. You go first.'},
  {kind:'sealed',title:'Make it stick',concept:'Commit, then reveal',question:'Can you fix a choice without showing it yet?',brief:'Switch has already published its fingerprint. Choose a move and see how your fingerprint is made below. Commit it, then reveal both choices and check the fingerprints.',hint:'Try two different moves before committing. Watch the fingerprint change. Then commit and reveal. You complete the lesson even if Switch wins the round.',lesson:'Both hashes matched. You published only the fingerprint first, then revealed the move and secret randomness. Hashing those inputs again reproduced the earlier fingerprint. This is commit–reveal: fix a hidden choice, then check it later. It prevents changing your answer; it does not guarantee a win.',application:'A bidder can commit to a hidden bid first. Later, the bid and secret randomness let everyone check it against the fingerprint recorded before bidding closed.',bubble:'My fingerprint is already public. My move is still private.'},
  {kind:'guess',title:'Only three guesses',concept:'Hiding needs randomness',question:'Why doesn’t a plain hash hide rock, paper or scissors?',brief:'Switch skipped the secret randomness. Test each of the three possible moves, find the matching fingerprint, then choose the move that beats it.',hint:'Use the three guess buttons until a fingerprint matches. Then choose the winning countermove. These experiments cost no badges.',lesson:'You tested the three possible moves and found the matching hash. You guessed the input; you did not decrypt the hash. Secret, unpredictable randomness prevents this simple lookup. Keeping a choice hidden before reveal is called hiding.',application:'Bid amounts may also come from a small range. Hashing each likely amount can expose a bid unless the commitment includes enough secret randomness.',bubble:'Surely a long string of letters and numbers hides everything?'},
  {kind:'swap',title:'The switcheroo',concept:'Binding catches changes',question:'How can a fingerprint catch someone changing their answer?',brief:'Commit a move. Switch will try to reveal a different choice. Calculate the fingerprint of that reveal and compare it with the one Switch published earlier.',hint:'Compare the fingerprint saved before the reveal with the fingerprint calculated from it. Different values mean this reveal does not match the commitment.',lesson:'The revealed move produced a different hash from the one saved earlier. You caught the change by comparing fingerprints. This is the point of binding: it should be infeasible to find two different valid openings for one commitment.',application:'A bidder cannot simply reveal a higher amount after seeing a rival’s bid: the changed input must still match the fingerprint they already published.',bubble:'I am absolutely sticking to my first choice.'},
  {kind:'replay',title:'Yesterday’s champion',concept:'Bind the context',question:'Does a promise from an old round count in this one?',brief:'Switch brought a commitment from another round. Make your choice, then check its reveal using the current round’s label, which is also part of the fingerprint.',hint:'Calculate the hash using this round’s label. A genuine opening from an old round does not establish a commitment for this match.',lesson:'The old opening fits an old fingerprint, but fails for the current round. Hashing the round and player labels along with the choice ties the commitment to its intended context. Real protocols also need a trusted way to establish those labels.',application:'A commitment from yesterday’s auction should not count as a bid in today’s. The auction and bidder identifiers belong in the record being checked.',bubble:'This fingerprint has an excellent track record.'},
  {kind:'abort',title:'The disappearing act',concept:'Commitments cannot force a reveal',question:'Can a hash force someone to tell you their secret?',brief:'Commit your move, then reveal it first. Switch will refuse to reveal. Decide whether you have enough information to record a verified game result.',hint:'Switch has not given you the move and randomness needed for the hash check. Mark the round incomplete. Forfeits require a rule agreed before playing.',lesson:'Your opening verified, but Switch withheld its move and randomness. A commitment cannot force participation or recover the missing choice. There is no verified round outcome. Deadlines and agreed forfeits are separate rules a complete protocol needs.',application:'A bidder may refuse to reveal. An auction needs an agreed deadline and a rule for missing bids; a matching-hash check alone cannot solve that problem.',bubble:'I promise I will reveal. Probably.'},
];
