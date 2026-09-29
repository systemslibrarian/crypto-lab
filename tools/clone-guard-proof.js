#!/usr/bin/env node
/*
 * clone-guard-proof.js — prove a dirty sibling clone cannot change generated output.
 *
 * Run: node tools/clone-guard-proof.js
 * Prevents: a generator silently deriving this repo's tracked files from another lane's uncommitted work
 * Reads: a throwaway git repository it creates under os.tmpdir(); tools/clone-source.js
 *
 * WHY A PROOF AND NOT A NOTE
 *
 * The staging rule — stage explicit paths, never `git add -A` — is about what you
 * ADD. This is about what a generator READS, and it needs no `git add` at all: a
 * tool that derives a tracked file from the sibling clones will read whatever is
 * on disk there, including a colleague's half-finished edit, and write it into
 * output you commit under your own name. That happened on 2026-09-29 and was
 * caught by a card-by-card diff, which is luck rather than a control.
 *
 * So the guard is asserted here the way dispatch-proof.js asserts its own: build
 * the situation, mutate it, and require the tool to behave. Each check names what
 * it would catch.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const { sourceRoot, tornSnapshot, forget } = require('./clone-source.js');

let pass = 0;
const fail = [];
function check(name, ok, detail) {
  if (ok) { pass += 1; console.log(`  ok    ${name}`); }
  else { fail.push(name); console.log(`  FAIL  ${name}${detail ? `\n          ${detail}` : ''}`); }
}

const git = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

function makeRepo(root, committed) {
  fs.mkdirSync(path.join(root, 'src'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src', 'cipher.ts'), committed);
  execFileSync('git', ['init', '-q', '-b', 'main', root], { stdio: ['ignore', 'ignore', 'ignore'] });
  git(root, 'config', 'user.email', 'proof@example.invalid');
  git(root, 'config', 'user.name', 'clone-guard proof');
  git(root, 'add', 'src/cipher.ts');
  git(root, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'committed state');
  return root;
}

/* The generated artefact this proof stands in for: the set of algorithm names a
   scanner would derive from a lab's files. Deliberately trivial - what is being
   proved is WHICH BYTES the scanner is handed, not how it reads them. */
function derive(readRoot) {
  const out = new Set();
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(readRoot, rel), { withFileTypes: true })) {
      if (e.name === '.git') continue;
      const next = path.join(rel, e.name);
      if (e.isDirectory()) walk(next);
      else for (const m of fs.readFileSync(path.join(readRoot, next), 'utf8').matchAll(/\b(SM4|ZUC|Kupyna|Serpent)\b/g)) out.add(m[1]);
    }
  };
  walk('');
  return [...out].sort().join(',');
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'clone-guard-'));
process.on('exit', () => { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* best effort */ } });

console.log('CLONE GUARD — a dirty sibling clone must not reach generated output\n');

/* C1  the baseline: a clean clone derives its committed content. */
const clean = makeRepo(path.join(tmp, 'crypto-lab-fixture-clean'), 'export function sm4Encrypt() {} // SM4\n');
const baseline = derive(sourceRoot(clean).root);
check('C1  clean clone derives its committed content', baseline === 'SM4', `got "${baseline}"`);
check('C2  a clean clone is read from the working tree, not exported', sourceRoot(clean).from === 'worktree');

/* C3  THE ONE THAT MATTERS. An uncommitted edit adds an algorithm the committed
       tree does not contain. Output must not move. Without the guard this reads
       "SM4,ZUC" and that string lands in index.html under the wrong author. */
const dirty = makeRepo(path.join(tmp, 'crypto-lab-fixture-dirty'), 'export function sm4Encrypt() {} // SM4\n');
fs.appendFileSync(path.join(dirty, 'src', 'cipher.ts'), 'export function zucKeystream() {} // ZUC\n');
const src = sourceRoot(dirty);
check('C3  an uncommitted EDIT does not change generated output',
  derive(src.root) === 'SM4',
  `committed "SM4", with the uncommitted edit got "${derive(src.root)}"`);
check('C4  and the dirty clone is reported as read from HEAD', src.from === 'HEAD', `from="${src.from}"`);

