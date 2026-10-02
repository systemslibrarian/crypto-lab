#!/usr/bin/env node
/*
 * lab-dates.js — stamp each card with when its lab was added and when its DEMO
 * last changed, so the catalog can say what is new without anyone typing a date.
 *
 * Run: node tools/lab-dates.js check
 * Prevents: a card's displayed dates drifting from the repository they describe, or a package bump reading as a content update
 * Reads: `gh api users/systemslibrarian/repos` for created_at, `git log origin/main` in each sibling clone for the last content commit, and index.html's data-added / data-updated
 *
 *   node tools/lab-dates.js          rewrite tools/lab-dates.json and index.html's attributes
 *   node tools/lab-dates.js check    exit 1 if either disagrees with the other
 *   node tools/lab-dates.js selftest offline: the content-path rule, against fixtures
 *
 * WHY "UPDATED" IS NOT `pushed_at`
 *
 * The obvious field is wrong, and the measurement is not close. On 2026-10-02,
 * 217 of the 219 lab repositories had been pushed within the previous SEVEN
 * DAYS — almost entirely grouped Dependabot bumps, which this fleet merges
 * automatically by design. A card built on `pushed_at` would therefore read
 * "Updated Oct 2026" on 217 of 218 cards and carry no information at all, while
 * looking like it carried the most useful information on the page.
 *
 * `crypto-lab-schnorr-forge` is the case to hold on to: pushed 2026-10-01, and
 * its newest commit that changed anything a visitor can see is 2026-08-15. Seven
 * weeks of that gap is dependency maintenance.
 *
 * So "updated" is the newest commit that touched the DEMO, defined by EXCLUSION
 * rather than by listing source directories. Inclusion was tried first as
 * `README.md` + `src/` — the pair `catalog-evidence.js` already uses — and it
 * misses labs that keep their source somewhere else: `demos/<slug>/src`,
 * `web-demo/src`, `crates/`, `native/`, `wasm/`. A lab whose layout is unusual
 * would have reported its creation date forever, which is the shape this
 * repository keeps re-finding: a checker blind to the labs that did something
 * differently. Excluding the things that are definitely NOT the demo covers
 * every layout without naming any of them.
 *
 * What the exclusions cost is worth stating too: a commit that changes ONLY a
 * test, a workflow or a lockfile does not move the date, which is the point —
 * "the content or structure of the actual demo" is the question being answered.
 * A commit that touches a test AND the source still counts, because git reports
 * the commit once any path survives the filter.
 *
 * Note that `index.html` is deliberately NOT excluded: it is the demo page in
 * most labs. schnorr-forge's 2026-08-15 commit is titled "Fix the CI this lab's
 * theme change broke" and is a three-line deletion from `index.html` — a real
 * structural edit to the page, correctly counted, despite the message sounding
 * like CI housekeeping. Read the diff, not the subject line.
 *
 * ABSENCE IS A THIRD STATE
 *
 * A lab whose date cannot be derived gets NO attribute and renders no date,
 * rather than a fabricated one or an inherited neighbour's. That is the same
 * rule the teaching layer applies to citation years: omitting a field is honest,
 * asserting an absence is not. `check` NAMES those labs rather than passing over
 * them, because a count of what a tool managed to date, with no list of what it
 * could not, is how this repository has hidden defects before.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const FLEET_ROOT = path.join(ROOT, '..');
const INDEX = path.join(ROOT, 'index.html');
const PINS = path.join(__dirname, 'lab-dates.json');

/* Paths that are NOT the demo. Everything else a commit touches counts as a
 * change to the demo's content or structure. Keep this list short and literal:
 * every addition narrows what counts as an update, and a too-eager exclusion
 * freezes a card's date at its creation, which is indistinguishable from a lab
 * nobody has touched. */
const NOT_THE_DEMO = [
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.github/**',
  'e2e/**',
  'test/**',
  'tests/**',
  '**/*.test.*',
  '**/*.spec.*',
  '.gitignore',
  'LICENSE',
  'playwright.config.ts',
  /* All markdown, which is documentation rather than the demo. Two reasons, and
   * the first is the stronger: the card links to the lab's PAGE, not its
   * repository, so a file the built site never serves did not change what a
   * visitor sees. The second is operational -- a scheduled task refreshes these
   * READMEs on its own, so counting them would put "Updated this month" on
   * cards whose demo nobody touched, which is the pushed_at problem again with a
   * different clock. Checked before excluding: only three labs keep a .md under
   * src/ at all, and NO lab imports markdown into its source, so no demo builds
   * its content from these. */
  '**/*.md',
];

