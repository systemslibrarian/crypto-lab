import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chapters} from './chapters.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.join(dir, '../../knowledge-map/catalog.json'), 'utf8'));
const labs = new Map(catalog.exhibits.map(exhibit => [exhibit.title, exhibit]));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = {direct:'Direct coverage', modern:'Modern counterpart', intro:'Introductory coverage'};
const parts = ['Foundations', 'Symmetric cryptography', 'Public-key cryptography'];

if (chapters.length !== 15 || chapters.some((chapter, index) => chapter.chapter !== index + 1)) {
  throw new Error('The third-edition companion must contain chapters 1–15 in order.');
}
for (const chapter of chapters) {
  if (!parts.includes(chapter.part) || !Object.hasOwn(labels, chapter.coverage)) {
    throw new Error(`Invalid area or coverage for chapter ${chapter.chapter}.`);
  }
  for (const field of ['title', 'reading', 'sections', 'try', 'reflect', 'limit']) {
    if (typeof chapter[field] !== 'string' || !chapter[field].trim()) throw new Error(`Missing ${field} for chapter ${chapter.chapter}.`);
  }
  if (!Array.isArray(chapter.labs) || !chapter.labs.length) throw new Error(`Missing lab connections for chapter ${chapter.chapter}.`);
}

const chapterHtml = chapters.map(chapter => {
  const connections = chapter.labs.map(connection => {
    const exhibit = labs.get(connection.title);
    if (!exhibit) throw new Error(`Missing catalog exhibit: ${connection.title}`);
    if (!Object.hasOwn(labels, connection.coverage) || typeof connection.note !== 'string' || !connection.note.trim()) {
      throw new Error(`Missing coverage or explanation for ${connection.title} in chapter ${chapter.chapter}.`);
    }
    if (!/^https:\/\//.test(exhibit.href)) throw new Error(`Unexpected catalog link for ${connection.title}.`);
    return `<li><a href="${esc(exhibit.href)}">${esc(connection.title)}</a><span class="badge ${connection.coverage}">${labels[connection.coverage]}</span><p>${esc(connection.note)}</p></li>`;
  }).join('\n');
  return `<article class="panel chapter" id="chapter-${chapter.chapter}" data-part="${esc(chapter.part)}" data-coverage="${chapter.coverage}" aria-labelledby="chapter-${chapter.chapter}-title">
<header><div><p class="eyebrow">Chapter ${chapter.chapter} · ${esc(chapter.part)}</p><h2 id="chapter-${chapter.chapter}-title">${esc(chapter.title)}</h2></div><span class="badge ${chapter.coverage}">${labels[chapter.coverage]}</span></header>
<p class="chapter-reading">${esc(chapter.reading)}</p><p class="small chapter-sections">Reading pointers: ${esc(chapter.sections)}</p>
<ul class="chapter-labs">${connections}</ul>
<p class="exercise"><strong>Try this:</strong> ${esc(chapter.try)}</p>
<p class="reflect"><strong>Explain the result:</strong> ${esc(chapter.reflect)}</p>
<p><strong>Coverage boundary:</strong> ${esc(chapter.limit)}</p>
<label class="checkpoint"><input type="checkbox" data-chapter="${chapter.chapter}" disabled> I explored this chapter’s connections</label>
</article>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Introduction to Modern Cryptography Reading Path · Crypto Lab</title>
<meta name="description" content="An independent companion to Katz and Lindell’s Introduction to Modern Cryptography: 15 chapter connections, original experiments, security questions and explicit coverage limits.">
<link rel="canonical" href="https://crypto-lab.systemslibrarian.dev/learn/modern-cryptography/">
<link rel="stylesheet" href="../shared/workshop.css">
<link rel="stylesheet" href="../shared/reading-path.css">
<link rel="stylesheet" href="path.css">
<script type="module" src="app.mjs"></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to reading path</a>
<div class="shell">
<nav class="topbar" aria-label="Primary"><a class="brand" href="../../">CRYPTO LAB</a><a href="../applied-cryptography/">Applied Cryptography path</a><a href="../../teach/">For educators</a></nav>
<main id="main" class="reading-path">
<header class="reading-header">
<h1>Introduction to Modern Cryptography</h1>
<p>Jonathan Katz &amp; Yehuda Lindell · Third edition / revised third edition · 15 chapters</p>
</header>

<section aria-labelledby="browse-title">
<h2 id="browse-title">Find your chapter</h2>
<div id="reader-controls" hidden>
<div class="filters">
<div><label for="search">Search topics or exhibits</label><input id="search" type="search" placeholder="Try: chapter 8, Hidden Bit, CPA, Paillier"></div>
<div><label for="part">Book area</label><select id="part"><option value="all">All areas</option>${parts.map(part => `<option>${esc(part)}</option>`).join('')}</select></div>
<div><label for="coverage">Chapter coverage</label><select id="coverage"><option value="all">All coverage</option>${Object.entries(labels).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select></div>
</div>
<div class="controls"><button class="secondary" id="clear">Clear filters</button><button class="secondary" id="clear-progress">Reset reading progress</button></div>
<p id="results" role="status" aria-live="polite">${chapters.length} chapter connections</p>
<p class="small reading-progress"><span id="progress" class="progress" role="status" aria-live="polite">0 of ${chapters.length} explored</span> · This browser only.</p>
</div>
<div id="chapters">${chapterHtml}</div>
<p id="empty" class="notice" hidden>No chapters match. Clear the filters or try a broader term.</p>
</section>

<section class="panel" aria-labelledby="coverage-title">
<h2 id="coverage-title">About this reading path</h2>
<p>Read a chapter, make a prediction, then change one assumption in an experiment. Use what happens to explain the security claim in your own words.</p>
<p class="reading-loop">Read → predict → experiment → explain</p>
<p class="small">Independent and unaffiliated with the authors or publisher. The practice prompts are original; no textbook passages or exercises are reproduced. Chapter connections were reviewed on 20 October 2026. Experiments illustrate security ideas; they do not replace proofs.</p>
<p>Optional checkmarks record exploration, not mastery. They stay in this browser when local storage is available and are separate from the Applied Cryptography path.</p>
<h3>What the coverage labels mean</h3>
<p><span class="badge direct">Direct coverage</span> A lab addresses a selected concept in that chapter. The label does not promise complete chapter coverage.</p>
<p><span class="badge modern">Modern counterpart</span> A different practical construction or a later standard explores a related idea. Read the lab note for how it differs from the book’s example.</p>
<p><span class="badge intro">Introductory coverage</span> A partial bridge or intuition builder. Formal definitions, reductions and unimplemented constructions remain reading work.</p>
<p>Each lab has its own label. The chapter label describes the overall connection; the coverage filter uses that chapter label.</p>
<ul class="book-outline"><li><strong>1–2:</strong> Foundations</li><li><strong>3–8:</strong> Symmetric cryptography</li><li><strong>9–15:</strong> Public-key cryptography</li></ul>
</section>

<section class="panel sources" aria-labelledby="sources-title">
<h2 id="sources-title">Read with the authors’ sources beside you</h2>
<ul class="source-links">
<li><a href="https://www.cs.umd.edu/~jkatz/imc.html">Jonathan Katz’s official book page</a></li>
<li><a href="https://www.cs.umd.edu/~jkatz/imc/toc-preface-3rd.pdf">Official third-edition contents and preface</a></li>
<li><a href="https://www.cs.umd.edu/~jkatz/imc/errata-3rd.pdf">Authors’ third-edition errata</a></li>
<li><a href="https://www.routledge.com/Introduction-to-Modern-Cryptography-Revised-Third-Edition/Katz-Lindell/p/book/9781032496795">Publisher’s revised third edition</a></li>
</ul>
<p><strong>Edition note:</strong> Reading pointers follow the author-hosted third-edition contents. The revised edition’s publisher listing keeps the same 15-chapter outline. Chapter 14 is headed “Post-Quantum Cryptography” in the author’s contents and “Quantum-Secure Cryptography” in the publisher’s list. Match the topics to your copy’s headings; this companion makes no claim about revised-edition page numbers.</p>
<p>Follow each exhibit’s own sources and implementation limits. Statistical success, a failed attack attempt or a successful encryption round trip cannot establish a security proof.</p>
<p>For a different route through protocols and historical constructions, use the <a href="../applied-cryptography/">Applied Cryptography reading path</a>. General zero-knowledge and multiparty-computation exhibits are further exploration in the <a href="../../">full catalog</a>; they are not presented as numbered chapters of this book.</p>
</section>
<noscript><p class="notice">All 15 chapter connections and lab links are available without JavaScript. Filtering and reading-progress checkmarks require JavaScript.</p></noscript>
</main>
<footer><a href="../../">Explore the full catalog</a> · <a href="https://github.com/systemslibrarian/crypto-lab/tree/main/learn/modern-cryptography">Source and teaching boundaries</a><p>So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31</p></footer>
</div>
</body>
</html>
`;

const output = path.join(dir, 'index.html');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== html) throw new Error('Modern reading path is stale; run node learn/modern-cryptography/build.mjs');
  console.log(`Modern reading path: ${chapters.length} chapters and catalog links in sync.`);
} else {
  fs.writeFileSync(output, html);
  console.log(`Generated modern reading path with ${chapters.length} chapter connections.`);
}
