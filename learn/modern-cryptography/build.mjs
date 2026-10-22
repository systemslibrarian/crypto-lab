import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chapters} from './chapters.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.join(dir, '../../knowledge-map/catalog.json'), 'utf8'));
const labs = new Map(catalog.exhibits.map(exhibit => [exhibit.title, exhibit]));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = {direct:'Direct connection', modern:'Modern counterpart', intro:'Introductory bridge'};
const parts = ['Foundations', 'Symmetric cryptography', 'Public-key cryptography'];

if (chapters.length !== 15 || chapters.some((chapter, index) => chapter.chapter !== index + 1)) {
  throw new Error('The revised-third-edition companion must contain chapters 1–15 in order.');
}
for (const chapter of chapters) {
  if (!parts.includes(chapter.part) || !Object.hasOwn(labels, chapter.coverage)) {
    throw new Error(`Invalid area or coverage for chapter ${chapter.chapter}.`);
  }
  for (const field of ['bookTitle', 'title', 'sections', 'predict', 'try', 'reflect', 'limit']) {
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
<header><div><p class="eyebrow">Chapter ${chapter.chapter} · ${esc(chapter.part)}</p><h2 id="chapter-${chapter.chapter}-title">${esc(chapter.bookTitle)}</h2></div><span class="badge ${chapter.coverage}">${labels[chapter.coverage]}</span></header>
${chapter.originalTitle ? `<p class="small chapter-edition">2021 third-edition title: ${esc(chapter.originalTitle)}</p>` : ''}
<p class="chapter-reading"><strong>Learning focus:</strong> ${esc(chapter.title)}</p><p class="small chapter-sections"><strong>Read:</strong> ${esc(chapter.sections)}</p>
<p class="predict"><strong>Predict before opening a lab:</strong> ${esc(chapter.predict)}</p>
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
<meta name="description" content="An independent companion to Katz and Lindell’s Introduction to Modern Cryptography, revised third edition (2025): 15 chapter connections, original experiments, security questions and explicit coverage limits.">
<link rel="canonical" href="https://crypto-lab.systemslibrarian.dev/learn/modern-cryptography/">
<link rel="stylesheet" href="../shared/workshop.css">
<link rel="stylesheet" href="../shared/reading-path.css">
<link rel="stylesheet" href="path.css">
<script type="module" src="app.mjs"></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to reading path</a>
<div class="shell">
<nav class="topbar" aria-label="Primary"><a class="brand" href="../../">CRYPTO LAB</a><a href="../understanding-cryptography/">Understanding Cryptography path</a><a href="../boneh-shoup/">Boneh–Shoup path</a><a href="../../teach/">For educators</a></nav>
<main id="main" class="reading-path">
<header class="reading-header">
<h1>Introduction to Modern Cryptography</h1>
<p>Jonathan Katz &amp; Yehuda Lindell · Revised third edition (2025) · 15 chapters</p>
<p class="companion-note">Independent companion · <a href="#sources-title">Edition and sources</a></p>
</header>

<section aria-labelledby="browse-title">
<h2 id="browse-title">Find your chapter</h2>
<div id="reader-controls" hidden>
<div class="filters">
<div><label for="search">Search topics or exhibits</label><input id="search" type="search" placeholder="Try: chapter 8, Hidden Bit, CPA, Paillier"></div>
<div><label for="part">Book area</label><select id="part"><option value="all">All areas</option>${parts.map(part => `<option>${esc(part)}</option>`).join('')}</select></div>
<div><label for="coverage">Connection type</label><select id="coverage"><option value="all">All connections</option>${Object.entries(labels).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select></div>
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
<p>Start with the listed sections in your copy of the book. Write down a prediction before opening a lab, run the experiment, then explain what you observed and which assumptions mattered. Each activity ends with the limits of that connection.</p>
<p class="reading-loop">Read → predict → experiment → explain</p>
<p>An independent educational companion by Paul A. Clark, unaffiliated with the authors or publisher. The practice prompts are original; no textbook passages or exercises are reproduced. Experiments illustrate security ideas; they do not replace proofs.</p>
<p>Optional checkmarks record exploration, not mastery. They stay in this browser when local storage is available and are separate from the Applied Cryptography path.</p>
<h3>What the connection labels mean</h3>
<p><span class="badge direct">Direct connection</span> A lab addresses a selected concept in that chapter. This is a connection to part of the chapter, with its scope stated in the lab note and activity boundary.</p>
<p><span class="badge modern">Modern counterpart</span> A different practical construction or a later standard explores a related idea. Read the lab note for how it differs from the book’s example.</p>
<p><span class="badge intro">Introductory bridge</span> A partial bridge or intuition builder. Formal definitions, reductions and unimplemented constructions remain reading work.</p>
<p>Each lab has its own label. The chapter label describes the overall connection and is used by the filter. None of the labels implies complete chapter coverage.</p>
<ul class="book-outline"><li><strong>1–2:</strong> Foundations</li><li><strong>3–8:</strong> Symmetric cryptography</li><li><strong>9–15:</strong> Public-key cryptography</li></ul>
</section>

<section class="panel sources" aria-labelledby="sources-title">
<h2 id="sources-title">Book, edition and sources</h2>
<p>Jonathan Katz and Yehuda Lindell. <cite>Introduction to Modern Cryptography</cite>. Revised third edition. CRC Press, 2025.</p>
<ul class="source-links">
<li><a href="https://www.routledge.com/Introduction-to-Modern-Cryptography-Revised-Third-Edition/Katz-Lindell/p/book/9781032496795">Publisher’s revised third edition (2025)</a></li>
<li><a href="https://doi.org/10.1201/9781003398134">Revised third edition DOI</a></li>
<li><a href="https://www.cs.umd.edu/~jkatz/imc.html">Jonathan Katz’s official book page</a></li>
<li><a href="https://www.cs.umd.edu/~jkatz/imc/toc-preface-3rd.pdf">Original third-edition contents and preface (2021)</a></li>
<li><a href="https://www.cs.umd.edu/~jkatz/imc/errata-3rd.pdf">Authors’ errata for the original third edition</a></li>
</ul>
<p><strong>Edition note:</strong> Chapter titles and the listed section references were checked directly against the 2025 revised third edition. References use chapter and section numbers, not PDF viewer page numbers. The 2021 third edition has the same 15-chapter sequence, but Chapter 14 was titled “Post-Quantum Cryptography.” The revision incorporates corrections and updates the discussion of NIST standards; the author-hosted 2021 contents and errata remain linked for comparison.</p>
<p class="small">Reading references checked against the revised edition on 21 October 2026. The linked labs may evolve; their own sources and stated limits remain part of each activity.</p>
<p>Follow each exhibit’s own sources and implementation limits. Statistical success, a failed attack attempt or a successful encryption round trip cannot establish a security proof.</p>
<p>General zero-knowledge and multiparty-computation exhibits are further exploration in the <a href="../../">full catalog</a>; they are not presented as numbered chapters of this book.</p>
<h3>Historical further reading</h3>
<p>Explore earlier constructions and protocol ideas with <a href="../applied-cryptography/">Schneier’s Applied Cryptography (1996)</a>, a historical reading companion with explicit modern connections and coverage limits.</p>
<p><a href="https://github.com/systemslibrarian/crypto-lab/issues/new">Suggest a correction</a> with the chapter, lab and claim that should change.</p>
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
