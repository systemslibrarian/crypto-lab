#!/usr/bin/env node
/*
 * catalog-sync.js — generate CATALOG.md, the algorithm-level view of the fleet.
 *
 * Run: node tools/catalog-sync.js check
 * Prevents: the algorithm index drifting from the cards, and a card claiming an algorithm with no evidence behind it
 *
 * index.html stays the single source of truth. The cards carry the facts —
 * catalog-evidence.js derives them from each lab's own source and writes them
 * there — and this file turns the cards into the four things a card cannot
 * answer on its own:
 *
 *   per-lab entries      what one lab implements, references, attacks, and
 *                        under whose standard, with the anchor behind each claim
 *   REVERSE INDEX        which labs implement a given algorithm
 *   STANDARDS-BODY INDEX which bodies the fleet's algorithms answer to
 *   OVERLAP REPORT       which labs cover the same ground, and whether anyone
 *                        has said how they differ
 *
 * CATALOG.md IS NOT A PARALLEL FILE. Nothing in it is written by hand and
 * nothing is stated there that the cards do not already carry. `check` fails
 * when it drifts, in exactly the way readme-sync's tables do, so it cannot
 * become a second place where the truth lives.
 *
 * The reverse index is the reason the whole schema exists. "Which labs implement
 * ML-KEM?" is not answerable from the cards, the README or concept-coverage.md:
 * the chips are per-lab vocabulary — 625 distinct ones across 207 cards — so a
 * chip search answers with the labs that happened to spell it your way and looks
 * complete while doing it.
 *
 * WHAT IT REFUSES
 *
 * An implemented algorithm with no `@file:line` anchor fails the run. So does an
 * overlap naming a lab that has no card, and an overlap with no stated
 * difference after the colon. A claim with no evidence is the thing this pair of
 * tools exists to make impossible, and accepting one here would make the anchor
 * decorative — which is worse than not having it, because it reads as proof.
 *
 * Usage (from the repo root):
 *   node tools/catalog-sync.js          rewrite CATALOG.md
 *   node tools/catalog-sync.js check    exit 1 if it drifts, or a claim is unsupported
 *   node tools/catalog-sync.js report          overlap pairs with no stated difference
 *   node tools/catalog-sync.js contradictions  cards naming an algorithm their lab does not implement
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { ALGORITHMS } = require('./catalog-vocab.js');

const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'index.html');
const OUT = path.join(ROOT, 'CATALOG.md');

const NAMED = { amp: '&', apos: "'", quot: '"', lt: '<', gt: '>', rarr: '→', pi: 'π' };
const decode = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (all, n) => (n in NAMED ? NAMED[n] : all));

const VOCAB = new Map(ALGORITHMS.map((a) => [a.name, a]));
const errors = [];

function cards() {
  const html = fs.readFileSync(HTML, 'utf8');
  const re = /<a class="((?:project|feature)-card[^"]*)" data-category="([^"]*)" href="https:\/\/systemslibrarian\.github\.io\/([^/"]+)\/"([\s\S]*?)<\/a>/g;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const block = m[0];
    const attr = (n) => {
      const a = new RegExp(`\\sdata-${n}="([^"]*)"`).exec(block);
      return a ? decode(a[1]) : '';
    };
    const grab = (cls) => {
      const g = new RegExp(`(?:project|feature)-${cls}">([^<]+)<`).exec(block);
      return g ? decode(g[1].trim().replace(/\s+/g, ' ')) : '';
    };
    const kicker = /card-kicker">([^<]+)</.exec(block);
    const list = (v) => (v ? v.split(' | ').map((s) => s.trim()).filter(Boolean) : []);
    const split = (items, field, slug) => items.map((i) => {
      const at = i.lastIndexOf('@');
      if (at < 0) {
        if (field === 'implements' && i !== 'UNKNOWN') {
          errors.push(`${slug}: data-implements entry "${i}" has no @file:line anchor`);
        }
        return { name: i, at: null };
      }
      return { name: i.slice(0, at), at: i.slice(at + 1) };
    });
    const slug = m[3];
    const impl = attr('implements');
    out.push({
      slug,
      wip: m[1].includes('wip-card'),
      categories: m[2].split('|').map((s) => s.trim()).filter(Boolean),
      kicker: kicker ? decode(kicker[1].trim()) : '',
      title: grab('title'),
      copy: grab('copy'),
      chips: [...block.matchAll(/class="chip">([^<]+)</g)].map((x) => decode(x[1].trim())),
      unknown: impl === 'UNKNOWN' || impl === '',
      implements: impl === 'UNKNOWN' || impl === '' ? [] : split(list(impl), 'implements', slug),
      references: list(attr('references')),
      attacks: split(list(attr('attacks')), 'attacks', slug),
      standards: list(attr('standards')),
      implementation: attr('implementation') || 'UNKNOWN',
      overlaps: list(attr('overlaps')).map((o) => {
        const i = o.indexOf(':');
        if (i < 0) return { slug: o.trim(), difference: '' };
        return { slug: o.slice(0, i).trim(), difference: o.slice(i + 1).trim() };
      }),
    });
  }
  return out;
}

/** Overlap candidates, weighted by how DISTINCTIVE the shared algorithms are.
 *
 * Every lab that touches symmetric crypto implements AES and SHA-256, so a plain
 * "shares an algorithm" rule pairs almost everything with almost everything and
 * the report becomes noise nobody reads. Sharing ML-KEM with one other lab is a
 * real overlap; sharing SHA-256 with ninety is not a fact about either lab. Each
 * shared algorithm is therefore worth 1/(labs implementing it), so the pairs that
 * surface are the ones that genuinely cover the same ground. */
