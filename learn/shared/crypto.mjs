// Browser-local teaching primitives; no certificates, network, or durable trust.
const encoder = new TextEncoder();
export const bytes = value => encoder.encode(value);
export const hex = value => Array.from(new Uint8Array(value), b => b.toString(16).padStart(2, '0')).join('');
export function unhex(value) {
  if (typeof value !== 'string' || !/^(?:[a-f0-9]{2})+$/.test(value)) throw new Error('Invalid hexadecimal bytes');
  return Uint8Array.from(value.match(/../g), b => parseInt(b, 16));
}
export const randomId = () => hex(crypto.getRandomValues(new Uint8Array(16)));
export const digest = async text => hex(await crypto.subtle.digest('SHA-256', bytes(text)));
export const signingKey = () => crypto.subtle.generateKey({name:'ECDSA', namedCurve:'P-256'}, false, ['sign','verify']);
export const sign = async (key, text) => hex(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'}, key, bytes(text)));
export const verify = async (key, text, signature) => {
  try {return await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'}, key, unhex(signature), bytes(text));}
  catch {return false;}
};
export const aesKey = () => crypto.subtle.generateKey({name:'AES-GCM',length:256}, false, ['encrypt','decrypt']);
export async function encrypt(key, text, context) {
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:bytes(context),tagLength:128},key,bytes(text));
  return {iv:hex(iv),ciphertext:hex(ciphertext)};
}
export async function decrypt(key, payload, context) {
  const value=await crypto.subtle.decrypt({name:'AES-GCM',iv:unhex(payload.iv),additionalData:bytes(context),tagLength:128},key,unhex(payload.ciphertext));
  return new TextDecoder().decode(value);
}
