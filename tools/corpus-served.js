#!/usr/bin/env node
/*
 * corpus-served.js — does the SERVED corpus know about the SERVED catalog?
 *
 * Run: node tools/corpus-served.js check
 * Prevents: the live chatbot answering about a catalog the live site no longer has, in either direction
 * Reads: https://crypto-lab.systemslibrarian.dev/ and https://crypto-counsel.systemslibrarian.dev/corpus.json over the network, each with a cache-busting query; optionally `git show origin/main:index.html` for a second column
 *
 * WHY SERVED-TO-SERVED, AND NOT AGAINST THE WORKING TREE
 *
 * `corpus-sync check` already compares the corpus to `index.html` in this
 * checkout. That comparison is the right one for a pull request and the wrong one
 * for the question here, because BOTH SIDES CAN BE STALE INDEPENDENTLY: the
 * catalog is a Pages deploy and the corpus is a separate Pages deploy in a
 * sibling repository. Two files agreeing in two working trees says nothing about
 * what a visitor's browser and the chatbot actually have.
 *
 * That is this repository's oldest lesson applied one layer out. deploy-sync
 * exists because "main disagreeing with what is actually served never turns
 * anything red"; `readme-sync`, `corpus-sync` and `concept-sync` all read the
 * cards, so a lab missing from all three is missing CONSISTENTLY and every one of
 * them stays green. Reading the sibling WORKING TREE is the defect this check
 * exists to close, so this check must not do it: it asks the two live origins.
 *
 * origin/main's index is read as a SECOND COLUMN, never as the subject. It
 * answers "is the catalog deploy behind?" — useful context for reading a finding,
 * and not what the verdict is computed from.
 *
 * TWO DIRECTIONS, BOTH BY NAME
 *
 *   SERVED-BEHIND   carded on the served index, missing from the served corpus.
 *                   The chatbot cannot answer about a lab the site is showing.
 *   SERVED-AHEAD    in the served corpus, with no card on the served index.
 *                   The chatbot answers about a lab a visitor cannot reach.
 *
 * Neither is the other's mirror and neither is harmless, so both are listed with
 * every slug. A count without the names is what let 36 drifted corpus lines sit
 * unnoticed; see corpus-sync's own note.
 *
 * The corpus deliberately carries one demo record with no crypto-lab card --
 * `demo_snow2`, a related project rather than an exhibit, which is why CLAUDE.md
 * records its slug list as "one longer than the card count". The
 * `demo_crypto_lab_` prefix excludes it by construction, so it is not a
 * SERVED-AHEAD finding and no exemption list is needed to keep it out.
 *
 * COULD NOT LOOK IS NEVER NOTHING THERE
 *
 * A network error, any non-200, or a body that will not parse is UNREAD, and
 * UNREAD fails the run. It is never folded into "no drift": an absent answer
 * about the live site is exactly the state that precedes the failure this check
 * is for. The fetch carries a cache-busting query because a CDN edge holding a
 * stale copy would make the check answer about a file nobody is being served.
 *
 * USAGE
 *   node tools/corpus-served.js          report
 *   node tools/corpus-served.js check    exit 1 on drift or on UNREAD
 *   node tools/corpus-served.js --json   machine-readable
 */
'use strict';
const { execFileSync } = require('child_process');
const path = require('path');
const { noteUnread, formatUnread, failOnUnread, unreadExitCode, markUnreadPrinted } = require('./three-way.js');

failOnUnread();

/* The two served origins. The env overrides exist ONLY so the tests can drive the
   whole CLI against a local server and exercise every verdict including UNREAD --
   a check whose network paths are untested is a check whose UNREAD branch nobody
   has ever seen run. The DEFAULTS are the live origins and a test asserts that,
   so an override cannot quietly become the production target. */
const CATALOG_URL = process.env.CORPUS_SERVED_CATALOG_URL || 'https://crypto-lab.systemslibrarian.dev/';
const CORPUS_URL = process.env.CORPUS_SERVED_CORPUS_URL || 'https://crypto-counsel.systemslibrarian.dev/corpus.json';
const LIVE_CATALOG_URL = 'https://crypto-lab.systemslibrarian.dev/';
const LIVE_CORPUS_URL = 'https://crypto-counsel.systemslibrarian.dev/corpus.json';
const TIMEOUT_MS = Number(process.env.CORPUS_SERVED_TIMEOUT_MS || 30000);