function overlaps(list) {
  const count = new Map();
  for (const c of list) for (const i of c.implements) count.set(i.name, (count.get(i.name) || 0) + 1);
  const pairs = [];
  for (let a = 0; a < list.length; a += 1) {
    for (let b = a + 1; b < list.length; b += 1) {
      const A = new Set(list[a].implements.map((i) => i.name));
      const shared = list[b].implements.map((i) => i.name).filter((n) => A.has(n));
      if (shared.length < 2) continue;
      const score = shared.reduce((s, n) => s + 1 / count.get(n), 0);
      /* 0.35 is where the list stops being readable as findings: it is 43 pairs
         out of the 3,014 that share any two algorithms, and the top of it is
         KDF Chain/KDF Arena, VSS Gate/Reshare Circle, Babel Hash/Hash Zoo —
         pairs a visitor would actually have to choose between. */
      if (score < 0.35) continue;
      pairs.push({ a: list[a], b: list[b], shared, score });
    }
  }
  return pairs.sort((x, y) => y.score - x.score || x.a.slug.localeCompare(y.a.slug));
}

function stated(pair) {
  const fwd = pair.a.overlaps.find((o) => o.slug === pair.b.slug && o.difference);
  const rev = pair.b.overlaps.find((o) => o.slug === pair.a.slug && o.difference);
  return fwd || rev || null;
}

