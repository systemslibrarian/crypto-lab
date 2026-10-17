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
  {kind:'open',title:'After you, human',concept:'The timing problem',brief:'Switch insists you go first. Pick a move and play it openly. See what a very polite opponent can get away with.',hint:'Any move works for this experiment. Watch when Switch chooses its answer.',lesson:'Switch waited to see your move, then chose the move that beats it. The problem was timing. Both players need to fix their choices before either reveals them.',bubble:'No, really. You go first.'},
  {kind:'sealed',title:'Make it stick',concept:'Commit, then reveal',brief:'Switch has published a seal before you choose. Pick your move, seal it with a fresh secret random value, then reveal and check both openings.',hint:'Pick any move, lock it, and reveal. A valid losing round still completes the lesson: verification and winning are different things.',lesson:'Both hashes matched the revealed moves and secret random values. The commitments were fixed before the reveals. You checked that the choices opened consistently; the outcome of an honest round can still be a win, tie or loss.',bubble:'My seal is on the table. Your turn.'},
  {kind:'guess',title:'Only three guesses',concept:'Hiding needs randomness',brief:'Switch forgot the secret random value. Test the three possible moves against its hash, then play the move that beats the match.',hint:'Use the three guess buttons until a hash matches. Rock beats scissors; paper beats rock; scissors beats paper. Guessing here costs no badges.',lesson:'You hashed the three possible moves and found the matching commitment. A plain hash does not hide a tiny set of choices. A fresh, unpredictable nonce kept secret until reveal blocks this simple three-guess lookup.',bubble:'A hash is a hash. Who needs randomness?'},
  {kind:'swap',title:'The switcheroo',concept:'Binding catches changes',brief:'Play a sealed round. Switch will try to reveal a different move. Recompute the hash before deciding whether that opening counts.',hint:'The displayed move is only a claim. Verify it against the seal published before the round, then reject an opening that does not match.',lesson:'The proposed move did not reproduce the stored hash, so you rejected it. Computational binding means a player should not feasibly find two different valid openings for one commitment, under the scheme’s assumptions.',bubble:'I am absolutely sticking to my first choice.'},
  {kind:'replay',title:'Yesterday’s champion',concept:'Bind the context',brief:'Switch has brought a seal from another round. Play your move, then check the opening against this round’s identifier and player label.',hint:'Verify for the current round, not the round named in an old packet. A genuine old opening does not establish a commitment for this match.',lesson:'The opening fits an old seal, but not the current round’s context. Including the round and player in the hashed record helps prevent reuse across matches or roles. Those labels still need an authenticated source in a real protocol.',bubble:'This seal has an excellent track record.'},
  {kind:'abort',title:'The disappearing act',concept:'Commitments cannot force a reveal',brief:'Play a sealed round. You will reveal first; Switch will refuse to open its seal. Decide what the record can honestly say.',hint:'Without Switch’s opening, there is no verified game outcome. Mark it incomplete. A forfeit would require a rule agreed before playing.',lesson:'Your opening verified, but Switch never supplied one. A hash commitment cannot force participation or recover the missing move. Timeouts and agreed forfeits can be game rules; they are separate from a cryptographically verified outcome.',bubble:'I promise I will reveal. Probably.'},
];
