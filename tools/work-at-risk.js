#!/usr/bin/env node
/*
 * work-at-risk.js — which repositories on this machine hold work no remote has.
 *
 * Run: node tools/work-at-risk.js check
 * Prevents: committed work existing only on this laptop, and a count derived from a stale tracking ref being read as established
 * Reads: every immediate child directory of the fleet root (default ~/repos) — each one's `git rev-parse --git-dir`, `git remote -v`, `git for-each-ref`, `git rev-list --all --not --remotes`; with --verify, a read-only `git ls-remote` per repository
 *
 * THREE REQUIREMENTS, EACH THE FIX FOR A SPECIFIC WRONG ANSWER
 *
 * 1. A COUNT FROM A STALE TRACKING REF IS UNVERIFIED, NOT ESTABLISHED.
 *    The previous inspector reported crypto-lab's sibling `testing-agents` as
 *    "1 (understated)". That number came from the repo's own remote-tracking
 *    refs after a `--fetch` for that remote had FAILED, so the refs were frozen
 *    at whatever they held last. A frozen ref answers confidently and the answer
 *    is about a remote state nobody confirmed. The honest output is a STATE:
 *    "6 unverified (remote refused)". That is this file's version of the rule the
 *    whole repository runs on — could not look is never nothing there — and it
 *    is why verification is a separate, opt-in step whose failure is loud.
 *
 * 2. A LOCAL-PATH OR file:// ORIGIN IS NO REMOTE.
 *    `crypto-lab-fork-audit`'s origin is `/Users/gmcas/repos/SP800-90B_Entropy
 *    Assessment`. Pushing there moves nothing off this machine, so counting it as
 *    "has a remote, 0 at risk" is the single most dangerous false negative this
 *    tool can produce: it is the shape where everything looks safe and nothing
 *    left the laptop. A repo whose only remotes are local paths is reported as
 *    NO-REMOTE, with the path named.
 *
 * 3. ONE TABLE, BUCKETS DISJOINT, SUMMING TO THE TOTAL.
 *    The previous census printed buckets that did not add up, which makes every
 *    number in it unreadable — a reader cannot tell whether a repo was
 *    double-counted or dropped. Every repository lands in EXACTLY ONE bucket
 *    here, `assertDisjoint` proves it on every run, and the run refuses rather
 *    than printing a table that does not reconcile.
 *
 * WHAT "AT-RISK" MEANS, PRECISELY, AND HOW IT WAS CHECKED
 *
 * Reachable from a local ref and from NO LIVE BRANCH of any off-machine remote.
 * That is the question worth asking, and it is not the same as "the object is
 * gone". The first full run reported 105 at-risk, and the obvious cross-check
 * SEEMED to refute all of it: `gh api repos/<slug>/commits/<sha>` returned 200
 * for five of five sampled commits. That reading is wrong, and keeping the wrong
 * one here matters more than the right one. GitHub's commits endpoint resolves
 * any sha in the repository's object store, INCLUDING commits nothing points at
 * -- objects kept alive by a closed pull request or a deleted branch. It answers
 * "does this object exist", not "is it on a branch".
 *
 * The reading that settles it is `compare/<default>...<sha>`: all four re-sampled
 * commits came back `status=diverged, ahead=1`, so none is an ancestor of its
 * remote's default branch. Combined with verification having already established
 * that every live head matches its tracking ref, a commit that survives
 * `--not --remotes` is on no live branch of that remote. The 105 stands.
 *
 * So: an at-risk commit is usually still RECOVERABLE from GitHub's object store
 * today. It is at risk because nothing references it, and unreferenced objects are
 * not a retention promise.
 *
 * WHY IT DOES NOT FETCH
 *
 * A fetch WRITES to a repository it does not own — it moves tracking refs in
 * someone else's checkout, possibly mid-edit. `git ls-remote` asks the same
 * question read-only, so --verify compares each tracking ref against the live
 * remote and never touches the repo. Without --verify every remote-backed repo
 * is UNVERIFIED by construction, which is the honest default: the on-disk refs
 * are evidence of what was true at the last fetch and of nothing since.
 *
 * HELD REPOSITORIES ARE A STATE, NOT A SKIP
 *
 * Some repositories are the owner's to touch. They are declared in HELD below,
 * reported in their own bucket with the reason, and no remote call is made for
 * them — but they stay IN the denominator, because a repo that vanishes from a
 * census is the defect this fleet keeps re-finding.
 *
 * USAGE
 *   node tools/work-at-risk.js                 census from on-disk refs; nothing verified
 *   node tools/work-at-risk.js --verify        also ls-remote each repo (read-only)
 *   node tools/work-at-risk.js check           exit 1 if anything is AT-RISK or NO-REMOTE
 *   node tools/work-at-risk.js --json          machine-readable
 *   node tools/work-at-risk.js --root <dir>    inspect somewhere else
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

/** Repositories the owner handles personally. In the denominator, never called. */
const HELD = new Map([
  ['.site-fleet-inspect.G73oCd', 'the deleted ChatGPT Site source for crypto-lab-fleet; the only surviving copy of its 36-commit history, and the owner decides what happens to it'],
  ['testing-agents', 'its GitHub remote is gone (404, no Location, verified against a private-repo control); re-pointing it is the owner\'s call'],
]);

