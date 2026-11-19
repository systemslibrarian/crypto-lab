#!/usr/bin/env node
/**
 * unpushed-census.js — is any finished work sitting in a clone and nowhere else?
 *
 * Run: node tools/unpushed-census.js check
 * Prevents: a finished lab living only on this machine, where no deploy, no backup and no other clone can see it
 * Reads: every directory beside this repository that is a git work tree, each one's `git status --porcelain=v2 --branch` and remote configuration, and with --fetch its remotes over the network
 *
 * This checker exists because that happened. crypto-lab-cold-boot and
 * crypto-lab-pseudorandom-code were both finished on 17 November 2026 -- tests
 * green, brief satisfied, mutation ledger closed -- and both sat unpushed for a
 * day. Nothing was broken and nothing reported it, because nothing was asking.
 * cold-boot had a remote whose branch had been deleted, so its clone read
 * `[origin/main: gone]`; pseudorandom-code had NO REMOTE AT ALL, so the usual
 * `git pull` and `git push` in a sweep both failed on it in a way easy to read
 * as "already up to date". Neither state is visible from `git log`, and neither
 * is visible from the catalog: a lab with no card and no push looks exactly
 * like a lab that was never started.
 *
 * The question is deliberately crude and therefore hard to get wrong: for every
 * git work tree beside this one, does anything exist here that exists nowhere
 * else? Six ways that can be true, each reported by name:
 *
 *   NO REMOTE          no remote configured, so nothing here has ever left
 *   EMPTY REMOTE       a remote with zero refs -- created and never pushed to,
 *                      or emptied since (--fetch only; it needs the network)
 *   NO UPSTREAM        a branch tracking nothing, so ahead/behind is unanswerable
 *                      and `git pull` fails rather than reporting a state
 *   UPSTREAM GONE      tracking a remote branch that no longer exists
 *   AHEAD              commits here that the upstream does not have
 *   DIRTY              uncommitted changes, which no push would carry anyway
 *
 * EVERY COMMIT FINDING CARRIES THE ONE NUMBER THAT MATTERS: how many commits
 * are reachable from HEAD and from NO remote-tracking ref -- `rev-list --count
 * HEAD --not --remotes`. Without it this checker is unusable here. A finished
 * round deletes its lane branches, so 34 of the 406 work trees on this machine
 * track a branch that is legitimately gone, and every one of them would read as
 * a finding as loud as cold-boot's. The distinction is not the upstream's state
 * at all: it is whether anything is only here. A gone upstream over a fully
 * merged branch is bookkeeping; a gone upstream over three unmerged commits is
 * the incident. Both are reported, and the number separates them, so the count
 * is reported FIRST and the findings with a zero count are grouped last.
 *
 * LINKED WORKTREES ARE REPORTED APART, because two of these questions have a
 * different answer there. A detached HEAD is how a worktree is normally pinned
 * to a commit under review, not a lost branch; and a worktree's objects live in
 * its parent clone, so deleting the directory loses no commit. Its uncommitted
 * changes and its unique commits are still only on this machine, so they are
 * still reported -- under their own heading, after the standalone clones, which
 * is where the failure this exists to catch actually happens.
 *
 * READ-ONLY BY CONSTRUCTION. It issues no command that writes to a work tree,
 * an index, or a remote: status, config and rev-parse reads, plus `git fetch`
 * under --fetch, which writes only remote-tracking refs. A guard against losing
 * work must not be able to cause it. In particular it never fetches by default,
 * so the common case touches no network and cannot hang.
 *
 * --fetch IS THE DIFFERENCE BETWEEN TWO INDISTINGUISHABLE STATES. Without it
 * the remote-tracking refs are whatever the last fetch left, so a branch
 * deleted on the remote still reads as present and a repository whose remote
 * was deleted and re-created empty still reads as fully pushed. That is exactly
 * cold-boot's `[origin/main: gone]`, which only appeared once something
 * fetched. The slower mode is the honest one; the default is the fast one.
 *
 * IT IS ALSO THE DIFFERENCE BETWEEN A FINISHED LANE AND LOST WORK, and that is
 * the harder half. The hub lands lanes with
 * `gh pr merge --squash --delete-branch`. A squash writes a NEW commit on main
 * carrying the lane's tree, so NONE of the lane's own commits is an ancestor of
 * anything on any remote-tracking ref -- delete the branch, prune, and
 * `--not --remotes` counts every one of them. Measured on git 2.54: a
 * two-commit lane, squash-merged and pruned, counts 2. So the obvious reading
 * of this checker's own central number is wrong for the most common thing on
 * this machine, and a control built with a merge commit (which counts 0) passes
 * while it is wrong.
 *
 * What recovers the truth is `refs/pull/<n>/head`: GitHub keeps it after the
 * branch is deleted, so the lane's tip is still named by something on the
 * remote. `prHeadsFor` reads them with ls-remote -- a read, nothing fetched or
 * written -- keeps only the shas whose objects are actually here, and
 * `uniqueCommits` passes them after `--not`. The same fixture then counts 0,
 * and 1 once a further commit is made on top, which is the control that stops
 * this excluding real work. `git merge-tree` was NOT used as the oracle: it
 * reports a conflict as soon as main re-edits the same lines, which for the
 * generated files in this repository is every lane.
 *
 * So a count is either ESTABLISHED or UNVERIFIED, and the distinction is which
 * question the finding rests on. NO REMOTE, EMPTY REMOTE, AHEAD (measured
 * against an upstream that still exists) and DIRTY stand on their own. NO
 * UPSTREAM, UPSTREAM GONE and DETACHED HEAD are exactly the shapes a squashed
 * landing leaves, so without the PR heads they are reported with their count
 * marked unverified and do NOT fail the run. Only established counts do.
 *
 * THREE STATES, NOT TWO, as everywhere else here. A work tree that cannot be
 * read has not been asked, which is neither a pass nor a finding. It is
 * reported by name under NOT ASKED and fails the run, because an unanswered
 * question must never read as a clean one.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFile, execFileSync } = require('child_process');

/* Overridable so the controls can run against a FIXTURE tree instead of the
   real ~/repos, which is shared mutable state no test should depend on. */
