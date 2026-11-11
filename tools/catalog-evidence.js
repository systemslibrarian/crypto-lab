#!/usr/bin/env node
/*
 * catalog-evidence.js — derive each lab's algorithm facts from its own source,
 * with a file:line anchor behind every claim.
 *
 * Run: node tools/catalog-evidence.js verify
 * Prevents: the catalog asserting a lab implements an algorithm its source does not
 * Reads: ../crypto-lab-<slug>/ clones (code, READMEs) — from the WORKING TREE when clean and from
 *        `git archive HEAD` when dirty, see clone-source.js — plus local HEAD + `ls-remote origin HEAD`;
 *        index.html; catalog-vocab.js; catalog-reviewed.json
 *
 * It reads the sibling clones, so like deploy-sync and fleet-sync it is NOT in
 * the fast loop. `catalog-sync.js` needs none of this: the facts it generates
 * CATALOG.md from are stored on the cards, and this tool is how they get there
 * and how they are re-checked afterwards.
 *
 * A MENTION IS NOT AN IMPLEMENTATION
 *
 * The whole difficulty is that every one of these labs is ABOUT cryptography, so
 * every algorithm name appears in every lab that discusses it. Grepping for "AES"
 * and calling the result an implementation would produce a reverse index where
 * the answer to "which labs implement AES?" is "most of them", which is worse
 * than no index: it reads as a finding.
 *
 * So a term is only IMPLEMENTED when it appears in one of three shapes that mean
 * the code computes something:
 *
 *   call    the term is the algorithm argument of a WebCrypto call, or is an
 *           identifier being invoked            crypto.subtle.sign('HMAC', ...)
 *   path    the FILE is named for the algorithm and declares something
 *                                                        src/misty1/misty1.ts
 *   protocol  the lab builds or parses that PROTOCOL's own message structures
 *                                                        function buildClientHello(
 *   import  the term is in a module path being imported  from '@noble/hashes/sha256'
 *   decl    the term is in the name of a function, class or const being declared
 *                                                        function aesGcmEncrypt(
 *
 * Everything else is a MENTION, and a term found only in mentions is REFERENCED,
 * never implemented. crypto-lab-hqc-timing is the case that proves the
 * distinction earns its keep: it is entirely about HQC's decoder and implements
 * neither HQC nor a decoder — its README says so outright, "an abstract timing
 * model — not a real BCH decoder". Under a grep it is an HQC implementation.
 *
 * COMMENTS ARE BLANKED BEFORE ANY OF THIS. A line inside a block comment can
 * otherwise match `decl` perfectly, and these labs are heavily commented with
 * exactly the algorithm names being searched for. Blanking preserves the line
 * numbering, so anchors stay true.
 *
 * WHAT IT CANNOT ESTABLISH IT SAYS IT CANNOT
 *
 * A lab whose crypto matches no vocabulary term and no shape gets UNKNOWN, not an
 * empty list. Empty reads as "implements nothing"; UNKNOWN reads as "this tool
 * could not tell", and they are different facts. Unmatched chips are reported so
 * the vocabulary grows on purpose rather than by being wrong quietly.
 *
 * USAGE
 *   node tools/catalog-evidence.js                 report what it derives, write nothing
 *   node tools/catalog-evidence.js --lab <slug>    just one lab, with every anchor
 *   node tools/catalog-evidence.js write           write the derived fields onto the cards
 *   node tools/catalog-evidence.js verify          re-read every anchor already on a card
 *   node tools/catalog-evidence.js gaps            chips the vocabulary has never heard of
 *   node tools/catalog-evidence.js --json          machine-readable
 *
 * `verify` is the one that matters over time: an anchor is a line number, and
 * line numbers rot. It re-opens each anchored file and fails when the algorithm
 * is no longer at that line, which is the difference between evidence and
 * decoration.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const { markupOnly } = require('./markup-only.js');
const { ALGORITHMS, ATTACKS } = require('./catalog-vocab.js');
const { sourceRoot, summary: cloneSummary, tornSnapshot, trackedFiles, isTracked, forget: forgetTracked } = require('./clone-source.js');
const { compareOrReport, lookupOrReport } = require('./three-way.js');
const cardTag = require('./card-tag.js');
const PROTOCOL_TERMS = ALGORITHMS.filter((t) => t.structures);

const ROOT = path.join(__dirname, '..');
const REPOS = path.join(ROOT, '..');
const HTML = path.join(ROOT, 'index.html');
// Human review covers source shapes the conservative JS/TS scanner cannot prove.
// Each review is pinned to a lab commit; a changed lab must be reviewed again.
const REVIEWS = require('./catalog-reviewed.json');

const CODE_EXT = /\.(ts|js|mjs|cjs|tsx|jsx)$/;
/* Languages this scanner does NOT read. Not a wish list — the labs that use them.
 * crypto-lab-silent-tally implements its field arithmetic in Rust and exposes it
 * through a WASM binding, so its src-ts/ is a wrapper and every algorithm is in
 * the .rs files. Reading the wrapper and reporting UNKNOWN says "nothing there"
 * about source that was never opened. That is protection-census's mistake exactly:
 * a 404 from the one endpoint you asked, published as absence. */
const UNREAD_LANGS = [
  { name: 'Rust', re: /\.rs$/ },
  { name: 'Go', re: /\.go$/ },
  { name: 'Python', re: /\.py$/ },
  { name: 'C/C++', re: /\.(c|cc|cpp|h|hpp)$/ },
  { name: 'Java', re: /\.java$/ },
  { name: 'C#', re: /\.cs$/ },
  { name: 'Swift', re: /\.swift$/ },
  { name: 'WebAssembly', re: /\.(wasm|wat)$/ },
];
const SKIP = /(^|\/)(node_modules|dist|build|\.git|test-results|playwright-report|coverage|\.vite|target|pkg)(\/|$)/;
/* NOT_THE_LAB, NOT_THIS_LABS_CODE, SUBSTANTIVE and the substantive-change rule
   itself live in ONE module, because the Fleet Console's
   scripts/extract-source.cjs asks the same question and used to answer it
   differently. See tools/moved-substantively.js for the rule and for the
   measured disagreement that collapsed the two definitions into one. */
const {
  NOT_THE_LAB,
  NOT_THIS_LABS_CODE,
  SUBSTANTIVE,
  substantiveChanges,
  demoHasSrcFrom,
  rootsFor,
} = require('./moved-substantively.js');
/* A BUILD DOCUMENT is the instruction for making a lab, not a description of
   one. It names algorithms the way a recipe names ingredients - as things to
   consider - so reading one as evidence credits every lab that was built from
   the same template with whatever that template happens to mention.
   Twenty-three anchors pointed into these, all in data-attacks: `Brute force`
   in six labs from one line of BUILD-TEMPLATE(1).md, `Timing side-channel` in
   crypto-lab-air-stream and crypto-lab-point-ledger from line 342 of two copies
   of the same template, `Man-in-the-middle` from a Playwright baseURL that
   happens to contain the slug crypto-lab-diffie-hellman-mitm.

   Tracked-set filtering cannot reach them: unlike the gitignored
   CRYPTO-LAB-TEMPLATE.md that prompted that rule, these are committed files in
   the repository, and rightly so - a lab's own build brief belongs in its
   history. They are excluded by WHAT THEY ARE instead.

   The boundary is narrow, and README.md, docs/ explanations, LIMITATIONS.md,
   SECURITY.md, INVARIANTS.md and TEACHING.md all stay scannable: those describe
   the lab that exists. A name in one of those is the lab talking about itself.
   `.github/` is excluded for the same reason as e2e/ above - it is the
   repository's machinery, not the demo - and playwright.config.* with it, whose
   only algorithm names are inside a URL. */
const BUILD_DOC = new RegExp([
  '(^|/)\\.github(/|$)',                        // CI, issue templates, PR templates
  '(^|/)playwright\\.config\\.[a-z]+$',          // a baseURL is not evidence
  '(^|/)brief\\.md$',                           // 28 labs: the build brief
  '(^|/)kickoff\\.md$',
  '(^|/)CATALOG-ENTRY\\.md$',                    // catalog data handed back
  '(^|/)MISSION-SCRIPT\\.md$',
  '(^|/)HARNESS\\.md$',
  '[^/]*PROMPT[^/]*\\.md$',                       // BUILD-PROMPT, PROMPT-standardize-…, crypto-lab-vdf-prompt
  '[^/]*TEMPLATE[^/]*\\.md$',                     // BUILD-TEMPLATE(1), _MASTER-TEMPLATE, CRYPTO-LAB-TEMPLATE
  /* A 404 page, an OG card and a timing harness are not the demo, and this is
     tools/theme-sync.js's NON_DEMO_PAGE list, reused rather than reinvented.
     The measurement found why it belongs here too: with playwright.config
     excluded, crypto-lab-timing-oracle's `Timing side-channel` anchor moved to
     public/404.html:10, which reads `var base = "/crypto-lab-timing-oracle/";`
     - the lab's own SLUG inside a redirect URL. Keying on the slug is the one
     shape tools/catalog-recall.js records as never to reopen, because it would
     have crypto-lab-hqc-timing claiming HQC. Both labs keep the term from a
     real line; only the anchor moves. */
  '(^|/)(?:404\\.html|og-card\\.html|[^/]*-harness\\.html|quality-gates\\.html|logic-smoke\\.html)$',
].join('|'), 'i');

/* The files a FRESH CLONE would have, never what happens to be on this disk.
 *
 * This used to walk directories, and `git status --porcelain` does not report
 * IGNORED files, so a clone holding a gitignored file read as clean and the walk
 * opened it. On 2026-09-30 that credited labs with BB84, E91, OPAQUE and PQXDH
 * out of a gitignored CRYPTO-LAB-TEMPLATE.md, and emitted anchors into it that
 * resolve on this machine and nowhere else.
 *
 * `clone` is the real repository (git answers about it); `readRoot` is where the
 * bytes come from, which is the same directory for a clean clone and a HEAD
 * export for a dirty one. A tracked path exists under both. */
/* Has this lab moved in a way a SOURCE REVIEW would have to read again?
 *
 * Same scope as tools/corpus-freshness.js, deliberately: commits touching
 * README.md or src/. A pin records a person's reading of the lab's source, and
 * a commit that changes neither its source nor its README has not invalidated
 * that reading.
 *
 * Measured, not assumed. On 2026-09-30 a fleet-wide `chat.md` / `.gitignore`
 * batch moved every clone's HEAD by one commit and turned 23 pins stale at once.
 * Twenty-two of those 23 had changed ZERO README or src files - the median diff
 * was +1/-0 - and the only lab with real movement was crypto-lab-sm9-forge, at
 * 14 files and +3148/-698. A rule that calls all 23 stale buries the one that
 * matters, and it does worse than that here: writeCards leaves a stale lab's
 * card byte-identical, so an unrelated one-line commit FREEZES a card holding
 * claims that need correcting.
 *
 * `null` from git is treated as moved: could not look is never "nothing changed".
 *
 * EXCEPT in the one case where "could not look" is the whole answer. A SHALLOW
 * clone does not contain the pinned commit, so the diff cannot be computed for a
 * reason that has nothing to do with the lab. On 2026-10-01 the weekly fleet job
 * reported STALE-REVIEW for 27 labs and failed; the same run on full clones
 * reported none. `.github/workflows/fleet.yml` clones with `--depth 1`, so every
 * pin older than HEAD was unreachable, every diff threw, and every throw became
 * a claim that a person had to re-read that lab. A re-review queue of 27 labs,
 * none of which needed re-reviewing — the fourth entry in CLAUDE.md's
 * answering-from-a-copy table is the same defect with `rev-parse` in an unfetched
 * clone, and this is it in CI.
 *
 * So the absent-commit case is split by asking git which it is:
 *
 *   commit present, README/src touched      'moved'       STALE-REVIEW
 *   commit present, nothing substantive     'not-moved'   the pin still holds
 *   commit absent, clone is shallow         'unreadable'  PIN-UNREADABLE
 *   commit absent, clone is complete        'moved'       the pin names something
 *   the diff never ran at all               'unreadable'  COULD NOT LOOK
 *
 * That last row was missing until 2026-11-06, and its absence is why the catch
 * below answered 'moved' for it. A `git diff` that does not run says nothing
 * about movement: a clone directory that is not there, an unreadable object, a
 * git that exits 2 or more. Each of those was reported as a stale review, which
 * is the re-review queue with nothing in it that this file has produced twice
 * before, arrived at a third way. Exit codes of 2 or more are not findings;
 * tools/three-way.js holds the rule and the three states.
 *                                                        this repository does not
 *                                                        have, which IS a finding
 *
 * The last line keeps the proven behaviour for a pin pointing at nothing, and the
 * self-test still asserts it. `unreadable` fails the run as loudly as a stale pin
 * does — it is not a pass — but it is reported as a fact about the CLONE, and it
 * never asks a person to go and re-read a lab nobody has established has moved. */
/*
 * Which files make a source review STALE.
 *
 * This was `f === 'README.md' || f.startsWith('src/')`, and that is the LAYOUT
 * BLINDNESS this repository keeps re-finding, here in the test that decides
 * whether a person must re-read a lab. Eight labs keep their source at
 * `demos/<slug>/src`, and `crypto-lab-quantum-vault-kpqc` at `web-demo/`,
 * `crates/` and `wasm/` -- the exact list `lab-dates.js`'s own header says a
 * fixed path test misses. Measured 2026-11-08 across the 121 pins: six labs had
 * moved source the narrow test could not see, including
 * `crypto-lab-collision-vault`'s `demos/collision-vault/src/main.ts`. Their pins
 * read as fresh while their source had changed underneath.
 *
 * `index.html` is DELIBERATELY NOT in the set, and that was measured rather than
 * assumed. Anchors do resolve into it -- `index.html:41`, `index.html:1500`,
 * `demos/shamir-gate/index.html:118` -- so including it looks right. Adding it
 * took STALE-REVIEW from 2 labs to 41: **39 of those moved nothing but page
 * markup**, and every one would have become a person being asked to re-read a
 * lab whose source had not changed. That is the re-review queue with nothing in
 * it that this file has produced three times before.
 *
 * What makes the omission safe is that the anchor itself is already checked, more
 * precisely, by STALE-ANCHOR: every anchor is re-opened against the clone on
 * every run, including the ones pointing into `index.html`, and a line that
 * stopped naming its term fails there by name. Pointer rot has a check; this one
 * is about whether a person's reading of the SOURCE still holds.
 *
 * NOT_THE_LAB and NOT_THIS_LABS_CODE still apply on top, which is what keeps an
 * added test file from demanding a re-review -- the crypto-lab-ghost-commit false
 * positive recorded below.
 *
 * ONE EXCEPTION to the index.html exclusion, added 2026-11-10 when the console
 * and this file were measured disagreeing about crypto-lab-shamir-gate: a
 * demos/<name>/index.html change IS substantive when that demo has no
 * demos/<name>/src/, because then the logic lives in the HTML and there is no
 * source tree for the exclusion to be about. The regex cannot express that --
 * it turns on whether a sibling directory exists -- so it lives one layer up,
 * in substantiveChanges(). The regex itself is unchanged.
 */


/* The anchored FILES of a lab's card. Ruling 1 protects these absolutely: the
   markup classifier below may never speak for one. Memoised because
   movedSubstantively is called once per pinned lab per run. */
const ANCHORED_FILES = new Map();
function anchoredFilesFor(slug) {
  if (ANCHORED_FILES.has(slug)) return ANCHORED_FILES.get(slug);
  let set = new Set();
  try {
    const card = cards().find((c) => c.slug === slug);
    if (card) set = new Set(anchorsOnCard(card.block).map((a) => a.file));
  } catch { set = new Set(); }
  ANCHORED_FILES.set(slug, set);
  return set;
}

let lastMarkupOnly = null;
function takeMarkupOnly() { const v = lastMarkupOnly; lastMarkupOnly = null; return v; }

function movedSubstantively(dir, from, to, slug) {
  lastMarkupOnly = null;
  try {
    const out = execFileSync('git', ['-C', dir, 'diff', '--name-only', `${from}..${to}`], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024,
    });
    /* NOT_THE_LAB, the same definition the scanner uses to decide what it reads. Two
       answers to "what is this lab's source" in one file is how the second reader misses
       what the first one learned — the card-reader and PAGES_PUBLISHERS lesson again,
       and here both copies were twenty lines apart.

       It mattered on 2026-10-20: crypto-lab-ghost-commit was reported STALE-REVIEW
       because a #31 commit added `src/git/objects.independent.test.ts`. The reviewed
       file, `src/git/objects.ts`, was byte-identical across the two commits — blob
       57209b39 at both — so this asked a person to re-read a lab whose reviewed source
       had not changed, which is the re-review queue with nothing in it that this file
       has produced twice before. A test cannot change the derivation, because the
       scanner never reads one. */
    /* The demos/<name>/src/ lookup is asked of the tree at `to`, the state the
       pin is being compared against, so a demo that GAINED a src/ tree is
       judged as it stands now rather than as it was. */
    const tracked = execFileSync('git', ['-C', dir, 'ls-tree', '-r', '--name-only', to], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024,
    });
    const substantive = substantiveChanges(out.split('\n').filter(Boolean), demoHasSrcFrom(tracked), rootsFor(slug));
    if (!substantive.length) return 'not-moved';
    /* RULING 1 FIRST, CLASSIFIER SECOND, and the order is the whole safety
       property. Any substantive path that is an ANCHORED file has moved, full
       stop -- the classifier is never asked about it, so no markup verdict can
       excuse a file a person reviewed. Only the remainder, the unanchored
       source, is put to the per-line question. */
    const anchored = anchoredFilesFor(slug);
    const touchedAnchored = substantive.filter((f) => anchored.has(f));
    if (touchedAnchored.length) return 'moved';
    const cls = markupOnly(dir, from, to, substantive, lex);
    if (cls.verdict === 'markup') {
      lastMarkupOnly = { slug, from, to, paths: substantive, why: cls.why };
      return 'not-moved';
    }
    if (cls.verdict === 'executable') return 'moved';
    return 'unreadable';
  } catch {
    /* The diff did not run. Which documented row applies is now decided by two
       LOOKUPS that can each come back could-not-look, instead of by two helpers
       that answered false when they failed. Only one path still reaches 'moved',
       and it is the selftested one: the pin is genuinely absent from a clone
       that is genuinely complete, so the pin names something not in the lab. */
    const pin = hasCommitState(dir, from);
    if (!pin.readable) return 'unreadable';
    if (pin.match) return 'unreadable';
    const shallow = isShallowState(dir);
    if (!shallow.readable) return 'unreadable';
    return shallow.match ? 'unreadable' : 'moved';
  }
}

/* Is this object in this clone? THREE answers, not two — but NOT by reading one
   exit code, and that is the part worth not undoing.

   `git cat-file -e <sha>^{commit}` exits 128 for a well-formed sha that is
   absent AND 128 for a directory that is not a repository at all. Measured, not
   assumed: both print `fatal:` and both exit 128. So the exit code cannot tell
   "the pin is not in this lab's history", which IS a finding, from "there is
   nothing here to ask", which is not. A first version of this function mapped
   non-zero to could-not-look and thereby turned every genuinely absent pin into
   'unreadable', switching off a real finding class in silence. The selftest at
   the bottom of this file caught it.

   So the question is split in two. Repo readability is the could-not-look
   question and `rev-parse --git-dir` answers it cleanly. Only inside a repo that
   answered does `cat-file -e` get asked, and there its 0-or-not really does mean
   present-or-absent. */
function hasCommitState(dir, sha) {
  const label = `${dir} has ${String(sha).slice(0, 12)}`;
  const repo = compareOrReport(`${dir} is a readable git repository`,
    'git', ['-C', dir, 'rev-parse', '--git-dir']);
  if (!repo.readable || !repo.match) {
    return { state: 'could-not-look', why: repo.why || `${label}: not a readable repository`,
      match: false, readable: false };
  }
  return lookupOrReport(label, () => hasCommit(dir, sha));
}

/* Shallow or not, with "could not ask" kept separate. `rev-parse
   --is-shallow-repository` prints true or false and exits 0; a failure here used
   to read as "not shallow", which then routed an unreadable clone into 'moved'. */
function isShallowState(dir) {
  return lookupOrReport(`${dir} shallowness`, () => {
    const out = execFileSync('git', ['-C', dir, 'rev-parse', '--is-shallow-repository'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (out !== 'true' && out !== 'false') throw new Error(`unexpected answer ${out}`);
    return out === 'true';
  });
}

/** Is this object in this clone at all? Asked of the clone, not of the remote. */
function hasCommit(dir, sha) {
  try {
    execFileSync('git', ['-C', dir, 'cat-file', '-e', `${sha}^{commit}`],
      { stdio: ['ignore', 'ignore', 'ignore'] });
    return true;
  } catch { return false; }
}

// A remote HEAD may move after this clone was fetched. Until that object is
// present, a failed diff says nothing about movement of the reviewed source.
function cloneNeedsFetch(dir, pin, head, remote) {
  return (remote === pin && head !== pin) || !hasCommit(dir, remote);
}

/* Labs whose pin could not be judged because the clone is shallow. Module level
 * because the derivation fills it per lab and the reports read it once. */
const pinUnreadable = new Set();
/* Reviewed entries that do not parse, collected rather than thrown.
 *
 * Both guards below used to `throw` from inside evidenceFor, which runs inside
 * the fleet-wide map, so ONE malformed entry on ONE lab derived nothing for the
 * other 231: the process exited 1 having written no card at all, with a stack
 * trace naming a single slug as its only output. That is the local-guard /
 * global-failure shape this file already fixed once for stale pins, and the
 * comment on that fix says to look for it wherever a per-item guard sits inside
 * a fleet-wide loop. This was the other instance. See #129.
 *
 * A lab with a malformed review is skipped the way a stale-pinned one is -- its
 * recorded add and remove lists are NOT applied, so its card stays
 * byte-identical and keeps the state it was last written in -- then named, and
 * the run still exits non-zero. Applying half of a list that does not parse
 * would be inheriting a judgement nobody made. */
const badReview = new Map();

/** A `--depth` clone. Its history is truncated, so an older commit is absent for
 *  a reason that says nothing about the lab. */
function isShallow(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--is-shallow-repository'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() === 'true';
  } catch { return false; }
}

function labFilePaths(clone, readRoot) {
  const tracked = trackedFiles(clone);
  if (tracked === null) return null;          // could not look — never "no files"
  const out = [];
  for (const rel of tracked) {
    const p = path.join(readRoot, rel);
    if (SKIP.test(p)) continue;
    if (!fs.existsSync(p)) continue;          // tracked but absent from a HEAD export
    out.push(p);
  }
  return out;
}

/** One pass over a file, tracking comments and strings TOGETHER.
 *
 * Two passes cannot work, and the way they fail is quiet. Blanking comments
 * first sees the `//` inside `"https://en.wikipedia.org/..."` as the start of a
 * line comment and blanks the rest of that line — including the quote that
 * closes the string. Every quote after it is then parsed with the wrong parity,
 * the template literal holding a lab's HTML is no longer recognised as a string,
 * and its PROSE is offered to the code tests as bare code. That is exactly how
 * crypto-lab-hybrid-sign came to claim it implements P-256: the claim's anchor
 * was a line of documentation inside a <pre> block listing TLS codepoints.
 *
 * Returns both views, from the same walk, so they cannot disagree:
 *   strings  comments blanked, string literals INTACT  (imports, WebCrypto names)
 *   code     comments AND string contents blanked      (declarations, calls)
 *
 * Newlines are preserved in both, so a line number is a line number.
 */
/** Is a `/` here the start of a regex literal, or a division sign?
 *
 * The classic JavaScript lexing problem, and not academic here: line 57 of
 * crypto-lab-hybrid-sign is `.replace(/"/g, '&quot;')`. Without this, the `"`
 * inside that regex opens a string that never closes where it should, every
 * quote in the file after it is parsed with the wrong parity, and 400 lines of
 * HTML in a template literal are offered to the code tests as bare code.
 *
 * The standard heuristic: after a value — an identifier, a number, a closing
 * bracket or paren — a slash is division. Anywhere else it opens a regex.
 */
function regexCanStartHere(emitted) {
  /* The regexp tries every earlier blanked comment before finding the suffix.
     trimEnd removes the same ECMAScript whitespace without that backtracking. */
  const prev = emitted.trimEnd().slice(-1);
  if (!prev) return true;
  return !/[\w$)\]]/.test(prev);
}