/** Buckets, in report order. Disjoint and exhaustive by construction. */
const BUCKETS = ['at-risk', 'no-remote', 'unverified', 'safe', 'held', 'not-a-repo'];

const DEFAULT_ROOT = path.join(process.env.HOME || '/', 'repos');

/* git exits 128 for everything -- an absent ref, a bad range, a directory that is
   not a repository -- so a non-zero exit never decides readability by itself.
   Readability is established once per repo with `rev-parse --git-dir`, and only
   inside a repo that answered does a later failure mean anything. CLAUDE.md's
   rule, and the reason hasCommitState in catalog-evidence.js is shaped this way. */
function git(dir, args, timeout = 20000) {
  const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', timeout, maxBuffer: 32 * 1024 * 1024 });
  if (r.error) return { readable: false, why: r.error.code === 'ETIMEDOUT' ? 'timed out' : r.error.message };
  if (r.status !== 0) return { readable: false, why: (r.stderr || '').trim().split('\n')[0] || `git exit ${r.status}` };
  return { readable: true, value: r.stdout };
}

const isRepo = (dir) => git(dir, ['rev-parse', '--git-dir'], 10000).readable;

/** A remote that is a local path or file:// moves nothing off this machine. */
function classifyRemotes(dir) {
  const r = git(dir, ['remote', '-v']);
  if (!r.readable) return { readable: false, why: r.why };
  const urls = new Map();
  for (const line of r.value.split('\n')) {
    const m = /^(\S+)\s+(\S+)\s+\((fetch|push)\)$/.exec(line.trim());
    if (m) urls.set(m[1], m[2]);
  }
  const offMachine = [];
  const local = [];
  for (const [name, url] of urls) {
    /* file:// and anything that resolves to a path on this disk. A bare absolute
       or relative path is a local remote; scp-style user@host:path is not. */
    const isFileUrl = /^file:\/\//i.test(url);
    const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(url);
    const isScpLike = /^[^/]+@[^/]+:/.test(url);
    const looksLikePath = !hasScheme && !isScpLike;
    if (isFileUrl || looksLikePath) local.push({ name, url });
    else offMachine.push({ name, url });
  }
  return { readable: true, offMachine, local, count: urls.size };
}

/** Commits on any local ref and on no remote-tracking ref.
 *
 *  `--all --not --remotes`, with no `--stdin` anywhere. `git rev-list --stdin`
 *  ADDS every rev it reads unless each is `^`-prefixed, so a loop piping branch
 *  shas in returns a LARGER number and never looks like a failure -- measured
 *  713 -> 743 in ~/repos/SP800-90B_EntropyAssessment. This form needs neither. */
function localOnlyCount(dir) {
  const r = git(dir, ['rev-list', '--count', '--all', '--not', '--remotes']);
  if (!r.readable) return { readable: false, why: r.why };
  const n = Number(r.value.trim());
  return Number.isInteger(n) ? { readable: true, count: n } : { readable: false, why: `unparsable count ${JSON.stringify(r.value)}` };
}

