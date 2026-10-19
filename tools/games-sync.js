#!/usr/bin/env node
/*
 * games-sync.js — hold the learning games to the claim discipline the exhibits
 * already live under.
 *
 * Run: node tools/games-sync.js check
 * Prevents: a game publishing a claim no checker can see — a stated limit going missing, copy asserting a network the page's own CSP forbids, a construction named in a title the game does not implement, or a bridge back to the catalog quietly disappearing
 * Reads: games/index.html (the arcade, its links and its honesty ledger) and every games/<slug>/*.html page, for the <html data-theme> stamp, the CSP connect-src directive, the visible copy and the "Where this leads" bridge
 *
 *   node tools/games-sync.js          report, exit 0 whatever it finds
 *   node tools/games-sync.js check    exit 1 on any FAILING finding
 *   node tools/games-sync.js selftest offline: every check against fixtures
 *
 * WHY THIS FILE EXISTS, AND WHY IT IS NOT A SET OF CARDS
 *
 * Every published surface in this repository has a checker of its own:
 * `evidence/` has public-evidence.cjs, `teach/` has teach-build and three more,
 * `knowledge-map/` has two, and `index.html` has seven. On 2026-10-19 `games/`
 * had none — the only mention of it anywhere in tools/ was a comment. The cost
 * was measured rather than imagined: four sentences shown to players were false
 * of the code behind them, and they survived because nothing looked.
 *
 *   mental-poker  told every winner "Both seeds matched their earlier
 *                 commitments" while only one seal was ever checked
 *   mental-poker  instructed the player to compare revealed values that were
 *                 never rendered anywhere on the page
 *   coin-flip     claimed "both parties' verified bits are XORed" over a
 *                 one-sided implementation
 *   coin-flip     said "Your opponent is across the internet" on a page whose
 *                 own CSP is `connect-src 'none'`
 *
 * The alternative was to make the games into cards so the existing checkers
 * would read them. That is the wrong fix and the catalog says so in its own
 * behaviour: the one lab presented as a game carries `data-format="learning-game"`,
 * is hidden from the grid, and is excluded from the published exhibit count.
 * Games are deliberately not exhibits. Carding them would push them into the
 * count, CATALOG.md, the corpus and concept-coverage.md — and the last of those
 * exists to answer "what cryptography is not covered yet", a question about
 * LABS that eight games would corrupt rather than inform.
 *
 * So: not cards, and not an exemption either. An exemption would have to be
 * written as "the arcade is deliberately outside the honesty apparatus", which
 * is the opposite of every other decision recorded in CLAUDE.md.
 *
 * WHAT IS A GATE AND WHAT IS A REPORT
 *
 * The four FAILING checks are derivable from the page itself: a name is present
 * or absent, a directive is present or absent, a sentence contradicts a policy
 * in the same file. Each was verified green against all 11 pages before being
 * made a gate, so this does not redden CI on its first run.
 *
 * The title check is a REPORT, for the same reason `catalog-sync chips` is not
 * wired into `check`: it is only as good as its own list of construction names,
 * and every name the list misses becomes a game falsely accused. A report that
 * someone reads is the honest form until the recall has been measured.
 *
 * A PAGE THIS CANNOT JUDGE IS NAMED, NEVER SKIPPED
 *
 * Four of the eleven pages carry no CSP at all, so the copy-versus-policy
 * question cannot be asked of them. They are listed as NO-CSP rather than
 * counted as clean, because "could not look" must never read as "nothing
 * there" — the defect this repository records more often than any other.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GAMES = path.join(ROOT, 'games');

/* Construction names whose presence in a TITLE is a claim about the stack.
 * Deliberately short: this drives the REPORT, and a long speculative list would
 * manufacture accusations. Each entry is a protocol with a specific
 * construction, plus the executable evidence that would support naming it. */
const CONSTRUCTIONS = [
  { name: 'Mental Poker', proof: /commutativ|\bSRA\b|modpow|bigint|elgamal/i },
  { name: 'Mix Network', proof: /onion|layered[-_ ]?encrypt|mixnet/i },
  { name: 'Zero Knowledge', proof: /fiat[-_ ]?shamir|schnorr|sigma[-_ ]?protocol/i },
];

/* Copy that asserts a live remote party. A page whose own CSP forbids every
 * connection cannot have one, so these phrases contradict the policy shipped in
 * the same file. Phrased narrowly: "simulated rival", "local practice" and the
 * like are the honest forms and must not match. */
