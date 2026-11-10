#!/usr/bin/env node
/**
 * source-root-census.js — can the substantive-change rule SEE each lab's
 * source at all?
 *
 * Run: node tools/source-root-census.js check
 * Prevents: a lab whose implementation lives where the rule does not look, so a change to it never marks the review pin stale and a recorded judgement keeps applying over changed source
 * Reads: index.html (carded labs), the sibling clones at HEAD, tools/source-roots.json
 *
 * This checker exists because that happened. crypto-lab-ratchet-wire keeps its
 * entire source under `ratchet-wire/`, which SUBSTANTIVE does not match; a
 * rename landed in ratchet-wire/src/crypto/hybrid-session.ts on 2026-11-10 and
 * the pin did not go stale. Nothing reported it, because nothing was asking.
 * Four more labs were in the same position, three of them pinned, and they were
 * found only by hand. A sixth would have appeared the same silent way.
 *
 * The question asked of every carded lab is deliberately crude and therefore
 * hard to get wrong: run the real rule over the lab's tracked files, and if it
 * matches no file that is CODE, the rule cannot see this lab's implementation.
 * That is a finding about this repository's configuration, not about the lab.
 *
 * It must be CODE, not merely a match. The first version of this checker asked
 * only whether the rule matched any tracked file, and crypto-lab-ratchet-wire
 * -- the lab the checker was written for -- passed it with its declaration
 * REMOVED, because `README.md` is in SUBSTANTIVE and every lab has one. A
 * census satisfied by a README cannot see the blindness it exists to find. The
 * control that caught this is in tests/source-root-census.test.cjs.
 *
 * THREE states, not two. A clone that cannot be read has not been asked, which
 * is neither a pass nor a finding -- the same rule this repository applies
 * everywhere else -- and it is reported by name and fails the run, because an
 * unanswered question must not read as a clean one.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { countsAsSubstantive, demoHasSrcFrom, rootsFor, DECLARED } = require('./moved-substantively.js');

/* Implementation languages, matching the scanner's own file-kind list. A doc or
   a page alone does not make a lab's source visible -- except where the page IS
   the implementation, which is why such a lab declares that exact file as a
   root and the declaration is checked against the tracked tree below. */
const CODE = /\.(ts|tsx|js|mjs|cjs|rs|go|py|c|cc|cpp|h|hpp|java|cs|swift|wasm|wat)$/i;

const ROOT = __dirname.replace(/\/tools$/, '');
const REPOS = path.join(ROOT, '..');
const HTML = path.join(ROOT, 'index.html');

function cardedSlugs() {
  const html = fs.readFileSync(HTML, 'utf8');
  return [...new Set([...html.matchAll(/href="https:\/\/systemslibrarian\.github\.io\/([^/"]+)\//g)]
    .map((m) => m[1]))].filter((s) => s !== 'crypto-lab').sort();
}

function tracked(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'ls-tree', '-r', '--name-only', 'HEAD'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 128 * 1024 * 1024 })
      .split('\n').filter(Boolean);
  } catch { return null; }
}

function census() {
  const blind = [];
  const unreadable = [];
  const staleDeclaration = [];
  const seen = [];
  for (const slug of cardedSlugs()) {
    const dir = path.join(REPOS, slug);
    if (!fs.existsSync(path.join(dir, '.git'))) { unreadable.push({ slug, why: 'no checkout beside this repo' }); continue; }
    const files = tracked(dir);
    if (files === null) { unreadable.push({ slug, why: 'git could not list the tree at HEAD' }); continue; }
    const roots = rootsFor(slug);
    const has = demoHasSrcFrom(files);
    const matched = files.filter((f) => countsAsSubstantive(f, has, roots));
    const visible = matched.filter((f) => CODE.test(f));
    if (!visible.length) blind.push({ slug, tracked: files.length, roots, matchedNonCode: matched.slice(0, 4) });
    else seen.push({ slug, visible: visible.length, declared: roots.length > 0 });
    /* A declaration that matches nothing is its own finding: the lab moved its
       source and the entry was left behind, which puts the lab one commit away
       from being blind again while looking configured. */
    if (roots.length) {
      const dead = roots.filter((r) => !files.some((f) => (r.endsWith('/') ? f.startsWith(r) : f === r)));
      if (dead.length) staleDeclaration.push({ slug, dead });
    }
  }
  return { blind, unreadable, staleDeclaration, seen };
}

function main() {
  const mode = process.argv[2] || 'check';
  const { blind, unreadable, staleDeclaration, seen } = census();
  const declared = seen.filter((s) => s.declared).length;
  console.log(`Carded labs examined: ${seen.length + blind.length + unreadable.length}. `
    + `The rule sees source in ${seen.length}, ${declared} of them through a declared root in tools/source-roots.json.`);

  if (blind.length) {
    console.error(`\nSOURCE-ROOT-BLIND (${blind.length}) — the substantive-change rule matches NONE of this lab's`);
    console.error('tracked files, so a change to its source would never mark its review pin stale and a');
    console.error('recorded judgement would keep applying over source that has changed.');
    for (const b of blind) {
      console.error(`  ${b.slug.padEnd(34)} ${b.tracked} tracked file(s), ${b.roots.length ? `declared roots ${b.roots.join(', ')}` : 'no declared roots'}`);
      if (b.matchedNonCode.length) {
        console.error(`      the rule matches only non-code here: ${b.matchedNonCode.join(', ')}`);
      }
    }
    console.error('Declare the lab\'s source root in tools/source-roots.json, with the reason it is not');
    console.error('one of the defaults, then re-run.');
  }
  if (staleDeclaration.length) {
    console.error(`\nDECLARATION-MATCHES-NOTHING (${staleDeclaration.length}) — a declared root matches no tracked file,`);
    console.error('so the lab has moved its source and the entry was left behind.');
    for (const d of staleDeclaration) console.error(`  ${d.slug.padEnd(34)} ${d.dead.join(', ')}`);
  }
  if (unreadable.length) {
    console.error(`\nNOT ASKED (${unreadable.length}) — the question could not be put to these labs. Not a finding about`);
    console.error('them, and not a pass either.');
    for (const u of unreadable) console.error(`  ${u.slug.padEnd(34)} ${u.why}`);
  }
  if (mode !== 'check') return 0;
  return blind.length || staleDeclaration.length || unreadable.length ? 1 : 0;
}

if (require.main === module) process.exit(main());
module.exports = { census, cardedSlugs };