/** Do the on-disk tracking refs still match the live remote? Read-only. */
function verifyTracking(dir, remoteName) {
  const live = git(dir, ['ls-remote', '--heads', '--tags', remoteName], 45000);
  if (!live.readable) return { verified: false, why: `ls-remote ${remoteName}: ${live.why}` };
  const liveRefs = new Map();
  for (const line of live.value.split('\n')) {
    const m = /^([0-9a-f]{40})\s+(refs\/\S+)$/.exec(line.trim());
    /* ^{} is a tag dereference, not a ref the tracking side mirrors. */
    if (m && !m[2].endsWith('^{}')) liveRefs.set(m[2], m[1]);
  }
  const disk = git(dir, ['for-each-ref', '--format=%(objectname) %(refname:lstrip=3)', `refs/remotes/${remoteName}`]);
  if (!disk.readable) return { verified: false, why: `for-each-ref: ${disk.why}` };
  const diskHeads = new Map();
  for (const line of disk.value.split('\n')) {
    const m = /^([0-9a-f]{40})\s+(.+)$/.exec(line.trim());
    if (m && m[2] !== 'HEAD') diskHeads.set(`refs/heads/${m[2]}`, m[1]);
  }
  const liveHeads = new Map([...liveRefs].filter(([k]) => k.startsWith('refs/heads/')));
  const mismatched = [];
  for (const [ref, sha] of liveHeads) {
    if (diskHeads.get(ref) !== sha) mismatched.push(ref.replace('refs/heads/', ''));
  }
  for (const ref of diskHeads.keys()) if (!liveHeads.has(ref)) mismatched.push(`${ref.replace('refs/heads/', '')} (gone)`);
  if (mismatched.length) {
    /* A DIFFERENT state from a refusal, and it was mislabelled as one on the
       first full run: 43 repositories came back "remote refused" when the remote
       had answered perfectly and the only disagreement was a merged Dependabot
       branch this clone still tracks. Both make the count unverified -- a tracking
       ref the remote no longer has can only make the local-only count SMALLER, so
       it risks UNDER-reporting at-risk work -- but calling an answered query a
       refusal is the kind of confident wrong label this tool exists to avoid. */
    return { verified: false, stale: true,
      why: `${mismatched.length} tracking ref(s) disagree with ${remoteName}: ${mismatched.slice(0, 4).join(', ')}` };
  }
  return { verified: true, heads: liveHeads.size };
}

/** THE BUCKET DECISION, with every probe injected.
 *
 * Separated from the git calls on purpose, and the reason is a fixture that could
 * not be built. To test at-risk and safe end to end a fixture needs a remote that
 * is BOTH network-shaped and reachable, and there is no honest way to have both
 * locally: a path is correctly classified no-remote, and a
 * `url.<path>.insteadOf` rewrite does not help because `git remote -v` DISPLAYS
 * the rewritten URL -- which is the right thing for this tool to read, since a
 * repo whose https origin is silently rewritten to a local path really does push
 * nowhere. Rather than stand up a git daemon to satisfy a test, the decision is
 * pure and each probe is tested against real repositories on its own.
 */
function decide({ name, held, repo, remotes, localOnly, verify, verifyRemote }) {
  if (held) return { name, bucket: 'held', why: held };
  if (!repo) return { name, bucket: 'not-a-repo' };
  if (!remotes.readable) return { name, bucket: 'unverified', why: `remotes unreadable: ${remotes.why}` };
  if (!localOnly.readable) return { name, bucket: 'unverified', why: `rev-list unreadable: ${localOnly.why}` };

  const count = localOnly.count;
  if (!remotes.offMachine.length) {
    const how = remotes.local.length
      ? `only local remote(s): ${remotes.local.map((r) => `${r.name} -> ${r.url}`).join(', ')}`
      : 'no remote at all';
    return { name, bucket: 'no-remote', count, why: how };
  }
  if (!verify) {
    return { name, bucket: 'unverified', count,
      why: `${count} local-only commit(s) by on-disk tracking refs; not verified (run --verify)` };
  }
  /* Verify EVERY off-machine remote. One refusing is enough to make the count
     unverified: the commits might be on that remote and the refs cannot say. */
  for (const r of remotes.offMachine) {
    const v = verifyRemote(r.name);
    if (!v.verified) {
      const reason = v.stale ? 'tracking refs stale' : 'remote refused';
      return { name, bucket: 'unverified', count, why: `${count} unverified (${reason}) — ${v.why}` };
    }
  }
  const against = remotes.offMachine.map((r) => r.name).join(', ');
  return count > 0
    ? { name, bucket: 'at-risk', count, why: `${count} commit(s) on no remote, verified against ${against}` }
    : { name, bucket: 'safe', count: 0, why: `0 local-only commits, verified against ${against}` };
}

/** One repository's verdict: gather the probes, then decide. */
function inspect(root, name, { verify = false } = {}) {
  const dir = path.join(root, name);
  const held = HELD.get(name) || null;
  if (held) return decide({ name, held });
  const repo = isRepo(dir);
  if (!repo) return decide({ name, repo: false });
  return decide({
    name,
    repo: true,
    remotes: classifyRemotes(dir),
    localOnly: localOnlyCount(dir),
    verify,
    verifyRemote: (remoteName) => verifyTracking(dir, remoteName),
  });
}

/** Every immediate child DIRECTORY, dotted ones included: the temp repo is
 *  dotted, and a census that skips dotted entries would have missed the one
 *  repository on this machine whose history exists nowhere else. */