const REMOTE_CLAIM = /\b(?:across the internet|over the (?:internet|network)|remote (?:opponent|player|rival|server)|another player online|opponent online)\b/i;

/** Visible text of a page, with script and style contents removed. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

/** A redirect notice is not a game page: it owes no bridge and no limit. */
function isRedirect(html) {
  return /http-equiv=["']refresh["']/i.test(html);
}

function gamePages(gamesDir) {
  let slugs = [];
  try {
    slugs = fs.readdirSync(gamesDir).filter((d) => {
      if (d === 'shared') return false;
      try { return fs.statSync(path.join(gamesDir, d)).isDirectory(); } catch { return false; }
    }).sort();
  } catch { return []; }
  const pages = [];
  for (const slug of slugs) {
    for (const f of fs.readdirSync(path.join(gamesDir, slug)).filter((x) => x.endsWith('.html')).sort()) {
      const rel = path.join('games', slug, f);
      pages.push({ slug, file: rel, html: fs.readFileSync(path.join(gamesDir, slug, f), 'utf8') });
    }
  }
  return pages;
}

/** Titles the arcade presents, paired with the directory each one links to.
 *
 * Parsed by CARD BLOCK, not by "the next href after the heading". The arcade
 * wraps each card in its anchor -- `<a href="slug/"> … <h2>Title</h2> … </a>` --
 * so the first href FOLLOWING a heading belongs to the next card. The first
 * version of this did exactly that and paired every title with its neighbour's
 * link, which named `coin-flip-challenge` as the game titled "Mental Poker".
 * A finding that names the wrong subject is this repository's signature defect,
 * produced here by a checker of its own making. Splitting on the anchor and
 * reading the heading inside it cannot get the pairing wrong. */
function arcadeEntries(arcade) {
  const out = [];
  const blocks = arcade.split(/(?=<a\b[^>]*href=)/);
  for (const block of blocks) {
    const href = /^<a\b[^>]*href="([^"]+)"/.exec(block);
    if (!href) continue;
    const h2 = /<h2[^>]*>([^<]+)<\/h2>/.exec(block);
    if (!h2) continue;
    const title = h2[1].replace(/\s+/g, ' ').trim();
    const local = /^(?:\.\.\/)?([a-z0-9-]+)\/$/.exec(href[1]);
    const ext = /^https:\/\/systemslibrarian\.github\.io\/(crypto-lab-[a-z0-9-]+)\/$/.exec(href[1]);
    if (!local && !ext) continue;
    out.push({ title, slug: local ? local[1] : null, lab: ext ? ext[1] : null });
  }
  return out;
}

/** The arcade's closing honesty ledger: the paragraph that scopes every game. */
function ledger(arcade) {
  const text = visibleText(arcade);
  const i = text.indexOf('None implements');
  if (i === -1) return null;
  return text.slice(Math.max(0, i - 1600), i + 400);
}