function build(list) {
  const L = [];
  const anchor = (i) => (i.at ? ` \`${i.at}\`` : '');
  L.push('# Crypto Lab — algorithm catalog');
  L.push('');
  L.push('<!-- catalog-sync:begin — generated by tools/catalog-sync.js from the cards in index.html; do not edit by hand -->');
  L.push('');
  L.push('Every line below is generated from `index.html`, which stays the single source of');
  L.push('truth. The algorithm facts on each card are derived from that lab\'s own source by');
  L.push('`tools/catalog-evidence.js`, and each implemented algorithm carries the `file:line`');
  L.push('where the evidence is. Nothing here is maintained by hand.');
  L.push('');
  L.push('**Implemented** means the lab\'s code computes it — the algorithm appears in a');
  L.push('declaration, an invocation, a module import, or a WebCrypto call.');
  L.push('**Referenced** means the lab names it without implementing it: a lab that teaches an');
  L.push('attack on HQC by modelling its decode time references HQC and implements nothing.');
  L.push('The distinction is the point of the index, and a grep cannot make it.');
  L.push('');
  L.push('Regenerate with `node tools/catalog-sync.js`; re-derive the underlying facts with');
  L.push('`node tools/catalog-evidence.js write`; re-check every anchor against the lab clones');
  L.push('with `node tools/catalog-evidence.js verify`.');
  L.push('');

  /* --- reverse index ------------------------------------------------------ */
  const impls = new Map();
  const refs = new Map();
  for (const c of list) {
    for (const i of c.implements) {
      if (!impls.has(i.name)) impls.set(i.name, []);
      impls.get(i.name).push({ c, at: i.at });
    }
    for (const r of c.references) {
      if (!refs.has(r)) refs.set(r, []);
      refs.get(r).push(c);
    }
  }
  const byFamily = new Map();
  for (const name of impls.keys()) {
    const fam = VOCAB.get(name) ? VOCAB.get(name).family : 'other';
    if (!byFamily.has(fam)) byFamily.set(fam, []);
    byFamily.get(fam).push(name);
  }

  L.push('## Reverse index — which labs implement what');
  L.push('');
  L.push(`${impls.size} algorithms are implemented somewhere in the fleet, grouped by family.`);
  L.push('A lab in *italics* references the algorithm without implementing it.');
  L.push('');
  for (const fam of [...byFamily.keys()].sort()) {
    L.push(`### ${fam}`);
    L.push('');
    L.push('| Algorithm | Implemented by | Also referenced by |');
    L.push('|---|---|---|');
    for (const name of byFamily.get(fam).sort()) {
      const who = impls.get(name).map((x) => `[${x.c.title}](https://systemslibrarian.github.io/${x.c.slug}/) \`${x.at}\``).join('<br>');
      const alsoRef = (refs.get(name) || []).map((c) => `*${c.title}*`).join(', ');
      L.push(`| **${name}** | ${who} | ${alsoRef || '—'} |`);
    }
    L.push('');
  }

  /* --- standards-body index ---------------------------------------------- */
  L.push('## Standards-body index');
  L.push('');
  L.push('The body that DEFINES each algorithm, not one that merely permits it. Taken from');
  L.push('`tools/catalog-vocab.js`, so it travels with the algorithm and no two cards can');
  L.push('disagree about who owns SHA-256.');
  L.push('');
  const byBody = new Map();
  for (const [name, who] of impls) {
    const v = VOCAB.get(name);
    const body = v && v.std ? v.std.split(':')[0] : 'no standards body';
    if (!byBody.has(body)) byBody.set(body, []);
    byBody.get(body).push({ name, doc: v && v.std ? v.std.split(':').slice(1).join(':') : '', n: who.length });
  }
  const order = [...byBody.keys()].sort((a, b) => (a === 'no standards body') - (b === 'no standards body') || a.localeCompare(b));
  for (const body of order) {
    L.push(`### ${body}`);
    L.push('');
    L.push('| Algorithm | Document | Labs |');
    L.push('|---|---|---|');
    for (const e of byBody.get(body).sort((a, b) => a.name.localeCompare(b.name))) {
      L.push(`| ${e.name} | ${e.doc || '—'} | ${e.n} |`);
    }
    L.push('');
  }

  /* --- overlap report ----------------------------------------------------- */
  const pairs = overlaps(list);
  const unstated = pairs.filter((p) => !stated(p));
  L.push('## Overlap report');
  L.push('');
  L.push('Pairs of labs that implement the same algorithms, weighted so that sharing a rare');
  L.push('algorithm counts and sharing SHA-256 does not. An overlap is not a fault — two labs');
  L.push('may teach the same primitive from different angles — but an overlap **with no stated');
  L.push('difference** is a question nobody has answered, and a visitor choosing between the');
  L.push('two has nothing to go on.');
  L.push('');
  L.push(`${pairs.length} pairs, ${pairs.length - unstated.length} with a stated difference, **${unstated.length} without**.`);
  L.push('');
  L.push('| Labs | Shared | Stated difference |');
  L.push('|---|---|---|');
  for (const p of pairs) {
    const s = stated(p);
    L.push(`| ${p.a.title} / ${p.b.title} | ${p.shared.join(', ')} | ${s ? s.difference : '**none stated**'} |`);
  }
  L.push('');

  /* --- per-lab entries ---------------------------------------------------- */
  L.push('## Labs');
  L.push('');
  const sorted = [...list].sort((a, b) => a.title.localeCompare(b.title));
  const unknown = sorted.filter((c) => c.unknown);
  L.push(`${sorted.length} labs. ${unknown.length} carry **UNKNOWN** for what they implement:`);
  L.push('that is not "implements nothing", it is "this was not derivable from the source" —');
  L.push('most are labs that model or attack an algorithm rather than compute it.');
  L.push('');
  for (const c of sorted) {
    L.push(`### ${c.title}${c.wip ? ' *(WIP)*' : ''}`);
    L.push('');
    L.push(`[\`${c.slug}\`](https://systemslibrarian.github.io/${c.slug}/) · ${c.kicker} · ${c.categories.join(', ')}`);
    L.push('');
    L.push(c.copy);
    L.push('');
    L.push(`- **Implements:** ${c.unknown ? 'UNKNOWN — not derivable from this lab\'s source' : c.implements.map((i) => `${i.name}${anchor(i)}`).join(', ')}`);
    if (c.references.length) L.push(`- **References:** ${c.references.join(', ')}`);
    if (c.attacks.length) L.push(`- **Attacks shown:** ${c.attacks.map((a) => `${a.name}${anchor(a)}`).join(', ')}`);
    L.push(`- **Standards body:** ${c.standards.length ? c.standards.join(', ') : '—'}`);
    L.push(`- **Implementation:** ${c.implementation}`);
    if (c.overlaps.length) {
      L.push(`- **Overlaps:** ${c.overlaps.map((o) => `\`${o.slug}\` — ${o.difference || '**no difference stated**'}`).join('; ')}`);
    }
    L.push('');
  }
  L.push('<!-- catalog-sync:end -->');
  return L.join('\n') + '\n';
}

function validate(list) {
  const known = new Set(list.map((c) => c.slug));
  for (const c of list) {
    for (const i of c.implements) {
      if (!VOCAB.has(i.name)) errors.push(`${c.slug}: implements "${i.name}", which is not in catalog-vocab.js`);
    }
    for (const o of c.overlaps) {
      if (!known.has(o.slug)) errors.push(`${c.slug}: overlaps "${o.slug}", which has no card`);
      if (!o.difference) errors.push(`${c.slug}: overlap with "${o.slug}" states no difference`);
    }
  }
}

function main() {
  const mode = process.argv[2];
  const list = cards();
  validate(list);

  if (mode === 'contradictions') {
    /* A card's own words, checked against what its lab was found to implement.
       The card is the claim a visitor reads first and the only one most of them
       read, and nothing has ever compared it to the lab. */
    const rows = [];
    for (const c of list) {
      const text = `${c.kicker} ${c.copy} ${c.chips.join(' ')}`;
      const impl = new Set(c.implements.map((i) => i.name));
      const refd = new Set(c.references);
      for (const t of ALGORITHMS) {
        if (!t.re.test(text)) continue;
        if (impl.has(t.name)) continue;
        rows.push({
          slug: c.slug,
          title: c.title,
          algorithm: t.name,
          state: refd.has(t.name) ? 'referenced, not implemented' : (c.unknown ? 'lab implements UNKNOWN' : 'not found in the lab at all'),
          where: c.chips.some((ch) => t.re.test(ch)) ? 'chip' : 'description',
        });
      }
    }
    const chips = rows.filter((r) => r.where === 'chip');
    console.log(`Cards naming an algorithm their lab was not found to implement: ${rows.length}`);
    console.log(`  of those, named in a CHIP (the strongest claim a card makes): ${chips.length}\n`);
    const byLab = new Map();
    for (const r of rows) {
      if (!byLab.has(r.slug)) byLab.set(r.slug, []);
      byLab.get(r.slug).push(r);
    }
    for (const [slug, rs] of [...byLab].sort((a, b) => b[1].length - a[1].length)) {
      console.log(`  ${slug}  (${rs[0].title})`);
      for (const r of rs) console.log(`      ${r.where.padEnd(11)} ${r.algorithm.padEnd(22)} ${r.state}`);
    }
    return;
  }

  if (mode === 'report') {
    const pairs = overlaps(list).filter((p) => !stated(p));
    console.log(`Overlap pairs with no stated difference: ${pairs.length}\n`);
    for (const p of pairs) {
      console.log(`  ${p.a.slug}`);
      console.log(`  ${p.b.slug}`);
      console.log(`    shared: ${p.shared.join(', ')}  (score ${p.score.toFixed(2)})\n`);
    }
    return;
  }

  const next = build(list);
  if (errors.length) {
    for (const e of errors) console.error(`ERROR ${e}`);
    console.error(`\n${errors.length} unsupported claim${errors.length === 1 ? '' : 's'} on the cards.`);
    console.error('An implemented algorithm needs a file:line anchor; an overlap needs a difference.');
    console.error('Re-derive with: node tools/catalog-evidence.js write');
    process.exit(1);
  }
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (mode === 'check') {
    if (current === next) {
      console.log(`CATALOG.md in step with index.html (${list.length} labs).`);
      return;
    }
    console.error('OUT OF DATE CATALOG.md');
    console.error('Run: node tools/catalog-sync.js   (then commit the result; never hand-edit it)');
    process.exit(1);
  }
  fs.writeFileSync(OUT, next);
  const impl = new Set(list.flatMap((c) => c.implements.map((i) => i.name)));
  console.log(`CATALOG.md written: ${list.length} labs, ${impl.size} algorithms indexed.`);
}

main();