function children(root) {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

/** The table must reconcile or the run refuses. A census that does not add up
 *  cannot be read: a reader cannot tell a double-count from a dropped row. */
function assertDisjoint(rows, total) {
  const seen = new Map();
  for (const r of rows) {
    if (seen.has(r.name)) throw new Error(`work-at-risk: ${r.name} appears twice — buckets are not disjoint`);
    if (!BUCKETS.includes(r.bucket)) throw new Error(`work-at-risk: ${r.name} has unknown bucket ${JSON.stringify(r.bucket)}`);
    seen.set(r.name, r.bucket);
  }
  const counts = Object.fromEntries(BUCKETS.map((b) => [b, rows.filter((r) => r.bucket === b).length]));
  const sum = BUCKETS.reduce((n, b) => n + counts[b], 0);
  if (sum !== total) throw new Error(`work-at-risk: buckets sum to ${sum}, not the ${total} directories inspected`);
  return counts;
}

function main(argv = process.argv.slice(2)) {
  const ri = argv.indexOf('--root');
  const root = ri >= 0 && argv[ri + 1] ? path.resolve(argv[ri + 1]) : DEFAULT_ROOT;
  const verify = argv.includes('--verify');
  const wantJson = argv.includes('--json');
  const check = argv.includes('check');

  let names;
  try { names = children(root); }
  catch (e) {
    console.error(`work-at-risk: cannot read ${root}: ${e.message}`);
    console.error('That is a read failure, not an empty machine, and it must not pass as one.');
    return 2;
  }
  if (!names.length) {
    console.error(`work-at-risk: ${root} holds no directories. Refusing to report a clean census over nothing.`);
    return 2;
  }

  const rows = names.map((n) => inspect(root, n, { verify }));
  let counts;
  try { counts = assertDisjoint(rows, names.length); }
  catch (e) { console.error(e.message); return 2; }

  if (wantJson) {
    console.log(JSON.stringify({ root, verified: verify, directories: names.length, counts, rows }, null, 2));
    return check && (counts['at-risk'] || counts['no-remote']) ? 1 : 0;
  }

  console.log(`work-at-risk — ${root}`);
  console.log(`${verify ? 'VERIFIED against each live remote with read-only ls-remote.' : 'NOT VERIFIED: counts come from on-disk tracking refs. Run --verify to confirm them.'}`);
  console.log('');
  console.log('  ARITHMETIC');
  console.log(`    ${String(names.length).padStart(4)}  immediate child directories of the root`);
  for (const b of BUCKETS) console.log(`    ${String(counts[b]).padStart(4)}  ${b}`);
  console.log(`    ----  ${BUCKETS.map((b) => counts[b]).join(' + ')} = ${BUCKETS.reduce((n, b) => n + counts[b], 0)}`);
  console.log('    every directory is in exactly one bucket; the run refuses if they do not reconcile');

  for (const b of ['at-risk', 'no-remote', 'unverified', 'held']) {
    const list = rows.filter((r) => r.bucket === b);
    if (!list.length) continue;
    const headline = {
      'at-risk': 'AT-RISK — committed work that is on NO remote, verified',
      'no-remote': 'NO-REMOTE — nothing here can reach another machine (a local path is not a remote)',
      unverified: 'UNVERIFIED — a state, not a number: nothing here is established',
      held: 'HELD — the owner\'s to touch; in the denominator, no remote call made',
    }[b];
    console.log(`\n${b.toUpperCase()} (${list.length}) — ${headline.split(' — ')[1]}`);
    const show = b === 'unverified' && !verify ? list.slice(0, 12) : list;
    for (const r of show) console.log(`    ${r.name.padEnd(46)} ${r.why || ''}`);
    if (show.length < list.length) console.log(`    …and ${list.length - show.length} more (every one unverified for the same reason)`);
  }

  const safe = rows.filter((r) => r.bucket === 'safe').length;
  console.log(`\nSAFE (${safe}) — 0 local-only commits, each verified against its live remote(s). Not listed.`);

  if (counts['at-risk'] || counts['no-remote']) {
    console.log('');
    console.log(`${counts['at-risk']} repositor(ies) hold work no remote has, and ${counts['no-remote']} can reach no remote at all.`);
  }
  return check && (counts['at-risk'] || counts['no-remote']) ? 1 : 0;
}

if (require.main === module) process.exit(main());

module.exports = { inspect, decide, classifyRemotes, localOnlyCount, verifyTracking,
  assertDisjoint, children, BUCKETS, HELD, DEFAULT_ROOT };
