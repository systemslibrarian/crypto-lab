import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chapters} from './chapters.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.join(dir, '../../knowledge-map/catalog.json'), 'utf8'));
const labs = new Map(catalog.exhibits.map(exhibit => [exhibit.title, exhibit]));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = {direct:'Direct connection', modern:'Modern counterpart', intro:'Introductory bridge', supplement:'Supplementary exploration'};
const parts = ['Introduction', 'Secret key cryptography', 'Public key cryptography', 'Protocols'];
const bookPdf = 'https://crypto.stanford.edu/~dabo/cryptobook/BonehShoup_0_6.pdf';
// Physical PDF page numbers, checked against the official versioned file.
const pdfPages = {1:4,2:20,3:61,4:112,5:193,6:231,7:268,8:303,9:373,10:415,11:450,12:483,13:542,14:599,15:631,16:698,17:12,18:729,19:769,20:837,21:869,22:938,23:1011};

if (chapters.length !== 23 || chapters.some((chapter, index) => chapter.chapter !== index + 1)) {
  throw new Error('The version 0.6 companion must contain chapters 1–23 in order.');
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
${chapter.draftNote ? `<p class="notice draft-note">${esc(chapter.draftNote)}</p>` : ''}
<p class="chapter-reading"><strong>Learning focus:</strong> ${esc(chapter.title)}</p><p class="small chapter-sections"><strong>Read:</strong> ${esc(chapter.sections)} · <a href="${bookPdf}#page=${pdfPages[chapter.chapter]}">${[1,17].includes(chapter.chapter) ? 'See the contents (PDF)' : 'Open chapter in free PDF'}</a></p>
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
<title>A Graduate Course in Applied Cryptography Reading Path · Crypto Lab</title>
<meta name="description" content="An independent Boneh–Shoup reading path: 23 chapter entries linked to Crypto Lab experiments, official free PDF references, original activities and explicit draft gaps.">
<link rel="canonical" href="https://crypto-lab.systemslibrarian.dev/learn/boneh-shoup/">
<link rel="stylesheet" href="../shared/workshop.css">
<link rel="stylesheet" href="../shared/reading-path.css">
<link rel="stylesheet" href="path.css">
<script type="module" src="app.mjs"></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to reading path</a>
<div class="shell">
<nav class="topbar" aria-label="Primary"><a class="brand" href="../../">CRYPTO LAB</a><a href="../understanding-cryptography/">Understanding Cryptography path</a><a href="../modern-cryptography/">Katz–Lindell path</a><a href="../../teach/">For educators</a></nav>
<main id="main" class="reading-path">
<header class="reading-header">
<h1>A Graduate Course in Applied Cryptography</h1>
<p>Dan Boneh &amp; Victor Shoup · Draft version 0.6 (January 2023) · 23 chapter entries</p>
<p class="companion-note">Independent companion · <a href="https://toc.cryptobook.us/">Official book site</a> · <a href="${bookPdf}">Read the free PDF</a> · <a href="#sources-title">Version and sources</a></p>
<p class="path-intro">Connect practical constructions to their security arguments. Read, predict an outcome, test it in a lab, then return to the assumptions and proof.</p>
<p class="small draft-summary">This draft has gaps: <a href="#chapter-1">Chapters 1</a> and <a href="#chapter-17">17</a> are absent from the body, and <a href="#chapter-20">§§20.5–20.7</a> are unfinished. Related activities are explicitly scoped below.</p>
<nav class="part-jumps" aria-label="Reading path parts"><a href="#chapter-2">Secret key · 2–9</a><a href="#chapter-10">Public key · 10–17</a><a href="#chapter-18">Protocols · 18–23</a></nav>
</header>

<section aria-labelledby="browse-title">
<h2 id="browse-title">Find your chapter</h2>
<div id="reader-controls" hidden>
<div class="filters">
<div><label for="search">Search topics or exhibits</label><input id="search" type="search" placeholder="Try: chapter 19, Schnorr, pairings, MPC"></div>
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
<p>Start with the listed sections in the authors’ free PDF. The chapter links open the pinned version 0.6; PDF viewers may handle page anchors differently. Write down a prediction before opening a lab, run the experiment, then explain what you observed and which assumptions mattered. Each activity ends with the limits of that connection.</p>
<p class="reading-loop">Read → predict → experiment → explain</p>
<p>An independent educational companion by Paul A. Clark, unaffiliated with Dan Boneh, Victor Shoup or Stanford University. No author endorsement is implied. The practice prompts are original; no textbook passages or exercises are reproduced. Experiments illustrate security ideas; they do not replace proofs.</p>
<p>Optional checkmarks record exploration, not mastery. They stay in this browser when local storage is available and are separate from both the Schneier and Katz–Lindell paths.</p>
<h3>What the connection labels mean</h3>
<p><span class="badge direct">Direct connection</span> A lab addresses a selected concept in that chapter. This is a connection to part of the chapter, with its scope stated in the lab note and activity boundary.</p>
<p><span class="badge modern">Modern counterpart</span> A different practical construction or a later standard explores a related idea. Read the lab note for how it differs from the book’s example.</p>
<p><span class="badge intro">Introductory bridge</span> A partial bridge or intuition builder. Formal definitions, reductions and unimplemented constructions remain reading work.</p>
<p><span class="badge supplement">Supplementary exploration</span> Labs for a topic whose chapter or section is unfinished in the pinned draft. These are independent extensions, not coverage of unwritten text.</p>
<p>Each lab has its own label. The chapter label describes the overall connection and is used by the filter. None of the labels implies complete chapter coverage.</p>
<ul class="book-outline"><li><strong>1:</strong> Introduction</li><li><strong>2–9:</strong> Secret key</li><li><strong>10–17:</strong> Public key</li><li><strong>18–23:</strong> Protocols</li></ul>
<p><strong>Before you begin:</strong> Expect modular arithmetic, probability and mathematical arguments. The labs make selected operations inspectable; they cannot supply every prerequisite or replace working through the text. Read each lab’s own sources and teaching limits.</p>
</section>

<section class="panel sources" aria-labelledby="sources-title">
<h2 id="sources-title">Book, version and sources</h2>
<p>Dan Boneh and Victor Shoup. <cite>A Graduate Course in Applied Cryptography</cite>. Version 0.6, January 2023.</p>
<ul class="source-links">
<li><a href="https://toc.cryptobook.us/">Authors’ official book site and version history</a></li>
<li><a href="${bookPdf}">Author-hosted version 0.6 PDF — free to read</a></li>
<li><a href="https://toc.cryptobook.us/book.pdf">Current-draft PDF link — may change with future revisions</a></li>
</ul>
<p><strong>Version note:</strong> Checked on 20 October 2026. The official site identifies version 0.6 as its latest release and gives a posting date of 14 January 2023. This guide pins its chapter references to that file. A future draft may change the numbering; use the official version history when comparing copies.</p>
<p><strong>Draft boundaries:</strong> Chapters 1 and 17 are present in the contents but their bodies are absent from this PDF. Sections 20.5–20.7 are unfinished, as are several other sections identified in individual activities. Chapter 14’s heading here follows the PDF; the website’s abbreviated outline uses different wording. No complete chapter-coverage claim is made.</p>
<p>The book is linked from its authors’ site, not rehosted here. The activity prompts and lab connections are original. Publicly available reading access is not a claim that the book is public domain or covered by this repository’s MIT license.</p>
<p>Other current companions: <a href="../understanding-cryptography/">Understanding Cryptography</a> and <a href="../modern-cryptography/">Katz and Lindell’s Introduction to Modern Cryptography</a>. Each follows its own chapter sequence and states its coverage limits.</p>
<h3>Historical further reading</h3>
<p>Explore earlier constructions and protocol ideas with <a href="../applied-cryptography/">Schneier’s Applied Cryptography (1996)</a>, a historical reading companion with explicit modern connections and coverage limits.</p>
<p><a href="https://github.com/systemslibrarian/crypto-lab/issues/new">Suggest a correction</a> with the chapter, lab and claim that should change.</p>
</section>
<noscript><p class="notice">All 23 chapter connections and lab links are available without JavaScript. Filtering and reading-progress checkmarks require JavaScript.</p></noscript>
</main>
<footer><a href="../../">Explore the full catalog</a> · <a href="https://github.com/systemslibrarian/crypto-lab/tree/main/learn/boneh-shoup">Source and teaching boundaries</a><p>So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31</p></footer>
</div>
</body>
</html>
`;

const output = path.join(dir, 'index.html');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== html) throw new Error('Boneh–Shoup reading path is stale; run node learn/boneh-shoup/build.mjs');
  console.log(`Boneh–Shoup reading path: ${chapters.length} chapters and catalog links in sync.`);
} else {
  fs.writeFileSync(output, html);
  console.log(`Generated Boneh–Shoup reading path with ${chapters.length} chapter connections.`);
}
