import test from 'node:test';
import assert from 'node:assert/strict';
class MiniElement {
 constructor(id='',tag='div'){this.id=id;this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.attrs={};this.dataset={};this.style={};this.hidden=false;this.disabled=false;this.textContent='';this.className='';}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=[...nodes];}
 addEventListener(event,callback){(this.listeners[event]??=[]).push(callback);}
 setAttribute(name,value){this.attrs[name]=String(value);}
 querySelectorAll(selector){const all=this.children.flatMap(x=>[x,...x.querySelectorAll(selector)]);return all.filter(x=>x.tagName===selector.toUpperCase());}
 async click(){if(this.disabled||this.hidden)throw new Error(`Disabled control ${this.id||this.textContent}`);for(const f of this.listeners.click||[])await f();await new Promise(r=>setTimeout(r,15));}
}
function newDom(){const map=new Map();const document={getElementById(id){if(!map.has(id))map.set(id,new MiniElement(id));return map.get(id);},createElement(tag){return new MiniElement('',tag);}};globalThis.document=document;return document.getElementById.bind(document);}
async function waitFor(pred,detail){const start=Date.now();while(Date.now()-start<1500){if(pred())return;await new Promise(r=>setTimeout(r,20));}throw Error(`Timeout waiting ${detail}`);}
async function clickButtonByTitle(panel,title){const btn=panel.children.find(e=>e.textContent===title);assert.ok(btn,`Missing ${title} in ${panel.id}`);await btn.click();}
test('Mental Poker can complete 5-card match and cryptographic audit',async()=>{
 const el=newDom();await import('../games/mental-poker/game.mjs');await waitFor(()=>el('bot-commit').textContent.length===64 && el('seal').textContent.includes('Lock my seed'),'seed');
 assert.equal(el('bot-commit').textContent.length,64);await el('seal').click();
 await waitFor(()=>el('hand').children.length===5,'deal');assert.equal(el('user-commit').textContent.length,64);
 for(let i=0;i<5;i++){await el('hand').children[0].click();await waitFor(()=>el('hand').children.length===4-i||i===4,'cards played');}
 assert.equal(el('audit-panel').hidden,false);await el('verify').click();await waitFor(()=>!el('authentic').disabled,'audit');
 assert.match(el('deck-check').textContent,/(matches|FAILS)/);
 const genuine=el('deck-check').textContent.includes('Seal matches');await el(genuine?'authentic':'forged').click();
 assert.equal(el('bonus').textContent,'+5'); assert.match(el('feedback').textContent,/Great catch/);
});
test('Coin Flip six cases can be verified and properly classified',async()=>{
 const el=newDom();await import('../games/coin-flip-challenge/game.mjs');await waitFor(()=>el('lock').disabled===true&&el('seal').textContent.length===64,'ready');
 for(let i=0;i<6;i++){
   if(!el('probes').hidden){await el('probe-h').click();await el('probe-t').click();}
   await el('bits').children[0].click();await el('lock').click();await el('reveal').click();await el('check').click();
   await waitFor(()=>el('verdicts').children.length===4,'verdict');
   const kind=!el('probes').hidden?'leaky':el('leak-note').textContent.includes('LEAK ALERT')?'leaky':el('open-info').textContent.includes('No revealed')?'aborted':el('computed').textContent!==el('seal').textContent?'forged':'honest';
   const btn=el('verdicts').children.find(b=>b.textContent.toLowerCase().includes(({honest:'fair',forged:'forged',aborted:'aborted',leaky:'leaky'})[kind]));
   assert.ok(btn);await btn.click();assert.match(el('result-title').textContent,/Correct classification/);
   if(i<5) await el('next').click();
 }
 assert.equal(el('correct').textContent,6);assert.ok(Number(el('score').textContent)>=12);
});
test('The Digital Trade allows safe honest swap, counterfeit refund and ghost timeout',async()=>{
 const el=newDom();await import('../games/the-digital-trade/game.mjs');await waitFor(()=>el('listed-hash').textContent.length===64,'listing');
 const run=async actions=>{for(const x of actions)await clickButtonByTitle(el('actions'),x);};
 await run(['Deposit in escrow','Verify deposit','Release swap']);assert.equal(el('wins').textContent,1);assert.match(el('result-title').textContent,/SECURED/);
 await el('next').click();await run(['Deposit in escrow','Verify deposit','Claim refund']);assert.equal(el('wins').textContent,2);
 await el('next').click();await run(['Deposit in escrow','Wait one tick','Wait one tick','Claim refund']);assert.equal(el('wins').textContent,3);
 await el('next').click();await clickButtonByTitle(el('actions'),'Deposit in escrow');
 if(el('their-status').textContent.includes('No deposit'))await run(['Wait one tick','Wait one tick','Claim refund']);
 else {await run(['Verify deposit']);if(el('match').textContent.startsWith('MATCH:'))await run(['Release swap']);else await run(['Claim refund']);}
 assert.equal(el('wins').textContent,4);
});