function lex(src) {
  let strings = '';
  let code = '';
  /* The third view: COMMENT BODIES ONLY. Not string contents - that was tried
     and it swallowed the rule whole, taking violations from 28 to 1, because
     these labs build their UI out of template literals full of prose naming
     algorithms. A name in a UI string is a lab TALKING about an algorithm; a
     name in a comment is code ANNOTATED with it, sitting beside the arithmetic
     it describes. Only the second is evidence that the scanner cannot tell. */
  let inert = '';
  const push = (inStrings, inCode, inInert) => { strings += inStrings; code += inCode; inert += (inInert === undefined ? (inCode === '\n' ? '\n' : ' '.repeat(inCode.length)) : inInert); };
  let i = 0;
  let state = 'code';
  let quote = '';
  let inClass = false;
  /* Template-literal nesting through ${ }, WITH the brace depth inside each
     interpolation. Without the depth, the first `}` of an arrow function or
     object literal inside `${...}` reads as the end of the interpolation, the
     lexer falls back into the template as if it were code, and the rest of the
     file is parsed one state out of step. */
  const stack = [];
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (state === 'code') {
      if (c === '/' && n === '/') { state = 'line'; push('  ', '  '); i += 2; continue; }
      if (c === '/' && n === '*') { state = 'block'; push('  ', '  '); i += 2; continue; }
      if (c === '/' && regexCanStartHere(code)) { state = 'regex'; inClass = false; push(c, c); i += 1; continue; }
      if (c === "'" || c === '"' || c === '`') { state = 'string'; quote = c; push(c, c); i += 1; continue; }
      if (c === '{' && stack.length) { stack[stack.length - 1].depth += 1; push(c, c); i += 1; continue; }
      if (c === '}' && stack.length) {
        const top = stack[stack.length - 1];
        if (top.depth === 0) { stack.pop(); state = 'string'; quote = top.quote; push(c, c); i += 1; continue; }
        top.depth -= 1; push(c, c); i += 1; continue;
      }
      push(c, c); i += 1; continue;
    }
    if (state === 'line') {
      if (c === '\n') { state = 'code'; push('\n', '\n'); i += 1; continue; }
      push(' ', ' ', c); i += 1; continue;
    }
    if (state === 'regex') {
      if (c === '\\') { push('  ', '  '); i += 2; continue; }
      if (c === '[') inClass = true;
      else if (c === ']') inClass = false;
      else if (c === '/' && !inClass) { state = 'code'; push(c, c); i += 1; continue; }
      else if (c === '\n') { state = 'code'; push('\n', '\n'); i += 1; continue; }
      push(' ', ' '); i += 1; continue;
    }
    if (state === 'block') {
      if (c === '*' && n === '/') { state = 'code'; push('  ', '  '); i += 2; continue; }
      push(c === '\n' ? '\n' : ' ', c === '\n' ? '\n' : ' ', c); i += 1; continue;
    }
    // inside a string literal
    if (c === '\\') { push(src.slice(i, i + 2), '  '); i += 2; continue; }
    if (quote === '`' && c === '$' && n === '{') { stack.push({ quote, depth: 0 }); state = 'code'; push('${', '${'); i += 2; continue; }
    if (c === quote) { state = 'code'; push(c, c); i += 1; continue; }
    if (c === '\n') { push('\n', '\n'); i += 1; continue; }
    push(c, ' ', ' '); i += 1;
  }
  return { strings, code, inert };
}

/** Inline <script> bodies are code; the rest of an HTML file is prose. */
function splitHtml(src) {
  let code = '';
  let prose = '';
  const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let last = 0;
  let m;
  while ((m = re.exec(src)) !== null) {
    const before = src.slice(last, m.index);
    prose += before;
    code += before.replace(/[^\n]/g, ' ');
    const head = m[0].slice(0, m[0].indexOf('>') + 1);
    prose += head.replace(/[^\n]/g, ' ') + m[1].replace(/[^\n]/g, ' ');
    code += head.replace(/[^\n]/g, ' ') + m[1];
    last = m.index + m[0].length - '</script>'.length;
    prose += '';
  }
  prose += src.slice(last);
  code += src.slice(last).replace(/[^\n]/g, ' ');
  return { code, prose };
}

/** Identifiers that present rather than compute. */
const PRESENTS = /^(?:render|draw|paint|format|describe|explain|label|display|chart|plot|tooltip|caption|legend|summar|narrat|annotate)/i;

/** Reject explicit non-demonstration contexts, not every mention of a risk.
 * This is a bounded prose filter, not proof that an attack is implemented.
 * Ambiguous cases still need a source-pinned review. An actual executable
 * attack identifier survives a neighbouring prose warning or negative control.
 */
