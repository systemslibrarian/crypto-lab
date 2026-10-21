import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {entries as defaultEntries} from './chapters.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
// The CLI and validation suite use one renderer. Keeping it callable also lets
// the tests run in environments where spawning child processes is unavailable.
export function renderReadingPath(entries = defaultEntries, catalogText = fs.readFileSync(path.join(dir, '../../CATALOG.md'), 'utf8')) {
const labSection = catalogText.split(/^## Labs\s*$/m)[1];
if (!labSection) throw new Error('CATALOG.md is missing its per-lab section.');
const catalog = new Map();
for (const match of labSection.matchAll(/^### (.+)\r?\n\r?\n\[`(crypto-lab-[a-z0-9-]+)`\]\((https:\/\/[^\s)]+)\)/gm)) {
  const [, title, slug, href] = match;
  if (catalog.has(slug)) throw new Error(`Duplicate catalog slug: ${slug}`);
  catalog.set(slug, {title, href});
}
if (!catalog.size) throw new Error('No per-lab entries found in CATALOG.md.');

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = {direct:'Direct connection', modern:'Modern counterpart', intro:'Introductory bridge'};
const parts = ['Foundations', 'Symmetric cryptography', 'Public-key cryptography', 'Hashing and authentication', 'Post-quantum cryptography', 'Key management'];
const book = 'https://link.springer.com/book/10.1007/978-3-662-69007-9';
const chapterUrl = chapter => `https://link.springer.com/chapter/10.1007/978-3-662-69007-9_${chapter}`;
const sourceRepository = 'https://github.com/systemslibrarian/crypto-lab';
const branch = 'main';
const report = `${sourceRepository}/blob/${branch}/audits/UNDERSTANDING-CRYPTOGRAPHY-GAP-CHECK-2026-10-21.md`;
const expectedIds = Array.from({length:14}, (_, i) => `chapter-${i + 1}`);
expectedIds.splice(11, 0, 'sha3-focus');

if (!Array.isArray(entries) || entries.length !== expectedIds.length || entries.some((entry, i) => entry.id !== expectedIds[i])) {
  throw new Error('The second-edition path must contain chapters 1–14 in book order, with sha3-focus immediately after chapter 11.');
}
for (const entry of entries) {
  const focus = entry.id === 'sha3-focus';
  if (entry.kind !== (focus ? 'focus' : 'chapter') || entry.chapter !== (focus ? 11 : Number(entry.id.slice(8)))) {
    throw new Error(`Incorrect book chapter or entry kind for ${entry.id}.`);
  }
  if (!parts.includes(entry.part) || !Object.hasOwn(labels, entry.coverage)) {
    throw new Error(`Invalid area or connection type for ${entry.id}.`);
  }
  for (const field of ['bookTitle', 'title', 'sections', 'predict', 'try', 'reflect', 'limit']) {
    if (typeof entry[field] !== 'string' || !entry[field].trim()) throw new Error(`Missing ${field} for ${entry.id}.`);
  }
  if (focus && !/\b11\.5\b/.test(entry.sections)) throw new Error('The SHA-3 focus must explicitly reference section 11.5.');
  if (!Array.isArray(entry.labs) || !entry.labs.length) throw new Error(`Missing lab connections for ${entry.id}.`);
  const slugs = new Set();
  for (const lab of entry.labs) {
    if (!catalog.has(lab.slug)) throw new Error(`Missing catalog lab: ${lab.slug} in ${entry.id}.`);
    if (slugs.has(lab.slug)) throw new Error(`Duplicate lab ${lab.slug} in ${entry.id}.`);
    slugs.add(lab.slug);
    if (!Object.hasOwn(labels, lab.coverage) || typeof lab.note !== 'string' || !lab.note.trim()) {
      throw new Error(`Missing connection type or explanation for ${lab.slug} in ${entry.id}.`);
    }
  }
}

const stopLabel = entry => entry.kind === 'focus' ? 'Section 11.5 · SHA-3 focus' : `Chapter ${entry.chapter}`;
const chapterHtml = entries.map(entry => {
  const connections = entry.labs.map(connection => {
    const lab = catalog.get(connection.slug);
    return `<li data-lab="${esc(connection.slug)}"><a href="${esc(lab.href)}">${esc(lab.title)}</a><span class="badge ${connection.coverage}">${labels[connection.coverage]}</span><p>${esc(connection.note)}</p></li>`;
  }).join('\n');
  return `<article class="panel chapter" id="${entry.id}" data-chapter="${entry.chapter}" data-kind="${entry.kind}" data-part="${esc(entry.part)}" data-coverage="${entry.coverage}" data-sections="${esc(entry.sections)}" aria-labelledby="${entry.id}-title">
<header><div><p class="eyebrow">${stopLabel(entry)} · ${esc(entry.part)}</p><h2 id="${entry.id}-title">${esc(entry.bookTitle)}</h2></div><span class="badge ${entry.coverage}">${labels[entry.coverage]}</span></header>
<p class="chapter-reading"><strong>Learning focus:</strong> ${esc(entry.title)}</p>
<p class="small chapter-sections"><strong>Read:</strong> ${esc(entry.sections)} · <a href="${chapterUrl(entry.chapter)}">Publisher’s chapter ${entry.chapter} page</a></p>
<p class="predict"><strong>Predict before opening a lab:</strong> ${esc(entry.predict)}</p>
<ul class="chapter-labs">${connections}</ul>
<p class="exercise"><strong>Experiment:</strong> ${esc(entry.try)}</p>
<p class="reflect"><strong>Explain the result:</strong> ${esc(entry.reflect)}</p>
<p class="coverage-boundary"><strong>Coverage boundary:</strong> ${esc(entry.limit)}</p>
<label class="checkpoint"><input type="checkbox" data-entry="${entry.id}" disabled> I explored this study stop</label>
</article>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Understanding Cryptography, 2nd Edition Reading Path · Crypto Lab</title>
<meta name="description" content="An independent companion to Paar, Pelzl and Güneysu: 14 book chapters plus a SHA-3 focus, catalog-backed Crypto Lab connections, original activities and explicit coverage limits.">
<link rel="canonical" href="https://crypto-lab.systemslibrarian.dev/learn/understanding-cryptography/">
<link rel="stylesheet" href="../shared/workshop.css">
<link rel="stylesheet" href="../shared/reading-path.css">
<link rel="stylesheet" href="path.css">
<script type="module" src="app.mjs"></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to reading path</a>
<div class="shell">
<nav class="topbar" aria-label="Primary"><a class="brand" href="../../">CRYPTO LAB</a><a href="../boneh-shoup/">Boneh–Shoup path</a><a href="../modern-cryptography/">Katz–Lindell path</a><a href="../../teach/">For educators</a></nav>
<main id="main" class="reading-path">
<header class="reading-header">
<h1>Understanding Cryptography</h1>
<p>Christof Paar, Jan Pelzl &amp; Tim Güneysu · Second edition, Springer, 2024</p>
<p class="companion-note">Independent companion · 14 chapters + a SHA-3 focus · <a href="${book}">Publisher’s book page</a> · <a href="https://www.cryptography-textbook.com/book/">Authors’ book site</a></p>
<p class="path-intro">Follow the algorithms from their arithmetic to the choices that make a cryptographic system work. Read, predict an outcome, try it in a lab, then explain what the experiment establishes.</p>
<p class="small edition-note"><strong>Edition and numbering:</strong> The published second edition has 14 numbered chapters. SHA-3 is §11.5 within Hash Functions; it gets a separate study stop here. Post-Quantum Cryptography is Chapter 12. The published Chapter 14 is titled <em>Key Management</em>; the authors’ website calls it <em>Key Establishment</em>. <a href="#sources-title">Check the edition sources</a>.</p>
<p class="small draft-summary"><a href="${report}">Chapter map and ranked gap report</a> · Lab links and titles come from the <a href="${sourceRepository}/blob/${branch}/CATALOG.md">catalog</a>.</p>
<nav class="chapter-toc" aria-label="Chapter contents"><ol>${entries.map(entry => `<li><a href="#${entry.id}"><span>${entry.kind === 'focus' ? '§11.5' : entry.chapter}</span> ${esc(entry.bookTitle)}</a></li>`).join('')}</ol></nav>
</header>

<section aria-labelledby="browse-title">
<h2 id="browse-title">Find your chapter</h2>
<div id="reader-controls" hidden>
<div class="filters">
<div><label for="search">Search topics or exhibits</label><input id="search" type="search" placeholder="Try: chapter 11, section 11.5, AES, certificates"></div>
<div><label for="part">Book area</label><select id="part"><option value="all">All areas</option>${parts.map(part => `<option>${esc(part)}</option>`).join('')}</select></div>
<div><label for="coverage">Connection type</label><select id="coverage"><option value="all">All connections</option>${Object.entries(labels).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select></div>
</div>
<div class="controls"><button class="secondary" id="clear">Clear filters</button><button class="secondary" id="clear-progress">Reset reading progress</button></div>
<p id="results" role="status" aria-live="polite">15 study stops</p>
<p class="small reading-progress"><span id="progress" class="progress" role="status" aria-live="polite">0 of 15 explored</span> · <span id="storage-note">This browser only.</span></p>
</div>
<div id="chapters">${chapterHtml}</div>
<p id="empty" class="notice" hidden>No study stops match. Clear the filters or try a broader term.</p>
</section>

<section class="panel" aria-labelledby="coverage-title">
<h2 id="coverage-title">About this reading path</h2>
<p>Read the indicated section in your own copy of the book. Before opening a lab, record your prediction. Change the named inputs, inspect the outcome, and explain both the result and the experiment’s limits. Publisher links identify the reading; access to the complete book may require purchase or institutional access.</p>
<p class="reading-loop">Read → predict → experiment → explain</p>
<p>This is an independent educational companion by Paul A. Clark, unaffiliated with Christof Paar, Jan Pelzl, Tim Güneysu or Springer Nature. No author or publisher endorsement is implied. All activity prompts are original. No book text, figures, exercises or solutions are reproduced or rehosted.</p>
<h3>What the connection labels mean</h3>
<p><span class="badge direct">Direct connection</span> A lab addresses a selected idea or construction in the reading. Its note and activity boundary state which part.</p>
<p><span class="badge modern">Modern counterpart</span> A different construction or a later standard illustrates a related idea. The lab note explains the distinction.</p>
<p><span class="badge intro">Introductory bridge</span> An intuition builder or partial connection. The missing operations, assumptions or reasoning remain reading work.</p>
<p>Each lab has its own connection label. The study-stop label describes its overall connection and controls filtering. None of these labels means complete chapter coverage. A successful experiment does not prove a scheme secure, and toy parameters do not provide deployment security.</p>
<p>Optional checkmarks record exploration, not mastery. Progress is separate from the other reading paths and stays in this browser when storage is available. If storage is unavailable, checkmarks still work for the current visit.</p>
<p><strong>Before you begin:</strong> Use the book for definitions, arithmetic and derivations. Read each lab’s own teaching limits. Modern implementation names and standards can differ from the book’s 2024 publication context.</p>
</section>

<section class="panel sources" aria-labelledby="sources-title">
<h2 id="sources-title">Book, edition and sources</h2>
<p>Christof Paar, Jan Pelzl and Tim Güneysu. <cite>Understanding Cryptography: From Established Symmetric and Asymmetric Ciphers to Post-Quantum Algorithms</cite>. Second edition. Springer, 2024. DOI: 10.1007/978-3-662-69007-9.</p>
<ul class="source-links">
<li><a href="${book}">Springer book record and published chapter list</a></li>
<li><a href="https://link.springer.com/content/pdf/bfm:978-3-662-69007-9/1">Publisher’s free front matter and table of contents (PDF)</a></li>
<li><a href="https://www.cryptography-textbook.com/book/">Authors’ official book site, teaching resources and errata</a></li>
<li><a href="https://www.cryptography-textbook.com/files/toc.pdf">Authors’ table of contents (PDF)</a></li>
<li><a href="https://www.cryptography-textbook.com/wp-content/uploads/2025/04/errata_2nd.pdf">Authors’ second-edition errata (PDF)</a></li>
<li><a href="${report}">This path’s chapter map, coverage evidence and gap decisions</a></li>
</ul>
<p><strong>Edition check:</strong> References checked on 21 October 2026 against the publisher’s chapter list and front matter. This path follows the book’s 14-chapter order and separates §11.5 as a focus. Chapter and section numbers, rather than page numbers, keep the references usable across print and digital copies.</p>
<p><strong>Post-quantum standards:</strong> The book predates the final August 2024 publications of <a href="https://csrc.nist.gov/pubs/fips/203/final">FIPS 203 (ML-KEM)</a>, <a href="https://csrc.nist.gov/pubs/fips/204/final">FIPS 204 (ML-DSA)</a> and <a href="https://csrc.nist.gov/pubs/fips/205/final">FIPS 205 (SLH-DSA)</a>. Use each lab’s documented implementation and limits when connecting a book example to a current standard.</p>
<p>The book remains the work of its authors and publisher. Links to official reading resources do not place the book under this repository’s MIT license.</p>
<p>Choose another route: <a href="../boneh-shoup/">Boneh–Shoup</a>, <a href="../modern-cryptography/">Katz–Lindell</a>, or <a href="../applied-cryptography/">Schneier</a>. Each companion follows its own source and states its coverage limits.</p>
<p><a href="https://github.com/systemslibrarian/crypto-lab/issues/new">Suggest a correction</a> with the chapter, lab and claim that should change.</p>
</section>
<noscript><p class="notice">All 14 chapter entries, the SHA-3 focus, their activities and lab links are available without JavaScript. Filtering and reading-progress checkmarks require JavaScript.</p></noscript>
</main>
<footer><a href="../../">Explore the full catalog</a> · <a href="${sourceRepository}/tree/${branch}/learn/understanding-cryptography">Source and teaching boundaries</a><p>So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31</p></footer>
</div>
</body>
</html>
`;
return html;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
const html = renderReadingPath();
const output = path.join(dir, 'index.html');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== html) throw new Error('Understanding Cryptography path is stale; run node learn/understanding-cryptography/build.mjs');
  console.log(`Understanding Cryptography reading path: 14 chapters, SHA-3 focus and catalog links in sync.`);
} else {
  fs.writeFileSync(output, html);
  console.log('Generated Understanding Cryptography reading path: 14 chapters and one SHA-3 focus.');
}
}