function audit(gamesDir = GAMES) {
  const fail = [];
  const warn = [];
  const notes = [];
  const arcadePath = path.join(gamesDir, 'index.html');
  if (!fs.existsSync(arcadePath)) {
    fail.push({ kind: 'NO-ARCADE', where: 'games/index.html', why: 'the arcade page is missing, so nothing below is a claim about the games' });
    return { fail, warn, notes, pages: [], entries: [] };
  }
  const arcade = fs.readFileSync(arcadePath, 'utf8');
  const entries = arcadeEntries(arcade).filter((e) => e.slug !== 'teach' || e.lab);
  const led = ledger(arcade);
  const pages = gamePages(gamesDir);

  /* A1 — every game the arcade presents is scoped by its honesty ledger. A new
     game cannot be listed without a stated limit. */
  if (!led) {
    fail.push({ kind: 'NO-LEDGER', where: 'games/index.html', why: 'the closing honesty paragraph (the one ending "None implements...") was not found, so no game is scoped' });
  } else {
    for (const e of entries) {
      if (!e.title) continue;
      /* Match on the distinctive head of the title: the arcade writes
         "Mental Poker: Shuffle Showdown" in the heading and "Mental Poker" in
         the ledger, and a whole-string match would call that missing. */
      const head = e.title.split(/[:·—]/)[0].trim();
      if (head && !led.includes(head)) {
        fail.push({ kind: 'UNSCOPED-GAME', where: 'games/index.html', why: `"${head}" is presented but the honesty ledger does not name it, so it ships with no stated limit` });
      }
    }
  }

  for (const p of pages) {
    const csp = /connect-src\s+'([a-z]+)'/.exec(p.html);
    const text = visibleText(p.html);

    /* A2 — copy must not assert a remote party the page's own CSP forbids. */
    if (csp && csp[1] === 'none') {
      const hit = REMOTE_CLAIM.exec(text);
      if (hit) {
        fail.push({ kind: 'REMOTE-CLAIM-VS-CSP', where: p.file, why: `says "${hit[0]}" while this page's own CSP is connect-src 'none', so the claim is forbidden by the policy shipped beside it` });
      }
    } else {
      notes.push({ kind: 'NO-CSP', where: p.file, why: 'no connect-src directive, so the copy-versus-policy question could not be asked of this page' });
    }

    /* A3 — the bridge back into the catalog, on the page the ARCADE LINKS.
       Scoped to entry pages and asserted as a PROPERTY rather than a phrase.
       The arcade's own promise is "Start with a game, then use its Where this
       leads links to explore the same cryptography in a deeper exhibit" -- a
       claim about the game you are sent to, not about every sub-page it then
       navigates to. And a page that links an exhibit HAS bridged whatever it
       calls the heading: secret-council/chapters.html sends a reader to
       crypto-lab-shamir-gate without using those three words. Requiring the
       literal would be the frozen-prose failure this repo already rejected once
       in dispatch-claims. A redirect notice owes nothing. */
    const isEntry = entries.some((e) => e.slug === p.slug) && /(?:^|\/)index\.html$/.test(p.file);
    const bridged = /where this leads/i.test(text)
      || /systemslibrarian\.github\.io\/crypto-lab-/.test(p.html);
    if (isEntry && !isRedirect(p.html) && !bridged) {
      fail.push({ kind: 'NO-BRIDGE', where: p.file, why: 'the arcade links this page as a game, but it neither carries a "Where this leads" section nor links any exhibit, so a player has no route from the game into the cryptography that goes deeper' });
    }

    /* A4 — the theme is stamped, which is the surface theme-sync cannot see
       (it reads sibling crypto-lab-* clones, never games/). */
    const htmlTag = /<html\b([^>]*)>/.exec(p.html);
    const theme = htmlTag && /data-theme="([a-z]+)"/.exec(htmlTag[1]);
    if (!theme) {
      fail.push({ kind: 'NO-THEME', where: p.file, why: 'no data-theme on <html>; every game is dark-only, so the stamp states a fact and its absence is drift' });
    } else if (theme[1] !== 'dark') {
      fail.push({ kind: 'WRONG-THEME', where: p.file, why: `data-theme="${theme[1]}" but no game ships a light palette` });
    }
  }

  /* B1 — REPORT ONLY. A construction named in a title is an unqualified claim
     about the stack; the body text cannot qualify it, which is the same
     reasoning the chip rule applies to cards. Not a gate, because this list's
     recall is unmeasured and a missing name would accuse a game unjustly. */
  for (const e of entries) {
    if (!e.slug || !e.title) continue;
    const dir = path.join(gamesDir, e.slug);
    if (!fs.existsSync(dir)) continue;
    let source = '';
    for (const f of fs.readdirSync(dir)) {
      if (/\.(mjs|js|ts)$/.test(f)) source += fs.readFileSync(path.join(dir, f), 'utf8');
    }
    for (const c of CONSTRUCTIONS) {
      if (!e.title.toLowerCase().includes(c.name.toLowerCase())) continue;
      if (c.proof.test(source)) continue;
      const marked = /\b(?:toy|simulated|simplified|without|not\b|vs\.?|intro|style)\b/i.test(e.title);
      if (!marked) {
        warn.push({ kind: 'UNMARKED-CONSTRUCTION', where: `games/${e.slug}`, why: `the title "${e.title}" names ${c.name}, and no executable evidence for that construction is in this game's own source. Mark the title the way a chip is marked, or rename it.` });
      }
    }
  }

  return { fail, warn, notes, pages, entries };
}