const EXCLUDE_PATHSPEC = NOT_THE_DEMO.map((p) => `:(exclude)${p}`);

function git(dir, args) {
  return execFileSync('git', ['-C', dir, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 1 << 24,
  }).trim();
}

/** YYYY-MM from an ISO timestamp, or null. */
function monthOf(iso) {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})/.exec(iso);
  return m ? `${m[1]}-${m[2]}` : null;
}

/* The carded slugs, in the order the page lists them, read from the cards'
 * hrefs rather than from a list anyone maintains by hand. */
function cardedSlugs(html) {
  const slugs = [];
  const re = /<a class="(?:feature|project)-card[^>]*?href="https:\/\/systemslibrarian\.github\.io\/(crypto-lab-[a-z0-9-]+)\//g;
  let m;
  while ((m = re.exec(html)) !== null) if (!slugs.includes(m[1])) slugs.push(m[1]);
  return slugs;
}

/* created_at for every repo the account owns, in as few calls as the API allows.
 * Per-repo lookups would be 218 requests for a number one listing already holds. */
function fetchCreated() {
  const out = execFileSync('gh', [
    'api', 'users/systemslibrarian/repos?per_page=100', '--paginate',
    '--jq', '.[] | [.name, .created_at] | @tsv',
  ], { encoding: 'utf8', maxBuffer: 1 << 26 });
  const created = {};
  for (const line of out.split('\n')) {
    const [name, iso] = line.split('\t');
    if (name && iso) created[name] = iso;
  }
  return created;
}

/* `git log` in a --depth 1 clone reports the one commit that is present, so it
 * would answer this question CONFIDENTLY AND WRONGLY: a lab whose newest commit
 * is a lockfile bump would come back with no content date at all, and one whose
 * newest commit touched src/ would be dated to that commit whatever came before
 * it. The weekly job clones shallow, so this is the normal case there, not an
 * edge. Treated the way catalog-evidence treats an absent pinned commit:
 * UNREADABLE is a state, never a date and never "unchanged". */
function isShallow(dir) {
  try {
    return git(dir, ['rev-parse', '--is-shallow-repository']) === 'true';
  } catch {
    return false;
  }
}

/* The newest commit on the lab's own default branch that touched the demo.
 * origin/main, never the working tree: a colleague's uncommitted edit must not
 * date a card, the same reason clone-source.js reads committed state. */
function contentDate(slug) {
  const dir = path.join(FLEET_ROOT, slug);
  if (!fs.existsSync(path.join(dir, '.git'))) return { date: null, why: 'not cloned' };
  /* Refuse rather than answer from partial history -- see isShallow. The writer
   * has to refuse as well as the checker: a confident wrong date written into a
   * card is worse than a card with no date, because nothing downstream can tell
   * the two apart. */
  if (isShallow(dir)) return { date: null, why: 'shallow clone, history not present' };
  let ref = 'origin/main';
  try {
    git(dir, ['rev-parse', '--verify', '--quiet', ref]);
  } catch {
    try {
      ref = git(dir, ['symbolic-ref', '--short', 'HEAD']);
    } catch {
      return { date: null, why: 'no origin/main and no branch' };
    }
  }
  try {
    const iso = git(dir, ['log', '-1', '--format=%cI', ref, '--', '.', ...EXCLUDE_PATHSPEC]);
    if (!iso) return { date: null, why: 'no commit touches the demo' };
    const sha = git(dir, ['log', '-1', '--format=%H', ref, '--', '.', ...EXCLUDE_PATHSPEC]);
    return { date: iso, sha };
  } catch (e) {
    return { date: null, why: `git log failed: ${e.message.split('\n')[0]}` };
  }
}

function derive() {
  const html = fs.readFileSync(INDEX, 'utf8');
  const slugs = cardedSlugs(html);
  const created = fetchCreated();
  const labs = {};
  const undated = [];
  for (const slug of slugs) {
    const added = monthOf(created[slug]);
    const content = contentDate(slug);
    const updated = monthOf(content.date);
    if (!added) undated.push(`${slug} — no created_at from the API`);
    if (!updated) undated.push(`${slug} — ${content.why}`);
    labs[slug] = {
      added,
      updated,
      addedFrom: created[slug] || null,
      updatedFrom: content.date || null,
      updatedCommit: content.sha || null,
    };
  }
  return { slugs, labs, undated };
}