const ROOT = process.env.CRYPTO_LAB_REPOS_ROOT
  || path.join(__dirname.replace(/\/tools$/, ''), '..');

const FETCH_CONCURRENCY = 12;
const FETCH_TIMEOUT_MS = 60000;

/* A git read that fails is reported as a failure, never as an answer. Callers
   distinguish "git said no" from "git said nothing" because a missing upstream
   and an unreadable work tree are different findings. */
function git(dir, args) {
  try {
    return {
      ok: true,
      out: execFileSync('git', ['-C', dir, ...args],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(),
    };
  } catch (e) {
    return { ok: false, out: '', err: String((e && e.stderr) || e).trim().slice(0, 200) };
  }
}

function isWorkTree(dir) {
  // A .git FILE is a worktree or submodule and counts; a bare repo has no work
  // tree and no uncommitted state, so it is not what this asks about.
  if (!fs.existsSync(path.join(dir, '.git'))) return false;
  const r = git(dir, ['rev-parse', '--is-inside-work-tree']);
  return r.ok && r.out === 'true';
}

// A linked worktree keeps a .git FILE pointing into its parent's object store;
// a standalone clone keeps a directory. The two answer DETACHED HEAD and "could
// this be lost" differently, so the distinction is carried through to the report.
function isLinkedWorktree(dir) {
  try { return fs.statSync(path.join(dir, '.git')).isFile(); } catch { return false; }
}

/* The question this whole checker is asking, in one command: how many commits
   are reachable from HEAD and from no remote-tracking ref at all. Not "ahead of
   upstream" -- a branch whose upstream is gone has no upstream to be ahead of.
   `--not --remotes` asks against EVERY remote-tracking ref, which is the only
   form that answers "is this only here". An unborn branch has no HEAD to walk
   and is reported as 0, not as an error.

   `extraExcludes` is how a SQUASHED merge stops reading as unpushed work, and
   without it this checker is wrong about the way this fleet actually lands
   lanes. `gh pr merge --squash --delete-branch` writes a NEW commit on main
   holding the lane's tree, so the lane's own commits are not ancestors of
   anything on any remote-tracking ref; delete the branch, prune, and
   `--not --remotes` counts every one of them. Measured on git 2.54 against a
   real repository: a two-commit lane, squash-merged and pruned, counts 2.
   Merge-commit and fast-forward landings both count 0, which is why a control
   built on either passes for a merge this fleet does not use -- the first
   version of the test below did exactly that.

   The excludes come from `refs/pull/<n>/head`, which GitHub keeps after the
   branch is gone, so the lane's tip is still named by something on the remote.
   Same fixture: 0 with the PR head excluded, and 1 once a further commit is
   made on top of it, which is the control that stops this from excluding real
   work. Do NOT reach for `git merge-tree` as the oracle instead: it reports a
   conflict as soon as main re-edits the same lines, which for the generated
   files in this repository is every lane. */
function uniqueCommits(dir, extraExcludes) {
  const ex = extraExcludes || [];
  if (!ex.length) {
    const r = git(dir, ['rev-list', '--count', 'HEAD', '--not', '--remotes']);
    if (!r.ok) return null;
    const n = Number(r.out);
    return Number.isInteger(n) ? n : null;
  }
  // Via --stdin, and each sha needs its own `^`: revs read from stdin are ADDED
  // to the walk, not negated, so passing them bare counts MORE rather than
  // fewer. That was the first mistake made here and it reads as a no-op.
  const r = gitStdin(dir, ['rev-list', '--count', '--stdin', 'HEAD', '--not', '--remotes'],
    ex.map((s) => `^${s}`).join('\n') + '\n');
  if (!r.ok) return null;
  const n = Number(r.out);
  return Number.isInteger(n) ? n : null;
}

function gitStdin(dir, args, input) {
  try {
    return {
      ok: true,
      out: execFileSync('git', ['-C', dir, ...args],
        { encoding: 'utf8', input, stdio: ['pipe', 'pipe', 'pipe'] }).trim(),
    };
  } catch (e) {
    return { ok: false, out: '', err: String((e && e.stderr) || e).trim().slice(0, 200) };
  }
}

function workTrees(root) {
  let names;
  try {
    names = fs.readdirSync(root, { withFileTypes: true })
      .filter((d) => d.isDirectory() || d.isSymbolicLink())
      .map((d) => d.name)
      .sort();
  } catch (e) {
    return { dirs: [], unreadableRoot: String(e.message || e) };
  }
  const dirs = [];
  for (const n of names) {
    const full = path.join(root, n);
    try {
      if (isWorkTree(full)) dirs.push(full);
    } catch { /* not a work tree, or unreadable -- examine() reports the latter */ }
  }
  return { dirs, unreadableRoot: null };
}

/* `status --porcelain=v2 --branch` is the only form that separates the three
   upstream states. `# branch.upstream` is absent when nothing is tracked;
   present WITHOUT a `# branch.ab` line when the tracked ref no longer exists
   -- which is the [gone] that `git status -sb` prints and that a plain
   rev-list cannot ask about, because it errors identically for both. */
function parseStatus(text) {
  const st = { branch: null, upstream: null, ahead: null, behind: null, dirty: 0, oid: null };
  for (const line of text.split('\n')) {
    if (line.startsWith('# branch.head ')) st.branch = line.slice(14).trim();
    else if (line.startsWith('# branch.upstream ')) st.upstream = line.slice(18).trim();
    else if (line.startsWith('# branch.oid ')) st.oid = line.slice(13).trim();
    else if (line.startsWith('# branch.ab ')) {
      const m = line.slice(12).trim().match(/^\+(\d+)\s+-(\d+)$/);
      if (m) { st.ahead = Number(m[1]); st.behind = Number(m[2]); }
    } else if (line && !line.startsWith('#')) st.dirty += 1;
  }
  return st;
}

function remotesOf(dir) {
  const r = git(dir, ['remote']);
  if (!r.ok) return null;
  return r.out ? r.out.split('\n').map((s) => s.trim()).filter(Boolean) : [];
}

function examine(dir, lsRemote) {
  const slug = path.basename(dir);
  const s = git(dir, ['status', '--porcelain=v2', '--branch']);
  if (!s.ok) return { slug, unreadable: s.err || 'git status failed' };

  const st = parseStatus(s.out);
  const remotes = remotesOf(dir);
  if (remotes === null) return { slug, unreadable: 'git remote failed' };

  const linked = isLinkedWorktree(dir);

  /* Three states for the PR heads, and they are not interchangeable:
       heads   - the remote was asked and these are the ones we hold
       null    - nobody asked (no --fetch), so a squashed lane cannot be ruled out
       'unread'- we asked and could not be told, which is NOT ASKED, never 0 */
  const lr = lsRemote && lsRemote.has(dir) ? lsRemote.get(dir) : null;
  let prHeads = null;
  if (lr && lr.pr) prHeads = lr.pr.ok ? lr.pr.heads : 'unread';
  if (prHeads === 'unread') {
    return { slug, unreadable: `refs/pull/*/head unreadable: ${(lr.pr && lr.pr.err) || 'ls-remote failed'}` };
  }

  const only = uniqueCommits(dir, prHeads || []);
  // A count that cannot be read is not 0. It is the one number this checker
  // turns on, so an unreadable one makes the whole work tree unanswered.
  if (only === null) return { slug, unreadable: 'rev-list --not --remotes failed' };
  /* A work tree with NO remote needs no PR heads: there is no remote to hold
     one, so nothing can have absorbed its commits and the count is established
     whether or not --fetch ran. Without this the actual incident
     (crypto-lab-pseudorandom-code, no remote at all) printed "re-run with
     --fetch" during a --fetch run, telling the reader to go and do the thing
     they had just done. */
  const asked = prHeads !== null || remotes.length === 0;
  /* Two different reasons a count can be unverified, and telling a reader to
     re-run with --fetch when --fetch is what just failed is the kind of advice
     that wastes an afternoon. `lsRemote` non-null means this run DID ask. */
  const why = lsRemote ? ' (the remote could not be asked, so this is unverified)'
    : ' (squashed lanes not excluded; re-run with --fetch)';
  const onlyHere = only > 0
    ? `${only} commit(s) on no remote${asked ? '' : why}`
    : 'nothing unique here';

  /* `firm` says whether this finding's count stands WITHOUT having asked the
     remote for its PR heads. It is not a confidence score; it is a statement
     about which question each kind actually asks:

       NO REMOTE / EMPTY REMOTE   firm. There is no remote, or it holds nothing,
                                  so there are no PR heads to exclude and
                                  everything here is only here.
       AHEAD                      firm. Measured against an upstream that still
                                  EXISTS, so those commits are genuinely not on
                                  it; no squash can have absorbed them.
       NO UPSTREAM / GONE /       needs the PR heads. These are exactly the
       DETACHED HEAD              shapes a squash-merged, branch-deleted lane
                                  leaves behind, so without asking we cannot
                                  tell a finished lane from unpushed work.
       DIRTY                      firm. Not a commit count at all.

     Only firm findings fail the run. An unfirm one is reported and says to
     re-run with --fetch, because reporting a finished lane as an incident is
     how a checker stops being read -- and claiming it is clean would be the
     silence this whole tool exists to end. */
  const findings = [];
  // Reported first because it subsumes every other remote question: with no
  // remote, "ahead" has no meaning and nothing here has ever left this disk.
  if (remotes.length === 0) {
    findings.push({ kind: 'NO REMOTE', detail: `no remote configured; ${onlyHere}`, only, firm: true });
  }

  if (lr) {
    if (lr.ok && lr.refs === 0) {
      findings.push({ kind: 'EMPTY REMOTE', detail: `${lr.remote} has zero refs; ${onlyHere}`, only, firm: true });
    } else if (!lr.ok) {
      // git's errors are multi-line, and a newline inside a row destroys the
      // one-finding-per-line layout the rest of this output relies on.
      const err = String(lr.err || 'unreadable').replace(/\s+/g, ' ').trim().slice(0, 120);
      findings.push({ kind: 'REMOTE UNREADABLE', detail: `${lr.remote}: ${err}`, only, firm: true });
    }
  }

  const detached = st.branch === '(detached)';
  if (!detached && st.branch && remotes.length > 0) {
    if (!st.upstream) {
      findings.push({ kind: 'NO UPSTREAM', detail: `${st.branch} tracks nothing; ${onlyHere}`, only, firm: asked });
    } else if (st.ahead === null) {
      findings.push({ kind: 'UPSTREAM GONE', detail: `${st.branch} tracks ${st.upstream}, which no longer exists; ${onlyHere}`, only, firm: asked });
    } else if (st.ahead > 0) {
      /* Ahead of its upstream and yet nothing unique: the commits are not on
         `main` but ARE reachable from a refs/pull/<n>/head, so they are on
         GitHub in an open or closed pull request. Unmerged, not unsaved -- two
         different problems, and this tool is about the second. Saying both in
         one line is what stops the tier placement reading as a contradiction. */
      findings.push({ kind: 'AHEAD', detail: `${st.ahead} commit(s) not on ${st.upstream}; ${onlyHere}`, only, firm: true });
    }
  }
  // Only for a standalone clone: a detached HEAD is the normal way to pin a
  // linked worktree, and reporting it there would bury the real findings.
  if (detached && !linked) {
    findings.push({ kind: 'DETACHED HEAD', detail: `at ${(st.oid || '').slice(0, 8)}, on no branch; ${onlyHere}`, only, firm: asked });
  }
  if (st.dirty > 0) findings.push({ kind: 'DIRTY', detail: `${st.dirty} uncommitted path(s)`, only, firm: true });

  return { slug, findings, linked, only, branch: st.branch, upstream: st.upstream, behind: st.behind };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function run(dir, args, timeout) {
  return new Promise((resolve) => {
    execFile('git', ['-C', dir, ...args], { encoding: 'utf8', timeout },
      (err, stdout, stderr) => {
        if (err) resolve({ ok: false, out: '', err: String(stderr || err.message).trim().slice(0, 200) });
        else resolve({ ok: true, out: String(stdout).trim() });
      });
  });
}

/* Bounded pool: ~470 sequential network fetches is minutes of wall clock, and
   an unbounded fan-out over that many is worse than slow. The directories are
   passed through a closure rather than an argv template, for the reason
   remote-heads.js records at length. */
async function pool(items, width, worker) {
  const out = new Map();
  let next = 0;
  const lanes = Array.from({ length: Math.min(width, items.length) }, async () => {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      out.set(items[i], await worker(items[i]));
    }
  });
  await Promise.all(lanes);
  return out;
}

/* The PR heads this remote still names, narrowed to the ones whose objects are
   actually HERE. A sha the local database does not have cannot exclude
   anything, and handing rev-list an unknown object makes it exit non-zero --
   which would turn every work tree into NOT ASKED. READ-ONLY: ls-remote asks,
   and nothing is fetched or written. */
async function prHeadsFor(dir, remote) {
  const ls = await run(dir, ['ls-remote', remote, 'refs/pull/*/head'], FETCH_TIMEOUT_MS);
  if (!ls.ok) return { ok: false, err: ls.err };
  const shas = ls.out.split('\n').map((l) => (l.split('\t')[0] || '').trim())
    .filter((s) => /^[0-9a-f]{40}$/.test(s));
  const here = shas.filter((s) => git(dir, ['cat-file', '-e', `${s}^{commit}`]).ok);
  return { ok: true, heads: here, offered: shas.length };
}

async function fetchAll(dirs) {
  return pool(dirs, FETCH_CONCURRENCY, async (dir) => {
    const remotes = remotesOf(dir);
    if (!remotes || remotes.length === 0) return { ok: true, refs: null, remote: null, skipped: true };
    const remote = remotes.includes('origin') ? 'origin' : remotes[0];
    // --prune is what makes a deleted branch show as [gone] rather than
    // lingering as a stale remote-tracking ref that reads as fully pushed.
    let f = await run(dir, ['fetch', '--prune', '--quiet', remote], FETCH_TIMEOUT_MS);
    if (!f.ok) { await sleep(1500); f = await run(dir, ['fetch', '--prune', '--quiet', remote], FETCH_TIMEOUT_MS); }
    if (!f.ok) return { ok: false, refs: null, remote, err: f.err };
    const pr = await prHeadsFor(dir, remote);
    const ls = await run(dir, ['ls-remote', '--heads', remote], FETCH_TIMEOUT_MS);
    if (!ls.ok) return { ok: false, refs: null, remote, err: ls.err, pr };
    return { ok: true, remote, refs: ls.out ? ls.out.split('\n').filter(Boolean).length : 0, pr };
  });
}

async function census({ fetch = false } = {}) {
  const { dirs, unreadableRoot } = workTrees(ROOT);
  if (unreadableRoot) return { unreadableRoot, rows: [], unreadable: [], dirs: [] };
  const lsRemote = fetch ? await fetchAll(dirs) : null;
  const rows = [];
  const unreadable = [];
  for (const d of dirs) {
    const r = examine(d, lsRemote);
    if (r.unreadable) unreadable.push(r);
    else rows.push(r);
  }
  return { rows, unreadable, dirs, unreadableRoot: null };
}

const ORDER = ['NO REMOTE', 'EMPTY REMOTE', 'REMOTE UNREADABLE', 'NO UPSTREAM',
  'UPSTREAM GONE', 'AHEAD', 'DETACHED HEAD', 'DIRTY'];

async function main() {
  const argv = process.argv.slice(2);
  const fetch = argv.includes('--fetch');
  const mode = argv.find((a) => !a.startsWith('-')) || 'check';

  const { rows, unreadable, dirs, unreadableRoot } = await census({ fetch });
  if (unreadableRoot) {
    console.error(`::error::cannot read ${ROOT}: ${unreadableRoot}`);
    return 1;
  }

  const flagged = rows.filter((r) => r.findings.length > 0);
  const carrying = rows.filter((r) => r.only > 0);
  const firmCarrying = rows.filter((r) => r.findings.some((f) => f.only > 0 && f.firm));
  console.log(`Work trees beside this repository: ${dirs.length}. `
    + `${rows.length - flagged.length} hold nothing that is only here.`);
  console.log(`Holding commits that are on no remote: ${firmCarrying.length} established`
    + `${carrying.length - firmCarrying.length > 0 ? `, ${carrying.length - firmCarrying.length} unverified` : ''}.`);
  if (!fetch) {
    console.log('Remote-tracking refs are as the last fetch left them: a deleted or re-created');
    console.log('remote reads as fully pushed until you re-run with --fetch. The PR heads that');
    console.log('tell a squash-merged lane from unpushed work are not asked for either, so a');
    console.log('gone upstream reports its count as unverified rather than as a finding.');
  }

  // Two passes over the same findings: the standalone clones, where the failure
  // this exists to catch happens, then the linked worktrees. Within each, the
  // findings carrying unique commits come first -- that is the whole signal.
  function report(group, heading, note) {
    const hits = group.filter((r) => r.findings.length > 0);
    if (!hits.length) return;
    console.log(`\n=== ${heading} (${hits.length}) ===`);
    if (note) console.log(note);
    // Three tiers, loudest first: established unique commits, counts we could
    // not verify without asking the remote, then everything with nothing unique.
    const TIERS = [
      ['firm', '\n-- commits that exist on no remote --'],
      ['unverified', '\n-- unverified: a squash-merged lane looks like this too; re-run with --fetch --'],
      ['none', '\n-- nothing unique here; state worth tidying, not work at risk --'],
    ];
    for (const [tier, heading] of TIERS) {
      const byKind = new Map();
      for (const r of hits) {
        for (const f of r.findings) {
          const t = f.only > 0 ? (f.firm ? 'firm' : 'unverified') : 'none';
          if (t !== tier) continue;
          if (!byKind.has(f.kind)) byKind.set(f.kind, []);
          byKind.get(f.kind).push({ slug: r.slug, detail: f.detail });
        }
      }
      if (!byKind.size) continue;
      console.log(heading);
      for (const kind of ORDER) {
        const k = byKind.get(kind);
        if (!k || !k.length) continue;
        console.log(`\n${kind} (${k.length})`);
        for (const h of k) console.log(`  ${h.slug.padEnd(40)} ${h.detail}`);
      }
    }
  }

  report(rows.filter((r) => !r.linked), 'CLONES');
  report(rows.filter((r) => r.linked), 'LINKED WORKTREES',
    'Objects live in the parent clone, and a detached HEAD here is normal.');

  if (unreadable.length) {
    console.error(`\nNOT ASKED (${unreadable.length}) — the question could not be put to these work trees.`);
    console.error('Not a finding about them, and not a pass either.');
    for (const u of unreadable) console.error(`  ${u.slug.padEnd(40)} ${u.unreadable}`);
  }

  if (mode !== 'check') return 0;
  // Only ESTABLISHED unique commits and unreadable work trees fail the run. A
  // tidy-up state alone must not, or this is red every day and stops being
  // read -- and neither must an unverified count, which on this machine is
  // mostly finished lanes that were squash-merged and pruned. Run --fetch for
  // the authoritative answer; that is the mode that can tell them apart.
  return firmCarrying.length || unreadable.length ? 1 : 0;
}

if (require.main === module) {
  main().then((code) => process.exit(code)).catch((e) => {
    console.error(`::error::unpushed-census failed: ${(e && e.stack) || e}`);
    process.exit(1);
  });
}
module.exports = { census, examine, parseStatus, workTrees };