function report(check, gamesDir = GAMES) {
  const { fail, warn, notes, pages, entries } = audit(gamesDir);
  console.log(`Game pages checked: ${pages.length} across ${entries.length} arcade entries.`);

  if (notes.length) {
    console.log(`\nNO-CSP (${notes.length}) — not a finding about the game: these pages carry no`);
    console.log('  connect-src directive, so the copy-versus-policy check could not run on them.');
    for (const n of notes) console.log(`  ${n.where}`);
  }
  if (warn.length) {
    console.log(`\nUNMARKED CONSTRUCTION IN A TITLE (${warn.length}) — report, not a gate:`);
    for (const w of warn) console.log(`  ${w.where}\n    ${w.why}`);
  }
  if (fail.length) {
    console.log(`\nFAILING (${fail.length}):`);
    for (const f of fail) console.log(`  ${f.kind.padEnd(22)} ${f.where}\n    ${f.why}`);
  } else {
    console.log('\nEvery game is scoped by the arcade\'s honesty ledger, claims no remote party its own');
    console.log('CSP forbids, bridges back into the catalog, and pins one theme.');
  }
  if (check && fail.length) process.exit(1);
}

/* ------------------------------------------------------------------ selftest
 *
 * Each case is a mutation that MUST be caught, plus the unmutated control, so a
 * refactor that stops catching one goes red here rather than going quiet. The
 * controls matter as much as the mutations: a check that fired on everything
 * would pass every mutation and be worthless. */
function selftest() {
  const cases = [
    ['clean page', (h) => h, 0],
    ['theme removed', (h) => h.replace(/ data-theme="dark"/, ''), 1],
    ['theme set to light', (h) => h.replace(/data-theme="dark"/, 'data-theme="light"'), 1],
    ['bridge removed', (h) => h.replace(/Where this leads/i, 'Further reading'), 1],
    ['remote claim added under connect-src none',
      (h) => h.replace('</body>', '<p>Your opponent is across the internet.</p></body>'), 1],
    ['honest wording must NOT fire',
      (h) => h.replace('</body>', '<p>Your opponent is a simulated rival in this page.</p></body>'), 0],
    /* The bridge is a PROPERTY, so an exhibit link satisfies it with no heading. */
    ['exhibit link counts as a bridge without the phrase',
      (h) => h.replace(/Where this leads: a deeper exhibit\./,
        '<a href="https://systemslibrarian.github.io/crypto-lab-shamir-gate/">Shamir Gate</a>'), 0],
    /* ...and neither form present must still fail. */
    ['neither heading nor exhibit link fails',
      (h) => h.replace(/<p>Where this leads: a deeper exhibit\.<\/p>/, '<p>Further reading.</p>'), 1],
  ];
  const base = `<!doctype html><html lang="en" data-theme="dark"><head>
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; connect-src 'none'">
</head><body><h2>Fixture Game</h2><p>Where this leads: a deeper exhibit.</p></body></html>`;

  const fail = [];
  let pass = 0;
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'games-sync-'));
  const dir = path.join(tmp, 'games', 'fixture');
  fs.mkdirSync(dir, { recursive: true });
  /* Shaped like the real arcade: the anchor WRAPS the card, heading inside it.
     A fixture that did not would not exercise the block parser at all. */
  fs.writeFileSync(path.join(tmp, 'games', 'index.html'),
    '<a href="fixture/"><p class="kicker">Fixture · Beginner</p><h2>Fixture Game</h2></a>'
    + '<p>Fixture Game is a local simulation. None implements a production-secure remote protocol.</p>');

  for (const [name, mutate, want] of cases) {
    fs.writeFileSync(path.join(dir, 'index.html'), mutate(base));
    const out = audit(path.join(tmp, 'games'));
    const got = out.fail.length;
    if ((want === 0 && got === 0) || (want > 0 && got > 0)) pass += 1;
    else fail.push(`${name}: expected ${want ? 'a failure' : 'none'}, got ${got} (${out.fail.map((f) => f.kind).join(',') || 'none'})`);
    console.log(`  ${(want === 0 && got === 0) || (want > 0 && got > 0) ? 'ok  ' : 'FAIL'} ${name}`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\n${pass} passed, ${fail.length} failed`);
  for (const f of fail) console.log('  ' + f);
  return fail.length ? 1 : 0;
}

module.exports = { audit, visibleText, isRedirect, arcadeEntries, REMOTE_CLAIM };

if (require.main === module) {
  const mode = process.argv[2];
  if (mode === 'selftest') process.exit(selftest());
  report(mode === 'check');
}