/** The corpus id shape for a carded demo.
 *
 * THE SEPARATOR DIFFERS ON THE TWO SIDES, and the first version of this check got
 * it wrong in the direction that produces a huge false finding. A card's href
 * slug is HYPHENATED (`crypto-lab-iron-letter`); the corpus id is
 * UNDERSCORED (`demo_crypto_lab_iron_letter`). Matching `[a-z0-9-]+` against the
 * id therefore resolved only the slugs that happen to be a single word, and the
 * first run reported 20 corpus demos against 264 cards -- 244 SERVED-BEHIND, a
 * clean, specific, actionable-looking claim that was entirely the parser. The
 * served file carries 264 `demo_crypto_lab_` records, which is the card count
 * exactly. Caught by counting the literal in the downloaded bytes rather than
 * believing the checker: "check what it opened before checking what it
 * concluded".
 *
 * So the id is read with underscores and normalised to the card's hyphen form. */
const DEMO_ID = /^demo_crypto_lab_([a-z0-9_]+)$/;

/** Corpus id segment -> card slug. The only difference is the separator. */
const idToSlug = (seg) => seg.replace(/_/g, '-');

/** A card's live href is the only place its slug is authoritative. corpus-sync
 *  takes the slug from the href rather than assembling it, for the reason
 *  recorded there (the dev domain serves the catalog; per-demo subpaths 404), so
 *  this reads the same thing from the served bytes. */