function attackContextAllows(term, line, code = '') {
  if (!term.re.test(line)) return false;
  if (code.trim() && shapeOf(line, code, term)) return true;
  const text = line.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const occurrences = [...text.matchAll(new RegExp(term.re.source, term.re.flags.replace(/[gy]/g, '') + 'g'))];
  return occurrences.some(hit => {
    // Bound negation to this clause: "not production crypto" in a later
    // sentence must not erase an earlier working attack demonstration.
    const before = text.slice(0, hit.index).split(/[.;]/).at(-1);
    const after = text.slice(hit.index + hit[0].length).split(/[.;]/)[0];
    // A coordinated affirmative predicate has its own negation scope:
    // "holds no key, ... , and frequency analysis recovers cells". Keep the
    // full context for the risk filter below. Merely splitting at commas or
    // "and" would instead credit a negated list such as "no key recovery,
    // and frequency analysis". This remains a bounded prose heuristic.
    const coordinated = before.match(/,\s*(?:and|but|yet)\s+([^,]*)$/i);
    const negationBefore = coordinated && /^\s+(?:recovers?|reveals?|extracts?|enumerates?|forges?|measures?|demonstrates?|executes?)\b/i.test(after)
      ? coordinated[1] : before;
    if (/\b(?:not|never|no|neither|without|cannot|can't|doesn't|don't)\b.{0,80}$/i.test(negationBefore)) return false;
    if (/^.{0,45}\b(?:not demonstrated|not implemented|not measured|not reproduced|out of scope|blind spot)\b/i.test(after)) return false;
    // Markdown risk lists often put the attack name in a short bold sentence,
    // then explain the pitfall in the next sentence. Clause-bounded negation is
    // still right above, but that punctuation must not turn a warning heading
    // into an executed attack.
    if (/\bpitfall\b/i.test(text)
      && !/\b(?:demonstrat|execut|enumerat|crack|forge|run|measur)\w*/i.test(text)) return false;
    if (/\b(?:co-inventor|biography|born|studied under|assumptions?|risk|warning|pitfall|production|hardened|prevent\w*|defend\w*|protect\w*|resistan\w*)\b/i.test(before + hit[0] + after)
      && !/\b(?:demonstrat|execut|enumerat|crack|forge|run|measur)\w*/i.test(before + after)) return false;
    return true;
  });
}

/* A declaration whose VALUE is a projection does not compute the algorithm it is
   named after. PRESENTS catches the function that draws a thing; this catches the
   constant that models one.

   crypto-lab-export-grade was credited with implementing AES on the strength of

       const aes128 = extrapolate(128, rate.candidatesPerSecond, multiplier);

   which holds an extrapolation of the learner's own measured brute-force rate out
   to a 128-bit keyspace. The lab implements no AES - Exhibit 6 plots published
   results from a citation table. `aes128` camel-splits to "aes 128", `\baes\b`
   matches, and the declaration shape does the rest. This is mentions-as-
   implementations arriving through a VARIABLE NAME, the one route the string-
   blanking lexer cannot see, because the name is executable code.

   It keys on the INITIALISER, not on the identifier. The obvious rule - "an
   identifier that is the algorithm name plus a key size is a table row" - was
   written first and measured: it moved 21 anchors across 18 labs and removed no
   false claim anywhere, because `hmacSha256`, `shake128`, `mlKem768` and
   `keccakF1600` all end in digits that are part of the STANDARD INSTANCE NAME.
   The vocabulary's canonical term is the family; real code names the parameter
   set. Suppressing on digits demotes those labs to a worse anchor - frodo-vault's
   ML-KEM moved from src/frodo-kem.ts to src/main.ts - to fix nothing. That
   variant is recorded here so it is not rediscovered and retried. */
const MODELS = /^(?:extrapolat|estimat|project|predict|forecast|budget|scale|assume)/i;

/* A declaration that names an ATTACK on an algorithm does not implement the
   algorithm. Third of the same family: PRESENTS draws it, MODELS projects it,
   this one attacks it.

       export function kipnisShamirAttack(        crypto-lab-multivariate

   camel-splits to "kipnis Shamir Attack", `\bshamir\b` matches, and the lab was
   credited with implementing Shamir secret sharing - which it does not; it
   implements UOV, and Kipnis and Shamir are the authors of an attack on it. The
   card already has somewhere to put that fact: `data-attacks`.

   It keys on the identifier's LAST word rather than anywhere in it, because
   `attackPane` presents an attack and `runAttack` performs one, while
   `aesAttack` is the shape that misattributes. A surname lookbehind was the
   other candidate - `(?<!kipnis)\bshamir\b`, extending the one already there
   for Fiat-Shamir - and it was rejected because it needs a new lookbehind per
   co-author, per term, forever: Dunkelman-Keller-Shamir is in this fleet too. */
const ATTACKS_IT = /(?:attack|attacks|break|breaks|forgery|exploit|cryptanalysis)$/i;

/* A declaration that MEASURES an algorithm is data about it, not an
   implementation of it. crypto-lab-mceliece-gate was credited with implementing
   RSA on

       const rsaBytes = SIZE_COMPARISONS.find((e) => e.name === "RSA-2048 public key")!.bytes;

   a lookup in its own key-size comparison table. The scalar-literal rule below
   does not reach it, because the initialiser is a call.

   Keyed on the last word, same as ATTACKS_IT: `aesKeyBytes` is a size and
   `bytesToAes` is a conversion. */
const MEASURES = /(?:bytes|bits|size|sizes|length|len|count|year|years|iterations|rate)$/i;

/* A declaration that HOLDS TEST DATA is not the operation the data is for.

       const zucKey = hexToBytes('173d14ba5003731d7a60049470f00a29')   crypto-lab-air-stream

   is a known-answer-test input in src/core/families.ts. It was crypto-lab-air-stream's
   ZUC anchor, while the lab's actual ZUC lives in `export class Zuc128` in
   src/zuc/zuc.ts - so the card pointed a reader at a hex string instead of at the
   cipher. Both are `decl` shaped and the walk keeps the first, which is why rank
   alone could not fix it.

   This does not make the lab implement less; it moves the anchor to the thing
   worth reading. A term whose ONLY evidence is test data loses the credit, which
   is the right answer too: holding another implementation's vectors is not
   implementing it. */
const HOLDS_DATA = /(?:key|keys|iv|ivs|nonce|nonces|vector|vectors|expected|plaintext|ciphertext|kat|kats|fixture|fixtures)$/i;

/** The last camel word of an identifier, for the three guards above. */
const lastWord = (id) => camelSplit(id).split(/[\s_]+/).filter(Boolean).pop() || id;

/** A declaration whose value is a bare scalar literal: a number, a string, a
 *  boolean. `const MLKEM_ORIGIN_YEAR = 2017` is a fact about ML-KEM and
 *  `const MCELIECE_348864_PUBLIC_KEY_BYTES = 261120` is a fact about Classic
 *  McEliece; neither computes anything. ARRAY and OBJECT initialisers are
 *  deliberately NOT included - an S-box IS part of an implementation, and
 *  `const AES_SBOX = [0x63, ...]` must keep crediting AES. */
const SCALAR_INIT = /^\s*(?:-?\d[\d_]*n?|0[xob][0-9a-fA-F_]+n?|'[^']*'|"[^"]*"|`[^`]*`|true|false|null|undefined)\s*(?:as\s+[\w.<>[\]]+\s*)?[;,)]?\s*(?:\/\/.*)?$/;

/** A value that IS data: a literal, an array or object of them, or a byte
 *  conversion of a literal. Paired with HOLDS_DATA, whose name test alone
 *  cannot tell a stored test vector from a live key object. */
const DATA_INIT = /^\s*(?:-?\d|0[xob][0-9a-fA-F]|'|"|`|\[|\{|true|false|null|undefined|new\s+Uint8Array\s*\(|(?:hex|bytes|utf8|base64)[A-Za-z]*\s*\(\s*['"`]|Buffer\.from\s*\(\s*['"`])/;

/** An all-zero WebCrypto IV, written as a literal. */
const ZERO_IV = /\biv\s*:\s*new\s+Uint8Array\(\s*(?:8|12|16|1[0-9]|2[0-9]|32)?\s*\)/;

/** Split camelCase and PascalCase so `\b` anchored terms can reach inside an
 * identifier. `toyCkks`, `lweSample` and `encryptMisty1CoreRounds` are all
 * implementations whose algorithm name has no word boundary in front of it, and
 * every one of them read as UNKNOWN until this existed — a lab implementing
 * MISTY1 in a file called misty1.ts, reported as implementing nothing. */
function camelSplit(text) {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d)/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

/** Does this line build or parse one of the protocol's own message structures?
 *
 * Checked OUTSIDE the term-regex gate, which is the whole point and was the bug
 * the first time: `buildClientHello` contains no substring "TLS 1.3", so a gate
 * that first requires the term's own pattern to match the line can never reach
 * this. Protocol identity exists precisely where the protocol's NAME is absent.
 *
 * Narrow on purpose: a lab that IMPLEMENTS a protocol declares its message
 * types, while a lab that MODELS an attack on one declares runAttack and llr.
 * Keying on the repo slug instead would manufacture the exact false claim just
 * removed from four cards - crypto-lab-hqc-timing has "hqc" in its name and
 * implements none of it. */
const flatten = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '');

/* Verbs that act on a structure without renaming it. */
const VERBS = new Set(['build', 'make', 'create', 'new', 'encode', 'decode', 'parse',
  'read', 'write', 'serialize', 'serialise', 'deserialize', 'deserialise', 'format',
  'to', 'from', 'get', 'set', 'is', 'as', 'the', 'a', 'an', 'raw', 'inner', 'outer']);

function structuresNamed(code, term) {
  if (!term.structures) return [];
  const ids = [
    ...[...code.matchAll(/(?:^|[\s;{(,])(?:async\s+)?(?:function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g)].map((x) => x[1]),
    ...[...code.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)].map((x) => x[1]),
    ...[...code.matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)].map((x) => x[1]),
  ];
  /* Whole camel TOKENS in contiguous order, never a substring. Substring
     matching put `Envelope` (an OPAQUE message) on an ECIES lab, `LeafNode` (an
     MLS one) on an LMS hash tree, and `OpenBase` on a variable called
     openBaseline - 38 findings, almost all nonsense. `buildClientHello` splits
     to [build, client, hello] and contains [client, hello] in order; that is a
     match and `openBaseline` is not. */
  const toks = (t) => camelSplit(t).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const out = [];
  for (const st of term.structures) {
    const r = toks(st);
    for (const id of ids) {
      const a = toks(id);
      const at = a.findIndex((_, k) => r.every((w, m) => a[k + m] === w));
      if (at < 0) continue;
      /* The tokens BEFORE the match, so a caller can see whether every hit in a
         lab shares one foreign prefix. crypto-lab-pake-gate names SRP-6a's two
         messages `srpClientHello` and `srpServerHello`: two distinct TLS
         structures by name, neither of them TLS. `build` in `buildClientHello`
         is a verb and varies; `srp` is another protocol and does not. */
      /* Leading VERBS are stripped before the prefix is recorded. `encode` in
         `encodeClientHello` is an action performed on the protocol's own
         message; `srp` in `srpClientHello` is a different protocol wearing its
         name. Counting both as prefixes cost crypto-lab-downgrade-wire a true
         finding, because every one of its mentions is an encode or a decode. */
      const pre = a.slice(0, at).filter((t) => !VERBS.has(t)).join('-');
      out.push({ structure: st, prefix: pre });
      break;
    }
  }
  return out;
}

/* The three shapes, tested against ONE line of comment-blanked code.
 *
 * The decl and invoked-identifier tests read the line with string CONTENTS
 * blanked, because `scheme: 'HQC (Hamming Quasi-Cyclic)'` otherwise parses as the
 * identifier HQC being invoked, and that one line had crypto-lab-hqc-timing —
 * a lab whose README says it implements no decoder at all — claiming to
 * implement HQC. The import and WebCrypto tests deliberately DO read string
 * contents: a module path and an algorithm name are strings by nature. */
/* The BINDINGS of an import/require line, which is the only place a term's bare
   token is allowed to count. A module PATH is a vendor's product line and never
   evidence on its own: `sm-crypto` ships SM2, SM3 and SM4, and crediting the
   path put SM2 on crypto-lab-world-hashes, which imports only `sm3` from it.
   `symbolRe` is therefore tested against the imported NAME and never against the
   path, and terms without one are unaffected. */
function importedSymbols(line) {
  if (!/\b(?:import|export|require)\b/.test(lex(line).code)) return [];
  const braces = /\{([^}]*)\}/.exec(line);
  if (!braces) return [];
  // Aliases can qualify generic computation exports (encap as dhkemEncap),
  // but cannot turn a presentation, projection or attack into implementation.
  return braces[1].split(',').flatMap((b) => {
    const names = b.split(/\s+as\s+|:/).map((n) => n.trim()).filter(Boolean);
    const original = names[0] || '';
    return PRESENTS.test(original) || MODELS.test(original) || ATTACKS_IT.test(lastWord(original))
      ? names.slice(0, 1) : names;
  });
}

/* Does this line name the term at all? The gate in front of shapeOf. A term with
   a `symbolRe` can also be named by an imported binding the line pattern cannot
   see: `import { sm3 } from '@li0ard/sm3'` survives neither `re` nor camelSplit,
   which turns `sm3` into `sm 3`. */
function namesTerm(line, camel, term) {
  if (term.re.test(line) || term.re.test(camel)) return true;
  return Boolean(term.symbolRe) && importedSymbols(line).some((n) => term.symbolRe.test(n));
}

function shapeOf(line, code, term, wide) {
  /* import / require, whose BINDINGS decide when it has any. Reading the path
     first missed `import { x25519 } from '@noble/curves/ed25519'` — the module
     is named for one algorithm and exports another — so bindings-matching was
     added beside it. But the path was still tested FIRST, so the same line
     credited BOTH, and

         import { ristretto255, ristretto255_hasher } from '@noble/curves/ed25519.js'

     credited crypto-lab-fold-gate with implementing Ed25519 on the strength of a
     filename, while every binding on the line says ristretto255. A named import
     is a statement about what is used; the path is a statement about where it
     lives. When the line says which symbols it took, that list is the evidence
     and the path is not consulted. A default, namespace or side-effect import
     names no symbols, and there the path is all there is. */
  // A quoted explanation can contain `from "RSA"` without importing anything.
  // Strings supply paths only after executable syntax establishes an import.
  const importing = /(?:^|[;\s])(?:import|export)\s|\b(?:require|import)\s*\(|^\s*}\s*from\b/.test(code);
  const imports = importing ? [...line.matchAll(/(?:from\s*|require\(\s*|import\(\s*)['"]([^'"]+)['"]/g)].map((x) => x[1]) : [];
  /* Importing an ATTACK is not importing an implementation. crypto-lab-multivariate
     suppressed `export function kipnisShamirAttack(` at its declaration and was
     then credited with Shamir secret sharing anyway, from
     `import { kipnisShamirAttack, publicPartOf } from './attack.ts'` one file
     away - the same false claim, reached by the other route. A binding that names
     an attack is excluded from BOTH tests below: it cannot credit its term, and
     it cannot make the bindings informative enough to override the path, because
     it identifies no implementation either way. */
  const allNames = importing ? importedSymbols(line) : [];
  const names = allNames.filter((n) => !ATTACKS_IT.test(lastWord(n)) && !PRESENTS.test(n) && !MODELS.test(n));
  const binds = (t) => names.some((n) => t.re.test(n) || t.re.test(camelSplit(n))
    || (t.symbolRe && t.symbolRe.test(n)));
  if (binds(term)) return 'import';
  /* The path is overridden only when a binding names a DIFFERENT algorithm, which
     is the precise form of the fold-gate defect: `ristretto255` and `x25519` are
     themselves vocabulary terms, so they say positively what was taken from a
     file called ed25519.js. A binding that names no algorithm says nothing about
     which one - `import { ctr } from '@noble/ciphers/aes.js'` takes AES-CTR,
     `import { extract, expand } from '@noble/hashes/hkdf.js'` takes HKDF, and
     `import { generateKeyPair } from '@hub/hpke/dhkem'` takes DHKEM. Requiring a
     binding to name the term outright removed all three, and AES from
     crypto-lab-split-point and crypto-lab-attestation-gate with them. So the
     question is not "does a binding name this term" but "does a binding name a
     term at all": if one does, it is the evidence; if none does, the path is
     still all there is. */
  const informative = names.some((n) => ALGORITHMS.some((t) => t.re.test(n)
    || t.re.test(camelSplit(n)) || (t.symbolRe && t.symbolRe.test(n))));
  if (!informative && !(allNames.length && !names.length)
    && imports.some((p) => term.re.test(p) || term.re.test(camelSplit(p)))) return 'import';
  /* WebCrypto: the term is a quoted algorithm name anywhere on a subtle line, or
     on the `name:` of an algorithm object. */
  /* A WebCrypto call is often written across four lines, and the algorithm name
     is on none of the first one:

         const bits = await crypto.subtle.deriveBits(
           {
             name: 'HKDF',
             hash: 'SHA-256',

     `wide` is that call's own lines joined, so the quoted name is read with the
     operation that uses it and the ANCHOR points at the operation. Reading one
     line at a time meant the only HKDF evidence in crypto-lab-harvest-vault and
     crypto-lab-kyber-vault was the importKey above it - key material standing in
     for a derivation, which is the weaker claim in the wrong place. It is used
     ONLY for the quoted-name test below, never for declarations: widening those
     would let one line's `const` be credited to its neighbour. */
  const view = wide && /crypto\.subtle\.\w+\s*\($/.test(line.trim()) ? wide : line;
  const quoted = [...view.matchAll(/['"]([^'"]{2,40})['"]/g)].map((x) => x[1]);
  /* A WebCrypto algorithm object, not any object with a `name`. The bare
     `name:` test read `{ name: "HQC-128", bytes: 2249 }` — a row in a key-size
     TABLE — as crypto-lab-mceliece-gate implementing HQC. A real algorithm
     object carries one of WebCrypto's own parameter keys alongside the name. */
  const isSubtle = /crypto\.subtle\.\w+/.test(view)
    || (/\bname\s*:\s*['"]/.test(line)
      && /\b(?:hash|namedCurve|iv|length|salt|info|modulusLength|publicExponent|tagLength|counter|saltLength|iterations)\s*:/.test(line));
  if (isSubtle && quoted.some((q) => term.re.test(q))) {
    /* An all-zero IV means the caller wanted the BLOCK CIPHER, not the mode.
       crypto-lab-air-stream builds 128-EEA2 (AES-CTR) and reaches the raw AES
       block through `{ name: 'AES-CBC', iv: new Uint8Array(16) }` on one block -
       the standard way to get ECB out of WebCrypto, which offers no ECB. It was
       credited with implementing AES-CBC, a mode it does not use and does not
       claim: its chips say AES-CTR. AES itself still credits, from the same
       line, because that part is true. A real CBC lab passes a real IV and is
       untouched. */
    if (/^AES-(?:CBC|CTR|GCM|CCM|KW|SIV|XTS)$/.test(term.name) && ZERO_IV.test(view)) return null;
    /* `importKey` names the algorithm a key is FOR. It is key material, not an
       operation, and it is ranked below every other shape so that a lab which
       also performs the operation anchors on the operation. A term whose ONLY
       evidence is an imported key is not recorded as implemented - intent is not
       computation - which is what finally takes AES-CBC off air-stream, whose
       other AES-CBC line is the zero-IV call above. */
    if (/crypto\.subtle\.importKey/.test(view)) return 'keyimport';
    return 'call';
  }
  /* a declaration whose NAME carries the term */
  /* The `(?::[^=]+)?` is TypeScript's type annotation, and leaving it out was a
     silent systematic miss: `export const SECP256K1: FpPreset = {` declares
     secp256k1 and matched nothing, because the pattern wanted the `=` to follow
     the identifier directly. Every annotated const in the fleet was invisible. */
  const decl = /(?:^|[\s;{(,])(?:async\s+)?(?:function|class)\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]{1,80})?=/g;
  let d;
  while ((d = decl.exec(code)) !== null) {
    const id = d[1] || d[2];
    if (!id) continue;
    /* A function that DRAWS an algorithm does not compute it. `renderModuleLWE`
       paints a diagram of Module-LWE; reading it as an implementation is the
       same error as reading a mention, one layer in. */
    if (PRESENTS.test(id)) continue;
    /* An attack on it, a measurement of it, or a stored test vector for it -
       none of the three is an implementation of it. Keyed on the identifier's
       last word; see each guard's own note. */
    const last = lastWord(id);
    /* An attack on it is not an implementation of it, whatever declares it: a
       function that attacks and a constant that attacks are the same claim. */
    if (ATTACKS_IT.test(last)) continue;
    const rest = code.slice(d.index + d[0].length - 1);
    const isVar = /^\s*(?::[^=]{0,80})?=/.test(rest);
    /* MEASURES and HOLDS_DATA are about what a VARIABLE holds, so they do not
       apply to a function or a class. A function DOES something even when its
       name is a noun: `bulletproofBytes(bits)` computes a proof size and
       crypto-lab-bulletproofs implements Bulletproofs, `isdPrangeBits(n, k, t)`
       computes Prange's work factor and crypto-lab-pq-families implements
       information-set decoding. Applying these two to every declaration took the
       term off four labs that do implement it - including the lab the term is
       named after, which is the shape of a rule that has stopped discriminating. */
    if (isVar && MEASURES.test(last)) continue;
    /* `const aes128 = extrapolate(...)` - the name says AES, the value is a
       projection. Only the initialiser of THIS declaration is read. */
    const init = /=\s*([A-Za-z_$][\w$]*)\s*\(/.exec(rest);
    if (init && MODELS.test(init[1])) continue;
    /* …and a declaration whose value is a bare scalar is a FACT about the
       algorithm rather than a computation of it. */
    if (isVar && SCALAR_INIT.test(rest.replace(/^\s*(?::[^=]{0,80})?=/, ''))) continue;
    /* HOLDS_DATA needs the VALUE to be data as well as the name to say so.
       `const zucKey = hexToBytes('173d…')` is a test vector; `const hkdfKey =
       await crypto.subtle.importKey(…)` is a live key object, and suppressing it
       took HKDF off two labs that derive with it. Literals, arrays, objects and
       byte conversions of a literal are data; anything awaited or computed is
       not. */
    if (isVar && HOLDS_DATA.test(last) && DATA_INIT.test(rest.replace(/^\s*(?::[^=]{0,80})?=/, ''))) continue;
    /* A function or class that IS the algorithm outranks a variable that holds a
       result of it. Both were 'decl', so the walk kept whichever file it opened
       first: crypto-lab-air-stream's ZUC anchored at `const zuc =
       encryptZucEea3(...)` in src/core/families.ts - a call in a test-vector
       table - while `export class Zuc128` sat unreferenced in src/zuc/zuc.ts,
       because src/core sorts before src/zuc and equal ranks do not replace. Both
       are real evidence; one is the thing itself. */
    if (term.re.test(id) || term.re.test(camelSplit(id))) return d[1] ? 'decl' : 'binding';
  }
  /* an identifier carrying the term being invoked - with the same three guards
     the declaration gets. `if (mount) renderFiatShamir(mount);` credited
     crypto-lab-dilithium-seal with Fiat-Shamir and `renderModuleLWE(mount)` with
     LWE, both from the CALL SITE of a function whose own declaration PRESENTS
     already suppressed. The guard was applied where the thing is defined and not
     where it is used, so the suppression was one line of evidence deep. */
  const calls = [...code.matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)].map((x) => x[1]);
  if (calls.some((id) => !PRESENTS.test(id) && !MODELS.test(id)
    && !ATTACKS_IT.test(lastWord(id)) && !MEASURES.test(lastWord(id))
    && (term.re.test(id) || term.re.test(camelSplit(id))))) return 'call';
  return null;
}

/* A line that declares something executable, used with a path match. */
const DECLARES = /(?:^|[\s;{(,])(?:export\s+)?(?:async\s+)?function\s+[A-Za-z_$]|(?:^|[\s;{(,])class\s+[A-Za-z_$]/;

function labFiles(dir, clone = dir) {
  const files = labFilePaths(clone, dir);
  if (files === null) return { code: [], prose: [], unread: new Map(), unreadable: true };
  const code = [];
  const prose = [];
  const unread = new Map();
  for (const f of files) {
    const rel = path.relative(dir, f);
    if (NOT_THE_LAB.test(rel) || NOT_THIS_LABS_CODE.test(rel) || BUILD_DOC.test(rel)) continue;
    for (const lang of UNREAD_LANGS) {
      if (lang.re.test(rel)) unread.set(lang.name, (unread.get(lang.name) || 0) + 1);
    }
    if (CODE_EXT.test(f)) code.push(rel);
    else if (/\.html?$/.test(f)) { code.push(rel); prose.push(rel); }
    else if (/\.md$/i.test(f)) prose.push(rel);
  }
  return { code, prose, unread };
}

/** Reasons each reviewed `add` entry does not parse; empty when the list is good.
 *  Exported so selftest asserts the production rule rather than a copy of it. */
function invalidReviewedAdds(add) {
  const bad = [];
  for (const item of add) {
    const at = item.lastIndexOf('@');
    const name = item.slice(0, at);
    const anchor = item.slice(at + 1);
    if (at < 0) bad.push(`${item} (no @anchor)`);
    else if (!ALGORITHMS.some((term) => term.name === name)) bad.push(`${item} (no vocabulary term named "${name}")`);
    else if (!/^.+:\d+$/.test(anchor)) bad.push(`${item} (anchor is not path:line)`);
  }
  return bad;
}

/** Reasons each reviewed `addAttacks` entry does not parse.
 *
 * Attack evidence needs the same pinned-review escape hatch as algorithm
 * evidence.  The scanner deliberately accepts only conservative wording, so a
 * computation can expose a recovered byte without ever spelling the canonical
 * vocabulary label "key recovery".  Keeping this separate from `add` prevents
 * an attack from being published as an implemented primitive.
 */
function invalidReviewedAttackAdds(add) {
  const bad = [];
  for (const item of add) {
    const at = item.lastIndexOf('@');
    const name = item.slice(0, at);
    const anchor = item.slice(at + 1);
    if (at < 0) bad.push(`${item} (no @anchor)`);
    else if (!ATTACKS.some((term) => term.name === name)) bad.push(`${item} (no attack vocabulary term named "${name}")`);
    else if (!/^.+:\d+$/.test(anchor)) bad.push(`${item} (anchor is not path:line)`);
  }
  return bad;
}

function isReviewedAdd(review, item) {
  return Boolean(review?.add?.includes(item) || review?.addAttacks?.includes(item));
}

/* A lab's tree at one commit, extracted so the SAME scanner can read it.
 * Cached per clone+commit: a fleet run asks for a pinned tree once per lab and
 * the extraction, not the scan, is the expensive half. */
const treeCache = new Map();
function treeAt(dir, commit) {
  const key = `${dir}@${commit}`;
  if (treeCache.has(key)) return treeCache.get(key);
  let out = null;
  try {
    const dest = fs.mkdtempSync(path.join(os.tmpdir(), 'ce-at-'));
    const tar = path.join(dest, 'tree.tar');
    execFileSync('git', ['-C', dir, 'archive', '--format=tar', `--output=${tar}`, commit], { stdio: ['ignore', 'ignore', 'ignore'] });
    execFileSync('tar', ['-xf', tar, '-C', dest], { stdio: ['ignore', 'ignore', 'ignore'] });
    fs.rmSync(tar, { force: true });
    out = dest;
  } catch { out = null; }        // absent commit, shallow clone, empty repository
  treeCache.set(key, out);
  return out;
}

/* THE REFERENCE SET A PIN WAS REVIEWED AGAINST, derived by the production
 * pipeline rather than by a second copy of it.
 *
 * `movedSubstantively` asks whether README.md or src/ changed, because those are
 * what the IMPLEMENTATION derivation reads. References are not derived from
 * those alone: every .md in a lab is scanned, AGENTS.md and docs/ included. A
 * docs edit therefore changes a card's references under a pin the movement rule
 * still calls fresh — the gap recorded beside the cab71cb fix.
 *
 * Asking the question by RESULT closes it without guessing at paths: derive the
 * reference set at the pin and at HEAD and compare. Identical means the pin
 * holds however many files moved; different means the lab is stale and the
 * names that moved are reported. Both sides run `evidenceFor` with no review
 * applied, so the comparison is between two raw scanner outputs and never
 * between a reviewed card and an unreviewed one. */
function referenceDrift(slug, dir, pin, head) {
  if (pin === head) return null;
  const at = (commit) => {
    const ev = evidenceFor(slug, commit, dir);
    return ev && !ev.notScanned ? ev.references : null;
  };
  const before = at(pin);
  const after = at(head);
  if (!before || !after) return null;          // could not look is not a finding
  const b = new Set(before);
  const a = new Set(after);
  const added = after.filter((n) => !b.has(n));
  const dropped = before.filter((n) => !a.has(n));
  return added.length || dropped.length ? { added, dropped } : null;
}

/** @param atCommit    derive from the lab's tree at this commit, with NO review
 *    applied. Used by referenceDrift; never recurses, because the review block
 *    below is skipped whenever it is set.
 *  @param dirOverride  read this clone instead of the one named by the slug, so
 *    the selftest can drive the production derivation against a throwaway
 *    repository rather than against a second copy of the rules. Production
 *    always uses the canonical sibling clone path; this exists so a negative
 *    control need not invent a fake fleet member to drive the real scanner. */
function evidenceFor(slug, atCommit = null, dirOverride = null) {
  const dir = dirOverride || path.join(REPOS, slug);
  if (!fs.existsSync(path.join(dir, '.git'))) {
    /* A lab with no clone here is NOT-SCANNED, not UNKNOWN. UNKNOWN means every
       file this tool reads was read and nothing was derivable; this is the tool
       never having opened anything. Reporting the second as the first is the
       conflation the NOT-SCANNED state exists to end, and a newly carded lab -
       carded before it is cloned - is exactly where it shows up. */
    return {
      slug, cloned: false, implements: [], references: [], attacks: [], standards: [],
      implementation: 'UNKNOWN', unscanned: ['not cloned here'], notScanned: true,
      commentOnly: [], protocolPartial: [], staleReview: null,
    };
  }
  /* Read this lab's FILES from its committed state, never from another lane's
     half-finished edit. `dir` stays the clone for git commands below; `src` is
     where bytes come from. See tools/clone-source.js for the incident. */
  const src = sourceRoot(dir);
  if (src.from === 'refused') {
    return {
      slug, cloned: true, implements: [], references: [], attacks: [], standards: [],
      implementation: 'UNKNOWN', unscanned: [`dirty clone, HEAD unreadable (${src.dirty} paths)`], notScanned: true,
      commentOnly: [], protocolPartial: [], staleReview: null,
    };
  }
  const read = atCommit ? treeAt(dir, atCommit) : src.root;
  if (atCommit && !read) {
    return {
      slug, cloned: true, implements: [], references: [], attacks: [], standards: [],
      implementation: 'UNKNOWN', unscanned: [`tree at ${atCommit} could not be extracted`], notScanned: true,
      commentOnly: [], protocolPartial: [], staleReview: null,
    };
  }
  const { code, prose, unread, unreadable: cannotList } = labFiles(read, dir);
  if (cannotList) {
    return {
      slug, cloned: true, implements: [], references: [], attacks: [], standards: [],
      implementation: 'UNKNOWN', unscanned: ['git could not list tracked files'], notScanned: true,
      commentOnly: [], protocolPartial: [], staleReview: null,
    };
  }
  const hits = new Map();   // term name -> {shape, at}
  const mentions = new Map();
  const attackHits = new Map();
  const structureHits = new Map();
  const commentOnly = new Map();
  const libs = new Set();

  const record = (map, name, at, shape) => {
    if (!map.has(name)) map.set(name, { at, shape });
  };
  /* The anchor should point at the strongest evidence in the lab, not the first
     file the walk happened to open. A declaration says more than an import:
     `from './hqc'` proves a module is used, `function hqcDecode(` shows the work
     being done, and the anchor is there to be read by a person. */
  const RANK = { decl: 6, binding: 5, call: 4, protocol: 3, import: 2, path: 1, keyimport: 0 };
  const keepBest = (map, name, at, shape) => {
    const have = map.get(name);
    if (!have || RANK[shape] > RANK[have.shape]) map.set(name, { at, shape });
  };

  for (const rel of code) {
    let raw;
    try { raw = fs.readFileSync(path.join(read, rel), 'utf8'); }
    catch (e) { noteUnread('catalog-evidence', `${slug}: ${rel}`, e); continue; }
    const text = /\.html?$/.test(rel) ? splitHtml(raw).code : raw;
    const lexed = lex(text);
    const src = lexed.strings;
    if (/crypto\.subtle\./.test(src)) libs.add('WebCrypto');
    if (/@noble\//.test(src)) libs.add('@noble');
    if (/\.wasm\b|WebAssembly\./.test(src)) libs.add('WASM');
    const lines = src.split('\n');
    const codeLines = lexed.code.split('\n');
    const inertLines = lexed.inert.split('\n');
    /* A file's PATH is evidence about every declaration in it. src/misty1/fo.ts
       declares `misty1Fo`, but src/ciphers/aria.ts declares `expandKey` — the
       algorithm is named by the directory, not by the identifier, and reading
       only identifiers put a whole implemented cipher in the references list. */
    const pathTerms = ALGORITHMS.filter((t) => {
      const rx = t.pathRe || t.re;
      return rx.test(rel) || rx.test(camelSplit(rel));
    });
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const inertLine = inertLines[i] || '';
      /* `line` is the STRINGS view, which is blank for a line that is nothing but a
         comment. Until 2026-10-21 the loop opened `if (!line.trim()) continue`, and
         the comment-only check sat BELOW it -- so a standalone comment line was
         skipped before that check ever ran, and the exemption worked only for a
         comment sharing its line with code.
         That is why crypto-lab-hybrid-guide was exempt (`classical: Uint8Array; //
         X25519-style shared secret` -- a trailing comment, so the strings view is
         non-blank) while crypto-lab-commit-gate was not. commit-gate is the case
         CLAUDE.md cites FOR this exemption: `src/pedersen.ts:132` names P-256 in a
         block comment beside the arithmetic, and it had never been exempted once.
         Same for crypto-lab-accumulator (RSA), crypto-lab-beacon-lock (IBE) and
         crypto-lab-sleeve-check (Streebog) -- all standalone block comments, all
         reported to the chip rule as unexplained.
         So the exit is split: a line with nothing in EITHER view is still skipped,
         and the comment check runs before the work that needs code. */
      if (!line.trim() && !inertLine.trim()) continue;
      if (inertLine.trim()) {
        for (const term of ALGORITHMS) {
          if (commentOnly.has(term.name)) continue;
          if (term.re.test(inertLine) || term.re.test(camelSplit(inertLine))) {
            commentOnly.set(term.name, `${rel}:${i + 1}`);
          }
        }
      }
      if (!line.trim()) continue;
      const camel = camelSplit(line);
      /* A WebCrypto call left open at the end of a line continues onto the next
         ones, and its algorithm name is usually on none of the first. The gate
         below asks whether THIS line names a term, so `crypto.subtle.deriveKey(`
         named nothing and was skipped - and the only HKDF evidence left in
         crypto-lab-harvest-vault and crypto-lab-kyber-vault was the importKey
         above it. Where the line is an open call, the window it opens is asked
         as well; shapeOf reads that window under the same condition. */
      const wide = lines.slice(i, i + 5).join(' ');
      const opens = /crypto\.subtle\.\w+\s*\($/.test(line.trim());
      for (const term of ALGORITHMS) {
        if (!namesTerm(line, camel, term)
          && !(opens && namesTerm(wide, camelSplit(wide), term))) continue;
        const shape = shapeOf(line, codeLines[i], term, wide);
        if (shape) keepBest(hits, term.name, `${rel}:${i + 1}`, shape);
        else if (!hits.has(term.name)) record(mentions, term.name, `${rel}:${i + 1}`, 'mention');
      }
      for (const term of PROTOCOL_TERMS) {
        for (const hit of structuresNamed(codeLines[i], term)) {
          if (!structureHits.has(term.name)) structureHits.set(term.name, { seen: new Set(), prefixes: [], at: `${rel}:${i + 1}` });
          const h = structureHits.get(term.name);
          h.seen.add(hit.structure);
          h.prefixes.push(hit.prefix);
        }
      }
      if (pathTerms.length && DECLARES.test(codeLines[i])) {
        for (const term of pathTerms) keepBest(hits, term.name, `${rel}:${i + 1}`, 'path');
      }
      for (const atk of ATTACKS) {
        if (attackHits.has(atk.name)) continue;
        if (attackContextAllows(atk, line, codeLines[i])) record(attackHits, atk.name, `${rel}:${i + 1}`, 'code');
      }
    }
  }

  for (const rel of prose) {
    let raw;
    try { raw = fs.readFileSync(path.join(read, rel), 'utf8'); }
    catch (e) { noteUnread('catalog-evidence', `${slug}: ${rel}`, e); continue; }
    const text = /\.html?$/.test(rel) ? splitHtml(raw).prose : raw;
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.trim()) continue;
      for (const term of ALGORITHMS) {
        if (hits.has(term.name) || mentions.has(term.name)) continue;
        if (term.re.test(line)) record(mentions, term.name, `${rel}:${i + 1}`, 'prose');
      }
      for (const atk of ATTACKS) {
        if (attackHits.has(atk.name)) continue;
        if (attackContextAllows(atk, line)) record(attackHits, atk.name, `${rel}:${i + 1}`, 'prose');
      }
    }
  }

  /* TWO distinct message types of the same protocol, not one. A single borrowed
     identifier proves nothing: crypto-lab-ssh-handshake declares `ServerHello`
     for SSH's own exchange and crypto-lab-pake-gate calls SRP-6a's first message
     `srpClientHello`. Neither implements TLS, and both matched on one name.
     Two of a protocol's own messages co-occurring is the evidence. */
  /* Where the protocol shape DECLINES to claim, it records that it declined.
     Both residues below are real evidence the scanner cannot resolve, and a
     scanner that will not claim must also not accuse - the same bargain as
     NOT-SCANNED and comment-only. Without this they were silent, and silence
     from a checker reads as a negative finding. */
  const protocolPartial = [];
  for (const [name, v] of structureHits) {
    if (v.seen.size < 2) {
      protocolPartial.push({ name, at: v.at, why: `names only ${[...v.seen][0]}` });
      continue;
    }
    /* A foreign prefix DOMINATING the occurrences means the lab renamed another
       protocol's messages after this one. crypto-lab-pake-gate calls SRP-6a's
       two messages `srpClientHello` and `srpServerHello` and then holds one in a
       bare `clientHello` local — four occurrences prefixed `srp` and one not, so
       "all of them share a prefix" was not enough and "most of them do" is.
       Dominance rather than unanimity, because the local variable is downstream
       of the naming, not independent evidence of it. */
    const tally = new Map();
    for (const pre of v.prefixes) tally.set(pre, (tally.get(pre) || 0) + 1);
    const [topPrefix, topCount] = [...tally].sort((a, b) => b[1] - a[1])[0];
    if (topPrefix !== '' && topCount * 2 >= v.prefixes.length) {
      protocolPartial.push({ name, at: v.at, why: `every mention prefixed "${topPrefix}"` });
      continue;
    }
    keepBest(hits, name, v.at, 'protocol');
  }

  /* A name is comment-only when it appears in this lab's own CODE FILES and
     never in anything that executes. It is the scanner saying "the code here is
     about this algorithm and I cannot tell whether it computes it" - which is a
     different fact from UNKNOWN and from a README mention, and is the state the
     chip rule must not accuse. */
  const inertOnly = [...commentOnly.entries()].filter(([n]) => !hits.has(n))
    .map(([name, at]) => ({ name, at })).sort((a, b) => a.name.localeCompare(b.name));

  const review = REVIEWS[slug];
  let staleReview = null;
  if (review && !atCommit) {
    const head = execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    const movement = head === review.commit ? 'not-moved' : movedSubstantively(dir, review.commit, head, slug);
    if (movement === 'unreadable') {
      /* Could not look is not permission to apply the pin. The recorded add and
         remove lists stay unapplied and the card stays byte-identical, exactly as
         for a stale pin — but it is reported as PIN-UNREADABLE, because nobody has
         established that this lab moved. */
      pinUnreadable.add(slug);
      staleReview = { pinned: review.commit, current: head, unreadable: true };
    }
    /* The path rule and the result rule are both allowed to call a pin stale,
       and neither can overrule the other into silence. A docs-only edit that
       leaves the reference set alone keeps the pin; one that changes it does
       not, and the names that moved are carried on the state so the report can
       print them instead of asking a person to go and find them. */
    if (movement === 'not-moved' && head !== review.commit) {
      const drift = referenceDrift(slug, dir, review.commit, head);
      if (drift) staleReview = { pinned: review.commit, current: head, refDrift: drift };
    }
    if (movement === 'moved') {
      /* A stale pin is RECORDED here and acted on by each caller; nothing throws.
         What must not happen is a person's recorded add and remove lists being
         applied to source that has since changed - that is their judgement being
         inherited rather than made - so those edits are skipped just below.
         Everything else about the lab is derived as usual.
         This used to throw, which aborted the whole pass on the first stale lab
         in card order. See the note on the filter in writeCards. */
      staleReview = { pinned: review.commit, current: head };
    }
    if (!staleReview) {
    /* Validate the WHOLE list before applying any of it, so a lab is either
       fully reviewed or untouched -- never half. */
    const invalid = [
      ...invalidReviewedAdds(review.add || []),
      ...invalidReviewedAttackAdds(review.addAttacks || []),
    ];
    if (invalid.length) {
      badReview.set(slug, invalid);
    } else {
      applyReviewRemovals(slug, review.remove, hits, attackHits);
      for (const item of review.add || []) {
        const at = item.lastIndexOf('@');
        hits.set(item.slice(0, at), { at: item.slice(at + 1), shape: 'reviewed' });
      }
      for (const item of review.addAttacks || []) {
        const at = item.lastIndexOf('@');
        attackHits.set(item.slice(0, at), { at: item.slice(at + 1), shape: 'reviewed' });
      }
      if (review.state === 'N/A' && hits.size) {
        badReview.set(slug, [`state "N/A" conflicts with derived ${[...hits.keys()].join(', ')}`]);
      }
    }
    }
  }
  /* An imported KEY is intent, not computation. `crypto.subtle.importKey('raw',
     k, { name: 'AES-GCM' }, ...)` says a key of that type exists; the encrypt
     call says the algorithm ran, and that call is what the anchor should point
     at. Where a lab performs the operation too, the shape ranking has already
     preferred it and nothing here fires. Where an imported key is the ONLY
     evidence, the term moves to `data-references`: still recorded, no longer
     claimed as implemented. That is what finally takes AES-CBC off
     crypto-lab-air-stream, whose two AES-CBC lines are an importKey and a
     zero-IV single-block call. */
  for (const [name, v] of [...hits.entries()]) {
    if (v.shape !== 'keyimport') continue;
    hits.delete(name);
    if (!mentions.has(name)) mentions.set(name, { at: v.at, shape: 'keyimport' });
  }
  /* ONE FAMILY, ONE FINDING. A line reading "yield a valid raw signature on
     m1*m2" matches both `Signature malleability` and the bare
     `Malleability (unspecified)`, and recording both says the scanner could not
     tell when it could. Where any specific member of a family matched, the
     vague member is dropped; where none did, the vague one is the honest answer
     and stays. The same shape would remove the 42 cards that currently carry a
     specific side-channel AND `Side-channel (unspecified)`, which is left for
     the maintainer: one `family` field on three existing terms. */
  for (const fam of new Set(ATTACKS.filter((a) => a.family).map((a) => a.family))) {
    const members = ATTACKS.filter((a) => a.family === fam);
    if (!members.some((a) => a.specific && attackHits.has(a.name))) continue;
    for (const a of members) if (!a.specific) attackHits.delete(a.name);
  }
  const impl = [...hits.entries()].map(([name, v]) => ({ name, at: v.at, shape: v.shape }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const refs = reviewedReferenceNames(slug, mentions, hits, review, staleReview);
  const excludedCommentOnly = reviewedCommentOnlyNames(slug, review, staleReview);
  const ruledProtocolPartial = reviewedProtocolPartialNames(slug, review, staleReview);
  const settledByRemove = reviewedRemovedNames(slug, review, staleReview);
  const atks = [...attackHits.entries()].map(([name, v]) => ({ name, at: v.at }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const byName = new Map(ALGORITHMS.map((a) => [a.name, a]));
  const bodies = [...new Set(impl.map((i) => byName.get(i.name))
    .filter((t) => t && t.std).map((t) => t.std.split(':')[0]))].sort();

  /* An implementation style is only claimed when there is something to style.
     A lab with no algorithm evidence is UNKNOWN, not "hand-rolled": hand-rolled
     is a claim about code this tool did not find. */
  let implementation = 'UNKNOWN';
  if (libs.has('WebCrypto')) implementation = 'WebCrypto';
  else if (libs.has('@noble')) implementation = '@noble';
  else if (libs.has('WASM')) implementation = 'WASM';
  else if (impl.length) implementation = 'hand-rolled';
  if (review?.implementation) implementation = review.implementation;
  else if (review?.state === 'N/A') implementation = 'N/A (model or attack)';
  else if (impl.length && implementation === 'UNKNOWN') implementation = 'reviewed source';

  /* NOT-SCANNED is a THIRD state, and the distinction is the whole point.
     UNKNOWN means every file this tool can read was read and no algorithm was
     derivable — a real finding about a lab that models rather than computes.
     NOT-SCANNED means the lab's implementation is in a language this tool does
     not open, so it has no finding to report. Folding the second into the first
     publishes "implements nothing" about source nobody looked at. */
  const unreadable = [...unread.entries()].filter(([name]) => !review?.covered?.includes(name)).sort((a, b) => b[1] - a[1])
    .map(([name, n]) => `${name}:${n}`);
  return {
    slug,
    cloned: true,
    implements: impl,
    references: refs,
    attacks: atks,
    standards: bodies,
    implementation,
    unscanned: unreadable,
    notScanned: impl.length === 0 && unreadable.length > 0,
    reviewed: review ? { commit: review.commit, note: review.note, state: review.state || 'covered' } : null,
    // A pinned source review may promote an operation whose executable symbol
    // does not itself spell the vocabulary term. Do not keep the earlier
    // comment-only observation beside that reviewed implementation claim.
    /* THREE ways a comment-only observation is settled, not two. `hits` means
       the term was credited and the observation is superseded;
       excludedCommentOnly is an explicit removeCommentOnly; settledByRemove is
       a `remove` on the same pin, which already carries the judgement that this
       lab does not implement the name the prose mentions. */
    commentOnly: inertOnly.filter(({ name }) =>
      !hits.has(name) && !excludedCommentOnly.has(name) && !settledByRemove.has(name)),
    /* Kept ON the evidence so the run can print which observations a removal is
       carrying. Only the names that WOULD have been comment-only are listed:
       a remove whose name is nowhere in the prose settles nothing and is not
       reported as if it had. */
    removeSettledCommentOnly: inertOnly
      .filter(({ name }) => !hits.has(name) && !excludedCommentOnly.has(name) && settledByRemove.has(name))
      .map(({ name, at }) => ({ name, at })),
    staleReview,
    invalidReview: badReview.get(slug) || null,
    /* Two ways out, not one. `hits` means the term was CREDITED and the
       residue is superseded; ruledProtocolPartial means a person read the
       source and found the observation false. Before the second existed,
       crediting was the only exit, so a wrong observation could only be
       retired by making a wrong claim. */
    protocolPartial: protocolPartial
      .filter((x) => !hits.has(x.name) && !ruledProtocolPartial.has(x.name))
      .sort((a, b) => a.name.localeCompare(b.name)),
    /* The ruling is kept ON the evidence, not merely subtracted from it, so
       --json and the report can show what was decided and why. It is
       deliberately NOT written into a card attribute: these reasons are
       prose, and REVIEW-NOTE-UNWRITABLE records what prose does to the
       card's opening tag. */
    ruledProtocolPartial: [...ruledProtocolPartial].map(([name, reason]) => ({ name, reason })),
  };
}

/* ---- cards ---------------------------------------------------------------- */

const CARD_RE = /<a class="((?:project|feature)-card[^"]*)" data-category="[^"]*" href="https:\/\/systemslibrarian\.github\.io\/([^/"]+)\/"([\s\S]*?)<\/a>/g;

function cards() {
  const html = fs.readFileSync(HTML, 'utf8');
  const out = [];
  let m;
  while ((m = CARD_RE.exec(html)) !== null) {
    const title = /(?:project|feature)-title">([^<]+)</.exec(m[0]);
    out.push({ slug: m[2], title: title ? title[1].trim() : '', block: m[0], rest: m[3] });
  }
  return out;
}

const attr = (block, name) => {
  const m = new RegExp(`\\sdata-${name}="([^"]*)"`).exec(block);
  return m ? m[1] : null;
};

const encode = (items) => items.map((i) => (i.at ? `${i.name}@${i.at}` : i.name)).join(' | ');

function fieldsFor(ev) {
  const implemented = ev.implements.length ? encode(ev.implements)
    : (ev.notScanned ? 'NOT-SCANNED' : (ev.reviewed?.state === 'N/A' ? 'N/A' : 'UNKNOWN'));
  return {
    implements: implemented,
    unscanned: (ev.unscanned || []).join(' | '),
    commentOnly: encode(ev.commentOnly || []),
    protocolPartial: encode(ev.protocolPartial || []),
    references: ev.references.length ? ev.references.join(' | ') : '',
    attacks: ev.attacks.length ? encode(ev.attacks) : '',
    standards: ev.standards.length ? ev.standards.join(' | ') : '',
    implementation: ev.implementation,
    reviewCommit: ev.reviewed?.commit || '',
    reviewNote: ev.reviewed?.note || '',
  };
}

/* ---- modes ---------------------------------------------------------------- */

/* Which labs were read from committed HEAD rather than from their working tree,
   printed on every run. A generator that quietly substituted its source would be
   the same silence it exists to prevent. */
function printCloneSource() {
  const torn = tornSnapshot();
  if (torn.length) {
    console.error(`TORN SNAPSHOT (${torn.length}) — these clones were CLEAN when this run read them and are`);
    console.error('dirty now, so the bytes above are a mix of two states. Re-run once the other lane settles;');
    console.error('do not commit generated output from this run.');
    for (const t of torn) console.error(`  ${t.slug.padEnd(34)} ${t.dirty} path(s) changed mid-run`);
  }
  const cs = cloneSummary();
  if (cs.fromHead.length) {
    console.log(`Read from committed HEAD, working tree dirty (${cs.fromHead.length}): `
      + cs.fromHead.map((x) => `${x.slug.replace('crypto-lab-', '')} (${x.dirty})`).join(', '));
  }
  if (cs.refused.length) {
    console.log(`REFUSED, dirty and HEAD unreadable (${cs.refused.length}): `
      + cs.refused.map((x) => x.slug.replace('crypto-lab-', '')).join(', '));
  }
}

function writeCards(all) {
  let html = fs.readFileSync(HTML, 'utf8');
  let changed = 0;
  /* SKIP THE LABS WHOSE PINS ARE STALE; WRITE EVERY OTHER LAB.
   *
   * The guard exists to stop a person's recorded add and remove lists being
   * applied to source that has since changed. Skipping does exactly that: a
   * stale-pinned lab's card is not rewritten, so it stays byte-identical and
   * keeps the state that person last reviewed.
   *
   * What it no longer does is refuse to update labs the guard has no view on.
   * That was never a policy - it was a throw inside evidenceFor, so the first
   * stale lab in CARD ORDER aborted the whole pass and nothing was written at
   * all. The cost was not theoretical: five cards credited Shamir secret sharing
   * on the strength of Fiat-Shamir, the vocabulary had already been narrowed to
   * exclude that, none of those five labs carried a pin, and the correction sat
   * blocked behind unrelated labs awaiting a person's re-review.
   *
   * The run still exits non-zero, so the pass completes AND stays red: skipped
   * work is reported rather than quietly dropped. */
  /* Named and skipped, never thrown: a note that would corrupt a card corrupts
     only THAT card, so refusing the whole pass would be the global-failure-mode
     defect the comment above was written for, re-introduced one guard later. */
  const corrupting = [];
  const stale = all.filter((c) => c.ev.staleReview);
  /* A malformed review is skipped for the same reason a stale pin is: its
     recorded edits must not be half-applied. Named below, never silent. */
  const malformed = all.filter((c) => c.ev.invalidReview);
  const writable = all.filter((c) => !c.ev.staleReview && !c.ev.invalidReview);
  for (const c of writable) {
    const f = fieldsFor(c.ev);
    /* data-overlaps is NOT touched: it is the one judged field, and a difference
       between two labs is not derivable from either lab's source. */
    const parts = [
      `data-implements="${f.implements}"`,
      f.unscanned ? `data-unscanned="${f.unscanned}"` : null,
      f.commentOnly ? `data-comment-only="${f.commentOnly}"` : null,
      f.protocolPartial ? `data-protocol-partial="${f.protocolPartial}"` : null,
      f.references ? `data-references="${f.references}"` : null,
      f.attacks ? `data-attacks="${f.attacks}"` : null,
      f.standards ? `data-standards="${f.standards}"` : null,
      `data-implementation="${f.implementation}"`,
      f.reviewCommit ? `data-review-commit="${f.reviewCommit}"` : null,
      f.reviewNote ? `data-review-note="${f.reviewNote}"` : null,
    ].filter(Boolean);
    /* A `>` in a review note silently corrupts the card, so refuse it here
       rather than write it.
       `lab-dates.js` and `level-sync.js` both capture a card's opening tag as
       `href="..."([^>]*)(>)`, which ends at the FIRST `>`. One inside this
       attribute therefore truncates the tag they think they are looking at: the
       attributes that really follow — data-added, data-updated, data-level —
       fall outside the match, so neither writer sees its own attribute, neither
       strips it, and each adds a second copy. Observed 2026-10-15 on
       crypto-lab-pq-chooser from a note containing `cfe96fd -> 416ef46`, after
       which `level-sync check` reported `card says no level` about a card
       carrying two of them: a checker reading a truncated copy of its subject
       and publishing the gap as a fact about it, which is the one shape this
       repository refuses everywhere else.
       Escaping to `&gt;` was the alternative and is worse: the note is read back
       out of the card by other tools, which would then carry the entity. House
       style already writes ranges as `a to b`, and every other note in
       tools/catalog-reviewed.json obeys it. `<` is left alone deliberately — it
       does not terminate these matches, and crypto-lab-vector-gate's `S < L`
       is a real part of what that review established. */
    /* A `"` is the same defect one character worse: it does not truncate the
       tag, it closes THIS attribute, so everything after it in the note is
       parsed as further attributes on the anchor. The refusal is extended
       rather than an escape added, for the reason above: the note is read back
       out of the card by other tools, which would carry the entity. No note in
       tools/catalog-reviewed.json contains one today — a proposed re-review of
       crypto-lab-pq-families on 2026-11-08 carried fourteen, which is how the
       gap in this guard was found. House style quotes with ` ` or nothing. */
    const unwritable = [...new Set([...(f.reviewNote || '')].filter((ch) => ch === '>' || ch === '"'))];
    if (unwritable.length) { corrupting.push({ slug: c.slug, characters: unwritable }); continue; }
    const next = applyDerived(c.block, c.slug, parts);
    if (next !== c.block) { html = html.replace(c.block, next); changed += 1; }
  }
  fs.writeFileSync(HTML, html);
  if (malformed.length) {
    console.error(`\nINVALID-REVIEW (${malformed.length}) — the entry in tools/catalog-reviewed.json does not`);
    console.error('parse, so this lab\'s recorded add and remove lists were NOT applied and its card is');
    console.error('byte-identical. Every other lab in this run was derived as usual (see #129: this');
    console.error('guard used to throw from inside the fleet-wide map and derive nothing for anyone).');
    for (const c of malformed) {
      for (const why of c.ev.invalidReview) console.error(`  ${c.slug.padEnd(34)} ${why}`);
    }
    process.exitCode = 1;
  }
  if (corrupting.length) {
    console.error(`\nREVIEW-NOTE-UNWRITABLE (${corrupting.length}) — the note in tools/catalog-reviewed.json`);
    console.error('contains a character that cannot be written into the card. ">" ends the card\'s');
    console.error('opening tag early for lab-dates.js and level-sync.js (both capture it as');
    console.error('`href="..."([^>]*)(>)`): they would then miss the data-added / data-updated /');
    console.error('data-level that really follow and add a second copy of each. A \'"\' closes the');
    console.error('data-review-note attribute itself, so the rest of the note is parsed as more');
    console.error('attributes. These cards were left byte-identical. Write the range as "a to b" and');
    console.error('quote with ` ` or not at all:');
    for (const { slug, characters } of corrupting) console.error(`  ${slug.padEnd(34)} ${characters.map((ch) => JSON.stringify(ch)).join(' ')}`);
    process.exitCode = 1;
  }
  printCloneSource();
  /* Print every protocol-partial ruling on every run. A supplement whose whole
     content is a judgement about a false positive must stay visible, or it
     becomes a quiet way to delete findings: the reason is in the pin file, and
     this is where a reader of the run sees that one was applied at all. */
  const ruledPartials = all.flatMap((c) => (c.ev.ruledProtocolPartial || []).map((r) => ({ slug: c.slug, ...r })));
  if (ruledPartials.length) {
    console.log(`\nPARTIAL-RULED (${ruledPartials.length}) — protocol-shape observations a pinned review found false.`);
    console.log('  Not a failure, and not a credit: the term is NOT claimed for these labs.');
    for (const r of ruledPartials) {
      console.log(`  ${r.slug.padEnd(32)} ${r.name}`);
      console.log(`      ${r.reason.length > 150 ? `${r.reason.slice(0, 150)}…` : r.reason}`);
    }
  }
  /* Print every observation a `remove` is carrying, on every run, for the same
     reason PARTIAL-RULED is printed: a supplement that settles a finding must
     stay visible, or it becomes a quiet way to delete one. These are NOT
     credits -- the term remains unclaimed for these labs. */
  const settled = all.flatMap((c) => (c.ev.removeSettledCommentOnly || []).map((r) => ({ slug: c.slug, ...r })));
  if (settled.length) {
    console.log(`\nREMOVE-SETTLED (${settled.length}) — comment-only observations carried by a \`remove\` on the`);
    console.log('  same pin, which already records that the lab does not implement the name the prose');
    console.log('  mentions. Not a failure and not a credit; the reason is the pin\'s own.');
    for (const r of settled) console.log(`  ${r.slug.padEnd(32)} ${r.name}@${r.at}`);
  }
  console.log(`index.html: derived fields written to ${changed} cards.`);
  if (tornSnapshot().length) process.exitCode = 1;
  const unreadablePins = stale.filter((c) => c.ev.staleReview.unreadable);
  const reallyStale = stale.filter((c) => !c.ev.staleReview.unreadable);
  if (unreadablePins.length) {
    console.log(`\nPIN-UNREADABLE (${unreadablePins.length}) — the pinned commit is absent from a SHALLOW clone,`);
    console.log('  so whether the lab moved could not be asked. Their cards are left byte-identical and their');
    console.log('  recorded edits unapplied, the same as a stale pin — but none of these is a re-review queue.');
    for (const c of unreadablePins) {
      console.log(`  ${c.slug.padEnd(32)} pinned ${c.ev.staleReview.pinned.slice(0, 12)} — not in this clone`);
    }
    console.log('Fetch the pinned commits (`git -C ../<lab> fetch --depth 1 origin <pin>`) and re-run.');
    process.exitCode = 1;
  }
  if (reallyStale.length) {
    const stale = reallyStale;
    const today = new Date();
    const aged = stale.map((c) => {
      const d = REVIEWS[c.slug] && REVIEWS[c.slug].reviewed;
      return { c, days: d ? Math.floor((today - Date.parse(`${d}T00:00:00Z`)) / 86400000) : null, on: d };
    }).sort((a, b) => (b.days ?? -1) - (a.days ?? -1));
    console.log(`\nSTALE-REVIEW (${stale.length}) — left untouched, byte-identical, holding the state each was last reviewed in. Oldest first:`);
    for (const a of aged) {
      const drift = a.c.ev && a.c.ev.staleReview && a.c.ev.staleReview.refDrift;
      /* A pin the path rule calls fresh is here because its RESULT changed, and
         the names are the whole finding: without them this line sends a person
         to re-read a lab without saying what to look for. */
      const why = drift
        ? `  — references moved${drift.added.length ? `, added ${drift.added.join(', ')}` : ''}${drift.dropped.length ? `, dropped ${drift.dropped.join(', ')}` : ''}`
        : '';
      console.log(`  ${a.days === null ? '  undated' : `${String(a.days).padStart(4)}d`}  ${a.c.slug.padEnd(32)} reviewed ${a.on || '(no date)'}${why}`);
    }
    console.log('Re-read those labs and update their pins in tools/catalog-reviewed.json.');
    console.log('Exiting non-zero: the rest of the catalog is written, and this stays red until they are cleared.');
    process.exitCode = 1;
  }
}

/** The lab's ACTUAL head, read from the remote without fetching.
 *
 * The staleness check used to compare a pin against `git rev-parse HEAD` in the
 * local clone, and a clone nobody fetched is not the lab. Every one of the
 * eighteen pins it reported stale turned out to match its lab's real main
 * exactly; what had moved was the working copy. That is this repository's
 * recurring defect wearing yet another coat - a checker reading whatever was
 * convenient rather than the thing the question is about - and it had produced a
 * re-review queue with nothing in it.
 *
 * Returns null when the remote cannot be read, which is reported as unreadable
 * rather than as a stale pin.
 */
function remoteHeadOf(dir) {
  try {
    const out = execFileSync('git', ['-C', dir, 'ls-remote', 'origin', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const sha = out.trim().split(/\s+/)[0];
    return /^[0-9a-f]{40}$/.test(sha) ? sha : null;
  } catch { return null; }
}

/*
 * DISCLAIMED ANCHORS.
 *
 * A derived credit is supposed to point at the code that does the thing. These
 * pointed at sentences saying the thing is NOT done:
 *
 *   crypto-lab-kem-trap     Timing side-channel  -> "named and linked, not executed here"
 *   crypto-lab-bike-vault   Fault injection      -> a citation the lab "does not reproduce"
 *   crypto-lab-fhe-arena    Chosen-plaintext     -> "not a proof of semantic security"
 *   crypto-lab-pq-families  Fault injection      -> a list of implementation pitfalls
 *   crypto-lab-card-trick   Brute force          -> "a GENERIC, ILLUSTRATIVE bound"
 *
 * Eleven credits across nine labs, found by sweeping every anchor line in the
 * catalog on 2026-11-08. Twelve were removed; one was declared. The scanner is
 * matching an attack NAME in prose written to disclaim the attack, which is the
 * exact false-claim shape the anchor rule exists to prevent, one level down.
 *
 * The rule is DISCLAIMER, not prose. "The anchor line is prose" would also fire
 * on crypto-lab-ot-gate, whose Chou-Orlandi OT is real and whose only written
 * occurrence of the term is a UI string -- the irreducible
 * unnamed-implementation class, where re-anchoring is forbidden and removal
 * would delete a true credit. A phrase that says the thing is not done is always
 * wrong under the credit; prose that merely names what the lab really does is the
 * documented ceiling. Dispositions live in tools/anchor-dispositions.json.
 */
const DISCLAIMERS = [
  'not reproduced', 'does not reproduce', 'does not establish', 'not demonstrated',
  'does not provide', 'not simulated', 'not executed here', 'not executed',
  'does not execute', 'does not perform', 'not performed', 'not a proof',
  'does not implement', 'illustrative bound', 'not a measured',
  'cited here, not', 'neither this', 'is not a break', 'not an attack',
];

function anchorDispositions() {
  const file = path.join(__dirname, 'anchor-dispositions.json');
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`tools/anchor-dispositions.json is unreadable (${error.message.split('\n')[0]}), so which disclaimed anchors were ruled is undefined`);
  }
  if (!Array.isArray(parsed.dispositions)) {
    throw new Error('tools/anchor-dispositions.json declares no dispositions array');
  }
  return new Map(parsed.dispositions.map((d) => [`${d.repo} ${d.term} ${d.anchor}`, d]));
}

/** The disclaimer phrases on a line, or [] when it makes no such denial. */
function disclaimersIn(line) {
  const low = String(line).toLowerCase();
  return DISCLAIMERS.filter((d) => low.includes(d));
}

/*
 * Declared clone holds. CLONE-BEHIND is a FAILURE for every lab, which is the
 * point of it -- but one clone is deliberately held at an older commit on the
 * owner's instruction, and a check that cannot express that would either stay
 * permanently red or get skipped quietly. Declared, named and printed, with the
 * hold's own reason, so a green verify still means what it says. An unnecessary
 * hold is reported too: a file of permanent exemptions nobody re-reads is the
 * thing this repository keeps warning about.
 */
function cloneHolds() {
  const file = path.join(__dirname, 'clone-holds.json');
  const read = lookupOrReport('tools/clone-holds.json is readable', () => {
    const d = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(d.holds) ? d : null;
  });
  if (!read.readable || !read.match) {
    /* Undefined rather than empty: an unreadable hold list must not silently
       turn every hold into a failure, nor every failure into a hold. */
    throw new Error('tools/clone-holds.json is unreadable, so which clones are held is undefined');
  }
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  return new Map(d.holds.map((h) => [h.repo, h]));
}

/*
 * A git VALUE, with could-not-look kept separate from the value itself.
 *
 * Not `lookupOrReport`: that returns a three-way VERDICT -- {state, why, match,
 * readable} -- and carries no value, because it answers "is it there". Using it
 * to fetch a sha read `.value` as undefined and reported all 252 labs UNREADABLE
 * on the first run of this check. The mistake was loud, which is the apparatus
 * working; it is still the wrong helper for the job.
 */
function gitValue(dir, args) {
  try {
    const out = execFileSync('git', ['-C', dir, ...args],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return out ? { value: out, readable: true } : { value: null, readable: false, why: 'git printed nothing' };
  } catch (error) {
    return { value: null, readable: false, why: error.message.split('\n')[0] };
  }
}

/*
 * Remote heads for MANY clones at once.
 *
 * `remoteHeadOf` costs about 0.39 seconds on this network, and the currency
 * check below now runs for all 252 carded labs rather than the 121 with a pin.
 * Serially that is 98 seconds added to every verify, which is the kind of cost
 * that gets a check disabled. One subprocess with `xargs -P` makes it about ten.
 */
function remoteHeadsOf(dirs) {
  /* The fan-out lives in tools/remote-heads.js, run as one child process so
     this stays synchronous for its callers. It used to be an
     `xargs -P 12 -I{} sh -c ...` pipeline, which is correct on a GitHub runner
     and silently total-failure anywhere the paths are longer: BSD xargs caps
     the assembled command at -S bytes (255 by default) and `-I{}` substitutes
     three times, so a 140-character checkout path makes xargs exit with
     "command line cannot be assembled, too long" and print nothing. Every
     remote then read as unreadable and verify reported UNREADABLE for all 252
     labs. See that file's header for the measurement.

     Unchanged: a head that cannot be read is null, and null is UNREADABLE. */
  const out = new Map();
  if (!dirs.length) return out;
  const helper = path.join(__dirname, 'remote-heads.js');
  const r = spawnSync(process.execPath, [helper],
                      { input: dirs.join('\n'), encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.error || typeof r.stdout !== 'string') return out;
  for (const line of r.stdout.split('\n')) {
    if (!line) continue;
    const [dir, sha] = line.split('\t');
    out.set(dir, /^[0-9a-f]{40}$/.test(sha || '') ? sha : null);
  }
  return out;
}

/*
 * Is this checkout the lab, or a copy of an older lab?
 *
 * THIS USED TO BE ASKED ONLY OF PINNED LABS, and that is the defect it now
 * closes. The old test lived inside `if (review)` and fired on two conditions:
 * the remote revision unfetched, or the pin matching the remote while the
 * checkout sat elsewhere. After a plain `git fetch` neither holds -- the remote
 * object is present and the pin is older than both -- so a reviewed lab whose
 * remote had moved while its clone stood still was reported NEITHER behind nor
 * stale. Measured 2026-11-08: a fleet-wide fetch left 113 clones behind their
 * remotes, 29 of them carrying a source review and 9 of those with the pin
 * matching the stale clone HEAD, and `catalog-evidence verify` exited 0 about
 * all of them. A lab with no pin at all was never asked the question.
 *
 * So it is asked of every card, and the answer is a FAILURE rather than a
 * warning: a green verify has to describe the labs, not the copies on disk.
 *
 * It does not run `git fetch`. Three agents share these checkouts, and fetching
 * 252 of them would write to repositories other lanes are working in. `ls-remote`
 * asks the remote the same question without touching the object store, and
 * ancestry answers it: if the remote revision is already local, count the commits
 * between; if it is not, the clone has not seen it and is behind by construction.
 * AHEAD is its own state rather than folded into behind, because a clone with
 * unpushed work is a different problem from a stale one.
 */
function cloneCurrency(dir, head, remote) {
  if (!head) return { state: 'could-not-look', why: 'HEAD is unreadable' };
  if (remote === null) return { state: 'could-not-look', why: 'the remote did not answer ls-remote' };
  if (remote === head) return { state: 'current', behind: 0 };
  if (!hasCommit(dir, remote)) {
    return { state: 'behind', behind: null, why: 'the remote revision is not in this checkout' };
  }
  const n = gitValue(dir, ['rev-list', '--count', `${head}..${remote}`]);
  if (!n.readable) return { state: 'could-not-look', why: n.why };
  const count = Number(n.value);
  if (!Number.isFinite(count)) return { state: 'could-not-look', why: `rev-list printed ${n.value}` };
  if (count > 0) return { state: 'behind', behind: count };
  return { state: 'ahead-or-diverged', behind: 0 };
}

/* The terms an anchor may name: BOTH vocabularies, because a card carries
   both anchored fields. `data-implements` names ALGORITHMS and `data-attacks`
   names ATTACKS, and on 2026-09-30 the verifier started reading the second
   field (#66) while still building this map from the first alone. Every
   attack anchor in the catalog - 618 of them - came back "not a vocabulary
   term" in one run: rot that was not there, reported fluently, one week before
   the fleet job would have filed it as such. The map is built in one place so
   the deriver and the verifier cannot disagree about what a name may be. */
/* ─────────────────────────────── pin ranges ─────────────────────────────────
 * A pin reason used to be prose, and prose is where a false one hides. On
 * 2026-11-05 a pin on crypto-lab-kem-trap was written "only the
 * npm-minor-and-patch group bump moved; no file under src/ changed" from the
 * commit SUBJECT of a grouped bump, while the same range also carried a rewrite
 * of a displayed attack note and added an HPKE reference credit. Nothing could
 * have caught it: the reason named no range and the checker never opened one.
 *
 * So a pin now declares the range it was read over, `<from40>..<to40>`, and its
 * `reason` must NAME every path under src/ that `git diff --name-only` reports
 * across that range. The reason is still written by a person -- what the change
 * MEANS is not derivable -- but the FILE LIST is derived, so a reason that
 * silently omits a changed source file fails here instead of being believed.
 *
 * Three refusals rather than one, because they are different mistakes:
 *   no range                        nothing was declared as read
 *   range does not end at the pin   the declared range is not the pinned state
 *   a changed src/ file unnamed     the reason does not cover what moved
 *
 * A range the clone cannot resolve is UNREADABLE and is reported as such. "Could
 * not look" is never a finding about the lab -- the same rule as PIN-UNREADABLE
 * above, and the reason this returns a kind rather than a boolean.
 */
const RANGE_RE = /^([0-9a-f]{40})\.\.([0-9a-f]{40})$/;

function pinRangeProblems(slug, review, dir) {
  const out = [];
  if (!review.range) {
    out.push({ kind: 'NO-RANGE', why: 'the pin declares no reviewed range; add "range": "<from40>..<to40>"' });
    return out;
  }
  const m = RANGE_RE.exec(review.range);
  if (!m) {
    out.push({ kind: 'BAD-RANGE', why: `range ${review.range} is not <40 hex>..<40 hex>` });
    return out;
  }
  const [, from, to] = m;
  if (to !== review.commit) {
    out.push({
      kind: 'RANGE-END',
      why: `range ends at ${to.slice(0, 12)} but the pin is ${review.commit.slice(0, 12)}; the declared range is not the pinned state`,
    });
    return out;
  }
  if (from === to) return out;          // a first pin: nothing before it to diff
  let changed;
  try {
    changed = execFileSync('git', ['-C', dir, 'diff', '--name-only', `${from}..${to}`], { encoding: 'utf8' })
      .split('\n').map((s) => s.trim()).filter(Boolean);
  } catch {
    out.push({ kind: 'RANGE-UNREADABLE', why: `${from.slice(0, 12)}..${to.slice(0, 12)} cannot be diffed in this clone` });
    return out;
  }
  const reason = String(review.reason || '');
  /* `startsWith('src/')` reached only a top-level src/. Five reviewed labs keep
     their implementation somewhere else — demos/<lab>/src/ for collision-vault,
     babel-hash, sphincs-ledger and dead-sea-cipher, crates/<crate>/src/ for
     quantum-vault-kpqc — so for them this check passed over every source file
     the range touched and could never report an incomplete reason. Measured
     2026-11-08: three of the five carry a reason that names none of them.
     A src/ component anywhere is the lab's own source, which is the subject of
     the rule. This is the same defect as reading a lab's TypeScript when its
     crypto is Rust behind WASM: the checker read `src/` rather than the lab. */
  const unnamed = changed.filter((f) => /(^|\/)src\//.test(f) && !reason.includes(f));
  if (unnamed.length) {
    out.push({
      kind: 'REASON-INCOMPLETE',
      why: `${unnamed.length} changed file(s) under src/ are not named in the reason: ${unnamed.slice(0, 6).join(', ')}`
        + `${unnamed.length > 6 ? ` and ${unnamed.length - 6} more` : ''}`,
    });
  }
  return out;
}

function verifyTerms() {
  return new Map([...ALGORITHMS, ...ATTACKS].map((t) => [t.name, t]));
}

/* One anchor, judged. Pure: the caller has already resolved the file and read
   the line, so a fixture can drive this with no clone and no network, and the
   selftest can replay the algorithm-only map above and watch it fail. Returns
   null when the anchor holds, else the reason it does not. */
function judgeAnchor({ name, file, lineNo, line, terms, wide }) {
  const term = terms.get(name);
  if (!term) return 'not a vocabulary term';
  /* The evidence is the line OR the path, because that is how it was
     derived: src/gost/aes.ts names AES on every line of it, and the anchor
     points at the first declaration in the file rather than at a line
     repeating the word. Checking only the line called 242 freshly written
     anchors stale — a verifier stricter than the deriver, which reports
     rot that is not there and teaches people to ignore it. */
  const pathRx = term.pathRe || term.re;
  /* The line, the path, OR one of the protocol's own message structures -
     the three ways the deriver can establish a term. A protocol anchor
     points at `export interface ClientHello`, which does not contain the
     string "TLS 1.3" and never will. This is the second time a verifier has
     been written stricter than the deriver that fed it; both times the
     symptom was freshly written anchors reported as rot. */
  /* …or the lines the anchored call SPANS, under the same condition shapeOf
     uses to read them. The deriver anchors a multi-line `crypto.subtle.X(` at
     the call, whose own line names no algorithm, so checking the line alone
     called 70 freshly written anchors stale. That is the THIRD time a verifier
     here has been written stricter than the deriver that fed it, and all three
     times the symptom was identical: new anchors reported as rot. The condition
     is copied deliberately rather than loosened - a verifier that accepted any
     nearby line would stop checking the anchor at all. */
  const view = wide && /crypto\.subtle\.\w+\s*\($/.test(line.trim()) ? wide : line;
  const named = namesTerm(view, camelSplit(view), term)
    || pathRx.test(file) || pathRx.test(camelSplit(file))
    || structuresNamed(line, term).length > 0;
  return named ? null : `neither line ${lineNo} nor the path names it`;
}

function verifyAnchors(all) {
  const bad = [];
  const unreadable = [];
  const behind = [];
  /* A clone with commits the remote does not have is a different problem from a
     stale one -- unpushed work, or a lane left mid-rebase -- so it is its own
     state rather than folded into behind. */
  const diverged = [];
  /* Declared holds, kept apart from behind so the failure stays meaningful and
     the exception stays visible. */
  const held = [];
  const holds = cloneHolds();
  /* Credits anchored on a sentence that denies them, and the ones a review has
     ruled. Both are collected so the ruled ones are PRINTED rather than skipped. */
  const disclaimed = [];
  const ruledAnchors = [];
  const dispositions = anchorDispositions();
  const shallowPins = [];
  const rangeBad = [];
  let checked = 0;
  const byName = verifyTerms();

  /* Currency is asked of EVERY carded lab, pinned or not, and in one batch.
     Asking it only of pinned labs is what let 29 reviewed labs -- and every
     unpinned one -- sit behind their remotes under a green exit; see
     cloneCurrency's header for the measurement. */
  const dirOf = new Map(all.map((c) => [c.slug, path.join(REPOS, c.slug)]));
  const readable = [...dirOf.values()].filter((d) => fs.existsSync(path.join(d, '.git')));
  const remoteHeads = remoteHeadsOf(readable);
  const headOf = new Map();
  for (const d of readable) {
    const h = gitValue(d, ['rev-parse', 'HEAD']);
    headOf.set(d, h.readable ? h.value : null);
  }

  for (const c of all) {
    const dir = dirOf.get(c.slug);
    const hasGit = fs.existsSync(path.join(dir, '.git'));
    const head = hasGit ? headOf.get(dir) : null;
    const remote = hasGit && remoteHeads.has(dir) ? remoteHeads.get(dir) : null;
    let currency = { state: 'could-not-look', why: 'no checkout' };
    if (hasGit) {
      currency = cloneCurrency(dir, head, remote);
      if (currency.state === 'behind') {
        const hold = holds.get(c.slug);
        if (hold) held.push({ slug: c.slug, clone: head, actual: remote, by: currency.behind, reason: hold.reason });
        else behind.push({ slug: c.slug, clone: head, actual: remote, by: currency.behind });
      } else if (holds.has(c.slug) && currency.state === 'current') {
        /* A hold is about a WORKING CHECKOUT somebody asked to leave alone, so
           "this clone is current, remove the entry" only means something where
           the clone could have been behind. In CI it never can: fleet.yml makes
           every clone with `git clone --depth 1`, so the clone is at the remote
           head by construction and EVERY hold would read unnecessary on every
           run, for ever. Advice that is always wrong in the environment that
           prints it trains people to ignore the section it sits in.
           Shallowness is the honest detector: a depth-1 clone is the fresh kind.
           The hold itself is still reported, with its reason -- only the
           remove-the-entry advice is withheld, and it says why. */
        const shallow = isShallowState(dir);
        held.push({
          slug: c.slug, clone: head, actual: remote, by: 0, reason: holds.get(c.slug).reason,
          unnecessary: shallow.readable ? !shallow.match : false,
          freshByConstruction: shallow.readable ? shallow.match : false,
          shallowUnreadable: !shallow.readable,
        });
      } else if (currency.state === 'ahead-or-diverged') {
        diverged.push({ slug: c.slug, clone: head, actual: remote });
      } else if (currency.state === 'could-not-look') {
        if (!unreadable.includes(c.slug)) unreadable.push(c.slug);
      }
    } else if (!unreadable.includes(c.slug)) {
      unreadable.push(c.slug);
    }

    const review = REVIEWS[c.slug];
    if (review) {
      if (!review.reviewed) {
        bad.push({ slug: c.slug, item: 'source review', why: 'no "reviewed" date recorded, so this pin cannot be aged' });
      }
      if (hasGit && remote !== null) {
        /* The declared range is a property of the PIN, not of where the lab's head
           happens to be, so it is judged for every pin with a readable clone. The
           first version asked only when `remote === review.commit` and covered 37
           of 119 pins: every lab whose remote had moved by a dependency bump --
           most of them -- went unchecked. That is the discovered-denominator
           defect this file keeps re-finding, found here in a check written to
           prevent a related one. The helper reports RANGE-UNREADABLE when it
           cannot diff, so a shallow clone is a state and not a pass. */
        if (remote !== null && !cloneNeedsFetch(dir, review.commit, head, remote)) {
          for (const p of pinRangeProblems(c.slug, review, dir)) rangeBad.push({ slug: c.slug, ...p });
        }
        if (remote !== null && !cloneNeedsFetch(dir, review.commit, head, remote) && remote !== review.commit) {
          /* Same substantive scope as the derivation above and as
             corpus-freshness: only README.md or src/ invalidates a source review.
             A shallow clone cannot answer the question at all, and says so as its
             own state rather than as a claim that this lab needs re-reading. */
          const movement = movedSubstantively(dir, review.commit, remote, c.slug);
          if (movement === 'unreadable') {
            shallowPins.push({ slug: c.slug, pinned: review.commit, remote });
          } else if (movement === 'moved') {
            bad.push({
              slug: c.slug,
              item: 'source review',
              why: `reviewed ${review.commit.slice(0, 12)}, lab is now ${remote.slice(0, 12)}; re-review and update the pin`,
            });
          } else {
            /* The result rule, asked here too. A verifier that called a pin fresh
               while the writer refused to apply it would be the two-readers defect
               this file keeps re-finding, with the disagreement invisible until a
               card silently stopped carrying a correction. */
            const drift = referenceDrift(c.slug, dir, review.commit, remote);
            if (drift) {
              bad.push({
                slug: c.slug,
                item: 'source review',
                why: `reviewed ${review.commit.slice(0, 12)}, lab is now ${remote.slice(0, 12)}; no README/src change, but the derived references moved`
                  + `${drift.added.length ? ` — added ${drift.added.join(', ')}` : ''}`
                  + `${drift.dropped.length ? ` — dropped ${drift.dropped.join(', ')}` : ''}; re-review and update the pin`,
              });
            }
          }
        }
      }
    }
    /* No clone here means this pass could not look, and every anchor it would
       have checked is unreadable for one reason rather than missing for many.
       Reporting "file is gone" per anchor claims something about files nobody
       opened - the UNKNOWN-versus-NOT-SCANNED conflation one layer up, in the
       verifier this time. Say it once, and move on. */
    if (!fs.existsSync(path.join(REPOS, c.slug, '.git'))) {
      if (attr(c.block, 'implements') && !['UNKNOWN', 'NOT-SCANNED', 'N/A'].includes(attr(c.block, 'implements'))) {
        unreadable.push(c.slug);
      }
      continue;
    }
    /* Both anchored fields, not just one. `data-attacks` carries `Name@file:line`
       exactly as `data-implements` does, and nothing checked it: the 19
       CRYPTO-LAB-TEMPLATE.md anchors that prompted this work were all in
       data-attacks, invisible to a verifier that only ever read implements. */
    const stored = ['implements', 'attacks']
      .map((f) => attr(c.block, f))
      .filter((v) => v && !['UNKNOWN', 'NOT-SCANNED', 'N/A'].includes(v))
      .join(' | ');
    if (!stored) continue;
    for (const item of stored.split(' | ')) {
      const at = item.indexOf('@');
      if (at < 0) { bad.push({ slug: c.slug, item, why: 'no anchor' }); continue; }
      const name = item.slice(0, at);
      const [file, lineNo] = item.slice(at + 1).split(':');
      const vsrc = sourceRoot(path.join(REPOS, c.slug));
      const full = path.join(vsrc.root || path.join(REPOS, c.slug), file);
      checked += 1;
      /* An anchor into a file the repository does not track is not an anchor.
         It resolves on a machine where someone left that file lying about and
         fails on a fresh clone, which is the opposite of what an anchor is for.
         Checked before existence, because the gitignored case EXISTS on disk. */
      const tracked = isTracked(path.join(REPOS, c.slug), file);
      if (tracked === false) { bad.push({ slug: c.slug, item, why: 'anchored into a file git does not track' }); continue; }
      if (!fs.existsSync(full)) { bad.push({ slug: c.slug, item, why: 'file is gone' }); continue; }
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      const line = lines[Number(lineNo) - 1];
      if (line === undefined) { bad.push({ slug: c.slug, item, why: `file has only ${lines.length} lines` }); continue; }
      /* The anchor resolves; does the line DENY the thing it is credited with?
         Checked here because this is where the line is already in hand. */
      const denials = disclaimersIn(line);
      if (denials.length) {
        const ruled = dispositions.get(`${c.slug} ${name} ${file}:${lineNo}`);
        if (ruled) ruledAnchors.push({ slug: c.slug, item, reason: ruled.reason });
        else disclaimed.push({ slug: c.slug, item, denials, line: line.trim().slice(0, 120) });
      }
      // A reviewed anchor may name the implementing operation generically
      // (generate_shares, for example). Its source commit was checked above;
      // keep the exact line alive without pretending a name grep proved it.
      if (isReviewedAdd(REVIEWS[c.slug], item)) {
        if (!line.trim()) bad.push({ slug: c.slug, item, why: 'reviewed line is blank' });
        continue;
      }
      const why = judgeAnchor({
        name, file, lineNo, line, terms: byName,
        wide: lines.slice(Number(lineNo) - 1, Number(lineNo) + 4).join(' '),
      });
      if (why) bad.push({ slug: c.slug, item, why });
    }
  }
  /* Reported under NAMED MARKERS, one per class, because the weekly runner reads
     markers to tell a decided-on state from a surprise. Folded into one count,
     twenty pins awaiting a person's re-review would sit in the same list as an
     anchor that silently rotted, and the second would be read as routine. */
  /* Stale pins are AGED and sorted oldest first. A red exit seen every week says
     the same thing every week; a number that grows says how long it has been
     ignored, which is the part a weekly issue can carry and an exit code cannot.
     The age comes from the `reviewed` date recorded beside each pin, so this
     needs no network and cannot drift from the pin it describes. */
  const today = new Date();
  const ageOf = (slug) => {
    const d = REVIEWS[slug] && REVIEWS[slug].reviewed;
    if (!d) return null;
    return Math.floor((today - Date.parse(`${d}T00:00:00Z`)) / 86400000);
  };
  const staleReviews = bad.filter((b) => b.item === 'source review')
    .map((b) => ({ ...b, days: ageOf(b.slug) }))
    .sort((a, b) => (b.days ?? -1) - (a.days ?? -1));
  const staleAnchors = bad.filter((b) => b.item !== 'source review');
  printCloneSource();
  console.log(`Anchors checked: ${checked}.\n`);
  if (shallowPins.length) {
    console.log(`PIN-UNREADABLE (${shallowPins.length}) — the pinned commit is NOT IN THIS CLONE and the clone`);
    console.log('  is shallow, so whether the lab moved could not be asked. This is a finding about the');
    console.log('  checkout, never about the lab: none of these is a re-review queue. Clear it by fetching');
    console.log('  the pinned commits — `git -C ../<lab> fetch --depth 1 origin <pin>` — or by cloning deeper.');
    for (const p of shallowPins) {
      console.log(`  ${p.slug.padEnd(32)} pinned ${p.pinned.slice(0, 12)}, remote ${p.remote.slice(0, 12)} — absent here`);
    }
    console.log('');
  }
  if (staleReviews.length) {
    const oldest = staleReviews[0].days;
    console.log(`STALE-REVIEW (${staleReviews.length}) — oldest ${oldest === null ? 'undated' : `${oldest} days`}; `
      + 'the lab moved since a person reviewed it, so the pin needs a person again. Oldest first.');
    for (const b of staleReviews) {
      const age = b.days === null ? '  undated' : `${String(b.days).padStart(4)}d`;
      const on = REVIEWS[b.slug] && REVIEWS[b.slug].reviewed;
      console.log(`  ${age}  ${b.slug.padEnd(32)} reviewed ${on || '(no date recorded)'} — ${b.why}`);
    }
    console.log('');
  }
  if (staleAnchors.length) {
    console.log(`STALE-ANCHOR (${staleAnchors.length}) — a line number that no longer resolves.`);
    for (const b of staleAnchors) console.log(`  ${b.slug.padEnd(34)} ${b.item}  — ${b.why}`);
    console.log('');
  }
  const rangeUnreadable = rangeBad.filter((r) => r.kind === 'RANGE-UNREADABLE');
  const rangeFail = rangeBad.filter((r) => r.kind !== 'RANGE-UNREADABLE');
  if (rangeFail.length) {
    console.log(`PIN-RANGE (${rangeFail.length}) — a pin whose declared reviewed range is missing, does not end at`);
    console.log('the pinned commit, or whose reason does not name a file under src/ that the range changed.');
    console.log('The file list is DERIVED from git diff --name-only over the range; what the change means is');
    console.log('still a person\'s to write. A reason taken from a commit subject is how a false one landed');
    console.log('on 2026-11-05, which is why this is checked rather than promised.');
    for (const r of rangeFail) console.log(`  ${r.kind.padEnd(18)} ${r.slug.padEnd(32)} ${r.why}`);
    console.log('');
  }
  if (rangeUnreadable.length) {
    console.log(`RANGE-UNREADABLE (${rangeUnreadable.length}) — the declared range cannot be diffed in this clone, so it`);
    console.log('could not be judged. A finding about the checkout, never about the lab.');
    for (const r of rangeUnreadable) console.log(`  ${r.slug.padEnd(34)} ${r.why}`);
    console.log('');
  }
  if (behind.length) {
    console.log(`CLONE-BEHIND (${behind.length}) — this checkout is behind or lacks the current remote commit.`);
    console.log('Not a re-review and not the lab\'s problem: every anchor derived here came from source');
    console.log('the lab has moved past. Fetch these and re-derive.');
    for (const b of behind) {
      const by = b.by === null ? 'remote revision not in this checkout' : `${b.by} commit(s)`;
      console.log(`  ${b.slug.padEnd(34)} clone ${b.clone.slice(0, 12)}, lab ${b.actual.slice(0, 12)}  behind by ${by}`);
    }
    console.log('');
  }
  if (disclaimed.length) {
    console.log(`DISCLAIMED-ANCHOR (${disclaimed.length}) — a credit anchored on a sentence that says the thing is NOT done.`);
    console.log('The scanner matched an attack NAME in prose written to disclaim the attack. Either real code');
    console.log('demonstrates it, and the credit should be anchored there, or it does not, and the credit should');
    console.log('be removed in tools/catalog-reviewed.json. A ruling that keeps it goes in');
    console.log('tools/anchor-dispositions.json with its reason.');
    for (const d of disclaimed) {
      console.log(`  ${d.slug.padEnd(30)} ${d.item}`);
      console.log(`      denies: ${d.denials.join(' / ')}`);
      console.log(`      line:   ${d.line}`);
    }
    console.log('');
  }
  if (ruledAnchors.length) {
    console.log(`ANCHOR-RULED (${ruledAnchors.length}) — disclaimed anchors a review kept, declared in tools/anchor-dispositions.json. Not a failure.`);
    for (const r of ruledAnchors) {
      console.log(`  ${r.slug.padEnd(30)} ${r.item}`);
      console.log(`      ${r.reason.slice(0, 160)}…`);
    }
    console.log('');
  }
  /* An exhibit map records the commit its teaching anchors were read at, and it
     moves on its own schedule -- it is independent of the source-review pin by
     design. That independence is fine; its SILENCE was not. After 120 pins were
     advanced on 2026-11-11 the two drifted apart for 134 labs and nothing said
     so, so an exhibit map could sit years behind the review beside it and no run
     would mention it.

     Reported, never failed: the map being older is the normal state, not rot.
     Only an ancestor counts as BEHIND -- a commit that is merely different is
     left out, because that is a divergence this check cannot adjudicate. */
  const exhibitsBehind = [];
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog-exhibits.json'), 'utf8'));
    for (const [slug, m] of Object.entries(manifest.labs || {})) {
      const review = REVIEWS[slug];
      if (!review || !/^[0-9a-f]{40}$/.test(review.commit || '') || !/^[0-9a-f]{40}$/.test(m.commit || '')) continue;
      if (m.commit === review.commit) continue;
      const dir = path.join(REPOS, slug);
      if (!fs.existsSync(path.join(dir, '.git'))) continue;
      const anc = spawnSync('git', ['-C', dir, 'merge-base', '--is-ancestor', m.commit, review.commit], { encoding: 'utf8' });
      if (anc.status === 0) exhibitsBehind.push({ slug, exhibit: m.commit, reviewed: m.reviewed, pin: review.commit });
    }
  } catch { /* an unreadable manifest is reported by tools/catalog-exhibits.js, not here */ }
  if (exhibitsBehind.length) {
    console.log(`EXHIBIT-BEHIND (${exhibitsBehind.length}) — the exhibit map was read at an older commit than the`);
    console.log('  source review beside it. The map is independent by design, so this is a notice and not a');
    console.log('  failure; it is printed so the gap cannot widen unnoticed.');
    for (const e of exhibitsBehind) {
      console.log(`  ${e.slug.padEnd(32)} map ${e.exhibit.slice(0, 12)} (${e.reviewed || 'no date'})  <  pin ${e.pin.slice(0, 12)}`);
    }
    console.log('');
  }
  if (held.length) {
    console.log(`CLONE-HELD (${held.length}) — behind on purpose, declared in tools/clone-holds.json. Not a failure.`);
    for (const h of held) {
      if (h.freshByConstruction) {
        console.log(`  ${h.slug.padEnd(34)} held; this checkout is SHALLOW, so its currency says nothing`);
        console.log('      about the hold. A depth-1 clone is at the remote head by construction, so');
        console.log('      whether the entry is still needed cannot be judged here. Ask a full checkout.');
      } else if (h.shallowUnreadable) {
        console.log(`  ${h.slug.padEnd(34)} held; could not tell whether this checkout is shallow, so no`);
        console.log('      judgement is offered on whether the entry is still needed.');
      } else if (h.unnecessary) {
        console.log(`  ${h.slug.padEnd(34)} HOLD NO LONGER NEEDED — this clone is current; remove the entry.`);
      } else {
        console.log(`  ${h.slug.padEnd(34)} clone ${h.clone.slice(0, 12)}, lab ${h.actual.slice(0, 12)}`);
      }
      console.log(`      ${h.reason}`);
    }
    console.log('');
  }
  if (diverged.length) {
    console.log(`CLONE-AHEAD (${diverged.length}) — this checkout holds commits the lab's remote does not.`);
    console.log('Not stale and not behind: unpushed work, or a checkout left mid-rebase. Reported as its own');
    console.log('state because the remedy is the opposite one -- push or reset, never fetch.');
    for (const d of diverged) console.log(`  ${d.slug.padEnd(34)} clone ${d.clone.slice(0, 12)}, lab ${d.actual.slice(0, 12)}`);
    console.log('');
  }
  if (unreadable.length) {
    console.log(`UNREADABLE (${unreadable.length}) — no clone here, or its remote could not be read, so this pass could not look. Not a finding about the lab.`);
    for (const slug of unreadable) console.log(`  ${slug.padEnd(34)} clone it to check its anchors and its pinned review`);
    console.log('');
  }
  if (bad.length || unreadable.length || behind.length || diverged.length || disclaimed.length || shallowPins.length || rangeFail.length) {
    if (staleAnchors.length) {
      console.log('For a stale anchor: re-derive with `node tools/catalog-evidence.js write`.');
      if (staleReviews.length) {
        console.log('  — but note the writer REFUSES while any pinned review is stale, so the reviews above'
          + '\n    have to be cleared first. That ordering is deliberate, not an oversight: re-deriving'
          + '\n    would otherwise apply a person\'s judgement to source that has since changed.');
      }
    }
    if (staleReviews.length) {
      console.log('For a stale review: inspect the current lab source and update the pin in tools/catalog-reviewed.json.');
    }
    if (behind.length) {
      console.log('For a clone behind its lab: fetch the current default branch, update the checkout, then re-derive.');
    }
    if (unreadable.length) console.log('For an unreadable lab: clone it next to this repository.');
    if (shallowPins.length) {
      console.log('For an unreadable PIN: the clone is shallow and does not contain the pinned commit.'
        + '\n  Fetch it — `git -C ../<lab> fetch --depth 1 origin <pin>` — or clone without --depth.'
        + '\n  Do NOT re-review these labs on the strength of this line: it is not evidence any moved.');
    }
    process.exit(1);
  }
  console.log('Every anchor still resolves and every pinned source review matches its lab clone.');
}

function reviewedReferenceNames(slug, mentions, hits, review, staleReview) {
  // "opaque WASM" describes a coverage limit, not the OPAQUE PAKE.
  // Correct such ambiguous mentions only under the same source-review guard
  // as algorithm/attack corrections. Keep the raw evidence and claim maps.
  let excluded = [];
  /* The SAME guard the `remove` list uses, and it has to be the same one.
     It used to additionally require `head === review.commit`, on the argument
     that reference wording can change in docs outside the implementation
     movement scope. The effect was the opposite of careful: `movedSubstantively`
     calls a lockfile-only commit 'not-moved', so the pin survived and `remove`
     kept applying, while this stricter test quietly stopped applying — and a
     Dependabot bump therefore DELETED a human's correction from the card with
     nothing reporting it. Observed 2026-10-27 on crypto-lab-residue-gate: a
     vite bump touching only package.json and the lockfile put `BBS signatures`,
     `BBS+` and `Boneh-Franklin IBE` back on the card, three names a review had
     removed on purpose.
     A reviewed correction is now either applied or the lab is reported STALE and
     its card is not rewritten at all. There is no third path where the review is
     half-applied. The residual case the old comment was reaching for — prose the
     scanner reads changing under a pin that still holds — is real and is NOT
     closed by a stricter guard here, because dropping the exclusion publishes a
     name the reviewer rejected rather than withholding one. Closing it means
     widening what counts as substantive to the files the scanner actually reads;
     that is a separate decision with a measured cost (23 labs would need
     re-reading for AGENTS.md edits alone) and belongs to the maintainer. */
  if (review && !staleReview && /^[0-9a-f]{40}$/.test(review.commit || '')) {
    excluded = review.removeReferences ?? [];
    if (!Array.isArray(excluded) || excluded.some((name) =>
      !ALGORITHMS.some((term) => term.name === name))) {
      throw new Error(`${slug}: removeReferences must contain canonical algorithm names`);
    }
  }
  return [...mentions.keys()].filter((name) => !hits.has(name) && !excluded.includes(name)).sort();
}

/** Remove a scanner-only comment observation under the same guard as every
 * other reviewed correction. This is narrower than removeReferences: a lab may
 * genuinely reference a term in its README while an unrelated source
 * abbreviation creates a false comment-only anchor for that same term.
 *
 * It carried the same exact-commit test removeReferences did, and the same
 * defect with it: a pin that survives a non-substantive move kept applying
 * `remove` while silently dropping this one. Same rule now, for the same
 * reason. */
/** Protocol-partial observations a pinned review has RULED OUT, name -> reason.
 *
 * protocolPartial records where the protocol-shape rule declined to claim: a
 * lab that names only ONE of a protocol's messages, or names them under a
 * foreign prefix. The note above its construction already names the two cases
 * that are not findings at all -- crypto-lab-ssh-handshake declaring
 * `ServerHello` for SSH's own exchange, crypto-lab-pake-gate calling SRP-6a's
 * first message `srpClientHello` -- and states the bargain: a scanner that will
 * not claim must also not accuse.
 *
 * Until now a person had no way to settle one. The only mechanism that removed
 * an entry was `!hits.has(name)`, so the single way to retire a wrong
 * observation was to CREDIT the term, which for these three would have put a
 * TLS 1.3 claim on an SSH lab and an IPsec ESP claim on a format-transforming
 * encryption lab. Ruling and crediting are different acts and now have
 * different mechanisms.
 *
 * A REASON IS MANDATORY, which is why this supplement holds objects where the
 * others hold strings. A bare name would record that someone decided, not what
 * they decided or why, and this is the one supplement whose whole content is a
 * judgement about a scanner's false positive. An entry without a non-empty
 * reason throws rather than applying.
 *
 * Returns empty for a stale, unreadable or unpinned review, exactly as
 * reviewedCommentOnlyNames does: a ruling is read against the source the person
 * read, and a pin that no longer describes the lab cannot carry their judgement
 * forward. The observation then comes back on its own, which is the fail-closed
 * direction -- it cannot vanish silently.
 */
/** Names a pinned review REMOVED from the implements/attacks claims, which also
 * settles the comment-only observation for each of them.
 *
 * One ruling, one supplement. A `remove` says a person read the source and
 * decided this lab does not implement the named thing. applyReviewRemovals then
 * deletes the name from `hits`, and commentOnly is built from mentions NOT in
 * hits -- so the removal converted an implements claim into a prose-only
 * accusation, and settling that took a SECOND supplement naming the same thing
 * for the same reason on the same pin. crypto-lab-sm9-forge is where it showed:
 * its pin removed SM4 with the note "SM3 and SM4 remain imported rather than
 * implemented here", and SM4 came back as comment-only until a
 * removeCommentOnly was added on 2026-11-10 saying the same thing again.
 *
 * The prose mention is the very thing the person ruled on, so the ruling covers
 * it. What a `remove` does NOT do is grant anything: the term is still not
 * claimed, and the observation is settled rather than deleted -- it is printed
 * on every run, like a protocol-partial ruling, so a reader of the run sees
 * which observations a removal is carrying.
 *
 * The reason is the pin's own, which every entry must already have: `reason` is
 * enforced by pinRangeProblems and `note` is on all 139. There is deliberately
 * no new per-name reason field, because a remove already means one thing.
 *
 * Gated exactly as reviewedCommentOnlyNames is: a stale, unreadable or unpinned
 * review carries no ruling, so the observation returns on its own. That is the
 * fail-closed direction -- it cannot vanish quietly when the source moves.
 */
function reviewedRemovedNames(slug, review, staleReview) {
  if (!review || staleReview || !/^[0-9a-f]{40}$/.test(review.commit || '')) {
    return new Set();
  }
  const removed = review.remove ?? [];
  if (!Array.isArray(removed)) {
    throw new Error(`${slug}: remove must be an array of canonical names`);
  }
  /* A name in NEITHER vocabulary already throws in applyReviewRemovals; it is
     not re-validated here, so this reader cannot disagree with that one about
     what a valid remove is. */
  return new Set(removed);
}

function reviewedProtocolPartialNames(slug, review, staleReview) {
  if (!review || staleReview || !/^[0-9a-f]{40}$/.test(review.commit || '')) {
    return new Map();
  }
  const ruled = review.removeProtocolPartial ?? [];
  if (!Array.isArray(ruled)) {
    throw new Error(`${slug}: removeProtocolPartial must be an array of { name, reason }`);
  }
  const out = new Map();
  for (const entry of ruled) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`${slug}: removeProtocolPartial entries must be { name, reason } objects, not ${JSON.stringify(entry)}`);
    }
    const { name, reason } = entry;
    if (!ALGORITHMS.some((t) => t.name === name) && !ATTACKS.some((t) => t.name === name)) {
      throw new Error(`${slug}: removeProtocolPartial names ${JSON.stringify(name)}, which is in neither vocabulary`);
    }
    if (typeof reason !== 'string' || !reason.trim()) {
      throw new Error(`${slug}: removeProtocolPartial for ${name} has no written reason`);
    }
    out.set(name, reason.trim());
  }
  return out;
}

function reviewedCommentOnlyNames(slug, review, staleReview) {
  if (!review || staleReview || !/^[0-9a-f]{40}$/.test(review.commit || '')) {
    return new Set();
  }
  const excluded = review.removeCommentOnly ?? [];
  if (!Array.isArray(excluded) || excluded.some((name) =>
    !ALGORITHMS.some((term) => term.name === name))) {
    throw new Error(`${slug}: removeCommentOnly must contain canonical algorithm names`);
  }
  return new Set(excluded);
}


/** Apply a pinned review's `remove` list to BOTH derived claim maps.
 *
 * It used to reach only the implementations. That is the same asymmetry #66
 * found in `verify`, which read `data-implements` and not `data-attacks` while
 * all 39 polluted anchors were attacks — so the one mechanism a person has for
 * correcting the scanner could correct the field that was right and not the
 * field that was wrong. `crypto-lab-function-key` is where it showed: five of
 * its derived attacks are false about that lab and none of them was reachable.
 *
 * A name in NEITHER vocabulary now throws rather than doing nothing. A typo in
 * a pin was previously a silent no-op — `hits.delete('Man in the middle')`
 * removes nothing and reports nothing — which is a review that looks applied
 * and is not. The two vocabularies share no name today (`catalog-recall` and
 * the verify selftest both assert it), so removing from both is unambiguous.
 */

function applyReviewRemovals(slug, names, hits, attackHits) {
  for (const name of names || []) {
    const known = ALGORITHMS.some((t) => t.name === name) || ATTACKS.some((t) => t.name === name);
    if (!known) {
      throw new Error(`${slug}: reviewed remove names "${name}", which is in neither vocabulary`);
    }
    hits.delete(name);
    attackHits.delete(name);
  }
}

const DERIVED_ATTRS = 'implements|unscanned|comment-only|protocol-partial|references|attacks|standards|implementation|review-commit|review-note';

/** Replace a card's derived attributes with `parts`, idempotently.
 *
 * Stripping is two passes because the fleet holds two shapes. A card that has
 * been written before carries each derived attribute on its OWN line, and the
 * line-anchored pass clears those. A card written for the FIRST time does not:
 * a hand-authored card is a single `<a ...>` line, the insert splits it after
 * `href`, and whatever followed href — `target`, `rel`, `style` — ends up on
 * the same line as the LAST derived attribute. A line-anchored strip cannot
 * see that one, so the next write leaves it in place and adds its own copy.
 *
 * `crypto-lab-pq-chooser` carried two identical `data-review-note` attributes
 * for exactly one run that way, and every newly carded lab was one write from
 * the same. The duplicate is invisible on the page — a browser takes the first
 * and both said the same thing — which is what makes it worth a test rather
 * than a fix.
 *
 * The separator is conditional so the shapes converge instead of accumulating:
 * a first write breaks the line before the tag's remaining attributes, and a
 * card already in that shape gets nothing added. Writing the same card twice
 * is then a no-op, which `selftest` asserts in both directions.
 */
function applyDerived(block, slug, parts) {
  const anchorHref = `href="https://systemslibrarian.github.io/${slug}/"`;
  const stripped = block
    .replace(new RegExp(`^[ \\t]*data-(?:${DERIVED_ATTRS})="[^"]*"\\r?\\n`, 'gm'), '')
    .replace(new RegExp(`data-(?:${DERIVED_ATTRS})="[^"]*"[ \\t]*`, 'g'), '');
  const at = stripped.indexOf(anchorHref);
  if (at === -1) return block;
  /* After href AND any date attributes already on its line, from the one shared
     definition in tools/card-tag.js. Inserting immediately after href pushed
     data-added/data-updated onto a line of their own, lab-dates.js pulled them
     back, and the two together reformatted all 252 cards on whichever ran last. */
  const lineEnd = at + anchorHref.length
    + (() => {
      const rest = stripped.slice(at + anchorHref.length);
      const dates = new RegExp(`^(?:[ \\t]+data-(?:${cardTag.DATE_ATTRS.map((n) => n.slice(5)).join('|')})="[^"]*")+`).exec(rest);
      return dates ? dates[0].length : 0;
    })();
  const head = stripped.slice(0, lineEnd);
  const tail = stripped.slice(lineEnd);
  const sep = /^\r?\n/.test(tail) ? '' : '\n           ';
  return `${head}\n            ${parts.join('\n            ')}${sep}${tail}`;
}

/* Proof that a gitignored file cannot reach the derivation.
 *
 * Builds a throwaway repository twice: once clean, once with an IGNORED file
 * full of algorithm names. The derived file list must be identical. A boolean
 * assertion about `trackedFiles` would not catch the original defect, because
 * the defect was that a caller walked directories instead of asking git at all.
 *
 * The ignored file is named the way the real one was, and carries names no
 * other file in the fixture mentions, so if it leaks the difference is obvious.
 */
function selftest() {
  const { execFileSync } = require('child_process');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ce-tracked-'));
  const git = (...a) => execFileSync('git', ['-C', tmp, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const fail = [];
  let pass = 0;
  try {
    git('init', '-q', '-b', 'main');
    git('config', 'user.email', 'selftest@example.invalid');
    git('config', 'user.name', 'selftest');
    fs.mkdirSync(path.join(tmp, 'src'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'src', 'main.ts'), 'export function sha256() { return 1 }\n');
    fs.writeFileSync(path.join(tmp, '.gitignore'), 'CRYPTO-LAB-TEMPLATE*.md\nchat.md\n');
    git('add', '.'); git('commit', '-qm', 'base');

    const before = labFilePaths(tmp, tmp).map((f) => path.relative(tmp, f)).sort();

    // The file that caused this: ignored, on disk, stuffed with algorithm names.
    fs.writeFileSync(path.join(tmp, 'CRYPTO-LAB-TEMPLATE.md'),
      '# template\nBB84 and E91 and OPAQUE and PQXDH and Bulletproofs and AES-XTS\n');
    fs.writeFileSync(path.join(tmp, 'chat.md'), 'we discussed ML-KEM and Kyber at length\n');

    const after = labFilePaths(tmp, tmp).map((f) => path.relative(tmp, f)).sort();

    if (JSON.stringify(before) !== JSON.stringify(after)) {
      fail.push(`an ignored file changed the derived file list:\n    before ${JSON.stringify(before)}\n    after  ${JSON.stringify(after)}`);
    } else { pass++; console.log('  ok  an ignored file on disk does not change the file list'); }

    if (after.some((f) => /CRYPTO-LAB-TEMPLATE|chat\.md/.test(f))) {
      fail.push('an ignored file appears in the derived file list');
    } else { pass++; console.log('  ok  neither ignored file appears in the list'); }

    // git status calls this clean, which is exactly why the dirty test missed it.
    const status = git('status', '--porcelain').trim();
    if (status !== '') fail.push(`fixture should read clean, got: ${status}`);
    else { pass++; console.log('  ok  git status reports the clone CLEAN with both ignored files present'); }

    // An UNTRACKED-but-not-ignored file must also stay out.
    fs.writeFileSync(path.join(tmp, 'scratch.ts'), 'export const falcon = 1\n');
    forgetTracked(tmp);
    const withUntracked = labFilePaths(tmp, tmp).map((f) => path.relative(tmp, f)).sort();
    if (withUntracked.includes('scratch.ts')) fail.push('an untracked file reached the derived file list');
    else { pass++; console.log('  ok  an untracked file does not reach the list either'); }

    // And a TRACKED file must still be read, or the rule proves nothing.
    if (!after.includes(path.join('src', 'main.ts'))) fail.push('a tracked file went missing from the list');
    else { pass++; console.log('  ok  a tracked file is still read'); }

    /* The substantive-change rule, BOTH ways. A rule that only ever answered
       "not stale" would pass a one-sided fixture and bury every real one. */
    const base = git('rev-parse', 'HEAD').trim();
    fs.writeFileSync(path.join(tmp, '.gitignore'), 'CRYPTO-LAB-TEMPLATE*.md\nchat.md\nnotes.txt\n');
    git('add', '.gitignore'); git('commit', '-qm', 'ignore notes');
    const afterIgnoreOnly = git('rev-parse', 'HEAD').trim();
    if (movedSubstantively(tmp, base, afterIgnoreOnly) !== 'not-moved') fail.push('a .gitignore-only commit was called substantive');
    else { pass++; console.log('  ok  a .gitignore-only commit does NOT invalidate a pin'); }

    /* #129 — a malformed reviewed entry must be NAMED, not thrown. The guard
       used to throw from inside the fleet-wide map, so one bad entry on one lab
       derived nothing for the other 231 and the only output was a stack trace
       naming a single slug. Asserts each invalid shape is reported with a
       reason, and - the control that matters - that a VALID entry still passes,
       since a validator rejecting everything would satisfy the first half. */
    const realTerm = ALGORITHMS[0].name;
    for (const [why, add2, want] of [
      ['no @anchor', ['SHA-256'], 1],
      ['unknown name', ['Nonexistent-Cipher-X@src/fake.ts:43'], 1],
      ['anchor without a line', [`${realTerm}@src/fake.ts`], 1],
      ['a valid entry must still pass', [`${realTerm}@src/fake.ts:43`], 0],
    ]) {
      const got = invalidReviewedAdds(add2).length;
      if (got !== want) fail.push(`reviewed add validation, ${why}: expected ${want}, got ${got}`);
      else { pass++; console.log(`  ok  reviewed add validation: ${why}`); }
    }

    const realAttack = ATTACKS[0].name;
    for (const [why, add2, want] of [
      ['no @anchor', ['Key recovery'], 1],
      ['algorithm name in attack field', [`${realTerm}@src/fake.ts:43`], 1],
      ['unknown name', ['Nonexistent-Attack-X@src/fake.ts:43'], 1],
      ['anchor without a line', [`${realAttack}@src/fake.ts`], 1],
      ['a valid entry must still pass', [`${realAttack}@src/fake.ts:43`], 0],
    ]) {
      const got = invalidReviewedAttackAdds(add2).length;
      if (got !== want) fail.push(`reviewed attack add validation, ${why}: expected ${want}, got ${got}`);
      else { pass++; console.log(`  ok  reviewed attack add validation: ${why}`); }
    }
    const algorithmAdd = `${realTerm}@src/fake.ts:43`;
    const attackAdd = `${realAttack}@src/fake.ts:44`;
    const reviewAdds = { add: [algorithmAdd], addAttacks: [attackAdd] };
    if (!isReviewedAdd(reviewAdds, algorithmAdd) || !isReviewedAdd(reviewAdds, attackAdd)) {
      fail.push('reviewed generic-anchor handling did not cover both algorithm and attack additions');
    } else { pass++; console.log('  ok  reviewed generic-anchor handling covers algorithm and attack additions'); }
    if (isReviewedAdd(reviewAdds, `${realAttack}@src/fake.ts:45`)) {
      fail.push('reviewed generic-anchor handling accepted a different source line');
    } else { pass++; console.log('  ok  reviewed generic-anchor handling stays exact to the recorded source line'); }

    const reviewCommit = 'a'.repeat(40);
    const commentReview = { commit: reviewCommit, removeCommentOnly: [realTerm] };
    if (!reviewedCommentOnlyNames('fixture', commentReview, null).has(realTerm)) {
      fail.push('current pinned review did not suppress its named comment-only false positive');
    } else { pass++; console.log('  ok  a current pinned review suppresses one comment-only false positive'); }
    if (reviewedCommentOnlyNames('fixture', commentReview, { pinned: reviewCommit }).size !== 0) {
      fail.push('stale review inherited a comment-only suppression');
    } else { pass++; console.log('  ok  a STALE review does not inherit a comment-only suppression'); }
    let invalidCommentRemovalThrew = false;
    try {
      reviewedCommentOnlyNames('fixture', {
        commit: reviewCommit,
        removeCommentOnly: ['Nonexistent-Cipher-X'],
      }, null);
    } catch { invalidCommentRemovalThrew = true; }
    if (!invalidCommentRemovalThrew) fail.push('unknown comment-only suppression name was accepted');
    else { pass++; console.log('  ok  comment-only suppressions require canonical algorithm names'); }

    /* RESULT-BASED STALENESS, on a throwaway lab whose docs the scanner reads.
       The path rule asks whether README.md or src/ moved. References are derived
       from every .md in a lab, AGENTS.md and docs/ included, so a docs edit can
       change them under a pin that rule still calls fresh — the gap recorded
       beside the cab71cb fix. Asking by RESULT closes it: derive the reference
       set at both commits and compare.

       Each case asserts BOTH halves — that the movement really is
       non-substantive by the path rule, AND what the result rule then decides.
       Asserting only the second would pass against a rule that calls everything
       stale, which is the opposite defect and just as useless.

       Its own repository, because clone-source caches a clone's tracked-file
       list for the run: a fixture that gains a file after that list is read
       would never have the new file scanned, and the case would pass for a
       reason that has nothing to do with the rule under test. */
    const refTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ce-refdrift-'));
    const refGit = (...a) => execFileSync('git', ['-C', refTmp, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    refGit('init', '-q', '-b', 'main');
    refGit('config', 'user.email', 'selftest@example.invalid');
    refGit('config', 'user.name', 'selftest');
    fs.mkdirSync(path.join(refTmp, 'src'), { recursive: true });
    fs.mkdirSync(path.join(refTmp, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(refTmp, 'src', 'main.ts'), 'export function sha256() { return 1 }\n');
    fs.writeFileSync(path.join(refTmp, 'docs', 'notes.md'), 'This lab is a teaching exhibit.\n');
    fs.writeFileSync(path.join(refTmp, 'package.json'), '{ "name": "lab" }\n');
    refGit('add', '.'); refGit('commit', '-qm', 'base');
    const docsPin = refGit('rev-parse', 'HEAD').trim();

    const refsAt = (commit) => {
      const ev = evidenceFor('fixture-lab', commit, refTmp);
      return ev && !ev.notScanned ? ev.references : null;
    };

    // (1) a docs edit that changes no reference: the pin holds.
    fs.writeFileSync(path.join(refTmp, 'docs', 'notes.md'), 'This lab is a teaching exhibit, reworded.\n');
    refGit('add', 'docs/notes.md'); refGit('commit', '-qm', 'reword docs');
    const docsInert = refGit('rev-parse', 'HEAD').trim();
    if (movedSubstantively(refTmp, docsPin, docsInert) !== 'not-moved') {
      fail.push('a docs-only reword was called substantive by the path rule');
    } else { pass++; console.log('  ok  a docs-only reword is non-substantive by the path rule'); }
    if (referenceDrift('fixture-lab', refTmp, docsPin, docsInert) !== null) {
      fail.push('a docs edit that changed no reference was reported as drift');
    } else { pass++; console.log('  ok  a docs edit leaving the reference set alone KEEPS the pin'); }

    /* (2) a docs edit that ADDS one: stale, and the name is reported. Streebog is
       in the vocabulary and in no other fixture file, so a leak is unambiguous. */
    fs.appendFileSync(path.join(refTmp, 'docs', 'notes.md'), '\nCompare this with Streebog, which it does not implement.\n');
    refGit('add', 'docs/notes.md'); refGit('commit', '-qm', 'mention Streebog in docs');
    const docsAdds = refGit('rev-parse', 'HEAD').trim();
    if (movedSubstantively(refTmp, docsInert, docsAdds) !== 'not-moved') {
      fail.push('a docs-only addition was called substantive by the path rule');
    } else { pass++; console.log('  ok  a docs-only addition is still non-substantive by the path rule'); }
    const addedDrift = referenceDrift('fixture-lab', refTmp, docsInert, docsAdds);
    if (!addedDrift || !addedDrift.added.includes('Streebog') || addedDrift.dropped.length) {
      fail.push(`a docs edit that ADDED a reference was not reported: ${JSON.stringify(addedDrift)}`);
    } else { pass++; console.log('  ok  a docs edit that ADDS a reference reports stale and NAMES it'); }
    if (refsAt(docsInert).includes('Streebog') || !refsAt(docsAdds).includes('Streebog')) {
      fail.push('the derived reference sets do not bracket the added name');
    } else { pass++; console.log('  ok  the two derived reference sets bracket the added name'); }

    // (3) the cab71cb regression: a lockfile bump changes nothing the scanner reads.
    fs.writeFileSync(path.join(refTmp, 'package.json'), '{ "name": "lab", "devDependencies": { "vite": "8.3.5" } }\n');
    fs.writeFileSync(path.join(refTmp, 'package-lock.json'), '{ "lockfileVersion": 3 }\n');
    refGit('add', '.'); refGit('commit', '-qm', 'bump vite');
    const afterBump = refGit('rev-parse', 'HEAD').trim();
    if (movedSubstantively(refTmp, docsAdds, afterBump) !== 'not-moved') {
      fail.push('a lockfile-only bump was called substantive by the path rule');
    } else { pass++; console.log('  ok  a lockfile-only bump is non-substantive by the path rule'); }
    if (referenceDrift('fixture-lab', refTmp, docsAdds, afterBump) !== null) {
      fail.push('a lockfile-only bump was reported as reference drift');
    } else { pass++; console.log('  ok  a lockfile-only bump KEEPS the pin under the result rule too'); }

    /* THE DEPENDABOT CASE, end to end on a real repository.
       A reviewed exclusion used to be applied only when the clone's HEAD equalled
       the pin exactly, while `remove` applied whenever the pin survived. Those two
       rules disagree precisely on a commit `movedSubstantively` calls 'not-moved',
       so a lockfile bump deleted a human's correction from the card and nothing
       reported it. Both halves are asserted here: the movement really is
       non-substantive, AND the exclusions really do still apply across it. Asserting
       only the second would pass against a function that ignores staleness entirely,
       which is the opposite defect. */
    const pinnedCommit = git('rev-parse', 'HEAD').trim();
    fs.writeFileSync(path.join(tmp, 'package-lock.json'), '{ "name": "lab", "lockfileVersion": 3 }\n');
    fs.writeFileSync(path.join(tmp, 'package.json'), '{ "name": "lab", "devDependencies": { "vite": "8.3.5" } }\n');
    git('add', 'package.json', 'package-lock.json'); git('commit', '-qm', 'bump vite');
    const afterLockfile = git('rev-parse', 'HEAD').trim();

    if (movedSubstantively(tmp, pinnedCommit, afterLockfile) !== 'not-moved') {
      fail.push('a lockfile-only commit was called substantive');
    } else { pass++; console.log('  ok  a lockfile-only commit does NOT invalidate a pin'); }

    const bumpedReview = { commit: pinnedCommit, removeReferences: [realTerm], removeCommentOnly: [realTerm] };
    const bumpedStale = movedSubstantively(tmp, pinnedCommit, afterLockfile) === 'moved'
      ? { pinned: pinnedCommit, current: afterLockfile } : null;
    const bumpedRefs = reviewedReferenceNames('fixture',
      new Map([[realTerm, 'prose:1'], ['Streebog', 'prose:2']]), new Map(), bumpedReview, bumpedStale);
    if (bumpedRefs.includes(realTerm)) {
      fail.push(`a lockfile-only bump resurrected the removed reference ${realTerm}`);
    } else { pass++; console.log('  ok  a lockfile-only bump keeps a reviewed reference removal applied'); }
    if (!reviewedCommentOnlyNames('fixture', bumpedReview, bumpedStale).has(realTerm)) {
      fail.push('a lockfile-only bump dropped a reviewed comment-only suppression');
    } else { pass++; console.log('  ok  a lockfile-only bump keeps a reviewed comment-only suppression applied'); }

    fs.writeFileSync(path.join(tmp, 'src', 'main.ts'), 'export function sha512() { return 2 }\n');
    git('add', 'src/main.ts'); git('commit', '-qm', 'change src');
    const afterSrc = git('rev-parse', 'HEAD').trim();

    /* The control for the pair above: a substantive move must report STALE, and the
       removed name must not come back quietly on the card. It does not come back,
       because writeCards skips a stale lab entirely and the run exits non-zero —
       the removals are withheld together with every other reviewed edit, which is a
       reported state rather than a silent half-application. */
    const srcMoveStale = movedSubstantively(tmp, afterLockfile, afterSrc) === 'moved'
      ? { pinned: afterLockfile, current: afterSrc } : null;
    if (!srcMoveStale) {
      fail.push('a src/ change after a lockfile bump did not produce a stale review');
    } else { pass++; console.log('  ok  a src/ change after a bump DOES report the review stale'); }
    const staleRefs = reviewedReferenceNames('fixture',
      new Map([[realTerm, 'prose:1'], ['Streebog', 'prose:2']]), new Map(),
      { commit: afterLockfile, removeReferences: [realTerm] }, srcMoveStale);
    if (!staleRefs.includes(realTerm)) {
      fail.push('a stale review silently applied a reference removal');
    } else { pass++; console.log('  ok  a STALE review withholds its reference removal, and says so'); }
    if (movedSubstantively(tmp, afterIgnoreOnly, afterSrc) !== 'moved') fail.push('a src/ change was not called substantive');
    else { pass++; console.log('  ok  a src/ change DOES invalidate a pin'); }

    fs.writeFileSync(path.join(tmp, 'README.md'), '# lab\n');
    git('add', 'README.md'); git('commit', '-qm', 'add readme');
    const afterReadme = git('rev-parse', 'HEAD').trim();
    if (movedSubstantively(tmp, afterSrc, afterReadme) !== 'moved') fail.push('a README.md change was not called substantive');
    else { pass++; console.log('  ok  a README.md change DOES invalidate a pin'); }

    /* A TEST under src/ is not the lab, by NOT_THE_LAB — the same definition that keeps
       the scanner from reading one. Both directions, because a rule that answered
       'not-moved' for everything under src/ would be worse than the coarse one it
       replaced: the next assertion is the control. */
    fs.writeFileSync(path.join(tmp, 'src', 'main.test.ts'), "it('hashes', () => {})\n");
    git('add', 'src/main.test.ts'); git('commit', '-qm', 'add a test');
    const afterTest = git('rev-parse', 'HEAD').trim();
    if (movedSubstantively(tmp, afterReadme, afterTest) !== 'not-moved') {
      fail.push('a test-only commit under src/ was called substantive');
    } else { pass++; console.log('  ok  a src/ TEST does NOT invalidate a pin'); }

    fs.mkdirSync(path.join(tmp, 'e2e'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'e2e', 'a11y.spec.ts'), "test('axe', () => {})\n");
    git('add', 'e2e/a11y.spec.ts'); git('commit', '-qm', 'add a spec');
    const afterSpec = git('rev-parse', 'HEAD').trim();
    if (movedSubstantively(tmp, afterTest, afterSpec) !== 'not-moved') {
      fail.push('an e2e-only commit was called substantive');
    } else { pass++; console.log('  ok  an e2e spec does NOT invalidate a pin'); }

    /* The control: implementation and test in ONE commit is still substantive. Without
       this, a filter that dropped the whole commit on seeing any excluded file would
       pass every assertion above and let a real source change escape review.

       The body below must differ from every other write to this path in this function.
       It first read `return 3`, which is byte-identical to the clone fixture's write
       further down, so that fixture had nothing left to stage and died on `git commit`
       — reporting "fixture could not be built" against a block 50 lines away from the
       edit that caused it. These fixtures share one working tree. */
    fs.writeFileSync(path.join(tmp, 'src', 'main.ts'), 'export function sha512() { return 41 }\n');
    fs.writeFileSync(path.join(tmp, 'src', 'main.test.ts'), "it('hashes', () => { 1 })\n");
    git('add', 'src/main.ts', 'src/main.test.ts'); git('commit', '-qm', 'change both');
    if (movedSubstantively(tmp, afterSpec, git('rev-parse', 'HEAD').trim()) !== 'moved') {
      fail.push('a commit touching implementation AND test was not called substantive');
    } else { pass++; console.log('  ok  implementation + test in one commit DOES invalidate a pin'); }

    if (movedSubstantively(tmp, 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 'HEAD') !== 'moved') {
      fail.push('an unreadable range was not treated as moved');
    } else { pass++; console.log('  ok  a range git cannot read counts as moved, never as unchanged'); }

    // Reproduce a remote update arriving between clone refresh and verification.
    // Fetching must unblock the comparison, including real source movement.
    {
      const clone = fs.mkdtempSync(path.join(os.tmpdir(), 'cl-remote-race-'));
      try {
        execFileSync('git', ['clone', '--quiet', `file://${tmp}`, clone], {stdio:'ignore'});
        const pin = git('rev-parse', 'HEAD').trim();
        fs.writeFileSync(path.join(tmp, 'package.json'), '{"devDependencies":{"vite":"^8.3.2"}}\n');
        git('add', 'package.json'); git('commit', '-qm', 'dependency update after clone');
        const remote = remoteHeadOf(clone);
        if (!cloneNeedsFetch(clone, pin, pin, remote)) fail.push('an unfetched dependency-only remote revision was not classified as clone-behind');
        else { pass++; console.log('  ok  an unfetched remote revision requires a clone refresh, not a source review'); }
        execFileSync('git', ['-C', clone, 'fetch', '--quiet', 'origin'], {stdio:'ignore'});
        if (cloneNeedsFetch(clone, pin, pin, remote) || movedSubstantively(clone, pin, remote) !== 'not-moved') fail.push('fetched dependency-only movement did not preserve the source review');
        else { pass++; console.log('  ok  fetched dependency-only movement preserves the source review'); }
        fs.writeFileSync(path.join(tmp, 'src', 'main.ts'), 'export function sha512() { return 3 }\n');
        git('add', 'src/main.ts'); git('commit', '-qm', 'source update after clone');
        const changed = remoteHeadOf(clone);
        execFileSync('git', ['-C', clone, 'fetch', '--quiet', 'origin'], {stdio:'ignore'});
        if (cloneNeedsFetch(clone, pin, pin, changed) || movedSubstantively(clone, pin, changed) !== 'moved') fail.push('a fetched real source change escaped review');
        else { pass++; console.log('  ok  fetched real source movement still requires review'); }
        if (!cloneNeedsFetch(clone, changed, pin, changed)) fail.push('a remote-matching pin hid a checkout behind it');
        else { pass++; console.log('  ok  a remote-matching pin still reports a checkout behind it'); }
      } finally { fs.rmSync(clone, {recursive:true, force:true}); }
    }

    /* A SHALLOW clone is the one case where "could not look" is the whole answer,
       and it has to be told apart from the line above. Both are a commit git
       cannot diff; only one is a reason to ask a person to re-read a lab.

       The mutation this guards against is the original `catch { return true }`,
       which produced 27 STALE-REVIEW rows in the weekly job on 2026-10-01 and
       none on full clones. Fixture: clone tmp with --depth 1, then ask about a
       commit the truncated history does not contain. */
    {
      const shallow = fs.mkdtempSync(path.join(os.tmpdir(), 'cl-shallow-'));
      let built = true;
      try {
        execFileSync('git', ['clone', '--quiet', '--depth', '1', `file://${tmp}`, shallow],
          { stdio: ['ignore', 'ignore', 'ignore'] });
      } catch { built = false; }
      if (!built) {
        console.log('  --  shallow-clone case SKIPPED: git could not make the fixture');
      } else {
        const absent = movedSubstantively(shallow, base, 'HEAD');
        if (absent !== 'unreadable') {
          fail.push(`a shallow clone missing the pinned commit was reported as '${absent}', not 'unreadable'`);
        } else { pass++; console.log("  ok  a shallow clone missing the pin is 'unreadable', never a stale review"); }

        /* And the distinction must not swallow a real finding: once the pinned
           commit IS present, the same clone answers about content again. */
        const present = movedSubstantively(shallow, 'HEAD', 'HEAD');
        if (present !== 'not-moved') {
          fail.push(`a shallow clone that CAN see the range answered '${present}'`);
        } else { pass++; console.log('  ok  a shallow clone still answers about a range it does contain'); }
      }
      fs.rmSync(shallow, { recursive: true, force: true });
    }

    /* The verifier judges BOTH anchored fields against BOTH vocabularies.
       Fixture: one algorithm anchor and one attack anchor of the shape the
       deriver writes. Mutation: the map built from ALGORITHMS alone, which is
       what verify used until 2026-09-30 and what called 618 attack anchors
       rot. The mutation must FAIL on the attack anchor and PASS on the
       algorithm one, or the fixture is not measuring the defect. */
    /* BUILD DOCUMENTS are excluded by what they are, because tracked-set
       filtering cannot reach them: they are committed files, and a lab's build
       brief belongs in its history. Both directions, since an exclusion that
       swallowed README.md would remove most of the fleet's evidence. */
    for (const f of ['brief.md', 'docs/BUILD-PROMPT.md', 'BUILD-TEMPLATE(1).md', '_MASTER-TEMPLATE.md',
      'CRYPTO-LAB-TEMPLATE.md', 'CATALOG-ENTRY.md', 'audits/kickoff.md', 'verification/HARNESS.md',
      'MISSION-SCRIPT.md', 'PROMPT-standardize-parts-A-D(2).md', '.github/checks/console.mjs',
      'playwright.config.ts', 'crypto-lab-vdf-prompt.md', 'public/404.html',
      'web-demo/smaug-timing-harness.html']) {
      if (BUILD_DOC.test(f)) pass++;
      else fail.push(`a build document is still scanned: ${f}`);
    }
    console.log('  ok  fifteen build documents, CI, config and non-demo pages are excluded');
    for (const f of ['README.md', 'docs/specification.md', 'LIMITATIONS.md', 'SECURITY.md',
      'INVARIANTS.md', 'TEACHING.md', 'docs/CRYPTO-DECISIONS.md', 'src/ui/template.ts', 'src/main.ts',
      'index.html', 'demos/kyber-vault/index.html']) {
      if (!BUILD_DOC.test(f)) pass++;
      else fail.push(`a lab's own document is no longer scanned: ${f}`);
    }
    console.log("  ok  eleven of the lab's own documents, pages and sources are still scanned");

    /* ONE FAMILY, ONE FINDING - asserted on the real lines, both ways. */
    const mall = (line) => {
      const hit = ATTACKS.filter((a) => a.family === 'malleability' && a.re.test(line));
      const specific = hit.filter((a) => a.specific);
      return (specific.length ? specific : hit).map((a) => a.name).sort().join(' + ');
    };
    const MALL = [
      ['This is the malleability eNFS exploits at scale: raw RSA oracle answers on m1 and m2 yield a valid raw signature on m1*m2', 'Signature malleability', 'crypto-lab-rsa-forge'],
      ['<th scope="row">Malleable signatures</th>', 'Signature malleability', 'crypto-lab-ecdsa-forge'],
      ['Live cofactor / ZIP215 malleability', 'Signature malleability', 'crypto-lab-ed25519-forge'],
      ['FHE ciphertexts are malleable by design', 'Ciphertext malleability', 'crypto-lab-fhe-arena'],
      ['ChaCha20 is malleable: an attacker can flip bits in the ciphertext', 'Ciphertext malleability', 'crypto-lab-chacha20-stream'],
      ['making the ciphertext non-malleable rather than merely private', 'Ciphertext malleability', 'crypto-lab-beacon-lock'],
      ['interface MalleabilityResult {', 'Malleability (unspecified)', 'crypto-lab-merkle-vault'],
      ['<h3 class="attack-title">Malleability attack</h3>', 'Malleability (unspecified)', 'crypto-lab-paillier-gate'],
      ['nonces, and malleability turn that same math into real breaks.', 'Malleability (unspecified)', 'crypto-lab-elgamal-plain'],
    ];
    for (const [line, want, why] of MALL) {
      const got = mall(line);
      if (got === want) { pass++; console.log(`  ok  ${want.padEnd(26)} ${why}`); }
      else fail.push(`malleability: "${line.slice(0, 40)}" gave ${got || 'nothing'}, want ${want}`);
    }

    const terms = verifyTerms();
    const algorithmsOnly = new Map(ALGORITHMS.map((t) => [t.name, t]));
    const implAnchor = { name: 'SHA-256', file: 'src/main.ts', lineNo: '1', line: 'export function sha256() { return 1 }' };
    /* The deriver anchors a multi-line WebCrypto call at the call itself, whose
       own line names nothing. verify must read the same window or it reports
       fresh anchors as rot - it did, 70 of them, the third time that has
       happened here. Both directions are asserted: the window resolves it, and
       a window on a line that is NOT an open call does not. */
    const spanAnchor = {
      name: 'HKDF', file: 'src/kdf.ts', lineNo: '3',
      line: '  return crypto.subtle.deriveKey(',
      wide: "  return crypto.subtle.deriveKey( { name: 'HKDF', hash: 'SHA-256',",
    };
    if (judgeAnchor({ ...spanAnchor, terms }) !== null) fail.push('a multi-line WebCrypto anchor was called stale');
    else { pass++; console.log('  ok  an anchor on a multi-line WebCrypto call reads the lines it spans'); }
    if (judgeAnchor({ ...spanAnchor, line: '  const unrelated = 1', terms }) === null) {
      fail.push('the window was read on a line that is not an open WebCrypto call');
    } else { pass++; console.log('  ok  and does not read that window on any other line'); }
    const attackAnchor = { name: 'Nonce reuse', file: 'src/attack.ts', lineNo: '4', line: 'export function nonceReuseRecovery(sigA, sigB) {' };
    if (judgeAnchor({ ...implAnchor, terms }) !== null) fail.push('an algorithm anchor was not accepted');
    else { pass++; console.log('  ok  an algorithm anchor resolves against the shared term map'); }
    if (judgeAnchor({ ...attackAnchor, terms }) !== null) fail.push(`an attack anchor was not accepted: ${judgeAnchor({ ...attackAnchor, terms })}`);
    else { pass++; console.log('  ok  an attack anchor resolves against the shared term map'); }
    if (judgeAnchor({ name: 'Not a term', file: 'src/x.ts', lineNo: '1', line: 'not a term', terms }) !== 'not a vocabulary term') {
      fail.push('a name in neither vocabulary was accepted');
    } else { pass++; console.log('  ok  a name in neither vocabulary is still refused'); }
    if (judgeAnchor({ ...attackAnchor, terms: algorithmsOnly }) !== 'not a vocabulary term') {
      fail.push('MUTATION not caught: an algorithm-only map accepted an attack anchor, so this fixture would not have seen the 618');
    } else if (judgeAnchor({ ...implAnchor, terms: algorithmsOnly }) !== null) {
      fail.push('MUTATION proves nothing: the algorithm-only map failed the algorithm anchor too');
    } else { pass++; console.log('  ok  MUTATION algorithm-only map: attack anchor refused, algorithm anchor kept - the fixture discriminates'); }
    /* The rewrite, on the two card shapes the fleet actually holds. A fixture
       with only the already-written shape passes while the duplication bug is
       present, because that shape is the one the line-anchored strip can see. */
    const PARTS = ['data-implements="X@src/a.ts:1"', 'data-review-note="a note"'];
    const fresh = '          <a class="project-card" data-category="SIGNATURES" '
      + 'href="https://systemslibrarian.github.io/crypto-lab-demo/" target="_blank" rel="noopener" style="--accent: #ff6b7f;">\n'
      + '            <div class="project-title">Demo</div>\n          </a>';
    const once = applyDerived(fresh, 'crypto-lab-demo', PARTS);
    const twice = applyDerived(once, 'crypto-lab-demo', PARTS);
    const count = (h, a) => (h.match(new RegExp(`data-${a}=`, 'g')) || []).length;

    if (count(once, 'review-note') !== 1) fail.push(`first write produced ${count(once, 'review-note')} data-review-note attributes`);
    else { pass++; console.log('  ok  a first write on a one-line card emits each derived attribute once'); }

    if (count(twice, 'review-note') !== 1 || count(twice, 'implements') !== 1) {
      fail.push(`re-writing a newly carded lab duplicated an attribute: ${count(twice, 'implements')} implements, ${count(twice, 'review-note')} review-note`);
    } else { pass++; console.log('  ok  re-writing a newly carded lab does NOT duplicate the last attribute'); }

    if (twice !== once) fail.push('writing the same card twice was not a no-op');
    else { pass++; console.log('  ok  writing the same card twice is byte-identical'); }

    if (!/target="_blank" rel="noopener" style="--accent: #ff6b7f;">/.test(twice) || !/<div class="project-title">Demo<\/div>/.test(twice)) {
      fail.push(`the rewrite lost part of the card:\n${twice}`);
    } else { pass++; console.log('  ok  the tag tail and the card body survive the rewrite'); }

    /* And the other direction: a card already carrying its attributes on their
       own lines must not grow a blank line per run. */
    const settled = applyDerived(once, 'crypto-lab-demo', ['data-implements="Y@src/b.ts:2"']);
    const settledAgain = applyDerived(settled, 'crypto-lab-demo', ['data-implements="Y@src/b.ts:2"']);
    if (settledAgain !== settled) fail.push('a settled card changed on a second write with the same fields');
    else { pass++; console.log('  ok  a settled card is stable across writes'); }
    if (count(settled, 'review-note') !== 0) fail.push('a field that stopped being derived was left behind');
    else { pass++; console.log('  ok  a field that stops being derived is removed, not orphaned'); }

    /* The shape already committed before this was fixed, verbatim: the last
       derived attribute sharing its line with the tag's remaining attributes.
       Only the second strip pass can see it, so this is the case that fails
       without one — the separator fix alone stops new cards entering the shape
       and does nothing for the cards already in it. */
    const carried = '          <a class="project-card" data-category="SIGNATURES" href="https://systemslibrarian.github.io/crypto-lab-demo/"\n'
      + '            data-implements="X@src/a.ts:1"\n'
      + '            data-review-note="a note" target="_blank" rel="noopener" style="--accent: #ff6b7f;">\n'
      + '            <div class="project-title">Demo</div>\n          </a>';
    const repaired = applyDerived(carried, 'crypto-lab-demo', PARTS);
    if (count(repaired, 'review-note') !== 1) {
      fail.push(`a card carrying the pre-fix shape kept ${count(repaired, 'review-note')} data-review-note attributes`);
    } else { pass++; console.log('  ok  a card already in the pre-fix shape is repaired, not duplicated'); }
    if (!/target="_blank" rel="noopener" style="--accent: #ff6b7f;">/.test(repaired)) {
      fail.push(`repairing the pre-fix shape lost the tag tail:\n${repaired}`);
    } else { pass++; console.log('  ok  repairing it keeps the tail attributes it shared a line with'); }

    /* A pinned review's `remove` has to reach the ATTACKS map too. A fixture
       that only checks the implements side passes while that half is missing,
       which is how it stayed missing. */
    const impls = new Map([['SHA-256', { at: 'a:1' }], ['ristretto255', { at: 'b:2' }]]);
    const atks = new Map([['Man-in-the-middle', { at: 'c:3' }], ['Discrete log', { at: 'd:4' }]]);
    applyReviewRemovals('fixture', ['SHA-256', 'Man-in-the-middle'], impls, atks);
    if (impls.has('SHA-256')) fail.push('a reviewed remove did not reach the implements map');
    else { pass++; console.log('  ok  a reviewed remove deletes an implementation'); }
    if (atks.has('Man-in-the-middle')) fail.push('a reviewed remove did not reach the ATTACKS map');
    else { pass++; console.log('  ok  a reviewed remove deletes an attack'); }
    if (!impls.has('ristretto255') || !atks.has('Discrete log')) {
      fail.push('a reviewed remove deleted a name it was not given');
    } else { pass++; console.log('  ok  it deletes only the names it was given'); }
    let threw = false;
    try { applyReviewRemovals('fixture', ['Man in the middle'], impls, atks); } catch { threw = true; }
    if (!threw) fail.push('a remove naming neither vocabulary was silently ignored');
    else { pass++; console.log('  ok  a remove naming neither vocabulary throws instead of no-opping'); }
  } catch (e) {
    fail.push(`fixture could not be built: ${e.message}`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log(fail.length ? `\n${pass} passed, ${fail.length} FAILED` : `\n${pass} passed, 0 failed`);
  for (const m of fail) console.log(`  FAIL  ${m}`);
  return fail.length ? 1 : 0;
}

/* --auto-advance: report which stale pins a line-level rule would advance.
 *
 * REPORT ONLY. It writes nothing, ever. The point is to run it beside `verify`
 * for a while and see whether its ELIGIBLE list is one a person would have
 * signed, before anything is allowed to act on it.
 *
 * Three conditions, all of them line-level, all of them required:
 *
 *   (a) no path under src/ changed over pin..head
 *   (b) every anchor's LINE is byte-identical at pin and at head
 *   (c) every anchor still resolves at head under judgeAnchor
 *
 * (b) is line-level rather than file-level on purpose, and the case that
 * settled it is crypto-lab-masked-core: it anchors `Timing side-channel` at
 * README.md:18, and the range that moved it edited README.md:208 -- the same
 * file, 190 lines away. A file-level rule ("no anchored file changed") refuses
 * that correct advance. A line-level rule accepts it and still refuses any
 * range that touches an anchored line.
 *
 * Everything it cannot establish is a refusal, including an unreadable commit.
 * An advance it cannot justify is not an advance.
 */
/* The anchors on a card, as {name, file, line}. */
function anchorsOnCard(block) {
  const out = [];
  for (const field of ['implements', 'attacks', 'comment-only']) {
    const raw = attr(block, field);
    if (!raw) continue;
    for (const item of raw.split('|').map((x) => x.trim()).filter(Boolean)) {
      if (!item.includes('@')) continue;                    // a bare name, no anchor
      const at = item.slice(item.lastIndexOf('@') + 1);
      if (!/:\d+$/.test(at)) continue;
      out.push({ name: item.slice(0, item.lastIndexOf('@')),
                 file: at.slice(0, at.lastIndexOf(':')),
                 line: Number(at.slice(at.lastIndexOf(':') + 1)) });
    }
  }
  return out;
}

/* The whole rule, as one pure decision, so each condition can be tested rather
   than inferred from whichever labs happen to be behind today. Conditions (b)
   and (c) are the reason this is not a file-level diff test: see autoAdvance. */
/* Byte equality of two files is blob equality: git hashes content, so equal
   bytes are the same blob. The fallback for callers holding extracted trees
   rather than a repository to ask `rev-parse <commit>:<path>` of. */
function sameFileBytes(a, b) {
  try {
    if (!fs.existsSync(a) || !fs.existsSync(b)) return null;
    return fs.readFileSync(a).equals(fs.readFileSync(b));
  } catch { return null; }
}

function autoAdvanceVerdict({ changed, anchors, atPin, atHead, terms, demoHasSrc, reviewedAnchor, roots, blobsEqual, classify }) {
  let markupWhy = null;
  /* Condition (a) asks the SAME question the deriver asks, through the same
     module. It used to ask it with a bare /src\// regex of its own, which
     counted things the deriver ignores: measured 2026-11-10, that refused
     crypto-lab-quantum-vault-kpqc over
     web-demo/src/__tests__/signature-trust.test.ts -- a test file, excluded by
     NOT_THE_LAB, and the crypto-lab-ghost-commit false positive wearing a
     fourth coat. A gate stricter than the thing it guards reports rot that is
     not there. */
  const src = substantiveChanges(changed || [], demoHasSrc, roots);
  /* RULING 1 RUNS FIRST. An anchored file among the substantive paths refuses
     here, before the classifier is constructed, so there is no order in which a
     markup verdict could reach an anchored file. The blob comparison itself is
     below in (b); this is the cheaper path test that makes the ordering
     explicit rather than emergent. */
  const anchoredFiles = new Set((anchors || []).map((a) => a.file));
  const anchoredTouched = src.filter((f) => anchoredFiles.has(f));
  if (anchoredTouched.length) {
    return { verdict: 'refused', condition: 'a',
             why: `anchored file(s) changed: ${anchoredTouched.slice(0, 3).join(', ')}` };
  }
  if (src.length) {
    /* Only the UNANCHORED substantive paths reach the classifier, and only it
       can widen eligibility. Executable and unreadable both still refuse, and
       unreadable refuses for its own reason so a diff that would not run is
       never read as a clearance. */
    const cls = classify ? classify(src) : { verdict: 'executable', why: 'no classifier supplied' };
    if (cls.verdict !== 'markup') {
      return { verdict: 'refused', condition: 'a',
               why: cls.verdict === 'unreadable'
                 ? `could not classify the change: ${cls.why}`
                 : `${src.length} substantive path(s), and ${cls.why}` };
    }
    markupWhy = cls.why;
  }
  if (!anchors || !anchors.length) {
    return { verdict: 'refused', condition: 'anchors',
             why: 'no anchors on the card; (b) and (c) would be vacuous' };
  }
  let reviewBacked = 0;
  const pinDir = atPin();
  const headDir = atHead();
  if (!pinDir || !headDir) {
    return { verdict: 'refused', condition: 'read', why: 'a commit could not be extracted' };
  }
  /* RULING 1, 2026-11-11: the gate compares anchored BLOBS, not anchor lines,
     and it compares them from reviewedCommit -- the bytes a PERSON read -- not
     from `commit`, which this mechanism moves on its own.

     The line-granular form this replaces is argued in #426: a file-level check
     is stricter than the deriver, and shamir-gate's index.html edit is page
     furniture. That argument is recorded here rather than removed, because it
     is the strongest case against what follows. It was overruled: an anchored
     file is a file a person read, and "the bytes around the anchor are only
     furniture" is a judgement about THIS edit that the gate cannot make about
     the next one. The cost is one lab reaching a person; the cost of the other
     way is a reviewed file changing with nobody told.

     Comparing from reviewedCommit is the half that only matters later. While no
     pin has advanced the two baselines are the same commit, so today this
     changes nothing; after a hundred automatic advances, `commit` is bytes
     nobody read and only reviewedCommit still answers "since a person looked". */
  const seenFiles = new Set();
  for (const a of anchors) {
    if (seenFiles.has(a.file)) continue;           // one blob question per file
    seenFiles.add(a.file);
    const same = blobsEqual
      ? blobsEqual(a.file)
      : sameFileBytes(path.join(pinDir, a.file), path.join(headDir, a.file));
    if (same === null) {
      return { verdict: 'refused', condition: 'b',
               why: `anchored file ${a.file} is unreadable at one end` };
    }
    if (!same) {
      return { verdict: 'refused', condition: 'b',
               why: `anchored blob changed since review: ${a.file} (carries ${a.name}@${a.file}:${a.line})` };
    }
  }
  for (const a of anchors) {
    const after = fileLines(path.join(headDir, a.file), a.line, 1);
    if (after === null) {
      return { verdict: 'refused', condition: 'b',
               why: `anchor ${a.name}@${a.file}:${a.line} is unreadable at head` };
    }
    /* A REVIEWED anchor is not name-judged, here or in verifyAnchors, and for
       the same reason stated there: a pinned review may credit the implementing
       operation under a generic symbol (generate_shares, proveSchnorr), so the
       review is the evidence and a name grep is not. Its source commit was
       checked when the pin was written, and condition (b) above has just
       established the line is byte-identical at both ends, which is the whole
       of what can be asked without re-reading the lab.

       Judging them anyway is what produced all 37 of this report's anchor
       refusals. Measured 2026-11-10: every one of the 37 was in its pin's add
       list, judgeAnchor rejected all 37 AT THEIR OWN PIN, and the anchored file
       was unchanged since the pin in all 37. Nothing had rotted; the gate was
       simply stricter than the verifier it reports for. */
    if (typeof reviewedAnchor === 'function' && reviewedAnchor(a)) { reviewBacked += 1; continue; }
    const wide = fileLines(path.join(headDir, a.file), a.line, 4);
    const bad = judgeAnchor({ name: a.name, file: a.file, lineNo: a.line, line: after, terms, wide });
    if (bad) {
      return { verdict: 'refused', condition: 'c',
               why: `anchor ${a.name}@${a.file}:${a.line} no longer resolves: ${bad}` };
    }
  }
  /* Report the BASIS, not just the count. Collapsing "its line is unchanged and
     it still names its term" together with "its line is unchanged and a person
     vouched for it" would hide which anchors rest on a review, and that is
     exactly the distinction a human reading this list needs. */
  return { verdict: 'eligible', anchors: anchors.length, reviewBacked, markupWhy };
}

/** Advance the eligible pins, in place, and say what was written.
 *
 * `reviewed` IS NOT TOUCHED, and that is the whole care in this function. That
 * date is when a PERSON read the lab, and catalog-evidence ages every pin from
 * it -- the STALE-REVIEW report prints "1234d ... reviewed 2026-xx-xx". A
 * machine advance that stamped today there would reset the human-review clock
 * on a lab nobody has re-read, and 121 labs would read freshly reviewed while
 * no one had looked. Only `commit` and `range` move; `reason` gains a sentence
 * recording that the advance was machine-made, on what basis, and over which
 * range, so the entry never implies a reading that did not happen.
 *
 * Eligibility is RE-DERIVED here rather than taken from the report: the clones
 * can move between the two, and a pin written from a stale verdict is exactly
 * the inherited-judgement failure the pin exists to prevent.
 */
function autoAdvanceWrite(rows) {
  const P = path.join(__dirname, 'catalog-reviewed.json');
  const raw = fs.readFileSync(P, 'utf8');
  const table = JSON.parse(raw);
  /* Byte-faithfulness first: if this writer cannot reproduce the file as it
     stands, it must not be the thing that rewrites 121 entries. */
  if (JSON.stringify(table, null, 2) + '\n' !== raw) {
    console.error('REFUSING TO WRITE: this writer does not reproduce tools/catalog-reviewed.json');
    console.error('byte for byte, so it cannot be trusted to change 121 entries in it.');
    return { written: 0, skipped: [], refused: true };
  }
  const written = [];
  const skipped = [];
  for (const r of rows) {
    const e = table[r.slug];
    if (!e) { skipped.push({ slug: r.slug, why: 'no pin entry' }); continue; }
    if (e.commit !== r.from) { skipped.push({ slug: r.slug, why: `pin moved under the run: ${e.commit.slice(0, 12)} is not the ${r.from.slice(0, 12)} this verdict was computed against` }); continue; }
    /* Preserve the commit a PERSON last read, once, on the first advance. After
       this the entry still answers "which bytes did someone actually look at",
       which `commit` alone no longer can -- and that is what makes the
       byte-identity of the anchored files checkable by a test rather than only
       by reading the reason prose. Subsequent advances leave it alone. */
    if (!e.reviewedCommit) e.reviewedCommit = e.commit;
    e.commit = r.to;
    e.range = `${r.from}..${r.to}`;
    e.reason = `${e.reason} Pin advanced ${r.from.slice(0, 12)}..${r.to.slice(0, 12)} by tools/catalog-evidence.js auto-advance --write, not by a person: `
      + `${r.changedFiles.length} file(s) changed and NONE of them is substantive under tools/moved-substantively.js`
      + `${r.changedFiles.length ? ` (${r.changedFiles.slice(0, 6).join(', ')}${r.changedFiles.length > 6 ? ` and ${r.changedFiles.length - 6} more` : ''})` : ''}, `
      + `and every anchored line on the card is byte-identical at both commits`
      + `${r.reviewBacked ? `, ${r.reviewBacked} of them review-backed and therefore not name-judged, as in verify` : ''}. `
      + `The reviewed date is deliberately unchanged: no person re-read this lab.`;
    written.push({ slug: r.slug, from: r.from, to: r.to, files: r.changedFiles.length, anchors: r.anchors });
  }
  fs.writeFileSync(P, `${JSON.stringify(table, null, 2)}\n`);
  return { written, skipped, refused: false };
}

function autoAdvance(selected, opts = {}) {
  const terms = verifyTerms();
  const rows = [];
  for (const c of selected) {
    const review = REVIEWS[c.slug];
    if (!review || !/^[0-9a-f]{40}$/.test(review.commit || '')) continue;
    const dir = path.join(REPOS, c.slug);
    if (!fs.existsSync(path.join(dir, '.git'))) {
      rows.push({ slug: c.slug, verdict: 'refused', why: 'no checkout here' });
      continue;
    }
    const head = gitValue(dir, ['rev-parse', 'HEAD']);
    if (!head.readable) { rows.push({ slug: c.slug, verdict: 'refused', why: 'HEAD unreadable' }); continue; }
    if (head.value === review.commit) continue;               // nothing to advance
    const names = gitValue(dir, ['diff', '--name-only', `${review.commit}..${head.value}`]);
    if (!names.readable) {
      rows.push({ slug: c.slug, verdict: 'refused', why: `range unreadable ${review.commit.slice(0, 12)}..${head.value.slice(0, 12)}` });
      continue;
    }
    const changed = names.value.split('\n').map((x) => x.trim()).filter(Boolean);
    const reviewedItems = new Set([...(review.add || []), ...(review.addAttacks || [])]);
    /* Real blob ids from git, and the baseline is reviewedCommit when the pin
       carries one -- the commit a person actually read -- falling back to
       `commit` for the pins that have never been advanced. */
    const reviewedFrom = review.reviewedCommit || review.commit;
    const blobAt = (commit, file) => {
      const r = gitValue(dir, ['rev-parse', `${commit}:${file}`]);
      return r.readable ? r.value.trim() : null;
    };
    const verdict = autoAdvanceVerdict({
      classify: (paths) => markupOnly(dir, reviewedFrom, head.value, paths, lex),
      blobsEqual: (file) => {
        const a = blobAt(reviewedFrom, file);
        const b = blobAt(head.value, file);
        return (a === null || b === null) ? null : a === b;
      },
      changed,
      anchors: anchorsOnCard(c.block),
      atPin: () => treeAt(dir, review.commit),
      atHead: () => treeAt(dir, head.value),
      terms,
      /* Asked of the tree at head, the state the pin would advance to. */
      demoHasSrc: demoHasSrcFrom(gitValue(dir, ['ls-tree', '-r', '--name-only', head.value]).value || ''),
      roots: rootsFor(c.slug),
      reviewedAnchor: (a) => reviewedItems.has(`${a.name}@${a.file}:${a.line}`),
    });
    rows.push({ slug: c.slug, ...verdict, changed: changed.length,
                from: review.commit, to: head.value, changedFiles: changed,
                range: `${review.commit.slice(0, 12)}..${head.value.slice(0, 12)}` });
  }
  const eligible = rows.filter((r) => r.verdict === 'eligible');
  const refused = rows.filter((r) => r.verdict === 'refused');
  console.log(`AUTO-ADVANCE REPORT — ${rows.length} pinned lab(s) behind their checkout. Nothing is written.`);
  console.log('A pin is eligible only when nothing SUBSTANTIVE changed (the shared rule in');
  console.log('tools/moved-substantively.js, so this gate is not stricter than the deriver),');
  console.log('every anchor LINE is byte-identical at both commits, and every anchor that is');
  console.log('name-verified still resolves at head. A REVIEW-BACKED anchor is not name-judged,');
  console.log('here or in verify: the review is its evidence, so byte-identity is all there is');
  console.log('to ask. Each eligible row says how many of its anchors rest on a review.');
  console.log('');
  console.log(`ELIGIBLE (${eligible.length})`);
  for (const r of eligible) {
    const basis = r.reviewBacked ? `, ${r.reviewBacked} review-backed` : '';
    console.log(`  ${r.slug.padEnd(34)} ${r.range}  ${r.changed} file(s), ${r.anchors} anchor(s)${basis}`);
  }
  console.log('');
  console.log(`REFUSED (${refused.length})`);
  for (const r of refused) console.log(`  ${r.slug.padEnd(34)} ${r.why}`);
  if (!opts.write) return 0;
  console.log('');
  const { written, skipped, refused: halted } = autoAdvanceWrite(eligible);
  if (halted) return 1;
  console.log(`WRITTEN (${written.length}) — commit and range advanced; reviewed deliberately unchanged.`);
  for (const w of written) {
    console.log(`  ${w.slug.padEnd(34)} ${w.from.slice(0, 12)}..${w.to.slice(0, 12)}  ${w.files} file(s), ${w.anchors} anchor(s)`);
  }
  if (skipped.length) {
    console.log(`\nSKIPPED (${skipped.length}) — eligible in the report, not eligible at write time. Not forced.`);
    for (const s of skipped) console.log(`  ${s.slug.padEnd(34)} ${s.why}`);
  }
  return 0;
}

/* One line of a file, or null. Used by autoAdvance to compare an anchored line
   at two commits without caring what else moved in the file. */
function fileLine(file, lineNo) {
  const all = fileLines(file, lineNo, 1);
  return all === null ? null : all;
}

function fileLines(file, lineNo, count) {
  try {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    if (lineNo < 1 || lineNo > lines.length) return null;
    return lines.slice(lineNo - 1, lineNo - 1 + count).join('\n');
  } catch { return null; }
}

function main() {
  const argv = process.argv.slice(2);
  if (argv[0] === 'selftest') process.exit(selftest());
  const mode = argv.find((a) => !a.startsWith('-')) || 'report';
  const one = argv.includes('--lab') ? argv[argv.indexOf('--lab') + 1] : null;
  const selected = cards().filter((c) => !one || c.slug === one);
  // Verification reads the stored claims and clone HEADs. Re-derivation would
  // reject the first stale pin before this pass could report all stale reviews.
  if (mode === 'verify') return verifyAnchors(selected);
  // Report only: --auto-advance never writes, so it is safe beside verify.
  if (mode === 'auto-advance' || argv.includes('--auto-advance')) {
    return process.exit(autoAdvance(selected, { write: argv.includes('--write') }));
  }
  const all = selected.map((c) => ({ ...c, ev: evidenceFor(c.slug) }));

  /* Every read-only mode names the stale pins it worked around, so a number that
     came out of a partly-inherited review is never mistaken for a clean one. */
  const stale = all.filter((c) => c.ev.staleReview && !c.ev.staleReview.unreadable);
  const unjudgeable = all.filter((c) => c.ev.staleReview && c.ev.staleReview.unreadable);
  if (unjudgeable.length && mode !== 'write') {
    console.error(`PIN-UNREADABLE (${unjudgeable.length}) — the pinned commit is absent from a shallow clone, so`);
    console.error('whether the lab moved could not be asked. Their recorded edits were NOT applied. This says');
    console.error('nothing about those labs; fetch the pinned commits and re-run.');
    for (const c of unjudgeable) {
      console.error(`  ${c.slug.padEnd(34)} pinned ${c.ev.staleReview.pinned.slice(0, 12)} — not in this clone`);
    }
    console.error('');
  }
  if (stale.length && mode !== 'write') {
    console.error(`STALE-REVIEW (${stale.length}) — pinned source reviews whose lab has moved. Their recorded`);
    console.error('add/remove edits were NOT applied here; everything else in this run is derived as usual.');
    for (const c of stale) {
      console.error(`  ${c.slug.padEnd(34)} reviewed ${c.ev.staleReview.pinned.slice(0, 12)}, clone ${c.ev.staleReview.current.slice(0, 12)}`);
    }
    console.error('Update the pins in tools/catalog-reviewed.json after re-reading those labs.\n');
  }

  if (mode === 'gaps') {
    /* Chips naming something the vocabulary has never heard of. The header
       promises the vocabulary grows on purpose rather than by being wrong
       quietly, and this is the thing that makes that true: a declared
       vocabulary's blind spot is invisible from inside it. `scalarMul` was
       missed because the term demanded `scalarMult` with a t, and the only
       symptom was one lab reading UNKNOWN. */
    const seen = new Map();
    for (const c of all) {
      const chips = [...c.block.matchAll(/class="chip">([^<]+)</g)].map((x) => x[1].trim());
      for (const chip of chips) {
        if (ALGORITHMS.some((t) => (t.chipRe || t.re).test(chip)) || ATTACKS.some((t) => t.re.test(chip))) continue;
        if (!seen.has(chip)) seen.set(chip, []);
        seen.get(chip).push(c.slug.replace('crypto-lab-', ''));
      }
    }
    const rows = [...seen].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
    console.log(`Chips matching no vocabulary term: ${rows.length} distinct, on ${new Set(rows.flatMap((r) => r[1])).size} labs.`);
    console.log('Most are concepts rather than algorithms and belong nowhere near the index.');
    console.log('The ones worth reading are algorithm NAMES — those are vocabulary gaps.\n');
    for (const [chip, labs] of rows.slice(0, 40)) {
      console.log(`  ${String(labs.length).padStart(3)}  ${chip.padEnd(30)} ${labs.slice(0, 4).join(', ')}${labs.length > 4 ? ', …' : ''}`);
    }
    return;
  }

  if (mode === 'write') return writeCards(all);

  if (argv.includes('--json')) {
    console.log(JSON.stringify(all.map(({ slug, title, ev }) => ({ slug, title, ...ev })), null, 2));
    return;
  }

  const uncloned = all.filter((c) => !c.ev.cloned);
  const unknown = all.filter((c) => c.ev.cloned && !c.ev.implements.length);
  console.log(`${all.length} cards; ${all.length - uncloned.length} clones read.\n`);
  if (one) {
    for (const c of all) {
      console.log(`${c.slug}  (${c.ev.implementation})`);
      for (const i of c.ev.implements) console.log(`  implements  ${i.name.padEnd(22)} ${i.shape.padEnd(7)} ${i.at}`);
      for (const r of c.ev.references) console.log(`  references  ${r}`);
      for (const a of c.ev.attacks) console.log(`  attack      ${a.name.padEnd(22)}         ${a.at}`);
    }
    return;
  }
  const counts = new Map();
  for (const c of all) for (const i of c.ev.implements) counts.set(i.name, (counts.get(i.name) || 0) + 1);
  console.log(`Algorithms with at least one implementation: ${counts.size} of ${ALGORITHMS.length} vocabulary terms.`);
  console.log(`Labs with no derivable implementation (UNKNOWN): ${unknown.length}`);
  for (const c of unknown) console.log(`  ${c.slug}`);
  if (uncloned.length) {
    console.log(`\nNot cloned here, so not readable (${uncloned.length}):`);
    for (const c of uncloned) console.log(`  ${c.slug}`);
  }
}

/* Exported so tools/depth-audit.js can blank comments with the SAME lexer rather
   than growing a second one. Two comment-blankers in one repository would drift,
   and the subtle cases here - a regex literal holding a quote, a template literal
   spanning four hundred lines - are exactly where they would drift. */
module.exports = {
  /* Exported for tests/three-way.test.cjs: the three-state movement verdict
     and the two lookups it rests on. */
  movedSubstantively,
  takeMarkupOnly,
  anchoredFilesFor,
  hasCommitState,
  isShallowState,
  /* Exported for tests/clone-currency.test.cjs: the behind/ahead/current verdict
     that now runs for every card rather than only the pinned ones. */
  cloneCurrency,
  remoteHeadsOf,
  cloneHolds,
  SUBSTANTIVE,
  disclaimersIn,
  anchorDispositions,
  DISCLAIMERS,
  lex,
  evidenceFor,
  reviewedReferenceNames,
  reviewedProtocolPartialNames,
  reviewedRemovedNames,
  evidenceFor,
  treeAt,
  referenceDrift,
  attackContextAllows,
  camelSplit,
  verifyTerms,
  judgeAnchor,
  autoAdvanceVerdict,
  autoAdvanceWrite,
  anchorsOnCard,
  fileLines,
  /* The real shape decision, exported so tools/evidence-shape-proof.js can drive
     THIS function instead of a copy of its decl branch. The copy was honest
     about being one - it grabbed the guard regexes out of this file's source so
     they could not drift - but it could only ever test the branch it had
     reimplemented, and the guards now live in four branches. */
  shapeOf,
  /* Comments blanked, STRING CONTENTS KEPT. The other view (`lex().code`) blanks
     both, which is right for finding declarations and wrong for anything that
     lives in a string: an import path, a test name, a hex vector. Using it by
     mistake made tools/depth-audit.js unable to see `from '@noble/...'` or
     `it('rejects ...')` at all, and quietly demoted the fleet's reference labs. */
  blankComments: (src) => lex(src).strings,
};

if (require.main === module) main();