/* Stamp the two attributes onto each card, immediately AFTER the href.
 *
 * The position is not cosmetic. `readme-sync` and `catalog-sync` both match a
 * card with `data-category="..." href="..."` ADJACENT:
 *
 *   /<a class="((?:project|feature)-card[^"]*)" data-category="[^"]*" href="(...)"/
 *
 * so inserting anything between those two attributes takes catalog-sync to
 * "0 cards" and readme-sync to "Featured slug has no card" — two generators
 * silently describing an empty catalog. Measured, not guessed: the first version
 * of this writer inserted before the href and did exactly that. Appending after
 * the href keeps every existing parser's adjacency intact.
 *
 * A null date writes NO attribute and REMOVES one left by a previous run, so a
 * date can never outlive the fact it came from. */
const CARD_HEAD = /(<a class="(?:feature|project)-card[^"]*" data-category="[^"]*" href="https:\/\/systemslibrarian\.github\.io\/(crypto-lab-[a-z0-9-]+)\/")((?:\s+data-(?:added|updated)="[^"]*")*)/g;

function stamp(html, labs) {
  return html.replace(CARD_HEAD, (whole, head, slug) => {
    const rec = labs[slug] || {};
    const added = rec.added ? ` data-added="${rec.added}"` : '';
    const updated = rec.updated ? ` data-updated="${rec.updated}"` : '';
    return `${head}${added}${updated}`;
  });
}

function readAttrs(html) {
  const out = {};
  let m;
  CARD_HEAD.lastIndex = 0;
  while ((m = CARD_HEAD.exec(html)) !== null) {
    const slug = m[2];
    const tail = m[3] || '';
    const added = /data-added="([^"]*)"/.exec(tail);
    const updated = /data-updated="([^"]*)"/.exec(tail);
    out[slug] = { added: added ? added[1] : null, updated: updated ? updated[1] : null };
  }
  return out;
}

function selftest() {
  const fail = [];
  let pass = 0;
  const cases = [
    ['package-lock.json', true, 'a lockfile bump is not a content change'],
    ['.github/workflows/deploy.yml', true, 'a workflow edit is not a content change'],
    ['e2e/a11y.spec.ts', true, 'a test is not a content change'],
    ['README.md', true, 'a README refresh is not a demo change'],
    ['docs/threat-model.md', true, 'documentation is not a demo change'],
    ['src/main.ts', false, 'source IS a content change'],
    ['index.html', false, 'the demo page IS a content change'],
    ['demos/thing/src/app.ts', false, 'a nested demo source IS a content change'],
    ['web-demo/src/crypto/aes.ts', false, 'an unusual source layout IS a content change'],
  ];
  /* Mirror of git's pathspec matching for the patterns in NOT_THE_DEMO: an exact
   * path, a `dir/**` prefix, or a `**\/*.ext.*` basename rule. Kept deliberately
   * small -- it exists to pin the INTENT of the list, and the fleet-wide numbers
   * in the header are what prove the real matching. */
  const excluded = (file) => NOT_THE_DEMO.some((pat) => {
    if (pat.endsWith('/**')) return file.startsWith(pat.slice(0, -2));
    if (pat.startsWith('**/')) {
      const tail = pat.slice(3);
      const base = file.split('/').pop();
      if (tail.startsWith('*.') && tail.endsWith('.*')) return base.includes(tail.slice(1, -2) + '.');
      if (tail.startsWith('*.')) return base.endsWith(tail.slice(1));
      return base === tail;
    }
    return file === pat;
  });
  for (const [file, want, why] of cases) {
    const got = excluded(file);
    if (got !== want) fail.push(`${file}: expected excluded=${want}, got ${got}`);
    else { pass++; console.log(`  ok  ${file} — ${why}`); }
  }
  if (!cases.some(([, w]) => w)) fail.push('no case exercises an exclusion');
  if (!cases.some(([, w]) => !w)) fail.push('no case is a content change: the rule is never shown staying quiet');
  console.log(fail.length ? `\n${pass} passed, ${fail.length} FAILED` : `\n${pass} passed, 0 failed`);
  for (const m of fail) console.log(`  FAIL  ${m}`);
  return fail.length ? 1 : 0;
}