const CARD_HREF = /<a\b[^>]*class="[^"]*project-card[^"]*"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-([a-z0-9-]+)\/"/g;

/** Cache-busted so the answer is about what is being served now, not an edge copy. */
function bust(url) {
  const u = new URL(url);
  u.searchParams.set('cb', `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  return u.toString();
}

/** Fetch, with every failure mode collapsing to one UNREAD result rather than to
 *  an empty body that would read as "nothing is carded". */
async function fetchText(label, url) {
  const target = bust(url);
  try {
    const res = await fetch(target, {
      redirect: 'follow',
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status !== 200) {
      noteUnread('corpus-served', label, `HTTP ${res.status} from ${target}`);
      return null;
    }
    const body = await res.text();
    if (!body.length) {
      noteUnread('corpus-served', label, `empty body from ${target}`);
      return null;
    }
    return { body, url: target };
  } catch (e) {
    noteUnread('corpus-served', label, `${e.name}: ${e.message} (${target})`);
    return null;
  }
}

/** Slugs carded on a served index. */
function cardedSlugs(html) {
  const out = new Set();
  for (const m of html.matchAll(CARD_HREF)) out.add(m[1]);
  return out;
}

/** Slugs the corpus carries, or null when the body is not the corpus. */
function corpusSlugs(text, label) {
  let parsed;
  try { parsed = JSON.parse(text); }
  catch (e) { noteUnread('corpus-served', label, `the body is not JSON: ${e.message.split('\n')[0]}`); return null; }
  const records = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.records) ? parsed.records : null);
  if (!records) {
    noteUnread('corpus-served', label, 'the JSON parsed but carries no record array');
    return null;
  }
  const out = new Set();
  for (const r of records) {
    const id = r && typeof r === 'object' ? r.id : null;
    const m = typeof id === 'string' ? DEMO_ID.exec(id) : null;
    if (m) out.add(idToSlug(m[1]));
  }
  if (!out.size) {
    /* A corpus with zero demo records is not a corpus with no drift: it is a
       body we did not understand, and calling it clean would clear the check by
       reading the wrong file. */
    noteUnread('corpus-served', label, `parsed ${records.length} record(s) and none matched demo_crypto_lab_<slug>`);
    return null;
  }
  return out;
}

/** The second column: what origin/main's index cards. Context, never the subject. */
function originMainSlugs() {
  try {
    const html = execFileSync('git', ['show', 'origin/main:index.html'],
      { cwd: path.join(__dirname, '..'), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    return cardedSlugs(html);
  } catch (e) {
    /* Not UNREAD: this column is optional and its absence changes no verdict. */
    return null;
  }
}

function compare(served, corpus) {
  const behind = [...served].filter((s) => !corpus.has(s)).sort();
  const ahead = [...corpus].filter((s) => !served.has(s)).sort();
  return { behind, ahead };
}

async function main() {
  const mode = process.argv[2];
  const wantJson = process.argv.includes('--json');

  const [cat, cor] = await Promise.all([
    fetchText('the served catalog index', CATALOG_URL),
    fetchText('the served corpus.json', CORPUS_URL),
  ]);

  const served = cat ? cardedSlugs(cat.body) : null;
  if (served && !served.size) {
    noteUnread('corpus-served', 'the served catalog index', 'parsed but carries no project-card hrefs');
  }
  const corpus = cor ? corpusSlugs(cor.body, 'the served corpus.json') : null;
  const onMain = originMainSlugs();

  const readable = served && served.size && corpus;
  const result = readable ? compare(served, corpus) : { behind: [], ahead: [] };

  if (wantJson) {
    console.log(JSON.stringify({
      readable: Boolean(readable),
      servedCards: served ? served.size : null,
      corpusDemos: corpus ? corpus.size : null,
      originMainCards: onMain ? onMain.size : null,
      servedBehind: result.behind,
      servedAhead: result.ahead,
      unread: formatUnread('corpus-served') || null,
    }, null, 2));
    markUnreadPrinted();
    return unreadExitCode(result.behind.length || result.ahead.length ? 1 : 0);
  }

  console.log('corpus-served — the SERVED corpus against the SERVED catalog, not against a working tree.');
  console.log(`  catalog  ${CATALOG_URL}`);
  console.log(`  corpus   ${CORPUS_URL}`);
  console.log('');
  console.log(`  cards on the served index   ${served ? served.size : 'UNREAD'}`);
  console.log(`  demos in the served corpus  ${corpus ? corpus.size : 'UNREAD'}`);
  console.log(`  cards on origin/main        ${onMain ? onMain.size : 'not read (optional column)'}`);
  if (served && onMain) {
    const deployBehind = [...onMain].filter((s) => !served.has(s)).sort();
    const deployAhead = [...served].filter((s) => !onMain.has(s)).sort();
    console.log(`  catalog DEPLOY lag          ${deployBehind.length} carded on main but not served`
      + `${deployBehind.length ? ` (${deployBehind.join(', ')})` : ''}`
      + `; ${deployAhead.length} served but not on main`
      + `${deployAhead.length ? ` (${deployAhead.join(', ')})` : ''}`);
    console.log('                              context only — no verdict is computed from it');
  }

  if (readable) {
    console.log('');
    console.log(`SERVED-BEHIND (${result.behind.length}) — carded on the served index, MISSING from the served corpus.`);
    console.log('  The chatbot cannot answer about a lab the site is already showing.');
    for (const s of result.behind) console.log(`    crypto-lab-${s}`);
    console.log('');
    console.log(`SERVED-AHEAD (${result.ahead.length}) — in the served corpus, with NO card on the served index.`);
    console.log('  The chatbot answers about a lab a visitor cannot reach.');
    for (const s of result.ahead) console.log(`    crypto-lab-${s}`);
    if (!result.behind.length && !result.ahead.length) {
      console.log('');
      console.log('The served corpus and the served catalog name the same labs, in both directions.');
    }
  }

  const block = formatUnread('corpus-served');
  if (block) {
    console.error(`\n${block}`);
    console.error('An absent answer about the live site is not "no drift": it is the state that');
    console.error('precedes the failure this check exists to find. UNREAD fails the run.');
    markUnreadPrinted();
  }

  const drift = result.behind.length + result.ahead.length;
  if (mode === 'check' && drift) {
    console.error(`\n${drift} slug(s) disagree between the two served artifacts. Each side deploys`);
    console.error('separately, so fix the one that is behind rather than editing the other to match.');
  }
  return unreadExitCode(mode === 'check' && drift ? 1 : 0);
}

if (require.main === module) {
  main().then((code) => process.exit(code)).catch((e) => {
    console.error(`corpus-served: ${e.stack || e.message}`);
    process.exit(2);
  });
}

module.exports = { cardedSlugs, corpusSlugs, compare, bust, idToSlug, CATALOG_URL, CORPUS_URL,
  LIVE_CATALOG_URL, LIVE_CORPUS_URL, DEMO_ID, CARD_HREF };
