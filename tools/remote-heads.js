/* remote-heads.js — ask a set of checkouts what their remote HEAD is, with a
 * bounded pool and a retry.
 *
 * Not runnable. Required by catalog-evidence.js, which calls it through one
 * child process so its own remoteHeadsOf can stay synchronous.
 *
 * WHY THIS EXISTS, and not a shell pipeline.
 *
 * This replaced:
 *
 *   xargs -P 12 -I{} sh -c 'sha=$(git -C "{}" ls-remote origin HEAD ...)'
 *
 * which is correct in CI and silently wrong anywhere the checkout paths are
 * long. BSD xargs caps the assembled command at -S bytes (255 by default), and
 * `-I{}` substitutes the replacement three times in that template. With the
 * 64-character paths a GitHub runner uses it fits; with a 140-character path it
 * does not, and xargs exits with
 *
 *   xargs: command line cannot be assembled, too long
 *
 * printing nothing at all. remoteHeadsOf then returned an empty map, every
 * clone's remote read as unreadable, and `verify` reported UNREADABLE for all
 * 252 labs -- a total failure that looked like a fleet-wide finding. Measured
 * 2026-11-10: the same directory list succeeds with -S 4096 and fails without
 * it, and a short path succeeds either way.
 *
 * Passing the directories as argv-free stdin and doing the fan-out here removes
 * the whole class: no template, no replacement limit, no quoting.
 *
 * FAIL-CLOSED. A head that cannot be read after its retries is reported as the
 * empty string, which the caller stores as null and treats as UNREADABLE. That
 * is deliberate and unchanged: a remote this cannot reach must never read as
 * "same as local".
 */
'use strict';
const { spawn } = require('child_process');

const DEFAULT_CONCURRENCY = 16;
const DEFAULT_ATTEMPTS = 3;

function envInt(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || String(raw).trim() === '') return fallback;
  const n = Number(raw);
  // A malformed override must not silently become 0 or NaN concurrency.
  if (!Number.isInteger(n) || n < 1) return fallback;
  return n;
}

function lsRemoteOnce(dir) {
  return new Promise((resolve) => {
    const child = spawn('git', ['-C', dir, 'ls-remote', 'origin', 'HEAD'],
                        { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (b) => { out += b; });
    child.stderr.on('data', (b) => { err += b; });
    child.on('error', () => resolve({ sha: null, err: 'spawn failed' }));
    child.on('close', (code) => {
      const first = out.split('\n')[0] || '';
      const sha = (first.split('\t')[0] || '').trim();
      if (code === 0 && /^[0-9a-f]{40}$/.test(sha)) resolve({ sha, err: '' });
      else resolve({ sha: null, err: err.trim().slice(0, 200) || `exit ${code}` });
    });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function headFor(dir, attempts) {
  let last = '';
  for (let i = 0; i < attempts; i++) {
    const { sha, err } = await lsRemoteOnce(dir);
    if (sha) return { sha, attempts: i + 1, err: '' };
    last = err;
    // Backoff only between attempts, never after the last one.
    if (i + 1 < attempts) await sleep(200 * 2 ** i);
  }
  return { sha: null, attempts, err: last };
}

async function remoteHeads(dirs, opts = {}) {
  const concurrency = Math.max(1, opts.concurrency || envInt('FLEET_LS_REMOTE_CONCURRENCY', DEFAULT_CONCURRENCY));
  const attempts = Math.max(1, opts.attempts || envInt('FLEET_LS_REMOTE_ATTEMPTS', DEFAULT_ATTEMPTS));
  const out = new Map();
  let next = 0;
  const worker = async () => {
    for (;;) {
      const i = next++;
      if (i >= dirs.length) return;
      const dir = dirs[i];
      const r = await headFor(dir, attempts);
      out.set(dir, r.sha);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, dirs.length) }, worker));
  return out;
}

module.exports = { remoteHeads, envInt, DEFAULT_CONCURRENCY, DEFAULT_ATTEMPTS };

if (require.main === module) {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (d) => { input += d; });
  process.stdin.on('end', async () => {
    const dirs = input.split('\n').map((s) => s.trim()).filter(Boolean);
    const heads = await remoteHeads(dirs);
    let text = '';
    for (const dir of dirs) text += `${dir}\t${heads.get(dir) || ''}\n`;
    process.stdout.write(text);
  });
}
