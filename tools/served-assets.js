#!/usr/bin/env node
/*
 * served-assets.js — the BYTES each lab serves, pinned and compared.
 *
 * Run: node tools/served-assets.js check
 * Prevents: a lab's served bytes changing while its main stands still, which every existing checker reads as current
 * Reads: each carded lab's served page and the hashed assets it references, over the network with a cache-busting query; `git ls-remote <lab> HEAD` to tell an expected change from a finding; tools/served-assets.json
 *
 * THE GAP THIS CLOSES, AND ITS EXACT EDGE
 *
 * deploy-sync asks whether the RUN that published a lab succeeded and whether its
 * sha matches `main`. It never opens the site. Its own report says so in the last
 * line it prints: "Live bytes require separate verification." So a lab can be
 * reported current — correct run, correct sha, deploy job green — while the bytes
 * a visitor receives are something else. Nothing in this repository would notice.
 *
 * WHAT THIS IS NOT. It does not rebuild the lab and compare. `dist/` is gitignored
 * in every lab, so there is no committed artifact to compare against, and building
 * 268 labs is not a daily check. Reproducing Vite's own asset hash was rejected
 * too: the algorithm and length move between versions, so a mismatch would more
 * often mean "Vite changed" than "the bytes changed".
 *
 * WHAT IT IS. A pinned digest of the served bytes, per lab, in
 * tools/served-assets.json — the last artifact identity anybody confirmed. A later
 * run re-fetches and compares, and the comparison has three outcomes rather than
 * two:
 *
 *   MOVED-WITH-MAIN   the digest changed AND the lab's main moved since the pin.
 *                     Expected: a deploy shipped. Re-pin with `write`.
 *   MOVED-ALONE       the digest changed and main did NOT move. THE FINDING. The
 *                     served bytes changed with nothing in the repository to
 *                     explain it, which is the state deploy-sync cannot see.
 *   UNCHANGED         same bytes.
 *
 * Separating the first two is the whole point. A check that flagged every changed
 * digest would fire on every ordinary deploy, and a check that fires constantly is
 * one people stop reading — the same argument that split the recall floor from the
 * gate bar.
 *
 * ASSET REFERENCES ARE CONTENT-HASHED, WHICH DOES HALF THE WORK. A Vite build
 * names assets `index-<hash>.js`, so the FILENAME on the served page already
 * identifies the build. A served page referencing an asset that 404s is a
 * half-published deploy, and that is reported as UNREAD for the lab rather than as
 * a digest mismatch: it is a read failure about the site, not a comparison.
 *
 * COULD NOT LOOK IS NEVER NOTHING THERE. A network error, a non-200, an empty
 * body, a page with no same-origin asset reference, or an unreadable ls-remote all
 * make that lab UNREAD, and UNREAD fails the run.
 *
 * USAGE
 *   node tools/served-assets.js check            compare against the pin; exit 1 on MOVED-ALONE or UNREAD
 *   node tools/served-assets.js write            re-pin every lab from what is served now
 *   node tools/served-assets.js --labs a,b,c     just these slugs (without the crypto-lab- prefix)
 *   node tools/served-assets.js --json           machine-readable
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { noteUnread, formatUnread, failOnUnread, unreadExitCode, markUnreadPrinted } = require('./three-way.js');

failOnUnread();

const ROOT = path.join(__dirname, '..');
const PIN = path.join(__dirname, 'served-assets.json');
const CATALOG = path.join(ROOT, 'index.html');
const PAGE = (slug) => `https://systemslibrarian.github.io/crypto-lab-${slug}/`;
const TIMEOUT_MS = Number(process.env.SERVED_ASSETS_TIMEOUT_MS || 30000);
const CONCURRENCY = Number(process.env.SERVED_ASSETS_CONCURRENCY || 8);

/** Carded slugs, from the card hrefs — the same source corpus-served reads. */
const CARD_HREF = /<a\b[^>]*class="[^"]*project-card[^"]*"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-([a-z0-9-]+)\/"/g;

/** Same-origin asset references on a served page.
 *
 * THREE SPELLINGS, because the fleet uses two of them and the first version of
 * this pattern accepted only one. It required the absolute
 * `/crypto-lab-<slug>/assets/...` form, so `crypto-lab-pake-gate` -- which emits
 * the RELATIVE `./assets/index-4iw58895.js` -- came back as "references no
 * same-origin asset" and was filed UNREAD. A clean, specific, wrong finding from
 * the instrument, exactly like the underscore-versus-hyphen slug bug in
 * corpus-served. Caught by curling the page and reading the hrefs.
 *
 * A protocol-relative or absolute URL to another host is deliberately NOT matched:
 * those bytes are not this lab's deploy. */
const ASSET_REF = /(?:src|href)="(?:\/crypto-lab-[a-z0-9-]+\/|\.?\/)?(assets\/[A-Za-z0-9._-]+)"/g;

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const bust = (url) => `${url}${url.includes('?') ? '&' : '?'}cb=${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function cardedSlugs(html) {
  const out = new Set();
  for (const m of html.matchAll(CARD_HREF)) out.add(m[1]);
  return out;
}

function assetRefs(html) {
  const out = new Set();
  for (const m of html.matchAll(ASSET_REF)) out.add(m[1]);
  return [...out].sort();
}

/** Fetch bytes. Every failure mode is one UNREAD, never an empty body. */
async function fetchBytes(label, url) {
  try {
    const res = await fetch(bust(url), {
      redirect: 'follow',
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status !== 200) return { ok: false, why: `HTTP ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length) return { ok: false, why: 'empty body' };
    return { ok: true, buf, type: res.headers.get('content-type') || '' };
  } catch (e) {
    return { ok: false, why: `${e.name}: ${e.message}` };
  }
}

