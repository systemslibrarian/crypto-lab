import test from 'node:test';
import assert from 'node:assert/strict';
import { randomHex, hash, seal, verify, shuffle, secureIndex } from '../games/shared/crypto.mjs';

test('real SHA-256 seal is domain-separated, hiding nonce matters, and forgery fails', async () => {
 const n=randomHex(16), m=randomHex(16), bit=1;
 assert.match(n,/^[\da-f]{32}$/);assert.notEqual(n,m);
 const original=await seal('test',bit,n);
 assert.equal(original.length,64);
 assert.equal(await verify('test',bit,n,original),true);
 assert.equal(await verify('test',0,n,original),false);
 assert.equal(await verify('other',bit,n,original),false);
 assert.equal(await verify('test',bit,m,original),false);
 assert.notEqual(await hash('binary',0),await hash('binary','0'));
});
test('two-party shuffle reproducible, unbiased bounded draws, no card lost', async () => {
 const deck=Array.from({length:12}, (_,i)=>i+1);
 const seed=await hash('combined','p1','p2');
 const a=await shuffle(deck,seed);const b=await shuffle(deck,seed);
 assert.deepEqual(a,b);assert.deepEqual(a.toSorted((x,y)=>x-y),deck);
 assert.notDeepEqual(a,await shuffle(deck,await hash('combined','p1','changed')));
 assert.deepEqual(deck,Array.from({length:12},(_,i)=>i+1));
 for(let i=0;i<1000;i++)assert.ok(secureIndex(3)<3);
});
