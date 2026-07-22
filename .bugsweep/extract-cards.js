const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const slugs = ['isogeny-gate','bb84','e91','biham-lens','hqc-timing','hqc-vault','hybrid-wire','ed25519-forge','iron-serpent','opaque-gate','ot-gate','lms-xmss','sphincs-ledger','dead-sea-cipher','scloud-vault','rsa-forge','webauthn','threshold-mldsa','format-ward','psi-gate','quantum-vault-kpqc','bitcoin-wallet','ibe-gate','harvest-vault'];
slugs.forEach(slug => {
  const href = 'https://systemslibrarian.github.io/crypto-lab-' + slug + '/';
  const hIdx = html.indexOf('href="' + href + '"');
  if (hIdx === -1) { console.log('=== ' + slug + ': CARD NOT FOUND'); return; }
  const start = html.lastIndexOf('<a class=', hIdx);
  const end = html.indexOf('</a>', hIdx);
  const b = html.slice(start, end);
  const g = (p) => { const x = new RegExp(p).exec(b); return x ? x[1].trim() : '?'; };
  const chips = [...b.matchAll(/class="chip">([^<]+)</g)].map(x => x[1]);
  console.log('=== ' + slug);
  console.log('cat: ' + g('data-category="([^"]*)"'));
  console.log('kicker: ' + g('card-kicker">([^<]+)<'));
  console.log('title: ' + g('(?:project|feature)-title">([^<]+)<'));
  console.log('copy: ' + g('(?:project|feature)-copy">([^<]+)<'));
  console.log('chips: ' + chips.join(' | '));
});