function main() {
  const mode = process.argv[2];
  if (mode === 'selftest') return selftest();

  if (mode === 'check') {
    if (!fs.existsSync(PINS)) {
      console.log('tools/lab-dates.json is missing. Run: node tools/lab-dates.js');
      return 1;
    }
    const pins = JSON.parse(fs.readFileSync(PINS, 'utf8'));
    const html = fs.readFileSync(INDEX, 'utf8');
    const slugs = cardedSlugs(html);
    const onCards = readAttrs(html);
    const problems = [];

    for (const slug of slugs) {
      const pin = pins.labs[slug];
      if (!pin) { problems.push(`${slug} — carded, absent from tools/lab-dates.json`); continue; }
      const card = onCards[slug] || {};
      if ((pin.added || null) !== (card.added || null)) {
        problems.push(`${slug} — card says added=${card.added || 'none'}, pin says ${pin.added || 'none'}`);
      }
      if ((pin.updated || null) !== (card.updated || null)) {
        problems.push(`${slug} — card says updated=${card.updated || 'none'}, pin says ${pin.updated || 'none'}`);
      }
    }
    for (const slug of Object.keys(pins.labs)) {
      if (!slugs.includes(slug)) problems.push(`${slug} — pinned, but no card links to it`);
    }

    /* Beyond "the HTML matches the pin", ask the labs whether the pin is still
     * TRUE. That is the check that catches a demo changing after the last
     * write, and it is free -- the clones are already on disk. */
    const stale = [];
    const unreadable = [];
    for (const slug of slugs) {
      const pin = pins.labs[slug];
      if (!pin) continue;
      const dir = path.join(FLEET_ROOT, slug);
      if (!fs.existsSync(path.join(dir, '.git'))) { unreadable.push(`${slug} — not cloned`); continue; }
      if (isShallow(dir)) { unreadable.push(`${slug} — shallow clone, history not present`); continue; }
      const now = monthOf(contentDate(slug).date);
      if (now && now !== pin.updated) stale.push(`${slug} — pinned ${pin.updated || 'none'}, lab now ${now}`);
    }

    console.log(`Cards dated: ${slugs.length} | pinned: ${Object.keys(pins.labs).length} | pinned ${pins.generated}`);
    if (unreadable.length) {
      console.log(`\nDATES-UNREADABLE (${unreadable.length}) — could not look, so NOT counted as current:`);
      for (const u of unreadable.slice(0, 10)) console.log(`  ${u}`);
      if (unreadable.length > 10) console.log(`  …and ${unreadable.length - 10} more`);
    }
    if (stale.length) {
      console.log(`\nSTALE (${stale.length}) — the demo changed after the pin. Fix with: node tools/lab-dates.js`);
      for (const t of stale) console.log(`  ${t}`);
    }
    const undated = Object.entries(pins.labs).filter(([, v]) => !v.added || !v.updated);
    if (undated.length) {
      console.log(`\nNo date derived (${undated.length}) — these render NO date rather than a guessed one:`);
      for (const [slug, v] of undated) {
        console.log(`  ${slug}  added=${v.added || 'none'} updated=${v.updated || 'none'}`);
      }
    }
    if (problems.length) {
      console.log(`\nDRIFT (${problems.length}) — fix with: node tools/lab-dates.js`);
      for (const p of problems) console.log(`  ${p}`);
    }
    if (problems.length || stale.length) return 1;
    const caveat = unreadable.length ? ` (${unreadable.length} could not be re-derived, named above)` : '';
    console.log(`\nEvery card's dates match the repository they describe${caveat}.`);
    return 0;
  }

  const { slugs, labs, undated } = derive();
  const payload = {
    note: 'Generated by tools/lab-dates.js. added = the repo\'s created_at. updated = the newest commit on origin/main that touched the demo, excluding lockfiles, workflows, tests and all markdown -- see the header for why pushed_at is not used.',
    generated: new Date().toISOString().slice(0, 10),
    excludes: NOT_THE_DEMO,
    labs,
  };
  fs.writeFileSync(PINS, `${JSON.stringify(payload, null, 1)}\n`);

  const html = fs.readFileSync(INDEX, 'utf8');
  const next = stamp(html, labs);
  if (next !== html) fs.writeFileSync(INDEX, next);

  const months = {};
  for (const v of Object.values(labs)) if (v.updated) months[v.updated] = (months[v.updated] || 0) + 1;
  console.log(`Dated ${slugs.length} cards. index.html ${next !== html ? 'rewritten' : 'already in step'}.`);
  console.log(`Last demo change by month: ${Object.entries(months).sort().map(([m, n]) => `${m}=${n}`).join('  ')}`);
  if (undated.length) {
    console.log(`\nNo date derived (${undated.length}) — no attribute written, so these render no date:`);
    for (const u of undated) console.log(`  ${u}`);
  }
  return 0;
}

process.exit(main());