/* C5  an UNTRACKED file is dirt too. The scanner walks directories, so a file
       nobody has added is read exactly like a tracked one - which is why the
       dirty test deliberately does not pass --untracked-files=no. */
const untracked = makeRepo(path.join(tmp, 'crypto-lab-fixture-untracked'), 'export function sm4Encrypt() {} // SM4\n');
fs.writeFileSync(path.join(untracked, 'src', 'extra.ts'), 'export function kupynaHash() {} // Kupyna\n');
check('C5  an UNTRACKED file does not change generated output',
  derive(sourceRoot(untracked).root) === 'SM4', `got "${derive(sourceRoot(untracked).root)}"`);

/* C6  a DELETED file is dirt too, in the other direction: without the guard the
       lab loses an algorithm it still implements on main. */
const deleted = makeRepo(path.join(tmp, 'crypto-lab-fixture-deleted'), 'export function sm4Encrypt() {} // SM4\n');
fs.rmSync(path.join(deleted, 'src', 'cipher.ts'));
check('C6  a DELETED file does not change generated output',
  derive(sourceRoot(deleted).root) === 'SM4', `got "${derive(sourceRoot(deleted).root)}"`);

/* C7  the negative control. If the committed tree really changes, output MUST
       move - otherwise this proof would pass on a guard that returned a constant
       and nobody would know. */
const moved = makeRepo(path.join(tmp, 'crypto-lab-fixture-moved'), 'export function sm4Encrypt() {} // SM4\n');
fs.appendFileSync(path.join(moved, 'src', 'cipher.ts'), 'export function serpentEncrypt() {} // Serpent\n');
git(moved, 'add', 'src/cipher.ts');
git(moved, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'committed a second algorithm');
check('C7  a COMMITTED change does change output (the guard is not a constant)',
  derive(sourceRoot(moved).root) === 'SM4,Serpent', `got "${derive(sourceRoot(moved).root)}"`);

/* C8  an empty repository has no HEAD to export. It is refused BY NAME rather
       than read anyway - "could not look" must not be published as "nothing
       there". Three labs in this fleet are in exactly this state. */
const empty = path.join(tmp, 'crypto-lab-fixture-empty');
fs.mkdirSync(empty, { recursive: true });
execFileSync('git', ['init', '-q', '-b', 'main', empty], { stdio: ['ignore', 'ignore', 'ignore'] });
fs.writeFileSync(path.join(empty, 'stray.ts'), '// ZUC\n');
const e = sourceRoot(empty);
check('C8  an empty repository with a stray file is REFUSED, not read', e.from === 'refused' && e.root === null, `from="${e.from}"`);

/* C9  the race the cache leaves open, and the detector that must catch it. A
       clone read as CLEAN that is dirty by the end of the run means the bytes
       already scanned are a mix of two states. */
const raced = makeRepo(path.join(tmp, 'crypto-lab-fixture-raced'), 'export function sm4Encrypt() {} // SM4\n');
check('C9  a clone read clean is not reported torn while it stays clean',
  (sourceRoot(raced).from === 'worktree') && !tornSnapshot().some((t) => t.slug.endsWith('raced')));
fs.appendFileSync(path.join(raced, 'src', 'cipher.ts'), '// edited by another lane mid-run\n');
check('C10 a clone that goes dirty AFTER being read clean is reported as a TORN SNAPSHOT',
  tornSnapshot().some((t) => t.slug.endsWith('raced')),
  `torn=${JSON.stringify(tornSnapshot().map((t) => t.slug))}`);

/* C11 the cache is per-clone and re-reading after `forget` sees the new truth,
       so the detector above is reporting a real state rather than a stale one. */
forget(raced);
check('C11 after forget(), the same clone is now read from HEAD', sourceRoot(raced).from === 'HEAD');
check('C12 and still derives its committed content', derive(sourceRoot(raced).root) === 'SM4');

console.log(`\n${pass} passed, ${fail.length} failed.`);
if (fail.length) { console.error(`FAILED: ${fail.join('; ')}`); process.exit(1); }