/** The lab's current remote HEAD. Read-only; never a fetch into the clone. */
function remoteHead(slug) {
  const r = spawnSync('git', ['ls-remote', `https://github.com/systemslibrarian/crypto-lab-${slug}.git`, 'HEAD'],
    { encoding: 'utf8', timeout: 45000 });
  if (r.error || r.status !== 0) return null;
  const m = /^([0-9a-f]{40})/.exec(r.stdout.trim());
  return m ? m[1] : null;
}

/** One lab's served identity: the page digest plus a digest per referenced asset. */
async function readServed(slug) {
  const page = await fetchBytes(`crypto-lab-${slug} page`, PAGE(slug));
  if (!page.ok) return { unread: `page: ${page.why}` };
  const html = page.buf.toString('utf8');
  const refs = assetRefs(html);
  if (!refs.length) {
    /* A page with no hashed asset is a real shape in this fleet -- a few labs ship
       one inline page -- so it is PAGE-ONLY rather than unread, and the page
       digest alone is a valid pin for it. But "no assets" is also what a generic
       200 error page looks like, so the page must at least identify itself as this
       lab before it is pinned. Measured on the first full run: 5 labs reported no
       asset, 1 of them because the PATTERN was wrong (pake-gate's `./assets/`) and
       4 because they genuinely have none. */
    if (!html.includes(`crypto-lab-${slug}`)) {
      return { unread: 'page: served 200 but names neither an asset nor this lab; not pinnable' };
    }
    return { page: sha256(page.buf), assets: {}, pageOnly: true };
  }
  const assets = {};
  for (const ref of refs) {
    const got = await fetchBytes(`crypto-lab-${slug} ${ref}`, `${PAGE(slug)}${ref}`);
    if (!got.ok) return { unread: `${ref}: ${got.why}` };
    assets[ref] = sha256(got.buf);
  }
  return { page: sha256(page.buf), assets };
}

/** Compare one lab against its pin. Three outcomes, not two. */
function verdictFor(slug, served, pinned, head) {
  if (!pinned) return { slug, verdict: 'unpinned', why: 'no pin yet; run `write` to record what is served now' };
  const changed = [];
  if (served.page !== pinned.page) changed.push('page');
  const pinnedAssets = pinned.assets || {};
  for (const ref of new Set([...Object.keys(served.assets), ...Object.keys(pinnedAssets)])) {
    if (served.assets[ref] !== pinnedAssets[ref]) changed.push(ref);
  }
  if (!changed.length) return { slug, verdict: 'unchanged' };
  if (head === null) {
    return { slug, verdict: 'unread', why: `${changed.length} digest(s) changed and ls-remote could not say whether main moved` };
  }
  return head !== pinned.commit
    ? { slug, verdict: 'moved-with-main', changed, why: `main moved ${String(pinned.commit).slice(0, 9)} -> ${head.slice(0, 9)}; a deploy shipped` }
    : { slug, verdict: 'moved-alone', changed, why: `main is still ${head.slice(0, 9)}, and the served bytes changed anyway` };
}

async function pool(items, worker, width) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(width, items.length) }, async () => {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      out[i] = await worker(items[i], i);
    }
  }));
  return out;
}

function loadPin() {
  try { return JSON.parse(fs.readFileSync(PIN, 'utf8')); }
  catch { return { note: 'Served-byte digests, per lab. Written by tools/served-assets.js write.', labs: {} }; }
}

async function main(argv = process.argv.slice(2)) {
  const mode = argv.includes('write') ? 'write' : (argv.includes('check') ? 'check' : 'report');
  const wantJson = argv.includes('--json');
  const li = argv.indexOf('--labs');
  let slugs;
  try { slugs = [...cardedSlugs(fs.readFileSync(CATALOG, 'utf8'))].sort(); }
  catch (e) { console.error(`served-assets: cannot read index.html: ${e.message}`); return 2; }
  if (li >= 0 && argv[li + 1]) {
    const want = new Set(argv[li + 1].split(',').map((s) => s.trim()).filter(Boolean));
    slugs = slugs.filter((s) => want.has(s));
  }
  if (!slugs.length) {
    console.error('served-assets: no carded labs selected. Refusing to report clean over nothing.');
    return 2;
  }

  const pin = loadPin();
  const rows = await pool(slugs, async (slug) => {
    const served = await readServed(slug);
    if (served.unread) {
      noteUnread('served-assets', `crypto-lab-${slug}`, served.unread);
      return { slug, verdict: 'unread', why: served.unread };
    }
    const pinned = pin.labs[slug];
    const needHead = mode === 'write' || (pinned && (served.page !== pinned.page
      || JSON.stringify(served.assets) !== JSON.stringify(pinned.assets || {})));
    const head = needHead ? remoteHead(slug) : (pinned ? pinned.commit : null);
    if (needHead && head === null) noteUnread('served-assets', `crypto-lab-${slug}`, 'ls-remote could not read the remote HEAD');
    return { ...verdictFor(slug, served, pinned, head), served, head };
  }, CONCURRENCY);

  if (mode === 'write') {
    const today = new Date().toISOString().slice(0, 10);
    let written = 0;
    for (const r of rows) {
      if (r.verdict === 'unread' || !r.served || r.head === null) continue;
      pin.labs[r.slug] = { page: r.served.page, assets: r.served.assets, commit: r.head, pinnedAt: today };
      written += 1;
    }
    pin.note = 'Served-byte digests, per lab. Written by tools/served-assets.js write; never hand-edited.';
    fs.writeFileSync(PIN, `${JSON.stringify(pin, null, 2)}\n`);
    console.log(`served-assets: pinned ${written} of ${rows.length} lab(s) into ${path.relative(ROOT, PIN)}.`);
  }

  const pageOnly = rows.filter((r) => r.served && r.served.pageOnly).length;
  const by = (v) => rows.filter((r) => r.verdict === v);
  const counts = Object.fromEntries(['unchanged', 'moved-with-main', 'moved-alone', 'unpinned', 'unread']
    .map((v) => [v, by(v).length]));

  if (wantJson) {
    console.log(JSON.stringify({ labs: rows.length, counts, rows: rows.map(({ served, ...r }) => r) }, null, 2));
  } else {
    console.log(`served-assets — ${rows.length} carded lab(s), compared against tools/served-assets.json`);
    console.log(`  unchanged ${counts.unchanged}   moved-with-main ${counts['moved-with-main']}   MOVED-ALONE ${counts['moved-alone']}   unpinned ${counts.unpinned}   unread ${counts.unread}`);
    console.log(`  of those, ${pageOnly} serve one inline page with no hashed asset: pinned on the page digest alone`);
    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    if (sum !== rows.length) { console.error(`served-assets: verdicts sum to ${sum}, not ${rows.length}`); return 2; }
    for (const v of ['moved-alone', 'moved-with-main', 'unpinned']) {
      const list = by(v);
      if (!list.length) continue;
      console.log(`\n${v.toUpperCase()} (${list.length})${v === 'moved-alone' ? ' — THE FINDING: served bytes changed with main standing still' : ''}`);
      for (const r of list.slice(0, 20)) console.log(`    crypto-lab-${r.slug.padEnd(34)} ${r.why}`);
      if (list.length > 20) console.log(`    …and ${list.length - 20} more`);
    }
    const compared = counts.unchanged + counts['moved-with-main'] + counts['moved-alone'];
    if (!counts['moved-alone'] && !counts.unread && mode !== 'write' && compared) {
      console.log(`\nAll ${compared} pinned lab(s) serve the bytes they were pinned at, or moved with their own main.`);
    } else if (!compared && mode !== 'write') {
      /* Nothing was COMPARED. Saying "no drift" here would be a clean report over
         an empty comparison, which is the one thing every checker here refuses. */
      console.log('\nNothing was compared: no lab in this run carries a pin yet. That is not "no drift".');
    }
  }

  const block = formatUnread('served-assets');
  if (block) { console.error(`\n${block}`); markUnreadPrinted(); }
  return unreadExitCode(mode === 'check' && counts['moved-alone'] ? 1 : 0);
}

if (require.main === module) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(`served-assets: ${e.stack || e.message}`); process.exit(2); });
}

module.exports = { cardedSlugs, assetRefs, verdictFor, sha256, bust, ASSET_REF, CARD_HREF };
